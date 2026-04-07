#!/usr/bin/env python3
"""
09_enrich_histoire.py
=====================
Enrichit histoire-chapitres.json avec le contenu Daguin + doléances + corpus.
Transforme 82 pages Daguin en événements datés, localisés, vulgarisés.

Usage:
    python 09_enrich_histoire.py
"""

import json
import re
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

DAGUIN_PATH = Path(__file__).parent / "output" / "daguin" / "daguin_full_crawl.json"
DAGUIN_KEYS_PATH = Path(__file__).parent / "output" / "daguin" / "daguin_1789_1914.json"
CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
ITEMS_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "heritage-items.json"

# Centre de Sens pour les events sans localisation précise
SENS_CENTER = {"lat": 48.1977, "lng": 3.2837, "label": "Sens"}

# Lieux connus avec coordonnées
KNOWN_LOCATIONS = {
    "cathédrale": {"lat": 48.1979, "lng": 3.2837, "label": "Cathédrale Saint-Étienne"},
    "palais synodal": {"lat": 48.1970, "lng": 3.2840, "label": "Palais synodal"},
    "hôtel de ville": {"lat": 48.1972, "lng": 3.2838, "label": "Hôtel de ville"},
    "mairie": {"lat": 48.1972, "lng": 3.2838, "label": "Hôtel de ville"},
    "marché couvert": {"lat": 48.1979, "lng": 3.2819, "label": "Marché couvert"},
    "théâtre": {"lat": 48.1968, "lng": 3.2825, "label": "Théâtre municipal"},
    "gare": {"lat": 48.1920, "lng": 3.2780, "label": "Gare de Sens"},
    "rempart": {"lat": 48.1965, "lng": 3.2860, "label": "Enceinte gallo-romaine"},
    "enceinte": {"lat": 48.1965, "lng": 3.2860, "label": "Enceinte gallo-romaine"},
    "saint-savinien": {"lat": 48.1930, "lng": 3.2850, "label": "Basilique Saint-Savinien"},
    "sainte-colombe": {"lat": 48.2060, "lng": 3.2750, "label": "Abbaye Sainte-Colombe"},
    "saint-pierre-le-vif": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif"},
    "célestins": {"lat": 48.1985, "lng": 3.2870, "label": "Collège Mallarmé — Célestins"},
    "mallarmé": {"lat": 48.1985, "lng": 3.2870, "label": "Collège Mallarmé — Célestins"},
    "ursulines": {"lat": 48.1990, "lng": 3.2850, "label": "Ancien couvent des Ursulines"},
    "jacobins": {"lat": 48.1975, "lng": 3.2810, "label": "Couvent des Jacobins"},
    "carmel": {"lat": 48.1980, "lng": 3.2878, "label": "Carmel de Sens"},
    "pont": {"lat": 48.1955, "lng": 3.2820, "label": "Pont sur l'Yonne"},
    "moulin à tan": {"lat": 48.1920, "lng": 3.2900, "label": "Parc du Moulin à Tan"},
    "maison d'abraham": {"lat": 48.1958, "lng": 3.2831, "label": "Maison d'Abraham"},
    "monument aux morts": {"lat": 48.1975, "lng": 3.2810, "label": "Monument aux morts"},
    "prison": {"lat": 48.1970, "lng": 3.2850, "label": "Ancienne prison de Sens"},
    "notre-dame": {"lat": 48.1990, "lng": 3.2870, "label": "Notre-Dame de la Providence"},
    "saint-maurice": {"lat": 48.1978, "lng": 3.2755, "label": "Église Saint-Maurice"},
    "champbertrand": {"lat": 48.1940, "lng": 3.2830, "label": "Champbertrand"},
    "poste": {"lat": 48.1975, "lng": 3.2835, "label": "La Poste de Sens"},
    "caisse d'épargne": {"lat": 48.1973, "lng": 3.2832, "label": "Caisse d'épargne"},
    "usine": {"lat": 48.1930, "lng": 3.2800, "label": "Quartier industriel sud"},
    "tannerie": {"lat": 48.1925, "lng": 3.2810, "label": "Anciennes tanneries"},
    "place de la république": {"lat": 48.1972, "lng": 3.2838, "label": "Place de la République"},
    "templier": {"lat": 48.1970, "lng": 3.2850, "label": "Sens — Concile provincial"},
    "huguenot": {"lat": 48.1975, "lng": 3.2830, "label": "Quartier protestant"},
    "jean cousin": {"lat": 48.1965, "lng": 3.2830, "label": "Square Jean Cousin"},
}


def guess_location(title: str, content: str) -> dict:
    """Devine la localisation d'un événement à partir du texte."""
    text = (title + " " + content[:500]).lower()
    for keyword, loc in KNOWN_LOCATIONS.items():
        if keyword in text:
            return dict(loc)
    return dict(SENS_CENTER)


def extract_main_year(title: str, content: str) -> int | None:
    """Extrait l'année principale d'un texte."""
    # D'abord dans le titre
    years = re.findall(r'\b(1[0-9]{3}|[3-9][0-9]{2})\b', title)
    if years:
        return int(years[0])
    # Puis dans le contenu
    years = re.findall(r'\b(1[0-9]{3}|[3-9][0-9]{2})\b', content[:1000])
    if years:
        return int(years[0])
    return None


