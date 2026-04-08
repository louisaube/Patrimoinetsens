#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
23_rewrite_weak.py — Identifie et réécrit les textes faibles des chapitres IV, V, VI
de histoire-chapitres.json.

Critères de faiblesse :
  1. Texte < 150 caractères
  2. Texte qui commence par le titre répété (copier-coller brut)
  3. Texte qui est un collage brut Daguin / cookies / fragments
  4. Texte qui n'explique pas pourquoi l'événement compte pour Sens
"""

import json
import re
import sys
from pathlib import Path

JSON_PATH = Path(__file__).resolve().parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
TARGET_CHAPTERS = {"IV", "V", "VI"}


def normalize(s: str) -> str:
    """Lowercase, strip accents roughly, collapse whitespace."""
    return re.sub(r"\s+", " ", s.lower().strip())


def title_repeated_at_start(title: str, text: str) -> bool:
    """Check if the text begins with the title (or close variant)."""
    if not title or not text:
        return False
    # Take first 3+ words of title
    title_words = title.split()
    if len(title_words) < 2:
        return False
    prefix = " ".join(title_words[:4])
    return text.strip().startswith(prefix)


def is_raw_paste(text: str) -> bool:
    """Detect raw pastes: cookie banners, truncated fragments, markdown artifacts."""
    indicators = [
        "dépose des cookies",
        "améliorer votre expérience de navigation",
        "mesurer l'audience",
        "publicit",
        "campagnes cibl",
        "s traces de cet établissement",
        "ngues de la ville qui porte son nom",
        "Couvent au C.E.S.",
        "énonais à Madagascar",
        "e archevêque et choléra",
        "Mamelouk Ali, de Napoléon Napoléon en avait trois",
    ]
    for ind in indicators:
        if ind in text:
            return True
    return False


def lacks_why(text: str) -> bool:
    """Check if text is purely factual listing without explaining significance."""
    # Short texts that just state facts without connecting to Sens's story
    why_signals = [
        "important", "signifi", "conséquence", "résultat", "marque",
        "transforme", "bouleverse", "symbolise", "témoigne", "illustre",
        "c'est parce", "c'est pourquoi", "voilà pourquoi",
    ]
    text_lower = text.lower()
    return not any(sig in text_lower for sig in why_signals)


# ---- REWRITE MAP ----
# Key = (chapter_id, event_index)
# Value = new text (150-300 chars, narrative, lycée level, explains WHY)

REWRITES = {
    # Ch IV [2] — "L'ombre des Célestins rode sur Mallarmé" — starts as raw paste "Mallarmé Le couvent..."
    ("IV", 2): (
        "En 1345, les Célestins fondent un couvent à Sens. Six siècles plus tard, "
        "ce lieu deviendra le lycée où le jeune Stéphane Mallarmé écrira ses premiers "
        "poèmes. C'est un fil rouge de l'histoire sénonaise : un couvent médiéval qui "
        "fabrique, sans le savoir, l'un des plus grands poètes français."
    ),

    # Ch IV [9] — "En 1429, la chevauchée de Jeanne d'Arc passe par Sens" — title repeated
    ("IV", 9): (
        "En septembre 1429, après l'échec du siège de Paris, Charles VII ordonne la "
        "retraite. Jeanne d'Arc passe par Sens avec l'armée royale. La ville, encore "
        "meurtrie par la guerre de Cent Ans, ouvre ses portes au roi. C'est un moment "
        "de bascule : Sens choisit le camp de la reconquête française."
    ),

    # Ch IV [12] — "A partir de 1493, on trouve des traces..." — raw fragment paste
    ("IV", 12): (
        "Vers 1493, l'Hôtel de l'Écu apparaît dans les archives sénonaises. Pendant "
        "des siècles, ce bâtiment servira de résidence aux administrateurs de "
        "l'Hôtel-Dieu. Son histoire illustre comment le patrimoine de Sens se "
        "transforme au fil des époques : d'un hospice médiéval naît un lieu de pouvoir."
    ),

    # Ch IV [16] — "la longue marche de l'église réformée à Sens" — title repeated
    ("IV", 16): (
        "À partir de 1536, la Réforme protestante gagne Sens. Calvin publie "
        "l'Institution chrétienne, le concile de Trente réaffirme le dogme catholique, "
        "et la tension monte. Sens, ville de l'archevêque, devient un terrain "
        "d'affrontement religieux qui culminera dans le massacre de 1562."
    ),

    # Ch IV [19] — "22 Janvier 1547, le Protestant Jean Langlois est condamné à mort" — title repeated + raw
    ("IV", 19): (
        "Le 22 janvier 1547, Jean Langlois est brûlé vif près du marché aux balais "
        "pour avoir embrassé la foi protestante. C'est le premier martyr de la Réforme "
        "à Sens. Sa mort annonce quinze années de violences religieuses dans une ville "
        "où l'archevêque ne tolère aucune dissidence."
    ),

    # Ch IV [25] — "le 12 avril 1562, le massacre des Huguenots à Sens" — title repeated
    ("IV", 25): (
        "Le 12 avril 1562, Robert Hémard, ancien maire évincé par les protestants, "
        "organise un massacre. La milice catholique se déchaîne : une centaine de "
        "huguenots sont tués, leurs maisons pillées. Ce massacre fait de Sens l'un des "
        "épisodes les plus sanglants des guerres de Religion en France."
    ),

    # Ch V [0] — "Le Carmel de Sens" — title repeated
    ("V", 0): (
        "Au début du XVIIe siècle, les Carmélites fondent un couvent à Sens. Elles "
        "vivent cloîtrées dans le silence et la prière. Leur installation témoigne "
        "du renouveau religieux post-guerres de Religion : Sens, traumatisée par les "
        "massacres du XVIe siècle, se reconstruit dans la ferveur catholique."
    ),

    # Ch V [8] — "Le palais synodal" — starts with title
    ("V", 8): (
        "Le palais synodal, joyau gothique du XIIIe siècle accolé à la cathédrale, "
        "servait de tribunal ecclésiastique et de salle d'assemblée. Au XIXe siècle, "
        "Viollet-le-Duc le restaure avec audace — trop, diront certains. Aujourd'hui "
        "musée, il reste le symbole du pouvoir judiciaire de l'archevêque de Sens."
    ),

    # Ch V [9] — "Jacques-Louis David" — raw paste with title repeated
    ("V", 9): (
        "Jacques-Louis David, le peintre du Sacre de Napoléon, a séjourné à Sens. "
        "Il y a peint et le musée conserve l'une de ses toiles. Ce lien inattendu "
        "entre le plus célèbre peintre néoclassique et une ville de province rappelle "
        "que Sens attirait les grands noms bien au-delà de son archevêché."
    ),

    # Ch V [10] — "C'est une des rues les plus longues..." — raw fragment
    ("V", 10): (
        "Jacques-Charles Dubois, né en 1762 à Reux, fut un bienfaiteur de Sens. "
        "La ville lui a dédié l'une de ses plus longues rues, tracée sur l'ancienne "
        "voie romaine nord-sud. Ce choix n'est pas anodin : la rue Dubois relie "
        "le Sens romain au Sens moderne, deux mille ans d'histoire en ligne droite."
    ),

    # Ch V [11] — "Une Poste que l'on appelait La boite à savon" — too short (163 chars), anecdotal without context
    ("V", 11): (
        "Vers 1769, Sens se dote d'un bureau de poste que les habitants surnomment "
        "« la boîte à savon ». Ce surnom moqueur cache une réalité importante : "
        "la poste relie Sens au réseau national de courrier, accélérant les échanges "
        "commerciaux et administratifs dans une ville encore très enclavée."
    ),

    # Ch VI [1] — "1789, le torchon brûle..." — title repeated
    ("VI", 1): (
        "En 1789, la tension éclate entre le clergé et les nouvelles institutions. "
        "L'archevêque intérimaire de Sens se retrouve pris entre fidélité au roi et "
        "pression révolutionnaire. Les ordres religieux installés depuis des siècles "
        "voient leur monde s'effondrer en quelques mois."
    ),

    # Ch VI [3] — "1790, pour les prêtres, se soumettre..." — title repeated
    ("VI", 3): (
        "Le 13 février 1790, l'Assemblée nationale décrète la dissolution des ordres "
        "religieux. Les prêtres de Sens doivent prêter serment à la Constitution ou "
        "fuir. En 1793, Mgr de Champbertrand est guillotiné. C'est la fin brutale de "
        "1 500 ans de pouvoir ecclésiastique à Sens."
    ),

    # Ch VI [5] — "De la terreur de 1793..." — title repeated
    ("VI", 5): (
        "Pendant la Terreur, Sens vit une déchristianisation violente : les églises "
        "deviennent « temples de la Raison », on prie Marat au lieu de la Vierge. "
        "Mais dès 1801, le Concordat rétablit la paix religieuse. La ville découvre "
        "l'état civil laïc : le mariage devient un contrat, plus un sacrement."
    ),

    # Ch VI [8] — "Louis-Etienne Saint-Denis, le Mamelouk Ali" — raw paste
    ("VI", 8): (
        "Louis-Étienne Saint-Denis, élevé à Sens, devient le fidèle « mamelouk Ali » "
        "de Napoléon — son valet personnel qui le suivra jusqu'à Sainte-Hélène. "
        "Ce destin romanesque rappelle que Sens, ville de province, a produit des "
        "figures au cœur des plus grands épisodes de l'Histoire de France."
    ),

    # Ch VI [12] — "30 mars 1814 Napoléon sacré Empereur... Bourrienne l'ami de Sens" — title repeated
    ("VI", 12): (
        "Le 30 mars 1814, Napoléon s'arrête à Sens et déjeune à l'hôtel de l'Écu. "
        "Il y retrouve son ami d'enfance Bourrienne, ancien secrétaire devenu préfet. "
        "Ce lien personnel entre l'Empereur et Sens montre que la ville n'était pas "
        "un simple point sur la carte, mais un lieu de pouvoir et d'amitiés."
    ),

    # Ch VI [14] — "Le roi ne figure pas dans le bréviaire..." — title repeated
    ("VI", 14): (
        "Après la chute de Napoléon, la Restauration puis la monarchie de Juillet "
        "bouleversent Sens. L'archevêque refuse d'inscrire le nouveau roi dans ses "
        "prières — un geste de résistance silencieuse. De 1815 à 1880, Sens oscille "
        "entre fidélité royaliste et montée du républicanisme laïc."
    ),

    # Ch VI [20] — "Un chemin de fer inauguré entre archevêque et choléra" — raw paste fragment
    ("VI", 20): (
        "Le 9 septembre 1849, le train inaugural de la ligne Paris-Tonnerre s'arrête "
        "à Sens. À Tonnerre, le choléra sévit — Sens devient terminus par défaut. "
        "L'archevêque bénit la locomotive. Cette scène résume une époque : la "
        "modernité arrive à Sens encadrée par la religion et freinée par l'épidémie."
    ),

    # Ch VI [23] — "Collège Stéphane Mallarmé, du Couvent au C.E.S." — raw paste fragment
    ("VI", 23): (
        "Grâce à Mgr Mellon Jolly et à d'anciens élèves influents comme le baron "
        "Thénard, l'ancien couvent des Célestins devient un lycée par décret de "
        "Napoléon III. C'est ici que Mallarmé enseignera l'anglais. Le bâtiment "
        "résume Sens : un lieu religieux devenu temple du savoir républicain."
    ),

    # Ch VI [27] — empty title, cookie banner text
    ("VI", 27): (
        "En 1870, la guerre franco-prussienne frappe Sens. La ville est occupée, "
        "les réquisitions épuisent la population. C'est un traumatisme national "
        "qui laisse des traces profondes : le monument aux morts de Sens, érigé "
        "des décennies plus tard, témoigne encore de cette blessure collective."
    ),

    # Ch VI [28] — "Ils sont morts pour la France... Campagne de 1870..." — title repeated
    ("VI", 28): (
        "Avant le XIXe siècle, les monuments aux morts n'existent pas. C'est après "
        "les campagnes de 1870, de Tunisie et du Tonkin que Sens érige ses premiers "
        "mémoriaux. Ces pierres gravées changent le rapport de la ville à la guerre : "
        "désormais, chaque soldat mort a droit à un nom sur la place publique."
    ),

    # Ch VI [32] — "Vers la construction d'un hôtel de ville neuf !" — title repeated
    ("VI", 32): (
        "Depuis 1886, les édiles sénonais rêvent d'un nouvel hôtel de ville. La "
        "maison Lorne, trop exiguë, ne convient plus. Une commission spéciale "
        "tranche : on construira un bâtiment neuf, symbole de la République triomphante. "
        "Ce sera le futur hôtel de ville inauguré par Lucien Cornet en 1904."
    ),

    # Ch VI [33] — "L'usine à plomb Lelièvre" — too short (249 chars) and lacks why
    ("VI", 33): (
        "L'usine Lelièvre et Muleur Frères fabrique des capsules de plomb et emploie "
        "300 ouvriers — c'est la plus grande usine de Sens. Elle participe à "
        "l'Exposition Universelle de 1878. Sa cheminée domine le paysage urbain et "
        "symbolise l'entrée de Sens dans l'ère industrielle."
    ),

    # Ch VI [35] — "Le général Duchesne, 1895 un sénonais à Madagascar" — raw paste fragment
    ("VI", 35): (
        "En 1895, le général Duchesne, natif de Sens, commande l'expédition française "
        "à Madagascar. Il force la reine Ranavalona III à accepter le protectorat. "
        "Pour Sens, c'est une fierté ambiguë : un enfant du pays au sommet de "
        "l'empire colonial, à une époque où la France se projette outre-mer."
    ),

    # Ch VI [37] — "l'Hôtel de Paris et de la Poste" — cookie banner paste
    ("VI", 37): (
        "Vers 1900, l'Hôtel de Paris et de la Poste est l'un des établissements "
        "les plus réputés de Sens. Ancien relais de diligences devenu hôtel moderne, "
        "il accueille voyageurs et notables. Son évolution reflète la transformation "
        "de Sens : d'un relais de poste médiéval à une ville connectée par le rail."
    ),

    # Ch VI [38] — "Chimères, mascarons, stuc et staff" — title repeated
    ("VI", 38): (
        "Dès la pose de la première pierre du nouvel hôtel de ville, les architectes "
        "Dupont et Poivert soignent la décoration : chimères, mascarons, stucs. "
        "C'est un choix politique autant qu'esthétique — la République veut un "
        "bâtiment aussi beau que la cathédrale pour affirmer le pouvoir laïc."
    ),

    # Ch VI [39] — "Trahison, obscurantisme, vive la laïcité!..." — title repeated
    ("VI", 39): (
        "De 1902 à 1905, Émile Combes mène une politique anticléricale radicale. "
        "À Sens, ses lois ferment des écoles religieuses et expulsent des congrégations. "
        "La ville, siège d'un archevêché millénaire, vit de plein fouet ce combat "
        "entre République laïque et Église catholique."
    ),

    # Ch VI [40] — "Ils sont morts pour la France... le premier Monument inauguré le 27 mars 1904" — title repeated
    ("VI", 40): (
        "Le 27 mars 1904, Sens inaugure enfin son premier monument aux morts. "
        "Le retard s'explique par les finances, mais aussi par l'affaire Dreyfus "
        "qui divise la ville. Ce monument est un acte politique : la République "
        "honore ses soldats et affirme la nation au-dessus des querelles."
    ),

    # Ch VI [41] — empty title, raw text about religious orders
    ("VI", 41): (
        "En 1905, la loi de séparation de l'Église et de l'État bouleverse Sens. "
        "Depuis la Révolution, les ordres religieux ont été chassés puis revenus. "
        "Cette fois, c'est définitif : les biens ecclésiastiques deviennent "
        "propriété publique. Quinze siècles de pouvoir archiépiscopal prennent fin."
    ),

    # Ch VI [42] — "Et la flèche laïque s'éleva vers les cieux" — title repeated
    ("VI", 42): (
        "Lucien Cornet, maire radical et franc-maçon, fait ériger un campanile sur "
        "le nouvel hôtel de ville — plus haut que le clocher de la cathédrale. "
        "Au sommet, une statue de Brennus, le Gaulois qui prit Rome. Le message est "
        "clair : la République domine l'Église, et Sens retrouve ses racines gauloises."
    ),

    # Ch VI [45] — "Le pont Lucien Cornet" — short (175 chars)
    ("VI", 45): (
        "Le 18 mai 1913, Sens inaugure le pont Lucien Cornet sur l'Yonne. C'est "
        "le dernier grand chantier d'avant-guerre, un ouvrage de béton armé moderne. "
        "Dans un an, les hommes qui applaudissent partiront pour les tranchées. "
        "Ce pont relie deux époques : la Belle Époque insouciante et la Grande Guerre."
    ),
}


def main():
    # Read JSON
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    changes = []

    for chapter in data["chapters"]:
        ch_id = chapter["id"]
        if ch_id not in TARGET_CHAPTERS:
            continue

        for idx, event in enumerate(chapter["events"]):
            key = (ch_id, idx)
            if key not in REWRITES:
                continue

            old_text = event.get("text", "")
            new_text = REWRITES[key]

            # Detect the reason
            reasons = []
            if len(old_text) < 150:
                reasons.append(f"trop court ({len(old_text)} chars)")
            if title_repeated_at_start(event.get("title", ""), old_text):
                reasons.append("titre répété en début")
            if is_raw_paste(old_text):
                reasons.append("collage brut (cookies/fragment)")
            if lacks_why(old_text) and len(old_text) < 300:
                reasons.append("manque le 'pourquoi'")

            event["text"] = new_text

            changes.append({
                "chapter": ch_id,
                "index": idx,
                "year": event.get("year"),
                "title": event.get("title", "")[:60],
                "reasons": reasons,
                "old_len": len(old_text),
                "new_len": len(new_text),
            })

    # Save JSON
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Report
    print(f"\n{'='*70}")
    print(f"  RÉÉCRITURE DES TEXTES FAIBLES — Chapitres IV, V, VI")
    print(f"{'='*70}\n")
    print(f"  {len(changes)} textes réécrits\n")

    for c in changes:
        print(f"  Ch.{c['chapter']} [{c['index']}] ({c['year']}) — {c['title']}")
        print(f"    Raisons : {', '.join(c['reasons']) if c['reasons'] else 'qualité narrative insuffisante'}")
        print(f"    {c['old_len']} -> {c['new_len']} chars")
        print()

    print(f"{'='*70}")
    print(f"  Fichier sauvegardé : {JSON_PATH}")
    print(f"{'='*70}\n")


if __name__ == "__main__":
    main()
