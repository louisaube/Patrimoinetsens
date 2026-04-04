#!/usr/bin/env python3
"""
11_scrape_pop_merimee.py
========================
Scrape la Plateforme Ouverte du Patrimoine (POP) — API Ministère de la Culture.
Bases : Mérimée (immeubles), Palissy (objets mobiliers), Mémoire (photos).

API ouverte, sans clé. Retourne du JSON structuré avec géoloc, datation, MH/ISMH.

Usage:
    python 11_scrape_pop_merimee.py                  # Sens uniquement
    python 11_scrape_pop_merimee.py --communes all   # Sens + communes sénonaises
    python 11_scrape_pop_merimee.py --images          # Télécharge aussi les images
"""

import argparse
import json
import time
from pathlib import Path

import httpx

# ── Config ────────────────────────────────────────────────────────────────────

POP_API = "https://api.pop.culture.gouv.fr"
OUTPUT_DIR = Path(__file__).parent / "output" / "pop_merimee"

# Communes du Sénonais à scraper
COMMUNES_SENS = [
    "Sens",
]

COMMUNES_SENONAIS = [
    "Sens", "Villeneuve-sur-Yonne", "Villeneuve-l'Archevêque",
    "Pont-sur-Yonne", "Paron", "Saint-Clément", "Malay-le-Grand",
    "Nailly", "Subligny", "Saligny", "Sergines", "Courlon-sur-Yonne",
    "Villethierry", "Gisy-les-Nobles", "Thorigny-sur-Oreuse",
    "Saint-Martin-du-Tertre", "Marsangy", "Rosoy", "Maillot",
    "Véron", "Saint-Valérien", "Collemiers", "Soucy",
    "Voisines", "Fontaine-la-Gaillarde", "Cuy",
]

# Champs POP à extraire (Mérimée)
MERIMEE_FIELDS = [
    "REF",       # Référence Mérimée (PA/IA)
    "TICO",      # Titre courant
    "DENO",      # Dénomination (église, château, etc.)
    "DPRO",      # Date de protection MH
    "PPRO",      # Précision sur protection
    "PROT",      # Type de protection (classé, inscrit)
    "SCLE",      # Siècle
    "DATE",      # Datation
    "HIST",      # Historique
    "DESC",      # Description
    "AUTR",      # Auteurs (architectes, etc.)
    "COM",       # Commune
    "WCOM",      # Commune actuelle
    "WADRS",     # Adresse
    "POP_COORDONNEES",  # Coordonnées GPS
    "DENQ",      # Date enquête
    "COPY",      # Copyright
    "MEMOIRE",   # Liens vers photos (base Mémoire)
    "IMG",       # Images directes
    "LBASE",     # Liens Palissy
]

# Champs Palissy (objets mobiliers)
PALISSY_FIELDS = [
    "REF", "TICO", "DENO", "DPRO", "PROT", "SCLE", "DATE",
    "HIST", "DESC", "AUTR", "COM", "WADRS",
    "POP_COORDONNEES", "IMG", "COPY",
    "EDIF",      # Édifice contenant l'objet
    "EMPL",      # Emplacement dans l'édifice
    "CATE",      # Catégorie technique
    "MATR",      # Matériaux
    "DIMS",      # Dimensions
]


def search_merimee(commune: str, page: int = 1, size: int = 100) -> dict:
    """Recherche dans la base Mérimée (immeubles protégés)."""
    url = f"{POP_API}/search/merimee"
    body = {
        "field": MERIMEE_FIELDS,
        "query": {
            "bool": {
                "must": [
                    {"multi_match": {"query": commune, "fields": ["COM", "WCOM"]}}
                ]
            }
        },
        "from": (page - 1) * size,
        "size": size,
    }
    resp = httpx.post(url, json=body, timeout=30)
    resp.raise_for_status()
    return resp.json()


def search_palissy(commune: str, page: int = 1, size: int = 100) -> dict:
    """Recherche dans la base Palissy (objets mobiliers)."""
    url = f"{POP_API}/search/palissy"
    body = {
        "field": PALISSY_FIELDS,
        "query": {
            "bool": {
                "must": [
                    {"multi_match": {"query": commune, "fields": ["COM"]}}
                ]
            }
        },
        "from": (page - 1) * size,
        "size": size,
    }
    resp = httpx.post(url, json=body, timeout=30)
    resp.raise_for_status()
    return resp.json()


def search_memoire(ref_merimee: str, size: int = 50) -> dict:
    """Recherche les photos liées à une fiche Mérimée dans la base Mémoire."""
    url = f"{POP_API}/search/memoire"
    body = {
        "field": ["REF", "TICO", "TYPDOC", "COPY", "IMG", "DATPV", "AUTP", "LBASE"],
        "query": {
            "bool": {
                "must": [
                    {"match": {"LBASE": ref_merimee}}
                ]
            }
        },
        "size": size,
    }
    resp = httpx.post(url, json=body, timeout=30)
    resp.raise_for_status()
    return resp.json()


def download_image(url: str, dest: Path) -> bool:
    """Télécharge une image depuis POP."""
    try:
        resp = httpx.get(url, timeout=30, follow_redirects=True)
        resp.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(resp.content)
        return True
    except Exception as e:
        print(f"  ⚠ Image {url}: {e}")
        return False


