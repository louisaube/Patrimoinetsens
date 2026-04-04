#!/usr/bin/env python3
"""
Scraper Persée — publications académiques.
Focus Denis Cailleaux + autres auteurs sur Sens.

Persée expose une API OAI-PMH + des pages web structurées.

Usage:
    python 02_persee_cailleaux.py
"""

import re
import time
import httpx
from bs4 import BeautifulSoup
from pathlib import Path

from shared import (
    load_config, ensure_dirs, save_json, normalize_item,
    print_banner, OUTPUT_DIR, slug,
)

PERSEE_SEARCH = "https://www.persee.fr/search"
PERSEE_BASE = "https://www.persee.fr"


def search_persee(query: str, max_pages: int = 10) -> list[dict]:
    """Recherche dans Persée et retourne les résultats."""
    results = []

    for page in range(1, max_pages + 1):
        params = {
            "ta": "article",
            "q": query,
            "p": str(page),
        }

        try:
            resp = httpx.get(
                PERSEE_SEARCH,
                params=params,
                timeout=20,
                follow_redirects=True,
                headers={"User-Agent": "PatrimoineSens-Research/1.0 (heritage research project)"},
            )
            if resp.status_code != 200:
                break

            soup = BeautifulSoup(resp.text, "lxml")
            articles = soup.select(".result-item, .search-result-item, article.result")

            if not articles:
                # Fallback: chercher les liens d'articles
                articles = soup.select("a[href*='/doc/']")
                if not articles:
                    break

            for art in articles:
                link = art.select_one("a[href]") if art.name != "a" else art
                if not link:
                    continue
                href = link.get("href", "")
                if not href.startswith("http"):
                    href = PERSEE_BASE + href

                title_el = art.select_one("h2, h3, .title, .result-title") or link
                title = title_el.get_text(strip=True) if title_el else ""

                # Auteur
                author_el = art.select_one(".author, .authors, .result-author")
                author = author_el.get_text(strip=True) if author_el else ""

                # Résumé
                abstract_el = art.select_one(".abstract, .summary, .result-abstract, p")
                abstract = abstract_el.get_text(strip=True) if abstract_el else ""

                # Revue + date
                meta_el = art.select_one(".meta, .journal, .result-journal")
                meta = meta_el.get_text(strip=True) if meta_el else ""

                if title:
                    results.append({
                        "title": title,
                        "url": href,
                        "author": author,
                        "abstract": abstract,
                        "journal_meta": meta,
                    })

            print(f"  Page {page}: {len(articles)} articles trouvés")
            time.sleep(1)  # politesse Persée

        except Exception as e:
            print(f"  ⚠ Erreur page {page}: {e}")
            break

    return results


def fetch_article_detail(url: str) -> dict:
    """Récupère le contenu détaillé d'un article Persée."""
    try:
        resp = httpx.get(
            url,
            timeout=20,
            follow_redirects=True,
            headers={"User-Agent": "PatrimoineSens-Research/1.0"},
        )
        if resp.status_code != 200:
            return {}

        soup = BeautifulSoup(resp.text, "lxml")

        # Titre complet
        title = ""
        title_el = soup.select_one("h1, .document-title, .notice-title")
        if title_el:
            title = title_el.get_text(strip=True)

        # Auteurs
        authors = []
        for a in soup.select(".author a, .authors a, [class*='author'] a"):
            authors.append(a.get_text(strip=True))

        # Résumé / abstract
        abstract = ""
        for sel in [".abstract", ".resume", "#abstract", "[class*='abstract']"]:
            el = soup.select_one(sel)
            if el:
                abstract = el.get_text(strip=True)
                break

        # Contenu principal (si accessible)
        content = ""
        body = soup.select_one(".document-body, .article-body, #text, .fulltext")
        if body:
            content = body.get_text(separator="\n\n", strip=True)

        # Métadonnées
        journal = ""
        date = ""
        for meta in soup.select("meta"):
            name = meta.get("name", "").lower()
            prop = meta.get("property", "").lower()
            val = meta.get("content", "")
            if "journal" in name or "source" in name:
                journal = val
            if "date" in name or "year" in name:
                date = val
            if "citation_journal_title" in name:
                journal = val
            if "citation_date" in name or "citation_year" in name:
                date = val

        # DOI
        doi = ""
        doi_el = soup.select_one("a[href*='doi.org']")
        if doi_el:
            doi = doi_el.get("href", "")

        return {
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "content": content[:5000],  # tronquer les très longs articles
            "journal": journal,
            "date": date,
            "doi": doi,
        }

    except Exception as e:
        print(f"  ⚠ Détail {url[:60]}: {e}")
        return {}


