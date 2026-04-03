"""
Étape 1 : Téléchargement des bulletins SAS depuis Gallica.

Utilise l'API Gallica pour télécharger les PDFs des bulletins
de la Société Archéologique de Sens (1846-1937).

Usage:
    python 1_fetch_pdfs.py                # Télécharge tous les bulletins
    python 1_fetch_pdfs.py --year 1846    # Télécharge un seul bulletin
    python 1_fetch_pdfs.py --dry-run      # Liste sans télécharger
"""

import argparse
import time
from pathlib import Path

import httpx
import yaml


def load_config() -> dict:
    config_path = Path(__file__).parent / "config.yaml"
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def fetch_pdf(ark: str, year: int, output_dir: Path) -> Path:
    """Télécharge un PDF depuis Gallica via l'ARK identifier."""
    url = f"https://gallica.bnf.fr/ark:/12148/{ark}.pdf"
    output_path = output_dir / f"sas_{year}.pdf"

    if output_path.exists():
        print(f"  [{year}] Déjà téléchargé: {output_path}")
        return output_path

    print(f"  [{year}] Téléchargement: {url}")
    response = httpx.get(url, follow_redirects=True, timeout=120)
    response.raise_for_status()

    output_path.write_bytes(response.content)
    size_mb = len(response.content) / (1024 * 1024)
    print(f"  [{year}] OK — {size_mb:.1f} Mo → {output_path}")
    return output_path


def fetch_text_alto(ark: str, year: int, page: int, output_dir: Path) -> str | None:
    """Récupère le texte OCR ALTO d'une page (fallback si PDF indisponible)."""
    url = f"https://gallica.bnf.fr/RequestDigitalElement?O={ark}&E=ALTO&Deb={page}"
    try:
        response = httpx.get(url, timeout=30)
        response.raise_for_status()
        return response.text
    except httpx.HTTPError:
        return None


def main():
    parser = argparse.ArgumentParser(description="Télécharge les bulletins SAS depuis Gallica")
    parser.add_argument("--year", type=int, help="Année spécifique à télécharger")
    parser.add_argument("--dry-run", action="store_true", help="Liste sans télécharger")
    parser.add_argument("--format", choices=["pdf", "alto"], default="pdf", help="Format de téléchargement")
    args = parser.parse_args()

    config = load_config()
    bulletins = config["bulletins"]

    output_dir = Path(__file__).parent / "output" / "pdfs"
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.year:
        bulletins = {args.year: bulletins[args.year]}

    total = len(bulletins)
    print(f"Bulletins SAS à télécharger: {total}")
    print(f"Format: {args.format}")
    print(f"Destination: {output_dir}")
    print()

    if args.dry_run:
        for year, ark in sorted(bulletins.items()):
            print(f"  {year}: https://gallica.bnf.fr/ark:/12148/{ark}")
        print(f"\nTotal: {total} bulletins")
        return

    for i, (year, ark) in enumerate(sorted(bulletins.items()), 1):
        print(f"[{i}/{total}]")
        try:
            fetch_pdf(ark, year, output_dir)
        except Exception as e:
            print(f"  [{year}] ERREUR: {e}")

        # Politesse : 2s entre chaque requête
        if i < total:
            time.sleep(2)

    print(f"\nTerminé. {total} bulletins dans {output_dir}")


if __name__ == "__main__":
    main()
