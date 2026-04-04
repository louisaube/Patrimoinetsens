"""
Étape 7 : Extraction des blasons d'Hozier — Section Sens (1696).

Pipeline :
1. Télécharge les 22 pages de la section Sens (pages 36-58) via IIIF
2. Envoie chaque page à un modèle de vision (Claude/GPT-4o/Qwen3-VL)
3. Pour chaque blason détecté : nom, description héraldique, coordonnées de crop
4. Croppe chaque blason individuellement via IIIF
5. Génère l'annuaire héraldique JSON + images

Volume : Français 32252 — Paris, partie III
ARK : bpt6k111473g
Section Sens : pages 36 à 58 (~110 blasons)

Usage:
    python 7_hozier_blasons.py --fetch           # Télécharge les 22 pages
    python 7_hozier_blasons.py --detect           # Vision AI -> détection blasons
    python 7_hozier_blasons.py --crop             # Croppe chaque blason via IIIF
    python 7_hozier_blasons.py --annuaire         # Génère l'annuaire final
    python 7_hozier_blasons.py --all              # Tout d'un coup

Prérequis:
    ANTHROPIC_API_KEY dans .env (pour Claude vision)
    pip install httpx anthropic Pillow
"""

import argparse
import base64
import json
import os
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv()

# Configuration Hozier section Sens
HOZIER_ARK = "bpt6k111473g"
SENS_PAGES_START = 36
SENS_PAGES_END = 58
IIIF_BASE = f"https://gallica.bnf.fr/iiif/ark:/12148/{HOZIER_ARK}"

# Résolution pour l'analyse (1024px de large suffit pour la vision AI)
ANALYSIS_WIDTH = 1024
# Résolution pour le crop final des blasons (haute qualité)
CROP_WIDTH = 800


def fetch_pages(output_dir: Path) -> list[Path]:
    """Télécharge les pages de la section Sens via IIIF."""
    pages_dir = output_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    downloaded = []
    total = SENS_PAGES_END - SENS_PAGES_START + 1

    for i, page_num in enumerate(range(SENS_PAGES_START, SENS_PAGES_END + 1), 1):
        output_path = pages_dir / f"hozier_sens_p{page_num:03d}.jpg"

        if output_path.exists():
            print(f"  [{i}/{total}] Déjà téléchargé: p{page_num}")
            downloaded.append(output_path)
            continue

        url = f"{IIIF_BASE}/f{page_num}/full/{ANALYSIS_WIDTH},/0/native.jpg"
        print(f"  [{i}/{total}] Téléchargement p{page_num}...")

        response = httpx.get(url, follow_redirects=True, timeout=30)
        response.raise_for_status()
        output_path.write_bytes(response.content)
        downloaded.append(output_path)

        time.sleep(1)  # politesse Gallica

    print(f"\n{len(downloaded)} pages téléchargées dans {pages_dir}")
    return downloaded


def detect_blasons_on_page(image_path: Path, page_num: int) -> list[dict]:
    """Envoie une page à Mistral Pixtral pour détecter les blasons."""
    from mistralai.client import Mistral

    client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))

    image_data = base64.standard_b64encode(image_path.read_bytes()).decode("utf-8")

    response = client.chat.complete(
        model="pixtral-large-latest",
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{image_data}",
                },
                {
                    "type": "text",
                    "text": """Analyse cette page de l'Armorial d'Hozier (1696).

Pour CHAQUE blason peint visible sur la page, donne en JSON :
{
  "blasons": [
    {
      "position": 1,
      "nom": "Nom complet de la personne ou institution",
      "titre": "Titre/fonction (chanoine, seigneur, etc.)",
      "lieu": "Lieu associé (Sens, etc.)",
      "description_heraldique": "Description du blason en langage héraldique (d'azur au..., etc.)",
      "couleurs": ["bleu", "or", "rouge"],
      "bbox_pct": {"x": 0.05, "y": 0.05, "w": 0.15, "h": 0.15}
    }
  ]
}

Pour bbox_pct, donne la position du blason en pourcentage de la page (0.0 à 1.0).
Sois PRÉCIS sur la description héraldique. Utilise le vocabulaire correct (gueules, azur, sinople, sable, or, argent, etc.).
Réponds UNIQUEMENT en JSON valide.""",
                },
            ],
        }],
    )

    text = response.choices[0].message.content
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0]
    elif "```" in text:
        text = text.split("```")[1].split("```")[0]

    result = json.loads(text.strip())

    # Ajouter le numéro de page
    for blason in result.get("blasons", []):
        blason["page"] = page_num
        blason["source"] = f"Armorial d'Hozier, 1696, ms. Fr. 32252, p.{page_num}"

    return result.get("blasons", [])


