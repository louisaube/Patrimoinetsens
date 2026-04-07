#!/usr/bin/env python3
"""
07_build_knowledge.py
=====================
Transforme le corpus scrapé (2815 items) en données structurées
pour le site Patrimoine & Sens.

Deux outputs :
1. Enrichit les heritage_items existants avec de nouvelles contributions
2. Crée de nouveaux heritage_items pour les éléments pas encore dans la base

Mapping corpus → data model P&S :
- POP Mérimée → heritage_items (conteneurs) + contribution "historique" (fiche MH)
- POP Palissy → contribution "observation" sous l'édifice parent
- Facebook Cailleaux → contribution "historique" (savoir médiéviste)
- Facebook communauté → contribution "temoignage" (savoir local)
- Persée → contribution "historique" (source académique)
- Wikipedia → contribution "historique" (synthèse encyclopédique)
- Firecrawl tourisme → contribution "recit" (description accessible)

Usage:
    python 07_build_knowledge.py
    python 07_build_knowledge.py --stats    # stats seulement
    python 07_build_knowledge.py --export   # exporte en JSON pour le site
"""

import json
import re
import sys
import uuid
from collections import defaultdict
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

OUTPUT_DIR = Path(__file__).parent / "output"
SITE_DATA = Path(__file__).parent.parent.parent / "public" / "data"
SEED_DIR = Path(__file__).parent.parent.parent / "src" / "lib" / "db"

# Existing items from the site
EXISTING_ITEMS_PATH = SITE_DATA / "heritage-items.json"
EXISTING_CONTRIBS_PATH = SITE_DATA / "contributions.json"

# Persona IDs from seed-users.ts
DENIS = "a1111111-1111-1111-1111-111111111111"
BERNARD = "b2222222-2222-2222-2222-222222222222"
MARIE = "c3333333-3333-3333-3333-333333333333"
SYSTEM = "s0000000-0000-0000-0000-000000000000"  # scraper bot

# Categories
CATEGORY_MAP = {
    "eglise": "edifice_religieux",
    "église": "edifice_religieux",
    "chapelle": "edifice_religieux",
    "cathédrale": "edifice_religieux",
    "basilique": "edifice_religieux",
    "abbaye": "edifice_religieux",
    "couvent": "edifice_religieux",
    "prieuré": "edifice_religieux",
    "monastère": "edifice_religieux",
    "château": "batiment_historique",
    "hôtel": "batiment_historique",
    "maison": "batiment_historique",
    "palais": "batiment_historique",
    "porte": "batiment_historique",
    "tour": "batiment_historique",
    "rempart": "batiment_historique",
    "enceinte": "batiment_historique",
    "tribunal": "batiment_historique",
    "théâtre": "batiment_historique",
    "fontaine": "mobilier_urbain",
    "croix": "mobilier_urbain",
    "calvaire": "mobilier_urbain",
    "lavoir": "mobilier_urbain",
    "monument": "mobilier_urbain",
    "statue": "mobilier_urbain",
    "parc": "patrimoine_naturel",
    "jardin": "patrimoine_naturel",
    "menhir": "patrimoine_naturel",
}


