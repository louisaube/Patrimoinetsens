#!/usr/bin/env python3
"""
Scraper Facebook via Apify — groupe + pages patrimoine Sens.

Utilise les actors Apify pré-faits pour Facebook.
Récupère posts, commentaires, images.
Attention particulière aux posts/commentaires de Denis Cailleaux.

Usage:
    python 03_facebook_apify.py
"""

import os
import time
import httpx
from pathlib import Path

from apify_client import ApifyClient

from shared import (
    load_config, ensure_dirs, save_json, normalize_item,
    print_banner, OUTPUT_DIR, IMAGES_DIR, slug,
    is_patrimoine_relevant,
)

def get_client() -> ApifyClient:
    api_key = os.getenv("APIFY_API_KEY")
    if not api_key:
        raise RuntimeError("APIFY_API_KEY manquant dans .env")
    return ApifyClient(api_key)


def get_fb_cookie() -> str:
    """Construit le cookie Facebook depuis les variables d'env."""
    c_user = os.getenv("FB_C_USER", "")
    xs = os.getenv("FB_XS", "")
    if not c_user or not xs:
        print("  !! FB_C_USER et FB_XS requis dans .env pour scraper Facebook")
        return ""
    return f"c_user={c_user}; xs={xs}"


def scrape_facebook_group(client: ApifyClient, group_url: str, max_posts: int) -> list[dict]:
    """Scrape un groupe Facebook via Apify avec cookie auth.

    Utilise easyapi/facebook-group-posts-scraper qui supporte le login
    pour les groupes privés.
    """
    cookie = get_fb_cookie()
    if not cookie:
        return []

    print(f"  Lancement actor easyapi/facebook-group-posts-scraper...")
    print(f"  URL: {group_url}")
    print(f"  Max posts: {max_posts}")

    # Actor easyapi: groupUrls (pluriel, liste) + maxItems
    run_input = {
        "groupUrls": [group_url],
        "maxItems": max_posts,
        "cookie": cookie,
    }

    try:
        run = client.actor("easyapi/facebook-group-posts-scraper").call(
            run_input=run_input,
            timeout_secs=600,
        )
        items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        print(f"  OK {len(items)} posts recuperes")
        return items
    except Exception as e:
        print(f"  !! Erreur easyapi: {e}")
        # Fallback: actor officiel (groupes publics seulement)
        print(f"  Fallback: apify/facebook-groups-scraper...")
        try:
            run_input2 = {
                "startUrls": [{"url": group_url}],
                "resultsLimit": max_posts,
            }
            run = client.actor("apify/facebook-groups-scraper").call(run_input=run_input2)
            items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
            print(f"  OK {len(items)} posts (fallback)")
            return items
        except Exception as e2:
            print(f"  !! Echec total: {e2}")
            return []


def scrape_facebook_page(client: ApifyClient, page_url: str, max_posts: int) -> list[dict]:
    """Scrape une page Facebook via Apify avec cookie auth."""
    cookie = get_fb_cookie()
    if not cookie:
        return []

    print(f"  Lancement actor facebook-pages-scraper...")
    print(f"  URL: {page_url}")

    run_input = {
        "startUrls": [{"url": page_url}],
        "maxPosts": max_posts,
        "maxComments": 30,
        "maxCommentsPerPost": 30,
        "cookie": cookie,
    }

    try:
        run = client.actor("apify/facebook-pages-scraper").call(run_input=run_input)
        items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        print(f"  OK {len(items)} posts recuperes")
        return items
    except Exception as e:
        print(f"  !! Erreur page: {e}")
        return []


def extract_comments(post: dict) -> list[dict]:
    """Extrait les commentaires d'un post Facebook."""
    comments = []
    for key in ["comments", "topLevelComments", "latestComments"]:
        raw = post.get(key, [])
        if isinstance(raw, list):
            for c in raw:
                if isinstance(c, dict):
                    comments.append({
                        "author": c.get("authorName", c.get("name", "")),
                        "text": c.get("text", c.get("message", "")),
                        "date": c.get("date", c.get("timestamp", "")),
                        "likes": c.get("likesCount", 0),
                    })
    return comments


def extract_images_from_post(post: dict) -> list[str]:
    """Extrait les URLs d'images d'un post Facebook."""
    images = []
    # Champs courants selon l'actor
    for key in ["images", "media", "photos", "attachments"]:
        raw = post.get(key, [])
        if isinstance(raw, list):
            for item in raw:
                if isinstance(item, str) and item.startswith("http"):
                    images.append(item)
                elif isinstance(item, dict):
                    url = item.get("url", item.get("src", item.get("full_size", "")))
                    if url and url.startswith("http"):
                        images.append(url)
    # Image principale
    main_img = post.get("imageUrl", post.get("image", ""))
    if main_img and main_img.startswith("http"):
        images.insert(0, main_img)
    return list(dict.fromkeys(images))  # dédupliquer en gardant l'ordre


