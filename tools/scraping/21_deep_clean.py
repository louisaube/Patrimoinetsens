#!/usr/bin/env python3
"""
Nettoyage profond du Grand Récit suite à l'audit pédagogique.
1. Supprimer les longTexts OCR poubelle (encodage cassé, latin, cookies)
2. Nettoyer les préfixes bruts Daguin dans les champs text
3. Fixer les encodages cassés
4. Fusionner les doublons
5. Rééquilibrer : réduire WW2 (17→8), ajouter après-guerre
"""

import json
import re
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"


def is_garbage_longtext(text: str) -> bool:
    """Détecte un longText poubelle (OCR SAS mal encodé, hors sujet)."""
    if not text:
        return False
    # Encodage cassé (latin-1 mal décodé)
    if any(g in text for g in ["Ã©", "Ã¨", "Ã ", "Ã®", "Ã´", "Ãª", "Ã¹", "Ã§"]):
        return True
    # Cookie banners
    if "cookie" in text.lower() and "personnalis" in text.lower():
        return True
    # URLs du site source
    if text.startswith("http://www.histoire-sens"):
        return True
    # Latin épigraphique sans contexte
    if any(lat in text for lat in ["HONORIB", "FVNCTO", "FLAMINI", "MVNERAR"]):
        # Sauf si le texte principal parle d'inscriptions
        return True
    return False


def clean_text_prefix(text: str) -> str:
    """Nettoie les préfixes bruts du site Daguin."""
    # Pattern: "Des Lieux et des Hommes, TITRE 4. TITRE REEL contenu..."
    # Ou: "Les Monuments, SOUS-TITRE 4. TITRE REEL contenu..."
    # Ou: "Vers la séparation de l'Eglise et de l'Etat, ... 4. TITRE contenu..."

    prefixes_to_strip = [
        r"Des [Ll]ieux et des? [Hh]ommes,?\s*",
        r"Les Monuments,?\s*(?:Histoire de la Cathédrale|les Mairies successives[^4]*|le\s+Monument aux morts|Le Marché couvert|Le Théâtre[^4]*|Jean Cousin[^4]*)\s*",
        r"Les Monuments,?\s*",
        r"Un [Jj]our,?\s*une [Hh]istoire\s*[:;,]?\s*",
        r"Un [Ll]ieu,?\s*une [Hh]istoire\s*[:;,]?\s*",
        r"Un [Ll]ieu une [Hh]istoire,?\s*",
        r"Vers la séparation de l'[ÉEé]glise et de l'[ÉEé]tat,?\s*les conséquences à Sens\s*",
        r"Vers la séparation de l'Eglise et de l'Etat,?\s*les conséquences à Sens\s*",
        r"Sens,?\s*une ville en guerre,?\s*1939-1945\s*",
        r"Sens,?\s*la cité médiévale[^4]*",
    ]

    for prefix in prefixes_to_strip:
        text = re.sub(r"^" + prefix, "", text, flags=re.IGNORECASE)

    # Supprimer le numéro de section "4. " ou "3. " en début
    text = re.sub(r"^\d+\.\s*", "", text)

    # Supprimer les URLs www.histoire-sens...
    text = re.sub(r"www\.histoire-sens-senonais-yonne\.com[^\s]*\s*", "", text)

    # Supprimer les cookie banners
    text = re.sub(
        r"www\.histoire-sens[^\n]*dépose des cookies[^\n]*personnaliser l'interface du site\.\s*",
        "", text, flags=re.IGNORECASE | re.DOTALL
    )

    # Nettoyer espaces multiples et retours à la ligne
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"  +", " ", text)

    return text.strip()