def chapter_for_year(year: int) -> str:
    """Retourne l'ID du chapitre pour une année donnée."""
    if year < 476: return "I"
    if year < 1000: return "II"
    if year < 1300: return "III"
    if year < 1600: return "IV"
    if year < 1789: return "V"
    if year < 1914: return "VI"
    return "VII"


def extract_first_paragraphs(content: str, max_chars: int = 600) -> str:
    """Extrait les premiers paragraphes significatifs d'un contenu markdown."""
    lines = content.split("\n")
    result = []
    chars = 0

    for line in lines:
        line = line.strip()
        # Skip headers, images, links seuls, lignes courtes
        if not line:
            continue
        if line.startswith("#"):
            continue
        if line.startswith("!["):
            continue
        if line.startswith("[") and line.endswith(")"):
            continue
        if len(line) < 20:
            continue
        # Nettoyer le markdown
        line = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', line)  # [text](url) → text
        line = re.sub(r'\*\*([^*]+)\*\*', r'\1', line)  # **bold** → bold
        line = re.sub(r'\*([^*]+)\*', r'\1', line)  # *italic* → italic
        line = line.strip()

        result.append(line)
        chars += len(line)
        if chars >= max_chars:
            break

    text = " ".join(result)
    if len(text) > max_chars:
        # Couper à la dernière phrase complète
        cut = text[:max_chars].rfind(".")
        if cut > max_chars // 2:
            text = text[:cut + 1]
        else:
            text = text[:max_chars] + "..."
    return text


def match_heritage_item(title: str, content: str, items: list[dict]) -> str | None:
    """Trouve le heritage item correspondant."""
    text = (title + " " + content[:300]).lower()
    for item in items:
        item_title = item["title"].lower()
        # Au moins 2 mots significatifs en commun
        words = [w for w in item_title.split() if len(w) > 3]
        matches = sum(1 for w in words if w in text)
        if matches >= 2:
            return item["id"]
    return None


def main():
    print("=" * 60)
    print("  Enrichissement histoire-chapitres.json")
    print("=" * 60)

    # Charger les données
    with open(DAGUIN_PATH, "r", encoding="utf-8") as f:
        daguin_pages = json.load(f)
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        chapitres = json.load(f)
    with open(ITEMS_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    # Charger aussi les pages clés 1789-1914 (plus détaillées)
    daguin_keys = []
    if DAGUIN_KEYS_PATH.exists():
        with open(DAGUIN_KEYS_PATH, "r", encoding="utf-8") as f:
            daguin_keys = json.load(f)

    print(f"  Daguin: {len(daguin_pages)} pages")
    print(f"  Daguin clés: {len(daguin_keys)} pages")
    print(f"  Chapitres existants: {len(chapitres['chapters'])}")

    # Index des événements existants par titre (pour éviter les doublons)
    existing_titles = set()
    for ch in chapitres["chapters"]:
        for ev in ch["events"]:
            existing_titles.add(ev["title"].lower().strip())

    # Transformer chaque page Daguin en événement
    new_events_by_chapter = {ch["id"]: [] for ch in chapitres["chapters"]}

    all_daguin = daguin_pages + daguin_keys
    # Dédupliquer par URL
    seen_urls = set()
    unique_daguin = []
    for p in all_daguin:
        if p["url"] not in seen_urls:
            seen_urls.add(p["url"])
            unique_daguin.append(p)

    print(f"  Pages Daguin uniques: {len(unique_daguin)}")

    for page in unique_daguin:
        title = page["title"]
        content = page["content"]
        url = page["url"]

        if len(content) < 200:
            continue

        year = extract_main_year(title, content)
        if not year or year < 300 or year > 2000:
            continue

        ch_id = chapter_for_year(year)
        if ch_id not in new_events_by_chapter:
            continue

        # Vérifier pas de doublon
        title_clean = title.strip()[:100]
        if title_clean.lower() in existing_titles:
            continue

        # Extraire le texte vulgarisé
        text = extract_first_paragraphs(content, max_chars=500)
        if len(text) < 50:
            continue

        location = guess_location(title, content)
        heritage_id = match_heritage_item(title, content, items)

        event = {
            "year": year,
            "title": title_clean,
            "text": text,
            "location": location,
            "sources": [f"Daguin, G. \"{title_clean[:60]}.\" histoire-sens-senonais-yonne.com."],
            "heritageItemId": heritage_id,
        }

        new_events_by_chapter[ch_id].append(event)
        existing_titles.add(title_clean.lower())

    # Injecter dans les chapitres
    total_added = 0
    for ch in chapitres["chapters"]:
        new_events = new_events_by_chapter.get(ch["id"], [])
        if new_events:
            # Fusionner et trier par année
            ch["events"] = ch["events"] + new_events
            ch["events"].sort(key=lambda e: e["year"])
            total_added += len(new_events)
            print(f"  Chapitre {ch['id']}: +{len(new_events)} events = {len(ch['events'])} total")

    # Sauvegarder
    with open(CHAPITRES_PATH, "w", encoding="utf-8") as f:
        json.dump(chapitres, f, ensure_ascii=False, indent=2)

    total_events = sum(len(ch["events"]) for ch in chapitres["chapters"])
    print(f"\n{'=' * 60}")
    print(f"  ENRICHISSEMENT TERMINE")
    print(f"  Événements ajoutés: +{total_added}")
    print(f"  Total événements: {total_events}")
    print(f"  Par chapitre:")
    for ch in chapitres["chapters"]:
        print(f"    {ch['id']}. {ch['title'][:30]:30} : {len(ch['events'])} événements")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
