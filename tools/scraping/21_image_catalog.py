#!/usr/bin/env python3
"""
21_image_catalog.py — Catalog historical images of Sens from 3 sources:
  1. Wikimedia Commons API (categories + free text search)
  2. Gallica IIIF (from existing SAS OCR JSON files)
  3. Heritage items (from heritage-items.json)

Output: tools/scraping/output/image_catalog.json
"""

import sys
import os
import json
import hashlib
import re
import time
import urllib.parse
from pathlib import Path
from typing import Any

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "image_catalog.json"

GALLICA_SAS_DIR = OUTPUT_DIR / "gallica_sas"
HERITAGE_ITEMS_FILE = BASE_DIR.parent.parent / "public" / "data" / "heritage-items.json"

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {
    "User-Agent": "PatrimoineSensBot/1.0 (patrimoine-sens@example.com; Wikimedia Commons image catalog)"
}

COMMONS_CATEGORIES = [
    "Cathédrale Saint-Étienne de Sens",
    "Palais synodal de Sens",
    "Monuments historiques de Sens",
    "Sens (Yonne)",
    "Maison d'Abraham (Sens)",
]
COMMONS_SEARCH_QUERIES = [
    "Sens Yonne patrimoine",
]

# Keywords to detect illustration pages in Gallica OCR
GALLICA_IMAGE_KEYWORDS = re.compile(
    r"(?i)\b(planche|figure|gravure|plan\s+de|illustration|vue\s+de|dessin|lithographie)\b"
)

REQUEST_DELAY = 1.0  # seconds between API calls


def make_id(source: str, key: str) -> str:
    """Deterministic ID from source + key."""
    h = hashlib.sha256(f"{source}:{key}".encode("utf-8")).hexdigest()[:12]
    return f"{source}_{h}"


# ---------------------------------------------------------------------------
# 1. Wikimedia Commons
# ---------------------------------------------------------------------------

def commons_get_category_members(category: str, limit: int = 100) -> list[str]:
    """Return file titles from a Commons category (File: namespace only)."""
    titles: list[str] = []
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": f"Category:{category}",
        "cmtype": "file",
        "cmlimit": min(limit, 500),
        "format": "json",
    }
    cmcontinue = None
    while True:
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        try:
            resp = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"  [WARN] category '{category}' request failed: {e}")
            break
        for m in data.get("query", {}).get("categorymembers", []):
            titles.append(m["title"])
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue or len(titles) >= limit:
            break
        time.sleep(REQUEST_DELAY)
    return titles[:limit]


def commons_search_files(query: str, limit: int = 50) -> list[str]:
    """Free-text search for files on Commons."""
    titles: list[str] = []
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": 6,  # File namespace
        "srlimit": min(limit, 50),
        "format": "json",
    }
    try:
        resp = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        for r in data.get("query", {}).get("search", []):
            titles.append(r["title"])
    except Exception as e:
        print(f"  [WARN] search '{query}' failed: {e}")
    return titles[:limit]


def commons_get_imageinfo(file_titles: list[str]) -> list[dict[str, Any]]:
    """Fetch image URLs and license info for a batch of file titles (up to 50)."""
    results: list[dict[str, Any]] = []
    # Process in batches of 50 (API limit)
    for i in range(0, len(file_titles), 50):
        batch = file_titles[i : i + 50]
        params = {
            "action": "query",
            "titles": "|".join(batch),
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime",
            "iiurlwidth": 400,  # thumbnail width
            "format": "json",
        }
        try:
            resp = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"  [WARN] imageinfo batch failed: {e}")
            time.sleep(REQUEST_DELAY)
            continue

        pages = data.get("query", {}).get("pages", {})
        for _pid, page in pages.items():
            if int(_pid) < 0:
                continue  # missing page
            ii_list = page.get("imageinfo", [])
            if not ii_list:
                continue
            ii = ii_list[0]
            ext = ii.get("extmetadata", {})
            license_name = ext.get("LicenseShortName", {}).get("value", "unknown")
            description = ext.get("ImageDescription", {}).get("value", "")
            # Strip HTML tags from description
            description = re.sub(r"<[^>]+>", "", description).strip()
            title = page.get("title", "").replace("File:", "")

            # Build tags from categories mentioned in description
            tags = _extract_tags_commons(title, description)

            results.append({
                "id": make_id("commons", page.get("title", "")),
                "source": "commons",
                "title": title,
                "url": ii.get("url", ""),
                "thumbnail": ii.get("thumburl", ii.get("url", "")),
                "license": license_name,
                "tags": tags,
                "relatedHeritageItemId": None,
                "width": ii.get("width"),
                "height": ii.get("height"),
                "mime": ii.get("mime", ""),
                "description": description[:300] if description else "",
            })
        time.sleep(REQUEST_DELAY)
    return results


