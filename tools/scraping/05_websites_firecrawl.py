#!/usr/bin/env python3
"""
Scraper sites web patrimoine via Firecrawl + requests.
- tourisme-sens.com (Firecrawl)
- monumentum.fr (requests + BS4)
- petit-patrimoine.com (requests + BS4)
- agendicum.over-blog.com (Firecrawl)
- journals.openedition.org (Firecrawl)

Usage:
    python 05_websites_firecrawl.py
"""

import os
import re
import time
import httpx
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urljoin

from shared import (
    load_config, ensure_dirs, save_json, normalize_item,
    print_banner, OUTPUT_DIR, IMAGES_DIR, slug,
    is_patrimoine_relevant,
)

HEADERS = {
    "User-Agent": "PatrimoineSens-Research/1.0 (heritage documentation project)",
}


# =============================================================================
# Firecrawl (si clé dispo, sinon fallback requests)
# =============================================================================

def firecrawl_available() -> bool:
    return bool(os.getenv("FIRECRAWL_API_KEY"))


def firecrawl_crawl(url: str, max_pages: int = 100) -> list[dict]:
    """Crawl un site via Firecrawl API."""
    api_key = os.getenv("FIRECRAWL_API_KEY")
    if not api_key:
        print("  ⚠ FIRECRAWL_API_KEY manquant — fallback requests")
        return []

    try:
        resp = httpx.post(
            "https://api.firecrawl.dev/v1/crawl",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "url": url,
                "limit": max_pages,
                "scrapeOptions": {
                    "formats": ["markdown", "html"],
                    "includeTags": ["article", "main", "section", ".content", ".post"],
                },
            },
            timeout=30,
        )
        resp.raise_for_status()
        job = resp.json()
        job_id = job.get("id", job.get("jobId"))

        if not job_id:
            print(f"  ⚠ Pas de job ID: {job}")
            return []

        # Polling
        for _ in range(60):  # max 5 min
            time.sleep(5)
            status_resp = httpx.get(
                f"https://api.firecrawl.dev/v1/crawl/{job_id}",
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=15,
            )
            status = status_resp.json()
            if status.get("status") == "completed":
                return status.get("data", [])
            if status.get("status") == "failed":
                print(f"  ✗ Crawl échoué: {status}")
                return []
            print(f"  ... crawl en cours ({status.get('status', '?')})")

    except Exception as e:
        print(f"  ⚠ Firecrawl: {e}")

    return []


# =============================================================================
# Fallback: scraping direct requests + BS4
# =============================================================================

def scrape_monumentum(commune_url: str) -> list[dict]:
    """Scrape monumentum.fr pour une commune."""
    items = []
    try:
        resp = httpx.get(commune_url, headers=HEADERS, timeout=15, follow_redirects=True)
        soup = BeautifulSoup(resp.text, "lxml")

        # Chaque monument est dans un bloc
        monuments = soup.select(".monument, .fiche, article, .card")
        if not monuments:
            # Fallback: chercher les liens vers des fiches
            monuments = soup.select("a[href*='/monument/']")

        for mon in monuments:
            link = mon.select_one("a[href]") if mon.name != "a" else mon
            href = link.get("href", "") if link else ""
            if href and not href.startswith("http"):
                href = urljoin(commune_url, href)

            title_el = mon.select_one("h2, h3, .title, strong")
            title = title_el.get_text(strip=True) if title_el else ""
            if not title and link:
                title = link.get_text(strip=True)

            desc_el = mon.select_one("p, .description, .text")
            desc = desc_el.get_text(strip=True) if desc_el else ""

            img_el = mon.select_one("img")
            img = img_el.get("src", "") if img_el else ""
            if img and not img.startswith("http"):
                img = urljoin(commune_url, img)

            if title:
                items.append({
                    "title": title,
                    "content": desc,
                    "url": href,
                    "image": img,
                })

        # Si pas de blocs, scraper la page entière
        if not items:
            main = soup.select_one("main, #content, .content, article")
            if main:
                text = main.get_text(separator="\n", strip=True)
                items.append({
                    "title": f"Monuments historiques - {commune_url.split('/')[-1]}",
                    "content": text[:3000],
                    "url": commune_url,
                    "image": "",
                })

    except Exception as e:
        print(f"  ⚠ Monumentum: {e}")

    return items


