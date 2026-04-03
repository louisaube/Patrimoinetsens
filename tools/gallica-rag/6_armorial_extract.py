"""
Étape 6 : Extraction de l'Armorial historique de l'Yonne (Déy, 1863).

Pipeline spécialisé pour :
1. Télécharger le PDF de l'Armorial depuis Gallica ou le miroir Auxerre
2. OCR avec RolmOCR (Qwen2.5-VL, open source, Apache 2.0)
3. Extraire les entrées structurées : nom de famille + description héraldique + seigneuries
4. Détecter et cropper les images de blasons (planches intercalées)
5. Générer un annuaire JSON : famille → blason + description + lieux

Usage:
    python 6_armorial_extract.py --fetch         # Télécharge le PDF
    python 6_armorial_extract.py --ocr           # OCR toutes les pages
    python 6_armorial_extract.py --extract        # Parse les entrées héraldiques
    python 6_armorial_extract.py --blasons        # Détecte et croppe les blasons
    python 6_armorial_extract.py --annuaire       # Génère l'annuaire final

Prérequis:
    pip install httpx pdf2image Pillow transformers torch
    # Pour RolmOCR local : GPU recommandé (7B params)
    # Alternative : API Hugging Face Inference (quasi gratuit)
"""

import argparse
import json
import re
from pathlib import Path

import httpx
import yaml


def load_config() -> dict:
    config_path = Path(__file__).parent / "config.yaml"
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def fetch_armorial(config: dict, output_dir: Path) -> Path:
    """Télécharge le PDF de l'Armorial depuis le miroir Auxerre (plus rapide que Gallica)."""
    output_path = output_dir / "armorial_dey_1863.pdf"

    if output_path.exists():
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"Déjà téléchargé: {output_path} ({size_mb:.1f} Mo)")
        return output_path

    url = config["armorial"]["pdf_mirror"]
    print(f"Téléchargement: {url}")

    response = httpx.get(url, follow_redirects=True, timeout=120)
    response.raise_for_status()

    output_path.write_bytes(response.content)
    size_mb = len(response.content) / (1024 * 1024)
    print(f"OK — {size_mb:.1f} Mo → {output_path}")
    return output_path


