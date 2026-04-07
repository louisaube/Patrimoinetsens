#!/usr/bin/env python3
"""Lance l'extraction de plusieurs volumes SAS en sequence, avec pause entre chaque."""

import subprocess
import sys
import time
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Volumes prioritaires (pas encore extraits)
VOLUMES = [
    1851,  # Premiers travaux SAS
    1858,  # Fouilles
    1863,  # Armorial Dey
    1872,  # Post-guerre 1870
    1885,  # Restaurations
    1894,  # Fin de siecle
    1900,  # Tournant du siecle
    1906,  # Separation Eglise-Etat
    1910,  # Crue + fouilles
    1913,  # Avant-guerre
]

SCRIPT = Path(__file__).parent / "17_gallica_sas_slow.py"
OUTPUT_DIR = Path(__file__).parent / "output" / "gallica_sas"

done = []
for year in VOLUMES:
    output_file = OUTPUT_DIR / f"sas_{year}_ocr.json"
    if output_file.exists():
        print(f"  {year}: deja fait, skip")
        done.append(year)
        continue

    print(f"\n{'='*50}")
    print(f"  Extraction SAS {year}")
    print(f"{'='*50}")

    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--year", str(year)],
        cwd=str(Path(__file__).parent),
        timeout=3600,  # 60 min max par volume
    )

    if result.returncode == 0:
        done.append(year)
    else:
        print(f"  ERREUR volume {year}, on continue...")

    # Pause longue entre volumes (humain qui fait autre chose)
    pause = 30
    print(f"  Pause {pause}s avant le prochain volume...")
    time.sleep(pause)

print(f"\n{'='*50}")
print(f"  TERMINE: {len(done)}/{len(VOLUMES)} volumes extraits")
print(f"{'='*50}")

# Stats
import json
total_chars = 0
for year in done:
    output_file = OUTPUT_DIR / f"sas_{year}_ocr.json"
    if output_file.exists():
        with open(output_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        chars = data.get("total_chars", 0)
        total_chars += chars
        print(f"  {year}: {chars/1000:.0f}K chars")

print(f"\n  Total: {total_chars/1000:.0f}K chars")
