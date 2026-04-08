#!/usr/bin/env python3
"""Ajoute les evenements sur les 3 ordres et les rivalites inter-villes."""
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

SRC = "Poree, C. Cahiers de doleances du bailliage de Sens, 1908."

new_events = [
    ("VI", {
        "year": 1789,
        "title": "La noblesse senonaise accepte l'impot la premiere",
        "text": "Surprise : a Sens, c'est la noblesse qui, la premiere, declare que chaque noble doit payer l'impot proportionnellement a son revenu. Elle le communique immediatement aux deux autres ordres. Le clerge suit. Les trois ordres tombent d'accord sur six points : impot pour tous, suppression de la gabelle et des aides, fin des lettres de cachet, reforme de la justice, retour periodique des Etats Generaux, creation d'Etats provinciaux. La noblesse senonaise va meme plus loin : elle demande la liberte individuelle, l'abolition des lettres de cachet et la liberte de la presse.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Assemblee du bailliage --- 3 ordres"},
        "sources": [SRC + " Noblesse l.548-551, l.55196-55207 (liberte), l.55351-55359 (presse)."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Le clerge denonce la gabelle mais defend la dime",
        "text": "Le clerge du bailliage de Sens accepte de payer plus d'impots, mais a une condition : il veut continuer a s'auto-taxer ('conserver ses formes'). Il surprend en demandant la suppression de la gabelle, qu'il qualifie de 'taxe desastreuse' qui jette des familles en prison. Il propose meme de reduire les jours de fete --- qui empechent les pauvres de travailler. Mais sur la dime, pas de concession : le clerge la defend et veut une loi pour clarifier sa perception. C'est le point de rupture avec le Tiers Etat, pour qui la dime pese plus lourd que tous les impots royaux.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- cahier du clerge"},
        "sources": [SRC + " Clerge l.54537-54545 (impot), l.54935 (gabelle), l.54714 (dime), l.54460 (fetes)."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "La noblesse refuse le rachat des droits feodaux : la propriete est sacree",
        "text": "Sur un point, la noblesse senonaise ne cede pas : ses droits feodaux. L'article 9 de son cahier --- le plus long --- refuse categoriquement tout 'rachat' force des droits seigneuriaux. La noblesse elle-meme est une propriete 'aussi inviolable que la terre.' Mais une nuance : les nobles 'eclaires' pourront negocier a l'amiable avec leurs vassaux sur les droits les plus durs. De son cote, le Tiers Etat demande partout la suppression des champarts, du minage, des banalites. Cinq mois plus tard, la nuit du 4 aout 1789 tranchera : tous les droits feodaux sont abolis.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Bailliage --- noblesse vs Tiers"},
        "sources": [SRC + " Noblesse l.55363-55406 (art. 9). Nuit du 4 aout 1789."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Le minage de Sens chasse les marchands vers Bray",
        "text": "Au marche de Sens, le droit de minage preleve 1/32e du grain apporte --- c'est le taux le plus eleve de la region. A Bray, c'est seulement 1/100e. A Provins, le minage a ete reduit a 15 deniers par setier, et le marche a retrouve sa prosperite. Resultat : les laboureurs font des kilometres supplementaires pour eviter Sens. Un memoire de 1788 denonce ce droit 'exorbitant.' A Griselles, on decrit les collecteurs du minage comme des brutes qui 'harcelent les fermiers avec des mesures infideles.' La fiscalite de Sens tue le marche de Sens.",
        "location": {"lat": 48.1979, "lng": 3.2819, "label": "Marche de Sens --- minage exorbitant"},
        "sources": [SRC + " Cuy l.7363-7371, Brienon l.10898, Griselles l.14432-14443."],
        "heritageItemId": "e5555555-0004-0004-0004-000000000004",
    }),
    ("VI", {
        "year": 1790,
        "title": "Villeneuve-le-Roi contre Sens : la bataille du district",
        "text": "En 1790, quand il faut decouper la France en departements, Villeneuve-le-Roi (aujourd'hui Villeneuve-sur-Yonne) tente de decrocher un district a la place de Sens. Son depute Menu de Chomorceau, doyen de la Constituante, 'depense beaucoup d'efforts, mais sans succes.' Plus tot, on avait meme propose de tenir l'assemblee du bailliage a Villeneuve plutot qu'a Sens. Finalement, c'est Auxerre qui raflera la mise en devenant chef-lieu du departement de l'Yonne. Sens perd sur tous les tableaux.",
        "location": {"lat": 48.0800, "lng": 3.3000, "label": "Villeneuve-le-Roi vs Sens"},
        "sources": [SRC + " Introduction l.529, l.451-452. Poree, Formation du dept de l'Yonne, 1905."],
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
print(f"+{added} evenements (3 ordres + rivalites)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
for ch in data["chapters"]:
    print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")
