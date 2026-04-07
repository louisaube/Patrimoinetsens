#!/usr/bin/env python3
"""Ajoute les evenements profonds : gallo-romain, Hotel-Dieu, Charles IX, remparts, presse, etc."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

EVENTS = [
    # I. Antiquite
    ("I", {
        "year": 50,
        "title": "Six voies romaines convergent vers Agedincum",
        "text": "Apres la conquete, Agedincum (Sens) devient un noeud routier majeur de la Gaule romaine. Six voies se croisent ici : vers Lutece (Paris), Autessiodurum (Auxerre), Augustobona (Troyes), Cenabum (Orleans), Avaricum (Bourges) et vers le sud. La ville se couvre de monuments : forum, thermes, amphitheatre (dont les traces ont ete retrouvees dans le sous-sol). Les rues actuelles de Sens suivent encore le trace du cardo (nord-sud) et du decumanus (est-ouest) romains.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Agedincum --- carrefour de 6 voies romaines"},
        "sources": ["Daguin, G. 'Sens ville gallo-romaine.' histoire-sens-senonais-yonne.com.", "Bulletin SAS, 1867."],
        "heritageItemId": "e5555555-0050-0050-0050-000000000050",
    }),
    # II. Metropole
    ("II", {
        "year": 550,
        "title": "L'ecole cathedrale de Sens : un foyer de savoir",
        "text": "Des le VIe siecle, l'ecole cathedrale de Sens forme les futurs clercs et administrateurs. C'est l'une des plus anciennes ecoles de France, anterieure aux universites. On y enseigne le latin, la theologie, la musique liturgique et les arts liberaux. Au XIIe siecle, quand Abelard et Bernard de Clairvaux debattront a Sens, c'est parce que la ville est deja un centre intellectuel reconnu.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Ecole cathedrale --- Cloitre de la cathedrale"},
        "sources": ["Brousse, Bernard. 'Sens, une cite d'art et d'histoire.' 2024.", "Bulletin SAS, passim."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # III. Hotel-Dieu
    ("III", {
        "year": 1150,
        "title": "L'Hotel-Dieu : soigner les pauvres a l'ombre de la cathedrale",
        "text": "L'Hotel-Dieu de Sens est fonde au XIIe siecle, a l'ombre de la cathedrale, sous l'autorite de l'archeveque. Il heberge les pelerins, soigne les malades, recueille les enfants abandonnes. En termes modernes, c'est a la fois un hopital, un refuge et un orphelinat. Il fonctionne pendant sept siecles sur le meme emplacement --- jusqu'a ce qu'il soit demoli au XIXe siecle pour construire le marche couvert (1882). Sa facade sera preservee et redressee a cote de l'eglise Saint-Maurice.",
        "location": {"lat": 48.1979, "lng": 3.2819, "label": "Ancien Hotel-Dieu --- emplacement du marche couvert"},
        "sources": ["Daguin, G. 'Le Marche couvert : avant etait l'Hotel-Dieu.' histoire-sens-senonais-yonne.com.", "Merimee, PA00113881."],
        "heritageItemId": "e5555555-0047-0047-0047-000000000047",
    }),
    # IV. Peste
    ("IV", {
        "year": 1348,
        "title": "La peste noire frappe Sens",
        "text": "En 1348, la peste noire atteint la France. Sens n'est pas epargnee --- la ville perd probablement un tiers de sa population, comme la plupart des villes francaises. Les malades sont isoles a la maladrerie du Popelin, hors les murs, au sud-est. (C'est le meme lieu ou se tient la foire de mai --- en temps de peste, la foire s'arrete.) Les epidemies reviendront regulierement aux XIVe et XVe siecles, freinant la reconstruction apres la Guerre de Cent Ans.",
        "location": {"lat": 48.1900, "lng": 3.2900, "label": "Maladrerie du Popelin --- hors les murs"},
        "sources": ["Bulletin SAS, passim.", "Brousse, B. 2024."],
        "heritageItemId": None,
    }),
    # IV. Charles IX
    ("IV", {
        "year": 1563,
        "title": "Charles IX et Catherine de Medicis en visite a Sens",
        "text": "Le 15 mars 1563, le roi Charles IX --- 13 ans --- entre dans Sens avec sa mere Catherine de Medicis, le cardinal de Bourbon, le prince de Conde, le duc de Montpensier, le cardinal de Guise, le duc d'Aumale et le connetable de Montmorency. C'est le 'grand tour de France' organise par Catherine pour pacifier le royaume apres les guerres de Religion. La ville est en effervescence : on a prepare des arcs de triomphe, des discours, des fetes. A peine un an plus tot, on massacrait les Huguenots dans ces memes rues.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- entree royale"},
        "sources": ["Daguin, G. 'Le 15 mars 1563, Charles IX et Catherine de Medicis entrent en ville.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # V. Palais synodal
    ("V", {
        "year": 1700,
        "title": "Le palais synodal : salle de justice medievale devenue musee",
        "text": "Le palais synodal, construit au XIIIe siecle a cote de la cathedrale, servait de tribunal ecclesiastique et de salle d'assemblee pour les synodes diocesains. Au XIXe siecle, Viollet-le-Duc le restaure --- c'est l'un de ses chantiers les plus ambitieux. Il refait les pignons, les fenetres, la toiture polychrome en tuiles vernissees de Bourgogne. Aujourd'hui, le palais abrite une partie des musees de Sens et reste l'un des rares exemples de salle civile du XIIIe siecle en France.",
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Palais synodal"},
        "sources": ["Merimee, PA00113883.", "Leviste, J. La cathedrale de Sens. 1965.", "Brousse, B. 2024."],
        "heritageItemId": "e5555555-0002-0002-0002-000000000002",
    }),
    # VI. Tresor cathedrale
    ("VI", {
        "year": 1800,
        "title": "Le tresor de la cathedrale : mille ans d'objets sacres",
        "text": "Le tresor de la cathedrale de Sens est l'un des plus riches de France. Il conserve la chape de Thomas Becket (XIIe siecle), des tapisseries, des ornements liturgiques, un coffret d'ivoire d'origine islamique (probablement un cadeau diplomatique du monde arabo-musulman), la mitre et les sandales de l'archeveque, et des reliquaires. Miracle : le tresor a survecu a la Revolution --- les Senonais l'ont cache. L'abbe Leviste, tresorier de la cathedrale au XXe siecle, en sera le gardien et l'historien.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- salle du Tresor"},
        "sources": ["Leviste, J. La cathedrale de Sens. 1965.", "Musees de Sens, catalogue du tresor.", "Brousse, B. 2024."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # VI. Presse
    ("VI", {
        "year": 1845,
        "title": "Le Senonais : premier journal local",
        "text": "En 1845, Le Senonais commence a paraitre --- c'est le premier journal regulier de la ville. D'abord hebdomadaire, il devient bi-hebdomadaire en 1847. En 1871, il prend le nom de L'Union de l'Yonne. D'autres suivront : La Constitution, L'Avenir de l'Yonne (1881, republicain), Le Travailleur socialiste de l'Yonne (1900). Sens a desormais une presse locale pluraliste. En 1937, l'imprimerie Chevillon lancera Le Senonais Libere, qui deviendra L'Independant de l'Yonne --- le journal que les Senonais lisent encore aujourd'hui.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- siege des journaux"},
        "sources": ["BnF, Presse Locale Ancienne, departement de l'Yonne.", "L'Independant de l'Yonne, 'Chevillon, 90 ans d'histoire.'"],
        "heritageItemId": "e5555555-0060-0060-0060-000000000060",
    }),
    # IV. Guerre de Cent Ans
    ("IV", {
        "year": 1420,
        "title": "Sens sous occupation bourguignonne",
        "text": "Pendant la Guerre de Cent Ans, Sens bascule du cote bourguignon --- allie des Anglais. La ville est occupee, epuisee par les combats, les impots de guerre et les epidemies. Les campagnes alentour sont ravagees par les bandes de routiers. En 1429, quand Jeanne d'Arc et Charles VII passent par Sens apres le sacre de Reims, la ville ouvre ses portes sans combattre et se rallie au roi de France. Un retournement pragmatique plus que patriotique.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- occupation bourguignonne"},
        "sources": ["Daguin, G. histoire-sens-senonais-yonne.com.", "Brousse, B. 2024."],
        "heritageItemId": None,
    }),
    # I. Brennus complement
    ("I", {
        "year": 100,
        "title": "Agedincum, troisieme ville de la IVe Lyonnaise",
        "text": "Sous l'Empire romain, Agedincum est la capitale de la Civitas Senonum et l'une des principales villes de la province de la IVe Lyonnaise. La ville s'etend bien au-dela des futurs remparts du IIIe siecle. Les thermes publics, un amphitheatre (dont les vestiges sont dans le sous-sol du quartier est), un forum et des temples font d'Agedincum une vraie ville romaine. La population est estimee a 5 000-10 000 habitants --- considerable pour l'epoque. Ce decoupage en 'IVe Lyonnaise' determinera les limites de la future province ecclesiastique de Sens.",
        "location": {"lat": 48.1977, "lng": 3.2860, "label": "Agedincum --- amphitheatre (vestiges souterrains)"},
        "sources": ["Daguin, G. 'Sens ville gallo-romaine.' histoire-sens-senonais-yonne.com.", "Bulletin SAS, 1867.", "Bourgogne medievale, fiche Sens."],
        "heritageItemId": "e5555555-0050-0050-0050-000000000050",
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
    print(f"+{added} evenements")
    print(f"Total: {total}")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
