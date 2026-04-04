"""
Étape 8 : Vérification + re-détection des crops de blasons.

Pipeline :
1. Analyse chaque crop : saturation HSV au centre vs bords
2. Classe en "bon" / "mauvais" (blason absent ou décentré)
3. Re-détecte les pages concernées via Pixtral (prompt amélioré)
4. Re-croppe et re-vérifie

Usage:
    python 8_verify_crops.py --verify          # Vérifie tous les crops
    python 8_verify_crops.py --redetect        # Re-détecte les pages ratées
    python 8_verify_crops.py --recrop          # Re-croppe après re-détection
    python 8_verify_crops.py --all             # Tout d'un coup
"""

import argparse
import base64
import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from PIL import Image
import numpy as np

load_dotenv()

HOZIER_ARK = "bpt6k111473g"
OUTPUT_DIR = Path(__file__).parent / "output" / "hozier_sens"
PAGES_DIR = OUTPUT_DIR / "pages"
BLASONS_DIR = OUTPUT_DIR / "blasons"
DETECTIONS_PATH = OUTPUT_DIR / "detections.json"

# Seuil de saturation HSV (0-255) pour des couleurs héraldiques fortes
# (azur, gueules, sinople, or ont sat > 70 ; le parchemin a sat 30-50)
SATURATION_THRESHOLD = 70
# Fraction minimale de pixels fortement saturés dans la zone centrale
MIN_SATURATED_RATIO = 0.15


def analyze_crop(image_path: Path) -> dict:
    """Analyse un crop : saturation au centre vs bords."""
    img = Image.open(image_path).convert("HSV")
    arr = np.array(img)
    h, w = arr.shape[:2]

    # Zone centrale (40% central)
    margin_y = int(h * 0.3)
    margin_x = int(w * 0.3)
    center = arr[margin_y:h - margin_y, margin_x:w - margin_x, 1]  # canal S

    # Zone bords
    top = arr[:margin_y, :, 1]
    bottom = arr[h - margin_y:, :, 1]

    center_mean = float(np.mean(center))
    center_saturated_ratio = float(np.mean(center > SATURATION_THRESHOLD))
    border_mean = float(np.mean(np.concatenate([top.flatten(), bottom.flatten()])))

    # Heuristique : le crop est bon si le centre a assez de pixels saturés
    is_good = center_saturated_ratio >= MIN_SATURATED_RATIO

    return {
        "file": image_path.name,
        "center_saturation": round(center_mean, 1),
        "center_saturated_ratio": round(center_saturated_ratio, 3),
        "border_saturation": round(border_mean, 1),
        "is_good": is_good,
    }


def verify_all_crops() -> tuple[list[dict], list[dict]]:
    """Vérifie tous les crops et retourne (bons, mauvais)."""
    crops = sorted(BLASONS_DIR.glob("*.jpg"))
    good, bad = [], []

    for crop_path in crops:
        result = analyze_crop(crop_path)
        if result["is_good"]:
            good.append(result)
        else:
            bad.append(result)
        status = "OK" if result["is_good"] else "XX"
        print(f"  {status} {result['file'][:50]:50s}  sat={result['center_saturation']:5.1f}  ratio={result['center_saturated_ratio']:.3f}")

    print(f"\nRésultat : {len(good)} bons, {len(bad)} mauvais sur {len(crops)}")
    return good, bad


def get_bad_pages(bad_crops: list[dict]) -> set[int]:
    """Extrait les numéros de pages des crops ratés."""
    pages = set()
    for crop in bad_crops:
        # blason_046_04_Alain_David_Cch..jpg -> page 46
        parts = crop["file"].split("_")
        pages.add(int(parts[1]))
    return pages


def redetect_page(page_path: Path, page_num: int) -> list[dict]:
    """Re-détecte les blasons sur une page avec un prompt amélioré."""
    from mistralai.client import Mistral

    client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
    image_data = base64.standard_b64encode(page_path.read_bytes()).decode("utf-8")

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