def crop_blason_local(blason: dict, pages_dir: Path, output_dir: Path) -> Path | None:
    """Croppe un blason depuis les pages locales avec Pillow."""
    from PIL import Image

    bbox = blason.get("bbox_pct")
    if not bbox:
        return None

    page_num = blason["page"]
    safe_name = blason["nom"].replace(" ", "_").replace("'", "")[:40]
    output_path = output_dir / f"blason_{page_num:03d}_{blason['position']:02d}_{safe_name}.jpg"

    if output_path.exists():
        return output_path

    # Trouver la page locale (format: hozier_sens_p36.jpg ou hozier_sens_p036.jpg)
    page_path = pages_dir / f"hozier_sens_p{page_num:03d}.jpg"
    if not page_path.exists():
        page_path = pages_dir / f"hozier_sens_p{page_num}.jpg"
    if not page_path.exists():
        print(f"  Page {page_num} introuvable")
        return None

    try:
        img = Image.open(page_path)
        img_w, img_h = img.size

        # bbox_pct en pourcentages -> pixels sur l'image locale
        x = int(bbox["x"] * img_w)
        y = int(bbox["y"] * img_h)
        w = int(bbox["w"] * img_w)
        h = int(bbox["h"] * img_h)

        # Ajouter une marge de 10% pour ne pas rogner trop serré
        margin_x = int(w * 0.1)
        margin_y = int(h * 0.1)
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(img_w, x + w + margin_x)
        y2 = min(img_h, y + h + margin_y)

        cropped = img.crop((x1, y1, x2, y2))
        cropped.save(output_path, "JPEG", quality=90)
        return output_path

    except Exception as e:
        print(f"  Erreur crop {blason['nom']}: {e}")
        return None


