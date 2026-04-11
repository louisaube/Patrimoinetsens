#!/usr/bin/env python3
"""Enrichit le chapitre 0 (Prehistoire) avec longTexts et images."""
import json, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

path = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

LONG_TEXTS = {
    -200000: (
        "Le site de Vinneuf / Les Hauts Massous a ete decouvert en juillet 1989 lors "
        "de sondages pour l'autoroute A5. Il se situe dans une doline (depression "
        "naturelle) de 80 metres de diametre sur le plateau crayeux. Quatre niveaux "
        "d'occupation entre -200 000 et -40 000 ans. L'industrie lithique s'apparente "
        "a un Micoquien, tradition technique des Neandertaliens d'Europe centrale.\n\n"
        "Les Neandertaliens n'etaient pas des brutes. Des etudes recentes montrent "
        "qu'ils enterraient leurs morts, fabriquaient de la colle, utilisaient des "
        "pigments. Ceux du Senonais vivaient sur un plateau riche en silex de la "
        "craie du Campanien, particulierement recherche pour sa qualite de taille.\n\n"
        "Au total, cinq sites du Paleolithique moyen ont ete fouilles le long du "
        "trace de l'A5. L'autoroute passe au-dessus des campements neandertaliens."
    ),
    -4000: (
        "La revolution neolithique arrive dans l'Yonne vers -4000 avec des populations "
        "de la culture rubanee (Linearbandkeramik), venues de l'est de l'Europe le long "
        "du Danube. Ils construisent de grandes maisons de bois, defrichent la foret "
        "avec des haches en silex poli, plantent du ble et de l'orge, elevent des "
        "boeufs et des moutons.\n\n"
        "A Gurgy (nord de l'Yonne), une necropole du Neolithique moyen a permis de "
        "reconstituer un peuplement familial sur sept generations grace aux analyses "
        "ADN. On sait que ces premiers paysans se mariaient entre villages voisins, "
        "etaient de taille moyenne, et mouraient rarement apres 40 ans."
    ),
    -1100: (
        "Le tresor de Villethierry a ete decouvert en 1969 par M. Letteron, qui a "
        "prevenu l'archeologue Jean-Yves Prampart. L'etude (Mordant, 1976) a "
        "revolutionne la comprehension de l'artisanat du Bronze final.\n\n"
        "Les 869 objets : epingles a tete decoree de cercles concentriques, fibules, "
        "bracelets, anneaux de cheville, pince. L'artisan utilisait deja le tour. "
        "Les epingles etaient assemblees en deux parties (tige + tete) puis polies.\n\n"
        "Ce n'est pas un tresor cache par peur. C'est le stock d'un bijoutier "
        "ambulant qui allait de village en village. Il les a deposees et n'est jamais "
        "revenu. Trois mille ans plus tard, un tracteur les a retrouvees. Le tresor "
        "est visible au musee de Sens."
    ),
    -475: (
        "Le nom 'Senons' vient du gaulois 'senos' = ancien. Se nommer 'les Anciens', "
        "c'est affirmer qu'on etait la avant les autres. Les Remes ('les Premiers') "
        "font la meme chose.\n\n"
        "Leur territoire : l'Yonne, la moitie sud de la Seine-et-Marne, et deborde "
        "sur le Loiret, l'Essonne, la Marne, l'Aube. Position strategique : la "
        "confluence Yonne-Seine, route naturelle Mediterranee-Manche.\n\n"
        "Quatre oppida (villes fortifiees) : Agedincum (Sens), Vellaunodunum "
        "(Chateau-Landon), Metlosedum (Melun), Eburobriga (Saint-Florentin). Vers "
        "-400, une branche traverse les Alpes et fonde Sena Gallica (Senigallia). "
        "C'est de la que partira Brennus pour Rome en -390."
    ),
    -100: (
        "Le tresor de Saint-Denis-les-Sens (1992, fouilles A5) : 242 stateres d'or "
        "gaulois caches au fond d'un trou de poteau, dans les fondations d'une maison. "
        "Tous identiques, 7,5 grammes, forme globulaire, decoration en croix. "
        "Attribution aux Senons probable.\n\n"
        "Ce tresor temoigne de la richesse de l'aristocratie senone a la veille de "
        "la conquete romaine. Une partie a ete derobee lors d'un vol au musee de Sens. "
        "Les Senons continuent de faire parler d'eux 2 000 ans plus tard."
    ),
}

for ch in data["chapters"]:
    if ch["id"] != "0":
        continue
    for ev in ch["events"]:
        if ev["year"] in LONG_TEXTS:
            ev["longText"] = LONG_TEXTS[ev["year"]]
        # Image pour le menhir de Diant (prehistoire)
        if ev["year"] == -200000 or ev["year"] == -3500:
            if "dolmen" in ev.get("title", "").lower() or "menhir" in ev.get("title", "").lower():
                ev["image"] = "/images/histoire/sas_1846_pl2_menhir_diant.jpg"

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

ch0 = next(ch for ch in data["chapters"] if ch["id"] == "0")
with_long = sum(1 for ev in ch0["events"] if ev.get("longText"))
with_img = sum(1 for ev in ch0["events"] if ev.get("image"))
print(f"Chapitre 0: {len(ch0['events'])} events, {with_long} longTexts, {with_img} images")
