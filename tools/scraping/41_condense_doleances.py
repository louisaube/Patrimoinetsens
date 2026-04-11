#!/usr/bin/env python3
"""Condense les 28 doleances du chapitre VIa en ~11 events (8 individuels + 3 syntheses)."""
import json, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

path = Path(__file__).parent.parent.parent / "public" / "data" / "histoire-chapitres.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

via = next(ch for ch in data["chapters"] if ch["id"] == "VIa")

# Identifier les events de doleances (year=1789 et index 1-28 dans la liste)
dol_events = []
non_dol_events = []
for ev in via["events"]:
    if ev["year"] == 1789:
        dol_events.append(ev)
    else:
        non_dol_events.append(ev)

print(f"Doleances trouvees: {len(dol_events)}")
print(f"Non-doleances: {len(non_dol_events)}")

# Les 8 doleances INDIVIDUELLES a garder (les plus percutantes)
KEEP_TITLES_START = [
    "les dol",           # intro generale
    "le sel a 14",       # economie vivante
    "les pigeons du",    # absurdite feodale
    "le coton de saint", # esclavage - surprise
    "137 enfants",       # travail enfants - choc
    "746 femmes",        # lacune femmes
    "la louptiere",      # impense monarchique
    "fontaine-la-gailla", # impense + sante
]

keep = []
merge_eco = []
merge_social = []
merge_impense = []

for ev in dol_events:
    title_low = ev["title"].lower()
    kept = False
    for prefix in KEEP_TITLES_START:
        if prefix in title_low:
            keep.append(ev)
            kept = True
            break
    if not kept:
        # Classer dans une categorie de synthese
        if any(w in title_low for w in ["vigneron", "minage", "libre-echange", "dime",
                                         "sens en 1789", "flotteurs", "chigy"]):
            merge_eco.append(ev)
        elif any(w in title_low for w in ["chemins", "bouillon", "paron", "justice",
                                           "maitre d'ecole", "ecole"]):
            merge_social.append(ev)
        else:
            merge_impense.append(ev)

print(f"\nGardes individuellement: {len(keep)}")
print(f"A fusionner (eco): {len(merge_eco)}")
print(f"A fusionner (social): {len(merge_social)}")
print(f"A fusionner (impense): {len(merge_impense)}")

# Creer les 3 events de synthese
synth_eco = {
    "year": 1789,
    "title": "L'economie senonaise en 1789 : vignerons a 2%, dime ecrasante et libre-echange anglais",
    "text": (
        "Les cahiers de doleances peignent une economie senonaise asphyxiee. "
        "Le vigneron de Paron travaille pour 2% de marge --- apres la dime, les droits "
        "seigneuriaux et les frais de culture, il ne lui reste presque rien. La dime "
        "pese plus que tous les impots royaux reunis. Le minage de Sens (taxe sur les "
        "grains vendus au marche) chasse les marchands vers Bray et Nogent. Le traite de "
        "libre-echange avec l'Angleterre (1786) fait debat : les manufactures de Sens "
        "craignent la concurrence anglaise. A Chigy, on reclame : 'Supprimez les "
        "intermediaires et les coffres seront remplis.' A Brienon, un tiers de la "
        "population vit du flottage du bois, un metier qui fait la 'misere'. La ville "
        "compte 9 tanneries, 4 manufactures et meme un Anglais."
    ),
    "location": {"lat": 48.1970, "lng": 3.2840, "label": "Senonais --- economie en 1789"},
    "sources": list(set(
        src for ev in merge_eco for src in ev.get("sources", [])
    ))[:5],
    "heritageItemId": None,
}

synth_social = {
    "year": 1789,
    "title": "Ni bouillon, ni medecin, ni ecole : la misere sociale dans les cahiers de doleances",
    "text": (
        "Les cahiers de doleances revelent une misere sociale profonde. Les chemins de "
        "Brannay sont un bourbier qui isole les villages --- les recoltes pourrissent faute "
        "de pouvoir les transporter. A Paron, a cote de Sens, la paroisse est trop pauvre "
        "pour un maitre d'ecole. Le cure de Villadin temoigne : ses paroissiens n'ont 'ni "
        "bouillon, ni medecin' --- pas meme un chirurgien a 3 lieues. La justice est un "
        "luxe ruineux : 'Il vaut mieux subir une injustice que d'y recourir.' Fontaine-la-"
        "Gaillarde invente un proto-systeme de sante publique gratuite. Foucherolles ecrit "
        "un proto-habeas corpus."
    ),
    "location": {"lat": 48.1970, "lng": 3.2840, "label": "Villages du Senonais --- misere sociale"},
    "sources": list(set(
        src for ev in merge_social for src in ev.get("sources", [])
    ))[:5],
    "heritageItemId": None,
}

synth_impense = {
    "year": 1789,
    "title": "L'impense de 1789 : la noblesse accepte l'impot, mais abolir le roi est impensable",
    "text": (
        "Les cahiers de doleances revelent ce que les Senonais de 1789 ne peuvent pas "
        "penser. La noblesse senonaise accepte l'impot la premiere --- elle le propose "
        "spontanement. Le clerge denonce la gabelle mais defend la dime. La noblesse "
        "refuse le rachat des droits feodaux : 'la propriete est sacree.' Subligny exige "
        "les titres : 'montrez-nous le papier' qui justifie vos droits. Paron revendique "
        "le franc-alleu : 'nous ne devons rien au seigneur.' Mais Fontaine-la-Gaillarde "
        "vote encore une messe pour le roi, et La Louptiere ecrit : 'Que la Noblesse garde "
        "ses titres.' L'abolition de la feodalite ? Impensable. La Republique ? Inimaginable."
    ),
    "location": {"lat": 48.1970, "lng": 3.2840, "label": "Senonais --- impenses de 1789"},
    "sources": list(set(
        src for ev in merge_impense for src in ev.get("sources", [])
    ))[:5],
    "heritageItemId": None,
}

# Reconstruire le chapitre VIa
new_via_events = non_dol_events + keep + [synth_eco, synth_social, synth_impense]
new_via_events.sort(key=lambda e: e["year"])
via["events"] = new_via_events

# Sauvegarder
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

total = sum(len(ch["events"]) for ch in data["chapters"])
print(f"\nResultat:")
print(f"  VIa: {len(via['events'])} events (etait 50)")
print(f"  Doleances: {len(keep)} individuelles + 3 syntheses = {len(keep)+3}")
print(f"  Total general: {total} events")