def _extract_tags_commons(title: str, description: str) -> list[str]:
    """Heuristic tag extraction from title and description."""
    tags: set[str] = set()
    combined = f"{title} {description}".lower()
    tag_map = {
        "cathédrale": "cathedrale",
        "cathedral": "cathedrale",
        "saint-étienne": "cathedrale",
        "palais synodal": "palais-synodal",
        "maison d'abraham": "maison-abraham",
        "maison abraham": "maison-abraham",
        "monument": "monument-historique",
        "église": "eglise",
        "church": "eglise",
        "rempart": "remparts",
        "porte": "porte",
        "hôtel de ville": "hotel-de-ville",
        "yonne": "yonne",
        "calvaire": "calvaire",
        "lavoir": "lavoir",
        "fontaine": "fontaine",
    }
    for keyword, tag in tag_map.items():
        if keyword in combined:
            tags.add(tag)
    if "sens" in combined:
        tags.add("sens")
    return sorted(tags)


def fetch_commons_images() -> list[dict[str, Any]]:
    """Fetch all images from Wikimedia Commons categories and search queries."""
    all_titles: set[str] = set()

    # Category members
    for cat in COMMONS_CATEGORIES:
        print(f"  [Commons] Category: {cat}")
        titles = commons_get_category_members(cat, limit=100)
        print(f"    -> {len(titles)} files")
        all_titles.update(titles)
        time.sleep(REQUEST_DELAY)

    # Free text search
    for q in COMMONS_SEARCH_QUERIES:
        print(f"  [Commons] Search: {q}")
        titles = commons_search_files(q, limit=50)
        print(f"    -> {len(titles)} files")
        all_titles.update(titles)
        time.sleep(REQUEST_DELAY)

    print(f"  [Commons] Total unique files: {len(all_titles)}")

    # Get image info
    results = commons_get_imageinfo(sorted(all_titles))
    print(f"  [Commons] Got imageinfo for {len(results)} images")
    return results


# ---------------------------------------------------------------------------
# 2. Gallica IIIF — parse existing SAS OCR JSONs
# ---------------------------------------------------------------------------

def fetch_gallica_images() -> list[dict[str, Any]]:
    """Parse OCR JSON files to find pages mentioning illustrations, generate IIIF URLs."""
    results: list[dict[str, Any]] = []

    if not GALLICA_SAS_DIR.is_dir():
        print(f"  [Gallica] Directory not found: {GALLICA_SAS_DIR}")
        return results

    json_files = sorted(GALLICA_SAS_DIR.glob("sas_*_ocr.json"))
    print(f"  [Gallica] Found {len(json_files)} OCR files")

    for jf in json_files:
        try:
            with open(jf, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"  [WARN] Cannot read {jf.name}: {e}")
            continue

        ark = data.get("ark", "")
        year = data.get("year", "")
        pages = data.get("pages", [])

        if not ark:
            print(f"  [WARN] No ark in {jf.name}, skipping")
            continue

        for page_entry in pages:
            page_num = page_entry.get("page", 0)
            text = page_entry.get("text", "")
            if not text:
                continue

            matches = GALLICA_IMAGE_KEYWORDS.findall(text)
            if not matches:
                continue

            # Build IIIF URL for this page
            iiif_url = f"https://gallica.bnf.fr/iiif/ark:/12148/{ark}/f{page_num}/full/1024,/0/native.jpg"
            thumb_url = f"https://gallica.bnf.fr/iiif/ark:/12148/{ark}/f{page_num}/full/400,/0/native.jpg"
            gallica_page_url = f"https://gallica.bnf.fr/ark:/12148/{ark}/f{page_num}"

            # Extract a short context around the keyword match
            first_match = matches[0]
            match_obj = re.search(
                rf"(?i)(.{{0,40}}\b{re.escape(first_match)}\b.{{0,60}})", text
            )
            context_snippet = match_obj.group(1).strip() if match_obj else first_match

            # Build tags
            tags = ["gallica", "sas"]
            if year:
                tags.append(f"annee-{year}")
            for m in set(m.lower() for m in matches):
                if m == "planche":
                    tags.append("planche")
                elif m == "gravure":
                    tags.append("gravure")
                elif m.startswith("plan"):
                    tags.append("plan")
                elif m == "figure":
                    tags.append("figure")

            results.append({
                "id": make_id("gallica", f"{ark}_f{page_num}"),
                "source": "gallica",
                "title": f"Bulletin SAS {year} — p.{page_num} ({first_match})",
                "url": iiif_url,
                "thumbnail": thumb_url,
                "license": "domaine-public",
                "tags": sorted(set(tags)),
                "relatedHeritageItemId": None,
                "gallicaPageUrl": gallica_page_url,
                "ark": ark,
                "pageNum": page_num,
                "context": context_snippet[:200],
            })

    print(f"  [Gallica] Found {len(results)} illustration pages")
    return results


