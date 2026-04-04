#!/usr/bin/env python3
"""
Scraper Wikipedia + Wikimedia Commons.
API MediaWiki structurée — textes + images libres de droits.

Usage:
    python 04_wikipedia_commons.py
"""

import time
import httpx
from pathlib import Path

from shared import (
    load_config, ensure_dirs, save_json, normalize_item,
    print_banner, OUTPUT_DIR, IMAGES_DIR, slug,
)

WIKI_API = "https://fr.wikipedia.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"


def get_wiki_article(title: str) -> dict:
    """Récupère un article Wikipedia via l'API."""
    params = {
        "action": "query",
        "titles": title,
        "prop": "extracts|coordinates|images|categories|info",
        "exintro": False,
        "explaintext": True,
        "inprop": "url",
        "format": "json",
    }

    resp = httpx.get(WIKI_API, params=params, timeout=15)
    resp.raise_for_status()
    pages = resp.json().get("query", {}).get("pages", {})

    for page_id, page in pages.items():
        if page_id == "-1":
            return {}
        return page

    return {}


def get_wiki_images(title: str) -> list[dict]:
    """Récupère les images d'un article Wikipedia."""
    params = {
        "action": "query",
        "titles": title,
        "prop": "images",
        "imlimit": 50,
        "format": "json",
    }

    resp = httpx.get(WIKI_API, params=params, timeout=15)
    pages = resp.json().get("query", {}).get("pages", {})

    image_titles = []
    for page in pages.values():
        for img in page.get("images", []):
            title = img.get("title", "")
            # Filtrer les icônes/logos
            if any(skip in title.lower() for skip in [
                "icon", "logo", "flag", "coat", "commons-logo",
                "wikidata", "edit-clear", "crystal", "nuvola",
                "disambig", "stub", ".svg",
            ]):
                continue
            image_titles.append(title)

    # Récupérer les URLs des images
    images = []
    for img_title in image_titles[:15]:
        url = get_commons_image_url(img_title)
        if url:
            images.append({"title": img_title, "url": url})
        time.sleep(0.2)

    return images


def get_commons_image_url(file_title: str) -> str:
    """Récupère l'URL directe d'un fichier Commons."""
    params = {
        "action": "query",
        "titles": file_title,
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "format": "json",
    }

    try:
        resp = httpx.get(COMMONS_API, params=params, timeout=10)
        pages = resp.json().get("query", {}).get("pages", {})
        for page in pages.values():
            info = page.get("imageinfo", [{}])[0]
            url = info.get("url", "")
            mime = info.get("mime", "")
            if "image" in mime:
                return url
    except Exception:
        pass
    return ""


def search_commons_category(category: str) -> list[dict]:
    """Recherche des images dans une catégorie Commons."""
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": f"Category:{category}",
        "cmtype": "file",
        "cmlimit": 50,
        "format": "json",
    }

    try:
        resp = httpx.get(COMMONS_API, params=params, timeout=15)
        members = resp.json().get("query", {}).get("categorymembers", [])

        images = []
        for m in members:
            title = m.get("title", "")
            if any(ext in title.lower() for ext in [".jpg", ".jpeg", ".png", ".tif"]):
                url = get_commons_image_url(title)
                if url:
                    images.append({"title": title, "url": url})
                time.sleep(0.2)

        return images
    except Exception as e:
        print(f"  ⚠ Catégorie {category}: {e}")
        return []


def download_wiki_images(images: list[dict], dest_dir: Path) -> list[str]:
    """Télécharge les images Wikimedia."""
    local = []
    dest_dir.mkdir(parents=True, exist_ok=True)

    for img in images[:10]:
        url = img["url"]
        try:
            resp = httpx.get(url, timeout=20, follow_redirects=True)
            if resp.status_code == 200 and len(resp.content) > 5000:
                ext = "jpg" if "jpeg" in url.lower() or "jpg" in url.lower() else "png"
                fname = slug(img["title"])[:60] + f".{ext}"
                path = dest_dir / fname
                path.write_bytes(resp.content)
                local.append(str(path))
        except Exception:
            pass
        time.sleep(0.3)

    return local


def url_to_title(url: str) -> str:
    """Extrait le titre Wikipedia d'une URL."""
    # https://fr.wikipedia.org/wiki/Cathédrale_Saint-Étienne_de_Sens
    parts = url.split("/wiki/")
    if len(parts) == 2:
        return parts[1].replace("_", " ")
    return ""


def main():
    print_banner("Scraping Wikipedia + Wikimedia Commons")
    config = load_config()
    ensure_dirs()

    all_items = []
    all_commons_images = []

    # 1. Articles Wikipedia
    wiki_cfg = next(
        (w for w in config["websites"] if w["name"] == "wikipedia-sens"),
        None,
    )
    if wiki_cfg:
        print("\n→ Articles Wikipedia")
        for url in wiki_cfg["urls"]:
            title = url_to_title(url)
            if not title:
                continue

            print(f"  • {title}")
            article = get_wiki_article(title)
            if not article:
                print(f"    (non trouvé)")
                continue

            extract = article.get("extract", "")
            coords = article.get("coordinates", [{}])
            location = None
            if coords:
                location = {
                    "lat": coords[0].get("lat"),
                    "lng": coords[0].get("lon"),
                }

            # Images
            images = get_wiki_images(title)
            print(f"    {len(extract)} chars, {len(images)} images")

            # Télécharger les images
            img_dir = IMAGES_DIR / "wikipedia" / slug(title)
            local_imgs = download_wiki_images(images, img_dir)

            # Détecter mentions Cailleaux
            is_cailleaux = "cailleaux" in extract.lower()

            item = normalize_item(
                source="wikipedia",
                title=title.replace("%27", "'"),
                content=extract,
                url=url,
                author="Wikipedia",
                images=[img["url"] for img in images],
                location=location,
                tags=["wikipedia", "encyclopédie"],
                metadata={
                    "page_id": article.get("pageid"),
                    "categories": [
                        c.get("title", "") for c in article.get("categories", [])
                    ],
                    "images_local": local_imgs,
                },
                is_cailleaux=is_cailleaux,
            )
            all_items.append(item)
            time.sleep(0.5)

    # 2. Wikimedia Commons — catégories
    print("\n→ Wikimedia Commons — catégories")
    commons_cfg = config.get("commons", {})
    for category in commons_cfg.get("categories", []):
        print(f"  • Category:{category}")
        images = search_commons_category(category)
        print(f"    {len(images)} images")

        # Télécharger
        img_dir = IMAGES_DIR / "commons" / slug(category)
        local = download_wiki_images(images, img_dir)

        for img in images:
            img["local_path"] = ""
        for i, path in enumerate(local):
            if i < len(images):
                images[i]["local_path"] = path

        all_commons_images.extend(images)
        time.sleep(1)

    # Stats
    total_images = sum(
        len(item.get("metadata", {}).get("images_local", []))
        for item in all_items
    ) + len(all_commons_images)

    print(f"\n{'='*60}")
    print(f"  Articles Wikipedia: {len(all_items)}")
    print(f"  Images Commons: {len(all_commons_images)}")
    print(f"  Total images: {total_images}")
    print(f"{'='*60}")

    save_json(all_items, OUTPUT_DIR / "wikipedia" / "all_articles.json")
    save_json(all_commons_images, OUTPUT_DIR / "commons" / "all_images.json")


if __name__ == "__main__":
    main()
