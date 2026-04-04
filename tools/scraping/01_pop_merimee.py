#!/usr/bin/env python3
"""
Scraper POP / Mérimée / Palissy / Mémoire
API officielle du Ministère de la Culture — pas de clé requise.

Usage:
    python 01_pop_merimee.py
"""

import httpx
import time
from pathlib import Path

from shared import (
    load_config, ensure_dirs, save_json, normalize_item,
    print_banner, OUTPUT_DIR, IMAGES_DIR, slug,
)

POP_SEARCH = "https://api.pop.culture.gouv.fr/search"
POP_NOTICE = "https://api.pop.culture.gouv.fr/notice"
BATCH_SIZE = 100


def search_pop(index: str, commune: str, departement: str) -> list[dict]:
    """Recherche dans une base POP (merimee, palissy, memoire)."""
    items = []
    offset = 0

    while True:
        body = {
            "mainSearch": "",
            "qb": [
                {"field": "COM.keyword", "value": commune, "combinator": "AND", "operator": "==="},
                {"field": "DPT.keyword", "value": departement, "combinator": "AND", "operator": "==="},
            ],
            "size": BATCH_SIZE,
            "from": offset,
        }

        resp = httpx.post(
            f"{POP_SEARCH}/{index}",
            json=body,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()

        hits = data.get("data", [])
        total = data.get("total", 0)

        if not hits:
            break

        items.extend(hits)
        offset += BATCH_SIZE
        print(f"  {index}: {len(items)}/{total} fiches...")

        if offset >= total:
            break

        time.sleep(0.3)  # politesse

    return items


def fetch_notice(index: str, ref: str) -> dict | None:
    """Récupère la fiche complète d'une notice."""
    try:
        resp = httpx.get(f"{POP_NOTICE}/{index}/{ref}", timeout=15)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        print(f"  ⚠ Erreur notice {ref}: {e}")
    return None


def extract_images(notice: dict, index: str) -> list[str]:
    """Extrait les URLs des images d'une notice POP."""
    images = []
    # Champ MEMOIRE pour les photos liées
    for mem_ref in notice.get("MEMOIRE", []):
        if isinstance(mem_ref, dict):
            url = mem_ref.get("url", "")
        else:
            url = f"https://s3.eu-west-3.amazonaws.com/pop-phototeque/{mem_ref}"
        if url:
            images.append(url)
    # Champ IMG direct
    for img in notice.get("IMG", []):
        if img and isinstance(img, str):
            if img.startswith("http"):
                images.append(img)
            else:
                images.append(f"https://s3.eu-west-3.amazonaws.com/pop-phototeque/{img}")
    return images


def download_images(images: list[str], dest_dir: Path, prefix: str) -> list[str]:
    """Télécharge les images et retourne les chemins locaux."""
    local_paths = []
    for i, url in enumerate(images[:10]):  # max 10 images par notice
        try:
            resp = httpx.get(url, timeout=15, follow_redirects=True)
            if resp.status_code == 200 and len(resp.content) > 1000:
                ext = "jpg"
                if "png" in resp.headers.get("content-type", ""):
                    ext = "png"
                fname = f"{prefix}_{i:02d}.{ext}"
                path = dest_dir / fname
                path.write_bytes(resp.content)
                local_paths.append(str(path))
                time.sleep(0.2)
        except Exception as e:
            print(f"  ⚠ Image {url[:60]}: {e}")
    return local_paths


def pop_to_normalized(notice: dict, index: str) -> dict:
    """Convertit une notice POP en format unifié."""
    ref = notice.get("REF", "")
    titre = notice.get("TICO", notice.get("TITR", notice.get("EDIF", "")))

    # Construire le contenu textuel riche
    parts = []
    for field, label in [
        ("HIST", "Historique"),
        ("DESC", "Description"),
        ("PROT", "Protection"),
        ("DPRO", "Date protection"),
        ("SCLE", "Siècle"),
        ("DATE", "Date"),
        ("AUTR", "Auteur"),
        ("REPR", "Représentation"),
        ("PDEN", "Dénomination"),
        ("LOCA", "Localisation"),
        ("ADRS", "Adresse"),
        ("STAT", "Statut"),
        ("OBS", "Observations"),
        ("INTE", "Intérêt"),
    ]:
        val = notice.get(field)
        if val:
            if isinstance(val, list):
                val = " ; ".join(str(v) for v in val if v)
            if val and str(val).strip():
                parts.append(f"**{label}** : {val}")

    content = "\n\n".join(parts) if parts else titre

    # Localisation GPS
    location = None
    lat = notice.get("POP_COORDONNEES", {})
    if isinstance(lat, dict) and lat.get("lat"):
        location = {
            "lat": lat["lat"],
            "lng": lat["lon"],
            "address": notice.get("ADRS", ""),
            "commune": notice.get("COM", "Sens"),
        }

    # Tags
    tags = []
    for t in notice.get("DENO", []):
        if t:
            tags.append(t)
    prot = notice.get("PROT", "")
    if prot:
        tags.append(str(prot))

    images = extract_images(notice, index)

    # Détecter si Cailleaux est cité
    all_text = content.lower() + " " + str(notice.get("BIBL", "")).lower()
    is_cailleaux = "cailleaux" in all_text

    return normalize_item(
        source=f"pop_{index}",
        title=titre or ref,
        content=content,
        url=f"https://www.pop.culture.gouv.fr/notice/{index}/{ref}",
        author="Ministère de la Culture",
        date=str(notice.get("DMIS", "")),
        images=images,
        location=location,
        tags=tags,
        metadata={
            "ref": ref,
            "base": index,
            "protection": str(notice.get("PROT", "")),
            "siecle": notice.get("SCLE", []),
            "bibliographie": notice.get("BIBL", ""),
        },
        is_cailleaux=is_cailleaux,
    )


def main():
    print_banner("Scraping POP / Mérimée / Palissy / Mémoire")
    config = load_config()
    ensure_dirs()
    pop_cfg = config["pop"]

    all_items = []
    all_images_downloaded = 0

    for base_name, base_cfg in pop_cfg["bases"].items():
        communes = [base_cfg["query_commune"]] + pop_cfg.get("communes_extra", [])

        for commune in communes:
            print(f"\n→ {base_name.upper()} — {commune}")
            hits = search_pop(
                index=base_cfg["index"],
                commune=commune,
                departement=base_cfg["query_departement"],
            )
            print(f"  {len(hits)} résultats bruts")

            for hit in hits:
                ref = hit.get("REF", "")
                if not ref:
                    continue

                # Récupérer la notice complète
                notice = fetch_notice(base_cfg["index"], ref)
                if not notice:
                    continue

                item = pop_to_normalized(notice, base_cfg["index"])

                # Télécharger les images
                if item["images"]:
                    dest = IMAGES_DIR / "pop" / slug(item["title"])
                    dest.mkdir(parents=True, exist_ok=True)
                    local = download_images(item["images"], dest, slug(item["title"]))
                    item["images_local"] = local
                    all_images_downloaded += len(local)

                all_items.append(item)
                time.sleep(0.2)

    # Dédupliquer par REF
    seen = set()
    unique = []
    for item in all_items:
        ref = item["metadata"].get("ref", item["id"])
        if ref not in seen:
            seen.add(ref)
            unique.append(item)

    # Stats
    cailleaux_items = [i for i in unique if i["is_cailleaux"]]

    print(f"\n{'='*60}")
    print(f"  TOTAL: {len(unique)} fiches uniques")
    print(f"  Images téléchargées: {all_images_downloaded}")
    print(f"  Mentions Cailleaux: {len(cailleaux_items)}")
    print(f"{'='*60}")

    save_json(unique, OUTPUT_DIR / "pop" / "all_notices.json")
    if cailleaux_items:
        save_json(cailleaux_items, OUTPUT_DIR / "pop" / "cailleaux_mentions.json")


if __name__ == "__main__":
    main()