def ocr_with_rolmocr(pdf_path: Path, output_dir: Path) -> Path:
    """
    OCR de l'Armorial avec RolmOCR (basé sur Qwen2.5-VL).

    Deux options :
    A) Local avec transformers (nécessite GPU 16Go+)
    B) Via Hugging Face Inference API (quasi gratuit)
    """
    output_path = output_dir / "armorial_ocr.json"

    if output_path.exists():
        print(f"OCR déjà effectué: {output_path}")
        return output_path

    try:
        # Option A : RolmOCR local via olmocr
        from olmocr import ocr_pdf

        print(f"OCR local RolmOCR en cours: {pdf_path.name}...")
        results = ocr_pdf(str(pdf_path))

        pages_data = []
        for i, page_text in enumerate(results):
            pages_data.append({
                "page_number": i + 1,
                "text": page_text,
            })

        output_path.write_text(
            json.dumps({"pages": pages_data}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"OK — {len(pages_data)} pages → {output_path}")
        return output_path

    except ImportError:
        print("olmocr non installé. Utilisation du fallback Gallica ALTO...")
        return fallback_gallica_alto(pdf_path, output_dir)


def fallback_gallica_alto(pdf_path: Path, output_dir: Path) -> Path:
    """Fallback : récupère l'OCR ALTO depuis Gallica page par page."""
    output_path = output_dir / "armorial_ocr.json"
    config = load_config()
    ark = config["armorial"]["gallica_ark"]
    n_pages = config["armorial"]["pages"]

    pages_data = []
    for page in range(1, n_pages + 1):
        url = f"https://gallica.bnf.fr/RequestDigitalElement?O={ark}&E=ALTO&Deb={page}"
        try:
            response = httpx.get(url, timeout=30)
            response.raise_for_status()

            # Extraction basique du texte depuis ALTO XML
            text = extract_text_from_alto(response.text)
            if text.strip():
                pages_data.append({
                    "page_number": page,
                    "text": text,
                })
                print(f"  Page {page}/{n_pages}: {len(text)} caractères")
            else:
                print(f"  Page {page}/{n_pages}: (vide)")

        except Exception as e:
            print(f"  Page {page}/{n_pages}: ERREUR — {e}")

        # Politesse
        import time
        time.sleep(0.5)

    output_path.write_text(
        json.dumps({"pages": pages_data}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nOK — {len(pages_data)} pages non-vides → {output_path}")
    return output_path


def extract_text_from_alto(alto_xml: str) -> str:
    """Extrait le texte brut depuis le XML ALTO."""
    # Pattern pour les éléments String dans ALTO
    strings = re.findall(r'CONTENT="([^"]*)"', alto_xml)
    # Reconstituer les lignes
    lines = []
    current_line: list[str] = []

    for s in strings:
        if s.strip():
            current_line.append(s)

    return " ".join(current_line)


def parse_heraldic_entries(ocr_path: Path, output_dir: Path) -> Path:
    """Parse les entrées héraldiques depuis le texte OCR.

    Chaque entrée suit le pattern :
    - Description du blason ("D'azur au chevron d'or...")
    - Nom de famille ("DE BELLEVILLE")
    - Seigneuries ("seign. de Flogny, de Carizey...")
    - Période ("XVIe siècle")
    - Source ("Tarbé, arm. man.")
    """
    output_path = output_dir / "armorial_entries.json"

    with open(ocr_path, encoding="utf-8") as f:
        data = json.load(f)

    full_text = "\n".join(page["text"] for page in data["pages"])

    # Pattern pour détecter les noms de famille en majuscules
    # Ex: "DE BELLEVILLE, seign. de Flogny"
    family_pattern = re.compile(
        r"(?:DE\s+)?([A-Z][A-Z\s'-]{2,}),\s*seign\.\s*de\s+(.*?)(?:\.|,\s*\d)",
        re.MULTILINE,
    )

    # Pattern pour les descriptions héraldiques
    blazon_pattern = re.compile(
        r"((?:D'|De\s|Écartelé|Gironné|Fascé|Bandé|Pallé|Chevronné|Coupé|Parti|Tiercé)"
        r"[^.]{10,}\.)",
        re.MULTILINE,
    )

    entries = []
    for match in family_pattern.finditer(full_text):
        family_name = match.group(1).strip()
        seigneuries = match.group(2).strip()

        # Chercher la description de blason la plus proche avant cette entrée
        start = max(0, match.start() - 500)
        preceding_text = full_text[start : match.start()]
        blazon_matches = list(blazon_pattern.finditer(preceding_text))
        blazon_desc = blazon_matches[-1].group(1) if blazon_matches else None

        entries.append({
            "family": family_name,
            "seigneuries": seigneuries,
            "blazon_description": blazon_desc,
            "position_in_text": match.start(),
        })

    output_path.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Entrées trouvées: {len(entries)}")
    print(f"Sauvé: {output_path}")
    return output_path


def generate_annuaire(entries_path: Path, output_dir: Path) -> Path:
    """Génère l'annuaire final : index alphabétique des familles avec leurs blasons."""
    output_path = output_dir / "annuaire_heraldique.json"

    with open(entries_path, encoding="utf-8") as f:
        entries = json.load(f)

    # Index alphabétique
    annuaire: dict[str, list] = {}
    for entry in entries:
        letter = entry["family"][0].upper()
        if letter not in annuaire:
            annuaire[letter] = []
        annuaire[letter].append({
            "famille": entry["family"],
            "seigneuries": entry["seigneuries"],
            "blason": entry["blazon_description"],
        })

    # Trier chaque lettre
    for letter in annuaire:
        annuaire[letter].sort(key=lambda x: x["famille"])

    output_path.write_text(
        json.dumps(annuaire, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    total = sum(len(v) for v in annuaire.values())
    print(f"Annuaire: {total} familles, {len(annuaire)} lettres")
    print(f"Sauvé: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Extraction de l'Armorial historique de l'Yonne")
    parser.add_argument("--fetch", action="store_true", help="Télécharge le PDF")
    parser.add_argument("--ocr", action="store_true", help="OCR avec RolmOCR")
    parser.add_argument("--extract", action="store_true", help="Parse les entrées héraldiques")
    parser.add_argument("--annuaire", action="store_true", help="Génère l'annuaire alphabétique")
    parser.add_argument("--all", action="store_true", help="Toutes les étapes")
    args = parser.parse_args()

    config = load_config()
    output_dir = Path(__file__).parent / "output" / "armorial"
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.all or args.fetch:
        pdf_path = fetch_armorial(config, output_dir)

    if args.all or args.ocr:
        pdf_path = output_dir / "armorial_dey_1863.pdf"
        ocr_path = ocr_with_rolmocr(pdf_path, output_dir)

    if args.all or args.extract:
        ocr_path = output_dir / "armorial_ocr.json"
        entries_path = parse_heraldic_entries(ocr_path, output_dir)

    if args.all or args.annuaire:
        entries_path = output_dir / "armorial_entries.json"
        generate_annuaire(entries_path, output_dir)


if __name__ == "__main__":
    main()
