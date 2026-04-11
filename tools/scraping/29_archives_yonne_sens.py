#!/usr/bin/env python3
"""
29_archives_yonne_sens.py — Scrape Archives départementales de l'Yonne
for postcards and iconography specifically about Sens (the city).

Strategy:
  - Cartes postales: search with RECH_libelle=Sens (title match, not commune)
    to capture postcards OF Sens, not just mentioning "route de Sens"
  - Iconographie: search RECH_libelle=Sens in iconography section
  - Filter out UI artifacts (icons, buttons)
  - Filter out entries about other communes (Bellechaume, Cornant, etc.)
  - Extract proper IIPSrv URLs for thumbnails and high-res
  - Paginate through all results

Output: tools/scraping/output/archives_yonne_sens.json
"""

import sys
import os
import json
import re
import time
import hashlib
from pathlib import Path
from typing import Any
from urllib.parse import urlencode, quote

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "archives_yonne_sens.json"

ARCHIVES_BASE = "https://archives.yonne.fr"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
}

REQUEST_DELAY = 2.0  # polite delay between requests

# Known Sens-specific keywords in card titles
SENS_KEYWORDS = re.compile(
    r"(?i)\bSens\b(?![\s\-]*(?:lès|les|dessus|dessous))"
    # Matches "Sens" but NOT "Sens-lès-X" or "Saint Denis les Sens"
)

# Communes that are NOT Sens but often appear in "route de Sens" results
EXCLUDE_COMMUNES = {
    "bellechaume", "cornant", "fleurigny", "maillot", "molinons",
    "nailly", "paron", "saint-denis", "villeneuve-sur-yonne",
    "villeneuve l'archevêque", "pont-sur-yonne", "thorigny",
    "gron", "rosoy", "soucy", "voisines", "marsangy",
    "saint clément", "saint martin du tertre", "malay-le-grand",
    "malay-le-petit", "courtois-sur-yonne", "etigny",
}

# UI artifact URLs to exclude
UI_ARTIFACTS = {
    "ico_visu.gif", "inventaire.png", "plus_pt.gif", "moins_pt.gif",
    "fleche_bas.gif", "fleche_haut.gif", "logo", "favicon",
}


def is_ui_artifact(url: str) -> bool:
    """Check if URL points to a UI icon/artifact, not actual content."""
    lower = url.lower()
    return any(art in lower for art in UI_ARTIFACTS)


def is_about_sens(title: str) -> bool:
    """
    Check if a postcard title is specifically about the city of Sens,
    not about 'Route de Sens' from another village.
    """
    if not title:
        return False
    lower = title.lower()

    # Exclude entries clearly about other communes
    for commune in EXCLUDE_COMMUNES:
        if commune in lower and "sens" not in lower.split(".")[0].split(",")[0]:
            # The commune name appears, and "Sens" isn't in the first clause
            return False

    # Explicit "Route de Sens" from another location → exclude
    if re.search(r"(?i)(route|chemin|direction)\s+de\s+sens", lower):
        # Check if it's FROM another commune
        if any(c in lower for c in EXCLUDE_COMMUNES):
            return False

    # Must actually mention Sens in a primary way
    if SENS_KEYWORDS.search(title):
        return True

    return False


def extract_iipsrv_url(url: str, height: int = 600) -> str | None:
    """
    Transform an IIPSrv thumbnail URL to a higher-resolution version.
    The URLs look like: .../iipsrv.fcgi?FIF=...&HEI=240&QLT=80&CVT=JPG&...
    """
    if "iipsrv.fcgi" not in url:
        return None
    # Replace HEI parameter for larger image
    return re.sub(r"HEI=\d+", f"HEI={height}", url)


def extract_frad_id(url: str) -> str | None:
    """Extract the FRAD089 reference from the IIPSrv URL."""
    match = re.search(r"(FRAD089_\w+)\.jpg", url)
    return match.group(1) if match else None


def make_id(key: str) -> str:
    """Deterministic ID."""
    h = hashlib.sha256(key.encode("utf-8")).hexdigest()[:12]
    return f"archives_yonne_{h}"


# ---------------------------------------------------------------------------
# Scraping: Cartes postales
# ---------------------------------------------------------------------------

