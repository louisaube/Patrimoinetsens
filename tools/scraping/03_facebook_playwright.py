#!/usr/bin/env python3
"""
Scraper Facebook via Playwright — groupe + pages patrimoine Sens.
Utilise un vrai navigateur Chromium avec injection de cookies.
Scrolle le groupe pour charger les posts, parse le HTML.

Usage:
    python 03_facebook_playwright.py                 # groupe + pages
    python 03_facebook_playwright.py --max-scrolls 50  # plus de posts
    python 03_facebook_playwright.py --headed          # voir le navigateur
"""

import asyncio
import argparse
import json
import os
import random
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

from dotenv import load_dotenv

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ENV_PATH = Path(__file__).parent.parent / "gallica-rag" / ".env"
load_dotenv(ENV_PATH)

OUTPUT_DIR = Path(__file__).parent / "output" / "facebook"
IMAGES_DIR = Path(__file__).parent / "output" / "images" / "facebook"

# Sources Facebook — groupes et pages patrimoine/histoire Sens, Sénonais, Yonne
SOURCES = [
    # ── Groupes ──────────────────────────────────────────────
    {
        "type": "group",
        "name": "groupe-histoire-sens",
        "url": "https://www.facebook.com/groups/710567067019396/",
    },
    {
        "type": "group",
        "name": "senonais-hier-aujourdhui",
        "url": "https://www.facebook.com/groups/1785010691949027/",
    },
    {
        "type": "group",
        "name": "sens-patrimoine",
        "url": "https://www.facebook.com/groups/314633657376736/",
    },
    {
        "type": "group",
        "name": "photos-senonais-yonne",
        "url": "https://www.facebook.com/groups/1344724426957553/",
    },
    {
        "type": "group",
        "name": "jaime-sens",
        "url": "https://www.facebook.com/groups/905941391376366/",
    },
    {
        "type": "group",
        "name": "sens-dans-lyonne",
        "url": "https://www.facebook.com/groups/5777338007/",
    },
    {
        "type": "group",
        "name": "sens-ville-dyonne",
        "url": "https://www.facebook.com/groups/444539689508201/",
    },
    {
        "type": "group",
        "name": "photos-de-sens",
        "url": "https://www.facebook.com/groups/2222129598138133/",
    },
    # ── Pages ────────────────────────────────────────────────
    {
        "type": "page",
        "name": "histoire-de-sens",
        "url": "https://www.facebook.com/HistoireSens",
    },
    {
        "type": "page",
        "name": "histoire-sens-senonais-yonne",
        "url": "https://www.facebook.com/histoire.sens.senonais.yonne",
    },
    {
        "type": "page",
        "name": "gazette-senonaise",
        "url": "https://www.facebook.com/gazettesenonaise",
    },
]

# Mots-cles patrimoine pour filtrer
PATRIMOINE_KEYWORDS = [
    "cathedrale", "cathédrale", "patrimoine", "histoire", "medieval", "médiéval",
    "eglise", "église", "monument", "classe", "classé", "ancien", "historique",
    "archeologie", "archéologie", "rempart", "abbaye", "couvent", "chateau", "château",
    "lavoir", "calvaire", "croix", "porte", "tour", "muraille", "hotel particulier",
    "hôtel particulier", "maison ancienne", "cailleaux", "brousse", "sens",
    "senon", "sénonais", "yonne", "palais synodal", "saint-etienne",
    "saint-étienne", "agedincum", "gallo-romain",
]

PRIORITY_AUTHORS = ["denis cailleaux", "bernard brousse"]


def get_cookies() -> list[dict]:
    """Construit les cookies Facebook depuis le .env."""
    c_user = os.getenv("FB_C_USER", "")
    xs = os.getenv("FB_XS", "")
    if not c_user or not xs:
        raise RuntimeError("FB_C_USER et FB_XS requis dans .env")
    return [
        {"name": "c_user", "value": c_user, "domain": ".facebook.com", "path": "/"},
        {"name": "xs", "value": xs, "domain": ".facebook.com", "path": "/"},
        {"name": "locale", "value": "fr_FR", "domain": ".facebook.com", "path": "/"},
    ]


