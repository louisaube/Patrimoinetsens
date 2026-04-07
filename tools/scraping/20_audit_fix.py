#!/usr/bin/env python3
"""
Corrige les problemes identifies par l'audit de coherence :
1. Supprime les artefacts de scraping (menu Daguin)
2. Corrige les fausses dates (584, 657, 745)
3. Fusionne les doublons
4. Reclasse les evenements dans le bon chapitre
5. Corrige les accents manquants
6. Supprime les events vides/inutiles
7. Renomme le chapitre VII
"""

import json
import re
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"


def clean_daguin_artifacts(text: str) -> str:
    """Supprime les artefacts de navigation Daguin."""
    # Pattern: "1. Accueil 2. Gérard Daguin Chroniques Historiques 3. ..."
    text = re.sub(
        r"^1\.\s*\[?Accueil\]?.*?(?:Chroniques Historiques|chroniques-historiques).*?\d+\.\s*",
        "", text, flags=re.DOTALL | re.IGNORECASE
    )
    # Aussi les URL du site
    text = re.sub(r"http://www\.histoire-sens-senonais-yonne\.com[^\s]*", "", text)
    # Titres markdown redondants
    text = re.sub(r"^#+ .+\n", "", text)
    # Nettoyage espaces
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"  +", " ", text)
    return text.strip()


def fix_accents(text: str) -> str:
    """Remet les accents sur les mots sans diacritiques."""
    replacements = {
        "cathedrale": "cathédrale",
        "archeveque": "archevêque",
        "eveque": "évêque",
        "eglise": "église",
        "siecle": "siècle",
        "medievale": "médiévale",
        "medieval": "médiéval",
        "metropole": "métropole",
        "archeologique": "archéologique",
        "ecole": "école",
        "hopital": "hôpital",
        "Hotel-Dieu": "Hôtel-Dieu",
        "theatre": "théâtre",
        "revolutionnaire": "révolutionnaire",
        "Revolution": "Révolution",
        "republique": "république",
        "Republique": "République",
        "Sebastien": "Sébastien",
        "Stephane": "Stéphane",
        "ceremonie": "cérémonie",
        "generale": "générale",
        "general": "général",
        "societe": "société",
        "Societe": "Société",
        "academique": "académique",
        "genealogie": "généalogie",
        "sepulture": "sépulture",
        "necropole": "nécropole",
        "cimetiere": "cimetière",
        "pepiniere": "pépinière",
        "eclairage": "éclairage",
        "electricite": "électricité",
        " a ": " à ",  # attention aux faux positifs
    }
    for old, new in replacements.items():
        # Ne remplacer que les mots entiers (pas les sous-chaines)
        text = re.sub(r"\b" + re.escape(old) + r"\b", new, text, flags=re.IGNORECASE)
    return text


