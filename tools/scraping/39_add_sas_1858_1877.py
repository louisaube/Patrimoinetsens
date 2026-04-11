#!/usr/bin/env python3
"""Ajoute les trouvailles des SAS 1858 (tome VI) et 1877 (tome XI)."""
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

SRC_1858 = "Bulletin SAS, tome VI, 1858"
SRC_1877 = "Bulletin SAS, tome XI, 1877"

new_events = [
    # ─── SAS 1858 ───────────────────────────────────────────────

    # Garnier des Pres et son tresor cache
    ("III", {
        "year": 1208,
        "title": "Garnier des Pres fonde un hopital pour les pelerins des croisades",
        "text": (
            "Vers 1208, un riche bourgeois de Sens nomme Garnier des Pres fonde le "
            "Petit Hotel-Dieu, destine aux pelerins malades revenant de Terre Sainte. "
            "Il dote l'hopital de vignes pres d'Auxerre, d'une chapelle Saint-Jacques "
            "et d'un cimetiere. Surtout, il cache un tresor d'or et d'argent dans un "
            "pilier, avec un billet : 'Si l'hopital est detruit, cet argent servira a "
            "le rebatir.' Prevoyance inutile : en 1358, quand le regent fait demolir "
            "les batiments hors les murs, le gouverneur militaire confisque le tresor "
            "pour la guerre. Le fondateur avait prevu la catastrophe --- pas le vol."
        ),
        "location": {"lat": 48.1960, "lng": 3.2815, "label": "Petit Hotel-Dieu --- tresor de Garnier des Pres"},
        "sources": [SRC_1858 + ", p. 25-28."],
        "heritageItemId": None,
    }),

    # Prisonniers espagnols apres Rocroi
    ("V", {
        "year": 1643,
        "title": "Apres Rocroi, des prisonniers espagnols meurent en masse a Sens",
        "text": (
            "Apres la victoire de Conde a Rocroi (1643), un grand nombre de prisonniers "
            "espagnols sont envoyes a Sens et entasses dans le Petit Hotel-Dieu. Pendant "
            "18 mois, la mort fait des ravages. Le fossoyeur reclame une augmentation : "
            "un sou supplementaire par tombe d'Espagnol. Le fermier des lieux exige une "
            "compensation pour son bail perturbe. Sens decouvre l'economie sinistre de "
            "la detention de masse --- on negocie le prix de chaque cadavre."
        ),
        "location": {"lat": 48.1960, "lng": 3.2815, "label": "Hotel-Dieu --- prisonniers espagnols"},
        "sources": [SRC_1858 + ", p. 32."],
        "heritageItemId": None,
    }),

    # Mademoiselle de Marsangy et les orphelines
    ("V", {
        "year": 1680,
        "title": "Une femme seule recueille les orphelines de Sens dans sa propre maison",
        "text": (
            "Avant tout orphelinat officiel, Mademoiselle Cecile-Guillaume de Marsangy, "
            "emue par la misere des filles orphelines de Sens, commence a les recueillir "
            "chez elle. Elle les nourrit, les habille, leur apprend un metier. Un bourgeois "
            "parisien ne a Sens, Nicolas Bellocier, la rejoint. Ensemble ils fondent en "
            "1680 l'Hospice des Orphelines, avec lettres patentes de Louis XIV. Detail "
            "etonnant : la fondation est explicitement 'laique et nullement ecclesiastique' "
            "--- progressisme inattendu sous le Roi-Soleil."
        ),
        "location": {"lat": 48.1970, "lng": 3.2830, "label": "Hospice des Orphelines --- Marsangy"},
        "sources": [SRC_1858 + ", p. 34-35."],
        "heritageItemId": None,
    }),

    # Effondrement agricole 1560-1620
    ("IV", {
        "year": 1590,
        "title": "La catastrophe agricole : Sens perd 91% de sa production en 60 ans",
        "text": (
            "Les archives des baux de l'Hotel-Dieu revelent un effondrement agricole "
            "vertigineux. La ferme de Sergines, qui rapportait 525 francs en 1560, n'en "
            "produit plus que 48 en 1620 --- une chute de 91%. Villeroy passe de 2 468 a "
            "588 francs. En 1560, les fermes produisaient du ble pur ; en 1620, seulement "
            "du meteil ou du seigle. La cause : les guerres de Religion et le siege de "
            "Sens (1590). Le niveau de production de 1560 ne sera retrouve qu'en 1850 --- "
            "trois siecles pour se relever."
        ),
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Senonais --- effondrement agricole"},
        "sources": [SRC_1858 + ", p. 153-161."],
        "heritageItemId": None,
    }),

    # Le proverbe "le battu paie l'amende"
    ("III", {
        "year": 1155,
        "title": "'Le battu paie l'amende' : un proverbe ne dans le bailliage de Sens",
        "text": (
            "Le proverbe 'le battu paie l'amende' vient des Coutumes de Lorris, qui "
            "relevent du bailliage de Sens. La charte de Louis VII (vers 1155) prevoit "
            "que lors d'un duel judiciaire ('gages de bataille'), le perdant --- vaincu "
            "donc presume coupable par le 'jugement de Dieu' --- paie non seulement les "
            "dommages mais aussi l'amende pour 'folle enchere'. Le battu paie toujours. "
            "Le dicton a survecu a l'abolition du duel judiciaire pour devenir un proverbe "
            "sur la malchance des plaignants."
        ),
        "location": {"lat": 48.1968, "lng": 3.2850, "label": "Bailliage de Sens --- Coutumes de Lorris"},
        "sources": [SRC_1858 + ", p. 52-57."],
        "heritageItemId": None,
    }),

    # Montacher : 18 ans de logement militaire
    ("V", {
        "year": 1651,
        "title": "Montacher devastee : 18 ans de regiments qui mangent tout et brulent les puits",
        "text": (
            "Le cahier de doleances de Montacher (bailliage de Sens, 1651) dresse un "
            "inventaire accablant. Pendant 18 ans, regiment apres regiment --- Gransee, "
            "Nonante, Lambertye, Casteneno --- 'vivent a discretion' : ils mangent tout, "
            "battent les habitants, enfoncent les portes, remplissent les puits de bois "
            "et y mettent le feu, decouvrent les toits. Un capitaine nomme La Patiniere "
            "extorque 400 livres en menacant de rester 15 jours. Le sel est passe de 24 "
            "a 40 livres le minot. Les habitants signent : 'contraints de quitter et "
            "abandonner leurs maisons, et maudire leur pauvre vie.'"
        ),
        "location": {"lat": 48.2200, "lng": 3.2400, "label": "Montacher --- devastation militaire"},
        "sources": [SRC_1858 + ", p. 92-98."],
        "heritageItemId": None,
    }),

    # Les suaires antiques de la cathedrale
    ("II", {
        "year": 708,
        "title": "Les suaires de la cathedrale : des tissus romains du IVe siecle enveloppent des saints",
        "text": (
            "Le tresor de la cathedrale conserve des suaires enveloppant les reliques des "
            "saints. Celui des Saints Innocents, rapporte de Jerusalem par l'eveque Ursicin "
            "(exile en Phrygie avec saint Hilaire de Poitiers au IVe siecle), montre encore "
            "des medaillons et des motifs 'tete de clou' typiques du tissu imperial romain. "
            "Celui de saint Victor, soldat de la Legion thebaine massacre sous Maximien, "
            "represente un soldat devore par deux lions --- imagerie faite pour un legionnaire "
            "martyr. L'eveque Vilquier rapporte ces reliques d'Agaune vers 708. Ce sont les "
            "plus anciens textiles de Sens."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Tresor de la cathedrale --- suaires antiques"},
        "sources": [SRC_1858 + ", p. 9-11."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),

    # Pierre de Corbeil et l'Office des Fous
    ("III", {
        "year": 1200,
        "title": "L'Office des Fous de Sens : Pierre de Corbeil n'a rien compose, il a rapporte de Rome",
        "text": (
            "Le celebre manuscrit de la 'Fete des Fous' conserve a Sens, avec la 'Prose "
            "de l'Ane', est attribue depuis des siecles a l'archeveque Pierre de Corbeil "
            "(mort en 1222). L'analyse musicale du bulletin SAS demontre que c'est faux : "
            "les melodies tournent timidement autour de la tonique dans un intervalle de "
            "quarte ou de quinte, et utilisent la notation 'a six points' --- bien anterieure "
            "a Guido d'Arezzo (XIe siecle). Corbeil n'a pas compose l'office : il l'a "
            "rapporte de Rome et institue dans son diocese. Sens conserve la musique, pas "
            "l'auteur."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- Office des Fous"},
        "sources": [SRC_1858 + ", p. 58-70."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),

    # ─── SAS 1877 ───────────────────────────────────────────────

    # Vol du tresor de Saint-Pierre-le-Vif
    ("IV", {
        "year": 1556,
        "title": "15 voleurs forcent 10 serrures de Saint-Pierre-le-Vif et volent les suaires saints",
        "text": (
            "Le 11 septembre 1556, 15 ou 16 voleurs forcent dix serrures de l'eglise "
            "Saint-Pierre-le-Vif et derobent les suaires de saint Savinien et saint "
            "Potentien, une croix d'argent et le baton pastoral. Quatre jours plus tard, "
            "un vigneron de la Chapelle-sur-Oreuse, Jacques Ruolle, retrouve les suaires "
            "abandonnes dans un provin --- l'argent de la croix avait ete arrache. Les "
            "reliques sont rapportees en procession sous un grand concours de peuple. Les "
            "voleurs voulaient l'argent, pas les saints."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- vol des reliques 1556"},
        "sources": [SRC_1877 + ", p. 139."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),

    # Naufrage du 76e de ligne a Pont-sur-Yonne
    ("VIa", {
        "year": 1815,
        "title": "46 soldats noyes a Pont-sur-Yonne : le naufrage du 76e de ligne",
        "text": (
            "Le 21 mars 1815, a 4 heures du matin, un bateau transportant le 2e bataillon "
            "du 76e de ligne se jette sur des pieux a fleur d'eau a la tete du pont de "
            "Pont-sur-Yonne. Les mariniers se sauvent en abandonnant les soldats. Le maire, "
            "reveille en urgence, organise les secours avec des bachots. A l'appel : le "
            "commandant du bataillon, quatre officiers et quarante-et-un soldats manquent "
            "--- noyes. On ne retrouve que deux grenadiers en chemise sur la berge."
        ),
        "location": {"lat": 48.2870, "lng": 3.2300, "label": "Pont-sur-Yonne --- naufrage du 76e"},
        "sources": [SRC_1877 + ", p. 147-148."],
        "heritageItemId": None,
    }),

    # Le roi Robert et la chasse d'Odoranne
    ("III", {
        "year": 1020,
        "title": "Le roi Robert le Pieux finance en or la plus belle chasse de Sens",
        "text": (
            "Vers 1020, le moine Odoranne de Saint-Pierre-le-Vif --- chroniqueur, artiste "
            "et musicien --- fabrique une chasse extraordinaire pour saint Savinien. Le roi "
            "Robert le Pieux fournit 4 livres et 107 sous d'argent, plus 8 onces d'or. "
            "La face anterieure, entierement en or, est ornee de pierres precieuses et "
            "d'agates 'hors de prix' --- dont une portant l'image de Constantin, une autre "
            "celle du roi Robert. La face posterieure, en argent, represente le martyre de "
            "saint Savinien en demi-relief. Chef-d'oeuvre d'orfevrerie du XIe siecle, "
            "disparu depuis."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- chasse d'Odoranne"},
        "sources": [SRC_1877 + ", p. 136-137."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),

    # Le pape envoie son nonce a Sens
    ("V", {
        "year": 1628,
        "title": "Le pape envoie son nonce a Sens pour un fragment du crane de Gregoire le Grand",
        "text": (
            "En 1628, le pape Urbain VIII desire obtenir un fragment du crane de saint "
            "Gregoire le Grand, conserve depuis le IXe siecle a Saint-Pierre-le-Vif. Il "
            "depeche son nonce en France, Spada (futur cardinal), avec un bref pour "
            "l'archeveque Bellegarde. Le 6 decembre, un fragment est detache et remis au "
            "nonce. Le pape l'offre aux peres de l'Oratoire de Rome (Chiesa Nuova). Que "
            "le pape envoie son ambassadeur dans une ville de province pour une relique "
            "dit tout du prestige de Sens."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- relique papale"},
        "sources": [SRC_1877 + ", p. 126."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),

    # Philippe Hodoard fonde le college
    ("IV", {
        "year": 1537,
        "title": "Philippe Hodoard, 80 ans, fonde le college de Sens avec ses propres deniers",
        "text": (
            "Le 12 juin 1537, Philippe Hodoard, chanoine et grand penitencier de la "
            "cathedrale, fonde a 80 ans un college 'pour jeunes et petis enffans estudians "
            "en la ville de Sens'. La ville est si pauvre apres les guerres du XVe siecle "
            "que les maitres d'ecole ont deserte, faute de pouvoir payer leur loyer. Le "
            "college, rue de la Parcheminerie (actuelle rue Thenard), deviendra le lycee "
            "actuel. Un vieil homme de 80 ans plante le grain de seneve qui donnera un arbre."
        ),
        "location": {"lat": 48.1985, "lng": 3.2870, "label": "Rue Thenard --- college Hodoard"},
        "sources": [SRC_1877 + ", p. 166-195."],
        "heritageItemId": None,
    }),

    # Mazarin a Pont-sur-Yonne
    ("V", {
        "year": 1653,
        "title": "Mazarin fuyant la Fronde ecrit depuis Pont-sur-Yonne : 'On vend ma bibliotheque'",
        "text": (
            "Le 11 janvier 1653, Mazarin en fuite passe a Pont-sur-Yonne et y redige des "
            "notes autographes ameres. Il apprend que le Parlement de Paris a ordonne la "
            "vente de sa celebre bibliotheque --- qu'il avait mis trente ans a enrichir des "
            "'plus rares livres du monde' et qu'il voulait offrir au public. Les deniers "
            "de la vente doivent servir 'pour assassiner le Cardinal'. Ces notes, ecrites "
            "a Pont-sur-Yonne, sont un document exceptionnel sur la Fronde."
        ),
        "location": {"lat": 48.2870, "lng": 3.2300, "label": "Pont-sur-Yonne --- Mazarin en fuite"},
        "sources": [SRC_1877 + ", p. 145."],
        "heritageItemId": None,
    }),

    # 600 Senonais armes rompent le pont
    ("V", {
        "year": 1653,
        "title": "600 Senonais armes de canons marchent detruire le pont de Pont-sur-Yonne",
        "text": (
            "En 1653, pour empecher le prince de Conde de passer du Gatinais en Brie, "
            "les habitants de Sens recoivent l'ordre de rompre le pont de Pont-sur-Yonne. "
            "Cinq a six cents Senonais partent 'bien armes, suivis de vivandiers comme a "
            "l'armee', avec deux pieces de canon de la ville. Ils demolissent le pont. "
            "Pour le reconstruire, Pont-sur-Yonne demande la demolition de la grosse tour "
            "de Sens (manoir des comtes) --- le bailli s'y oppose. La Fronde transforme "
            "les bourgeois en soldats."
        ),
        "location": {"lat": 48.2870, "lng": 3.2300, "label": "Pont-sur-Yonne --- pont detruit 1653"},
        "sources": [SRC_1877 + ", p. 145."],
        "heritageItemId": None,
    }),

    # Le monopole scolaire du prechantre
    ("III", {
        "year": 1176,
        "title": "Personne ne peut ouvrir une ecole a Sens sans la permission du prechantre",
        "text": (
            "Une charte de l'archeveque Guillaume de Champagne (vers 1176) confirme que "
            "nul ne peut ouvrir une ecole de grammaire, de chant ou de psautier a Sens "
            "sans la licence du prechantre de la cathedrale. Ce monopole s'etend a Joigny, "
            "Courtenay, Montereau, Bray et Pont-sur-Yonne --- tout le diocese. L'Eglise "
            "controle l'education, et le prechantre est le recteur de fait d'une academie "
            "qui couvre la moitie de l'Yonne actuelle."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- monopole scolaire"},
        "sources": [SRC_1877 + ", p. 203-204."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),

    # Cimetiere gallo-romain decouvert par le chemin de fer
    ("I", {
        "year": 1872,
        "title": "Le chemin de fer Orleans-Chalons deterre 150 squelettes gallo-romains",
        "text": (
            "En 1872, les travaux de la ligne Orleans-Chalons, au pied de Saint-Martin-du-"
            "Tertre, mettent au jour un cimetiere gallo-romain : 150 squelettes, des vases "
            "de toutes formes, des lampes. La Societe Archeologique n'est prevenue que trop "
            "tard pour constater l'etat des sepultures --- les terrassiers du chemin de fer "
            "ont tout bouleverse. Perte scientifique irreparable, symptomatique du XIXe "
            "siecle : on construit plus vite qu'on ne fouille."
        ),
        "location": {"lat": 48.2100, "lng": 3.2900, "label": "Saint-Martin-du-Tertre --- necropole"},
        "sources": [SRC_1877 + ", p. 161-163."],
        "heritageItemId": None,
    }),

    # Marcus Magilius Honoratus, pretre a l'autel de Lyon
    ("I", {
        "year": 150,
        "title": "Un pretre senonais au sommet du culte imperial de Lyon",
        "text": (
            "Une inscription romaine reconstituee piece par piece revele Marcus Magilius "
            "Honoratus, pretre senonais officiant a l'autel des Trois Gaules a Lyon --- le "
            "centre du culte imperial. Un fragment trouve en 1872 dans le mur d'enceinte "
            "pres de la Porte Dauphine ('OS FVNCTO FRATRI') permet de comprendre que M. "
            "Aemilius Nobilius etait son frere. Il manque encore des pierres sur 2,23 m "
            "pour completer le puzzle. Un Senonais au sommet de la hierarchie religieuse "
            "de la Gaule romaine."
        ),
        "location": {"lat": 48.1970, "lng": 3.2850, "label": "Porte Dauphine --- inscription Magilius"},
        "sources": [SRC_1877 + ", p. 150-151."],
        "heritageItemId": None,
    }),

    # Incendie de Saint-Pierre-le-Vif 1632
    ("V", {
        "year": 1632,
        "title": "Saint-Pierre-le-Vif brule : les reliques survivent dans la grotte souterraine",
        "text": (
            "Le 6 juin 1632, un incendie ravage l'eglise de Saint-Pierre-le-Vif. Mais "
            "les reliques les plus precieuses survivent : elles etaient conservees dans "
            "la grotte de saint Potentien, sous le grand autel, a l'abri des flammes. "
            "Cette crypte souterraine, vestige du premier christianisme senonais, sauve "
            "ce que le feu aurait detruit. Les moines reconstruisent, le tresor est intact."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- incendie 1632"},
        "sources": [SRC_1877 + ", p. 119."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),

    # Sainte Theodechilde retrouvee
    ("II", {
        "year": 1643,
        "title": "Le corps de sainte Theodechilde, fille de Clovis, retrouve dans un cercueil de plomb",
        "text": (
            "Le 16 octobre 1643, l'archeveque Bellegarde fait ouvrir les fouilles sous "
            "le grand autel de Saint-Pierre-le-Vif. On decouvre une caisse de plomb "
            "contenant le corps de sainte Theodechilde, fille de Clovis Ier et fondatrice "
            "de l'abbaye. La princesse merovingienne, morte vers 570, avait ete ensevelie "
            "dans l'eglise qu'elle avait fondee. Mille ans apres, on la retrouve."
        ),
        "location": {"lat": 48.1910, "lng": 3.2830, "label": "Saint-Pierre-le-Vif --- tombeau Theodechilde"},
        "sources": [SRC_1877 + ", p. 121."],
        "heritageItemId": "e5555555-0034-0034-0034-000000000034",
    }),

    # Pont Syrien / marchands syriens
    ("II", {
        "year": 613,
        "title": "Pont-sur-Yonne, le 'Pont Syrien' : une colonie de marchands orientaux sur l'Yonne",
        "text": (
            "Le nom latin de Pont-sur-Yonne, 'Pons Syriacus', suggere qu'une colonie de "
            "marchands syriens s'y etait installee. Au VIe-VIIe siecle, les Syri (marchands "
            "orientaux, souvent juifs ou chretiens de Syrie) sont les principaux negociants "
            "de la Gaule merovingienne. Ils controlent le commerce du vin, des epices et "
            "des tissus precieux. Un pont commercial syrien sur l'Yonne, en amont de Sens, "
            "confirme l'importance de la route fluviale senonaise dans le commerce "
            "international du Haut Moyen Age."
        ),
        "location": {"lat": 48.2870, "lng": 3.2300, "label": "Pont-sur-Yonne --- Pons Syriacus"},
        "sources": [SRC_1877 + ", p. 141."],
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
print(f"\n+{added} events (SAS 1858 + SAS 1877)")
print(f"Total: {total} events")
for ch in data["chapters"]:
    print(f"  {ch['id']:5} {ch['title'][:45]:45} : {len(ch['events'])}")
