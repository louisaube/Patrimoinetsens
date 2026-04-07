#!/usr/bin/env python3
"""
Extraction LENTE du texte OCR des Bulletins SAS depuis Gallica.
Comportement humain : pauses longues, session cookie, un volume a la fois.

Usage:
    python 17_gallica_sas_slow.py --year 1846          # Un seul volume
    python 17_gallica_sas_slow.py --year 1846 --pages 1-50  # Pages specifiques
    python 17_gallica_sas_slow.py --list                # Lister les volumes
"""

import argparse
import json
import random
import re
import sys
import time
from pathlib import Path

import httpx
from bs4 import BeautifulSoup
import yaml

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CONFIG_PATH = Path(__file__).parent.parent / "gallica-rag" / "config.yaml"
OUTPUT_DIR = Path(__file__).parent / "output" / "gallica_sas"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,*/*",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5",
    "Referer": "https://gallica.bnf.fr/",
}


def load_bulletins() -> dict[int, str]:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    return config.get("bulletins", {})


def extract_text_from_html(html: str) -> str:
    """Extrait le texte OCR du HTML de Gallica."""
    soup = BeautifulSoup(html, "lxml")
    # Le texte OCR est dans un div specifique
    ocr_div = soup.select_one("#texteImage, .texteImage, #ocr-text, .ocr")
    if ocr_div:
        return ocr_div.get_text(separator="\n", strip=True)
    # Fallback: chercher les paragraphes dans le body
    body = soup.select_one("body")
    if body:
        # Supprimer nav, header, footer, scripts
        for tag in body.select("nav, header, footer, script, style, .menu, .nav"):
            tag.decompose()
        text = body.get_text(separator="\n", strip=True)
        # Garder seulement les lignes substantielles
        lines = [l.strip() for l in text.split("\n") if len(l.strip()) > 20]
        return "\n".join(lines)
    return ""


def fetch_page_text(client: httpx.Client, ark: str, page: int) -> str:
    """Recupere le texte OCR d'une page Gallica via l'API ALTO."""
    url = f"https://gallica.bnf.fr/RequestDigitalElement?O={ark}&E=ALTO&Deb={page}"
    try:
        r = client.get(url)
        if r.status_code == 200:
            return extract_text_from_alto(r.text)
        elif r.status_code == 429:
            print(f"    429 - pause longue...")
            time.sleep(random.uniform(30, 60))
            return ""
        else:
            return ""
    except Exception as e:
        print(f"    Erreur page {page}: {e}")
        return ""


def extract_text_from_alto(xml_text: str) -> str:
    """Extrait le texte des balises String CONTENT du format ALTO."""
    soup = BeautifulSoup(xml_text, "xml")
    strings = soup.find_all("String")
    words = [s.get("CONTENT", "") for s in strings if s.get("CONTENT")]
    text = " ".join(words)
    # Fix encodage latin-1 mal decode
    try:
        text = text.encode("latin-1").decode("utf-8")
    except (UnicodeDecodeError, UnicodeEncodeError):
        pass
    return text


def get_page_count(client: httpx.Client, ark: str) -> int:
    """Estime le nombre de pages du document."""
    url = f"https://gallica.bnf.fr/ark:/12148/{ark}"
    try:
        r = client.get(url)
        if r.status_code == 200:
            # Chercher le nombre de pages dans le HTML
            match = re.search(r'"nbVueImages"\s*:\s*(\d+)', r.text)
            if match:
                return int(match.group(1))
            match = re.search(r'(\d+)\s*page', r.text)
            if match:
                return int(match.group(1))
    except Exception:
        pass
    return 100  # fallback


def scrape_volume(year: int, ark: str, page_range: tuple[int, int] | None = None):
    """Scrape un volume SAS avec comportement humain."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / f"sas_{year}_ocr.json"

    # Reprendre si deja partiellement fait
    existing_pages = {}
    if output_file.exists():
        with open(output_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        for p in data.get("pages", []):
            existing_pages[p["page"]] = p["text"]
        print(f"  Reprise: {len(existing_pages)} pages deja extraites")

    print(f"\n{'='*50}")
    print(f"  SAS {year} — ark:{ark}")
    print(f"{'='*50}")

    client = httpx.Client(headers=HEADERS, follow_redirects=True, timeout=30)

    # 1. Visiter la page d'accueil (cookie de session)
    print("  Navigation Gallica...")
    client.get("https://gallica.bnf.fr/")
    time.sleep(random.uniform(2, 4))

    # 2. Visiter la page du document
    print(f"  Ouverture du volume {year}...")
    client.get(f"https://gallica.bnf.fr/ark:/12148/{ark}")
    time.sleep(random.uniform(3, 5))

    # 3. Determiner le nombre de pages
    total_pages = get_page_count(client, ark)
    print(f"  Pages estimees: {total_pages}")

    if page_range:
        start, end = page_range
    else:
        start, end = 1, min(total_pages, 300)

    print(f"  Extraction pages {start}-{end}...")

    pages = []
    for p in range(start, end + 1):
        if p in existing_pages:
            pages.append({"page": p, "text": existing_pages[p]})
            continue

        text = fetch_page_text(client, ark, p)

        if text:
            pages.append({"page": p, "text": text})
            # Progression
            if p % 10 == 0:
                print(f"  Page {p}/{end}: {len(text)} chars")
        else:
            pages.append({"page": p, "text": ""})

        # Pause humaine : entre 3 et 8 secondes, parfois plus
        delay = random.uniform(3, 7)
        if p % 15 == 0:
            # Pause "lecture" toutes les 15 pages
            delay = random.uniform(10, 20)
            print(f"    (pause {delay:.0f}s)")
        time.sleep(delay)

        # Sauvegarder incrementalement toutes les 20 pages
        if p % 20 == 0:
            result = {
                "year": year,
                "ark": ark,
                "pages": pages,
                "total_chars": sum(len(pg["text"]) for pg in pages),
            }
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

    client.close()

    # Sauvegarde finale
    total_chars = sum(len(pg["text"]) for pg in pages)
    non_empty = sum(1 for pg in pages if pg["text"])
    result = {
        "year": year,
        "ark": ark,
        "pages": pages,
        "total_chars": total_chars,
        "non_empty_pages": non_empty,
    }
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n  TERMINE: {non_empty}/{len(pages)} pages avec texte, {total_chars/1000:.0f}K chars")
    print(f"  Sauve: {output_file}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--year", type=int, help="Annee du bulletin")
    parser.add_argument("--pages", help="Range de pages (ex: 1-50)")
    parser.add_argument("--list", action="store_true", help="Lister les volumes")
    args = parser.parse_args()

    bulletins = load_bulletins()

    if args.list:
        print(f"{len(bulletins)} Bulletins SAS disponibles:")
        for year, ark in sorted(bulletins.items()):
            print(f"  {year}: ark:/12148/{ark}")
        return

    if not args.year:
        print("Usage: python 17_gallica_sas_slow.py --year 1846")
        return

    if args.year not in bulletins:
        print(f"Volume {args.year} non trouve. --list pour voir les disponibles.")
        return

    page_range = None
    if args.pages:
        parts = args.pages.split("-")
        page_range = (int(parts[0]), int(parts[1]))

    scrape_volume(args.year, bulletins[args.year], page_range)


if __name__ == "__main__":
    main()
