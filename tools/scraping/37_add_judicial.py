#!/usr/bin/env python3
"""Ajoute les chroniques judiciaires + corrige L'Hermite guillotine a Paris."""
import json, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

path = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. CORRIGER L'Hermite : guillotine a PARIS (place du Trone), pas a Sens
for ch in data["chapters"]:
    for ev in ch["events"]:
        if "l'hermite de champbertrand" in ev["title"].lower():
            ev["text"] = (
                "En avril 1793, 49 pretres sont arretes a Sens. Trois restent detenus : "
                "Mgr L'Hermite de Champbertrand, le chanoine Seguier et le chanoine Roger. "
                "Transfores a Paris, juges pour 'intelligence avec l'ennemi', ils sont "
                "guillotines place du Trone (actuelle place de la Nation). Ironie cruelle : "
                "la famille L'Hermite, seigneurs du domaine de Champbertrand (la grande ferme "
                "au sud de Sens), etait deja ruinee AVANT la Revolution. Ils avaient vendu la "
                "propriete aux Leblanc-Duvernoy. Le prelat guillotine ne possede meme plus sa "
                "terre --- il garde le nom, mais pas le domaine."
            )
            ev["location"] = {"lat": 48.8484, "lng": 2.3956, "label": "Paris, place du Trone --- guillotine"}
            print("  CORRIGE: L'Hermite guillotine a Paris, pas a Sens")

# 2. CORRIGER les Templiers : brules a PARIS, pas a Sens
for ch in data["chapters"]:
    for ev in ch["events"]:
        if "templier" in ev["title"].lower() and ev["year"] == 1310:
            if "pres de la porte de paris" in ev["text"].lower() or "champ" in ev["text"].lower():
                ev["text"] = (
                    "Le concile provincial de Sens se reunit en mai 1310. L'archeveque "
                    "Philippe de Marigny --- demi-frere d'Enguerrand de Marigny, tout-puissant "
                    "conseiller du roi --- condamne 54 Templiers comme relaps. Ces hommes avaient "
                    "d'abord avoue sous la torture, puis s'etaient retractes pour defendre leur "
                    "ordre. En revenant sur leurs aveux, ils deviennent 'relaps' (retombes dans "
                    "l'heresie) --- peine de mort automatique. Ils sont brules vifs devant l'abbaye "
                    "Saint-Antoine a Paris. Ce massacre judiciaire brise la defense de l'Ordre : "
                    "plus personne n'ose se retracter."
                )
                print("  CORRIGE: Templiers brules a Paris (pas a Sens)")

existing = set()
for ch in data["chapters"]:
    for ev in ch["events"]:
        existing.add(ev["title"].lower()[:50])

