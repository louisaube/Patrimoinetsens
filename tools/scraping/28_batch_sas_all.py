#!/usr/bin/env python3
"""
Extraction batch de TOUS les volumes SAS restants depuis Gallica.
Lance chaque volume séquentiellement avec pause entre chaque.
Reprend automatiquement si interrompu (sauvegarde incrémentale).

Usage:
    python 28_batch_sas_all.py              # Tous les restants
    python 28_batch_sas_all.py --batch 1    # Batch 1 seulement (1852-1863)
    python 28_batch_sas_all.py --batch 2    # Batch 2 (1872-1894)
"""

import subprocess
import sys
import time
import json
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT = Path(__file__).parent / "17_gallica_sas_slow.py"
OUTPUT_DIR = Path(__file__).parent / "output" / "gallica_sas"

# Tous les volumes restants, en batches
BATCHES = {
    1: [1852, 1853, 1854, 1861, 1863],
    2: [1872, 1877, 1885, 1888, 1894],
    3: [1895, 1897, 1900, 1903, 1904],
    4: [1906, 1908, 1909, 1910, 1911],
    5: [1912, 1913, 1916, 1917, 1925],
    6: [1927, 1929, 1931, 1934, 1936, 1937],
}

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--batch", type=int, help="Batch number (1-6)")
args = parser.parse_args()

if args.batch:
    volumes = BATCHES.get(args.batch, [])
    print(f"Batch {args.batch}: {volumes}")
else:
    volumes = []
    for b in sorted(BATCHES.keys()):
        volumes.extend(BATCHES[b])
    print(f"Tous les volumes restants: {len(volumes)}")

done = []
failed = []

for year in volumes:
    output_file = OUTPUT_DIR / f"sas_{year}_ocr.json"

    # Vérifier si déjà fait
    if output_file.exists():
        with open(output_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        chars = data.get("total_chars", 0)
        if chars > 10000:
            print(f"  {year}: deja fait ({chars/1000:.0f}K chars), skip")
            done.append(year)
            continue

    print(f"\n{'='*50}")
    print(f"  Extraction SAS {year}")
    print(f"{'='*50}")

    try:
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--year", str(year)],
            cwd=str(Path(__file__).parent),
            timeout=7200,  # 2h max par volume
        )
        if result.returncode == 0:
            done.append(year)
        else:
            print(f"  ERREUR volume {year} (code {result.returncode})")
            failed.append(year)
    except subprocess.TimeoutExpired:
        print(f"  TIMEOUT volume {year}")
        failed.append(year)
    except Exception as e:
        print(f"  EXCEPTION volume {year}: {e}")
        failed.append(year)

    # Pause longue entre volumes (politesse Gallica)
    pause = 45
    print(f"  Pause {pause}s...")
    time.sleep(pause)

# Bilan
print(f"\n{'='*50}")
print(f"  BILAN")
print(f"{'='*50}")
print(f"  Termines: {len(done)} -> {done}")
print(f"  Echecs: {len(failed)} -> {failed}")

# Stats globales
total_chars = 0
total_pages = 0
for f in sorted(OUTPUT_DIR.glob("sas_*_ocr.json")):
    with open(f, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    total_chars += data.get("total_chars", 0)
    total_pages += data.get("non_empty_pages", 0)

print(f"  Total global: {total_pages} pages, {total_chars/1000:.0f}K chars ({total_chars/1000000:.1f}M)")
