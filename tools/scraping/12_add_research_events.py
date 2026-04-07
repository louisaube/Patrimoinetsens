#!/usr/bin/env python3
"""Ajoute les evenements issus de la recherche web approfondie."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

EVENTS = [
    # === II. Metropole chretienne ===
    ("II", {
        "year": 600,
        "title": "Sept eveques obeissent a Sens --- dont celui de Paris",
        "text": "L'archeveque de Sens commande a sept dioceses : Chartres, Auxerre, Meaux, Paris, Orleans, Nevers et Troyes. Paris n'est qu'un petit eveche soumis a Sens. L'archeveque porte le titre de 'Primat des Gaules et de Germanie' --- un titre prestigieux mais jamais confirme par Rome (qui prefere Lyon). Cette hierarchie explique pourquoi des evenements majeurs (conciles, sacres, mariages royaux) ont lieu a Sens et non a Paris pendant cinq siecles.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal --- metropole de 7 dioceses"},
        "sources": ["Diocese Sens-Auxerre, histoire du diocese.", "Wikipedia, Archidiocese de Sens-Auxerre."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # === III. Siecle cathedrale ===
    ("III", {
        "year": 1012,
        "title": "Le comte 'Roi des Juifs' : Sens protege sa communaute",
        "text": "Le comte Renaut II de Sens gagne un surnom etonnant : 'le Roi des Juifs'. Pas une insulte --- un hommage a sa protection de la communaute juive. Cette communaute est alors l'une des plus importantes du nord de la France. Elle s'organise autour de la Grande Juiverie et de la Petite Juiverie (actuelle rue Voltaire), avec synagogue, bains rituels, boucherie cachere, ecole et centre de soins. Des rabbins de renom y enseignent le Talmud, dans la lignee intellectuelle de Rachi de Troyes.",
        "location": {"lat": 48.1975, "lng": 3.2845, "label": "Quartier juif --- Grande et Petite Juiverie"},
        "sources": ["Alliance, 'Les Juifs dans l'Yonne.'", "Daguin, G. 'La Communaute Juive de Sens.'", "Chabad, 'Les Tossafistes.'"],
        "heritageItemId": "e5555555-0044-0044-0044-000000000044",
    }),
    ("III", {
        "year": 1141,
        "title": "Le concile de Sens : Alienor d'Aquitaine dans la cathedrale",
        "text": "Les 25-26 mai 1141, tout le pouvoir de France est dans la cathedrale de Sens : le roi Louis VII (21 ans), Alienor d'Aquitaine (19 ans), le comte de Champagne, Bernard de Clairvaux. On vient juger Pierre Abelard, le philosophe le plus brillant --- et le plus arrogant --- de son temps. Mais Bernard a piege le debat : la veille, lors d'un banquet, il a fait condamner les theses d'Abelard par les eveques avant meme que le debat public ne commence. Le 26 mai, Abelard, 62 ans et malade, garde le silence. Il fait appel au pape et se refugie a Cluny, ou il meurt l'annee suivante.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- Concile de 1141"},
        "sources": ["pierre-abelard.com, 'Le Concile de Sens.'", "SAS, conference de Jerome Rival, fevrier 2024.", "Leviste, J. La cathedrale de Sens. 1965."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    ("III", {
        "year": 1208,
        "title": "Une synagogue plus haute que l'eglise",
        "text": "En 1208, la communaute juive de Sens construit une nouvelle synagogue --- plus haute que l'eglise adjacente. Les tensions montent. Trente-quatre ans plus tard, en 1242, 24 charrettes de Talmud seront brulees solennellement en place de Greve a Paris, sur ordre du roi. L'archeveque de Sens Gauthier de Cornut tente de defendre les textes juifs lors de la 'Disputation du Talmud' de 1240 --- un geste rare pour un prelat catholique. Mais en 1306, Philippe le Bel ordonne l'expulsion definitive. Le cimetiere juif de Sens est vendu pour 400 livres. La communaute ne renaitra pas au Moyen Age.",
        "location": {"lat": 48.1975, "lng": 3.2845, "label": "Quartier juif --- synagogue"},
        "sources": ["Alliance, 'Les Juifs dans l'Yonne.'", "Daguin, G. 'La Communaute Juive de Sens.'"],
        "heritageItemId": "e5555555-0044-0044-0044-000000000044",
    }),
    # === IV. Guerres ===
    ("IV", {
        "year": 1549,
        "title": "Le premier train de bois descend l'Yonne vers Paris",
        "text": "En 1547, un premier essai de flottage de bois reussit depuis le Morvan. En 1549, le premier 'train' de bois arrive a Paris par l'Yonne puis la Seine. Le roi accorde sa protection a Jean Rouvet et ordonne des feux de joie le long de la riviere. Sens est une etape obligatoire : les trains de bois --- des radeaux de 72 a 75 metres de long --- passent sous les ponts de la ville. Vauban ecrira plus tard que 'l'Yonne est une des meres nourrices de Paris.' Le flottage durera jusqu'en 1923, nourrissant la capitale de 1,5 million de steres de bois par an a la veille de la Revolution.",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Ponts de Sens --- passage des trains de bois"},
        "sources": ["Hydrauxois, 'L'epopee des flotteurs.'", "Patrimoine du Morvan.", "Persee, 'Greves de flotteurs sur l'Yonne.'"],
        "heritageItemId": None,
    }),
    ("IV", {
        "year": 1552,
        "title": "Premier livre imprime a Sens : une satire sur les jupes",
        "text": "En 1552, l'imprimeur Francois Girault, installe a l'enseigne du 'Boeuf couronne', imprime le premier livre a Sens. Son titre ? La 'Complainte de Monsieur le Cul contre les inventeurs des Vertugales' --- une satire contre le vertugadin, la mode des jupes a cerceaux qui deforme la silhouette feminine. On est loin de la Bible de Gutenberg. Mais l'imprimerie s'installe a Sens : Jean Savine au XVIe siecle, Prussurot et Niverd au XVIIe. En 1933, Rene Chevillon fondera l'imprimerie qui deviendra une cooperative ouvriere pendant 76 ans.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- enseigne du Boeuf couronne"},
        "sources": ["ENSSIB, Histoire de l'imprimerie en France.", "L'Independant de l'Yonne, 'Chevillon, 90 ans d'histoire.'"],
        "heritageItemId": None,
    }),
    # === V. Ville classique ===
    ("V", {
        "year": 1622,
        "title": "1622 : Paris s'emancipe --- Sens perd sa superiorite",
        "text": "Le 20 octobre 1622, le pape Gregoire XV eleve l'eveche de Paris au rang d'archeveche. D'un coup, Sens perd la tutelle sur Paris, Chartres, Orleans et Meaux --- la moitie de sa province ecclesiastique. C'est la fin d'une suprematie de mille ans. La cause est simple : Paris est devenue la capitale du plus puissant royaume d'Europe, et son eveque refuse de rester le subordonne d'un archeveque de province. Pour Sens, c'est le debut d'un long declin. La ville qui commandait a Paris devient peu a peu une sous-prefecture.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal"},
        "sources": ["Diocese de Paris, 'Paris archidiocese depuis 400 ans.'", "Wikipedia, Archidiocese de Sens-Auxerre."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # === VI. Revolution et industrie ===
    ("VI", {
        "year": 1814,
        "title": "Sens bombardee et pillee : la campagne de France",
        "text": "En fevrier 1814, les armees de la coalition envahissent la France. Le general Alix defend Sens pendant douze jours contre le prince de Wurtemberg, dont deux jours de bombardement. Furieux d'avoir perdu tant d'hommes devant une ville sans fortifications, le prince livre Sens au pillage. Quelques jours plus tard, Napoleon remporte sa derniere victoire a Montereau (18 fevrier 1814), au confluent de l'Yonne et de la Seine, et repousse l'ennemi vers Sens. Mais c'est un sursis : le 30 mars, Paris tombe.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- bombardement de 1814"},
        "sources": ["Napoleon-monuments.eu, 'Campagne de France 1814.'", "Wikipedia, 'Bataille de Montereau.'"],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1890,
        "title": "Le phylloxera detruit le vignoble senonais",
        "text": "Depuis l'Antiquite, Sens produit du vin. En 1416, un edit royal classe ses vignes parmi les vignobles de Bourgogne. Le vin de Paron est 'le meilleur des environs de Sens.' Mais dans les annees 1880-1890, le phylloxera --- un puceron microscopique venu des Etats-Unis --- devaste tout. Les 250 hectares de vignes du Senonais disparaissent. Le chemin de fer, arrive en 1849, acheve le travail : il amene les vins bon marche du Midi qui ecrasent la production locale. Il faudra attendre 2017 et Frederic Duponchel (Domaine des Senons a Paron) pour qu'un viticulteur replante de la vigne sur les coteaux senonais.",
        "location": {"lat": 48.1940, "lng": 3.2900, "label": "Coteaux de Paron --- ancien vignoble"},
        "sources": ["La Gazette des Senonais, 'La vigne senonaise, 100 ans plus tard.'", "Domaine des Senons, 'Histoire et philosophie.'", "Poree, C. Cahiers de doleances, 1908 (Paron)."],
        "heritageItemId": None,
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
    for ch_id, event in EVENTS:
        if event["title"].lower().strip() in existing_titles:
            print(f"  SKIP (doublon): {event['title'][:50]}")
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
    print(f"\nAjoute: +{added} evenements (recherche web)")
    print(f"Total: {total} evenements")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
