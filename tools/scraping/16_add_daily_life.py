#!/usr/bin/env python3
"""Vie quotidienne et sociale : rues, navigation, gastronomie, theatre, franc-maconnerie, hotel..."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

EVENTS = [
    # I — Plan romain
    ("I", {
        "year": 200,
        "title": "Le plan de Sens : une amande romaine encore visible",
        "text": "Le plan de Sens conserve encore la forme de 'l'amande' gallo-romaine : un ovale allonge de 850 metres d'est en ouest et 400 metres du nord au sud, herite de l'enceinte du IIIe siecle. Le cardo (nord-sud) et le decumanus (est-ouest) romains sont toujours lisibles dans le trace de la Grande Rue. Les boulevards actuels (Garibaldi, du Mail, du 14-Juillet) suivent les anciens fosses combles a partir de 1758. Quand on marche dans Sens, on marche sur un plan romain.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- forme de l'amande gallo-romaine"},
        "sources": ["SenoN.Org, rues de Sens.", "Wikipedia, Agedincum."],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014",
    }),
    # III — Rues revelatrices
    ("III", {
        "year": 1100,
        "title": "Les noms des rues racontent l'histoire : Juiverie, Blanchisserie, Boucherie",
        "text": "Les noms medievaux des rues de Sens sont une carte de l'economie locale. La rue de la Grande Juiverie et la rue de la Petite Juiverie designent le quartier juif avec sa synagogue, son four et son ecole. La rue de la Blanchisserie, celle des blanchisseurs de draps. La rue de la Boucherie, celle des bouchers. La rue de l'Archeveche deviendra rue de la Liberte a la Revolution. Chaque nom est une couche d'histoire : commerce medieval, pouvoir religieux, ideaux republicains.",
        "location": {"lat": 48.1975, "lng": 3.2845, "label": "Sens --- rues medievales"},
        "sources": ["SenoN.Org, 'Rues de Sens.'", "Daguin, G. 'Origines des rues.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # V — Loge maconnique
    ("V", {
        "year": 1770,
        "title": "La Concorde : premiere loge maconnique de l'Yonne",
        "text": "Dans les annees 1770, la loge 'La Concorde' est fondee a Sens sous l'obedience du Grand Orient de France. C'est la premiere loge du departement. En 1777, c'est elle qui installe la loge de Joigny, qui a son tour fondera celles d'Auxerre (1778), Tonnerre (1779) et Villeneuve-sur-Yonne (1789 --- l'annee de la Revolution, ce n'est pas un hasard). Les freres macons senonais jouent un role dans la reorganisation politique du district pendant la Revolution. La loge est interrompue avant 1789 et reprend en 1808.",
        "location": {"lat": 48.1965, "lng": 3.2835, "label": "Temple maconnique --- Grand Orient"},
        "sources": ["Joigny en images, loge maconnique.", "CGF, jeton 'La Concorde Orient de Sens.'"],
        "heritageItemId": "e5555555-0063-0063-0063-000000000063",
    }),
    # V — Coche d'eau
    ("V", {
        "year": 1799,
        "title": "Le coche d'eau : Sens-Paris par la riviere",
        "text": "En 1799, un service de coche d'eau est etabli entre Paris et Sens via l'Yonne et la Seine. Avant le chemin de fer, c'est le moyen le plus confortable (sinon le plus rapide) de voyager. Les mariniers de l'Yonne sont de veritables entrepreneurs : vingt voyages par an vers Paris, 200 jours en activite. Le metier se transmet de pere en fils. Sur les ports de Sens, les debardeurs sont organises en corporations avec monopole de chargement. L'Yonne transporte 1 800 000 tonnes de marchandises par an.",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Port de Sens --- coche d'eau"},
        "sources": ["Wikipedia, Yonne (riviere).", "Histoires de Paris, approvisionnement fluvial."],
        "heritageItemId": None,
    }),
    # VI — Theatre construit sur un cimetiere (details)
    ("VI", {
        "year": 1793,
        "title": "Un theatre se construit sur un cimetiere",
        "text": "En 1790, Royer, directeur des diligences de Sens, achete le terrain de l'ancien cimetiere de l'Hotel-Dieu (deplace en 1758). Il le revend a Jean-Louis Guyot qui fait construire un premier theatre entre 1793 et 1794 --- avec des pierres du chateau demoli de Noslon. La ville rachete le batiment en 1824. Le theatre actuel, de style italien, est inaugure le 16 juillet 1882. Le jeune Mallarme, professeur au lycee voisin en 1861-1862, y assiste a des spectacles et redige des critiques theatrales pour le journal Le Senonais.",
        "location": {"lat": 48.1968, "lng": 3.2825, "label": "Theatre municipal --- ancien cimetiere"},
        "sources": ["Wikipedia, Theatre municipal de Sens.", "Daguin, G. 'Le theatre, quand le cimetiere accueille les baladins.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0015-0015-0015-000000000015",
    }),
    # VI — Hotel de Paris
    ("VI", {
        "year": 1796,
        "title": "L'Auberge de la Ville de Paris : deux siecles d'hospitalite",
        "text": "En 1796, l'Auberge de la Ville de Paris ouvre ses portes. Relais de poste et de diligences, elle deviendra en 1840 l'Hotel de Paris, puis en 1936 l'Hotel de Paris et de la Poste. La famille Godard le dirige pendant 40 ans. Pendant plus de deux siecles, c'est un point de repere central de la vie senonaise --- jusqu'a sa demolition en 2021, devant une foule d'habitants attristes. Un hotel quatre etoiles (l'Epona Hotel) est construit sur le meme site.",
        "location": {"lat": 48.1975, "lng": 3.2835, "label": "Hotel de Paris et de la Poste (demoli 2021)"},
        "sources": ["Daguin, G. 'Hotel de Paris et de la Poste.' histoire-sens-senonais-yonne.com.", "France Bleu, destruction 2021.", "La Gazette du Patrimoine."],
        "heritageItemId": "e5555555-0059-0059-0059-000000000059",
    }),
    # VI — Usine a gaz
    ("VI", {
        "year": 1860,
        "title": "L'eclairage au gaz arrive a Sens",
        "text": "Vers 1860, Sens se dote d'une usine a gaz --- visible sur les cartes postales anciennes, a cote de la fonderie. Les reverb\u00e8res a gaz remplacent les lanternes a huile qui eclairaient les rues depuis le XVIIIe siecle. C'est un progres considerable : les rues sont plus sures, les commerces restent ouverts plus tard. L'electricite suivra dans les annees 1890-1900. Chaque etape de l'eclairage public raconte la modernisation d'une ville de province.",
        "location": {"lat": 48.1930, "lng": 3.2800, "label": "Usine a gaz de Sens"},
        "sources": ["Cartorum, carte postale usine a gaz Sens.", "Wikipedia, eclairage public en France."],
        "heritageItemId": None,
    }),
    # VI — Gastronomie
    ("VI", {
        "year": 1895,
        "title": "La fromagerie Lincet : Brillat-Savarin et Chaource du Senonais",
        "text": "En 1895, la fromagerie Lincet est fondee. Elle produira Brillat-Savarin, Delice de Bourgogne, Chaource et Epoisses --- des fromages que le monde entier connait sous l'etiquette 'Bourgogne' mais dont une partie vient du Senonais. Le gastronome Curnonsky avait repere a Sens : jambon, andouillettes, matelote, croquettes d'or, buchettes et macarons. Aujourd'hui, la biere artisanale Thomas Becket est la specialite locale --- un clin d'oeil a l'archeveque refugie.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- marche couvert et gastronomie"},
        "sources": ["Keldelice, Le Senonais.", "Bourgogne Tourisme, Sens."],
        "heritageItemId": "e5555555-0004-0004-0004-000000000004",
    }),
    # VII — Demolition Hotel de Paris 2021
    ("VII", {
        "year": 2021,
        "title": "L'Hotel de Paris tombe : Sens perd un repere de 225 ans",
        "text": "Le 1er avril 2021, la demolition de l'Hotel de Paris et de la Poste commence. Debut juillet, la facade tombe devant une foule de curieux et d'habitants attristes. Ouvert en 1796 comme Auberge de la Ville de Paris, relais de diligences puis hotel de voyageurs lie a la gare, il a accueilli des generaux, des commis voyageurs et des familles senonaises pendant 225 ans. L'Epona Hotel quatre etoiles le remplace --- du nom gaulois de la deesse des chevaux.",
        "location": {"lat": 48.1975, "lng": 3.2835, "label": "Ancien Hotel de Paris --- Epona Hotel"},
        "sources": ["France Bleu, 'Destruction Hotel de Paris, 2021.'", "France Bleu, 'Epona Hotel ouverture 2024.'"],
        "heritageItemId": "e5555555-0059-0059-0059-000000000059",
    }),
    # IV — Massacre 1562 details complot
    ("IV", {
        "year": 1562,
        "title": "Le complot du massacre : Hemard, Briard, Cayer et le moine Begneti",
        "text": "Le massacre des Huguenots de 1562 n'est pas une emeute spontanee. C'est un complot organise par le bailli Robert Hemard (evince de la mairie par un vote protestant), trois echevins, le procureur, et deux hommes de main --- Briard et Cayer --- charges de recruter des assassins. Le dimanche 12 avril, un moine dominicain nomme Begneti preche avec violence contre les protestants a l'eglise Saint-Savinien. La foule s'arme et attaque le temple. Le capitaine Mombaut, chef protestant, est tue. Les corps nus sont jetes dans l'Yonne. Pierre de Paschal rapporte avoir vu des cadavres dans la Seine pres de Paris.",
        "location": {"lat": 48.1975, "lng": 3.2830, "label": "Temple protestant --- massacre"},
        "sources": ["Wikipedia, Massacre de Sens.", "Paris Musees, 'Le massacre de Sens, avril 1562.'", "Musee Protestant."],
        "heritageItemId": None,
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
    total_chars = sum(len(ev["text"]) for ch in data["chapters"] for ev in ch["events"])
    print(f"+{added} evenements (vie quotidienne)")
    print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars de recit")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
