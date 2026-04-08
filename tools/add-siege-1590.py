"""Ajoute les evenements 1589-1594 (Jacques Clement, siege Henri IV, devises) au Grand Recit."""
import json, sys
sys.stdout.reconfigure(encoding="utf-8")

path = r"C:\Users\louis\Desktop\K&C\Patrimoine & Sens\public\data\histoire-chapitres.json"
with open(path, encoding="utf-8") as f:
    data = json.load(f)

ch4 = data["chapters"][3]

new_events = [
    {
        "year": 1589,
        "title": "Jacques Clement, moine de Sens, assassine le roi Henri III",
        "text": "Le 1er aout 1589, Jacques Clement, un moine dominicain du couvent des Jacobins de Sens, poignarde le roi Henri III a Saint-Cloud. Le roi meurt le lendemain. Sens est alors un bastion de la Ligue catholique. Sans cet assassinat, Henri de Navarre ne serait jamais devenu Henri IV.",
        "longText": "Jacques Clement est ne vers 1567. Il entre chez les Dominicains de Sens \u2014 le couvent des Jacobins, fonde en 1227 pres de la cathedrale. En 1589, la France est dechiree par les guerres de Religion. Henri III, roi catholique, s'est allie avec Henri de Navarre (futur Henri IV), un protestant. Pour les Ligueurs catholiques, c'est une trahison.\n\nSens est un bastion de la Ligue. La ville est gouvernee par des echevins ligueurs qui refusent de reconnaitre l'autorite d'un roi allie aux protestants. C'est dans ce climat de fievre religieuse que Jacques Clement decide d'agir.\n\nLe 1er aout 1589, il obtient une audience aupres d'Henri III a Saint-Cloud. Il porte une lettre. Quand le roi se penche pour la lire, Clement le poignarde. Henri III meurt le lendemain, a 37 ans. C'est le seul roi de France assassine par un moine.\n\nLes consequences sont immenses. Henri de Navarre devient Henri IV \u2014 mais il lui faudra quatre ans de guerre et une conversion au catholicisme (\u00ab Paris vaut bien une messe \u00bb, 1593) pour s'imposer. Sens, fidele a la Ligue jusqu'au bout, resistera a Henri IV lors du siege de 1590.\n\nLe couvent des Jacobins de Sens, d'ou est parti Jacques Clement, a ete detruit a la Revolution. Ses vestiges sont fondus dans le tissu urbain, pres de la cathedrale.",
        "location": {"lat": 48.1975, "lng": 3.2850, "label": "Couvent des Jacobins \u2014 lieu de formation de Jacques Clement"},
        "sources": [
            "Daguin, G. \u00ab Jacques Clement. \u00bb histoire-sens-senonais-yonne.com.",
            "SenoN.org, \u00ab Jacques Clement. \u00bb"
        ],
        "heritageItemId": "e5555555-0027-0027-0027-000000000027"
    },
    {
        "year": 1590,
        "title": "NULLA EXPUGNABILIS ARTE : Henri IV echoue deux fois devant Sens",
        "text": "En 1590, Henri IV assiege Sens, bastion de la Ligue catholique. Les Senonais repoussent le roi de France \u2014 deux fois. C'est de ce siege que nait la devise de la ville : NULLA EXPUGNABILIS ARTE (par aucun art imprenable). La seconde devise, FIDELIS ET INEXPUGNABILIS ARTE (fidele et inexpugnable par l'art), celebre la meme fierte. Une tour orne les armoiries de la ville.",
        "longText": "En 1590, la France est coupee en deux. Henri IV, roi de France depuis l'assassinat d'Henri III par Jacques Clement (un moine de Sens, l'annee precedente), est protestant. La moitie du pays refuse de le reconnaitre. Sens est l'un des bastions les plus farouches de la Ligue catholique.\n\nHenri IV assiege la ville. Les remparts gallo-romains, renforces au Moyen Age, tiennent bon. Les Senonais repoussent l'assaut. Henri IV revient une seconde fois. Nouvel echec. Le roi doit lever le siege.\n\nC'est de cette double victoire que nait la devise de Sens. Le Dictionnaire des devises historiques d'Alphonse Chassant (1878) en recense deux variantes :\n\n\u2022 NULLA EXPUGNABILIS ARTE : \u00ab Par aucun art imprenable. \u00bb Chassant precise que \u00ab cette devise parait faite en allusion au siege que Sens soutint contre l'armee d'Henri IV, deux fois repousse autour de cette ville par les Ligueurs. \u00bb\n\n\u2022 FIDELIS ET INEXPUGNABILIS ARTE : \u00ab Fidele et inexpugnable par l'art. \u00bb Version qui insiste sur la fidelite \u2014 a la foi catholique, a la Ligue.\n\nLes armoiries de Sens portent une tour \u2014 symbole de cette invulnerabilite. La ville ne se ralliera a Henri IV qu'apres sa conversion au catholicisme en 1593. L'Edit de Nantes (1598) mettra fin aux guerres de Religion.\n\nIronie de l'histoire : la ville qui a forme l'assassin d'Henri III (Jacques Clement, 1589) est aussi celle qui a resiste le plus longtemps a Henri IV. Sens a ete au coeur des guerres de Religion, des deux cotes de la violence.",
        "location": {"lat": 48.1965, "lng": 3.286, "label": "Enceinte gallo-romaine \u2014 siege d'Henri IV"},
        "sources": [
            "Chassant, Alphonse. \u00ab Dictionnaire des devises historiques et heraldiques. \u00bb Paris, 1878, p. 85 et 194.",
            "Daguin, G. \u00ab Sens pendant les guerres de Religion. \u00bb",
            "Brousse, Bernard. \u00ab Sens, cite d'art et d'histoire. \u00bb Le Charmoiset, 2024."
        ],
        "heritageItemId": "e5555555-0014-0014-0014-000000000014"
    },
    {
        "year": 1594,
        "title": "Sens se rallie a Henri IV apres sa conversion",
        "text": "Apres la conversion d'Henri IV au catholicisme en 1593, les villes ligueuses se rallient. Sens, dernier bastion, ouvre ses portes en 1594. La ville qui avait forme l'assassin d'Henri III et resiste deux fois au siege du nouveau roi reconnait finalement son autorite.",
        "longText": "Le ralliement de Sens a Henri IV en 1594 marque la fin d'une decennie de guerre civile dans le Senonais. La ville avait ete l'un des bastions les plus farouches de la Ligue catholique : c'est de son couvent des Jacobins qu'etait parti Jacques Clement pour assassiner Henri III en 1589, et c'est devant ses remparts qu'Henri IV avait ete repousse deux fois en 1590.\n\nLa conversion d'Henri IV au catholicisme le 25 juillet 1593 a Saint-Denis change la donne. Une a une, les villes ligueuses se rallient. Paris ouvre ses portes en mars 1594. Sens suit peu apres.\n\nLe ralliement n'est pas gratuit. Henri IV accorde des garanties : respect des privileges municipaux, maintien des officiers en place, amnistie generale. L'Edit de Nantes (1598) completera le dispositif en accordant la liberte de culte aux protestants.\n\nPour Sens, c'est un tournant. La ville perd son role de forteresse ligueuse mais conserve son prestige religieux \u2014 l'archeveque de Sens reste le primat des Gaules jusqu'en 1622, date a laquelle Paris deviendra archeveche. Les devises NULLA EXPUGNABILIS ARTE et FIDELIS ET INEXPUGNABILIS ARTE resteront gravees dans la memoire collective.\n\nC'est aussi la fin d'une periode terrible : le massacre des Huguenots (1562), les sieges, l'assassinat du roi. Le XVIIe siecle qui s'ouvre sera plus calme \u2014 mais Sens ne retrouvera jamais l'importance politique qu'elle avait au Moyen Age.",
        "location": {"lat": 48.1977, "lng": 3.2837, "label": "Sens \u2014 ralliement a Henri IV"},
        "sources": [
            "Brousse, Bernard. \u00ab Sens, cite d'art et d'histoire. \u00bb Le Charmoiset, 2024."
        ],
        "heritageItemId": None
    }
]

ch4["events"].extend(new_events)
ch4["events"].sort(key=lambda e: e["year"])

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

total = sum(len(ch["events"]) for ch in data["chapters"])
lt = sum(1 for ch in data["chapters"] for ev in ch["events"] if ev.get("longText"))
print(f"3 evenements ajoutes : Jacques Clement (1589), siege Henri IV (1590), ralliement (1594)")
print(f"Total: {total} evenements, {lt} avec longText")