def scrape_petit_patrimoine(departement: str, commune: str) -> list[dict]:
    """Scrape petit-patrimoine.com."""
    items = []
    try:
        resp = httpx.get(
            "https://www.petit-patrimoine.com/recherche.php",
            params={"departement": departement, "commune": commune},
            headers=HEADERS,
            timeout=15,
            follow_redirects=True,
        )
        soup = BeautifulSoup(resp.text, "lxml")

        fiches = soup.select(".fiche, .result, article, .card, tr")
        for fiche in fiches:
            link = fiche.select_one("a[href]")
            if not link:
                continue
            href = link.get("href", "")
            if not href.startswith("http"):
                href = urljoin("https://www.petit-patrimoine.com/", href)

            title = link.get_text(strip=True)
            img_el = fiche.select_one("img")
            img = ""
            if img_el:
                img = img_el.get("src", "")
                if not img.startswith("http"):
                    img = urljoin("https://www.petit-patrimoine.com/", img)

            if title and "patrimoine" not in title.lower():
                # C'est probablement le nom du patrimoine
                pass

            if title:
                items.append({
                    "title": title,
                    "content": "",
                    "url": href,
                    "image": img,
                })

        # Récupérer le détail de chaque fiche
        for item in items[:30]:  # max 30 fiches
            if item["url"]:
                detail = scrape_page_content(item["url"])
                item["content"] = detail.get("content", "")
                if not item["image"] and detail.get("images"):
                    item["image"] = detail["images"][0]
                time.sleep(0.5)

    except Exception as e:
        print(f"  ⚠ Petit-patrimoine: {e}")

    return items


def scrape_page_content(url: str) -> dict:
    """Scrape le contenu principal d'une page web."""
    try:
        resp = httpx.get(url, headers=HEADERS, timeout=15, follow_redirects=True)
        soup = BeautifulSoup(resp.text, "lxml")

        # Contenu principal
        main = soup.select_one("article, main, .content, #content, .post-content, .entry-content")
        if not main:
            main = soup.select_one("body")

        content = main.get_text(separator="\n\n", strip=True) if main else ""

        # Images
        images = []
        for img in (main or soup).select("img"):
            src = img.get("src", "")
            if src and not any(skip in src.lower() for skip in ["logo", "icon", "avatar", "pixel"]):
                if not src.startswith("http"):
                    src = urljoin(url, src)
                images.append(src)

        return {"content": content[:5000], "images": images[:10]}

    except Exception:
        return {"content": "", "images": []}


def scrape_blog_sitemap(base_url: str) -> list[str]:
    """Récupère les URLs d'un blog via sitemap ou pagination."""
    urls = []

    # Essayer le sitemap
    for sitemap_path in ["/sitemap.xml", "/sitemap_index.xml"]:
        try:
            resp = httpx.get(
                base_url + sitemap_path,
                headers=HEADERS,
                timeout=10,
                follow_redirects=True,
            )
            if resp.status_code == 200 and "xml" in resp.headers.get("content-type", ""):
                soup = BeautifulSoup(resp.text, "xml")
                for loc in soup.select("loc"):
                    url = loc.get_text(strip=True)
                    if url and "/article-" in url or "/tag/" not in url:
                        urls.append(url)
                if urls:
                    return urls[:200]
        except Exception:
            pass

    # Fallback: pagination du blog
    for page in range(1, 50):
        try:
            resp = httpx.get(
                f"{base_url}/page/{page}" if page > 1 else base_url,
                headers=HEADERS,
                timeout=10,
                follow_redirects=True,
            )
            if resp.status_code != 200:
                break
            soup = BeautifulSoup(resp.text, "lxml")
            links = soup.select("a[href*='article'], a[href*='.html'], h2 a, h3 a, .post-title a")
            if not links:
                break
            for link in links:
                href = link.get("href", "")
                if href and href.startswith("http"):
                    urls.append(href)
                elif href:
                    urls.append(urljoin(base_url, href))
            time.sleep(0.5)
        except Exception:
            break

    return list(dict.fromkeys(urls))[:200]