def main():
    print_banner("Scraping Persée — Publications académiques")
    config = load_config()
    ensure_dirs()
    persee_cfg = config["persee"]

    all_items = []

    # 1. Recherche par auteur prioritaire
    for author_cfg in persee_cfg["authors"]:
        name = author_cfg["name"]
        query = author_cfg["search"]
        print(f"\n→ Auteur: {name} — query: '{query}'")

        results = search_persee(query)
        print(f"  {len(results)} résultats bruts")

        for r in results:
            # Vérifier si l'auteur est bien dans les résultats
            is_author = name.lower() in r.get("author", "").lower()
            is_cailleaux = "cailleaux" in r.get("author", "").lower()

            # Récupérer le détail
            detail = fetch_article_detail(r["url"])
            time.sleep(0.5)

            if detail.get("authors"):
                is_author = any(name.lower() in a.lower() for a in detail["authors"])
                is_cailleaux = any("cailleaux" in a.lower() for a in detail["authors"])

            content = detail.get("content") or detail.get("abstract") or r.get("abstract", "")
            title = detail.get("title") or r["title"]

            item = normalize_item(
                source="persee",
                title=title,
                content=content,
                url=r["url"],
                author=", ".join(detail.get("authors", [])) or r.get("author", name),
                date=detail.get("date", ""),
                tags=["académique", "persée"],
                metadata={
                    "journal": detail.get("journal", r.get("journal_meta", "")),
                    "doi": detail.get("doi", ""),
                    "is_primary_author": is_author,
                },
                is_cailleaux=is_cailleaux,
            )
            all_items.append(item)

    # 2. Recherche par termes patrimoniaux
    for term in persee_cfg.get("search_terms", []):
        print(f"\n→ Terme: '{term}'")
        results = search_persee(term, max_pages=5)
        print(f"  {len(results)} résultats")

        for r in results:
            # Éviter les doublons
            if any(existing["url"] == r["url"] for existing in all_items):
                continue

            detail = fetch_article_detail(r["url"])
            time.sleep(0.5)

            is_cailleaux = "cailleaux" in r.get("author", "").lower()
            if detail.get("authors"):
                is_cailleaux = any("cailleaux" in a.lower() for a in detail["authors"])

            content = detail.get("content") or detail.get("abstract") or r.get("abstract", "")
            title = detail.get("title") or r["title"]

            if not content:
                continue

            item = normalize_item(
                source="persee",
                title=title,
                content=content,
                url=r["url"],
                author=", ".join(detail.get("authors", [])) or r.get("author", ""),
                date=detail.get("date", ""),
                tags=["académique", "persée", "patrimoine-sens"],
                metadata={
                    "journal": detail.get("journal", ""),
                    "doi": detail.get("doi", ""),
                    "search_term": term,
                },
                is_cailleaux=is_cailleaux,
            )
            all_items.append(item)

    # Dédupliquer par URL
    seen_urls = set()
    unique = []
    for item in all_items:
        if item["url"] not in seen_urls:
            seen_urls.add(item["url"])
            unique.append(item)

    cailleaux_items = [i for i in unique if i["is_cailleaux"]]

    print(f"\n{'='*60}")
    print(f"  TOTAL: {len(unique)} articles uniques")
    print(f"  Articles Cailleaux: {len(cailleaux_items)}")
    print(f"{'='*60}")

    save_json(unique, OUTPUT_DIR / "persee" / "all_articles.json")
    if cailleaux_items:
        save_json(cailleaux_items, OUTPUT_DIR / "persee" / "cailleaux_articles.json")


if __name__ == "__main__":
    main()
