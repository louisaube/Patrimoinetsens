#!/usr/bin/env python3
"""Cree le chapitre 0 - Prehistoire + corrige CAMPONT."""
import json, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

path = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. Corriger CAMPONT partout dans les textes existants
# Remplacer les mentions de STAMPIS par CAMPONT et corriger la liste des suffragants
for ch in data["chapters"]:
    ch_summary = ch.get("summary", "")
    ch_essay = ch.get("essay", "")
    for ev in ch["events"]:
        # Rien a corriger dans les events actuels, STAMPIS n'y figure pas
        # Mais verifions les mentions de la province avec la bonne liste
        pass

# 2. Creer le chapitre 0 - Prehistoire
prehistoire = {
    "id": "0",
    "title": "Avant Sens : la prehistoire du Senonais",
    "period": "-200 000 --- -390",
    "periodLabel": "Prehistoire",
    "summary": (
        "Bien avant les Senons, bien avant les Romains, des hommes vivaient ici. "
        "Des Neandertaliens taillaient le silex sur les plateaux il y a 200 000 ans. "
        "Les premiers agriculteurs sont arrives vers -4000, creusant des mines de silex "
        "a Serbonnes. Puis les dolmens, les bijoutiers de l'Age du Bronze, et enfin "
        "les Senons --- un peuple gaulois qui se nommait 'les Anciens' et qui donnera "
        "son nom a la ville. Leur chef Brennus marchera sur Rome en -390. "
        "L'histoire de Sens commence 200 000 ans avant Sens."
    ),
    "color": "#78350F",
    "events": [
        {
            "year": -200000,
            "title": "Neandertaliens sur le plateau senonais",
            "text": (
                "Il y a 200 000 ans, des Neandertaliens vivent sur les plateaux crayeux "
                "du Senonais, riches en silex et en points d'eau. Le site de Vinneuf / "
                "Les Hauts Massous, decouvert en 1989 lors de la construction de l'autoroute "
                "A5, a revele quatre niveaux d'occupation entre -200 000 et -40 000 ans dans "
                "une doline de 80 metres de diametre. Ces hommes taillaient le silex en bifaces "
                "et racloirs. Cinq sites du Paleolithique moyen ont ete fouilles le long du "
                "trace de l'A5 entre Montereau et Troyes. L'autoroute qui relie aujourd'hui "
                "Sens a Paris passe exactement au-dessus des campements neandertaliens."
            ),
            "location": {"lat": 48.2800, "lng": 3.1500, "label": "Vinneuf --- site neandertalien"},
            "sources": [
                "Deloze et al., Le Paleolithique moyen dans le nord du Senonais, ed. MSH, 1994.",
                "Hure, A. Le Senonais prehistorique, 1922.",
            ],
            "heritageItemId": None,
        },
        {
            "year": -4000,
            "title": "Les premiers agriculteurs arrivent dans l'Yonne",
            "text": (
                "Vers -4000, la revolution neolithique atteint le Senonais. Des populations "
                "de la culture rubanee, venues de l'est de l'Europe le long du Danube, "
                "construisent les premieres grandes maisons de bois en villages organises. "
                "Ils defrichent la foret avec des haches en silex poli pour planter du ble "
                "et de l'orge. C'est le debut de l'agriculture dans la region --- le passage "
                "du chasseur-cueilleur au paysan. Un basculement qui mettra 6 000 ans a produire "
                "les cahiers de doleances de 1789."
            ),
            "location": {"lat": 48.1977, "lng": 3.2837, "label": "Vallee de l'Yonne --- premiers agriculteurs"},
            "sources": ["Archeologia, 'Temps des premiers agriculteurs.'", "Hure, A. Le Senonais prehistorique."],
            "heritageItemId": None,
        },
        {
            "year": -3500,
            "title": "Mines de silex de Serbonnes : une industrie avant l'industrie",
            "text": (
                "A Serbonnes, au sud de Sens, les hommes du Neolithique creusent des mines de "
                "silex a grande echelle : plus de 400 puits d'extraction sur au moins 2 hectares. "
                "Les mineurs descendent a travers les depots de pente pour atteindre les bancs de "
                "silex dans la craie, utilisant des pics en bois de cerf. Le silex extrait est "
                "taille en haches polies pour defricher les forets. C'est la premiere 'industrie' "
                "du Senonais --- 5 500 ans avant les tanneries."
            ),
            "location": {"lat": 48.1400, "lng": 3.2200, "label": "Serbonnes --- mines de silex neolithiques"},
            "sources": ["OpenEdition, Serbonnes - Le Revers de Brassard.", "Archeologia, decouvertes A5."],
            "heritageItemId": None,
        },
        {
            "year": -3500,
            "title": "Les dolmens de la foret de Lancy : les morts sous la pierre",
            "text": (
                "Dans la foret de Vauluisant, le dolmen de Lancy est le monument megalithique "
                "le mieux conserve du Senonais : une dalle de 2,70 m couvre une chambre funeraire. "
                "Classe Monument Historique en 1887, restaure en 1931 par la Societe Archeologique "
                "de Sens. D'autres dolmens parsement le Senonais --- a Trainel, a Bray, a "
                "Egriselles-le-Bocage. Le menhir de Diant, signale des 1846 par la SAS, mesure "
                "4 metres hors du sol. Les habitants y voyaient une Vierge a l'Enfant --- "
                "reinterpretation chretienne d'un monument 5 000 ans plus ancien."
            ),
            "location": {"lat": 48.1000, "lng": 3.4000, "label": "Foret de Vauluisant --- dolmen de Lancy"},
            "sources": [
                "France Bleu, 'Le dolmen de Lancy, un lieu mystique.'",
                "Bulletin SAS, vol. I, 1846, p. 15-22 (dolmens Trancault, menhir Diant).",
            ],
            "heritageItemId": None,
        },
        {
            "year": -1100,
            "title": "Le tresor du bijoutier de Villethierry : 869 bijoux en bronze",
            "text": (
                "En 1969, a Villethierry (10 km de Sens), on decouvre un depot exceptionnel : "
                "869 objets en bronze --- epingles, fibules, bracelets, anneaux, une pince. "
                "Ce n'est pas un tresor cache par un riche : c'est le stock d'un artisan "
                "bijoutier. Des parures finies, pretes a etre vendues, jamais portees. "
                "L'etude des decors revele que cet artisan du Bronze final (vers -1100) "
                "utilisait deja le tour --- une technique qu'on croyait plus tardive. "
                "Le tresor est visible au musee de Sens."
            ),
            "location": {"lat": 48.2300, "lng": 3.2000, "label": "Villethierry --- tresor du bijoutier"},
            "sources": [
                "Mordant, Prampart, Le Depot de bronze de Villethierry, IXe supp. Gallia Prehistoire, CNRS, 1976.",
                "Musees de Sens, collections.",
            ],
            "heritageItemId": None,
        },
        {
            "year": -475,
            "title": "Les Senons emergent : un peuple qui se nomme 'les Anciens'",
            "text": (
                "A l'Age du Fer, les Senons (Senones en latin) emergent comme peuple gaulois "
                "distinct. Leur nom vient du gaulois 'senos' = ancien. Se nommer 'les Anciens', "
                "c'est affirmer qu'on etait la avant les autres. Leur territoire couvre l'Yonne, "
                "la moitie sud de la Seine-et-Marne, et deborde sur le Loiret, l'Aube et la Marne. "
                "Agedincum (Sens) est leur capitale. Voisins : les Parisii au nord, les Carnutes "
                "a l'ouest, les Eduens au sud, les Lingons a l'est. C'est le peuple qui donnera "
                "son nom a la ville --- et a Senigallia en Italie."
            ),
            "location": {"lat": 48.1977, "lng": 3.2837, "label": "Agedincum --- capitale des Senons"},
            "sources": ["Wikipedia, Senons.", "Arbre Celtique, encyclopedie."],
            "heritageItemId": None,
        },
        {
            "year": -400,
            "title": "Des Senons traversent les Alpes et fondent Senigallia",
            "text": (
                "Vers -400, une branche des Senons traverse les Alpes, chasse les Ombriens, "
                "et s'installe sur la cote adriatique de l'Italie, entre Rimini et Ancone. "
                "Ils fondent Sena Gallica --- aujourd'hui Senigallia. Les Senons sont donc "
                "un peuple a deux tetes : une moitie reste a Sens, l'autre colonise l'Italie. "
                "Les necropoles italiennes (Filottrano, Piobbico) revelent des tombes de guerriers "
                "avec casques celtiques et vaisselle greco-etrusque. Dix ans plus tard, ce sont "
                "ces Senons d'Italie que Brennus menera sur Rome."
            ),
            "location": {"lat": 43.7167, "lng": 13.2167, "label": "Sena Gallica (Senigallia) --- colonie senone"},
            "sources": ["Wikipedia, Senons.", "Larousse, Senons."],
            "heritageItemId": None,
        },
        {
            "year": -100,
            "title": "242 stateres d'or : le tresor gaulois de Saint-Denis-les-Sens",
            "text": (
                "En 1992, lors des fouilles pour l'autoroute A5, on decouvre a Saint-Denis-les-Sens "
                "(3 km de Sens) un tresor de 242 stateres d'or gaulois, tous identiques, pesant "
                "environ 7,5 grammes chacun. Ils etaient caches au fond d'un trou de poteau --- "
                "dans les fondations d'une maison. C'est le monnayage propre des Senons. Ce tresor "
                "temoigne de la richesse de l'aristocratie gauloise locale. Une partie a ete "
                "derobee lors d'un vol au musee de Sens --- les Senons continuent de faire parler d'eux."
            ),
            "location": {"lat": 48.2100, "lng": 3.2800, "label": "Saint-Denis-les-Sens --- tresor gaulois"},
            "sources": [
                "Patrimoine Urbain, tresor de Saint-Denis-les-Sens.",
                "France Info, vol au musee de Sens.",
            ],
            "heritageItemId": None,
        },
    ],
}

# Inserer le chapitre 0 au debut
data["chapters"].insert(0, prehistoire)

# 3. Corriger CAMPONT dans le texte de l'archevech
# Ajouter un event explicatif CAMPONT
for ch in data["chapters"]:
    if ch["id"] == "II":
        # Chercher l'event sur les 7 dioceses
        for ev in ch["events"]:
            if "sept eveques" in ev["title"].lower() or "sept dioceses" in ev["title"].lower():
                ev["text"] = ev["text"].replace(
                    "sept dioceses",
                    "sept dioceses --- on les retient par l'acronyme CAMPONT : Chartres, Auxerre, Meaux, Paris, Orleans, Nevers, Troyes"
                )

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

total = sum(len(ch["events"]) for ch in data["chapters"])
ch0 = data["chapters"][0]
print(f"Chapitre 0 cree: {len(ch0['events'])} events")
print(f"Total: {total} events, {len(data['chapters'])} chapitres")
for ch in data["chapters"]:
    print(f"  {ch['id']:4} {ch['title'][:40]:40} : {len(ch['events'])} events")