def main():
    print_banner("Scraping sites web patrimoine Sens")
    config = load_config()
    ensure_dirs()

    all_items = []

    for site_cfg in config["websites"]:
        name = site_cfg["name"]
        print(f"\n{'─'*40}")
        print(f"SITE: {name}")
        print(f"{'─'*40}")

        raw_items = []

        if name == "monumentum-sens":
            url = site_cfg["url"]
            raw_items = scrape_monumentum(url)
            print(f"  {len(raw_items)} fiches")

        elif name == "petit-patrimoine-sens":
            params = site_cfg.get("params", {})
            raw_items = scrape_petit_patrimoine(
                params.get("departement", "89"),
                params.get("commune", "Sens"),
            )
            print(f"  {len(raw_items)} fiches")

        elif name == "agendicum-blog":
            url = site_cfg["url"]
            print(f"  Découverte des articles du blog...")
            article_urls = scrape_blog_sitemap(url)
            print(f"  {len(article_urls)} articles trouvés")

            for art_url in article_urls:
                detail = scrape_page_content(art_url)
                if detail["content"] and len(detail["content"]) > 100:
                    # Extraire le titre de l'URL
                    title = art_url.split("/")[-1].replace(".html", "").replace("-", " ").title()
                    raw_items.append({
                        "title": title,
                        "content": detail["content"],
                        "url": art_url,
                        "image": detail["images"][0] if detail["images"] else "",
                    })
                time.sleep(0.3)

            print(f"  {len(raw_items)} articles avec contenu")

        elif name == "wikipedia-sens":
            continue  # Géré par 04_wikipedia_commons.py

        elif site_cfg.get("method") == "firecrawl":
            url = site_cfg.get("url", site_cfg.get("base_url", ""))
            if firecrawl_available():
                pages = firecrawl_crawl(url)
                for p in pages:
                    raw_items.append({
                        "title": p.get("metadata", {}).get("title", ""),
                        "content": p.get("markdown", p.get("content", "")),
                        "url": p.get("metadata", {}).get("sourceURL", url),
                        "image": p.get("metadata", {}).get("ogImage", ""),
                    })
            else:
                # Fallback sans Firecrawl
                detail = scrape_page_content(url)
                if detail["content"]:
                    raw_items.append({
                        "title": name,
                        "content": detail["content"],
                        "url": url,
                        "image": detail["images"][0] if detail["images"] else "",
                    })

            print(f"  {len(raw_items)} pages")

        # Normaliser
        for raw in raw_items:
            content = raw.get("content", "")
            is_cailleaux = "cailleaux" in content.lower()
            images = [raw["image"]] if raw.get("image") else []

            item = normalize_item(
                source=f"web_{slug(name)}",
                title=raw.get("title", name),
                content=content,
                url=raw.get("url", ""),
                images=images,
                tags=["web", name],
                is_cailleaux=is_cailleaux,
            )
            all_items.append(item)

    # Download images
    print(f"\n→ Téléchargement images sites web...")
    total_images = 0
    for item in all_items:
        if item["images"]:
            img_dir = IMAGES_DIR / "websites"
            for i, url in enumerate(item["images"][:3]):
                try:
                    resp = httpx.get(url, timeout=10, follow_redirects=True)
                    if resp.status_code == 200 and len(resp.content) > 2000:
                        fname = f"{slug(item['title'][:40])}_{i:02d}.jpg"
                        (img_dir / fname).write_bytes(resp.content)
                        total_images += 1
                except Exception:
                    pass

    cailleaux = [i for i in all_items if i["is_cailleaux"]]

    print(f"\n{'='*60}")
    print(f"  TOTAL: {len(all_items)} pages/fiches")
    print(f"  Images: {total_images}")
    print(f"  Mentions Cailleaux: {len(cailleaux)}")
    print(f"{'='*60}")

    save_json(all_items, OUTPUT_DIR / "websites" / "all_pages.json")


if __name__ == "__main__":
    main()
