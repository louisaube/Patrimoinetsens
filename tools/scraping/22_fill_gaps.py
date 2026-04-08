#!/usr/bin/env python3
"""Comble les trous des chapitres II (476-1000) et VII (apres 1945)."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

EVENTS = [
    # ── CHAPITRE II : combler le trou 476-1000 ────────────────────────
    ("II", {
        "year": 486,
        "title": "Sens passe sous domination franque",
        "text": "En 486, Clovis bat le dernier gouverneur romain Syagrius. Sens, comme toute la Gaule du nord, passe sous le controle des Francs. La ville garde ses remparts gallo-romains, sa cathedrale, son archeveque. Le pouvoir change de mains, mais la structure de la ville survit. Apres la mort de Clovis (511), l'empire franc est partage entre ses fils : Sens se retrouve dans le royaume de Bourgogne.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- passage aux Francs"},
        "sources": ["Bourgogne medievale, fiche Sens."],
        "heritageItemId": None,
    }),
    ("II", {
        "year": 692,
        "title": "Saint Wulfran : l'archeveque de Sens part evangeliser les Vikings",
        "text": "Vers 692, Wulfran, archeveque de Sens et fils d'un officier de Clovis II, abandonne son siege pour aller evangeliser les Frisons (actuels Pays-Bas). Il convertit le fils du roi Radbod et met fin a des pratiques de sacrifice humain. Puis il se retire a l'abbaye de Fontenelle en Normandie. C'est l'un des rares archeveques de Sens a quitter sa ville pour une aventure missionnaire --- et il y est devenu saint.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal"},
        "sources": ["Nominis, Saint Wulfran.", "Bourgogne medievale, fiche Sens."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    ("II", {
        "year": 696,
        "title": "Sens prend le titre d'archeveche : le premier 'archeveque'",
        "text": "Vers 696, l'eveque Gery de Sens est le premier a porter le titre d'archeveque (archiepiscopus) plutot que simplement eveque. Ce n'est pas qu'un mot : cela officialise la suprematie de Sens sur les sept dioceses de sa province, dont Paris. Le titre d'archeveque de Sens survivra 1 300 ans --- jusqu'en 2002.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Cathedrale --- siege de l'archeveche"},
        "sources": ["Wikipedia, Liste des eveques et archeveques de Sens."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    ("II", {
        "year": 848,
        "title": "L'archeveque de Sens sacre un roi : Charles le Chauve",
        "text": "Le 6 juin 848, l'archeveque Wenilon de Sens sacre Charles le Chauve roi de Francie occidentale dans la cathedrale d'Orleans. C'est le premier sacre royal du royaume franc de l'ouest. Wenilon, ancien chapelain personnel du roi, est l'homme le plus puissant de l'Eglise de France. Sens est au sommet de son influence politique.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Archevech de Sens --- Wenilon"},
        "sources": ["Wikipedia, Wenilon (archeveque de Sens).", "Brousse, B. 2024."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    ("II", {
        "year": 858,
        "title": "La trahison de Wenilon : le vrai 'Ganelon' de la Chanson de Roland",
        "text": "En 858, pendant une invasion normande, l'archeveque Wenilon trahit Charles le Chauve et se rallie a son frere ennemi, Louis le Germanique. Il celebre meme des messes publiques pour le traitre. Charles le Chauve le fait juger au concile de Savonnieres en 859. Wenilon se reconcilie in extremis et garde son siege. Mais deux siecles plus tard, sa trahison inspire le personnage de Ganelon dans la Chanson de Roland --- le traitre le plus celebre de la litterature francaise medievale.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Archevech --- trahison de Wenilon"},
        "sources": ["Wikipedia, Wenilon (archeveque de Sens).", "Chanson de Roland (~1090)."],
        "heritageItemId": None,
    }),
    ("II", {
        "year": 876,
        "title": "L'archeveque de Sens nomme Primat des Gaules ET de Germanie",
        "text": "Le 21 juin 876, au concile de Ponthion, le pape Jean VIII nomme Ansegise, archeveque de Sens, vicaire apostolique et primat des Gaules et de Germanie. C'est le sommet absolu du pouvoir de Sens : l'archeveque a theoriquement autorite sur TOUTES les eglises de France et d'Allemagne. L'archeveque de Reims, Hincmar, proteste violemment. En pratique, Ansegise n'exercera jamais ce pouvoir --- mais le titre reste attache a Sens pendant des siecles.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Archevech --- sommet du pouvoir"},
        "sources": ["Wikipedia, Ansegise de Sens.", "Wikipedia, Primat des Gaules."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    ("II", {
        "year": 886,
        "title": "Les Vikings assiegent Sens : la ville resiste",
        "text": "Le 30 novembre 886, apres avoir assiege Paris pendant un an, une grande armee viking remonte l'Yonne et attaque Sens. La ville resiste --- comme Paris, ses remparts gallo-romains tiennent bon. Les Normands ne peuvent pas prendre la cite. Mais ils ravagent la campagne senonaise pendant tout l'hiver. L'empereur Charles le Gros leur a verse 700 livres d'argent et les a autorises a piller la Bourgogne. Sens survit, le Senonais brule.",
        "location": {"lat": 48.1965, "lng": 3.2860, "label": "Remparts de Sens --- siege viking"},
        "sources": ["Wikipedia, Siege de Paris (885-887).", "Wikipedia, Raids vikings en France."],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014",
    }),
    ("II", {
        "year": 895,
        "title": "Sens passe sous le duche de Bourgogne",
        "text": "Vers 895, le duc Richard le Justicier s'empare du comte de Sens et l'integre au duche de Bourgogne. Sens perd son autonomie politique. Desormais, la ville depend d'un duc --- meme si son archeveque reste l'un des plus puissants prelats de France. Ce rattachement a la Bourgogne durera des siecles et explique pourquoi le vin de Sens sera classe parmi les vignobles de Bourgogne.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- rattachement a la Bourgogne"},
        "sources": ["Bourgogne medievale, fiche Sens."],
        "heritageItemId": None,
    }),

    # ── CHAPITRE VII : combler le trou apres 1945 ─────────────────────
    ("VII", {
        "year": 1944,
        "title": "Liberation de Sens par les Americains de Patton",
        "text": "Le 21 aout 1944 a 14h30, les premiers elements du 6e regiment de cavalerie americain entrent dans Sens, precedes par les resistants du groupe Kleber. La ville est pleinement liberee le 23 aout par les soldats de la IIIe armee du general Patton. Quatre ans d'occupation, de restrictions et de peur prennent fin.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- Liberation, 21 aout 1944"},
        "sources": ["Maitron, Sens 21 aout 1944.", "Daguin, G. 'La Liberation de Sens.'"],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 1960,
        "title": "Les Trente Glorieuses : Sens se modernise",
        "text": "Dans les annees 1960, Sens vit la meme transformation que toutes les villes francaises. On construit les grands ensembles des Champs-Plaisants et des Arenes --- des barres d'immeubles pour loger les familles venues des campagnes et d'Algerie. On perce de nouvelles routes. On modernise l'hopital. Les vieilles maisons du centre sont parfois demolies au nom du progres. C'est l'epoque ou la France se reconstruit a grande vitesse --- parfois au prix de son patrimoine.",
        "location": {"lat": 48.2000, "lng": 3.2900, "label": "Quartier des Champs-Plaisants"},
        "sources": ["Ville de Sens, grands projets."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 1994,
        "title": "L'autoroute A5 : Sens a une heure de Paris",
        "text": "Le 24 novembre 1994, l'autoroute A5 relie Sens a Troyes. L'annee precedente, un echangeur connectait deja Sens a l'A5. En 2009, l'A19 completera la liaison vers Orleans. Sens est desormais a une heure de Paris en voiture. Mais l'autoroute a un effet pervers : les voyageurs passent a cote de Sens sans s'arreter. Le train de 1849 amenait les gens EN ville ; l'autoroute les fait PASSER a cote.",
        "location": {"lat": 48.1920, "lng": 3.2780, "label": "Echangeur A5 --- Sens"},
        "sources": ["Wikipedia, Autoroute A5 (France).", "Wikipedia, Autoroute A19 (France)."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 2024,
        "title": "Transformation des Promenades : 8 millions pour reinventer le centre",
        "text": "En 2024, Sens lance la plus grande renovation de ses promenades depuis 1936 : 8 millions d'euros pour transformer 2,5 km de boulevards, des quais de l'Yonne a la place Jean-Jaures. Pietonisation, pistes cyclables, parvis du theatre. C'est le signe d'une ville qui parie sur son patrimoine et sa qualite de vie plutot que sur l'industrie. Le Sens du XXIe siecle se reconstruit autour de ce que le Sens du XIXe a construit.",
        "location": {"lat": 48.1968, "lng": 3.2825, "label": "Promenades de Sens --- renovation 2024"},
        "sources": ["Ville de Sens, 'Transformation des promenades.'"],
        "heritageItemId": None,
    }),
]


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing = set()
    for ch in data["chapters"]:
        for ev in ch["events"]:
            existing.add(ev["title"].lower().strip()[:50])

    added = 0
    for ch_id, event in EVENTS:
        if event["title"].lower().strip()[:50] in existing:
            continue
        for ch in data["chapters"]:
            if ch["id"] == ch_id:
                ch["events"].append(event)
                ch["events"].sort(key=lambda e: e["year"])
                added += 1
                break

    with open(CHAPITRES_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    total = sum(len(ch["events"]) for ch in data["chapters"])
    print(f"+{added} evenements (trous combles)")
    print(f"Total: {total}")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
