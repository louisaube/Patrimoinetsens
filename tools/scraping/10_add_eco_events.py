#!/usr/bin/env python3
"""Ajoute les événements économiques manquants à histoire-chapitres.json."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

ECO_EVENTS = [
    # III — Le siècle de la cathédrale
    ("III", {
        "year": 1066,
        "title": "Naissance de la commune : Sens s'affranchit",
        "text": "En 1066, Sens est l'une des premières villes de France à obtenir une charte communale. Les bourgeois s'organisent pour tenir tête à l'archevêque. Mais le conflit durera des siècles : la ville est coupée en deux zones rivales. D'un côté la \"Ville\" (sous la commune), de l'autre le \"Cloître\" (sous le Chapitre de la cathédrale). Chacun a ses rues, ses marchés, ses bouchers, ses règles. Deux pouvoirs dans la même enceinte. Ce partage du territoire explique pourquoi Sens a deux places de marché, deux boucheries, deux juridictions — un héritage médiéval dont les traces se lisent encore dans le plan de la ville.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens — Commune vs Chapitre"},
        "sources": ["Daguin, G. \"De la porte St-Pregt à la place Drapes.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0012-0012-0012-000000000012",
    }),
    ("III", {
        "year": 1150,
        "title": "Sens, \"ville drapante\" du royaume",
        "text": "Au XIIe siècle, Sens figure sur la liste officielle des Villes drapantes du royaume de France. Ce n'est pas anodin : dans l'économie médiévale, le drap (tissu de laine) est aussi stratégique que le pétrole aujourd'hui. La halle aux draps se dresse entre les rues Jean-Cousin et Jossey. Juste à côté, la \"Grange aux laines\" stocke la matière première venue des élevages du Sénonais. Les tisserands, foulons (ceux qui foulent le drap pour le rendre imperméable) et teinturiers forment des corporations puissantes. On mesure le drap avec l'\"aulne de Sens\", une unité locale reconnue dans tout le commerce régional.",
        "location": {"lat": 48.1965, "lng": 3.2830, "label": "Halle aux draps — rue Jean-Cousin"},
        "sources": ["Daguin, G. \"Sens, la cité médiévale — ainsi allait la vie.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    ("III", {
        "year": 1180,
        "title": "Les foires de Sens face aux géantes de Champagne",
        "text": "Pourquoi Sens n'est-elle pas devenue Troyes ou Provins ? Parce que les grandes foires de Champagne (Troyes, Provins, Lagny, Bar-sur-Aube) attirent les marchands italiens, flamands et allemands à l'échelle européenne — Sens reste une foire régionale. La ville a pourtant deux places de foire : le Vieux marché hors les murs au nord, et le Marchereau au sud. Les marchés hebdomadaires sont très actifs — halles au blé, aux pains, boucheries. Mais tout est dédoublé à cause de la rivalité Commune vs Chapitre : chacun veut contrôler le commerce sur \"son\" territoire. Cette querelle permanente freine le développement commercial de la ville.",
        "location": {"lat": 48.1975, "lng": 3.2810, "label": "Vieux marché / Marchereau"},
        "sources": ["Daguin, G. \"Sens, la cité médiévale.\" histoire-sens-senonais-yonne.com.", "Bulletin SAS, passim."],
        "heritageItemId": None,
    }),
    ("III", {
        "year": 1200,
        "title": "Les tanneurs du ru de Mondereau",
        "text": "Les tanneurs s'installent le long du ru (petit cours d'eau) qui traverse le sud de la ville, le plus près possible de l'Yonne. Leur métier exige de l'eau courante : les peaux de boeuf et de veau macèrent pendant des mois dans des fosses remplies d'écorce de chêne broyée — le \"tan\". C'est de là que viennent les mots \"tannerie\" et \"Moulin à Tan\". Le quartier sent fort. Les blanchisseurs sont juste à côté, rue de la Blanchisserie. C'est le quartier des métiers de l'eau — un écosystème artisanal où chaque étape de la transformation du cuir a son lieu dédié.",
        "location": {"lat": 48.1925, "lng": 3.2810, "label": "Quartier des tanneurs — ru de Mondereau"},
        "sources": ["Daguin, G. \"Sens, la cité médiévale — ainsi allait la vie.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0054-0054-0054-000000000054",
    }),
    ("III", {
        "year": 1250,
        "title": "Le Moulin à Tan : de l'artisanat au parc public",
        "text": "Le Moulin à Tan, au sud-est de la ville, est un moulin à eau sur l'Yonne. Il broie l'écorce de chêne pour produire le tan que les tanneurs utilisent pour traiter les peaux. C'est un maillon essentiel de la chaîne du cuir sénonais. Des siècles plus tard, quand les tanneries fermeront face à l'industrie moderne, le site deviendra un parc public : le parc du Moulin à Tan, que les Sénonais connaissent aujourd'hui pour sa roseraie, ses serres tropicales et son plan d'eau. Un lieu de labeur transformé en lieu de promenade — l'histoire en raccourci.",
        "location": {"lat": 48.1920, "lng": 3.2900, "label": "Moulin à Tan (actuel parc)"},
        "sources": ["Daguin, G. histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0008-0008-0008-000000000008",
    }),
    # IV — Ports sur l'Yonne
    ("IV", {
        "year": 1400,
        "title": "Trois ports sur l'Yonne : Sens, carrefour fluvial",
        "text": "Sens possède trois ports fluviaux sur l'Yonne : un au Clos-le-Roi (rive droite), un près de l'église Saint-Maurice, et un au Moulin de la Vierge (rive gauche). L'Yonne est une autoroute médiévale — elle relie le Morvan à Paris via la Seine. On y transporte du vin (le vignoble sénonais est réputé), du bois flotté descendu depuis les forêts du Morvan par les \"flotteurs\", des céréales, et du cuir tanné. Les mariniers de l'Yonne forment une corporation puissante. Ce commerce fluvial explique pourquoi Sens est prospère : elle est un péage obligatoire sur la route Paris-Lyon.",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Ports sur l'Yonne"},
        "sources": ["Daguin, G. \"La cathédrale — Les modifications.\" histoire-sens-senonais-yonne.com.", "Persée, \"Grèves de flotteurs sur l'Yonne aux XVIIIe et XIXe siècles.\"."],
        "heritageItemId": None,
    }),
    # V — Corporations Ancien Régime
    ("V", {
        "year": 1650,
        "title": "Les corporations de métiers sous l'Ancien Régime",
        "text": "Sous l'Ancien Régime, chaque métier est organisé en corporation (\"maîtrise\" ou \"jurande\"). Pour devenir maître boulanger, cordonnier, tailleur ou tonnelier, il faut faire un apprentissage de plusieurs années, produire un \"chef-d'oeuvre\" (une pièce parfaite jugée par les anciens), et payer un droit d'entrée. Les bouchers du faubourg ont même leur propre halle, séparée de celle de la ville : la \"croix des bouchers\" marque la frontière. Ce système rigide — qui bloque l'innovation et protège les héritiers — sera l'une des cibles de la Révolution.",
        "location": {"lat": 48.1960, "lng": 3.2830, "label": "Quartier des corporations"},
        "sources": ["Daguin, G. \"Sens, la cité médiévale.\" histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # VI — Déclin tanneries + vin
    ("VI", {
        "year": 1850,
        "title": "Le déclin des tanneries et du vignoble",
        "text": "Au XIXe siècle, les tanneries artisanales du quartier sud ne résistent pas à l'industrialisation. Les grandes tanneries mécaniques du nord de la France produisent plus et moins cher. Les fosses à tan se vident, les familles de tanneurs — qui se transmettaient le métier depuis des siècles — ferment boutique. En parallèle, le phylloxéra détruit le vignoble sénonais dans les années 1870-1880. Paron, dont le vin était \"regardé comme le meilleur des environs de Sens\" en 1789, perd ses 400 arpents de vignes. Sens perd ses deux richesses traditionnelles — le cuir et le vin — et doit se réinventer.",
        "location": {"lat": 48.1925, "lng": 3.2810, "label": "Anciennes tanneries — quartier sud"},
        "sources": ["Daguin, G. histoire-sens-senonais-yonne.com.", "Porée, C. Cahiers de doléances du bailliage de Sens, 1908 (description de Paron)."],
        "heritageItemId": "e5555555-0054-0054-0054-000000000054",
    }),
]


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    added = 0
    existing_titles = set()
    for ch in data["chapters"]:
        for ev in ch["events"]:
            existing_titles.add(ev["title"].lower().strip())

    for ch_id, event in ECO_EVENTS:
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
    print(f"Ajoute: +{added} evenements economiques")
    print(f"Total: {total} evenements")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