def load_corpus() -> list[dict]:
    path = OUTPUT_DIR / "corpus_patrimoine_sens.json"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_existing_items() -> list[dict]:
    if EXISTING_ITEMS_PATH.exists():
        with open(EXISTING_ITEMS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def load_existing_contributions() -> dict[str, list]:
    """Charge les contributions existantes, groupées par heritageItemId."""
    if EXISTING_CONTRIBS_PATH.exists():
        with open(EXISTING_CONTRIBS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Si c'est une liste plate, grouper par heritageItemId
        if isinstance(data, list):
            grouped = defaultdict(list)
            for c in data:
                grouped[c.get("heritageItemId", "unknown")].append(c)
            return dict(grouped)
        return data
    return {}


def guess_category(title: str, content: str) -> str:
    """Devine la catégorie d'un élément patrimonial."""
    text = (title + " " + content).lower()
    for keyword, cat in CATEGORY_MAP.items():
        if keyword in text:
            return cat
    return "autre"


def parse_siecle(text: str) -> tuple[int | None, int | None]:
    """Parse un siècle en année de début/fin."""
    if not text:
        return None, None

    text = str(text).lower().strip()

    # "12e siècle" → 1100-1199
    m = re.search(r"(\d{1,2})e\s*si", text)
    if m:
        s = int(m.group(1))
        return (s - 1) * 100, s * 100 - 1

    # "1135-1534" ou "1135 — 1534"
    m = re.search(r"(\d{4})\s*[-—]\s*(\d{4})", text)
    if m:
        return int(m.group(1)), int(m.group(2))

    # "1882" seul
    m = re.search(r"(\d{4})", text)
    if m:
        year = int(m.group(1))
        if 500 < year < 2030:
            return year, year

    return None, None


def normalize_title(title: str) -> str:
    """Normalise un titre pour matching."""
    t = title.lower().strip()
    t = re.sub(r"[àâä]", "a", t)
    t = re.sub(r"[éèêë]", "e", t)
    t = re.sub(r"[ïî]", "i", t)
    t = re.sub(r"[ôö]", "o", t)
    t = re.sub(r"[ùûü]", "u", t)
    t = re.sub(r"[ç]", "c", t)
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def match_item(title: str, existing: list[dict]) -> dict | None:
    """Trouve l'item existant le plus proche par titre."""
    norm = normalize_title(title)
    # Mots significatifs (> 3 chars)
    words = [w for w in norm.split() if len(w) > 3]
    if not words:
        return None

    best_match = None
    best_score = 0

    for item in existing:
        item_norm = normalize_title(item["title"])
        score = sum(1 for w in words if w in item_norm)
        if score > best_score and score >= 2:  # au moins 2 mots en commun
            best_score = score
            best_match = item

    return best_match


def determine_contribution_type(item: dict) -> str:
    """Détermine le type de contribution selon la source."""
    source = item.get("source", "")
    is_cailleaux = item.get("is_cailleaux", False)

    if is_cailleaux:
        return "historique"
    if "pop_" in source:
        return "historique"
    if "persee" in source:
        return "historique"
    if "wikipedia" in source:
        return "historique"
    if "facebook" in source:
        return "temoignage"
    if "web_tourisme" in source:
        return "recit"
    if "web_agendicum" in source:
        return "historique"
    if "web_openedition" in source:
        return "historique"
    return "observation"


def determine_author(item: dict) -> str:
    """Détermine l'auteur de la contribution."""
    if item.get("is_cailleaux"):
        return DENIS  # Denis Cailleaux → persona Denis
    author = item.get("author", "").lower()
    if "brousse" in author:
        return BERNARD
    return SYSTEM  # contenu scrapé = auteur système


def make_uuid(seed: str) -> str:
    """Génère un UUID déterministe à partir d'un seed."""
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"patrimoine-sens:{seed}"))


