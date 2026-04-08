#!/usr/bin/env python3
"""Ajoute les evenements extraits des Cahiers de doleances 1789."""
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
        "title": "Le sel a 14 sous : une journee de travail pour huit jours de sel",
        "text": "A Cuy, pres de Villeneuve-sur-Yonne, un ouvrier agricole gagne 15 sous par jour. La livre de sel coute 14 sous. Elle ne dure meme pas huit jours pour une famille. Le sel est un monopole royal (la gabelle) : impossible d'en acheter ailleurs. A Villiers-Louis, on ecrit que meme le mendiant paie proportionnellement plus cher que le riche. A Saint-Martin-sur-Oreuse, les plus pauvres sont forces d'acheter la meme quantite que les riches. C'est une taxe par tete, pas par fortune.",
        "location": {"lat": 48.1600, "lng": 3.3000, "label": "Cuy / Villiers-Louis --- gabelle"},
        "sources": [SRC + " Cuy l.7332, Villiers-Louis l.29988, Saint-Martin l.26448."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Les chemins de Brannay : le bourbier qui isole les villages",
        "text": "Brannay est a 12 km de Sens, mais en hiver c'est le bout du monde. Les chemins sont 'fort mauvais et presque impraticables.' Les paysans ne peuvent amener leurs recoltes au marche. Pire : ils paient un impot pour entretenir les grandes routes dont ils ne profitent pas. Leur argent sert a la route Paris-Lyon pendant que leurs sentiers sont des bourbiers. A Evry, le notaire qui redige le cahier n'arrive plus a finir sa phrase pour decrire l'etat du chemin.",
        "location": {"lat": 48.1500, "lng": 3.2400, "label": "Brannay --- chemins impraticables"},
        "sources": [SRC + " Brannay l.10615, Evry l.4279."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Le vigneron a 2% de marge : travailler presque gratuitement",
        "text": "Un calcul de 1789 : un vigneron exploitant 20 arpents dans un des meilleurs terroirs de Champagne vend pour 6 732 livres. Les taxes sur le vin (1 151 livres de droits d'aides), la culture et les tonneaux absorbent 6 607 livres. Reste : 124 livres --- moins de 2%. Et on n'a pas compte la taille. Le vigneron travaille presque gratuitement. A Dixmont, les habitants sont en proces contre l'Etat qui veut des taxes supplementaires sur leur propre vin.",
        "location": {"lat": 48.1940, "lng": 3.2900, "label": "Vignobles senonais --- 2% de marge"},
        "sources": [SRC + " Calcul election l.935-948, Dixmont l.15895."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Les pigeons du seigneur devorent les semailles",
        "text": "A Etigny, le seigneur et deux particuliers entretiennent des colombiers bourres de pigeons. A chaque semaille, les pigeons devorent les grains. Le laboureur doit semer un seizieme de plus pour compenser. A La Louptiere, on demande la fin du droit de chasse : les lievres ravagent les champs mais seuls les seigneurs en profitent. A Villeblevin, les gardes-chasse sont devenus 'les maitres de l'honneur et de la vie des citoyens' --- ils accusent sans temoin.",
        "location": {"lat": 48.1400, "lng": 3.2800, "label": "Etigny --- pigeons du seigneur"},
        "sources": [SRC + " Etigny l.4181, La Louptiere l.20403, Villeblevin l.34877."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "\"Il vaut mieux subir une injustice\" : la justice ruine les honnetes gens",
        "text": "A Cerisiers, le cahier pose un constat accablant : 'Il est quelquefois bien plus avantageux de souffrir une injustice que de vouloir s'en faire rendre justice.' Un creancier qui a raison voit son debiteur faire appel en appel jusqu'au Parlement. Le temps du jugement, le debiteur n'a plus rien et le creancier a tout perdu en frais. A Dollot : 'la chicane eternise les proces et reduit a l'indigence les familles les plus aisees.' La justice fabrique les pauvres.",
        "location": {"lat": 48.1300, "lng": 3.2000, "label": "Cerisiers / Dollot --- justice ruineuse"},
        "sources": [SRC + " Cerisiers l.12586, Dollot l.16936."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Paron, a cote de Sens, trop pauvre pour un maitre d'ecole",
        "text": "Paron, juste a cote de Sens, 'n'est meme pas en etat d'avoir un maitre d'ecole.' A La Chapelle-Saint-Pere, garcons et filles sont dans la meme classe avec un maitre paye 100 livres par an. Un ancien cure a legue 25 livres pour les ecoliers pauvres --- ca suffit pour 8 enfants. A Saligny, le maitre d'ecole doit d'abord chanter a la messe : l'ecole est une dependance de l'Eglise. L'instruction publique, gratuite et laique, n'existe pas encore.",
        "location": {"lat": 48.2050, "lng": 3.2750, "label": "Paron --- pas de maitre d'ecole"},
        "sources": [SRC + " Paron l.3515, La Chapelle-St-Pere l.19164, Saligny l.8313."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Le libre-echange avec l'Angleterre : deja en 1789, la mondialisation fait debat",
        "text": "Les marchands de Sens denoncent le traite de commerce franco-anglais de 1786. Les produits anglais, subventionnes, envahissent la France. Les manufactures ferment, les ouvriers sont licencies. La France ouvre 24 millions de consommateurs a l'Angleterre, qui n'en offre que 8 en retour. Les marchandises francaises, 'quoique mieux fabriquees', sont dedaignees. Deux siecles et demi avant le Brexit, le libre-echange fait debat au marche de Sens.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- debat libre-echange 1786"},
        "sources": [SRC + " Rapport de Sens l.2841-2865."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "La dime pese plus que tous les impots royaux reunis",
        "text": "A La Louptiere, les habitants affirment : 'La dime est la plus considerable charge du peuple ; ni les aides et gabelles, ni la taille et ses accessoires ne peuvent egaler ces droits.' L'Eglise preleve plus que l'Etat. Et a Malay-le-Vicomte, le chapitre des chanoines de Sens encaisse 3 185 livres de dimes tandis que le cure du village n'en touche que 108. L'argent de la paroisse part a Sens, pas a celui qui dit la messe.",
        "location": {"lat": 48.1500, "lng": 3.3500, "label": "La Louptiere / Malay --- dimes"},
        "sources": [SRC + " La Louptiere l.20392-20401, Malay-le-Vicomte l.5230-5328."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Ni bouillon ni medecin : le cure de Villadin temoigne",
        "text": "Le cure de Villadin temoigne : les malades pauvres n'ont ni bouillon ni medecin. Une seule maison peut donner un peu de soupe. Un systeme de charite avait fonctionne, finance par le prieur a 6 livres par mois, mais le prieur est mort. Son successeur, cure en Provence, envoie un peu de grain une fois par an. A Saint-Martin-du-Tertre, a 2 km de Sens, une vingtaine de familles mendient. On cultive avec des anes faute de chevaux.",
        "location": {"lat": 48.1400, "lng": 3.3200, "label": "Villadin --- misere rurale"},
        "sources": [SRC + " Villadin l.34297-34313, Saint-Martin-du-Tertre l.5779-5793."],
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
print(f"+{added} evenements (Cahiers de doleances)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
for ch in data["chapters"]:
    print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")