def fix_encoding(text: str) -> str:
    """Corrige les encodages cassés UTF-8/Latin-1."""
    replacements = {
        "Ã©": "é", "Ã¨": "è", "Ã ": "à", "Ã®": "î",
        "Ã´": "ô", "Ãª": "ê", "Ã¹": "ù", "Ã§": "ç",
        "Ã¢": "â", "Ã»": "û", "Ã¼": "ü", "Ã¯": "ï",
        "\xc5\x93": "\u0153",  # oe ligature
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    stats = {
        "longtext_removed": 0,
        "prefix_cleaned": 0,
        "encoding_fixed": 0,
        "duplicates_merged": 0,
        "ww2_reduced": 0,
    }

    # ── 1. Supprimer les longTexts poubelle ───────────────────────────
    for ch in data["chapters"]:
        for ev in ch["events"]:
            if is_garbage_longtext(ev.get("longText", "")):
                ev["longText"] = None
                stats["longtext_removed"] += 1

    # ── 2. Nettoyer les préfixes bruts ────────────────────────────────
    for ch in data["chapters"]:
        for ev in ch["events"]:
            old = ev["text"]
            ev["text"] = clean_text_prefix(ev["text"])
            if ev["text"] != old:
                stats["prefix_cleaned"] += 1
            # Aussi nettoyer le titre
            ev["title"] = clean_text_prefix(ev["title"])

    # ── 3. Fixer les encodages cassés ─────────────────────────────────
    for ch in data["chapters"]:
        for ev in ch["events"]:
            old_text = ev["text"]
            old_title = ev["title"]
            ev["text"] = fix_encoding(ev["text"])
            ev["title"] = fix_encoding(ev["title"])
            if ev.get("longText"):
                ev["longText"] = fix_encoding(ev["longText"])
            if ev["text"] != old_text or ev["title"] != old_title:
                stats["encoding_fixed"] += 1

    # ── 4. Fusionner les doublons connus ──────────────────────────────
    # Identifier par année + mots-clés similaires
    for ch in data["chapters"]:
        seen_topics = {}  # (year, topic_key) → index du premier event
        to_remove = set()

        for i, ev in enumerate(ch["events"]):
            year = ev["year"]
            title_lower = ev["title"].lower()

            # Créer une clé de topic
            topic_key = None
            if "becket" in title_lower or "thomas becket" in title_lower:
                topic_key = (year // 10, "becket")
            elif "jeanne d'arc" in title_lower or "chevauchée" in title_lower:
                topic_key = (year // 10, "jeanne")
            elif "jean cousin" in title_lower and "eva" not in title_lower:
                topic_key = (year // 10, "cousin")
            elif "monument aux morts" in title_lower or "ils sont morts" in title_lower:
                topic_key = (year // 10, "monument_morts")
            elif "duchesne" in title_lower or "madagascar" in title_lower:
                topic_key = (year // 10, "duchesne")
            elif "cathédrale" in title_lower and ("chantier" in title_lower or "modification" in title_lower):
                topic_key = (year // 100, "cathedrale_travaux")

            if topic_key:
                if topic_key in seen_topics:
                    # Garder le plus long, supprimer l'autre
                    first_idx = seen_topics[topic_key]
                    first_ev = ch["events"][first_idx]
                    if len(ev["text"]) > len(first_ev["text"]):
                        to_remove.add(first_idx)
                        seen_topics[topic_key] = i
                    else:
                        to_remove.add(i)
                    stats["duplicates_merged"] += 1
                else:
                    seen_topics[topic_key] = i

        ch["events"] = [ev for i, ev in enumerate(ch["events"]) if i not in to_remove]

    # ── 5. Réduire WW2 : fusionner les 12 fiches 1939-1940 ───────────
    for ch in data["chapters"]:
        if ch["id"] != "VII":
            continue

        # Grouper les events 1939-1940
        ww2_events = [ev for ev in ch["events"] if 1939 <= ev["year"] <= 1940]
        other_events = [ev for ev in ch["events"] if not (1939 <= ev["year"] <= 1940)]

        if len(ww2_events) > 8:
            # Garder les 6 plus longs + 2 avec les meilleurs titres
            ww2_events.sort(key=lambda e: len(e["text"]), reverse=True)
            kept = ww2_events[:6]
            stats["ww2_reduced"] = len(ww2_events) - 6

            # Garder aussi ceux avec des titres spécifiques (pas génériques)
            for ev in ww2_events[6:]:
                if any(kw in ev["title"].lower() for kw in ["15 juin", "ponts", "libération", "résistance"]):
                    kept.append(ev)

            ch["events"] = other_events + kept
            ch["events"].sort(key=lambda e: e["year"])

    # ── 6. Supprimer les events avec texte < 50 chars après nettoyage ─
    for ch in data["chapters"]:
        before = len(ch["events"])
        ch["events"] = [ev for ev in ch["events"] if len(ev["text"]) >= 50]
        removed = before - len(ch["events"])
        if removed:
            print(f"  Ch {ch['id']}: {removed} events vides supprimés")

    # ── Sauvegarde ────────────────────────────────────────────────────
    with open(CHAPITRES_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    total = sum(len(ch["events"]) for ch in data["chapters"])
    with_long = sum(1 for ch in data["chapters"] for ev in ch["events"] if ev.get("longText"))

    print(f"\nNETTOYAGE PROFOND TERMINE")
    print(f"  longTexts poubelle supprimés: {stats['longtext_removed']}")
    print(f"  Préfixes bruts nettoyés: {stats['prefix_cleaned']}")
    print(f"  Encodages fixés: {stats['encoding_fixed']}")
    print(f"  Doublons fusionnés: {stats['duplicates_merged']}")
    print(f"  Events WW2 réduits: {stats['ww2_reduced']}")
    print(f"  Total événements: {total}")
    print(f"  Avec longText propre: {with_long}")
    for ch in data["chapters"]:
        lt_count = sum(1 for ev in ch["events"] if ev.get("longText"))
        print(f"    {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])} events ({lt_count} longTexts)")


if __name__ == "__main__":
    main()
