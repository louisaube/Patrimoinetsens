#!/usr/bin/env python3
"""
30_label_images.py — Auto-label images from the catalog by matching them
to the 85 heritage items in the database.

Matching strategy (scored):
  1. Exact title match (weight: 10) — image title contains heritage item title
  2. Keyword overlap (weight: per keyword) — shared significant words
  3. Tag match (weight: 3) — image tags match known tag→item mappings
  4. Geolocation proximity (weight: 5) — for geolocated images within 100m

Each image gets matched to the highest-scoring heritage item (if score >= threshold).

Input:
  - tools/scraping/output/image_catalog.json (Commons + Gallica)
  - tools/scraping/output/archives_yonne_sens.json (Archives Yonne, if exists)
  - public/data/heritage-items.json OR src/lib/db/seed-items.ts

Output:
  - tools/scraping/output/image_labels.json (image_id → heritage_item_id + score)
  - Updates image_catalog.json with relatedHeritageItemId filled in
"""

import sys
import os
import json
import re
import math
from pathlib import Path
from typing import Any

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
CATALOG_FILE = OUTPUT_DIR / "image_catalog.json"
ARCHIVES_FILE = OUTPUT_DIR / "archives_yonne_sens.json"
HERITAGE_JSON = BASE_DIR.parent.parent / "public" / "data" / "heritage-items.json"
OUTPUT_LABELS = OUTPUT_DIR / "image_labels.json"

MATCH_THRESHOLD = 5  # minimum score to consider a match


# ---------------------------------------------------------------------------
# Heritage item keyword index
# ---------------------------------------------------------------------------

# Manual tag → heritage item ID mapping for known landmarks
TAG_TO_ITEM: dict[str, str] = {
    "cathedrale": "e5555555-0001-0001-0001-000000000001",
    "palais-synodal": "e5555555-0002-0002-0002-000000000002",
    "maison-abraham": "e5555555-0003-0003-0003-000000000003",
    "marche-couvert": "e5555555-0004-0004-0004-000000000004",
    "saint-maurice": "e5555555-0005-0005-0005-000000000005",
}

# Stop words to ignore in matching
STOP_WORDS = {
    "de", "du", "des", "le", "la", "les", "l", "un", "une",
    "et", "ou", "en", "à", "au", "aux", "par", "pour", "sur",
    "dans", "avec", "sans", "ce", "cette", "ces", "son", "sa",
    "ses", "vue", "vues", "sens", "yonne", "cliché", "photo",
    "carte", "postale", "cartes", "postales", "1", "2", "3",
    "rue", "place", "avenue", "boulevard", "route",
}


def normalize(text: str) -> str:
    """Normalize text for matching: lowercase, remove accents, strip punctuation."""
    import unicodedata
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return " ".join(text.split())


def tokenize(text: str) -> set[str]:
    """Split normalized text into meaningful tokens."""
    words = normalize(text).split()
    return {w for w in words if len(w) > 2 and w not in STOP_WORDS}


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in meters."""
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------

def load_heritage_items() -> list[dict[str, Any]]:
    """Load heritage items from JSON export."""
    if HERITAGE_JSON.is_file():
        with open(HERITAGE_JSON, "r", encoding="utf-8") as f:
            return json.load(f)
    print(f"  [WARN] Heritage items not found at {HERITAGE_JSON}")
    return []


def load_images() -> list[dict[str, Any]]:
    """Load all images from catalog + archives."""
    images: list[dict[str, Any]] = []

    if CATALOG_FILE.is_file():
        with open(CATALOG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        images.extend(data.get("images", []))
        print(f"  Loaded {len(data.get('images', []))} from image_catalog.json")

    if ARCHIVES_FILE.is_file():
        with open(ARCHIVES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        images.extend(data.get("images", []))
        print(f"  Loaded {len(data.get('images', []))} from archives_yonne_sens.json")

    return images


# ---------------------------------------------------------------------------
# Matching engine
# ---------------------------------------------------------------------------

def build_item_index(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Build a search index for each heritage item."""
    index = []
    for item in items:
        title = item.get("title", "")
        tokens = tokenize(title)

        # Add category keywords
        category = item.get("category", "")
        if "religieux" in category:
            tokens.add("eglise")
            tokens.add("religieux")
        if "historique" in category:
            tokens.add("historique")

        index.append({
            "id": item["id"],
            "title": title,
            "normalizedTitle": normalize(title),
            "tokens": tokens,
            "lat": item.get("latitude"),
            "lon": item.get("longitude"),
        })

    return index


