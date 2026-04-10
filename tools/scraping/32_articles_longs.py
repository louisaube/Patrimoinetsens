#!/usr/bin/env python3
"""Articles longs Von Speck + Augusta Hure + contextualisation Merovingiens."""
import json, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

path = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. Von Speck - article immersif
for ch in data["chapters"]:
    for ev in ch["events"]:
        if "von speck" in ev["title"].lower() and ev["year"] == 1940:
            ev["title"] = "15 juin 1940 : un tireur anonyme abat le general Von Speck"
            ev["text"] = (
                "Le 15 juin 1940, le general Hermann Ritter von Speck, commandant du XVIIIe corps "
                "d'armee allemand, arrive a Pont-sur-Yonne pour evaluer la situation devant le pont "
                "detruit. Son convoi se gare pres de l'Hotel des Trois Rois. Malgre les tirs, les "
                "officiers descendent et s'approchent du quai. Un soldat francais embusque dans un "
                "batiment de la rive opposee repere ce groupe et ouvre le feu. Von Speck s'effondre, "
                "touche au torse. Il meurt quelques minutes plus tard. Ses derniers mots, rapportes "
                "par sa fille 70 ans plus tard : 'Es musste so sein' --- 'Il fallait que ce soit "
                "ainsi.' Il est le seul general allemand tue pendant toute la campagne de France."
            )
            ev["longText"] = (
                "Hermann Ritter von Speck est ne le 8 aout 1888 a Munich, en Baviere. Le 'Ritter' "
                "dans son nom n'est pas hereditaire : il l'a gagne au combat. Le 7 septembre 1914, "
                "a Gellenoncourt, il avance de sa propre initiative deux canons et ouvre le feu a "
                "courte distance. Cet acte lui vaut la Croix de l'Ordre Max-Joseph, la plus haute "
                "decoration bavaroise, qui confere la noblesse personnelle.\n\n"
                "Le 5 juin 1940, dix jours avant sa mort, il recoit le commandement du XVIIIe corps. "
                "Face a lui, la 4e Division Legere Mecanique defend les ponts de Sens avec 25 chars "
                "au total, une douzaine d'automitrailleuses, une batterie de 75. Le 5e Regiment de "
                "Dragons Portes tient Sens jusqu'a 19h30. Le capitaine Garnier traverse les lignes "
                "ennemies avec son automitrailleuse pour sauver un escadron encercle --- il est tue "
                "par un tir d'artillerie.\n\n"
                "A Pont-sur-Yonne, Von Speck commet l'erreur fatale de s'approcher du quai a "
                "decouvert. Un tireur francais dont le nom n'est pas connu l'abat depuis la rive "
                "opposee. D'apres sa fille, il avait deliberement cherche la mort. Catholique, il "
                "ne pouvait ni deserter, ni se suicider, ni rompre son serment.\n\n"
                "Il fut d'abord inhume a Pont-sur-Yonne. Son corps fut transfere au Waldfriedhof "
                "de Munich. Il recut a titre posthume la Croix de chevalier de la Croix de fer."
            )
            ev["sources"] = [
                "Wikipedia, Hermann Ritter von Speck.",
                "Daguin, G. '15 juin 1940, les combats pour les ponts de Sens.'",
                "OMSA, Lieutenant-General Hermann Ritter von Speck.",
                "Jay Nordlinger, temoignage de la fille (2010).",
            ]

# 2. Augusta Hure - article complet
for ch in data["chapters"]:
    for ev in ch["events"]:
        if "augusta hure" in ev["title"].lower():
            ev["text"] = (
                "En 1920, Augusta Hure est nommee conservatrice des musees de Sens --- premiere "
                "femme a occuper ce poste en France. Orpheline a 13 ans, modiste avec sa mere, "
                "elle decouvre des gisements de phosphate et recoit la medaille d'argent de la "
                "Societe geologique. Pendant la guerre, sous-directrice d'hopital. Conservatrice "
                "benevole pendant 33 ans. Trois volumes de reference, 112 memoires, des milliers "
                "de silex. Les plus grands savants --- Reinach, Jullian --- la respectent. Legion "
                "d'honneur en 1952, un an avant sa mort. Elle legue tout a la ville de Sens."
            )
            ev["longText"] = (
                "Georgie Augusta Hure nait le 8 septembre 1870 a Sens, fille de viticulteurs. "
                "Orpheline de pere a 13 ans, elle quitte l'ecole et travaille comme modiste. "
                "Rien ne la predestine a la science. Mais elle tient des carnets de voyage ou "
                "elle documente monuments, geologie et histoire.\n\n"
                "En 1907, elle adhere a la Societe des Sciences de l'Yonne. En 1913, triple "
                "adhesion : Societe geologique de France, Societe prehistorique francaise, "
                "Societe des Sciences. Ses prospections dans les champs du Senonais revelent des "
                "gisements de phosphate --- medaille d'argent 1916.\n\n"
                "Pendant la Grande Guerre, infirmiere puis sous-directrice de l'Hopital 105. "
                "Palmes d'or de la Croix-Rouge, insignes d'or du Ministere de la Guerre.\n\n"
                "En 1920, le maire Cornet la nomme conservatrice. Elle exercera benevolement "
                "pendant 33 ans. Son oeuvre : Le Senonais prehistorique (550 pages, couronne par "
                "l'Academie), Le Senonais aux ages du Bronze et du Fer (mention Academie des "
                "Inscriptions), Le Senonais gallo-romain (publie apres sa mort). 112 memoires. "
                "Des milliers de silex neolithiques collectes a pied dans les champs.\n\n"
                "Adrien Blanchet, Salomon Reinach, Camille Jullian --- les plus grands savants "
                "de l'epoque --- la respectent. En 1937, correspondante des Monuments historiques. "
                "En 1952, Legion d'honneur. Elle legue tous ses biens a Sens. Une rue porte son "
                "nom dans le quartier sud."
            )
            ev["sources"] = [
                "Ville de Sens, 'Le fabuleux destin d'Augusta Hure.'",
                "Bernard Leger, biographie de reference.",
                "Academie de Dijon, notice Augusta Hure.",
            ]

