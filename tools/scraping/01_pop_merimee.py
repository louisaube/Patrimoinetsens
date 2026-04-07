#!/usr/bin/env python3
"""
Scraper Monuments Historiques via data.culture.gouv.fr (Open Data).
Bases : Immeubles protégés (Mérimée) + Objets mobiliers (Palissy).

API ouverte, sans clé. JSON structuré avec géoloc, datation, protection MH/ISMH.

Usage:
    python 01_pop_merimee.py
"""

import time
import httpx
from pathlib import Path

from shared import (
    load_config, ensure_dirs, save_json, normalize_item,
    print_banner, OUTPUT_DIR, IMAGES_DIR, slug,
)

DATA_CULTURE_API = "https://data.culture.gouv.fr/api/records/1.0/search/"

# Datasets Open Data du Ministère de la Culture
DATASETS = {
    "merimee": "liste-des-immeubles-proteges-au-titre-des-monuments-historiques",
    "palissy": "liste-des-objets-mobiliers-propriete-publique-classes-au-titre-des-monuments",
}

# Communes du Sénonais
COMMUNES = [
    "Sens", "Paron", "Saint-Clément", "Malay-le-Grand",
    "Villeneuve-sur-Yonne", "Pont-sur-Yonne", "Joigny",
    "Saint-Julien-du-Sault",
]

BATCH_SIZE = 100


def fetch_records(dataset: str, commune: str, start: int = 0) -> dict:
    """Récupère les fiches d'un dataset pour une commune."""
    params = {
        "dataset": dataset,
        "q": commune,
        "rows": BATCH_SIZE,
        "start": start,
    }
    resp = httpx.get(DATA_CULTURE_API, params=params, timeout=20)
    resp.raise_for_status()
    return resp.json()


def fetch_all_records(dataset: str, commune: str) -> list[dict]:
    """Récupère toutes les fiches paginées."""
    all_records = []
    start = 0

    while True:
        data = fetch_records(dataset, commune, start)
        total = data.get("nhits", 0)
        records = data.get("records", [])

        if not records:
            break

        all_records.extend(records)
        start += BATCH_SIZE
        print(f"    {len(all_records)}/{total}...")

        if start >= total:
            break

        time.sleep(0.3)

    return all_records


def record_to_normalized(record: dict, base: str) -> dict:
    """Convertit une fiche Open Data en format unifié."""
    f = record.get("fields", {})

    # Titre
    title = (
        f.get("titre_editorial_de_la_notice", "")
        or f.get("appellation_courante", "")
        or f.get("denomination_de_l_edifice", "")
        or f.get("reference", "")
    )

    # Construire le contenu textuel
    parts = []
    field_map = {
        "titre_editorial_de_la_notice": "Titre",
        "denomination_de_l_edifice": "Type",
        "precision_de_la_protection": "Protection",
        "date_et_typologie_de_la_protection": "Date protection",
        "siecle_de_la_campagne_principale_de_construction": "Siecle",
        "statut_juridique_de_l_edifice": "Statut",
        "domaine": "Domaine",
        "auteur_de_l_edifice": "Auteur",
        "historique": "Historique",
        "description": "Description",
        "elements_remarquables": "Elements remarquables",
        "observations": "Observations",
        "materiaux_des_murs": "Materiaux murs",
        "materiaux_de_la_couverture": "Couverture",
    }

    for field_key, label in field_map.items():
        val = f.get(field_key, "")
        if val and str(val).strip():
            parts.append(f"**{label}** : {val}")

    content = "\n\n".join(parts) if parts else title

    # GPS
    coords = f.get("coordonnees_au_format_wgs84", [])
    location = None
    if coords and len(coords) == 2:
        location = {
            "lat": coords[0],
            "lng": coords[1],
            "commune": f.get("commune_forme_editoriale", ""),
        }

    # Référence et lien POP
    ref = f.get("reference", "")
    pop_url = f"https://www.pop.culture.gouv.fr/notice/merimee/{ref}" if base == "merimee" else ""
    if base == "palissy":
        pop_url = f"https://www.pop.culture.gouv.fr/notice/palissy/{ref}"

    # Liens vers photos (Mémoire) et objets (Palissy)
    liens_palissy = f.get("lien_vers_la_base_palissy", "")
    liens_memoire = f.get("lien_vers_la_base_memoire", "")

    # Tags
    tags = []
    prot = f.get("typologie_de_la_protection", "")
    if prot:
        tags.append(prot)
    domaine = f.get("domaine", "")
    if domaine:
        tags.append(domaine)

    # Détecter Cailleaux dans les champs texte
    all_text = content.lower()
    is_cailleaux = "cailleaux" in all_text

    # Images depuis les liens Mémoire
    images = []
    if liens_memoire:
        for url in liens_memoire.split(";"):
            url = url.strip()
            if url.startswith("http"):
                images.append(url)

    return normalize_item(
        source=f"pop_{base}",
        title=title,
        content=content,
        url=pop_url,
        author="Ministere de la Culture",
        date=f.get("date_et_typologie_de_la_protection", ""),
        images=images[:10],
        location=location,
        tags=tags,
        metadata={
            "ref": ref,
            "base": base,
            "protection": prot,
            "siecle": f.get("siecle_de_la_campagne_principale_de_construction", ""),
            "commune": f.get("commune_forme_editoriale", ""),
            "departement": f.get("departement_en_lettres", ""),
            "liens_palissy": liens_palissy,
            "liens_memoire": liens_memoire,
        },
        is_cailleaux=is_cailleaux,
    )


def main():
    print_banner("Scraping Monuments Historiques — data.culture.gouv.fr")
    ensure_dirs()

    all_items = []

    for base_name, dataset_id in DATASETS.items():
        print(f"\n--- {base_name.upper()} ---")

        for commune in COMMUNES:
            print(f"\n  {commune}:")
            records = fetch_all_records(dataset_id, commune)
            print(f"  -> {len(records)} fiches")

            for rec in records:
                item = record_to_normalized(rec, base_name)
                all_items.append(item)

            time.sleep(0.5)

    # Dédupliquer par référence
    seen = set()
    unique = []
    for item in all_items:
        ref = item["metadata"].get("ref", item["id"])
        if ref not in seen:
            seen.add(ref)
            unique.append(item)

    cailleaux_items = [i for i in unique if i["is_cailleaux"]]
    merimee_count = sum(1 for i in unique if i["source"] == "pop_merimee")
    palissy_count = sum(1 for i in unique if i["source"] == "pop_palissy")

    print(f"\n{'='*60}")
    print(f"  TOTAL: {len(unique)} fiches uniques")
    print(f"  Merimee (immeubles): {merimee_count}")
    print(f"  Palissy (objets): {palissy_count}")
    print(f"  Mentions Cailleaux: {len(cailleaux_items)}")
    print(f"{'='*60}")

    save_json(unique, OUTPUT_DIR / "pop" / "all_notices.json")
    if cailleaux_items:
        save_json(cailleaux_items, OUTPUT_DIR / "pop" / "cailleaux_mentions.json")


if __name__ == "__main__":
    main()
