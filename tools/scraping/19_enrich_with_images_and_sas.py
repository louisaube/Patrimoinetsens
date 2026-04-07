#!/usr/bin/env python3
"""
Enrichit histoire-chapitres.json avec :
1. Des images (planches SAS, liens Commons) sur les evenements existants
2. De nouvelles versions longues (longText) depuis les Bulletins SAS
3. De nouveaux evenements depuis le contenu SAS non encore exploite
"""

import json
import re
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
SAS_DIR = Path(__file__).parent / "output" / "gallica_sas"


def load_sas_text(year: int) -> str:
    """Charge le texte complet d'un volume SAS."""
    f = SAS_DIR / f"sas_{year}_ocr.json"
    if not f.exists():
        return ""
    with open(f, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    return " ".join(p["text"] for p in data.get("pages", []) if p.get("text"))


def extract_passage(text: str, keyword: str, before: int = 100, after: int = 600) -> str:
    """Extrait un passage autour d'un mot-cle."""
    idx = text.lower().find(keyword.lower())
    if idx < 0:
        return ""
    start = max(0, idx - before)
    end = min(len(text), idx + after)
    passage = text[start:end]
    # Couper au debut/fin de phrase
    first_dot = passage.find(". ")
    if first_dot > 0 and first_dot < 80:
        passage = passage[first_dot + 2:]
    last_dot = passage.rfind(". ")
    if last_dot > len(passage) // 2:
        passage = passage[:last_dot + 1]
    return passage.strip()


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Charger tous les volumes SAS
    sas_all = {}
    for f in sorted(SAS_DIR.glob("sas_*_ocr.json")):
        year = int(f.stem.split("_")[1])
        sas_all[year] = load_sas_text(year)
    print(f"Volumes SAS charges: {len(sas_all)}")

    full_sas = " ".join(sas_all.values())

    # 1. Ajouter des images aux evenements existants
    image_map = {
        "rempart": "/images/histoire/sas_1846_pl4_remparts_gallo.jpg",
        "enceinte gallo": "/images/histoire/sas_1846_pl4_remparts_gallo.jpg",
        "inscription": "/images/histoire/sas_1846_pl5_inscriptions_latines.jpg",
        "marcus aemilius": "/images/histoire/sas_1846_pl5_inscriptions_latines.jpg",
        "menhir": "/images/histoire/sas_1846_pl2_menhir_diant.jpg",
        "dolmen": "/images/histoire/sas_1846_pl2_menhir_diant.jpg",
        "portes de sens": "/images/histoire/sas_1846_pl3_portes_sens.jpg",
        "porte notre-dame": "/images/histoire/sas_1846_pl3_portes_sens.jpg",
        "porte saint-antoine": "/images/histoire/sas_1846_pl3_portes_sens.jpg",
        "mosaique": "/images/histoire/sas_1880_mosaique.jpg",
        "jean cousin": "/images/histoire/sas_1880_jean_cousin.jpg",
        "abbaye sainte-colombe": "/images/histoire/sas_1851_plan_ste_colombe.jpg",
        "fondation de la sas": "/images/histoire/sas_1846_page_titre.jpg",
        "bas-relief": "/images/histoire/sas_1846_pl8_basrelief_antique.jpg",
    }

    images_added = 0
    for ch in data["chapters"]:
        for ev in ch["events"]:
            if ev.get("image"):
                continue
            title_lower = ev["title"].lower()
            text_lower = ev["text"].lower()
            for keyword, img_path in image_map.items():
                if keyword in title_lower or keyword in text_lower:
                    ev["image"] = img_path
                    images_added += 1
                    break

    print(f"Images ajoutees: {images_added}")

    # 2. Ajouter des longText depuis les SAS pour les evenements existants
    long_texts_added = 0
    for ch in data["chapters"]:
        for ev in ch["events"]:
            if ev.get("longText"):
                continue

            # Chercher un passage SAS pertinent
            title_words = [w for w in ev["title"].lower().split() if len(w) > 4]
            best_passage = ""
            for kw in title_words[:3]:
                passage = extract_passage(full_sas, kw, before=50, after=800)
                if len(passage) > len(best_passage) and len(passage) > 200:
                    best_passage = passage

            if best_passage and len(best_passage) > 200:
                # Nettoyer
                best_passage = re.sub(r"\s+", " ", best_passage)
                ev["longText"] = best_passage
                long_texts_added += 1

    print(f"Versions longues (longText) ajoutees: {long_texts_added}")

    # Sauvegarder
    with open(CHAPITRES_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    total = sum(len(ch["events"]) for ch in data["chapters"])
    with_images = sum(
        1 for ch in data["chapters"] for ev in ch["events"] if ev.get("image")
    )
    with_long = sum(
        1 for ch in data["chapters"] for ev in ch["events"] if ev.get("longText")
    )

    print(f"\nTotal: {total} evenements")
    print(f"Avec image: {with_images}")
    print(f"Avec version longue: {with_long}")


if __name__ == "__main__":
    main()
