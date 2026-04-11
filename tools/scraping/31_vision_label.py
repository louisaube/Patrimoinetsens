#!/usr/bin/env python3
"""
31_vision_label.py — Label unmatched images using Mistral Vision (Pixtral).

For each unmatched image in the catalog, sends the thumbnail to Mistral Vision
with the list of heritage items, and asks it to identify which item (if any)
the image depicts.

Requires: MISTRAL_API_KEY in .env.local
Output: Updates image_catalog.json with newly labeled images
"""

import sys
import os
import json
import time
import base64
import re
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Load env
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env.local")

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
CATALOG_FILE = OUTPUT_DIR / "image_catalog.json"
HERITAGE_JSON = BASE_DIR.parent.parent / "public" / "data" / "heritage-items.json"
VISION_LABELS_FILE = OUTPUT_DIR / "vision_labels.json"

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", "")
MISTRAL_MODEL = "pixtral-large-latest"
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

BATCH_DELAY = 6.0  # seconds between API calls (Mistral rate limit: ~10 req/min)
MAX_IMAGES = 100   # safety limit per run
MAX_RETRIES = 3    # retries on 429


def load_heritage_items() -> list[dict[str, Any]]:
    """Load heritage items for the prompt context."""
    with open(HERITAGE_JSON, "r", encoding="utf-8") as f:
        items = json.load(f)
    return items


def build_items_list(items: list[dict[str, Any]]) -> str:
    """Build a compact list of heritage items for the vision prompt."""
    lines = []
    for item in items:
        title = item.get("title", "")
        cat = item.get("category", "")
        item_id = item.get("id", "")
        lines.append(f"- [{item_id}] {title} ({cat})")
    return "\n".join(lines)


def load_unmatched_images() -> list[dict[str, Any]]:
    """Load images that don't have a relatedHeritageItemId."""
    with open(CATALOG_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    unmatched = []
    for img in data.get("images", []):
        if img.get("relatedHeritageItemId"):
            continue
        # Only process images with accessible URLs
        url = img.get("thumbnail") or img.get("url", "")
        if not url or "ico_visu.gif" in url or "inventaire.png" in url:
            continue
        if "plus_pt.gif" in url or "moins_pt.gif" in url:
            continue
        unmatched.append(img)

    return unmatched


def call_mistral_vision(image_url: str, items_list: str, image_title: str) -> dict[str, Any] | None:
    """
    Send an image to Mistral Vision and ask it to identify the heritage item.
    Returns {"heritageItemId": "...", "confidence": "high|medium|low", "description": "..."}
    or None if no match.
    """
    if not MISTRAL_API_KEY:
        print("  [ERROR] MISTRAL_API_KEY not set")
        return None

    prompt = f"""Tu es un expert en patrimoine architectural et historique de la ville de Sens (Yonne, Bourgogne).

Regarde cette image. Son titre dans le catalogue est : "{image_title}"

Voici la liste des éléments patrimoniaux de Sens dans notre base de données :
{items_list}

TÂCHE : Identifie quel élément patrimonial cette image représente.

Réponds UNIQUEMENT avec un JSON valide, sans markdown :
{{"heritageItemId": "l'ID entre crochets ou null si non identifiable", "confidence": "high ou medium ou low", "description": "description courte en français de ce que montre l'image (max 15 mots)"}}

Si l'image ne correspond à aucun élément de la liste, ou si elle est illisible/trop floue, réponds :
{{"heritageItemId": null, "confidence": "low", "description": "image non identifiable"}}"""

    payload = {
        "model": MISTRAL_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            }
        ],
        "max_tokens": 200,
        "temperature": 0.1,
    }

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }

    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.post(MISTRAL_API_URL, json=payload, headers=headers, timeout=60)
            if resp.status_code == 429:
                wait = 15 * (attempt + 1)
                print(f"\n    [429] Rate limited, waiting {wait}s (attempt {attempt+1}/{MAX_RETRIES})...", end=" ", flush=True)
                time.sleep(wait)
                continue
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"].strip()

            # Parse JSON from response (handle markdown code blocks)
            content = re.sub(r"^```json\s*", "", content)
            content = re.sub(r"\s*```$", "", content)

            result = json.loads(content)
            return result

        except json.JSONDecodeError as e:
            print(f"\n    [WARN] Invalid JSON response: {content[:100]}... ({e})")
            return None
        except requests.exceptions.RequestException as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(10)
                continue
            print(f"\n    [ERROR] API call failed after {MAX_RETRIES} attempts: {e}")
            return None
        except (KeyError, IndexError) as e:
            print(f"\n    [ERROR] Unexpected response format: {e}")
            return None

    return None