# ---------------------------------------------------------------------------
# 3. Heritage items — from heritage-items.json
# ---------------------------------------------------------------------------

def fetch_heritage_images() -> list[dict[str, Any]]:
    """Read heritage items with coverPhotoUrl."""
    results: list[dict[str, Any]] = []

    if not HERITAGE_ITEMS_FILE.is_file():
        print(f"  [Heritage] File not found: {HERITAGE_ITEMS_FILE}")
        return results

    try:
        with open(HERITAGE_ITEMS_FILE, "r", encoding="utf-8") as f:
            items = json.load(f)
    except Exception as e:
        print(f"  [Heritage] Cannot read file: {e}")
        return results

    print(f"  [Heritage] Loaded {len(items)} items")

    for item in items:
        photo_url = item.get("coverPhotoUrl")
        if not photo_url:
            continue

        item_id = item.get("id", "")
        title = item.get("title", item.get("name", "Sans titre"))
        category = item.get("category", "")

        tags = ["heritage", "sens"]
        if category:
            tags.append(category)

        results.append({
            "id": make_id("heritage", item_id),
            "source": "heritage",
            "title": title or "Sans titre",
            "url": photo_url,
            "thumbnail": photo_url,  # same URL, no thumbnail generation
            "license": "droits-reserves",
            "tags": sorted(set(tags)),
            "relatedHeritageItemId": item_id,
        })

    print(f"  [Heritage] Found {len(results)} items with coverPhotoUrl")
    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("=" * 60)
    print("Image Catalog — Patrimoine de Sens")
    print("=" * 60)

    catalog: list[dict[str, Any]] = []

    # 1. Wikimedia Commons
    print("\n[1/3] Wikimedia Commons...")
    try:
        commons_images = fetch_commons_images()
        catalog.extend(commons_images)
    except Exception as e:
        print(f"  [ERROR] Commons failed: {e}")

    # 2. Gallica IIIF
    print("\n[2/3] Gallica IIIF (from SAS OCR)...")
    try:
        gallica_images = fetch_gallica_images()
        catalog.extend(gallica_images)
    except Exception as e:
        print(f"  [ERROR] Gallica failed: {e}")

    # 3. Heritage items
    print("\n[3/3] Heritage items...")
    try:
        heritage_images = fetch_heritage_images()
        catalog.extend(heritage_images)
    except Exception as e:
        print(f"  [ERROR] Heritage failed: {e}")

    # Deduplicate by id
    seen: set[str] = set()
    unique_catalog: list[dict[str, Any]] = []
    for entry in catalog:
        if entry["id"] not in seen:
            seen.add(entry["id"])
            unique_catalog.append(entry)

    # Summary
    print("\n" + "=" * 60)
    print(f"Total images cataloged: {len(unique_catalog)}")
    sources = {}
    for entry in unique_catalog:
        src = entry["source"]
        sources[src] = sources.get(src, 0) + 1
    for src, count in sorted(sources.items()):
        print(f"  {src}: {count}")

    # Write output
    output_data = {
        "generated": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "totalImages": len(unique_catalog),
        "sources": sources,
        "images": unique_catalog,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\nCatalog written to: {OUTPUT_FILE}")
    print("Done.")


if __name__ == "__main__":
    main()
