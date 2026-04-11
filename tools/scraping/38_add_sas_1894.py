#!/usr/bin/env python3
"""Ajoute les evenements du SAS 1894."""
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

SRC = "Bulletin SAS, vol. XVI, 1894"

new_events = [
    ("I", {
        "year": 20,
        "title": "Les Senonais dressent un monument a Gaius Caesar, petit-fils de Jules",
        "text": (
            "En 1825, des ouvriers qui creusent un abreuvoir au bord de l'Yonne a Sens "
            "tombent sur une enorme pierre gravee. L'inscription revele que les Senonais "
            "de l'Antiquite avaient dresse un monument en l'honneur de Gaius Caesar, "
            "petit-fils adoptif de Jules Cesar. Pendant des decennies, on l'a attribuee "
            "a tort a Tibere. La cite de Sens rendait hommage aux maitres de Rome --- "
            "preuve de l'integration des elites senones dans l'Empire."
        ),
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Yonne --- inscription Gaius Caesar"},
        "sources": [SRC + ", p. 107."],
        "heritageItemId": None,
    }),
    ("IV", {
        "year": 1540,
        "title": "La Maison d'Abraham : l'inscription '1204' est un faux",
        "text": (
            "La celebre 'Maison d'Abraham' cache un mensonge vieux de plusieurs siecles. "
            "L'inscription '1204' peinte a cote de l'Arbre de Jesse est une invention d'un "
            "proprietaire qui voulait vieillir sa maison ! En realite, elle date d'environ "
            "1540 et fut probablement batie par un certain Nicolas Megissier --- un tanneur "
            "dont on retrouve les outils (couteaux a double manche, moule a tannee) sculptes "
            "sur la facade. Son vrai nom : la Maison des Torches, car depuis 1324, le "
            "proprietaire devait fournir chaque annee des torches au couvent des Jacobins."
        ),
        "location": {"lat": 48.1958, "lng": 3.2831, "label": "Maison d'Abraham --- fausse date"},
        "sources": [SRC + ", p. 91-95."],
        "heritageItemId": "e5555555-0003-0003-0003-000000000003",
    }),
    ("IV", {
        "year": 1367,
        "title": "200 ans de moulins reves mais jamais construits",
        "text": (
            "En 1367, Charles V autorise Sens a construire des moulins sur l'Yonne. Mais "
            "la ville n'a jamais les moyens --- guerres, travaux de remparts. En 1374, on "
            "batit une tour avec pont-levis sur le Grand-Pont pour proteger les 'futurs "
            "moulins'. En 1416, faute de mieux, on installe un moulin a cheval en plein "
            "centre-ville, actionne par deux chevaux, qui donne la farine d'une mine de "
            "froment par heure. En 1546, Francois Ier renouvelle la permission. Les moulins "
            "ne furent jamais batis. Deux siecles de permis pour rien."
        ),
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Grand-Pont --- moulins jamais construits"},
        "sources": [SRC + ", p. 100-106."],
        "heritageItemId": None,
    }),
    ("VIa", {
        "year": 1794,
        "title": "La Terreur au chateau de Passy : 17 accuses de Sens a l'echafaud",
        "text": (
            "Le 10 mai 1794, 24 personnes sont jugees en meme temps que Madame Elisabeth, "
            "soeur de Louis XVI. Dix-sept d'entre elles ont ete arretees a Sens ou dans "
            "le district --- au chateau de Passy, a Brienne. Parmi elles, les Megret de "
            "Serilly (tresorier de la guerre), les Lomenie, les Montmorin. Mais une jeune "
            "femme echappe au filet : Pauline de Beaumont, fille de Montmorin, jugee trop "
            "malade pour valoir le deplacement. Les agents l'abandonnent sur la route. Elle "
            "survivra --- et deviendra celebre comme amie de Chateaubriand."
        ),
        "location": {"lat": 48.1600, "lng": 3.2500, "label": "Chateau de Passy --- arrestations 1794"},
        "sources": [SRC + ", p. 135-145."],
        "heritageItemId": None,
    }),
    ("VIb", {
        "year": 1894,
        "title": "L'archeologue Julliot : 'Il ne reste plus qu'a detruire la cathedrale'",
        "text": (
            "En 1894, l'archeologue G. Julliot pousse un cri d'alarme. Sous pretexte "
            "d'elargir les rues, Sens a rase ses remparts romains, abattu ses portes "
            "medievales et demoli presque toutes ses maisons a pans de bois. Avec une "
            "ironie amere, il ecrit qu'il ne reste plus qu'a detruire l'officialite et "
            "la cathedrale --- tout le reste a deja disparu. C'est la naissance de la "
            "conscience patrimoniale a Sens : on detruit depuis un siecle, et enfin "
            "quelqu'un dit 'stop'."
        ),
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- cri d'alarme patrimoine"},
        "sources": [SRC + ", p. 93 (note Julliot)."],
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
print(f"+{added} events (SAS 1894)")
print(f"Total: {total}")