def generate_annuaire(all_blasons: list[dict], output_dir: Path) -> Path:
    """Génère l'annuaire héraldique final en JSON."""
    output_path = output_dir / "annuaire_hozier_sens.json"

    # Index par type (personnes vs institutions)
    annuaire = {
        "meta": {
            "source": "Armorial général de France, d'Hozier, 1696",
            "volume": "ms. Français 32252 — Paris, partie III",
            "section": "Élection de Sens / Sénonais",
            "pages": f"{SENS_PAGES_START}-{SENS_PAGES_END}",
            "total_blasons": len(all_blasons),
        },
        "personnes": [],
        "institutions": [],
    }

    institutions_keywords = [
        "communauté", "couvent", "abbaye", "séminaire", "chapitre",
        "bailliage", "présidial", "élection", "ville",
    ]

    for blason in all_blasons:
        nom_lower = blason.get("nom", "").lower()
        is_institution = any(kw in nom_lower for kw in institutions_keywords)

        entry = {
            "nom": blason["nom"],
            "titre": blason.get("titre", ""),
            "lieu": blason.get("lieu", ""),
            "blason": blason.get("description_heraldique", ""),
            "couleurs": blason.get("couleurs", []),
            "source": blason.get("source", ""),
            "image": f"blason_{blason['page']:03d}_{blason['position']:02d}.jpg",
        }

        if is_institution:
            annuaire["institutions"].append(entry)
        else:
            annuaire["personnes"].append(entry)

    # Tri alphabétique
    annuaire["personnes"].sort(key=lambda x: x["nom"])
    annuaire["institutions"].sort(key=lambda x: x["nom"])

    output_path.write_text(
        json.dumps(annuaire, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    n_pers = len(annuaire["personnes"])
    n_inst = len(annuaire["institutions"])
    print(f"Annuaire: {n_pers} personnes, {n_inst} institutions")
    print(f"Sauvé: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Extraction des blasons d'Hozier — Sens")
    parser.add_argument("--fetch", action="store_true", help="Télécharge les pages")
    parser.add_argument("--detect", action="store_true", help="Détecte les blasons (vision AI)")
    parser.add_argument("--crop", action="store_true", help="Croppe les blasons via IIIF")
    parser.add_argument("--annuaire", action="store_true", help="Génère l'annuaire")
    parser.add_argument("--all", action="store_true", help="Toutes les étapes")
    parser.add_argument("--page", type=int, help="Page spécifique (pour tests)")
    args = parser.parse_args()

    output_dir = Path(__file__).parent / "output" / "hozier_sens"
    output_dir.mkdir(parents=True, exist_ok=True)
    blasons_dir = output_dir / "blasons"
    blasons_dir.mkdir(parents=True, exist_ok=True)

    # 1. Fetch
    if args.all or args.fetch:
        fetch_pages(output_dir)

    # 2. Detect
    all_blasons = []
    detections_path = output_dir / "detections.json"

    # Charger les détections existantes pour ne pas refaire les pages déjà traitées
    if detections_path.exists():
        with open(detections_path, encoding="utf-8") as f:
            all_blasons = json.load(f)
        print(f"Détections existantes chargées: {len(all_blasons)} blasons")

    if args.all or args.detect:
        pages_dir = output_dir / "pages"
        pages = sorted(pages_dir.glob("hozier_sens_p*.jpg"))

        if args.page:
            pages = [p for p in pages if p.stem.endswith(f"p{args.page}")]

        # Pages déjà traitées
        done_pages = {b["page"] for b in all_blasons}

        for page_path in pages:
            page_num = int(page_path.stem.split("_p")[1])

            if page_num in done_pages and not args.page:
                print(f"\np{page_num}: déjà traité, skip")
                continue

            print(f"\nAnalyse p{page_num}...")

            # Retry avec backoff pour les rate limits
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    blasons = detect_blasons_on_page(page_path, page_num)
                    all_blasons.extend(blasons)
                    print(f"  {len(blasons)} blasons détectés")

                    for b in blasons:
                        print(f"    - {b['nom']} -- {b.get('description_heraldique', '?')[:60]}...")

                    # Sauvegarder après chaque page (reprise possible)
                    detections_path.write_text(
                        json.dumps(all_blasons, ensure_ascii=False, indent=2),
                        encoding="utf-8",
                    )
                    break  # Succès

                except Exception as e:
                    if "429" in str(e) and attempt < max_retries - 1:
                        wait = 30 * (attempt + 1)
                        print(f"  Rate limited, attente {wait}s...")
                        time.sleep(wait)
                    else:
                        print(f"  ERREUR: {e}")
                        break

            time.sleep(3)  # Pause entre les pages pour éviter le rate limit

        print(f"\nTotal: {len(all_blasons)} blasons détectés -> {detections_path}")

    # Charger les détections existantes si besoin
    if detections_path.exists() and not all_blasons:
        with open(detections_path, encoding="utf-8") as f:
            all_blasons = json.load(f)

    # 3. Crop (local avec Pillow, Gallica bloque le crop IIIF)
    if args.all or args.crop:
        pages_dir = output_dir / "pages"
        print(f"\nCrop local de {len(all_blasons)} blasons...")
        ok_count = 0
        for blason in all_blasons:
            result = crop_blason_local(blason, pages_dir, blasons_dir)
            if result:
                ok_count += 1
                print(f"  OK {blason['nom']}")
        print(f"\n{ok_count}/{len(all_blasons)} blasons croppés")

    # 4. Annuaire
    if args.all or args.annuaire:
        generate_annuaire(all_blasons, output_dir)


if __name__ == "__main__":
    main()
