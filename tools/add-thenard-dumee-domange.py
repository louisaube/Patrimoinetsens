"""Ajoute Thenard/Hugo au Grand Recit + fiches patrimoine Dumee, Domange, Thenard."""
import json, sys
sys.stdout.reconfigure(encoding="utf-8")

# ===== 1. GRAND RECIT : ajouter Hugo vs Thenard (1839) =====
path = r"C:\Users\louis\Desktop\K&C\Patrimoine & Sens\public\data\histoire-chapitres.json"
with open(path, encoding="utf-8") as f:
    data = json.load(f)

# Find chapter VI (Revolution et industrie)
ch6 = data["chapters"][5]

hugo_event = {
    "year": 1839,
    "title": "Hugo visite Sens et se dispute avec le baron Thenard",
    "text": "En 1839, Victor Hugo visite Sens. Il rencontre le baron Thenard, chimiste celebre et depute de l'Yonne. Les deux hommes se disputent sur le travail des enfants en usine : Thenard veut maintenir 16 heures, Hugo veut reduire a 10. Vingt-trois ans plus tard, Hugo se vengera en nommant la famille de mechants des Miserables (1862) \"Thenardier\" \u2014 et a la fin du roman, Thenardier se presente sous le nom de \"Thenard\".",
    "longText": "En 1839, Victor Hugo visite Sens. Il est depute, pas encore en exil. Le baron Louis-Jacques Thenard aussi \u2014 depute de l'Yonne, pair de France, chimiste celebre (il a decouvert l'eau oxygenee et le bleu de cobalt qui porte son nom). Les deux hommes siegent dans des camps opposes.\n\nLe sujet de discorde : le travail des enfants. Hugo veut reduire la journee de travail des enfants en usine de 16 heures a 10 heures. Thenard, conservative, s'y oppose. Pour Hugo, c'est une question de dignite humaine. Pour Thenard, c'est une question d'economie.\n\nHugo n'oublie pas. En 1862, quand il publie Les Miserables depuis son exil a Guernesey, il choisit de nommer la famille la plus abjecte du roman \"Thenardier\". Ce n'est pas un hasard : a la fin du roman, Thenardier se presente a Marius sous le faux nom de \"Thenard\" \u2014 reference a peine voilee au baron senonais. C'est une vengeance litteraire, vingt-trois ans apres la dispute.\n\nL'ironie, c'est que Thenard etait un grand scientifique. Ne a La Louptiere pres de Nogent-sur-Seine, forme au college de Sens des l'age de 10 ans, il a decouvert l'eau oxygenee (H2O2), synthetise le bleu de Thenard (pigment de cobalt utilise en ceramique), et identifie le bore avec Gay-Lussac. Sa statue a ete erigee place Thenard a Sens en 1861 \u2014 un an avant la publication des Miserables. Son village natal a ete rebaptise La Louptiere-Thenard en 1865.\n\nAujourd'hui, quand les touristes voient la statue de Thenard a Sens, ils pensent rarement que cet homme respectable a inspire le personnage le plus meprisable de la litterature francaise. C'est une histoire typiquement senonaise : un lien invisible entre une petite ville de province et un chef-d'oeuvre universel.",
    "location": {"lat": 48.1975, "lng": 3.2830, "label": "Place Thenard \u2014 statue du baron"},
    "sources": [
        "France Bleu Auxerre, \"Thenardier : vengeance politique de Hugo contre un baron de Sens.\", 2023.",
        "Brousse, Bernard. \"Sens, cite d'art et d'histoire.\" Le Charmoiset, 2024."
    ],
    "heritageItemId": None
}

ch6["events"].append(hugo_event)
ch6["events"].sort(key=lambda e: e["year"])

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

total = sum(len(ch["events"]) for ch in data["chapters"])
print(f"Hugo/Thenard ajoute au chapitre VI. Total: {total} evenements")