def score_match(
    image: dict[str, Any],
    item: dict[str, Any],
) -> float:
    """Score how well an image matches a heritage item."""
    score = 0.0

    img_title = image.get("title", "")
    img_desc = image.get("description", "")
    img_tags = set(image.get("tags", []))
    img_text = f"{img_title} {img_desc}"

    # 1. Exact title containment (strongest signal)
    item_title_norm = item["normalizedTitle"]
    img_text_norm = normalize(img_text)
    if item_title_norm and item_title_norm in img_text_norm:
        score += 10

    # 2. Token overlap
    img_tokens = tokenize(img_text)
    common = img_tokens & item["tokens"]
    score += len(common) * 2

    # 3. Tag → known item mapping
    for tag in img_tags:
        if tag in TAG_TO_ITEM and TAG_TO_ITEM[tag] == item["id"]:
            score += 5

    # 4. Geo proximity (if both have coordinates)
    img_lat = image.get("latitude")
    img_lon = image.get("longitude")
    item_lat = item.get("lat")
    item_lon = item.get("lon")
    if img_lat and img_lon and item_lat and item_lon:
        dist = haversine_m(img_lat, img_lon, item_lat, item_lon)
        if dist < 50:
            score += 5
        elif dist < 100:
            score += 3
        elif dist < 200:
            score += 1

    return score


def match_images(
    images: list[dict[str, Any]],
    item_index: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Match each image to its best heritage item."""
    labels: dict[str, dict[str, Any]] = {}

    for image in images:
        best_score = 0.0
        best_item_id = None
        best_item_title = None

        for item in item_index:
            s = score_match(image, item)
            if s > best_score:
                best_score = s
                best_item_id = item["id"]
                best_item_title = item["title"]

        if best_score >= MATCH_THRESHOLD and best_item_id:
            labels[image["id"]] = {
                "imageId": image["id"],
                "imageTitle": image.get("title", ""),
                "heritageItemId": best_item_id,
                "heritageItemTitle": best_item_title,
                "score": best_score,
                "source": image.get("source", ""),
            }

    return labels


# ---------------------------------------------------------------------------
# Apply labels back to catalog
# ---------------------------------------------------------------------------

def apply_labels_to_catalog(
    labels: dict[str, dict[str, Any]],
) -> int:
    """Update image_catalog.json with matched heritageItemIds."""
    updated = 0

    if CATALOG_FILE.is_file():
        with open(CATALOG_FILE, "r", encoding="utf-8") as f:
            catalog = json.load(f)

        for img in catalog.get("images", []):
            if img["id"] in labels:
                img["relatedHeritageItemId"] = labels[img["id"]]["heritageItemId"]
                updated += 1

        with open(CATALOG_FILE, "w", encoding="utf-8") as f:
            json.dump(catalog, f, ensure_ascii=False, indent=2)

        print(f"  Updated {updated} entries in image_catalog.json")

    if ARCHIVES_FILE.is_file():
        with open(ARCHIVES_FILE, "r", encoding="utf-8") as f:
            archives = json.load(f)

        arch_updated = 0
        for img in archives.get("images", []):
            if img["id"] in labels:
                img["relatedHeritageItemId"] = labels[img["id"]]["heritageItemId"]
                arch_updated += 1

        with open(ARCHIVES_FILE, "w", encoding="utf-8") as f:
            json.dump(archives, f, ensure_ascii=False, indent=2)

        print(f"  Updated {arch_updated} entries in archives_yonne_sens.json")
        updated += arch_updated

    return updated


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("=" * 60)
    print("Image Labelling Pipeline — Patrimoine de Sens")
    print("=" * 60)

    # Load data
    print("\n[1/4] Loading heritage items...")
    items = load_heritage_items()
    print(f"  {len(items)} heritage items loaded")

    if not items:
        print("  [FATAL] No heritage items found. Run seed or export first.")
        return

    print("\n[2/4] Loading images...")
    images = load_images()
    print(f"  {len(images)} total images")

    if not images:
        print("  [FATAL] No images found. Run image catalog first.")
        return

    # Build index & match
    print("\n[3/4] Matching images to heritage items...")
    item_index = build_item_index(items)
    labels = match_images(images, item_index)

    # Stats
    matched = len(labels)
    total = len(images)
    print(f"\n  Matched: {matched}/{total} ({matched*100//max(total,1)}%)")

    # Distribution by heritage item
    item_counts: dict[str, int] = {}
    for label in labels.values():
        title = label["heritageItemTitle"]
        item_counts[title] = item_counts.get(title, 0) + 1

    print("\n  Images per heritage item:")
    for title, count in sorted(item_counts.items(), key=lambda x: -x[1])[:15]:
        print(f"    {count:3d}  {title}")

    # Score distribution
    scores = [l["score"] for l in labels.values()]
    if scores:
        print(f"\n  Score range: {min(scores):.0f} – {max(scores):.0f}")
        print(f"  Average score: {sum(scores)/len(scores):.1f}")

    # Save labels
    print(f"\n[4/4] Saving labels...")
    output = {
        "totalImages": total,
        "totalMatched": matched,
        "matchRate": f"{matched*100//max(total,1)}%",
        "threshold": MATCH_THRESHOLD,
        "labels": list(labels.values()),
    }
    with open(OUTPUT_LABELS, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"  Labels saved to: {OUTPUT_LABELS}")

    # Apply to catalogs
    apply_labels_to_catalog(labels)

    print("\nDone.")


if __name__ == "__main__":
    main()