def scrape_cartes_postales(session: requests.Session) -> list[dict[str, Any]]:
    """
    Scrape all postcard results from Archives de l'Yonne.
    Two searches:
      1. RECH_libelle=Sens (postcards whose title mentions Sens)
      2. RECH_com=Sens (postcards indexed under commune=Sens)
    Deduplicate by FRAD ID.
    """
    all_results: dict[str, dict[str, Any]] = {}  # keyed by FRAD ID or URL

    for search_type, params in [
        ("libelle", {"RECH_libelle": "sens", "type": "cartespostales", "nav_pagination": "50"}),
        ("commune", {"RECH_com": "sens", "type": "cartespostales", "nav_pagination": "50"}),
    ]:
        print(f"\n  [Cartes postales] Search by {search_type}...")
        page = 1
        total_found = 0

        while True:
            url = f"{ARCHIVES_BASE}/archive/recherche/cartespostales/page:{page}/n:500"
            try:
                resp = session.get(url, params=params, headers=HEADERS, timeout=30)
                resp.raise_for_status()
            except Exception as e:
                print(f"    [ERROR] Page {page}: {e}")
                break

            soup = BeautifulSoup(resp.text, "html.parser")

            # Find total count from pagination text
            if page == 1:
                pagination = soup.find("div", class_="pagination") or soup.find("span", class_="nb_results")
                if pagination:
                    count_match = re.search(r"(\d+)\s*résultat", pagination.get_text())
                    if count_match:
                        total_found = int(count_match.group(1))
                        print(f"    Total results: {total_found}")

            # Find all image entries
            entries_on_page = 0
            for img in soup.find_all("img"):
                src = img.get("src", "")
                if not src or is_ui_artifact(src):
                    continue
                if "iipsrv.fcgi" not in src:
                    continue

                # Get title from alt, title attribute, or parent link
                title = img.get("alt", "") or img.get("title", "")
                if not title:
                    parent_a = img.find_parent("a")
                    if parent_a:
                        title = parent_a.get("title", "") or parent_a.get_text(strip=True)

                # Clean title
                title = re.sub(r"\s*\(ouvre la visionneuse\)", "", title)
                title = re.sub(r"\s*- Ouvre la visionneuse", "", title)
                title = re.sub(r"^1 vue\s*-\s*", "", title).strip()
                title = title.replace("\\'", "'")

                if not title:
                    continue

                # Filter: is this about Sens?
                if not is_about_sens(title):
                    continue

                frad_id = extract_frad_id(src)
                key = frad_id or src
                if key in all_results:
                    continue

                # Build proper URLs
                thumb_url = src
                hires_url = extract_iipsrv_url(src, height=1200) or src

                # Try to extract detail link
                detail_url = None
                parent_a = img.find_parent("a")
                if parent_a:
                    href = parent_a.get("href", "")
                    if href and not href.startswith("javascript"):
                        detail_url = f"{ARCHIVES_BASE}{href}" if href.startswith("/") else href

                # Extract tags from title
                tags = extract_tags_from_title(title)

                all_results[key] = {
                    "id": make_id(key),
                    "source": "archives_yonne",
                    "type": "carte_postale",
                    "title": title,
                    "fradId": frad_id,
                    "thumbnail": thumb_url,
                    "url": hires_url,
                    "detailUrl": detail_url,
                    "license": "archives-departementales-yonne",
                    "tags": tags,
                    "relatedHeritageItemId": None,
                    "searchType": search_type,
                }
                entries_on_page += 1

            print(f"    Page {page}: {entries_on_page} Sens-specific entries")

            # Check if more pages
            if entries_on_page == 0 and page > 1:
                break
            # Check for next page link
            next_link = soup.find("a", string=re.compile(r"(?i)suiv|>|»"))
            if not next_link and total_found > 0 and page * 50 >= total_found:
                break
            if page * 50 >= max(total_found, 500):  # safety limit
                break

            page += 1
            time.sleep(REQUEST_DELAY)

    return list(all_results.values())


# ---------------------------------------------------------------------------
# Scraping: Iconographie
# ---------------------------------------------------------------------------

def scrape_iconographie(session: requests.Session) -> list[dict[str, Any]]:
    """
    Scrape iconography (engravings, plans, drawings) from Archives de l'Yonne.
    Search: RECH_libelle=Sens in iconographie section.
    """
    results: dict[str, dict[str, Any]] = {}
    print(f"\n  [Iconographie] Searching...")

    for search_type, params in [
        ("libelle", {"RECH_libelle": "sens", "type": "iconographie", "nav_pagination": "50"}),
        ("commune", {"RECH_com": "sens", "type": "iconographie", "nav_pagination": "50"}),
    ]:
        page = 1
        while True:
            url = f"{ARCHIVES_BASE}/archive/recherche/iconographie/page:{page}/n:500"
            try:
                resp = session.get(url, params=params, headers=HEADERS, timeout=30)
                resp.raise_for_status()
            except Exception as e:
                print(f"    [ERROR] Iconographie page {page}: {e}")
                break

            soup = BeautifulSoup(resp.text, "html.parser")

            if page == 1:
                pagination = soup.find("div", class_="pagination") or soup.find("span", class_="nb_results")
                if pagination:
                    count_match = re.search(r"(\d+)\s*résultat", pagination.get_text())
                    if count_match:
                        print(f"    [{search_type}] Total results: {count_match.group(1)}")

            entries_on_page = 0
            for img in soup.find_all("img"):
                src = img.get("src", "")
                if not src or is_ui_artifact(src):
                    continue
                if "iipsrv.fcgi" not in src:
                    continue

                title = img.get("alt", "") or img.get("title", "")
                if not title:
                    parent_a = img.find_parent("a")
                    if parent_a:
                        title = parent_a.get("title", "") or parent_a.get_text(strip=True)

                title = re.sub(r"\s*\(ouvre la visionneuse\)", "", title)
                title = re.sub(r"\s*- Ouvre la visionneuse", "", title)
                title = re.sub(r"^1 vue\s*-\s*", "", title).strip()
                title = title.replace("\\'", "'")

                if not title:
                    continue

                if not is_about_sens(title):
                    continue

                frad_id = extract_frad_id(src)
                key = frad_id or src
                if key in results:
                    continue

                thumb_url = src
                hires_url = extract_iipsrv_url(src, height=1200) or src
                tags = extract_tags_from_title(title)
                tags.append("iconographie")

                detail_url = None
                parent_a = img.find_parent("a")
                if parent_a:
                    href = parent_a.get("href", "")
                    if href and not href.startswith("javascript"):
                        detail_url = f"{ARCHIVES_BASE}{href}" if href.startswith("/") else href

                results[key] = {
                    "id": make_id(f"icono_{key}"),
                    "source": "archives_yonne",
                    "type": "iconographie",
                    "title": title,
                    "fradId": frad_id,
                    "thumbnail": thumb_url,
                    "url": hires_url,
                    "detailUrl": detail_url,
                    "license": "archives-departementales-yonne",
                    "tags": sorted(set(tags)),
                    "relatedHeritageItemId": None,
                    "searchType": search_type,
                }
                entries_on_page += 1

            print(f"    [{search_type}] Page {page}: {entries_on_page} entries")

            if entries_on_page == 0 and page > 1:
                break
            if page * 50 >= 500:
                break

            page += 1
            time.sleep(REQUEST_DELAY)

    return list(results.values())


