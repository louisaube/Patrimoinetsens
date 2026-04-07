#!/usr/bin/env python3
"""Pepites Daguin non exploitees : curiosites cathedrale, portes, Notre-Dame Providence."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

EVENTS = [
    # III — Jean du Cognot 1329
    ("III", {
        "year": 1329,
        "title": "Jean du Cognot : le cocu de la cathedrale",
        "text": "Le 7 decembre 1329, le roi Philippe VI convoque une assemblee de prelats et seigneurs pour trancher un conflit entre pouvoir royal et Eglise. Son conseiller Pierre de Cugnieres formule 70 griefs contre les ecclesiastiques. Face a lui, Pierre Roger, archeveque de Sens (futur pape Clement VI), defend le clerge avec brio. Le roi retourne sa veste : tous les droits de l'Eglise sont maintenus. Humilie, Cugnieres herite du sobriquet de 'Jean du Cognot' --- en langage moins chatie, 'Jean Ducon'. Pour le ridiculiser, on scelle une petite tete de pierre le representant entre deux piliers de la cathedrale. Elle y est toujours.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- tete de Jean du Cognot"},
        "sources": ["Daguin, G. 'Curiosites de la cathedrale (1).' histoire-sens-senonais-yonne.com.", "Bernard Brousse, documentation SAS."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # III — Cloches 1560
    ("IV", {
        "year": 1560,
        "title": "La Savinienne et la Potentienne : deux bourdons de 14 et 12 tonnes",
        "text": "Le 17 octobre 1560, on benit la Savinienne, premiere des deux enormes cloches de la cathedrale. La Potentienne suit le 3 janvier 1561. Elles pesent respectivement 14 et 12 tonnes --- il faut des equipes entieres pour les mettre en branle. Pendant la Revolution, la cathedrale perd onze cloches envoyees a Paris pour etre fondues. Seuls les deux bourdons sont epargnes. Aujourd'hui, la Savinienne et la Potentienne sonnent encore. Daguin rappelle que 'sonneur de cloches etait a l'epoque un metier de soif' --- tant l'effort physique etait epuisant.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- beffroi"},
        "sources": ["Daguin, G. 'Curiosites de la cathedrale (2).' histoire-sens-senonais-yonne.com.", "SAS."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # III — Orgue 1440
    ("IV", {
        "year": 1440,
        "title": "Le premier orgue de la cathedrale",
        "text": "Pour le jour de Paques 1440, Jehan Bourdon inaugure le premier orgue de la cathedrale, installe dans le bas-cote nord. En 1552, on commande un buffet d'orgue au sculpteur Jean Cousin --- le meme qui peindra Eva Prima Pandora. Ce buffet existe toujours, incorpore a l'instrument actuel. L'orgue sera reconstruit, deplace, modifie pendant cinq siecles. Pendant la Revolution, on vend ses etains mais on conserve les soufflets du monastere de Vauluisant. Restaure dans le style du XVIIIe, il est classe monument historique en 1973.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- grand orgue"},
        "sources": ["Daguin, G. 'Curiosites de la cathedrale (2).' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # V — Le mausolee du Dauphin 1777
    ("V", {
        "year": 1777,
        "title": "Le mausolee du Dauphin : trois futurs rois dans la cathedrale",
        "text": "En 1765, le Dauphin de France --- fils de Louis XV --- meurt a Fontainebleau. Son corps est inhume dans la cathedrale de Sens. Sa femme, Marie-Josephe de Saxe, le rejoint en 1767. Ils sont les parents de trois futurs rois : Louis XVI, Louis XVIII et Charles X. Louis XV commande un mausolee au sculpteur Guillaume Coustou, inaugure en 1777. Pendant la Revolution (1794), les corps sont arraches de leurs cercueils, deshabilles et traines dans les rues de Sens avant d'etre jetes dans une fosse commune. A la Restauration, leurs restes sont replaces dans la cathedrale.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- mausolee du Dauphin (chapelle Ste-Colombe)"},
        "sources": ["Daguin, G. 'Curiosites de la cathedrale (1).' histoire-sens-senonais-yonne.com.", "Leviste, J. La cathedrale de Sens. 1965."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # IV — Portes de la ville
    ("IV", {
        "year": 1436,
        "title": "Les portes de Sens : entrer dans la ville au Moyen Age",
        "text": "Sens a cinq portes principales, chacune gardee et fortifiee. La porte Notre-Dame est la plus imposante : deux ponts-levis, un corps de garde, deux grosses tours, une grille de bois ferree 'dont l'aspect donne l'effroy.' C'est par cette porte que les archeveques font leur entree solennelle. En 1436, les incursions anglaises obligent a la murer. Charles VII ordonne de la demurer lors de son sejour en aout 1437. La porte Saint-Antoine est 'gardee par les chanoines en temps de guerre.' La porte Formau ne s'ouvre sur aucune route. Ces portes seront demolies entre 1831 et 1882 --- avec elles disparait la ville close medievale.",
        "location": {"lat": 48.1965, "lng": 3.2860, "label": "Enceinte --- portes de la ville"},
        "sources": ["Daguin, G. 'Des portes qui laissaient entrer le voyageur.' histoire-sens-senonais-yonne.com.", "Jacques Rousseau, description des portes (XVIIe s.)."],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014",
    }),
    # II — Notre-Dame de la Providence / Mathilde de Carinthie
    ("III", {
        "year": 1151,
        "title": "Mathilde de Carinthie fonde l'abbaye de la Pommeraie",
        "text": "En 1151, Mathilde de Carinthie, veuve du comte Thibaud IV de Champagne, fonde l'abbaye benedictine de la Pommeraie dans la vallee de l'Oreuse --- avec l'accord de la celebre Heloise (oui, l'Heloise d'Abelard). Mathilde est la mere de Guillaume aux Blanches Mains, futur archeveque de Sens, et la grand-mere d'Adele de Champagne qui epousera Louis VII. De cette fondation naitra, a la fin du XIIe siecle, un prieure a Sens meme, au faubourg Saint-Antoine --- l'ancetre de Notre-Dame de la Providence.",
        "location": {"lat": 48.1990, "lng": 3.2870, "label": "Notre-Dame de la Providence --- faubourg St-Antoine"},
        "sources": ["Daguin, G. 'Notre Dame de La Providence.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # VI — Victor Guichard
    ("VI", {
        "year": 1870,
        "title": "Victor Guichard : maire, depute, mais avant tout paysan",
        "text": "Victor Guichard est l'un des personnages les plus marquants du Sens republicain. Maire de Sens, depute de l'Yonne, il incarne la IIIe Republique enracinee --- un notable rural, un homme de la terre qui entre en politique. Son histoire raconte comment une petite ville de province vit la transition entre l'Empire et la Republique, entre le monde rural et la modernite industrielle.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Hotel de ville --- mairie Guichard"},
        "sources": ["Daguin, G. 'Victor Guichard, maire, depute mais avant tout paysan.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0012-0012-0012-000000000012",
    }),
]


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing = set()
    for ch in data["chapters"]:
        for ev in ch["events"]:
            existing.add(ev["title"].lower().strip())

    added = 0
    for ch_id, event in EVENTS:
        if event["title"].lower().strip() in existing:
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
    print(f"+{added} evenements (pepites Daguin)")
    print(f"Total: {total}")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