def download_fb_images(images: list[str], dest_dir: Path, prefix: str) -> list[str]:
    """Télécharge les images Facebook."""
    local = []
    for i, url in enumerate(images[:5]):  # max 5 par post
        try:
            resp = httpx.get(url, timeout=15, follow_redirects=True)
            if resp.status_code == 200 and len(resp.content) > 2000:
                fname = f"{prefix}_{i:02d}.jpg"
                path = dest_dir / fname
                path.write_bytes(resp.content)
                local.append(str(path))
        except Exception:
            pass
    return local


def process_posts(
    posts: list[dict],
    source_name: str,
    keywords: list[str],
    priority_authors: list[str],
) -> list[dict]:
    """Traite les posts Facebook et retourne des items normalisés."""
    items = []
    priority_lower = [a.lower() for a in priority_authors]

    for post in posts:
        text = post.get("text", post.get("message", post.get("postText", "")))
        author = post.get("authorName", post.get("name", post.get("pageName", "")))
        date = post.get("date", post.get("timestamp", post.get("time", "")))
        url = post.get("url", post.get("postUrl", ""))
        images = extract_images_from_post(post)
        comments = extract_comments(post)

        # Check si le post ou ses commentaires sont pertinents
        all_text = text or ""
        for c in comments:
            all_text += " " + (c.get("text", "") or "")

        is_relevant = is_patrimoine_relevant(all_text, keywords)
        has_priority_author = any(pa in (author or "").lower() for pa in priority_lower)
        has_priority_comment = any(
            any(pa in (c.get("author", "") or "").lower() for pa in priority_lower)
            for c in comments
        )

        if not (is_relevant or has_priority_author or has_priority_comment):
            continue

        # Marquer les commentaires Cailleaux
        is_cailleaux = "cailleaux" in (author or "").lower()
        cailleaux_comments = [
            c for c in comments
            if "cailleaux" in (c.get("author", "") or "").lower()
        ]

        item = normalize_item(
            source=f"facebook_{source_name}",
            title=text[:120] + "..." if text and len(text) > 120 else (text or "(sans texte)"),
            content=text or "",
            url=url,
            author=author,
            date=str(date),
            images=images,
            tags=["facebook", source_name],
            metadata={
                "comments": comments,
                "comments_count": len(comments),
                "cailleaux_comments": cailleaux_comments,
                "has_priority_author": has_priority_author or has_priority_comment,
                "likes": post.get("likes", post.get("likesCount", 0)),
                "shares": post.get("shares", post.get("sharesCount", 0)),
            },
            is_cailleaux=is_cailleaux or len(cailleaux_comments) > 0,
        )
        items.append(item)

    return items


def main():
    print_banner("Scraping Facebook — Patrimoine Sens (via Apify)")
    config = load_config()
    ensure_dirs()
    fb_cfg = config["facebook"]
    keywords = fb_cfg.get("keywords_patrimoine", [])
    priority_authors = fb_cfg.get("priority_authors", [])

    client = get_client()
    all_items = []

    # 1. Groupe principal
    group_cfg = fb_cfg["group"]
    print(f"\n{'─'*40}")
    print(f"GROUPE: {group_cfg['url']}")
    print(f"{'─'*40}")
    posts = scrape_facebook_group(client, group_cfg["url"], group_cfg["max_posts"])
    items = process_posts(posts, "groupe-histoire-sens", keywords, priority_authors)
    print(f"  → {len(items)} posts patrimoine pertinents")
    all_items.extend(items)

    # Sauvegarder les posts bruts aussi (pour debug)
    save_json(posts, OUTPUT_DIR / "facebook" / "groupe_raw.json")

    # 2. Pages Facebook
    for page_cfg in fb_cfg.get("pages", []):
        print(f"\n{'─'*40}")
        print(f"PAGE: {page_cfg['name']}")
        print(f"{'─'*40}")
        posts = scrape_facebook_page(client, page_cfg["url"], page_cfg["max_posts"])
        name_slug = slug(page_cfg["name"])
        items = process_posts(posts, name_slug, keywords, priority_authors)
        print(f"  → {len(items)} posts patrimoine pertinents")
        all_items.extend(items)

        save_json(posts, OUTPUT_DIR / "facebook" / f"{name_slug}_raw.json")

    # 3. Télécharger les images des posts pertinents
    print(f"\n→ Téléchargement images...")
    total_images = 0
    img_dir = IMAGES_DIR / "facebook"
    for item in all_items:
        if item["images"]:
            prefix = slug(item["title"][:40])
            local = download_fb_images(item["images"], img_dir, prefix)
            item["images_local"] = local
            total_images += len(local)

    # Stats
    cailleaux_items = [i for i in all_items if i["is_cailleaux"]]

    print(f"\n{'='*60}")
    print(f"  TOTAL posts pertinents: {len(all_items)}")
    print(f"  Images téléchargées: {total_images}")
    print(f"  Posts/commentaires Cailleaux: {len(cailleaux_items)}")
    print(f"{'='*60}")

    save_json(all_items, OUTPUT_DIR / "facebook" / "all_posts.json")
    if cailleaux_items:
        save_json(cailleaux_items, OUTPUT_DIR / "facebook" / "cailleaux_posts.json")


if __name__ == "__main__":
    main()
