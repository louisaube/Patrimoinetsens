#!/usr/bin/env python3
"""Ajoute les 'impenses' — ce que les sources ne disent jamais mais qu'il faut dire."""
import json, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

path = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

existing = set()
for ch in data["chapters"]:
    for ev in ch["events"]:
        existing.add(ev["title"].lower()[:50])

SRC = "Poree, C. Cahiers de doleances du bailliage de Sens, 1908."

new_events = [
    ("VI", {
        "year": 1789,
        "title": "Le coton de Saint-Domingue : Sens au bout de la chaine de l'esclavage",
        "text": "La manufacture royale de velours de Sens consomme 20 000 livres de coton par an. Ce coton vient de Cayenne (3 livres 15 sous la livre) et de Saint-Domingue (2 livres 15 sous). Il arrive par Nantes, La Rochelle, Bordeaux et Rouen --- les quatre grands ports negriers francais. Les 624 ouvriers senonais travaillent un coton recolte par des esclaves. Mais le mot 'esclave' n'apparait pas une seule fois dans les cahiers de doleances. Sens est au bout de la chaine du commerce triangulaire --- et ne le dit jamais.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Manufacture de velours --- coton colonial"},
        "sources": [SRC + " l.2664-2667 (coton de Cayenne et Saint-Domingue, prix, volumes)."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "137 enfants de 9 ans dans la manufacture : le travail des enfants, fait 'positif'",
        "text": "La manufacture de velours sur coton emploie '137 enfants des deux sexes de 9 ans jusqu'a 15 ans, lesquels enfants gagnent 8 sous par jour.' Les manufactures de bonneterie emploient des enfants 'depuis 7 jusqu'a 15 ans.' Les cahiers de doleances ne s'en indignent pas --- au contraire, c'est presente comme un bienfait : ca occupe les pauvres. La notion d'enfance protegee n'existe pas en 1789. La premiere loi sur le travail des enfants ne viendra qu'en 1841.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Manufactures --- enfants au travail"},
        "sources": [SRC + " l.2681-2682 (137 enfants, 8s/jour), l.2752 (enfants des 7 ans)."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "746 femmes dans les manufactures : elles produisent mais ne signent aucun cahier",
        "text": "A Sens en 1789, les manufactures emploient au minimum 746 femmes et filles : 250 dans le velours sur coton (de 15 a 50 ans), 364 dans la bonneterie, 132 dans les filatures de coton (de 15 a 60 ans). Elles representent plus de la moitie de la main-d'oeuvre industrielle senonaise. Mais aucune d'entre elles ne signe un cahier de doleances. Aucune n'est mentionnee par son nom. Les assemblees de paroisses sont des assemblees d'hommes. Les femmes produisent la richesse et n'ont pas de voix.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Manufactures --- femmes invisibles"},
        "sources": [SRC + " l.2680 (250 femmes velours), l.2751 (364 bonneterie), l.2818 (132 filatures)."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Les flotteurs : un metier qui faisait la 'misere' d'un tiers de Brienon",
        "text": "A Brienon-sur-Armancon, le cahier de doleances declare que 'le flottage des bois fait la ressource ou plutot la misere des habitants.' Un tiers de la population vit du flottage --- un metier dangereux, saisonnier, mal paye. Les flotteurs equipes de longues perches a crochets de fer risquent leur vie a chaque rapide. Leur travail alimente Paris en bois de chauffage (1,5 million de steres par an), mais eux-memes vivent dans la precarite. Le flottage s'arretera en 1923.",
        "location": {"lat": 48.0500, "lng": 3.6000, "label": "Brienon --- flotteurs de bois"},
        "sources": [SRC + " Brienon l.11083.", "Hydrauxois, L'epopee des flotteurs."],
        "heritageItemId": None,
    }),
]

added = 0
for ch_id, event in new_events:
    if event["title"].lower()[:50] in existing:
        continue
    for ch in data["chapters"]:
        if ch["id"] == ch_id:
            ch["events"].append(event)
            ch["events"].sort(key=lambda e: e["year"])
            added += 1
            break

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

total = sum(len(ch["events"]) for ch in data["chapters"])
total_chars = sum(len(ev["text"]) for ch in data["chapters"] for ev in ch["events"])
print(f"+{added} evenements (impenses)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