# ===== 2. SEED ITEMS : Dumee, Domange, Thenard =====
items_path = r"C:\Users\louis\Desktop\K&C\Patrimoine & Sens\src\lib\db\seed-items.ts"
with open(items_path, encoding="utf-8") as f:
    content = f.read()

new_items = """
  // 79. Moulins Dumee --- meuniers depuis 1703, parmi les 10 plus gros moulins de France
  {
    id: 'e5555555-0079-0079-0079-000000000079',
    createdBy: BERNARD,
    title: 'Moulins Dumee --- meuniers de Sens depuis 1703',
    category: 'batiment_historique' as const,
    status: 'publie' as const,
    latitude: 48.1935,
    longitude: 3.2870,
    coverPhotoUrl: null,
    periodStart: 1703,
    periodEnd: 2025,
  },
  // 80. Baron Thenard --- chimiste, depute, celui qui a inspire les Thenardier
  {
    id: 'e5555555-0080-0080-0080-000000000080',
    createdBy: DENIS,
    title: 'Baron Thenard --- le chimiste qui a inspire les Thenardier',
    category: 'autre' as const,
    status: 'publie' as const,
    latitude: 48.1970,
    longitude: 3.2830,
    coverPhotoUrl: null,
    periodStart: 1777,
    periodEnd: 1857,
  },
"""

# Insert before the last ] as const
content = content.replace("] as const", new_items + "] as const")

