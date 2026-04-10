#!/usr/bin/env python3
"""Ajoute les evenements des SAS 1863 et 1877."""
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
    # SAS 1863
    ("I", {
        "year": 100,
        "title": "Le sol de Sens a monte de 3 metres en 2000 ans",
        "text": "En creusant place Drapes, on retrouve une chaussee romaine enfouie a 2m50 sous le sol actuel. C'est l'ingenieur Carre, agent-voyer, qui le constate en 1863. Toutes les voies romaines convergent vers la rue Saint-Martin (pont Liebault). Sept routes rayonnaient depuis Sens --- vers Orleans, Paris, Troyes, Meaux, Auxerre, Alise et le sud. Chaque siecle a depose sa couche de gravats, de terre et de debris, enfouissant progressivement la ville antique sous la ville medievale.",
        "location": {"lat": 48.1975, "lng": 3.2830, "label": "Place Drapes --- chaussee romaine a 2m50"},
        "sources": ["Bulletin SAS, vol. VIII, 1863, p. 4-5 (rapport Carre)."],
        "heritageItemId": None,
    }),
    ("III", {
        "year": 1234,
        "title": "Le festin du mariage de Saint Louis : 8 500 livres et des troubadours",
        "text": "Le 27 mai 1234, le mariage de Saint Louis et Marguerite de Provence dans la cathedrale de Sens est une fete somptueuse. Des troubadours provencaux animent le cortege. A chaque pause de la messe, trompettes et clairons font retentir les voutes. Le festin coute 8 500 livres --- une fortune colossale. Un autel dans la cathedrale marque encore l'emplacement exact de la benediction nuptiale par l'archeveque Gaultier Cornu.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- mariage de Saint Louis"},
        "sources": ["Bulletin SAS, vol. VIII, 1863, p. 281-294 (recit de la ceremonie)."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    ("III", {
        "year": 1200,
        "title": "9 confreries de metiers : chaque artisan a son saint patron",
        "text": "Au Moyen Age, chaque metier a son saint patron et sa confrerie. Les cordonniers et tanneurs prient saint Crespin. Les vignerons prient saint Vincent. Les boulangers prient saint Honore. Les orfevres et serruriers prient saint Eloi. Les charpentiers prient saint Joseph. Ces associations protegent les artisans, organisent leurs funerailles, financent leurs fetes. A Ligny pres de Sens, on en compte 9 --- un modele repandu dans tout le Senonais.",
        "location": {"lat": 48.1960, "lng": 3.2830, "label": "Quartier des corporations"},
        "sources": ["Bulletin SAS, vol. VIII, 1863, p. 96-98 (confreries de Ligny)."],
        "heritageItemId": None,
    }),
    # SAS 1877
    ("IV", {
        "year": 1558,
        "title": "Jean Cousin chez le notaire : un acte de 1558 avec sa femme Christine Rousseau",
        "text": "En 1558, un acte notarie de Sens mentionne 'maistre Jehan Cousin, painctre, demeurant a Paris' comme temoin avec sa femme Christine Rousseau. C'est l'un des rares documents d'etat civil du celebre peintre. Les historiens de la SAS appellent a fouiller les archives notariales senonaises pour percer le mystere de cette vie. En 1877, ils ne savent toujours pas quand Cousin est ne exactement, ni combien de fois il s'est marie.",
        "location": {"lat": 48.1965, "lng": 3.2830, "label": "Etude notariale --- Jean Cousin"},
        "sources": ["Bulletin SAS, vol. XI, 1877, p. 102-107 (acte Herardin-Thomyn, 1558)."],
        "heritageItemId": "e5555555-0017-0017-0017-000000000017",
    }),
    ("IV", {
        "year": 1556,
        "title": "15 voleurs forcent 10 serrures : le vol du tresor de Saint-Pierre-le-Vif",
        "text": "En septembre 1556, une bande de 15 voleurs force 10 serrures de l'eglise Saint-Pierre-le-Vif et vole des suaires sacres et des reliquaires d'argent. Ils ne parviennent pas a penetrer la salle du tresor principal. L'eglise conservait la chasse de saint Savinien, offerte par le roi Robert le Pieux vers l'an 1000, en or et argent. Les etoffes de soie a animaux fantastiques qui subsistent pourraient remonter au IXe siecle.",
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- vol du tresor"},
        "sources": ["Bulletin SAS, vol. XI, 1877, p. 115-121, 136-137 (inventaire Cottron 1660)."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),
    ("I", {
        "year": 613,
        "title": "Pons Syriacus : le pont des marchands syriens",
        "text": "En 613, Pont-sur-Yonne s'appelle 'Pons Syriacus' --- le pont des Syriens. Ces marchands orientaux, installes en Gaule depuis l'Antiquite tardive, dominaient le commerce international. Leur nom colle au pont pendant des siecles. En 1175, le Chapitre de Sens fait construire un pont en dur qui ruine les bateliers et leur bac. En 1214, on installe des moulins sous les arches. En 1420, les Anglais detruisent les fortifications.",
        "location": {"lat": 48.1700, "lng": 3.2500, "label": "Pont-sur-Yonne --- Pons Syriacus"},
        "sources": ["Bulletin SAS, vol. XI, 1877, p. 141-143."],
        "heritageItemId": None,
    }),
    ("III", {
        "year": 1242,
        "title": "Le rup de Mondereau : un canal medieval a double usage",
        "text": "Un canal medieval, le rup de Mondereau, detourne l'eau de la Vanne pour alimenter les moulins, laver les rues et approvisionner les tanneries. En 1575, un reglement oblige les tanneurs a construire des murs pour empecher leurs peaux de bloquer le courant. Ce canal, qui date au moins du XIIIe siecle, servait aussi a remplir les fosses defensifs autour des remparts --- une double fonction, economique et militaire, typique des villes medievales.",
        "location": {"lat": 48.1925, "lng": 3.2810, "label": "Rup de Mondereau --- canal medieval"},
        "sources": ["Bulletin SAS, vol. XI, 1877, p. 219-234."],
        "heritageItemId": None,
    }),
    ("I", {
        "year": 200,
        "title": "Marcus Magilius Honoratus : un Senonais pretre a l'autel de Lyon",
        "text": "En demolissant un morceau du mur d'enceinte pres de la porte Dauphine, on decouvre en 1872 un bloc grave 'OS FVNCTO FRATRI.' L'archeologue Julliot reconnait le fragment manquant d'un grand monument funeraire romain : celui de Marcus Magilius Honoratus, pretre senonais au celebre autel de Lyon, et de 5 membres de sa famille. Les Senonais occupaient des postes importants dans la Gaule romaine --- ce n'etait pas un peuple de paysans.",
        "location": {"lat": 48.1960, "lng": 3.2870, "label": "Porte Dauphine --- monument Magilius"},
        "sources": ["Bulletin SAS, vol. XI, 1877, p. 150-151 (identification Julliot)."],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014",
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
print(f"+{added} evenements (SAS 1863 + 1877)")
print(f"Total: {total} evenements, {total_chars/1000:.0f}K chars")
for ch in data["chapters"]:
    print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")