# 3. Merovingiens - contextualisation
existing = set()
for ch in data["chapters"]:
    for ev in ch["events"]:
        existing.add(ev["title"].lower()[:50])

mero = [
    ("II", {
        "year": 511,
        "title": "Mort de Clovis : Sens dans le partage du royaume franc",
        "text": (
            "Quand Clovis meurt en 511, son royaume est partage entre ses quatre fils. "
            "Sens se retrouve dans le royaume de Paris (Childebert), puis passe de main en "
            "main au gre des guerres fratricides. Ce qu'il faut comprendre : pendant deux "
            "siecles, les rois merovingiens se battent entre eux. Sens change de maitre "
            "plusieurs fois. Mais l'archeveque, lui, reste. L'Eglise est la seule "
            "institution stable. C'est pourquoi l'archeveque de Sens devient si puissant : "
            "il est le seul qui dure."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Sens --- partage merovingien"},
        "sources": ["Gregoire de Tours, Historia Francorum.", "Brousse, B. 2024."],
        "heritageItemId": None,
    }),
    ("II", {
        "year": 580,
        "title": "Cinq monasteres ceinturent Sens : la ceinture de prieres",
        "text": (
            "A l'epoque merovingienne, cinq monasteres ceinturent Sens : Saint-Pierre-le-Vif "
            "(le plus riche), Saint-Remy, Saint-Jean, Notre-Dame-du-Charnier et Sainte-Colombe. "
            "Ce ne sont pas que des lieux de priere : ce sont des centres economiques (terres, "
            "moulins, vignes), des ecoles (on y copie des manuscrits), et des forteresses "
            "spirituelles. Au VIIe siecle, il y a probablement plus de religieux que de laics "
            "autour de Sens. Cette 'ceinture de prieres' explique pourquoi Sens restera une "
            "cite fondamentalement religieuse pendant un millenaire."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Cinq monasteres autour de Sens"},
        "sources": ["Bourgogne medievale, fiche Sens.", "Brousse, B. 2024."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),
    ("II", {
        "year": 750,
        "title": "Ce qui survit quand tout s'effondre : les trois piliers de Sens",
        "text": (
            "On presente les Merovingiens comme des 'rois faineants' --- image fausse creee par "
            "les Carolingiens pour justifier leur coup d'Etat. A Sens, l'epoque merovingienne "
            "est au contraire fondatrice. C'est entre le Ve et le VIIIe siecle que se mettent "
            "en place les trois piliers qui tiendront mille ans : l'archeveche comme pouvoir "
            "reel (pas le roi), les monasteres comme moteurs economiques (les moines defrichent, "
            "plantent, construisent), et les paroisses comme cadre de vie. Quand les Vikings "
            "attaqueront en 886, c'est cette structure qui tiendra. Quand la monarchie tombera "
            "en 1789, c'est cette structure qui s'effondrera."
        ),
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- fondations merovingiens"},
        "sources": ["Brousse, B. 2024.", "Bourgogne medievale."],
        "heritageItemId": None,
    }),
]

added = 0
for ch_id, event in mero:
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
ch2 = next(ch for ch in data["chapters"] if ch["id"] == "II")
ch7 = next(ch for ch in data["chapters"] if ch["id"] == "VII")
print(f"+{added} events merovingiens + 2 articles longs recrits")
print(f"Total: {total} events")
print(f"Chapitre II: {len(ch2['events'])} events")
print(f"Chapitre VII: {len(ch7['events'])} events")
