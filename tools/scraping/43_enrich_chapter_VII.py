#!/usr/bin/env python3
"""Etoffe le chapitre VII apres 1945 pour combler le ventre mou."""
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
    ("VII", {
        "year": 1950,
        "title": "La reconstruction d'apres-guerre : Sens panse ses plaies",
        "text": (
            "Apres 1945, Sens se reconstruit lentement. Les batiments endommages par les "
            "bombardements de 1940 et 1944 sont repares. La ville retrouve ses marches, ses "
            "commerces, sa vie ordinaire. Mais le monde a change : les prisonniers de guerre "
            "et les deportes reviennent avec des recits que personne ne veut entendre. Les "
            "femmes qui ont tenu l'arriere pendant cinq ans retournent au foyer. La IVe "
            "Republique installe la Securite sociale et les allocations familiales --- un "
            "filet de protection que les cahiers de doleances de 1789 reclamaient deja."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens --- reconstruction apres-guerre"},
        "sources": ["Archives municipales de Sens."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 1962,
        "title": "Les rapatries d'Algerie arrivent a Sens : une ville qui change de visage",
        "text": (
            "En 1962, apres les accords d'Evian, des familles rapatriees d'Algerie "
            "s'installent a Sens et dans le Senonais. Pieds-noirs et harkis arrivent "
            "avec leurs valises et leurs memoires. La ville, encore marquee par la guerre "
            "de 1940, doit loger, scolariser, integrer. Les nouveaux logements des Champs-"
            "Plaisants (ZUP lancee en 1959) accueillent une partie de ces familles. C'est "
            "le debut d'une transformation demographique qui changera durablement le visage "
            "de Sens."
        ),
        "location": {"lat": 48.2030, "lng": 3.2750, "label": "Champs-Plaisants --- rapatries 1962"},
        "sources": ["Archives departementales de l'Yonne."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 1975,
        "title": "La crise industrielle frappe Sens : les usines ferment les unes apres les autres",
        "text": (
            "A partir du milieu des annees 1970, la crise economique frappe Sens de plein "
            "fouet. Les tanneries ont disparu depuis vingt ans. Les manufactures textiles "
            "ferment. La Cebal (emballages metalliques), principal employeur avec 800 "
            "salaries, reduit ses effectifs. L'usine a plomb Lelievre, les ateliers de "
            "confection, les petites fabriques --- tout se delite. Sens, ville ouvriere "
            "depuis le Moyen Age, decouvre le chomage de masse. Les Champs-Plaisants, "
            "construits pour loger les ouvriers des usines, perdent leur raison d'etre."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens --- desindustrialisation"},
        "sources": ["INSEE, donnees economiques de l'Yonne."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 1982,
        "title": "L'Yonne quitte la Bourgogne pour l'Ile-de-France ? Le debat qui ne finit jamais",
        "text": (
            "En 1982, avec la decentralisation Mitterrand, la question resurgit : l'Yonne "
            "doit-elle rester en Bourgogne ou rejoindre l'Ile-de-France ? Sens est a 100 km "
            "de Paris, 200 km de Dijon. Ses habitants travaillent a Paris, regardent la tele "
            "parisienne, prennent le train vers Paris. Mais l'identite bourguignonne est "
            "ancienne --- meme si, historiquement, Sens n'a jamais ete en Bourgogne : le "
            "bailliage de Sens relevait du Parlement de Paris, pas de Dijon. Le debat "
            "resurface a chaque reforme territoriale, et n'est toujours pas tranche."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens --- entre Bourgogne et Ile-de-France"},
        "sources": ["Wikipedia, Yonne.", "Debats parlementaires, reforme territoriale 2015."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 2001,
        "title": "Sens jumelee avec Senigallia : les Senons retrouvent leurs cousins italiens",
        "text": (
            "En 2001, Sens se jumelle avec Senigallia, ville italienne des Marches fondee "
            "par les Senons --- le meme peuple gaulois qui a fonde Sens. Quand Brennus a "
            "quitte la Gaule pour prendre Rome en -390, une partie des Senons s'est installee "
            "sur la cote adriatique, fondant Sena Gallica (aujourd'hui Senigallia). Deux "
            "mille quatre cents ans plus tard, les descendants des Senons des deux cotes des "
            "Alpes se retrouvent officiellement. L'histoire boucle."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens-Senigallia --- jumelage senon"},
        "sources": ["Ville de Sens, jumelages.", "Wikipedia, Senigallia."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 2010,
        "title": "Le centre-ville se vide : Sens face a la desertification commerciale",
        "text": (
            "A partir de 2010, le phenomene s'accelere : les commerces du centre-ville "
            "de Sens ferment les uns apres les autres. La Grande-Rue, artere commerciale "
            "depuis l'epoque romaine, se couvre de rideaux baisses. Les zones commerciales "
            "en peripherie (Voulx, Maillot) attirent les enseignes. Le marche du samedi "
            "resiste, mais la semaine, le centre est desert. Sens rejoint la longue liste "
            "des villes moyennes frappees par la 'diagonale du vide'. Le programme Action "
            "Coeur de Ville (2018) tente d'inverser la tendance."
        ),
        "location": {"lat": 48.1975, "lng": 3.2840, "label": "Grande-Rue --- desertification commerciale"},
        "sources": ["Programme Action Coeur de Ville, 2018.", "L'Yonne Republicaine."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 2016,
        "title": "La Bourgogne-Franche-Comte : Sens toujours plus loin de sa capitale regionale",
        "text": (
            "Le 1er janvier 2016, la fusion des regions Bourgogne et Franche-Comte entre "
            "en vigueur. La capitale regionale est Dijon --- a 200 km de Sens. Besancon est "
            "encore plus loin. Pour les Senonais, la reforme eloigne le centre de decision. "
            "Le debat seculaire resurgit : Sens, qui n'a jamais releve de Dijon dans toute "
            "son histoire (bailliage de la couronne, parlement de Paris, archidiocese "
            "independant), se retrouve dans une region dont le centre de gravite est a "
            "l'oppose."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens --- reforme regionale 2016"},
        "sources": ["Loi n.2015-29 du 16 janvier 2015.", "L'Yonne Republicaine."],
        "heritageItemId": None,
    }),
    ("VII", {
        "year": 2016,
        "title": "Les inondations de juin 2016 : l'Yonne deborde, le Senonais sous les eaux",
        "text": (
            "Fin mai - debut juin 2016, des pluies exceptionnelles provoquent la crue de "
            "l'Yonne et de ses affluents. Le Senonais est durement touche : rues inondees, "
            "caves envahies, routes coupees. C'est la pire crue depuis janvier 1910. Les "
            "pompiers evacuent des dizaines de familles. L'eau monte jusqu'a 4 metres au-"
            "dessus du niveau normal dans certaines communes. Le souvenir de la grande crue "
            "de 1658 --- quand Louis XIV avait failli perdre ses dames d'honneur dans l'Yonne "
            "--- revient dans les conversations."
        ),
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Yonne --- inondations juin 2016"},
        "sources": ["Meteo France.", "L'Yonne Republicaine, juin 2016."],
        "heritageItemId": None,
    }),
]

added = 0
for ch_id, event in new_events:
    if event["title"].lower()[:50] in existing:
        print(f"  SKIP: {event['title'][:60]}")
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
ch7 = next(ch for ch in data["chapters"] if ch["id"] == "VII")
print(f"\n+{added} events (enrichissement ch.VII apres-guerre)")
print(f"Ch VII: {len(ch7['events'])} events")
print(f"Total: {total} events")
