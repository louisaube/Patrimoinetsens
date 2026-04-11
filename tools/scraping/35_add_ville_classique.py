#!/usr/bin/env python3
"""Enrichit le chapitre V (Ville classique, 1600-1789) avec 12 events."""
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
    ("V", {
        "year": 1606,
        "title": "Jacques Davy du Perron : le cardinal qui a converti Henri IV",
        "text": (
            "En 1606, le cardinal Jacques Davy du Perron est nomme archeveque de Sens. C'est "
            "l'homme qui a instruit la conversion d'Henri IV au catholicisme en 1593 --- celle "
            "qui a mis fin aux guerres de Religion ('Paris vaut bien une messe'). Theologien "
            "brillant, polemiste redoutable, il devient Primat des Gaules et de Germanie. Son "
            "frere Jean lui succedera en 1618. Leurs corps reposent dans la cathedrale. Leurs "
            "armoiries --- trois harpes d'or sur champ d'azur --- sont visibles sur les vitraux."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Cathedrale --- cardinal Davy du Perron"},
        "sources": ["Wikipedia, Jacques Davy du Perron.", "Catholic Encyclopedia."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    ("V", {
        "year": 1638,
        "title": "Salves pour Louis XIV : les vitraux de la cathedrale volent en eclats",
        "text": (
            "Le 5 septembre 1638, a l'annonce de la naissance de Louis XIV, une massive decharge "
            "d'artillerie est tiree dans Sens. La joie est excessive : les vitraux de la cathedrale "
            "volent en eclats, des proprietes sont endommagees, des habitants blesses. C'est la "
            "celebrite de Sens qui vaut ce traitement : une ville ordinaire n'aurait pas tire "
            "autant de canons. Vingt ans plus tard, le jeune roi viendra en personne."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- vitraux brises 1638"},
        "sources": ["auxpaysdemesancetres.com."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    ("V", {
        "year": 1646,
        "title": "Gondrin, l'archeveque janseniste qui gifle Madame de Montespan",
        "text": (
            "Louis-Henri de Gondrin, archeveque de Sens de 1646 a 1674, est un ami de Port-Royal "
            "--- le foyer du jansenisme. En 1653, il interdit les Jesuites de son diocese. Mais "
            "l'anecdote la plus celebre est ailleurs : Gondrin est l'oncle de Francoise-Athenais "
            "de Montespan, maitresse de Louis XIV. Desapprouvant la conduite de sa niece, il la "
            "gifle. La repression royale est immediate : une lettre de cachet l'exile de son "
            "diocese. Mais Gondrin menace d'excommunication quiconque viendrait l'arreter. "
            "L'archeveque de Sens tient tete au Roi-Soleil."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal --- Gondrin"},
        "sources": ["Wikipedia, Louis-Henri de Pardaillan de Gondrin.", "Persee, these Dubois 1902."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    ("V", {
        "year": 1658,
        "title": "Louis XIV entre dans Sens : mousquets, tapisseries et chevaux effrays",
        "text": (
            "Le 25 octobre 1658, Louis XIV (20 ans, pas encore marie) entre a Sens par la Porte "
            "d'Yonne. Les habitants en armes sont venus a sa rencontre jusqu'a Sainte-Colombe. "
            "Mais une salve de mousquets effraie les chevaux du carrosse des dames d'honneur de "
            "la reine-mere, qui manquent de se noyer dans l'Yonne en crue. La Grand-Rue est "
            "ornee de tapisseries jusqu'a la cathedrale. Le surlendemain, le roi ordonne : plus "
            "de mousquets dans l'escorte, seulement l'epee."
        ),
        "location": {"lat": 48.1955, "lng": 3.2820, "label": "Porte d'Yonne --- entree de Louis XIV"},
        "sources": ["Daguin, G. 'La Porte d'Yonne, Louis XIV a Sens en 1658.'"],
        "heritageItemId": None,
    }),
    ("V", {
        "year": 1742,
        "title": "Le maitre-autel de Servandoni : des colonnes volees a Louis XIV",
        "text": (
            "En 1742, le celebre decorateur italo-francais Servandoni installe le nouveau "
            "maitre-autel de la cathedrale, surmonte d'un baldaquin soutenu par quatre colonnes "
            "de marbre rouge. Detail savoureux : ces colonnes proviennent du monument a Louis XIV "
            "de la Place des Victoires a Paris, demonte quelques annees plus tot. Le baldaquin "
            "est inspire de celui de Saint-Pierre de Rome par le Bernin. Sens recycle le prestige "
            "royal pour orner sa cathedrale."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- maitre-autel Servandoni"},
        "sources": ["Wikipedia, Cathedrale de Sens.", "Pop.culture.gouv.fr, PM89001624."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    ("V", {
        "year": 1753,
        "title": "Le cardinal de Luynes : l'archeveque qui observe Venus depuis Sens",
        "text": (
            "Paul d'Albert de Luynes, archeveque de Sens (1753-1788), est aussi astronome et "
            "physicien. Elu a l'Academie francaise en 1743 (prefere a Voltaire par intervention "
            "royale), membre de l'Academie des sciences, il installe des lignes meridiennes a "
            "Sens et au chateau de Noslon. En 1761, il observe le passage de Venus devant le "
            "Soleil depuis sa residence --- un phenomene astronomique que toute l'Europe savante "
            "guette. L'archeveque de Sens est un homme des Lumieres."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Palais archiepiscopal --- cardinal-astronome"},
        "sources": ["Wikipedia, Paul d'Albert de Luynes.", "Academie-francaise.fr."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
    }),
    ("V", {
        "year": 1757,
        "title": "L'Almanach de Sens : l'imprimeur Tarbe invente la presse locale",
        "text": (
            "En 1757, l'imprimeur Pierre Hardouin Tarbe lance l'Almanach historique de la ville, "
            "bailliage et diocese de Sens --- une publication annuelle qui paraitra sans "
            "interruption pendant 90 ans (jusqu'en 1847). En 1770, il cree aussi les Affiches "
            "de Sens, bimensuelles. C'est la naissance de la presse locale senonaise. Son fils "
            "Theodore prendra la releve. La famille Tarbe d'imprimeurs durera trois generations "
            "--- jusqu'a ce que le Senonais prenne le relais en 1845."
        ),
        "location": {"lat": 48.1972, "lng": 3.2838, "label": "Imprimerie Tarbe --- presse locale"},
        "sources": ["Persee, 'Le cabinet Tarbe, 2015.'", "Gallica, Recherches historiques Tarbe."],
        "heritageItemId": None,
    }),
    ("V", {
        "year": 1765,
        "title": "Le Dauphin meurt a Fontainebleau : Sens herite du pere de trois rois",
        "text": (
            "Le 20 decembre 1765, le Dauphin Louis --- fils de Louis XV, pere des trois derniers "
            "rois de France (Louis XVI, Louis XVIII, Charles X) --- meurt de tuberculose a "
            "Fontainebleau. Son corps est inhume dans la cathedrale de Sens. Sa veuve Marie-Josephe "
            "de Saxe contracte la maladie et le rejoint le 13 mars 1767. Pourquoi Sens et pas "
            "Saint-Denis ? Parce que le Dauphin l'a demande, par devotion envers l'archeveche "
            "primatial. En 1777, Louis XV commandera un mausolee au sculpteur Coustou."
        ),
        "location": {"lat": 48.1979, "lng": 3.2837, "label": "Cathedrale --- tombeau du Dauphin"},
        "sources": ["Wikipedia, Cathedrale de Sens.", "Daguin, Curiosites cathedrale."],
        "heritageItemId": "e5555555-0001-0001-0001-000000000001",
    }),
    ("V", {
        "year": 1754,
        "title": "Les Jacobins demolissent leur propre eglise : 7 moines dans un couvent vide",
        "text": (
            "Vers 1754, les Jacobins (Dominicains) de Sens, reduits a 7 ou 8 religieux, "
            "n'ont plus les moyens d'entretenir leur eglise conventuelle. Ils font demolir "
            "la nef, le choeur et les chapelles. C'est le signe avant-coureur de la Revolution : "
            "les ordres religieux se vident de l'interieur avant meme qu'on les supprime. En "
            "1790, quand l'Assemblee nationale decrete la dissolution des ordres, beaucoup de "
            "couvents senonais sont deja des coquilles vides."
        ),
        "location": {"lat": 48.1975, "lng": 3.2810, "label": "Couvent des Jacobins --- demolition"},
        "sources": ["Daguin, G. histoire-sens-senonais-yonne.com."],
        "heritageItemId": "e5555555-0027-0027-0027-000000000027",
    }),
    ("V", {
        "year": 1551,
        "title": "Le presidial de Sens : 9 juges dans le premier bailliage de France",
        "text": (
            "En janvier 1551, Henri II cree un siege presidial a Sens --- l'un des 60 tribunaux "
            "superieurs de France. Le bailliage de Sens, cree par Philippe Auguste en 1184, est "
            "le plus ancien et l'un des plus etendus du royaume. Il releve du Parlement de Paris "
            "(pas de Dijon --- Sens n'est pas en Bourgogne). Le presidial requiert au minimum "
            "9 magistrats. Il sera supprime en fevrier 1790 par la Revolution."
        ),
        "location": {"lat": 48.1968, "lng": 3.2850, "label": "Palais de justice --- presidial"},
        "sources": ["Wikipedia, Bailliage de Sens.", "Archives de l'Yonne."],
        "heritageItemId": "e5555555-0036-0036-0036-000000000036",
    }),
    ("V", {
        "year": 1721,
        "title": "L'archeveque de Sens elu a l'Academie francaise --- contre Voltaire",
        "text": (
            "En 1721, l'archeveque Languet de Gergy est elu a l'Academie francaise (fauteuil 1). "
            "Il y combat avec acharnement les candidatures de Montesquieu et de Voltaire. En 1730, "
            "il impose un nouveau catechisme au diocese de Sens. En 1743, c'est son successeur "
            "le cardinal de Luynes qui est elu a l'Academie --- prefere a Voltaire par intervention "
            "royale. L'archeveche de Sens produit des academiciens, pas des philosophes."
        ),
        "location": {"lat": 48.1970, "lng": 3.2845, "label": "Archeveche --- Academie francaise"},
        "sources": ["Academie-francaise.fr.", "Wikipedia, Jean-Joseph Languet de Gergy."],
        "heritageItemId": "e5555555-0013-0013-0013-000000000013",
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
ch5 = next(ch for ch in data["chapters"] if ch["id"] == "V")
print(f"+{added} events Ville classique")
print(f"Chapitre V: {len(ch5['events'])} events (etait 18)")
print(f"Total: {total} events")
