"""
Utilitaires partagés pour le pipeline de scraping patrimoine Sens.
"""

import json
import os
import re
import sys
import hashlib
from pathlib import Path
from datetime import datetime, timezone
from typing import Any

import yaml
from dotenv import load_dotenv

# Fix Windows console encoding (CP1252 -> UTF-8)
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Charger .env depuis le dossier gallica-rag (même projet)
ENV_PATH = Path(__file__).parent.parent / "gallica-rag" / ".env"
load_dotenv(ENV_PATH)

CONFIG_PATH = Path(__file__).parent / "config.yaml"
OUTPUT_DIR = Path(__file__).parent / "output"
IMAGES_DIR = OUTPUT_DIR / "images"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def ensure_dirs():
    """Crée les dossiers output nécessaires."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    for sub in ["pop", "persee", "facebook", "websites", "wikipedia", "commons"]:
        (OUTPUT_DIR / sub).mkdir(exist_ok=True)
        (IMAGES_DIR / sub).mkdir(exist_ok=True)


def save_json(data: Any, path: Path):
    """Sauvegarde JSON avec encoding UTF-8."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)
    print(f"  ✓ Sauvé: {path} ({len(data) if isinstance(data, list) else 1} items)")


def load_json(path: Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def slug(text: str) -> str:
    """Génère un slug URL-friendly."""
    text = text.lower().strip()
    text = re.sub(r"[àâä]", "a", text)
    text = re.sub(r"[éèêë]", "e", text)
    text = re.sub(r"[ïî]", "i", text)
    text = re.sub(r"[ôö]", "o", text)
    text = re.sub(r"[ùûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:80]


def content_hash(text: str) -> str:
    """Hash court pour dédupliquer."""
    return hashlib.md5(text.encode()).hexdigest()[:12]


def is_patrimoine_relevant(text: str, keywords: list[str] | None = None) -> bool:
    """Vérifie si un texte concerne le patrimoine."""
    if not text:
        return False
    text_lower = text.lower()
    if keywords is None:
        keywords = [
            "cathédrale", "patrimoine", "histoire", "médiéval", "église",
            "monument", "classé", "ancien", "historique", "archéologie",
            "rempart", "abbaye", "couvent", "château", "lavoir", "calvaire",
            "croix", "porte", "tour", "muraille", "hôtel particulier",
            "maison ancienne", "cailleaux", "brousse", "sens",
        ]
    return any(kw in text_lower for kw in keywords)


def normalize_item(
    source: str,
    title: str,
    content: str,
    *,
    url: str = "",
    author: str = "",
    date: str = "",
    images: list[str] | None = None,
    location: dict | None = None,
    tags: list[str] | None = None,
    metadata: dict | None = None,
    is_cailleaux: bool = False,
) -> dict:
    """
    Format unifié pour tous les items scrapés.
    Sert de base pour l'import dans heritage_items + contributions.
    """
    return {
        "id": f"{source}_{content_hash(title + content)}",
        "source": source,
        "title": title.strip(),
        "content": content.strip(),
        "url": url,
        "author": author,
        "date": date,
        "images": images or [],
        "location": location,  # {"lat": ..., "lng": ..., "address": ...}
        "tags": tags or [],
        "metadata": metadata or {},
        "is_cailleaux": is_cailleaux,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def print_banner(title: str):
    width = 60
    print()
    print("=" * width)
    print(f"  {title}")
    print("=" * width)