def chapter_for_year(year: int) -> str:
    if year < 476: return "I"
    if year < 1000: return "II"
    if year < 1300: return "III"
    if year < 1600: return "IV"
    if year < 1789: return "V"
    if year < 1945: return "VI"
    return "VII"


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    stats = {
        "artifacts_cleaned": 0,
        "accents_fixed": 0,
        "dates_fixed": 0,
        "duplicates_removed": 0,
        "reclassified": 0,
        "removed_empty": 0,
    }

    # ── 1. Corriger les fausses dates ─────────────────────────────────
    date_fixes = {
        584: None,   # Jean Cousin square -> supprimer (doublon)
        657: None,   # Theatre -> supprimer (doublon de 1882)
        745: None,   # Notre-Dame Providence -> supprimer (doublon de 1151)
    }

    for ch in data["chapters"]:
        ch["events"] = [
            ev for ev in ch["events"]
            if ev["year"] not in date_fixes or date_fixes[ev["year"]] is not None
        ]
        for ev in ch["events"]:
            if ev["year"] in date_fixes and date_fixes[ev["year"]] is not None:
                ev["year"] = date_fixes[ev["year"]]
                stats["dates_fixed"] += 1

    # ── 2. Fixer la date Charles V (1350 -> 1370) ────────────────────
    for ch in data["chapters"]:
        for ev in ch["events"]:
            if "charles v" in ev["title"].lower() and ev["year"] == 1350:
                ev["year"] = 1370
                stats["dates_fixed"] += 1

    # ── 3. Supprimer les doublons ─────────────────────────────────────
    # Titres a supprimer (garder la version manuelle, supprimer les scrapes)
    titles_to_remove = set()

    # Jean Langlois : garder "Jean Langlois, premier martyr"
    titles_to_remove.add("des lieux et des hommes, 22 janvier 1547, le protestant jean langlois est condamn")
    titles_to_remove.add("le protestant jean langlois est condamné à mort, en 1547, à sens")

    # Blanche de Castille : garder celle avec Gautier Cornut
    titles_to_remove.add("un jour, une histoire: 27 novembre 1252, blanche de castille meurt... saint loui")

    # Charles IX : garder la version detaillee
    titles_to_remove.add("un jour, une histoire : le 15 mars 1563 charles ix et catherine de médicis entre")

    # Pont Cornet : garder "Le pont Lucien Cornet"
    titles_to_remove.add("des lieux et de hommes, pont neuf, pont lucien cornet et pont du diable")
    titles_to_remove.add("le 18 mai 1913 il y a cent ans, on inaugurait le pont lucien cornet")

    # Duchesne : garder une version
    titles_to_remove.add("des lieux et des hommes, le général duchesne")

    # Gare : garder "Le train arrive à Sens"
    titles_to_remove.add("un lieu, une histoire, la gare de sens 1849")

    for ch in data["chapters"]:
        before = len(ch["events"])
        ch["events"] = [
            ev for ev in ch["events"]
            if ev["title"].lower()[:80] not in titles_to_remove
        ]
        stats["duplicates_removed"] += before - len(ch["events"])

    # ── 4. Nettoyer les artefacts Daguin de TOUS les textes ──────────
    for ch in data["chapters"]:
        for ev in ch["events"]:
            old_text = ev["text"]
            ev["text"] = clean_daguin_artifacts(ev["text"])
            if ev.get("longText"):
                ev["longText"] = clean_daguin_artifacts(ev["longText"])
            if ev["text"] != old_text:
                stats["artifacts_cleaned"] += 1

    # ── 5. Supprimer les events avec texte trop court apres nettoyage ─
    for ch in data["chapters"]:
        before = len(ch["events"])
        ch["events"] = [
            ev for ev in ch["events"]
            if len(ev["text"]) >= 50
        ]
        stats["removed_empty"] += before - len(ch["events"])

    # ── 6. Corriger les accents ───────────────────────────────────────
    for ch in data["chapters"]:
        for ev in ch["events"]:
            old = ev["text"]
            ev["text"] = fix_accents(ev["text"])
            ev["title"] = fix_accents(ev["title"])
            if ev["text"] != old:
                stats["accents_fixed"] += 1

    # ── 7. Reclasser les evenements dans le bon chapitre ──────────────
    all_events = []
    for ch in data["chapters"]:
        for ev in ch["events"]:
            correct_ch = chapter_for_year(ev["year"])
            if correct_ch != ch["id"]:
                stats["reclassified"] += 1
            all_events.append((correct_ch, ev))
        ch["events"] = []

    for ch_id, ev in all_events:
        for ch in data["chapters"]:
            if ch["id"] == ch_id:
                ch["events"].append(ev)
                break

    # Trier par annee dans chaque chapitre
    for ch in data["chapters"]:
        ch["events"].sort(key=lambda e: e["year"])

    # ── 8. Renommer le chapitre VII ───────────────────────────────────
    for ch in data["chapters"]:
        if ch["id"] == "VII":
            ch["title"] = "Le XXe siècle"
            ch["periodLabel"] = "XXe — XXIe siècle"
            ch["period"] = "1914 — 2025"
            ch["summary"] = "Deux guerres mondiales, la Libération, la fin des tanneries et du flottage, et la renaissance du patrimoine sénonais."

    # ── 9. Fixer le heritageItemId fourre-tout ────────────────────────
    # e5555555-0012 = Hotel de ville. Ne garder que pour les events sur l'hotel de ville
    for ch in data["chapters"]:
        for ev in ch["events"]:
            if ev.get("heritageItemId") == "e5555555-0012-0012-0012-000000000012":
                title_lower = ev["title"].lower()
                if not any(kw in title_lower for kw in ["hotel de ville", "mairie", "doléances", "commune"]):
                    ev["heritageItemId"] = None

    # ── Sauvegarde ────────────────────────────────────────────────────
    with open(CHAPITRES_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    total = sum(len(ch["events"]) for ch in data["chapters"])
    print(f"AUDIT FIX TERMINE")
    print(f"  Artefacts nettoyes: {stats['artifacts_cleaned']}")
    print(f"  Accents corriges: {stats['accents_fixed']}")
    print(f"  Dates corrigees: {stats['dates_fixed']}")
    print(f"  Doublons supprimes: {stats['duplicates_removed']}")
    print(f"  Reclasses: {stats['reclassified']}")
    print(f"  Vides supprimes: {stats['removed_empty']}")
    print(f"  Total evenements: {total}")
    for ch in data["chapters"]:
        print(f"    {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
