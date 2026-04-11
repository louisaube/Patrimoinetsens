#!/usr/bin/env python3
"""Ajoute les grandes familles de Sens + Salazar + chateaux."""
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
    # SALAZAR
    ("IV", {
        "year": 1474,
        "title": "Tristan de Salazar : 45 ans d'archeveche, le transept, et 'l'epi ne te hate pas'",
        "text": (
            "Tristan de Salazar devient archeveque de Sens en 1474. Il y restera 45 ans --- un "
            "record absolu. Fils de Jean de Salazar, 'gentilhomme a la cape trouee, leger d'argent "
            "non moins que de scrupules', et de Marguerite de la Tremoille (fille naturelle de "
            "Georges de la Tremoille), Tristan est un batisseur : il finance la construction du "
            "transept de la cathedrale par l'architecte Martin Chambiges --- les murs de verre qui "
            "inondent la nef de lumiere. A 78 ans, il accompagne Louis XII a la prise de Genes. "
            "A 80 ans, il assiste au concile de Pise-Milan. Il meurt a 88 ans. Son monument "
            "funeraire dans la cathedrale porte l'inscription cryptique 'epi, ne te hate pas' --- "
            "ne muris pas trop vite."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- monument Salazar, transept"},
        "sources": [
            "Daguin, G. 'Curiosites de la cathedrale (2).'",
            "Bulletin SAS, 1880 et 1892 (armoiries Salazar).",
        ],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # TARBE
    ("V", {
        "year": 1791,
        "title": "Louis-Hardouin Tarbe : du fils d'imprimeur au ministre du roi",
        "text": (
            "Louis-Hardouin Tarbe (1753-1806), fils aine des 15 enfants de l'imprimeur Pierre "
            "Hardouin Tarbe, devient ministre des Contributions et Revenus publics de Louis XVI "
            "du 29 mai 1791 au 24 mars 1792. Un fils d'imprimeur senonais au gouvernement du roi "
            "--- en pleine Revolution. Son frere Theodore reprend l'imprimerie et constitue un "
            "'cabinet' extraordinaire : 12 000 volumes, 213 manuscrits, 4 800 autographes, 7 900 "
            "monnaies, 325 tableaux. A sa mort en 1848, tout est vendu aux encheres. Le Cours "
            "Tarbe a Sens porte le nom de Louis-Hardouin."
        ),
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Cours Tarbe --- famille d'imprimeurs"},
        "sources": [
            "Wikipedia, Louis-Hardouin Tarbe.",
            "Persee, 'Un cabinet d'amateur : la collection de Theodore Tarbe.'",
            "Assemblee nationale, fiche depute.",
        ],
        "heritageItemId": None,
    }),
    # LORNE
    ("VI", {
        "year": 1891,
        "title": "Alfred Lorne fonde le musee de Sens : la maison demolie pour l'Hotel de Ville",
        "text": (
            "En 1891, Alfred Lorne fait une donation qui fonde effectivement le musee municipal "
            "de Sens --- collections d'archeologie et d'art rassemblees dans l'ancien Hotel Vezou. "
            "La famille Lorne possede aussi une maison au coin de la rue de la Republique et de la "
            "place Drapes. En 1899-1900, le conseil municipal vote sa demolition pour construire "
            "l'Hotel de Ville actuel (inaugure le 3 avril 1904, style Renaissance francaise). "
            "Son pere Clement avait achete en 1832 le domaine de Noslon --- l'ancienne residence "
            "d'ete des archeveques, en ruines. Aujourd'hui, les Vergers de Noslon (Vincent Lorne) "
            "perpetuent la tradition agricole sur le site archiepiscopal."
        ),
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Hotel de Ville --- ancien emplacement Lorne"},
        "sources": [
            "Wikipedia, Noslon.",
            "Musees de Sens, historique des collections.",
        ],
        "heritageItemId": "e5555555-0012-0012-0012-000000000012",
    }),
    # SAINT-PHALLE
    ("III", {
        "year": 1230,
        "title": "Les Saint-Phalle de Cudot : de l'empereur de Constantinople a Niki",
        "text": (
            "Vers 1230, la petite-fille de Pierre de Courtenay, empereur de Constantinople, "
            "epouse Andre de Saint-Phalle --- apportant la seigneurie de Cudot (25 km de Sens) "
            "dans cette famille de noblesse chevaleresque attestee depuis 1197. Les Saint-Phalle "
            "garderont le chateau de Cudot pendant 761 ans, jusqu'en 1991. Sainte Alpais de Cudot "
            "(morte en 1211), la mystique qui ne mangeait plus, est liee a cette terre. Sept siecles "
            "plus tard, la famille produira Niki de Saint Phalle (1930-2002), l'artiste aux Nanas "
            "geantes --- la Senonaise la plus celebre du XXe siecle."
        ),
        "location": {"lat": 48.0800, "lng": 3.1200, "label": "Cudot --- chateau des Saint-Phalle"},
        "sources": [
            "Wikipedia, Saint-Phalle.",
            "Gallica, Essai genealogique sur la maison de Saint-Phalle (Gougenot Des Mousseaux).",
        ],
        "heritageItemId": None,
    }),
    # CHATEAUX
    ("IV", {
        "year": 1548,
        "title": "Chateau de Vallery : le Marechal de France fait venir l'architecte du Louvre",
        "text": (
            "Le 16 avril 1548, Jacques d'Albon de Saint-Andre, Marechal de France et favori "
            "d'Henri II, achete le chateau de Vallery (30 km de Sens). Il le fait reconstruire "
            "par Pierre Lescot --- l'architecte du roi, le meme qui reconstruit le Louvre. Facades "
            "couvertes de marbre rouge et noir. Jardins Renaissance en seize carres autour d'un "
            "bassin. Apres l'assassinat du Marechal en 1562, le chateau passe aux princes de Conde "
            "pour deux siecles. Aujourd'hui, on y celebre des mariages --- dans un decor concu "
            "pour un roi."
        ),
        "location": {"lat": 48.1600, "lng": 3.0800, "label": "Chateau de Vallery --- Lescot/Conde"},
        "sources": ["Wikipedia, Chateau de Vallery."],
        "heritageItemId": None,
    }),
    ("IV", {
        "year": 1513,
        "title": "Chateau de Fleurigny : la chapelle attribuee a Jean Cousin",
        "text": (
            "En 1513, Francois Leclerc acquiert le chateau de Fleurigny (commune de Thorigny-sur-Oreuse), "
            "construit sur une ile entouree d'eau. La chapelle Renaissance (1532), a l'extremite est, "
            "est attribuee a Jean Cousin --- le grand peintre senonais. Les coffres de la voute "
            "presentent des decorations vegetales pendantes d'une qualite exceptionnelle. Le chateau "
            "est classe Monument Historique. C'est l'un des rares batiments ou l'on peut peut-etre "
            "voir du Jean Cousin architecte, pas seulement peintre."
        ),
        "location": {"lat": 48.2200, "lng": 3.3500, "label": "Chateau de Fleurigny --- chapelle Jean Cousin"},
        "sources": ["Wikipedia, Chateau de Fleurigny."],
        "heritageItemId": None,
    }),
    # CHEVALIER D'EON (Tonnerre mais Yonne)
    ("V", {
        "year": 1728,
        "title": "Le Chevalier d'Eon nait a Tonnerre : l'espion le plus celebre de l'Yonne",
        "text": (
            "Le 5 octobre 1728, Charles-Genevieve d'Eon de Beaumont nait a Tonnerre (60 km de Sens). "
            "Agent secret de Louis XV, il negocie l'alliance avec la Russie, elabore un plan "
            "d'invasion de l'Angleterre, et vit les 33 dernieres annees de sa vie en se presentant "
            "comme une femme. A sa mort a Londres en 1810, les medecins decouvrent un corps "
            "anatomiquement masculin. Le Chevalier (ou la Chevaliere) d'Eon est la personne "
            "transgenre la plus celebre de l'histoire de France --- et un(e) enfant de l'Yonne."
        ),
        "location": {"lat": 47.8600, "lng": 3.9700, "label": "Tonnerre --- Chevalier d'Eon"},
        "sources": ["Wikipedia, Chevalier d'Eon."],
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
print(f"+{added} events (familles + chateaux)")
print(f"Total: {total} events")
