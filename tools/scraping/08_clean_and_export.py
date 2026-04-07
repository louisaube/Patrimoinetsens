#!/usr/bin/env python3
"""
08_clean_and_export.py
======================
Nettoie les données knowledge et exporte dans /public/data/ pour le site.

Logique :
- Heritage items = uniquement les éléments avec GPS (immeubles MH + existants)
- Palissy (objets mobiliers) = contributions "observation" sous l'édifice parent
- Facebook/Persée/Wikipedia = contributions sous l'item le plus proche
- Items sans GPS et sans rattachement = ignorés (pas affichables)

Usage:
    python 08_clean_and_export.py
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

CORPUS_PATH = Path(__file__).parent / "output" / "corpus_patrimoine_sens.json"
SITE_DATA = Path(__file__).parent.parent.parent / "public" / "data"
EXISTING_ITEMS_PATH = SITE_DATA / "heritage-items.json"
EXISTING_CONTRIBS_PATH = SITE_DATA / "contributions.json"

DENIS = "a1111111-1111-1111-1111-111111111111"
BERNARD = "b2222222-2222-2222-2222-222222222222"
SYSTEM = "s0000000-0000-0000-0000-000000000000"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(data, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  -> {path.name}: {len(data) if isinstance(data, list) else sum(len(v) for v in data.values())} items")


def make_uuid(seed: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"patrimoine-sens:{seed}"))


def normalize(text: str) -> str:
    t = text.lower().strip()
    for a, b in [("à", "a"), ("â", "a"), ("ä", "a"), ("é", "e"), ("è", "e"),
                 ("ê", "e"), ("ë", "e"), ("ï", "i"), ("î", "i"), ("ô", "o"),
                 ("ö", "o"), ("ù", "u"), ("û", "u"), ("ü", "u"), ("ç", "c")]:
        t = t.replace(a, b)
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def match_to_item(text: str, items: list[dict], min_score: int = 2) -> dict | None:
    """Match un texte à un heritage item par mots communs."""
    norm = normalize(text)
    words = [w for w in norm.split() if len(w) > 3]
    if not words:
        return None

    best, best_score = None, 0
    for item in items:
        item_norm = normalize(item["title"])
        score = sum(1 for w in words if w in item_norm)
        if score > best_score and score >= min_score:
            best_score = score
            best = item

    return best


def parse_siecle(text: str) -> tuple[int | None, int | None]:
    if not text:
        return None, None
    text = str(text).lower()
    m = re.search(r"(\d{1,2})e\s*si", text)
    if m:
        s = int(m.group(1))
        return (s - 1) * 100, s * 100 - 1
    m = re.search(r"(\d{4})\s*[-—]\s*(\d{4})", text)
    if m:
        return int(m.group(1)), int(m.group(2))
    m = re.search(r"(\d{4})", text)
    if m:
        y = int(m.group(1))
        if 500 < y < 2030:
            return y, y
    return None, None


CATEGORY_KEYWORDS = {
    "edifice_religieux": ["eglise", "église", "chapelle", "cathédrale", "basilique",
                          "abbaye", "couvent", "prieuré", "monastère", "carmel"],
    "batiment_historique": ["château", "hôtel", "maison", "palais", "porte", "tour",
                           "rempart", "enceinte", "tribunal", "théâtre", "lycée",
                           "halle", "pont", "grange", "fort"],
    "mobilier_urbain": ["fontaine", "croix", "calvaire", "lavoir", "monument",
                        "statue", "square"],
    "patrimoine_naturel": ["parc", "jardin", "menhir", "rocher", "ferme"],
}


def guess_category(title: str) -> str:
    t = title.lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in t for kw in keywords):
            return cat
    return "autre"


def main():
    print("=" * 60)
    print("  Nettoyage et export vers /public/data/")
    print("=" * 60)

    corpus = load_json(CORPUS_PATH)
    existing_items = load_json(EXISTING_ITEMS_PATH)
    existing_contribs_list = load_json(EXISTING_CONTRIBS_PATH)

    # Grouper contributions existantes par heritageItemId
    existing_contribs = defaultdict(list)
    for c in existing_contribs_list:
        existing_contribs[c.get("heritageItemId", "?")].append(c)

    print(f"  Corpus: {len(corpus)} items")
    print(f"  Items existants: {len(existing_items)}")
    print(f"  Contributions existantes: {len(existing_contribs_list)}")

    # ── Séparer le corpus par source ──────────────────────────────────
    pop_merimee = [c for c in corpus if c["source"] == "pop_merimee"]
    pop_palissy = [c for c in corpus if c["source"] == "pop_palissy"]
    facebook = [c for c in corpus if "facebook" in c["source"]]
    persee = [c for c in corpus if c["source"] == "persee"]
    wikipedia = [c for c in corpus if c["source"] == "wikipedia"]
    websites = [c for c in corpus if c["source"].startswith("web_")]

    print(f"\n  POP Merimee: {len(pop_merimee)}")
    print(f"  POP Palissy: {len(pop_palissy)}")
    print(f"  Facebook: {len(facebook)}")
    print(f"  Persee: {len(persee)}")
    print(f"  Wikipedia: {len(wikipedia)}")
    print(f"  Websites: {len(websites)}")

    # ── Phase 1: Nouveaux heritage items depuis Mérimée ───────────────
    print(f"\n--- Phase 1: Nouveaux items Merimee ---")

    new_items = []
    existing_ids = {i["id"] for i in existing_items}
    existing_titles_norm = {normalize(i["title"]) for i in existing_items}

    for item in pop_merimee:
        location = item.get("location") or {}
        lat = location.get("lat")
        lng = location.get("lng")
        if not lat or not lng:
            continue

        title = item.get("title", "")
        if not title or len(title) < 3:
            continue

        # Vérifier pas de doublon avec les existants
        if normalize(title) in existing_titles_norm:
            continue

        # Filtrer les items hors Sénonais (la recherche POP ramène du bruit)
        if lat and (lat < 47.5 or lat > 48.5 or lng < 2.5 or lng > 4.0):
            continue

        ref = item.get("metadata", {}).get("ref", "")
        item_id = make_uuid(f"merimee:{ref}")
        if item_id in existing_ids:
            continue

        siecle = item.get("metadata", {}).get("siecle", "")
        ps, pe = parse_siecle(siecle)

        new_items.append({
            "id": item_id,
            "title": title,
            "category": guess_category(title),
            "status": "publie",
            "latitude": lat,
            "longitude": lng,
            "coverPhotoUrl": None,
            "periodStart": ps,
            "periodEnd": pe,
            "createdBy": {"id": SYSTEM, "name": "Import Merimee"},
            "contributionCount": 0,
        })
        existing_ids.add(item_id)
        existing_titles_norm.add(normalize(title))

    print(f"  Nouveaux items Merimee (avec GPS, dans le Senonais): {len(new_items)}")

    # ── Phase 2: Contributions ────────────────────────────────────────
    print(f"\n--- Phase 2: Contributions ---")

    all_items = existing_items + new_items
    new_contribs = defaultdict(list)
    stats = defaultdict(int)

    def add_contribution(corpus_item, heritage_item_id, contrib_type, source_label):
        content = corpus_item.get("content", "")
        if not content or len(content) < 30:
            return

        title = corpus_item.get("title", "")[:120]
        url = corpus_item.get("url", "")
        is_cailleaux = corpus_item.get("is_cailleaux", False)

        sources = [url] if url else []
        ref = corpus_item.get("metadata", {}).get("ref", "")
        if ref:
            sources.append(f"Ref. {ref}")

        author_id = DENIS if is_cailleaux else (BERNARD if "brousse" in corpus_item.get("author", "").lower() else SYSTEM)

        # Mapper authorId → author objet (format attendu par le site)
        AUTHOR_MAP = {
            DENIS: {"id": DENIS, "name": "Denis Archambault"},
            BERNARD: {"id": BERNARD, "name": "Bernard Moreau"},
            SYSTEM: {"id": SYSTEM, "name": "Source documentaire"},
        }

        contrib = {
            "id": make_uuid(f"contrib:{corpus_item.get('id', '')}:{heritage_item_id}"),
            "heritageItemId": heritage_item_id,
            "type": contrib_type,
            "title": title,
            "body": content[:5000],
            "sources": sources,
            "period": corpus_item.get("metadata", {}).get("siecle", "") if isinstance(corpus_item.get("metadata"), dict) else None,
            "author": AUTHOR_MAP.get(author_id, {"id": author_id, "name": corpus_item.get("author", "Source documentaire")[:50]}),
        }
        new_contribs[heritage_item_id].append(contrib)
        stats[source_label] += 1

    # 2a. Mérimée → contribution "historique" (fiche MH)
    for item in pop_merimee:
        matched = match_to_item(item["title"], all_items)
        if matched:
            add_contribution(item, matched["id"], "historique", "merimee")

    # 2b. Palissy → contribution "observation" sous édifice parent
    for item in pop_palissy:
        # Essayer de matcher via le contenu (souvent contient le nom de l'édifice)
        content = item.get("content", "")
        matched = match_to_item(item["title"] + " " + content[:200], all_items)
        if matched:
            add_contribution(item, matched["id"], "observation", "palissy")

    # 2c. Facebook → "temoignage" (ou "historique" si Cailleaux)
    for item in facebook:
        is_cailleaux = item.get("is_cailleaux", False)
        ctype = "historique" if is_cailleaux else "temoignage"
        matched = match_to_item(item["title"] + " " + item.get("content", "")[:300], all_items)
        if matched:
            add_contribution(item, matched["id"], ctype, "facebook")

    # 2d. Persée → "historique"
    for item in persee:
        matched = match_to_item(item["title"] + " " + item.get("content", "")[:300], all_items)
        if matched:
            add_contribution(item, matched["id"], "historique", "persee")

    # 2e. Wikipedia → "historique"
    for item in wikipedia:
        matched = match_to_item(item["title"], all_items)
        if matched:
            add_contribution(item, matched["id"], "historique", "wikipedia")

    # 2f. Websites → "recit" (tourisme) ou "historique" (academic)
    for item in websites:
        source = item["source"]
        ctype = "recit" if "tourisme" in source else "historique"
        matched = match_to_item(item["title"] + " " + item.get("content", "")[:300], all_items)
        if matched:
            add_contribution(item, matched["id"], ctype, "websites")

    print(f"  Contributions par source:")
    for src, count in sorted(stats.items(), key=lambda x: -x[1]):
        print(f"    {src}: {count}")
    total_new = sum(len(v) for v in new_contribs.values())
    print(f"  Total nouvelles contributions: {total_new}")

    # ── Phase 3: Fusionner et compter ─────────────────────────────────
    print(f"\n--- Phase 3: Fusion ---")

    # Fusionner contributions
    final_contribs = []
    for c in existing_contribs_list:
        final_contribs.append(c)
    for item_id, clist in new_contribs.items():
        for c in clist:
            final_contribs.append(c)

    # Dédupliquer par ID
    seen = set()
    deduped = []
    for c in final_contribs:
        if c["id"] not in seen:
            seen.add(c["id"])
            deduped.append(c)
    final_contribs = deduped

    # Compter contributions par item
    contrib_counts = defaultdict(int)
    for c in final_contribs:
        contrib_counts[c["heritageItemId"]] += 1

    # Mettre à jour contributionCount sur tous les items
    final_items = []
    for item in all_items:
        item_copy = dict(item)
        item_copy["contributionCount"] = contrib_counts.get(item["id"], 0)
        # Nettoyer les champs internes
        item_copy.pop("source_ref", None)
        item_copy.pop("source_url", None)
        final_items.append(item_copy)

    # Trier : items avec contributions d'abord, puis par titre
    final_items.sort(key=lambda x: (-x["contributionCount"], x["title"]))

    # ── Phase 4: Export ───────────────────────────────────────────────
    print(f"\n--- Phase 4: Export ---")

    save_json(final_items, SITE_DATA / "heritage-items.json")
    save_json(final_contribs, SITE_DATA / "contributions.json")

    # Stats Cailleaux
    cailleaux = [c for c in final_contribs if c.get("authorId") == DENIS]

    print(f"\n{'=' * 60}")
    print(f"  EXPORT TERMINE")
    print(f"  Heritage items: {len(final_items)} ({len(existing_items)} existants + {len(new_items)} nouveaux)")
    print(f"  Contributions: {len(final_contribs)} ({len(existing_contribs_list)} existantes + {total_new} nouvelles)")
    print(f"  Contributions Denis: {len(cailleaux)}")
    print(f"  Items avec contributions: {sum(1 for i in final_items if i['contributionCount'] > 0)}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
