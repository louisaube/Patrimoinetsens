#!/usr/bin/env python3
"""Ajoute les evenements paroisse par paroisse des Cahiers de doleances."""
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
        "title": "Fontaine-la-Gaillarde invente la sante publique gratuite",
        "text": "A Fontaine-la-Gaillarde, le cahier de doleances demande des 'chirurgiens dans chaque district, payes par l'Etat, pour aller aux secours des pauvres malades qui meurent n'ayant pas le moyen de payer des chirurgiens qui mettent leurs courses et leurs medicaments a des prix excessifs.' C'est une demande de sante publique gratuite, deux siecles avant la Securite sociale. Aucun autre village du bailliage n'a formule cette idee aussi clairement.",
        "location": {"lat": 48.1600, "lng": 3.2600, "label": "Fontaine-la-Gaillarde --- sante publique"},
        "sources": [SRC + " Fontaine-la-Gaillarde l.4857."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Foucherolles ecrit un proto-habeas corpus",
        "text": "Le cahier de Foucherolles contient un texte remarquable : il demande que 'les libertes et proprietes du citoyen soient respectees et que, dans aucun cas, on ne puisse le trainer en prison sans avoir observe ce qui est prescrit par les lois.' Il exige aussi qu'aucun desarmement ne se fasse dans les campagnes sans ordre du Roi publie a la porte de l'eglise, et que le syndic municipal accompagne la marechaussee pour veiller a ce que 'le malheureux ne soit ni vexe ni maltraite, comme cela est arrive plusieurs fois.' C'est un texte proto-constitutionnel : habeas corpus, droit de propriete, protection contre l'arbitraire.",
        "location": {"lat": 48.1200, "lng": 3.1800, "label": "Foucherolles --- droits fondamentaux"},
        "sources": [SRC + " Foucherolles l.14871-14895."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Dixmont invente la courbe de Laffer : baisser le prix du sel pour vendre plus",
        "text": "A Dixmont, les paysans raisonnent comme des economistes : ils argumentent que baisser le prix du sel augmenterait les recettes de l'Etat parce que la consommation augmenterait, et que 'les sels de France etant les meilleurs de toute l'Europe, les etrangers qui les trouveront a un juste prix en enleveront de plus grandes quantites.' C'est un raisonnement de type 'courbe de Laffer' formule par des paysans de l'Yonne 200 ans avant l'economiste americain.",
        "location": {"lat": 48.0800, "lng": 3.1700, "label": "Dixmont --- economie du sel"},
        "sources": [SRC + " Dixmont l.16082."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Sens en 1789 : 9 tanneries, 4 manufactures et un Anglais",
        "text": "En 1789, Sens a 8 370 habitants et 1 777 feux. Son economie : 567 arpents de vignes, 9 tanneries, 4 manufactures dont une de velours sur coton qui emploie 624 ouvriers, 2 manufactures de bas et bonneterie, et 1 fabrique de colle. Detail savoureux : un Anglais nomme Garnett s'apprete a installer une mecanique a filer le coton inspiree de l'industrie anglaise. Les manufactures de Manchester arrivent a Sens --- au moment meme ou les marchands senonais denoncent le libre-echange avec l'Angleterre.",
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Sens --- economie 1789"},
        "sources": [SRC + " Notices de Sandrier, donnees economiques de Sens."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Subligny exige les titres : 'montrez-nous le papier'",
        "text": "Subligny, l'un des pays les plus pauvres du bailliage, ose une demande radicale : que les habitants qui paient le droit de champart au Chapitre de Sens puissent voir les TITRES qui justifient ce droit. Et si ces titres n'existent pas, que tous les droits seigneuriaux soient supprimes. C'est le principe de la preuve retourne contre le seigneur : ce n'est plus au paysan de prouver qu'il ne doit rien, c'est au seigneur de prouver qu'on lui doit.",
        "location": {"lat": 48.2200, "lng": 3.2600, "label": "Subligny --- exigence des titres"},
        "sources": [SRC + " Subligny l.8964."],
        "heritageItemId": None,
    }),
    ("VI", {
        "year": 1789,
        "title": "Paron revendique le franc-alleu : 'nous ne devons rien au seigneur'",
        "text": "A Paron, 240 habitants, les paysans revendiquent une chose extraordinaire : le franc-alleu --- c'est-a-dire qu'ils pretendent ne rien devoir au seigneur sur leurs heritages. Pas de redevance, pas de cens, pas de droit feodal. C'est une revendication juridique extremement rare dans la France de 1789, ou presque tout le monde doit quelque chose a un seigneur. Paron est pauvre (on cultive avec des anes, pas de maitre d'ecole), mais fiere : meme le comte de Polignac n'a aucun droit sur leurs terres.",
        "location": {"lat": 48.2050, "lng": 3.2750, "label": "Paron --- franc-alleu revendique"},
        "sources": [SRC + " Paron l.3501-3515."],
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
print(f"+{added} evenements (doleances paroisses)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
for ch in data["chapters"]:
    print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")