def extract_image_urls(item: dict) -> list[str]:
    """Extrait les URLs d'images depuis une fiche POP."""
    urls = []
    # Champ IMG direct
    if item.get("IMG"):
        imgs = item["IMG"] if isinstance(item["IMG"], list) else [item["IMG"]]
        for img in imgs:
            if img and isinstance(img, str):
                if img.startswith("http"):
                    urls.append(img)
                else:
                    urls.append(f"https://s3.eu-west-3.amazonaws.com/pop-phototeque/{img}")
    return urls


def scrape_commune(commune: str, download_images: bool = False) -> dict:
    """Scrape toutes les données POP pour une commune."""
    print(f"\n{'='*60}")
    print(f"  📍 {commune}")
    print(f"{'='*60}")

    result = {
        "commune": commune,
        "merimee": [],
        "palissy": [],
        "images_downloaded": 0,
    }

    # ── Mérimée (immeubles) ───────────────────────────────────────────────
    print(f"\n  🏛  Mérimée (immeubles protégés)...")
    page = 1
    total = None
    while True:
        data = search_merimee(commune, page=page)
        if total is None:
            total = data.get("total", 0)
            print(f"     → {total} fiches trouvées")

        hits = data.get("data", []) or data.get("hits", {}).get("hits", [])
        if not hits:
            break

        for hit in hits:
            item = hit.get("_source", hit)
            result["merimee"].append(item)

            # Photos associées via base Mémoire
            ref = item.get("REF", "")
            if ref:
                try:
                    photos = search_memoire(ref)
                    photo_hits = photos.get("data", []) or photos.get("hits", {}).get("hits", [])
                    item["_photos_memoire"] = [
                        p.get("_source", p) for p in photo_hits
                    ]
                except Exception:
                    pass

            # Download images si demandé
            if download_images:
                img_urls = extract_image_urls(item)
                for i, url in enumerate(img_urls):
                    safe_ref = ref.replace("/", "_")
                    dest = OUTPUT_DIR / "images" / commune / f"{safe_ref}_{i}.jpg"
                    if download_image(url, dest):
                        result["images_downloaded"] += 1

            time.sleep(0.1)  # Rate limiting doux

        if len(result["merimee"]) >= total:
            break
        page += 1

    # ── Palissy (objets mobiliers) ────────────────────────────────────────
    print(f"  🪑 Palissy (objets mobiliers)...")
    page = 1
    total = None
    while True:
        data = search_palissy(commune, page=page)
        if total is None:
            total = data.get("total", 0)
            print(f"     → {total} fiches trouvées")

        hits = data.get("data", []) or data.get("hits", {}).get("hits", [])
        if not hits:
            break

        for hit in hits:
            item = hit.get("_source", hit)
            result["palissy"].append(item)

            if download_images:
                img_urls = extract_image_urls(item)
                ref = item.get("REF", "unknown")
                for i, url in enumerate(img_urls):
                    safe_ref = ref.replace("/", "_")
                    dest = OUTPUT_DIR / "images" / commune / f"{safe_ref}_{i}.jpg"
                    if download_image(url, dest):
                        result["images_downloaded"] += 1

            time.sleep(0.1)

        if len(result["palissy"]) >= total:
            break
        page += 1

    print(f"\n  ✅ {commune}: {len(result['merimee'])} immeubles, "
          f"{len(result['palissy'])} objets, {result['images_downloaded']} images")

    return result


def main():
    parser = argparse.ArgumentParser(description="Scrape POP/Mérimée pour le Sénonais")
    parser.add_argument("--communes", default="sens",
                        choices=["sens", "all"],
                        help="'sens' = Sens seule, 'all' = tout le Sénonais")
    parser.add_argument("--images", action="store_true",
                        help="Télécharger aussi les images")
    args = parser.parse_args()

    communes = COMMUNES_SENS if args.communes == "sens" else COMMUNES_SENONAIS
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("╔══════════════════════════════════════════════════════════╗")
    print("║  POP/Mérimée — Plateforme Ouverte du Patrimoine        ║")
    print(f"║  {len(communes)} commune(s) à scraper                          ║")
    print(f"║  Images: {'OUI' if args.images else 'NON'}                                         ║")
    print("╚══════════════════════════════════════════════════════════╝")

    all_results = []
    for commune in communes:
        result = scrape_commune(commune, download_images=args.images)
        all_results.append(result)
        time.sleep(0.5)  # Pause entre communes

    # ── Sauvegarde JSON ───────────────────────────────────────────────────
    output_file = OUTPUT_DIR / "pop_merimee_senonais.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    # ── Stats finales ─────────────────────────────────────────────────────
    total_merimee = sum(len(r["merimee"]) for r in all_results)
    total_palissy = sum(len(r["palissy"]) for r in all_results)
    total_images = sum(r["images_downloaded"] for r in all_results)

    print(f"\n{'='*60}")
    print(f"  📊 TOTAL: {total_merimee} immeubles, {total_palissy} objets, {total_images} images")
    print(f"  💾 Sauvé dans: {output_file}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