# ---------------------------------------------------------------------------
# Tag extraction
# ---------------------------------------------------------------------------

def extract_tags_from_title(title: str) -> list[str]:
    """Extract heritage-related tags from postcard/iconography title."""
    tags: list[str] = ["sens", "archives-yonne"]
    lower = title.lower()

    tag_map = {
        "cathédrale": "cathedrale",
        "saint-étienne": "cathedrale",
        "saint étienne": "cathedrale",
        "palais synodal": "palais-synodal",
        "salle synodal": "palais-synodal",
        "maison d'abraham": "maison-abraham",
        "maison abraham": "maison-abraham",
        "hôtel de ville": "hotel-de-ville",
        "hotel de ville": "hotel-de-ville",
        "marché couvert": "marche-couvert",
        "halles": "marche-couvert",
        "rempart": "remparts",
        "enceinte": "remparts",
        "porte": "porte",
        "grande rue": "grande-rue",
        "rue de la république": "rue-republique",
        "place": "place",
        "pont": "pont",
        "yonne": "riviere-yonne",
        "église": "eglise",
        "saint-maurice": "saint-maurice",
        "saint maurice": "saint-maurice",
        "calvaire": "calvaire",
        "lavoir": "lavoir",
        "fontaine": "fontaine",
        "monument": "monument",
        "statue": "statue",
        "panorama": "vue-generale",
        "vue générale": "vue-generale",
        "vue generale": "vue-generale",
        "panoramique": "vue-generale",
        "inondation": "inondation",
        "fête": "fete",
        "fete": "fete",
        "militaire": "militaire",
        "soldats": "militaire",
        "guerre": "guerre",
    }

    for keyword, tag in tag_map.items():
        if keyword in lower:
            tags.append(tag)

    return sorted(set(tags))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("=" * 60)
    print("Archives départementales de l'Yonne — Scraper Sens")
    print("Cartes postales + Iconographie")
    print("=" * 60)

    session = requests.Session()
    all_images: list[dict[str, Any]] = []

    # 1. Cartes postales
    print("\n[1/2] Cartes postales...")
    try:
        cartes = scrape_cartes_postales(session)
        all_images.extend(cartes)
        print(f"\n  => {len(cartes)} cartes postales de Sens")
    except Exception as e:
        print(f"  [ERROR] Cartes postales: {e}")
        import traceback; traceback.print_exc()

    # 2. Iconographie
    print("\n[2/2] Iconographie...")
    try:
        icono = scrape_iconographie(session)
        all_images.extend(icono)
        print(f"\n  => {len(icono)} iconographies de Sens")
    except Exception as e:
        print(f"  [ERROR] Iconographie: {e}")
        import traceback; traceback.print_exc()

    # Deduplicate by ID
    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for img in all_images:
        if img["id"] not in seen:
            seen.add(img["id"])
            unique.append(img)

    # Summary
    print("\n" + "=" * 60)
    print(f"Total images: {len(unique)}")
    by_type: dict[str, int] = {}
    for img in unique:
        t = img.get("type", "unknown")
        by_type[t] = by_type.get(t, 0) + 1
    for t, c in sorted(by_type.items()):
        print(f"  {t}: {c}")

    # Tag distribution
    tag_counts: dict[str, int] = {}
    for img in unique:
        for tag in img.get("tags", []):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
    print("\nTop tags:")
    for tag, count in sorted(tag_counts.items(), key=lambda x: -x[1])[:20]:
        print(f"  {tag}: {count}")

    # Write output
    output = {
        "generated": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total": len(unique),
        "byType": by_type,
        "images": unique,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nOutput: {OUTPUT_FILE}")
    print("Done.")


if __name__ == "__main__":
    main()
