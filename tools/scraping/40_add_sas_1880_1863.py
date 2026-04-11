#!/usr/bin/env python3
"""Ajoute les trouvailles des SAS 1880 (tome XII) et 1863 (tome VIII)."""
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

SRC_1880 = "Bulletin SAS, tome XII, 1880"
SRC_1863 = "Bulletin SAS, tome VIII, 1863"

new_events = [
    # ─── SAS 1880 ───────────────────────────────────────────────

    # Sepulture neolithique collective a Villemanoche
    ("0", {
        "year": -3000,
        "title": "Les morts assis en cercle : une sepulture neolithique decouverte a Villemanoche",
        "text": (
            "Le 12 avril 1875, un carrier nomme Grappin casse une dalle de 3 m sur 2,5 m "
            "a Villemanoche, pres de Pont-sur-Yonne. Dessous : une chambre funeraire "
            "creusee dans la craie. Les corps sont assis le dos contre les murs, rayonnant "
            "vers le centre, cranes penches sur les femurs. Silex tailles, grattoirs, une "
            "scie a cinq dents. Le Dr Paul Broca a Paris confirme : crane dolichocephale, "
            "Age de la Pierre Polie. 'Une des plus importantes decouvertes de ce genre.' "
            "Un vigneron du XIXe siecle ouvre un cercle de morts vieux de 5 000 ans."
        ),
        "location": {"lat": 48.2900, "lng": 3.2100, "label": "Villemanoche --- sepulture neolithique"},
        "sources": [SRC_1880 + ", p. 8-14."],
        "heritageItemId": None,
    }),

    # Autel d'Auguste a Sens - monument Thermianus
    ("I", {
        "year": 50,
        "title": "Sens avait son propre autel a Auguste : le monument Thermianus le prouve",
        "text": (
            "L'epigraphiste Julliot reconstitue un monument funeraire monumental : celui "
            "de Sextus Julius Thermianus, pretre a l'autel des Trois Gaules a Lyon ET "
            "flamine augustal a Sens. Cette double pretrise prouve que Sens possedait son "
            "propre temple ou autel dedie a l'empereur divinise. Julliot avance une these "
            "frappante : 'Nos archeveques chretiens sont les successeurs des flamines "
            "paiens' --- chaque flamine augustal d'une capitale provinciale a ete remplace "
            "par un archeveque dans la meme ville."
        ),
        "location": {"lat": 48.1970, "lng": 3.2850, "label": "Sens --- autel d'Auguste, monument Thermianus"},
        "sources": [SRC_1880 + ", p. 22-42."],
        "heritageItemId": None,
    }),

    # Yolande de Flandre emprisonnee dans la Grosse-Tour
    ("IV", {
        "year": 1371,
        "title": "Yolande de Flandre : la comtesse qui emprisonne son fils et finit dans la Grosse-Tour de Sens",
        "text": (
            "Yolande de Flandre, comtesse de Bar et d'Auxerre, a fait emprisonner son "
            "propre fils Robert de 29 ans (marie a Marie de France, fille de Jean le Bon). "
            "Charles V la fait arreter le 25 avril 1371 et enfermer 15 mois dans la "
            "Grosse-Tour de Sens. Elle s'evade du Temple a Paris en septembre 1372, est "
            "rattrapee, et ne retrouve la liberte qu'en octobre 1373 apres avoir supplie "
            "le roi. En 1394, vieille et repentante, elle fonde une chapelle Sainte-Anne "
            "'en supreme reparation des fautes de sa longue vie'."
        ),
        "location": {"lat": 48.1975, "lng": 3.2840, "label": "Grosse-Tour --- Yolande de Flandre prisonniere"},
        "sources": [SRC_1880 + ", p. 61-69."],
        "heritageItemId": None,
    }),

    # Mosaique romaine aux cerfs sous la Grande-Rue
    ("I", {
        "year": 1876,
        "title": "Deux cerfs face a face : une mosaique romaine decouverte sous la Grande-Rue",
        "text": (
            "En novembre 1876, un ouvrier creusant une fosse au 202 Grande-Rue tombe sur "
            "une mosaique a 1,60 m de profondeur. Deux cerfs se font face, broutant les "
            "feuilles d'un vase elegant, entoures de frises de vigne, de grecques et de "
            "torsades en marbre rouge, jaune, noir et blanc. C'est la septieme mosaique "
            "decouverte sous Sens, confirmant la richesse de la ville gallo-romaine. Le "
            "proprietaire veut l'arracher pour l'envoyer chez son petit-fils a la campagne "
            "--- Julliot ne peut que 'regretter'."
        ),
        "location": {"lat": 48.1975, "lng": 3.2840, "label": "202 Grande-Rue --- mosaique aux cerfs"},
        "sources": [SRC_1880 + ", p. 225-234."],
        "heritageItemId": None,
    }),

    # L'abbe Bourdelot a Stockholm
    ("V", {
        "year": 1652,
        "title": "L'abbe Bourdelot, ne a Sens, humilie un pedant a la cour de la reine Christine de Suede",
        "text": (
            "Pierre Michon, ne a Sens en 1610, fils de chirurgien, se rebaptise 'Bourdelot' "
            "et devient medecin de la reine Christine de Suede. Lors d'un souper royal avec "
            "Saumaise et Vossius, il joue du clavecin, puis piege le musicologue pedant "
            "Marcus Meibom en le faisant chanter l'Ode Pythique de Pindare pendant que Naude "
            "danse. Le desastre provoque l'eclat de rire de la reine. Bourdelot mourra en "
            "1685 d'une dose accidentelle d'opium melangee a une confiture de roses par son "
            "domestique."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens --- patrie de l'abbe Bourdelot"},
        "sources": [SRC_1880 + ", p. 195-214."],
        "heritageItemId": None,
    }),

    # Premier imprimeur de Sens
    ("IV", {
        "year": 1552,
        "title": "Francois Girault installe la premiere presse a imprimer de Sens",
        "text": (
            "En 1552, Francois Girault installe la premiere imprimerie de Sens, pres de "
            "la chapelle du grand Hotel-Dieu. Sa premiere publication : un antiphonaire "
            "commande par le cardinal Louis de Bourbon, corrige par le chantre Jehan Cousin "
            "(homonyme du peintre). Les livres se vendent chez Jehan de la Mare, Grande-Rue, "
            "'a l'enseigne de l'Aigle d'or'. Trois siecles d'imprimeurs suivront : Richebois, "
            "Prussurot, puis les Tarbe dont la veuve Catherine-Colombe Pigalle dirigera la "
            "presse et mourra a 89 ans avec 51 descendants."
        ),
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Hotel-Dieu --- premiere imprimerie Girault 1552"},
        "sources": [SRC_1880 + ", p. 187-189."],
        "heritageItemId": None,
    }),

    # Sens ville du devoir des compagnons
    ("VIb", {
        "year": 1820,
        "title": "Sens, 'ville du devoir' : tout compagnon menuisier doit y resider pendant son Tour de France",
        "text": (
            "Sens est l'une des sept 'villes du devoir' ou chaque compagnon menuisier "
            "est tenu de resider lors de son Tour de France. De 1815 a 1830, le pere de "
            "l'architecte Louis Lefort y tient une celebre 'ecole de trait' (geometrie "
            "pour artisans) qui attire un nombre 'considerable' de compagnons. Lefort "
            "fils, forme entre 'le rabot et le compas', deviendra l'inspecteur de "
            "Viollet-le-Duc pour la restauration de la Salle Synodale."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Sens --- ville du devoir des compagnons"},
        "sources": [SRC_1880 + ", p. 268-269."],
        "heritageItemId": None,
    }),

    # 1500 rouelles de bronze gauloises
    ("0", {
        "year": -200,
        "title": "1 500 petites roues de bronze gauloises : pas des monnaies, mais des accessoires de ceinture",
        "text": (
            "Un tresor de 1 500 rouelles (petites roues de bronze) est decouvert pres de "
            "Sens. Pendant des annees, on les prend pour de la monnaie gauloise. L'analyse "
            "de Perot demontre que ce sont des anneaux de ceinture pour suspendre cles, "
            "ciseaux et outils --- exactement comme les femmes russes et lapones portent "
            "encore a l'Exposition universelle de Paris en 1867. La vie quotidienne des "
            "Gaulois, eclairee par l'ethnographie vivante."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Senonais --- tresor de rouelles gauloises"},
        "sources": [SRC_1880 + ", p. 75-78."],
        "heritageItemId": None,
    }),

    # ─── SAS 1863 ───────────────────────────────────────────────

    # Chaussee romaine sous la Place Drapes
    ("I", {
        "year": 100,
        "title": "Une chaussee romaine a 2,50 m sous la Place Drapes : le sol de Sens a monte de 3 metres",
        "text": (
            "Vers 1860, en creusant des fondations a l'angle de la Place Drapes, des "
            "ouvriers tombent sur une chaussee romaine a 2,50 m de profondeur. Sept voies "
            "romaines rayonnaient depuis Sens, convergeant au bout de la rue Saint-Martin "
            "sur la rive gauche. Cette decouverte prouve que le sol de la vallee de l'Yonne "
            "s'est eleve de pres de 3 metres depuis l'Antiquite : la Sens romaine git "
            "ensevelie sous la Sens moderne."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Place Drapes --- chaussee romaine a -2,50 m"},
        "sources": [SRC_1863 + ", p. 5."],
        "heritageItemId": None,
    }),

    # Mathilde de Courtenay "la Grande"
    ("III", {
        "year": 1223,
        "title": "Mathilde de Courtenay, 'la Grande' : une femme gouverne seule et libere les serfs",
        "text": (
            "A la mort du comte Herve en 1222, Mathilde de Courtenay, veuve avec une jeune "
            "fille, gouverne seule les vastes comtes d'Auxerre et de Tonnerre. Sa sagesse "
            "et sa generosite lui valent le surnom de 'Mathilde-la-Grande'. Le 1er aout 1223, "
            "depuis Ligny, elle promulgue une charte liberant tous les serfs restants d'Auxerre. "
            "Exemple rare de gouvernance feminine autonome dans la France du XIIIe siecle."
        ),
        "location": {"lat": 47.9000, "lng": 3.7500, "label": "Ligny-le-Chatel --- Mathilde la Grande"},
        "sources": [SRC_1863 + ", p. 158."],
        "heritageItemId": None,
    }),

    # Le mariage de Saint Louis (enrichissement de l'event existant? Verifions)
    ("III", {
        "year": 1234,
        "title": "Le mariage de Saint Louis a Sens : troubadours, deux cuilleres d'or et 20 000 ecus",
        "text": (
            "Le 26 mai 1234, Louis IX epouse Marguerite de Provence dans la cathedrale "
            "de Sens. Le cortege : le maire, les 12 Pairs et 28 Jures de la Commune sur "
            "des mules, l'archeveque Gaultier Cornu, des troubadours provencaux, la reine "
            "en robe de soie et or brodee de fleurs de lys. Au banquet, un luxe inouï : "
            "deux cuilleres et une coupe en or. La dot est de 20 000 ecus (2,3 millions "
            "de francs de 1863), dont un cinquieme seulement sera jamais paye."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- mariage de Saint Louis"},
        "sources": [SRC_1863 + ", p. 287-294."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),

    # Reine Marguerite sauve la croisade
    ("III", {
        "year": 1250,
        "title": "La reine Marguerite, mariee a Sens, sauve la croisade depuis son lit d'accouchee",
        "text": (
            "Pendant la captivite de Saint Louis en Egypte, sa femme Marguerite de "
            "Provence --- mariee a Sens en 1234 --- vient d'accoucher a Damiette. Elle "
            "apprend que les marins pisans et genois veulent fuir en abandonnant le roi "
            "prisonnier. Depuis son lit, elle fait acheter toute la nourriture disponible "
            "et nourrit la garnison entiere aux frais du roi. Son courage empeche "
            "l'effondrement de la croisade. Elle nomme son nouveau-ne 'Tristan' (tristesse) "
            "car il est ne dans le chagrin."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- souvenir de Marguerite de Provence"},
        "sources": [SRC_1863 + ", p. 298."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),

    # Jean de la Baume attaque Pontigny
    ("IV", {
        "year": 1527,
        "title": "Le seigneur de Ligny attaque l'abbaye de Pontigny avec 300 hommes armes",
        "text": (
            "Jean de la Baume, vicomte de Ligny, furieux que Pontigny refuse de le "
            "reconnaitre comme protecteur, rassemble 300 hommes armes, force les portes "
            "du monastere et le pille. Ses hommes demolissent le barrage pour couper l'eau. "
            "Apres six ans de proces de Sens a Paris, le Parlement le condamne : 2 000 livres "
            "d'amende au roi, 1 000 livres aux moines, 1 000 livres pour de nouveaux ornements "
            "d'eglise. Un seigneur qui detruit ce qu'il pretendait proteger."
        ),
        "location": {"lat": 47.9100, "lng": 3.7200, "label": "Pontigny --- attaque du vicomte de Ligny"},
        "sources": [SRC_1863 + ", p. 225-229."],
        "heritageItemId": None,
    }),

    # Evasion de la Bastille
    ("IV", {
        "year": 1593,
        "title": "Le vicomte de Ligny s'evade de la Bastille par la corde et les douves",
        "text": (
            "Jean de Saulx, vicomte de Ligny, ligueur feroce, est emprisonne a la Bastille "
            "par Henri IV. Un page lui fait passer du fil et une lime. Il tisse une corde, "
            "scie un barreau, et s'evade a travers les douves, de l'eau jusqu'au cou. "
            "Il attribue son evasion a Dieu, fait la paix, et rallie Henri IV en 1595 apres "
            "l'absolution du pape. L'un des rares evades de la Bastille --- et il vient du "
            "Senonais."
        ),
        "location": {"lat": 48.8533, "lng": 2.3692, "label": "Bastille --- evasion du vicomte de Ligny"},
        "sources": [SRC_1863 + ", p. 246."],
        "heritageItemId": None,
    }),

    # Grandes Compagnies ranconnent Ligny
    ("IV", {
        "year": 1359,
        "title": "Les Grandes Compagnies exigent 26 000 moutons d'or : Ligny ranconnee jusqu'a l'os",
        "text": (
            "Apres la bataille de Poitiers (1356), des bandes de routiers envahissent le "
            "Senonais et se fortifient a Saint-Florentin. Les habitants de Ligny sont "
            "massacres, fuient ou meurent de faim dans des souterrains. Les survivants "
            "doivent payer 26 000 moutons d'or pour obtenir le depart des brigands. "
            "Dix-neuf chevaliers se portent garants, quatre se livrent en otages. Le "
            "traite prevoit un sauf-conduit jusqu'a Nogent-le-Rotrou."
        ),
        "location": {"lat": 47.9000, "lng": 3.7500, "label": "Ligny-le-Chatel --- rancon des Grandes Compagnies"},
        "sources": [SRC_1863 + ", p. 191-195."],
        "heritageItemId": None,
    }),

    # Henri II decore Gaspard de Saulx au combat
    ("IV", {
        "year": 1554,
        "title": "Henri II ote son propre collier et decore Gaspard de Saulx sur le champ de bataille",
        "text": (
            "A la bataille de Renty contre les Espagnols (1554), Gaspard de Saulx-Tavannes "
            "combat si brillamment qu'Henri II retire de son propre cou le collier de "
            "l'Ordre de Saint-Michel et le lui passe en disant : 'Vous etes un lion, il "
            "faut vous enchainer.' Gaspard deviendra marechal de France, gouverneur de "
            "Provence et amiral des mers du Levant. On l'accusera d'avoir conseille le "
            "massacre de la Saint-Barthelemy. Son fils Jean sera vicomte de Ligny."
        ),
        "location": {"lat": 47.9000, "lng": 3.7500, "label": "Saulx-Tavannes --- lion enchaine"},
        "sources": [SRC_1863 + ", p. 204."],
        "heritageItemId": None,
    }),

    # Bombardement de Sens 1814
    ("VIa", {
        "year": 1814,
        "title": "Les Wurtembergeois canonnent Sens : un boulet retrouve dans un marronnier",
        "text": (
            "En fevrier 1814, pendant la campagne de France, un corps wurtembergeois en "
            "route pour Montereau canonne les vieux murs du college de Sens. La ville tombe "
            "par la trahison d'un habitant --- que le peuple surnomme 'Canaille' --- qui "
            "montre a l'ennemi une porte secrete. Un boulet est retrouve fiche dans le "
            "tronc d'un des marronniers de la promenade, plantes pendant l'hiver 1699-1700. "
            "Ces arbres, abattus vers 1860, ont vu 150 ans de vie senonaise."
        ),
        "location": {"lat": 48.1985, "lng": 3.2870, "label": "College de Sens --- bombardement 1814"},
        "sources": [SRC_1863 + ", p. 277-279."],
        "heritageItemId": None,
    }),
]

added = 0
for ch_id, event in new_events:
    if event["title"].lower()[:50] in existing:
        print(f"  SKIP (existe): {event['title'][:60]}")
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
print(f"\n+{added} events (SAS 1880 + SAS 1863)")
print(f"Total: {total} events")
for ch in data["chapters"]:
    print(f"  {ch['id']:5} {ch['title'][:45]:45} : {len(ch['events'])}")
