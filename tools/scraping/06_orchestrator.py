#!/usr/bin/env python3
"""
Orchestrateur — lance tous les scrapers et fusionne les résultats.

Usage:
    python 06_orchestrator.py          # tout lancer
    python 06_orchestrator.py --merge   # fusionner seulement (si déjà scrapé)
    python 06_orchestrator.py --stats   # stats seulement
"""

import sys
import subprocess
import json
from pathlib import Path
from collections import Counter

from shared import (
    load_config, ensure_dirs, save_json, load_json,
    print_banner, OUTPUT_DIR,
)


SCRIPTS = [
    ("01_pop_merimee.py", "POP / Mérimée / Palissy"),
    ("02_persee_cailleaux.py", "Persée — Publications académiques"),
    ("03_facebook_apify.py", "Facebook — Groupes & Pages"),
    ("04_wikipedia_commons.py", "Wikipedia + Commons"),
    ("05_websites_firecrawl.py", "Sites web patrimoine"),
]


def run_all():
    """Lance tous les scrapers séquentiellement."""
    print_banner("Orchestrateur — Scraping patrimoine Sens")
    ensure_dirs()

    results = {}
    for script, label in SCRIPTS:
        print(f"\n{'='*60}")
        print(f"  LANCEMENT: {label}")
        print(f"  Script: {script}")
        print(f"{'='*60}")

        script_path = Path(__file__).parent / script
        if not script_path.exists():
            print(f"  ⚠ Script non trouvé: {script}")
            results[script] = "SKIP"
            continue

        try:
            proc = subprocess.run(
                [sys.executable, str(script_path)],
                cwd=str(Path(__file__).parent),
                capture_output=False,  # afficher la sortie en direct
                timeout=1800,  # 30 min max par script
            )
            results[script] = "OK" if proc.returncode == 0 else f"ERROR (code {proc.returncode})"
        except subprocess.TimeoutExpired:
            results[script] = "TIMEOUT"
            print(f"  ⚠ Timeout après 30 min")
        except Exception as e:
            results[script] = f"EXCEPTION: {e}"

    print(f"\n{'='*60}")
    print("  RÉSULTATS SCRAPING")
    print(f"{'='*60}")
    for script, status in results.items():
        icon = "✓" if status == "OK" else "⚠"
        print(f"  {icon} {script}: {status}")

    return results


def merge_all():
    """Fusionne tous les résultats en un seul fichier JSON."""
    print_banner("Fusion des résultats")
    ensure_dirs()

    all_items = []
    sources_count = Counter()

    # Charger chaque source
    json_files = {
        "pop": OUTPUT_DIR / "pop" / "all_notices.json",
        "persee": OUTPUT_DIR / "persee" / "all_articles.json",
        "facebook": OUTPUT_DIR / "facebook" / "all_posts.json",
        "wikipedia": OUTPUT_DIR / "wikipedia" / "all_articles.json",
        "websites": OUTPUT_DIR / "websites" / "all_pages.json",
    }

    for source, path in json_files.items():
        if path.exists():
            items = load_json(path)
            print(f"  {source}: {len(items)} items")
            all_items.extend(items)
            sources_count[source] = len(items)
        else:
            print(f"  {source}: (pas encore scrapé)")

    # Dédupliquer par ID
    seen = set()
    unique = []
    for item in all_items:
        if item["id"] not in seen:
            seen.add(item["id"])
            unique.append(item)

    # Séparer les items Cailleaux
    cailleaux = [i for i in unique if i.get("is_cailleaux")]

    # Trier par pertinence (Cailleaux en premier, puis par source)
    source_priority = {
        "pop_merimee": 1, "pop_palissy": 2, "pop_memoire": 3,
        "persee": 4,
        "facebook_groupe-histoire-sens": 5,
        "wikipedia": 6,
    }
    unique.sort(key=lambda x: (
        0 if x.get("is_cailleaux") else 1,
        source_priority.get(x["source"], 10),
    ))

    # Stats images
    total_images = sum(len(i.get("images", [])) for i in unique)
    total_local = sum(len(i.get("images_local", [])) for i in unique)

    print(f"\n{'='*60}")
    print(f"  CORPUS FUSIONNÉ")
    print(f"{'='*60}")
    print(f"  Items totaux: {len(unique)}")
    print(f"  Doublons supprimés: {len(all_items) - len(unique)}")
    print(f"  Items Cailleaux: {len(cailleaux)}")
    print(f"  Images référencées: {total_images}")
    print(f"  Images téléchargées: {total_local}")
    print(f"\n  Par source:")
    for source, count in sources_count.most_common():
        print(f"    {source}: {count}")
    print(f"{'='*60}")

    # Sauvegarder
    save_json(unique, OUTPUT_DIR / "corpus_patrimoine_sens.json")
    if cailleaux:
        save_json(cailleaux, OUTPUT_DIR / "corpus_cailleaux.json")

    # Générer un résumé texte
    summary = {
        "total_items": len(unique),
        "cailleaux_items": len(cailleaux),
        "total_images": total_images,
        "local_images": total_local,
        "by_source": dict(sources_count),
        "top_tags": Counter(
            tag for item in unique for tag in item.get("tags", [])
        ).most_common(20),
    }
    save_json(summary, OUTPUT_DIR / "corpus_summary.json")

    return unique


def print_stats():
    """Affiche les stats du corpus existant."""
    summary_path = OUTPUT_DIR / "corpus_summary.json"
    if summary_path.exists():
        summary = load_json(summary_path)
        print_banner("Stats du corpus")
        print(f"  Items totaux: {summary['total_items']}")
        print(f"  Items Cailleaux: {summary['cailleaux_items']}")
        print(f"  Images: {summary['total_images']} (dont {summary['local_images']} téléchargées)")
        print(f"\n  Par source:")
        for source, count in summary["by_source"].items():
            print(f"    {source}: {count}")
        print(f"\n  Top tags:")
        for tag, count in summary.get("top_tags", []):
            print(f"    {tag}: {count}")
    else:
        print("Pas de corpus encore. Lance 06_orchestrator.py d'abord.")


def main():
    args = sys.argv[1:]

    if "--merge" in args:
        merge_all()
    elif "--stats" in args:
        print_stats()
    else:
        run_all()
        merge_all()


if __name__ == "__main__":
    main()
