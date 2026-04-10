#!/usr/bin/env python3
"""Ajoute les événements sur l'identité de Sens, ses maîtres, sa population, son urbanisme."""
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
    # MAITRES DE SENS
    ("II", {
        "year": 939,
        "title": "Les comtes hereditaires : la dynastie Fromonide prend Sens",
        "text": "Vers 939, Fromond Ier fonde une dynastie de comtes hereditaires de Sens. Ses successeurs --- Renard Ier (un demi-siecle au pouvoir), Fromond II, Renard II 'le Mauvais' --- regnent sur Sens pendant plus d'un siecle. Ils sont en conflit permanent avec les archeveques. En 1015, le roi Robert II reprend la ville par les souterrains. Renard II conserve le titre jusqu'a sa mort en 1055. Le comte de Sens est la premiere acquisition feodale des Capetiens --- et le bailliage de Sens devient le premier bailliage de France.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- comtes Fromonides"},
        "sources": ["Wikipedia, Comte de Sens.", "Wikipedia, Liste des comtes et vicomtes de Sens."],
        "heritageItemId": None,
    }),
    # IDENTITE : BOURGOGNE OU IDF ?
    ("II", {
        "year": 895,
        "title": "Richard le Justicier s'empare de Sens : la Bourgogne avale le Senonais",
        "text": "En 895, le duc Richard le Justicier de Bourgogne s'empare du comte de Sens et se fait nommer abbe de Sainte-Colombe. C'est la premiere fois que Sens passe dans l'orbite bourguignonne. Mais en 1015, le roi Robert II la reprend. Sous l'Ancien Regime, Sens relevera de la Generalite de Paris, pas de Dijon --- elle est administrativement champenoise, pas bourguignonne. En 1790, on la met dans l'Yonne (a dominante bourguignonne) par assemblage artificiel. Aujourd'hui, Sens est a 55 minutes de Paris en train, mais a 2 heures de Dijon. 5 000 navetteurs prennent le train vers Paris chaque jour.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- ni Bourgogne ni IDF"},
        "sources": ["Wikipedia, Senonais.", "Wikipedia, Histoire de l'Yonne.", "INSEE, navetteurs."],
        "heritageItemId": None,
    }),
    # URBANISME
    ("I", {
        "year": 280,
        "title": "L'amande : 3 km de remparts creent la forme de Sens pour 17 siecles",
        "text": "A la fin du IIIe siecle, les Senonais construisent une enceinte de 3 km de perimetre --- parmi les plus imposantes de la Gaule romaine. Des murs de 8 metres de haut, des fosses remplis d'eau, des portes fortifiees. Pour construire ces remparts, on demolit les quartiers peripheriques, les arenes, les thermes --- les materiaux sont reutilises. La ville se contracte dans une forme ovale que les Senonais appellent 'l'amande'. Cette forme ovale definira le plan de Sens pendant 17 siecles --- jusqu'a ce qu'on comble les fosses au XVIIIe pour creer les boulevards.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "L'amande --- forme de Sens depuis le IIIe s."},
        "sources": ["Daguin, G. histoire-sens-senonais-yonne.com.", "Bourgogne medievale, fiche Sens."],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014",
    }),
    ("V", {
        "year": 1756,
        "title": "On comble les fosses : les remparts deviennent des boulevards",
        "text": "En 1756, le Conseil autorise a combler les fosses entre la porte Saint-Didier et la porte Saint-Antoine. C'est le debut de la transformation de la ville close medievale en ville ouverte moderne. Les fosses combles deviennent des promenades, puis des boulevards (14-Juillet, du Mail, Garibaldi). En 1776, un incendie rue Couverte fournit les materiaux pour poursuivre le comblement. Les portes de la ville seront demolies entre 1831 et 1882. L'amande gallo-romaine eclate enfin --- apres 15 siecles.",
        "location": {"lat": 48.1965, "lng": 3.2860, "label": "Fosses combles --- boulevards"},
        "sources": ["Daguin, G. 'Des portes qui laissaient entrer le voyageur.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014",
    }),
    # POPULATION
    ("VI", {
        "year": 1793,
        "title": "Premier recensement : 10 957 habitants dans la tourmente revolutionnaire",
        "text": "Le premier recensement revolutionnaire compte 10 957 habitants a Sens en 1793. La ville retombera a 8 675 en 1806 (point bas historique), puis mettra un siecle a franchir les 15 000 (en 1911). L'arrivee du train (1849) accelere la croissance : 13 515 en 1881. Mais c'est le XXe siecle qui transforme tout : 20 000 en 1962 (baby-boom + ZUP des Champs-Plaisants), pic a 27 082 en 1990, puis leger declin avant de remonter a 27 106 en 2023 --- record absolu, porte par les neo-Senonais venus d'Ile-de-France.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- demographie"},
        "sources": ["INSEE, recensements 1793-2023.", "Cassini/EHESS, donnees historiques."],
        "heritageItemId": None,
    }),
    # GRANDS MAIRES
    ("VI", {
        "year": 1893,
        "title": "Lucien Cornet : 29 ans de pouvoir, l'homme qui modernise Sens",
        "text": "Lucien Cornet est elu maire de Sens en 1893. Radical-socialiste, il restera 29 ans au pouvoir (jusqu'a sa mort en 1922), cumulant avec les mandats de depute puis senateur. C'est lui qui modernise Sens : hotel de ville, egouts, eau courante, ecoles, college de jeunes filles. Le pont qui porte son nom est inaugure en 1913. Son influence est telle qu'aucun maire apres lui ne remodele autant la ville --- jusqu'a Marie-Louise Fort, qui dirigera Sens de 2001 a 2022.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Hotel de ville --- ere Cornet"},
        "sources": ["Senat, fiche Lucien Cornet.", "Daguin, G. 'Victor Guichard.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0012-0012-0012-000000000012",
    }),
    # ARCHEVEQUES COMME VRAIS MAITRES
    ("III", {
        "year": 1122,
        "title": "Henri Sanglier : l'archeveque qui lance la cathedrale et juge Abelard",
        "text": "Henri Sanglier, archeveque de Sens de 1122 a 1142, est l'homme le plus puissant du nord de la France apres le roi. C'est lui qui lance la construction de la cathedrale gothique vers 1135. C'est lui qui preside le concile qui condamne Abelard en 1140. Il participe au concile de Troyes (1129) qui reconnait l'Ordre des Templiers. Il meurt en 1142 et est enterre a l'abbaye Saint-Pierre-le-Vif. De son vivant, l'archeveque de Sens commande a Paris, Chartres, Orleans, Meaux, Troyes, Auxerre et Nevers.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal --- Henri Sanglier"},
        "sources": ["Wikipedia, Henri Ier Sanglier.", "Leviste, J. La cathedrale de Sens. 1965."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # GRANDES FAMILLES - DUPRAT
    ("IV", {
        "year": 1525,
        "title": "Antoine Duprat : l'archeveque-chancelier de France",
        "text": "Antoine Duprat cumule les deux postes les plus puissants du royaume : archeveque de Sens (1525-1535) et chancelier de France. Il est le bras droit de Francois Ier. C'est lui qui negocie le Concordat de Bologne (1516) qui donne au roi le droit de nommer les eveques. Sens n'est plus seulement une metropole religieuse --- c'est un rouage du pouvoir royal. Duprat incarne le moment ou l'Eglise et l'Etat fusionnent au sommet.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Archevech --- Duprat, chancelier de France"},
        "sources": ["Wikipedia, Antoine Duprat."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # XXe siecle - ZUP
    ("VII", {
        "year": 1965,
        "title": "La ZUP des Champs-Plaisants : Sens sort de l'amande",
        "text": "Dans les annees 1960, Sens construit la ZUP (Zone a Urbaniser en Priorite) des Champs-Plaisants et le quartier des Arenes, au nord de la ville. Des barres d'immeubles pour loger les familles venues des campagnes, du Maghreb, et de Paris. Sens passe de 20 000 a 27 000 habitants en 30 ans. Pour la premiere fois depuis les Romains, la ville s'etend massivement hors de l'amande. Mais ces grands ensembles, construits a la hate, vieilliront mal : 617 logements seront demolies d'ici 2030.",
        "location": {"lat": 48.2000, "lng": 3.2900, "label": "ZUP des Champs-Plaisants"},
        "sources": ["Ville de Sens, grands projets.", "Wikipedia, Sens (Yonne)."],
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
total_chars = sum(len(ev["text"]) for ch in data["chapters"] for ev in ch["events"])
print(f"+{added} evenements (identite, maitres, population, urbanisme)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
for ch in data["chapters"]:
    print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")