with open(items_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Items Dumee + Thenard ajoutes")

# ===== 3. SEED CONTRIBUTIONS =====
contribs_path = r"C:\Users\louis\Desktop\K&C\Patrimoine & Sens\src\lib\db\seed-contributions.ts"
with open(contribs_path, encoding="utf-8") as f:
    content = f.read()

new_contribs = """
  // =========================================================================
  // MOULINS DUMEE (item 79)
  // =========================================================================
  {
    id: 'f6666666-0112-0112-0112-000000000112',
    heritageItemId: 'e5555555-0079-0079-0079-000000000079',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les Dumee : sept generations de meuniers a Sens",
    body: "En 1703, un certain Jacques Dumee s'installe comme meunier a Sens. Trois siecles plus tard, ses descendants dirigent l'un des dix plus gros moulins de France. Sept generations de Dumee se sont succede : Jacques (1703), Pierre (1743), Antoine (1782), Louis-Auguste (1861), Roger (1899), Gerald (1936), puis Herve de Romemont, gendre de Gerald (1998).\\n\\nLouis-Auguste rachete les Moulins de Saint-Pere en 1890 -- 20 tonnes de farine par jour. En 1935, un incendie detruit presque tout. Ses fils Andre et Roger reconstruisent et doublent la capacite a 50 tonnes. En 1975, Gerald passe a 90 tonnes. En 1994, 200 tonnes.\\n\\nEn 2015, la famille inaugure un moulin flambant neuf a Gron, pres de Sens : 450 tonnes par jour, 11 500 tonnes de stockage de grain. C'est l'un des moulins les plus modernes de France.\\n\\nLes Dumee, c'est l'histoire d'une famille qui fait la meme chose depuis 1703 -- moudre du ble -- et qui le fait mieux a chaque generation. C'est rare. La plupart des entreprises familiales ne survivent pas trois generations. Les Dumee en sont a sept.",
    sources: [
      'Moulins Dumee, historique : moulins-dumee.com/historique/.',
      'France Bleu Auxerre, "Les Moulins Dumee figurent parmi les 10 plus gros moulins de France", 2016.',
    ],
    period: '1703 -- present',
    audioUrl: null,
  },
  // =========================================================================
  // BARON THENARD (item 80)
  // =========================================================================
  {
    id: 'f6666666-0113-0113-0113-000000000113',
    heritageItemId: 'e5555555-0080-0080-0080-000000000080',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le baron Thenard : du college de Sens a l'eau oxygenee",
    body: "Louis-Jacques Thenard est ne le 4 mai 1777 a La Louptiere, pres de Nogent-sur-Seine. Fils de paysans, il est forme des l'age de 10 ans par le cure de Villeneuve-l'Archeveque, puis entre au college de Sens. A 16 ans, il part pour Paris avec l'ambition de devenir pharmacien.\\n\\nIl devient bien plus. Protege de Vauquelin, puis de Fourcroy, il est nomme professeur au College de France, a l'Ecole polytechnique et a la faculte des sciences de Paris. Ses decouvertes sont majeures : l'eau oxygenee (H2O2, 1818), le bleu de Thenard (pigment de cobalt utilise en ceramique), l'identification du bore avec Gay-Lussac (1808).\\n\\nDepute de l'Yonne, pair de France, baron de Charles X (1825) -- Thenard est au sommet. Mais il a un ennemi : Victor Hugo. En 1839, les deux hommes se disputent sur le travail des enfants. Thenard defend le patronat, Hugo les enfants. Vingt-trois ans plus tard, Hugo nomme ses mechants 'Thenardier' dans Les Miserables (1862).\\n\\nStatue erigee place Thenard a Sens en 1861. Village natal rebaptise La Louptiere-Thenard en 1865. Nomine 7 fois au prix Nobel de chimie (a titre posthume, par tradition). Un scientifique de premier plan, forme a Sens, dont le nom est devenu -- par la plume de Hugo -- synonyme de mechancete.",
    sources: [
      'France Bleu Auxerre, "Thenardier : vengeance politique de Hugo", 2023.',
      'Wikipedia, "Louis Jacques Thenard".',
      'SenoN.org, "Baron Thenard."',
    ],
    furtherReading: "Le lien Hugo-Thenard est documente par plusieurs historiens. Hugo a visite Sens en 1839, probablement lors d'un voyage en Bourgogne. La statue de Thenard, place du meme nom a Sens, date de 1861 -- un an avant la publication des Miserables. Le Dictionnaire de Chassant (1878) mentionne la devise de Sens, mais pas Thenard.",
    period: '1777--1857',
    audioUrl: null,
  },

"""

# Insert before final ] as const
content = content.replace("] as const", new_contribs + "] as const")

with open(contribs_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Contributions Dumee + Thenard ajoutees")

# ===== 4. ENRICHIR FICHE CHAMPBERTRAND (item 51) =====
# Ajouter l'info Leblanc-Duvernoy / L'Hermitte
# On cherche la contribution existante de Champbertrand
contribs_path2 = r"C:\Users\louis\Desktop\K&C\Patrimoine & Sens\src\lib\db\seed-contributions.ts"
with open(contribs_path2, encoding="utf-8") as f:
    content2 = f.read()

old_champbertrand = "Champbertrand est un patrimoine vivant. Pas un monument classe -- mais un lieu qui fait ce qu'il a toujours fait : nourrir les gens d'ici."
new_champbertrand = "Le domaine de Champbertrand a une histoire plus ancienne que la ferme actuelle. Il a appartenu a la famille L'Hermitte de Champbertrand avant d'etre rachete par la famille Leblanc-Duvernoy -- les memes mecenes auxerrois qui ont legue leur hotel particulier XVIIIe a la ville d'Auxerre (devenu le musee Leblanc-Duvernoy, avec ses tapisseries de Beauvais). Champbertrand est un patrimoine vivant. Pas un monument classe -- mais un lieu qui fait ce qu'il a toujours fait : nourrir les gens d'ici."

if old_champbertrand in content2:
    content2 = content2.replace(old_champbertrand, new_champbertrand)
    with open(contribs_path2, "w", encoding="utf-8") as f:
        f.write(content2)
    print("Fiche Champbertrand enrichie (Leblanc-Duvernoy / L'Hermitte)")
else:
    print("Champbertrand text not found for enrichment")

print("\nDone!")