new_events = [
    # Brasillach
    ("VII", {
        "year": 1918,
        "title": "Le jeune Brasillach arrive a Sens : son professeur s'appelle Gabriel Marcel",
        "text": (
            "En mars 1918, la famille Brasillach s'installe a Sens. Le jeune Robert fait ses "
            "etudes au lycee de la rue Thenard. Son professeur de philosophie n'est autre que "
            "Gabriel Marcel --- le futur grand philosophe existentialiste. A 18 ans, en 1927, "
            "Brasillach publie un roman-feuilleton sous pseudonyme dans La Tribune de l'Yonne "
            "(49 episodes). Il deviendra redacteur en chef de Je suis partout, journal fasciste "
            "et collaborationniste. Fusille le 6 fevrier 1945. De Gaulle refuse la grace malgre "
            "une petition signee par Camus, Valery et Claudel. Un enfant de Sens devenu l'un "
            "des ecrivains les plus controverses du XXe siecle."
        ),
        "location": {"lat": 48.1985, "lng": 3.2870, "label": "Lycee de Sens --- Brasillach eleve de Gabriel Marcel"},
        "sources": [
            "Daguin, G. 'Robert Brasillach.' histoire-sens-senonais-yonne.com.",
            "Wikipedia, Robert Brasillach.",
        ],
        "heritageItemId": None,
    }),
    # Lomenie de Brienne
    ("VI", {
        "year": 1794,
        "title": "Lomenie de Brienne meurt en prison a Sens : l'ancien premier ministre tombe",
        "text": (
            "Le 18 fevrier 1794, Etienne-Charles de Lomenie de Brienne --- ancien premier "
            "ministre de Louis XVI, cardinal, membre de l'Academie francaise --- est arrete a "
            "Sens. Il avait achete l'abbaye Saint-Pierre-le-Vif et s'y etait installe apres "
            "avoir demoli l'eglise. Bien qu'il ait prete serment a la Constitution civile du "
            "clerge et meme renonce a la pretrise, cela ne le sauve pas. Il meurt dans la nuit "
            "meme en prison --- d'une apoplexie, bien que le poison et le suicide aient ete "
            "evoques. Un ancien premier ministre de France meurt dans une prison de Sens."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- mort de Lomenie"},
        "sources": [
            "Wikipedia, Lomenie de Brienne.",
            "Academie francaise, fiche Lomenie.",
            "Daguin, G. histoire-sens-senonais-yonne.com.",
        ],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),
    # Robert le Bougre
    ("III", {
        "year": 1233,
        "title": "Robert le Bougre : l'inquisiteur fou dont les archeveques de Sens se plaignent",
        "text": (
            "En 1233, Robert le Petit, dit 'le Bougre' --- ancien cathare converti puis devenu "
            "dominicain --- est nomme premier inquisiteur general de France par le pape. Ses "
            "methodes sont effroyables : il agit sans le consentement des eveques, condamne sans "
            "proces equitable. Les archeveques de Sens et de Reims protestent aupres du pape. "
            "Le pape le suspend en 1234, le retablit en 1235. En 1239, a Mont-Aime pres de "
            "Provins, il fait bruler 183 personnes en un seul jour --- le plus grand bucher de "
            "l'histoire de l'Inquisition en France. Il est finalement condamne a la prison perpetuelle."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Archeveche --- protestation contre l'inquisiteur"},
        "sources": [
            "Wikipedia, Robert le Bougre.",
            "Gallica, 'Robert le Bougre, premier inquisiteur.'",
        ],
        "heritageItemId": None,
    }),
    # Vol du tresor gaulois 2012
    ("VII", {
        "year": 2012,
        "title": "Braquage a l'aube : 100 stateres d'or voles au musee de Sens",
        "text": (
            "Le dimanche 17 juin 2012, a 5h30 du matin, trois individus cagoules et gantes "
            "forcent l'entree du musee de Sens, attaquent a la barre de fer la vitrine "
            "securisee, et volent environ 100 monnaies d'or gauloises du tresor de "
            "Saint-Denis-les-Sens (trouve lors des fouilles de l'A5 en 1992). Les pieces, "
            "parfaitement repertoriees, sont theoriquement invendables sur le marche legal. "
            "Valeur estimee : 50 000 a 100 000 euros. Les Senons continuent de faire parler "
            "d'eux 2 100 ans apres Brennus."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Musee de Sens --- vol du tresor gaulois"},
        "sources": [
            "Le Journal des Arts, 'Vol musee de Sens.'",
            "FranceInfo, 'Vol au musee de Sens.'",
        ],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # Petiot a Villeneuve-sur-Yonne
    ("VII", {
        "year": 1921,
        "title": "Le Dr Petiot s'installe a Villeneuve-sur-Yonne : le tueur en serie de l'Yonne",
        "text": (
            "En 1921, Marcel Petiot (ne a Auxerre en 1897) s'installe comme medecin a "
            "Villeneuve-sur-Yonne. Il en est elu maire en 1926, revoque par le prefet en 1934 "
            "pour malversations. A Paris sous l'Occupation, il attire au moins 27 personnes en "
            "leur promettant de les faire fuir vers l'Amerique du Sud --- puis les tue et brule "
            "les corps. Guillotine le 25 mai 1946. Le medecin-maire de Villeneuve-sur-Yonne "
            "etait un tueur en serie."
        ),
        "location": {"lat": 48.0800, "lng": 3.3000, "label": "Villeneuve-sur-Yonne --- Dr Petiot"},
        "sources": ["Wikipedia, Marcel Petiot.", "France 3 BFC, 'Le mystere du Dr Petiot.'"],
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
print(f"+{added} events judiciaires + 2 corrections factuelles")
print(f"Total: {total} events")
for ch in data["chapters"]:
    print(f"  {ch['id']:4} {ch['title'][:40]:40} : {len(ch['events'])}")