def apply_vision_labels(labels: list[dict[str, Any]]) -> int:
    """Apply vision labels back to the catalog."""
    with open(CATALOG_FILE, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    label_map = {l["imageId"]: l["heritageItemId"] for l in labels if l.get("heritageItemId")}

    updated = 0
    for img in catalog.get("images", []):
        if img["id"] in label_map and not img.get("relatedHeritageItemId"):
            img["relatedHeritageItemId"] = label_map[img["id"]]
            updated += 1

    with open(CATALOG_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    return updated


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("=" * 60)
    print("Vision Labelling — Mistral Pixtral")
    print("=" * 60)

    if not MISTRAL_API_KEY:
        print("[FATAL] MISTRAL_API_KEY not found in .env.local")
        return

    # Load data
    print("\n[1/4] Loading heritage items...")
    items = load_heritage_items()
    items_list = build_items_list(items)
    print(f"  {len(items)} items loaded")

    print("\n[2/4] Loading unmatched images...")
    unmatched = load_unmatched_images()
    print(f"  {len(unmatched)} unmatched images")

    if not unmatched:
        print("  Nothing to do!")
        return

    # Process images
    to_process = unmatched[:MAX_IMAGES]
    print(f"\n[3/4] Processing {len(to_process)} images with Mistral Vision...")

    results: list[dict[str, Any]] = []
    matched_count = 0

    for i, img in enumerate(to_process):
        url = img.get("thumbnail") or img.get("url", "")
        title = img.get("title", "unknown")
        print(f"  [{i+1}/{len(to_process)}] {title[:60]}...", end=" ", flush=True)

        result = call_mistral_vision(url, items_list, title)

        if result and result.get("heritageItemId"):
            confidence = result.get("confidence", "?")
            desc = result.get("description", "")
            print(f"→ MATCH ({confidence}): {desc}")
            results.append({
                "imageId": img["id"],
                "imageTitle": title,
                "heritageItemId": result["heritageItemId"],
                "confidence": confidence,
                "description": desc,
                "source": img.get("source", ""),
            })
            matched_count += 1
        elif result:
            print(f"→ no match ({result.get('description', '?')})")
        else:
            print("→ error")

        time.sleep(BATCH_DELAY)

    # Stats
    print(f"\n  New matches: {matched_count}/{len(to_process)}")

    # Confidence distribution
    from collections import Counter
    conf = Counter(r.get("confidence") for r in results)
    for c, n in conf.most_common():
        print(f"    {c}: {n}")

    # Save vision labels
    print(f"\n[4/4] Saving...")
    output = {
        "model": MISTRAL_MODEL,
        "processed": len(to_process),
        "matched": matched_count,
        "labels": results,
    }
    with open(VISION_LABELS_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"  Vision labels: {VISION_LABELS_FILE}")

    # Apply to catalog
    updated = apply_vision_labels(results)
    print(f"  Updated {updated} entries in image_catalog.json")

    # Final stats
    with open(CATALOG_FILE, "r", encoding="utf-8") as f:
        catalog = json.load(f)
    total = len(catalog.get("images", []))
    labeled = sum(1 for i in catalog.get("images", []) if i.get("relatedHeritageItemId"))
    print(f"\n  Total coverage: {labeled}/{total} ({labeled*100//max(total,1)}%)")

    print("\nDone.")


if __name__ == "__main__":
    main()
