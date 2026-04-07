#!/usr/bin/env python3
"""Derniere salve d'evenements : eau, incendies, peste, archeveques, tresor, siege 1420, presse, Mallarme, gallo-romain."""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHAPITRES_PATH = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"

EVENTS = [
    # I — Gallo-romain
    ("I", {
        "year": 150,
        "title": "Un aqueduc de 16 km pour alimenter Agedincum",
        "text": "Au IIe siecle, les Romains construisent un aqueduc de 16 kilometres pour amener l'eau de source depuis la vallee de la Vanne jusqu'a Agedincum. La ville du Haut-Empire s'etend sur 125 hectares --- cinq fois la surface qu'elle occupera au Moyen Age. Elle possede des thermes publics (dont une facade est reconstituee au musee de Sens), un amphitheatre, un forum et au moins 40 steles funeraires sculptees. La Via Agrippa, l'axe majeur Lyon-Boulogne, traverse la ville du nord au sud.",
        "location": {"lat": 48.1977, "lng": 3.2860, "label": "Agedincum --- thermes et forum"},
        "sources": ["Wikipedia, Agedincum (ville romaine).", "agendicum.over-blog.com, reseau routier.", "Musees de Sens, collections archeologiques."],
        "heritageItemId": "e5555555-0050-0050-0050-000000000050",
    }),
    # II — Archeveques + incendie
    ("II", {
        "year": 860,
        "title": "L'archeveque Wenilon reconstruit la cathedrale apres un incendie",
        "text": "En 968, la cathedrale de Sens brule. Ce n'est pas la premiere fois --- la ville medievale, avec ses maisons en bois serrees, est regulierement ravagee par le feu. L'archeveque Wenilon avait deja reconstruit l'edifice au IXe siecle. Chaque incendie force une reconstruction --- qui modernise l'architecture. C'est apres un de ces sinistres que l'archeveque Henri Sanglier lancera, vers 1135, la construction de la cathedrale gothique qu'on connait aujourd'hui.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- incendie et reconstruction"},
        "sources": ["Bourgogne medievale, fiche Sens.", "Leviste, J. La cathedrale de Sens. 1965."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # III — Gauthier Cornut + palais synodal + Sainte Couronne
    ("III", {
        "year": 1239,
        "title": "La Sainte Couronne d'epines passe par Sens",
        "text": "En 1239, l'archeveque Gauthier Cornut (le meme qui fait construire le palais synodal) accueille a Sens la Sainte Couronne d'epines, rachetee a l'empereur de Constantinople par le roi Louis IX. La relique fait etape a Sens avant d'etre transferee a la Sainte-Chapelle de Paris, construite specialement pour l'abriter. Gauthier Cornut est un batisseur : le palais synodal qu'il edifie est une salle gothique de 500 m2 et 12 metres sous plafond, avec un tribunal ecclesiastique au rez-de-chaussee et des cachots pour les prisonniers.",
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Palais synodal --- Gauthier Cornut"},
        "sources": ["Wikipedia, Palais synodal de Sens.", "Brousse, B. 2024.", "Leviste, J. 1965."],
        "heritageItemId": "e5555555-0002-0002-0002-000000000002",
    }),
    # III — Tresor : chape Becket + suaires + chasuble
    ("III", {
        "year": 1170,
        "title": "Le tresor de la cathedrale : de la chasuble du VIIe siecle a la chape de Becket",
        "text": "Le tresor de la cathedrale de Sens est l'un des plus riches de France en textiles anciens. La chasuble de saint Ebbon (VIIe siecle) est l'un des plus vieux vetements liturgiques conserves au monde. Les suaires de saints Siviard, Colombe et Loup proviennent de Perse post-sassanide. Et surtout, les vetements sacerdotaux de Thomas Becket --- refugie a Sens de 1164 a 1170 avant son assassinat a Canterbury --- sont conserves ici depuis neuf siecles. Un coffret d'ivoire islamique, probablement un cadeau diplomatique, rappelle que Sens etait connectee au monde arabo-musulman.",
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- salle du Tresor"},
        "sources": ["Musees de Sens, tresor de la cathedrale.", "Mediatheque du patrimoine, base Palissy.", "Leviste, J. 1965."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    # IV — Siege de Sens 1420
    ("IV", {
        "year": 1420,
        "title": "Le siege de Sens : deux rois, deux reines, quatre ducs",
        "text": "En juin 1420, apres l'assassinat de Jean sans Peur a Montereau (tout pres de Sens), la ville est assiegee par les armees anglaises et bourguignonnes. Devant les murs de Sens : le roi d'Angleterre Henri V, le roi de France Charles VI (desormais son allie), deux reines, quatre ducs. Le sire de Guitry defend la ville pendant 12 jours. Sens capitule le 11 juin 1420. Neuf annees d'occupation anglo-bourguignonne commencent. Les faubourgs sont brules, les abbayes saccagees. Il faudra attendre Jeanne d'Arc (1429) pour que Sens se rallie a Charles VII.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens --- siege de 1420"},
        "sources": ["agendicum.over-blog.com, 'Les annees d'occupation 1420-1429.'", "Brousse, B. 2024."],
        "heritageItemId": None,
    }),
    # IV — Massacre 1562 details
    ("IV", {
        "year": 1562,
        "title": "Le massacre des Huguenots : 100 morts, 50 maisons pillees",
        "text": "Le 12 avril 1562, le maire Hemard ordonne la destruction du temple protestant et l'arrestation des chefs huguenots. La milice (150 hommes) et les pelerins venus pour la fete de saint Savinien se dechainent. Plus de 100 morts. 50 maisons pillees. Les corps sont jetes dans l'Yonne --- on les retrouvera dans la Seine pres de Paris. Sur 16 000 habitants, environ 600 etaient protestants. Ce massacre precede la Saint-Barthelemy de dix ans. Le cardinal de Guise, archeveque de Sens, evince de la mairie par les votes protestants, est souponne d'avoir fomente le complot.",
        "location": {"lat": 48.1975, "lng": 3.2830, "label": "Quartier protestant --- massacre de 1562"},
        "sources": ["Wikipedia, Massacre de Sens.", "Daguin, G. 'Le 12 avril 1562.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # V — Lomenie de Brienne
    ("V", {
        "year": 1788,
        "title": "Lomenie de Brienne : le dernier archeveque, ministre ruine du roi",
        "text": "Etienne-Charles de Lomenie de Brienne echange l'archeveche de Toulouse contre celui de Sens en 1788 --- plus lucratif. Mais il est surtout connu comme le Controleur general des finances de Louis XVI : d'avril 1787 a aout 1788, il tente une reforme fiscale universelle, echoue et demissionne. Quand la Revolution eclate, il accepte la Constitution civile du clerge et devient eveque constitutionnel de l'Yonne. Arrete en novembre 1793, il meurt en prison quelques jours plus tard. C'est le dernier archeveque d'Ancien Regime de Sens --- la fin de 1 500 ans de puissance ecclesiastique.",
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal"},
        "sources": ["Universalis, 'Lomenie de Brienne.'", "Daguin, G. '1789, le torchon brule.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    # V — Crue de 1658
    ("V", {
        "year": 1658,
        "title": "La grande crue de 1658 : la pire inondation de l'histoire de Sens",
        "text": "Du 1er au 3 mars 1658, l'Yonne deborde comme jamais. Le niveau depasse de 30 a 50 cm celui de la grande crue de 1910. C'est la pire inondation jamais enregistree a Sens. Les quartiers bas sont submerges, les caves noyees, les reserves de grain perdues. Louis XIV visite Sens cette annee-la. L'eau est a la fois la richesse de Sens (commerce fluvial, tanneries, moulins) et sa malediction (crues, epidemies).",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "L'Yonne --- crue de 1658"},
        "sources": ["Archives departementales de l'Yonne, 'L'Yonne sous les eaux.'", "Daguin, G. histoire-sens-senonais-yonne.com."],
        "heritageItemId": None,
    }),
    # VI — Palais synodal Viollet-le-Duc
    ("VI", {
        "year": 1856,
        "title": "Viollet-le-Duc restaure le palais synodal",
        "text": "De 1856 a 1865, Eugene Viollet-le-Duc --- le plus celebre architecte-restaurateur de France, celui de Notre-Dame de Paris et de Carcassonne --- s'attaque au palais synodal de Sens. Il prend de grandes libertes : il cree des piles interieures, ajoute des tourelles a creneaux, refait la toiture en tuiles vernissees polychromes de Bourgogne selon des motifs retrouves lors des fouilles. Le resultat est spectaculaire --- et controverse. Restauration ou reinvention ? Le debat est le meme qu'a Notre-Dame.",
        "location": {"lat": 48.1970, "lng": 3.2840, "label": "Palais synodal --- chantier Viollet-le-Duc"},
        "sources": ["Archives de l'Yonne, dossier Viollet-le-Duc.", "Wikipedia, Palais synodal de Sens.", "Merimee, PA00113883."],
        "heritageItemId": "e5555555-0002-0002-0002-000000000002",
    }),
    # VI — Mallarme precisions
    ("VI", {
        "year": 1860,
        "title": "Le jeune Mallarme decouvre Baudelaire au lycee de Sens",
        "text": "Stephane Mallarme est interne au lycee de Sens. Il ecrit ses premiers poemes a 15 ans, influence par Hugo et Gautier. En 1857, sa soeur Maria meurt --- un traumatisme qui marquera toute son oeuvre. En 1860, il decouvre Les Fleurs du Mal de Baudelaire : c'est une revolution. Il rencontre aussi Maria Gerhard, une jeune gouvernante allemande qu'il epousera en 1863. Il decrira Sens comme son 'premier pas dans l'abetissement' --- mais c'est ici que tout commence pour celui qui deviendra le maitre du symbolisme.",
        "location": {"lat": 48.1985, "lng": 3.2870, "label": "Lycee de Sens --- ancien couvent des Celestins"},
        "sources": ["musee-mallarme.fr, biographie.", "Wikipedia, College Stephane-Mallarme de Sens."],
        "heritageItemId": "e5555555-0024-0024-0024-000000000024",
    }),
    # VI — Crue 1910
    ("VI", {
        "year": 1910,
        "title": "Sens sous les eaux : la grande crue de janvier 1910",
        "text": "Du 21 au 23 janvier 1910, l'Yonne deborde massivement. Sens est inondee pendant 19 jours. C'est la meme crue qui noie Paris (la fameuse crue de la Seine de 1910). Les quartiers bas de la ville sont sous l'eau, les commerces fermes, les habitants evacues. Des cartes postales de l'epoque montrent les rues transformees en canaux. La crue de 1910 reste la reference --- mais celle de 1658 etait encore pire.",
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "L'Yonne --- crue de 1910"},
        "sources": ["Daguin, G. 'La crue de l'Yonne du 21 au 23 janvier 1910.' histoire-sens-senonais-yonne.com.", "Archives departementales de l'Yonne."],
        "heritageItemId": None,
    }),
    # III — College de Sens fonde
    ("IV", {
        "year": 1537,
        "title": "Le chanoine Hodoard fonde le college de Sens",
        "text": "Le 12 juin 1537, Philippe Hodoard, chanoine de la cathedrale de Sens et docteur en theologie de la faculte de Paris, fait don de ses biens pour fonder un college a Sens. C'est le debut de l'enseignement secondaire senonais. Le college evoluera au fil des siecles --- installe dans l'ancien couvent des Celestins apres la Revolution, il deviendra le lycee ou Mallarme enseignera en 1871, puis le college Stephane-Mallarme en 1960.",
        "location": {"lat": 48.1985, "lng": 3.2870, "label": "College de Sens --- futur lycee Mallarme"},
        "sources": ["Daguin, G. 'College Stephane Mallarme, du Couvent au C.E.S.' histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0024-0024-0024-000000000024",
    }),
]


def main():
    with open(CHAPITRES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing = set()
    for ch in data["chapters"]:
        for ev in ch["events"]:
            existing.add(ev["title"].lower().strip())

    # Supprimer les anciens doublons sur les memes sujets
    duplicates_to_remove = [
        "le concile de sens : abelard condamne face a bernard de clairvaux",
        "le massacre des huguenots",
        "une synagogue plus haute que l'eglise",
    ]
    for ch in data["chapters"]:
        ch["events"] = [
            ev for ev in ch["events"]
            if ev["title"].lower().strip() not in duplicates_to_remove
        ]

    # Re-index existing
    existing = set()
    for ch in data["chapters"]:
        for ev in ch["events"]:
            existing.add(ev["title"].lower().strip())

    added = 0
    for ch_id, event in EVENTS:
        if event["title"].lower().strip() in existing:
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
    print(f"+{added} evenements, -{len(duplicates_to_remove)} doublons remplaces")
    print(f"Total: {total}")
    for ch in data["chapters"]:
        print(f"  {ch['id']}. {ch['title'][:35]:35} : {len(ch['events'])}")


if __name__ == "__main__":
    main()