IMPORTANT : chaque page contient des BLASONS PEINTS (écus héraldiques colorés) disposés en COLONNE VERTICALE, généralement sur le côté droit de la page. Chaque blason mesure environ 8-12% de la largeur et 6-10% de la hauteur de la page.

Pour CHAQUE blason peint visible, donne en JSON :
{
  "blasons": [
    {
      "position": 1,
      "nom": "Nom complet de la personne ou institution",
      "titre": "Titre/fonction (chanoine, seigneur, etc.)",
      "lieu": "Lieu associé (Sens, etc.)",
      "description_heraldique": "Description en langage héraldique (d'azur au..., etc.)",
      "couleurs": ["azur", "or"],
      "bbox_pct": {"x": 0.72, "y": 0.08, "w": 0.12, "h": 0.10}
    }
  ]
}

RÈGLES CRITIQUES pour bbox_pct :
- x, y = coin supérieur gauche du BLASON PEINT (l'écu coloré), PAS du texte
- w, h = largeur et hauteur du blason peint uniquement
- Les valeurs sont en pourcentage de la page (0.0 à 1.0)
- Le bbox doit encadrer PRÉCISÉMENT l'écu coloré, pas la zone de texte autour
- Vérifie visuellement que chaque bbox est centré sur le blason peint

Utilise le vocabulaire héraldique correct (gueules, azur, sinople, sable, or, argent).
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

    for blason in result.get("blasons", []):
        blason["page"] = page_num
        blason["source"] = f"Armorial d'Hozier, 1696, ms. Fr. 32252, p.{page_num}"

    return result.get("blasons", [])


def crop_blason_local(blason: dict, pages_dir: Path, output_dir: Path) -> Path | None:
    """Croppe un blason depuis les pages locales avec Pillow."""
    bbox = blason.get("bbox_pct")
    if not bbox:
        return None

    page_num = blason["page"]
    safe_name = blason["nom"].replace(" ", "_").replace("'", "")[:40]
    output_path = output_dir / f"blason_{page_num:03d}_{blason['position']:02d}_{safe_name}.jpg"

    page_path = pages_dir / f"hozier_sens_p{page_num:03d}.jpg"
    if not page_path.exists():
        page_path = pages_dir / f"hozier_sens_p{page_num}.jpg"
    if not page_path.exists():
        return None

    try:
        img = Image.open(page_path)
        img_w, img_h = img.size

        x = int(bbox["x"] * img_w)
        y = int(bbox["y"] * img_h)
        w = int(bbox["w"] * img_w)
        h = int(bbox["h"] * img_h)

        # Marge de 5% (moins que avant, bbox devrait être plus précis)
        margin_x = int(w * 0.05)
        margin_y = int(h * 0.05)
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


def main():
    parser = argparse.ArgumentParser(description="Vérification et re-détection des blasons")
    parser.add_argument("--verify", action="store_true", help="Vérifie la qualité des crops")
    parser.add_argument("--redetect", action="store_true", help="Re-détecte les pages ratées")
    parser.add_argument("--recrop", action="store_true", help="Re-croppe après re-détection")
    parser.add_argument("--all", action="store_true", help="Toutes les étapes")
    args = parser.parse_args()

    # 1. Vérification
    bad_crops = []
    if args.all or args.verify:
        print("=== Verification des crops ===\n")
        good, bad_crops = verify_all_crops()

        # Sauvegarder le rapport
        report = {"good": good, "bad": bad_crops}
        report_path = OUTPUT_DIR / "crop_quality_report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nRapport sauvé : {report_path}")

    # Charger le rapport si on ne vient pas de le générer
    report_path = OUTPUT_DIR / "crop_quality_report.json"
    if not bad_crops and report_path.exists():
        with open(report_path, encoding="utf-8") as f:
            report = json.load(f)
            bad_crops = report.get("bad", [])

    # 2. Re-détection
    if args.all or args.redetect:
        bad_pages = get_bad_pages(bad_crops)
        if not bad_pages:
            print("\nAucune page à re-détecter.")
            return

        print(f"\n=== Re-détection de {len(bad_pages)} pages : {sorted(bad_pages)} ===\n")

        # Charger les détections existantes
        with open(DETECTIONS_PATH, encoding="utf-8") as f:
            all_blasons = json.load(f)

        # Retirer les blasons des pages à re-détecter
        all_blasons = [b for b in all_blasons if b["page"] not in bad_pages]

        for page_num in sorted(bad_pages):
            page_path = PAGES_DIR / f"hozier_sens_p{page_num:03d}.jpg"
            if not page_path.exists():
                page_path = PAGES_DIR / f"hozier_sens_p{page_num}.jpg"

            print(f"\nRe-détection p{page_num}...")

            max_retries = 3
            for attempt in range(max_retries):
                try:
                    blasons = redetect_page(page_path, page_num)
                    all_blasons.extend(blasons)
                    print(f"  {len(blasons)} blasons re-détectés")
                    for b in blasons:
                        bbox = b.get("bbox_pct", {})
                        print(f"    - {b['nom'][:40]:40s}  bbox=({bbox.get('x', 0):.2f},{bbox.get('y', 0):.2f},{bbox.get('w', 0):.2f},{bbox.get('h', 0):.2f})")
                    break
                except Exception as e:
                    if "429" in str(e) and attempt < max_retries - 1:
                        wait = 30 * (attempt + 1)
                        print(f"  Rate limited, attente {wait}s...")
                        time.sleep(wait)
                    else:
                        print(f"  ERREUR: {e}")
                        break

            time.sleep(3)

        # Sauvegarder les nouvelles détections
        DETECTIONS_PATH.write_text(
            json.dumps(all_blasons, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"\nDétections mises à jour : {len(all_blasons)} blasons -> {DETECTIONS_PATH}")

    # 3. Re-crop
    if args.all or args.recrop:
        bad_pages = get_bad_pages(bad_crops)
        if not bad_pages:
            print("\nRien à re-cropper.")
            return

        with open(DETECTIONS_PATH, encoding="utf-8") as f:
            all_blasons = json.load(f)

        # Ne re-cropper que les blasons des pages re-détectées
        to_recrop = [b for b in all_blasons if b["page"] in bad_pages]
        print(f"\n=== Re-crop de {len(to_recrop)} blasons ===\n")

        # Supprimer les anciens crops de ces pages
        for old_crop in BLASONS_DIR.glob("*.jpg"):
            parts = old_crop.stem.split("_")
            if int(parts[1]) in bad_pages:
                old_crop.unlink()

        ok_count = 0
        for blason in to_recrop:
            result = crop_blason_local(blason, PAGES_DIR, BLASONS_DIR)
            if result:
                ok_count += 1

        print(f"\n{ok_count}/{len(to_recrop)} blasons re-croppés")

        # Re-vérifier les nouveaux crops
        print("\n=== Re-vérification ===\n")
        new_good, new_bad = [], []
        for blason in to_recrop:
            safe_name = blason["nom"].replace(" ", "_").replace("'", "")[:40]
            crop_path = BLASONS_DIR / f"blason_{blason['page']:03d}_{blason['position']:02d}_{safe_name}.jpg"
            if crop_path.exists():
                result = analyze_crop(crop_path)
                status = "OK" if result["is_good"] else "XX"
                print(f"  {status} {result['file'][:50]:50s}  sat={result['center_saturation']:5.1f}  ratio={result['center_saturated_ratio']:.3f}")
                if result["is_good"]:
                    new_good.append(result)
                else:
                    new_bad.append(result)

        print(f"\nAprès re-détection : {len(new_good)} bons, {len(new_bad)} encore mauvais")


if __name__ == "__main__":
    main()