def build_knowledge():
    """Construit la base de connaissances à partir du corpus."""
    print("=" * 60)
    print("  Construction de la base de connaissances")
    print("=" * 60)

    corpus = load_corpus()
    existing = load_existing_items()
    existing_contribs = load_existing_contributions()

    print(f"\n  Corpus: {len(corpus)} items")
    print(f"  Items existants: {len(existing)}")
    print(f"  Contributions existantes: {sum(len(v) for v in existing_contribs.values())}")

    # ── Phase 1: Matcher le corpus aux items existants ────────────────
    print(f"\n--- Phase 1: Matching ---")

    matched = []       # (corpus_item, existing_item)
    unmatched = []      # corpus_items sans match
    new_items = {}      # titre normalisé → corpus items groupés

    for item in corpus:
        title = item.get("title", "")
        content = item.get("content", "")

        match = match_item(title, existing)
        if not match:
            match = match_item(content[:200], existing)

        if match:
            matched.append((item, match))
        else:
            unmatched.append(item)

    print(f"  Matchés à un item existant: {len(matched)}")
    print(f"  Non matchés: {len(unmatched)}")

    # ── Phase 2: Grouper les non-matchés par lieu/sujet ───────────────
    print(f"\n--- Phase 2: Groupement ---")

    # POP items non matchés → potentiels nouveaux heritage_items
    pop_new = [i for i in unmatched if "pop_" in i.get("source", "")]
    other_new = [i for i in unmatched if "pop_" not in i.get("source", "")]

    print(f"  POP sans match (nouveaux items potentiels): {len(pop_new)}")
    print(f"  Autres sans match (contributions orphelines): {len(other_new)}")

    # ── Phase 3: Générer les contributions ────────────────────────────
    print(f"\n--- Phase 3: Generation contributions ---")

    new_contributions = defaultdict(list)  # heritage_item_id → [contributions]
    new_heritage_items = []

    # 3a. Contributions pour items existants
    for corpus_item, existing_item in matched:
        contrib = make_contribution(corpus_item, existing_item["id"])
        if contrib and len(contrib["body"]) > 30:
            new_contributions[existing_item["id"]].append(contrib)

    # 3b. Nouveaux heritage_items depuis POP
    for pop_item in pop_new:
        ref = pop_item.get("metadata", {}).get("ref", "")
        title = pop_item.get("title", ref)
        if not title or len(title) < 3:
            continue

        item_id = make_uuid(f"pop:{ref}" if ref else f"title:{title}")

        # Vérifier qu'on ne crée pas un doublon
        if any(ni["id"] == item_id for ni in new_heritage_items):
            continue

        location = pop_item.get("location") or {}
        siecle = pop_item.get("metadata", {}).get("siecle", "")
        period_start, period_end = parse_siecle(siecle)

        new_item = {
            "id": item_id,
            "title": title,
            "category": guess_category(title, pop_item.get("content", "")),
            "status": "publie",
            "latitude": location.get("lat"),
            "longitude": location.get("lng"),
            "coverPhotoUrl": None,
            "periodStart": period_start,
            "periodEnd": period_end,
            "createdBy": {
                "id": SYSTEM,
                "name": "Import POP/Mérimée",
            },
            "source_ref": ref,
            "source_url": pop_item.get("url", ""),
        }
        new_heritage_items.append(new_item)

        # Contribution fiche MH
        contrib = make_contribution(pop_item, item_id)
        if contrib:
            new_contributions[item_id].append(contrib)

    total_contribs = sum(len(v) for v in new_contributions.values())
    print(f"  Nouvelles contributions: {total_contribs}")
    print(f"  Nouveaux heritage items: {len(new_heritage_items)}")

    # ── Phase 4: Stats Cailleaux ──────────────────────────────────────
    cailleaux_contribs = []
    for item_id, contribs in new_contributions.items():
        for c in contribs:
            if c.get("authorId") == DENIS:
                cailleaux_contribs.append(c)

    print(f"  Contributions Cailleaux: {len(cailleaux_contribs)}")

    # ── Phase 5: Export ───────────────────────────────────────────────
    print(f"\n--- Phase 5: Export ---")

    # Fusionner avec les existants
    all_items = existing + new_heritage_items
    all_contribs = dict(existing_contribs)
    for item_id, contribs in new_contributions.items():
        if item_id in all_contribs:
            all_contribs[item_id].extend(contribs)
        else:
            all_contribs[item_id] = contribs

    # Sauvegarder
    knowledge_dir = OUTPUT_DIR / "knowledge"
    knowledge_dir.mkdir(exist_ok=True)

    with open(knowledge_dir / "heritage-items.json", "w", encoding="utf-8") as f:
        json.dump(all_items, f, ensure_ascii=False, indent=2)
    print(f"  heritage-items.json: {len(all_items)} items")

    with open(knowledge_dir / "contributions.json", "w", encoding="utf-8") as f:
        json.dump(all_contribs, f, ensure_ascii=False, indent=2)
    total_all = sum(len(v) for v in all_contribs.values())
    print(f"  contributions.json: {total_all} contributions")

    with open(knowledge_dir / "new-items-only.json", "w", encoding="utf-8") as f:
        json.dump(new_heritage_items, f, ensure_ascii=False, indent=2)
    print(f"  new-items-only.json: {len(new_heritage_items)} items")

    with open(knowledge_dir / "cailleaux-contributions.json", "w", encoding="utf-8") as f:
        json.dump(cailleaux_contribs, f, ensure_ascii=False, indent=2)
    print(f"  cailleaux-contributions.json: {len(cailleaux_contribs)} items")

    # Stats résumé
    stats = {
        "existing_items": len(existing),
        "new_items": len(new_heritage_items),
        "total_items": len(all_items),
        "existing_contributions": sum(len(v) for v in existing_contribs.values()),
        "new_contributions": total_contribs,
        "total_contributions": total_all,
        "cailleaux_contributions": len(cailleaux_contribs),
        "by_type": defaultdict(int),
        "by_source": defaultdict(int),
    }
    for contribs in new_contributions.values():
        for c in contribs:
            stats["by_type"][c["contributionType"]] += 1
            stats["by_source"][c.get("_source", "unknown")] += 1
    stats["by_type"] = dict(stats["by_type"])
    stats["by_source"] = dict(stats["by_source"])

    with open(knowledge_dir / "stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"  KNOWLEDGE BASE BUILT")
    print(f"  Items: {len(existing)} existants + {len(new_heritage_items)} nouveaux = {len(all_items)}")
    print(f"  Contributions: {stats['existing_contributions']} existantes + {total_contribs} nouvelles = {total_all}")
    print(f"  Cailleaux: {len(cailleaux_contribs)}")
    print(f"  Par type: {dict(stats['by_type'])}")
    print(f"{'=' * 60}")

    return stats


def make_contribution(corpus_item: dict, heritage_item_id: str) -> dict | None:
    """Crée une contribution à partir d'un item du corpus."""
    content = corpus_item.get("content", "")
    title = corpus_item.get("title", "")

    if not content or len(content) < 30:
        return None

    contrib_type = determine_contribution_type(corpus_item)
    author_id = determine_author(corpus_item)
    source = corpus_item.get("source", "")
    url = corpus_item.get("url", "")

    # Sources
    sources = []
    if url:
        sources.append(url)
    meta_sources = corpus_item.get("metadata", {})
    if isinstance(meta_sources, dict):
        ref = meta_sources.get("ref", "")
        if ref:
            sources.append(f"Ref. {ref}")
        journal = meta_sources.get("journal", "")
        if journal:
            sources.append(journal)
        doi = meta_sources.get("doi", "")
        if doi:
            sources.append(doi)

    # Période
    siecle = corpus_item.get("metadata", {}).get("siecle", "") if isinstance(corpus_item.get("metadata"), dict) else ""
    date_str = corpus_item.get("date", "")
    period = siecle or date_str or None

    # Titre de la contribution
    contrib_title = title[:120]
    if source.startswith("pop_"):
        protection = corpus_item.get("metadata", {}).get("protection", "")
        contrib_title = f"Fiche {protection}" if protection else f"Fiche Ministère de la Culture"
    elif source == "persee":
        contrib_title = title
    elif "facebook" in source:
        contrib_title = f"Témoignage : {title[:80]}" if not corpus_item.get("is_cailleaux") else title[:120]
    elif source == "wikipedia":
        contrib_title = f"Synthèse encyclopédique"

    return {
        "id": make_uuid(f"contrib:{corpus_item.get('id', title)}"),
        "heritageItemId": heritage_item_id,
        "authorId": author_id,
        "contributionType": contrib_type,
        "title": contrib_title,
        "body": content[:5000],  # limiter la taille
        "sources": sources,
        "period": period,
        "furtherReading": None,
        "audioUrl": None,
        "_source": source,  # metadata interne, pas exportée dans le site
    }


def print_stats():
    stats_path = OUTPUT_DIR / "knowledge" / "stats.json"
    if stats_path.exists():
        with open(stats_path, "r", encoding="utf-8") as f:
            stats = json.load(f)
        print(json.dumps(stats, indent=2, ensure_ascii=False))
    else:
        print("Pas de knowledge base. Lance 07_build_knowledge.py d'abord.")


if __name__ == "__main__":
    if "--stats" in sys.argv:
        print_stats()
    else:
        build_knowledge()
