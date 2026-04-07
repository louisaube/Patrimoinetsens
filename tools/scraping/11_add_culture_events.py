#!/usr/bin/env python3
"""Ajoute les événements culturels, religieux et sociaux manquants."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

NEW_EVENTS = [
    # II — Communauté juive
    ("II", {
        "year": 900,
        "title": "La communauté juive de Sens, l'une des plus anciennes de France",
        "text": "Des familles juives s'installent a Sens des le haut Moyen Age. La communaute grandit et devient l'une des plus importantes du nord de la France. Les Juifs senonais sont marchands, preteurs, medecins. Ils vivent pres de la cathedrale, dans un quartier qui porte encore la memoire de leur presence : la rue de la Juiverie (actuelle rue Voltaire) et la place du Tau, ancien cimetiere juif. L'histoire de cette communaute sera une succession d'accueils et d'expulsions — un \"incessant aller-retour\" selon l'expression de Daguin.",
        "location": {"lat": 48.1975, "lng": 3.2845, "label": "Place du Tau --- ancien cimetiere juif"},
        "sources": ["Daguin, G. \"La Communaute Juive de Sens.\" histoire-sens-senonais-yonne.com.", "Bulletin SAS, passim."],
        "heritageItemId": "e5555555-0044-0044-0044-000000000044",
    }),
    # III — Concile de Sens / Abelard
    ("III", {
        "year": 1140,
        "title": "Le concile de Sens : Abelard condamne face a Bernard de Clairvaux",
        "text": "En 1140, le concile de Sens reunit les plus grands esprits du XIIe siecle. Pierre Abelard, le philosophe le plus brillant de son temps (et le plus arrogant), y est juge pour heresie. Face a lui : Bernard de Clairvaux, moine austere et orateur redoutable. Le debat tourne court — Abelard, malade et epuise, refuse de se defendre. Il est condamne. C'est un moment cle de l'histoire intellectuelle de l'Europe : la foi mystique (Bernard) l'emporte sur la raison dialectique (Abelard). Ce concile se tient dans la cathedrale de Sens, a peine achevee — la plus grande eglise de la chretiente a ce moment.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- Concile de 1140"},
        "sources": ["Clanchy, M.T. Abelard: A Medieval Life. Blackwell, 1997.", "Daguin, G. histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # III — Archeveche vs Paris
    ("III", {
        "year": 1220,
        "title": "Quand Paris prend le dessus sur Sens",
        "text": "Pendant des siecles, l'eveque de Paris est un subordonné de l'archeveque de Sens. Paris fait partie de la province ecclesiastique de Sens — avec Chartres, Orleans, Auxerre, Meaux, Troyes et Nevers. Mais au XIIIe siecle, Paris grandit, devient capitale du royaume, et l'eveque de Paris supporte de moins en moins cette tutelle. En 1622, Paris sera finalement erigee en archeveche autonome. Sens perd sa province la plus riche. C'est le debut d'un long declin : la ville qui commandait a Paris devient une sous-prefecture.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal"},
        "sources": ["Brousse, Bernard. \"Sens, une cite d'art et d'histoire.\" 2024."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # IV — Jean Cousin
    ("IV", {
        "year": 1500,
        "title": "Jean Cousin, le peintre de Sens qui rivalise avec les Italiens",
        "text": "Vers 1500, nait a Sens (ou a Soucy, tout pres) Jean Cousin l'Aine, peintre, sculpteur, graveur, geometre. Son tableau \"Eva Prima Pandora\" — une femme nue allongee dans un paysage — est considere comme le premier grand nu de la peinture francaise. Il travaille a Paris pour les vitraux de la cathedrale, mais Sens revendique fierement ce fils. Son fils, Jean Cousin le Jeune, sera aussi peintre. Un square et une rue portent leur nom a Sens — le square Jean Cousin, avec sa statue, est l'un des lieux les plus familiers des Senonais.",
        "location": {"lat": 48.1965, "lng": 3.2830, "label": "Square Jean Cousin"},
        "sources": ["Daguin, G. \"Jean Cousin, au nom du pere, du fils, du square.\" histoire-sens-senonais-yonne.com.", "Musee du Louvre, notice Eva Prima Pandora."],
        "heritageItemId": "e5555555-0017-0017-0017-000000000017",
    }),
    # IV — Jean Langlois, premier martyr protestant
    ("IV", {
        "year": 1547,
        "title": "Jean Langlois, premier martyr protestant de Sens",
        "text": "Le 22 janvier 1547, pres du marche aux balais, Jean Langlois est condamne a mort pour heresie. C'est un protestant dans une ville massivement catholique. Il est brule vif. C'est le premier d'une longue serie : quinze ans plus tard, en 1562, le massacre des Huguenots fera des dizaines de morts. La violence religieuse a Sens est precoce et feroce — le cardinal de Guise, archeveque de Sens, en est l'un des instigateurs.",
        "location": {"lat": 48.1975, "lng": 3.2830, "label": "Pres du marche aux balais"},
        "sources": ["Daguin, G. \"Le Protestant Jean Langlois est condamne a mort, en 1547, a Sens.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # V — Jacques-Louis David a Sens
    ("V", {
        "year": 1780,
        "title": "Jacques-Louis David, le peintre de la Revolution, resident a Sens",
        "text": "Tout le monde connait Jacques-Louis David, le peintre du Sacre de Napoleon. Ce qu'on sait moins, c'est qu'il a sejourne a Sens. Le musee de Sens possede l'une de ses toiles : \"Jupiter et Antiope\". David n'est pas senonais, mais son passage illustre une realite : au XVIIIe siecle, Sens reste un foyer culturel ou les artistes viennent travailler, meme si la ville a perdu son eclat politique.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Musees de Sens --- Palais archiepiscopal"},
        "sources": ["Daguin, G. \"Jacques-Louis David.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # VII — Mallarmé aux Celestins
    ("VI", {
        "year": 1871,
        "title": "Stephane Mallarme, professeur d'anglais a Sens",
        "text": "En 1871, un jeune professeur d'anglais de 29 ans arrive au lycee de Sens — installe dans l'ancien couvent des Celestins. Il s'appelle Stephane Mallarme. Il y enseigne pendant deux ans, ecrit des poemes dans sa chambre, et reve de Paris. Plus tard, il deviendra l'un des plus grands poetes francais, maitre du symbolisme. Le college porte aujourd'hui son nom : college Stephane Mallarme. Les Celestins du XIVe siecle n'auraient jamais imagine que leur couvent accueillerait un poete athee.",
        "location": {"lat": 48.1985, "lng": 3.2870, "label": "College Mallarme --- ancien couvent des Celestins"},
        "sources": ["Daguin, G. \"L'ombre des Celestins rode sur Mallarme.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0024-0024-0024-000000000024",
    }),
    # VI — Theatre
    ("VI", {
        "year": 1842,
        "title": "Le theatre municipal : quand le cimetiere accueille les baladins",
        "text": "Le theatre de Sens est construit sur un ancien cimetiere. L'ironie n'echappe a personne a l'epoque. Daguin le raconte : pendant des siecles, les comediens itinerants jouaient dans des salles de fortune, sous le regard mefiant de l'Eglise qui excommuniait les acteurs. Il faudra attendre le XIXe siecle pour que Sens se dote d'un vrai theatre a l'italienne — signe que la ville s'embourgeoise et veut rivaliser avec les sous-prefectures voisines.",
        "location": {"lat": 48.1968, "lng": 3.2825, "label": "Theatre municipal"},
        "sources": ["Daguin, G. \"Le Theatre: quand le cimetiere accueille les baladins.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0015-0015-0015-000000000015",
    }),
    # VI — Separation Eglise-Etat
    ("VI", {
        "year": 1905,
        "title": "La separation de l'Eglise et de l'Etat : l'onde de choc a Sens",
        "text": "La loi de 1905 separe l'Eglise et l'Etat. A Sens, c'est un tremblement de terre symbolique : pendant 1 500 ans, l'archeveque a ete le personnage le plus puissant de la ville. Le palais archiepiscopal, la cathedrale, les couvents — tout ce patrimoine change de statut. Emile Combes, le president du Conseil anticlerical, est l'homme qui a prepare le terrain. Daguin raconte la saga senonaise : \"Trahison, obscurantisme, vive la laicite !\" Un siecle de conflits entre \"cures et republicains\" se conclut.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal"},
        "sources": ["Daguin, G. \"Trahison, obscurantisme, vive la laicite !\" histoire-sens-senonais-yonne.com.", "Daguin, G. \"Vers la separation de l'Eglise et de l'Etat.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
]


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing_titles = set()
    for ch in data["chapters"]:
        for ev in ch["events"]:
            existing_titles.add(ev["title"].lower().strip())

    added = 0
    for ch_id, event in NEW_EVENTS:
        if event["title"].lower().strip() in existing_titles:
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
    print(f"Ajoute: +{added} evenements culture/societe")
    print(f"Total: {total} evenements")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
