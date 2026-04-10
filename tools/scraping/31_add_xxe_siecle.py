#!/usr/bin/env python3
"""Renforce le chapitre VII (XXe siecle) avec WWI, WWII details, Augusta Hure, musee."""
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

new_events = [
    # WWI
    ("VII", {
        "year": 1914,
        "title": "Sens, ville-hopital : 7 hopitaux militaires et 40 000 blesses",
        "text": "Des aout 1914, Sens ouvre 7 hopitaux militaires. L'ecole Saint-Edme (100 a 230 lits), l'orphelinat Bellocier (60 lits), l'ancien Grand Seminaire (250 lits, y compris des prisonniers allemands). A une centaine de kilometres du front de la Marne, Sens devient un noeud sanitaire majeur : 40 000 blesses y sont transferes ou soignes pendant la guerre. En 1918, la grippe espagnole frappe aussi les hopitaux. Sens ne voit pas les tranchees, mais elle recoud les hommes qui en reviennent.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- ville-hopital 1914-1918"},
        "sources": ["Archives dep. Yonne, 'La Premiere Guerre mondiale a l'hopital.'", "Hopitaux militaires Yonne (overblog)."],
        "heritageItemId": None,
    }),
    # Augusta Hure
    ("VII", {
        "year": 1920,
        "title": "Augusta Hure : premiere femme conservatrice de musee en France",
        "text": "En 1920, Augusta Hure (1870-1953) est nommee conservatrice des musees de Sens. C'est la premiere femme a occuper ce poste en France. Autodidacte en geologie --- elle avait recu la medaille d'argent de la Societe geologique de France en 1916 --- elle modernise les musees, enrichit les collections, et publie 112 articles scientifiques. Ses ouvrages 'Le Senonais prehistorique', 'Le Senonais aux ages du Bronze et du Fer', 'Le Senonais gallo-romain' font encore reference. Elle constitue une collection de milliers de silex neolithiques.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Musees de Sens --- Augusta Hure"},
        "sources": ["Ville de Sens, 'Le fabuleux destin d'Augusta Hure.'", "Wikipedia, Augusta Hure."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # Von Speck
    ("VII", {
        "year": 1940,
        "title": "Le general Von Speck abattu a Sens : le seul general allemand tue en 1940",
        "text": "Le 15 juin 1940, le general allemand Von Speck attaque Sens avec la 25e division d'infanterie. Un soldat francais l'abat d'un tir de fusil-mitrailleur depuis un immeuble de la rive opposee de l'Yonne. Von Speck est le seul general allemand tue pendant toute la campagne de France de 1940. A 19h30, les unites francaises du 5e Regiment de Dragons Portes decrochent. Le lendemain, Sens est occupee.",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Ponts de Sens --- mort de Von Speck"},
        "sources": ["Daguin, G. '15 juin 1940, les combats pour les ponts de Sens.'", "France Bleu, 70 ans Liberation."],
        "heritageItemId": None,
    }),
    # Liberation details
    ("VII", {
        "year": 1944,
        "title": "Liberation : 2 FFI, 3 civils, 1 Americain, 13 Allemands --- les ponts intacts",
        "text": "Le 21 aout 1944 a 14h30, les soldats americains de la 3e Armee de Patton entrent dans Sens, precedes par les resistants du maquis Kleber. Detail crucial : les deux ponts sur l'Yonne sont intacts, permettant l'avancee rapide des blindes vers l'est. Bilan de la liberation : 19 morts (2 FFI, 3 civils, 1 soldat americain, 13 soldats allemands), une centaine de prisonniers. Sens est la seule ville du departement sur la route directe de la 3e Armee US.",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Ponts de Sens --- Liberation 21 aout 1944"},
        "sources": ["Maitron, Sens 21 aout 1944.", "France Bleu, 70 ans Liberation."],
        "heritageItemId": None,
    }),
    # Musee 1791
    ("VI", {
        "year": 1791,
        "title": "Le Pere Laire sauve les livres : naissance du musee de Sens",
        "text": "En 1791, pendant que la Revolution confisque les biens de l'Eglise et des emigres, le Pere Laire rassemble livres et oeuvres d'art dans la salle synodale. Il sauve ainsi de la destruction des manuscrits, des tableaux, des objets liturgiques qui auraient ete vendus ou brules. C'est l'acte fondateur du musee de Sens. En 1891, le musee est inaugure dans des locaux agrandis. En 1985, une partie des collections rejoint l'ancien palais archiepiscopal. Aujourd'hui, les musees de Sens abritent l'un des plus riches tresors de cathedrale de France.",
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Palais synodal --- naissance du musee"},
        "sources": ["Ville de Sens, musee.", "Musees de Sens, collections.", "Wikipedia, Musees de Sens."],
        "heritageItemId": "e5555555-0002-0002-0002-000000000002",
    }),
    # Renouvellement urbain
    ("VII", {
        "year": 2020,
        "title": "124 millions pour les Champs-Plaisants : Sens refait ses quartiers",
        "text": "En 2020, Sens signe une convention de renouvellement urbain de 124 millions d'euros pour les quartiers des Arenes et des Champs-Plaisants. 617 logements seront demolies, 309 reconstruits, 505 rehabilites. C'est le plus gros chantier de l'histoire de Sens depuis la construction de la cathedrale. Les grands ensembles des annees 1960, construits a la hate pour loger les familles venues des campagnes et du Maghreb, sont devenus des quartiers en difficulte. Sens reinvestit dans ce que les Trente Glorieuses avaient mal fait.",
        "location": {"lat": 48.2000, "lng": 3.2900, "label": "Champs-Plaisants --- renouvellement urbain"},
        "sources": ["Ville de Sens, renouvellement urbain.", "Convention NPNRU."],
        "heritageItemId": None,
    }),
    # Fouilles quartier juif 1987
    ("VII", {
        "year": 1987,
        "title": "Fouilles rue de la Grande Juiverie : le quartier juif medieval retrouve",
        "text": "En 1987, des fouilles archeologiques rue de la Grande Juiverie (l'actuelle rue Voltaire) mettent au jour des vestiges du quartier juif medieval de Sens. Ce quartier, qui datait des XIIe-XIIIe siecles, avait sa propre boucherie, son moulin, son four, son ecole et son centre de soins. Il etait delimite par la Grande Juiverie, la Petite Juiverie et la rue de la Synagogue. Apres l'expulsion des Juifs en 1306, puis definitivement en 1394, seuls les noms des rues avaient survecu. L'archeologie retrouve les murs.",
        "location": {"lat": 48.1975, "lng": 3.2845, "label": "Rue de la Grande Juiverie --- fouilles 1987"},
        "sources": ["Persee, Archeologie Medievale, 1987, Rue Grande Juiverie."],
        "heritageItemId": "e5555555-0044-0044-0044-000000000044",
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
print(f"+{added} evenements (XXe siecle renforce)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
for ch in data["chapters"]:
    print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")