async def scrape_facebook_source(
    source: dict,
    max_scrolls: int = 30,
    headed: bool = False,
) -> list[dict]:
    """Scrape un groupe ou une page Facebook avec Playwright."""
    from playwright.async_api import async_playwright

    posts = []
    name = source["name"]
    url = source["url"]

    print(f"\n{'='*50}")
    print(f"  {source['type'].upper()}: {name}")
    print(f"  URL: {url}")
    print(f"{'='*50}")

    async with async_playwright() as p:
        # Comportement humain : viewport variable, timezone, etc.
        viewport_w = random.randint(1200, 1400)
        viewport_h = random.randint(800, 1000)

        browser = await p.chromium.launch(
            headless=not headed,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
            ],
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            ),
            viewport={"width": viewport_w, "height": viewport_h},
            locale="fr-FR",
            timezone_id="Europe/Paris",
            # Masquer l'automation
            java_script_enabled=True,
        )

        # Masquer webdriver
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
            Object.defineProperty(navigator, 'languages', {get: () => ['fr-FR', 'fr', 'en-US', 'en']});
            window.chrome = {runtime: {}};
        """)

        # Injecter les cookies
        cookies = get_cookies()
        await context.add_cookies(cookies)

        page = await context.new_page()

        # D'abord aller sur facebook.com (comme un humain qui ouvre FB)
        print(f"  Navigation facebook.com...")
        try:
            await page.goto("https://www.facebook.com/", wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(random.uniform(2, 4))

            # Mouvement de souris aleatoire (humain)
            await page.mouse.move(random.randint(100, 500), random.randint(100, 400))
            await asyncio.sleep(random.uniform(1, 2))

            # Puis naviguer vers le groupe/page
            print(f"  Navigation vers {url}...")
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(random.uniform(3, 5))
        except Exception as e:
            print(f"  !! Navigation echouee: {e}")
            await browser.close()
            return []

        # Vérifier qu'on est connecté
        page_text = await page.content()
        if "login" in page.url.lower() or "checkpoint" in page.url.lower():
            print(f"  !! Redirige vers login — cookies invalides ou expires")
            await browser.close()
            return []

        print(f"  OK connecte. Debut du scroll...")

        # Fermer les popups eventuels
        for selector in [
            '[aria-label="Fermer"]',
            '[aria-label="Close"]',
            'div[role="dialog"] [aria-label="Fermer"]',
        ]:
            try:
                btn = page.locator(selector).first
                if await btn.is_visible(timeout=2000):
                    await btn.click()
                    await asyncio.sleep(1)
            except Exception:
                pass

        # Scroll et collecte
        seen_ids = set()
        no_new_count = 0

        for scroll_num in range(max_scrolls):
            # NB: on ne clique PAS sur les boutons commentaires pendant le scroll
            # car ca casse le chargement infini de Facebook.
            # Les commentaires visibles sont deja dans le texte brut.

            # Extraire les posts visibles
            new_posts = await extract_posts_from_page(page)
            added = 0
            for post in new_posts:
                pid = post.get("id", post.get("text", "")[:50])
                if pid and pid not in seen_ids:
                    seen_ids.add(pid)
                    posts.append(post)
                    added += 1

            if added == 0:
                no_new_count += 1
                if no_new_count >= 5:
                    print(f"  Scroll {scroll_num+1}: pas de nouveaux posts depuis 5 scrolls, arret")
                    break
            else:
                no_new_count = 0

            if scroll_num % 5 == 0:
                print(f"  Scroll {scroll_num+1}/{max_scrolls}: {len(posts)} posts")

            # Scroll humain : distance variable, pas toujours tout en bas
            scroll_distance = random.randint(600, 1200)
            await page.evaluate(f"window.scrollBy(0, {scroll_distance})")

            # Delai humain : entre 2 et 6 secondes, parfois une pause plus longue
            delay = random.uniform(2, 5)
            if scroll_num % 10 == 9:
                # Pause "lecture" toutes les 10 scrolls
                delay = random.uniform(5, 10)
                print(f"    (pause lecture {delay:.0f}s)")
            await asyncio.sleep(delay)

            # Mouvement de souris aleatoire (humain qui lit)
            if scroll_num % 3 == 0:
                await page.mouse.move(
                    random.randint(200, 800),
                    random.randint(200, 600),
                )

        print(f"  Total: {len(posts)} posts extraits")
        await browser.close()

    return posts


async def click_comment_buttons(page):
    """Clique sur les boutons 'X commentaires' pour les déplier.
    Comportement humain : on ne clique pas sur tout, juste quelques-uns.
    """
    try:
        # Boutons "N commentaire(s)" ou "Voir plus de commentaires"
        buttons = await page.query_selector_all(
            'div[role="button"]'
        )
        clicked = 0
        for btn in buttons:
            if clicked >= 3:  # max 3 par passe (humain)
                break
            try:
                text = await btn.inner_text()
                text_lower = text.lower().strip()
                if (
                    "commentaire" in text_lower
                    or "réponse" in text_lower
                    or "voir plus" in text_lower
                ) and len(text) < 50:
                    await btn.scroll_into_view_if_needed()
                    await asyncio.sleep(random.uniform(0.3, 0.8))
                    await btn.click()
                    clicked += 1
                    await asyncio.sleep(random.uniform(1, 2))
            except Exception:
                continue
    except Exception:
        pass


async def extract_posts_from_page(page) -> list[dict]:
    """Extrait les posts du DOM Facebook actuel.

    Facebook obfusque les classes CSS, donc on utilise role="article"
    comme ancre principale et on parse le texte brut pour en extraire
    l'auteur, le contenu, les commentaires.
    """
    posts = []

    try:
        post_elements = await page.query_selector_all('div[role="article"]')

        for el in post_elements:
            try:
                raw_text = await el.inner_text()
                raw_text = raw_text.strip()
                if not raw_text or len(raw_text) < 20:
                    continue

                # --- Auteur : premier strong ou h2/h3 dans l'article ---
                author = ""
                for sel in [
                    "h2 a strong", "h3 a strong", "h2 strong", "h3 strong",
                    "strong a", "a strong",
                    'a[role="link"] > strong',
                    'span[dir="auto"] strong',
                ]:
                    author_el = await el.query_selector(sel)
                    if author_el:
                        author = (await author_el.inner_text()).strip()
                        if author and len(author) > 1 and len(author) < 60:
                            break
                        author = ""

                # --- Lien du post (permalink) ---
                post_url = ""
                for sel in [
                    'a[href*="/permalink/"]',
                    'a[href*="/posts/"]',
                    'a[href*="comment_id"]',
                ]:
                    link_el = await el.query_selector(sel)
                    if link_el:
                        href = await link_el.get_attribute("href")
                        if href:
                            if not href.startswith("http"):
                                href = "https://www.facebook.com" + href
                            # Nettoyer les params tracking
                            post_url = href.split("&__cft__")[0]
                            break

                # --- Date : aria-label sur les liens ou abbr ---
                date_str = ""
                for sel in [
                    'a[href*="/permalink/"]',
                    'a[href*="/posts/"]',
                    "abbr",
                ]:
                    date_el = await el.query_selector(sel)
                    if date_el:
                        aria = await date_el.get_attribute("aria-label")
                        if aria and any(c.isdigit() for c in aria):
                            date_str = aria
                            break
                        title = await date_el.get_attribute("title")
                        if title and any(c.isdigit() for c in title):
                            date_str = title
                            break

                # --- Images : vraies photos, pas SVG/emoji/icones ---
                images = []
                img_els = await el.query_selector_all("img")
                for img in img_els:
                    src = await img.get_attribute("src") or ""
                    # Filtrer : garder uniquement les vraies images FB
                    if (
                        src.startswith("https://")
                        and any(host in src for host in [
                            "scontent", "fbcdn", "xx.fbcdn",
                            "external", "lookaside",
                        ])
                        and not any(skip in src for skip in [
                            "emoji", "static", "rsrc", "profile",
                            "/cp/", "/v/", "safe_image",
                        ])
                    ):
                        images.append(src)

                # --- Texte : nettoyer le raw_text ---
                # Le texte brut contient auteur + badges + post + reactions + comments
                # On essaie d'isoler le contenu principal
                lines = raw_text.split("\n")
                # Supprimer les lignes de metadata FB
                skip_patterns = [
                    "J'aime", "Répondre", "Répon", "Commenter", "Partager",
                    "Admin", "Contributeur", "Spécialiste du groupe",
                    "Modérateur", "star", "En voir plus", "Voir la traduction",
                    "Toutes les réactions", "Top fan", "personne",
                ]
                content_lines = []
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    if len(line) < 3:
                        continue
                    if any(pat in line for pat in skip_patterns):
                        continue
                    # Ignorer les lignes qui sont juste un nombre (reactions count)
                    if line.replace(",", "").replace(".", "").isdigit():
                        continue
                    # Ignorer les lignes de date relative courtes
                    if line in ["1 j", "2 j", "3 j", "1 h", "2 h", "3 h"]:
                        continue
                    if re.match(r"^\d+\s*[hjms]$", line):
                        continue
                    content_lines.append(line)

                # Le contenu = tout sauf la première ligne (souvent l'auteur)
                text = "\n".join(content_lines)
                if author and text.startswith(author):
                    text = text[len(author):].strip()

                if len(text) < 10:
                    continue

                # --- Commentaires pertinents ---
                # Extraire du texte brut les commentaires (pattern: Nom\nbadges\ntexte)
                comments = extract_pertinent_comments(raw_text, author)

                post_id = post_url or text[:80]

                posts.append({
                    "id": post_id,
                    "text": text,
                    "author": author,
                    "date": date_str,
                    "images": images,
                    "url": post_url,
                    "comments": comments,
                })

            except Exception:
                continue

    except Exception as e:
        print(f"  !! Erreur extraction: {e}")

    return posts


def extract_pertinent_comments(raw_text: str, post_author: str) -> list[dict]:
    """Extrait les commentaires pertinents du texte brut d'un post Facebook.

    Le raw_text contient tout mélangé : auteur post, badges, texte post,
    réactions, commentaires. On cherche des patterns de commentaires
    avec des auteurs prioritaires ou du contenu patrimoine substantiel.

    On ne garde que :
    - Commentaires de Cailleaux ou Brousse (toujours)
    - Commentaires > 80 chars avec des mots-clés patrimoine (savoir local)
    """
    comments = []
    lines = raw_text.split("\n")

    # Badges FB à ignorer
    badges = {
        "admin", "modérateur", "contributeur(ice) star",
        "spécialiste du groupe", "top fan", "membre depuis",
    }

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Détecter un nom d'auteur de commentaire (pas l'auteur du post)
        # Pattern : un nom (2+ mots, commence par majuscule) suivi de badges
        is_name = (
            len(line) > 3
            and len(line) < 50
            and line[0].isupper()
            and " " in line
            and line != post_author
            and not any(c.isdigit() for c in line)
            and "J'aime" not in line
            and "Répondre" not in line
            and "commentaire" not in line.lower()
        )

        if is_name:
            comment_author = line
            # Avancer au-delà des badges
            j = i + 1
            while j < len(lines) and lines[j].strip().lower() in badges:
                j += 1

            # Collecter le texte du commentaire
            comment_text_parts = []
            while j < len(lines):
                cline = lines[j].strip()
                # Arrêt si on tombe sur une ligne de métadonnées
                if cline in ["J'aime", "Répondre", "Répon", "Partager"]:
                    break
                if re.match(r"^\d+\s*[hjms]$", cline):
                    break
                if cline.replace(",", "").replace(".", "").isdigit():
                    break
                if len(cline) < 2:
                    break
                # Arrêt si c'est un nouveau nom (prochain commentaire)
                if (
                    len(cline) > 3
                    and len(cline) < 50
                    and cline[0].isupper()
                    and " " in cline
                    and not any(skip in cline for skip in ["En voir plus", "Voir la traduction"])
                ):
                    # Pourrait être un nouveau commentaire — vérifier
                    # Si le texte accumulé est vide, c'est le début du vrai texte
                    if not comment_text_parts:
                        comment_text_parts.append(cline)
                        j += 1
                        continue
                    break
                if cline not in ["En voir plus", "Voir la traduction"]:
                    comment_text_parts.append(cline)
                j += 1

            comment_text = " ".join(comment_text_parts).strip()

            # Filtrer : garder tout commentaire à plus-value
            is_priority = any(
                pa in comment_author.lower()
                for pa in PRIORITY_AUTHORS
            )

            # Jeter le bavardage : "super !", "merci", emoji seuls, etc.
            noise_patterns = [
                "merci", "super", "bravo", "magnifique", "genial",
                "top", "wow", "cool", "bien vu", "j'adore",
                "exactement", "tout a fait", "en effet",
            ]
            is_noise = (
                len(comment_text) < 50
                and (
                    not comment_text  # vide
                    or comment_text.lower().strip("! .") in noise_patterns
                    or all(c in "!?.🙏👍❤️😍👏🔥💪" for c in comment_text.strip())
                )
            )

            # Garder si : auteur prioritaire OU commentaire substantiel (pas du bruit)
            if comment_text and (is_priority or not is_noise):
                comments.append({
                    "author": comment_author,
                    "text": comment_text,
                    "is_priority_author": is_priority,
                })

            i = j
        else:
            i += 1

    return comments


def is_relevant(text: str) -> bool:
    """Vérifie si un post est pertinent patrimoine."""
    text_lower = text.lower()
    return any(kw in text_lower for kw in PATRIMOINE_KEYWORDS)


def process_posts(raw_posts: list[dict], source_name: str) -> list[dict]:
    """Filtre et normalise les posts."""
    from shared import normalize_item

    items = []
    for post in raw_posts:
        text = post.get("text", "")
        author = post.get("author", "")

        if not is_relevant(text) and not any(
            pa in author.lower() for pa in PRIORITY_AUTHORS
        ):
            continue

        comments = post.get("comments", [])
        is_cailleaux = "cailleaux" in author.lower() or "cailleaux" in text.lower()
        cailleaux_comments = [
            c for c in comments if c.get("is_priority_author")
            and "cailleaux" in c.get("author", "").lower()
        ]

        # Enrichir le contenu avec les commentaires pertinents
        content_parts = [text]
        if comments:
            content_parts.append("\n--- Commentaires pertinents ---")
            for c in comments:
                label = "[PRIORITAIRE] " if c.get("is_priority_author") else ""
                content_parts.append(f"{label}{c['author']} : {c['text']}")

        item = normalize_item(
            source=f"facebook_{source_name}",
            title=text[:120] + "..." if len(text) > 120 else text,
            content="\n\n".join(content_parts),
            url=post.get("url", ""),
            author=author,
            date=post.get("date", ""),
            images=post.get("images", []),
            tags=["facebook", source_name],
            metadata={
                "comments_pertinents": comments,
                "comments_count": len(comments),
                "cailleaux_comments": cailleaux_comments,
            },
            is_cailleaux=is_cailleaux or len(cailleaux_comments) > 0,
        )
        items.append(item)

    return items


async def main_async(max_scrolls: int, headed: bool):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    all_items = []

    for source in SOURCES:
        raw_posts = await scrape_facebook_source(source, max_scrolls, headed)

        # Sauvegarder brut
        raw_path = OUTPUT_DIR / f"{source['name']}_raw.json"
        with open(raw_path, "w", encoding="utf-8") as f:
            json.dump(raw_posts, f, ensure_ascii=False, indent=2, default=str)
        print(f"  Brut sauve: {raw_path} ({len(raw_posts)} posts)")

        # Filtrer et normaliser
        items = process_posts(raw_posts, source["name"])
        print(f"  Pertinents: {len(items)}")
        all_items.extend(items)

    # Stats
    cailleaux = [i for i in all_items if i.get("is_cailleaux")]

    print(f"\n{'='*50}")
    print(f"  TOTAL posts pertinents: {len(all_items)}")
    print(f"  Posts/commentaires Cailleaux: {len(cailleaux)}")
    print(f"{'='*50}")

    # Sauvegarder
    with open(OUTPUT_DIR / "all_posts.json", "w", encoding="utf-8") as f:
        json.dump(all_items, f, ensure_ascii=False, indent=2, default=str)
    print(f"  Sauve: {OUTPUT_DIR / 'all_posts.json'}")

    if cailleaux:
        with open(OUTPUT_DIR / "cailleaux_posts.json", "w", encoding="utf-8") as f:
            json.dump(cailleaux, f, ensure_ascii=False, indent=2, default=str)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-scrolls", type=int, default=30)
    parser.add_argument("--headed", action="store_true", help="Voir le navigateur")
    args = parser.parse_args()

    asyncio.run(main_async(args.max_scrolls, args.headed))


if __name__ == "__main__":
    main()
