#!/usr/bin/env python3
"""
build_rag_index.py
==================
Construit l'index RAG à partir de TOUTES les sources accumulées.
Chaque chunk porte ses métadonnées : source, date, lieu, fiabilité.

Le but : ne JAMAIS raconter n'importe quoi. Chaque fait doit être traçable
jusqu'à sa source primaire.

Usage:
    python build_rag_index.py              # Indexer tout
    python build_rag_index.py --stats      # Stats seulement
    python build_rag_index.py --query "cathédrale gothique"  # Tester

Prérequis:
    pip install chromadb openai python-dotenv
"""

import json
import hashlib
import os
import re
import sys
from pathlib import Path
from typing import Any

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / "gallica-rag" / ".env")

BASE = Path(__file__).parent.parent.parent
SCRAPING_OUTPUT = BASE / "tools" / "scraping" / "output"
SITE_DATA = BASE / "public" / "data"
CHROMA_DIR = Path(__file__).parent / "chroma_db"

# ─── Niveaux de fiabilité ────────────────────────────────────────────────────
# 1 = source primaire (document d'archive, inscription, fouille)
# 2 = source secondaire (historien, bulletin SAS, Persée)
# 3 = source tertiaire (Wikipedia, blog, tourisme)
# 4 = témoignage (Facebook, oral)
RELIABILITY = {
    "pop_merimee": 1,
    "pop_palissy": 1,
    "sas_bulletin": 1,  # sources primaires archéologiques
    "doleances": 1,      # document d'archive
    "persee": 2,         # articles académiques
    "daguin": 2,         # historien local
    "leviste": 2,        # historien local
    "brousse": 2,        # historien local
    "cailleaux": 2,      # universitaire
    "wikipedia": 3,
    "web_tourisme": 3,
    "bainville": 2,       # historien (Histoire de France, 1924)
    "facebook": 4,
}


def chunk_text(text: str, max_chars: int = 1600, overlap: int = 200) -> list[str]:
    """Découpe un texte en chunks sémantiques (par paragraphe, puis par phrase)."""
    if len(text) <= max_chars:
        return [text]

    # D'abord essayer de couper par paragraphe
    paragraphs = text.split("\n\n")
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) + 2 <= max_chars:
            current = current + "\n\n" + para if current else para
        else:
            if current:
                chunks.append(current.strip())
            if len(para) > max_chars:
                # Paragraphe trop long → couper par phrase
                sentences = re.split(r"(?<=[.!?])\s+", para)
                current = ""
                for sent in sentences:
                    if len(current) + len(sent) + 1 <= max_chars:
                        current = current + " " + sent if current else sent
                    else:
                        if current:
                            chunks.append(current.strip())
                        current = sent
            else:
                current = para

    if current:
        chunks.append(current.strip())

    return [c for c in chunks if len(c) > 50]


def make_id(text: str, source: str) -> str:
    return hashlib.md5(f"{source}:{text[:100]}".encode()).hexdigest()[:16]


def load_all_sources() -> list[dict]:
    """Charge toutes les sources et les transforme en documents indexables."""
    documents = []

    # ── 1. Bulletins SAS (OCR) ────────────────────────────────────────
    sas_dir = SCRAPING_OUTPUT / "gallica_sas"
    for f in sorted(sas_dir.glob("sas_*_ocr.json")):
        year = int(f.stem.split("_")[1])
        with open(f, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        ark = data.get("ark", "")
        for p in data.get("pages", []):
            text = p.get("text", "")
            if len(text) < 100:
                continue
            page = p.get("page", 0)
            for chunk in chunk_text(text):
                documents.append({
                    "text": chunk,
                    "source": f"Bulletin SAS vol. {year}, p. {page}",
                    "source_type": "sas_bulletin",
                    "date": str(year),
                    "reliability": RELIABILITY["sas_bulletin"],
                    "url": f"https://gallica.bnf.fr/ark:/12148/{ark}/f{page}",
                })

    # ── 2. Cahiers de doléances ───────────────────────────────────────
    dol_path = SCRAPING_OUTPUT / "doleances" / "cahiers_doleances_sens_1789.txt"
    if dol_path.exists():
        with open(dol_path, "r", encoding="utf-8") as f:
            text = f.read()
        # Découper en blocs de ~2000 chars
        lines = text.split("\n")
        block = ""
        block_start = 0
        for i, line in enumerate(lines):
            block += line + "\n"
            if len(block) > 1600:
                for chunk in chunk_text(block):
                    documents.append({
                        "text": chunk,
                        "source": f"Porée, Cahiers de doléances bailliage de Sens, 1908, ~l.{block_start}",
                        "source_type": "doleances",
                        "date": "1789",
                        "reliability": RELIABILITY["doleances"],
                        "url": "https://archive.org/stream/dpartementdelyon00pore",
                    })
                block = ""
                block_start = i + 1

    # ── 3. Daguin ─────────────────────────────────────────────────────
    daguin_path = SCRAPING_OUTPUT / "daguin" / "daguin_full_crawl.json"
    if daguin_path.exists():
        with open(daguin_path, "r", encoding="utf-8") as f:
            pages = json.load(f)
        for p in pages:
            text = p.get("content", "")
            if len(text) < 100:
                continue
            for chunk in chunk_text(text):
                documents.append({
                    "text": chunk,
                    "source": f"Daguin, '{p.get('title', '')[:60]}'",
                    "source_type": "daguin",
                    "date": "",
                    "reliability": RELIABILITY["daguin"],
                    "url": p.get("url", ""),
                })

    # ── 4. Corpus scrapé (POP, Facebook, etc.) ────────────────────────
    corpus_path = SCRAPING_OUTPUT / "corpus_patrimoine_sens.json"
    if corpus_path.exists():
        with open(corpus_path, "r", encoding="utf-8") as f:
            corpus = json.load(f)
        for item in corpus:
            text = item.get("content", "")
            if len(text) < 100:
                continue
            source_type = item.get("source", "unknown")
            reliability = RELIABILITY.get(source_type, 3)
            for chunk in chunk_text(text):
                documents.append({
                    "text": chunk,
                    "source": f"{source_type}: {item.get('title', '')[:60]}",
                    "source_type": source_type,
                    "date": item.get("date", ""),
                    "reliability": reliability,
                    "url": item.get("url", ""),
                })

    # ── 5. Grand Récit (événements vulgarisés) ────────────────────────
    hist_path = SITE_DATA / "histoire-chapitres.json"
    if hist_path.exists():
        with open(hist_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for ch in data.get("chapters", []):
            for ev in ch.get("events", []):
                text = ev.get("text", "")
                longText = ev.get("longText", "")
                combined = text + ("\n\n" + longText if longText else "")
                if len(combined) < 50:
                    continue
                sources_list = ev.get("sources", [])
                source_str = "; ".join(sources_list[:2]) if sources_list else f"Grand Récit ch.{ch['id']}"
                documents.append({
                    "text": combined,
                    "source": source_str,
                    "source_type": "grand_recit",
                    "date": str(ev.get("year", "")),
                    "reliability": 2,  # vulgarisé mais sourcé
                    "url": "",
                    "location": ev.get("location"),
                })

    # ── 6. Bainville — Histoire de France (1924) ──────────────────────
    bainville_path = SCRAPING_OUTPUT / "bainville" / "bainville_histoire_france.txt"
    if bainville_path.exists():
        with open(bainville_path, "r", encoding="utf-8") as f:
            bainville_text = f.read()
        # Découper par chapitre puis en chunks
        import re as re_mod
        chapters = re_mod.split(r"(?=^Chapitre \d+)", bainville_text, flags=re_mod.MULTILINE)
        ch_num = 0
        for chapter in chapters:
            if chapter.strip() and len(chapter) > 200:
                ch_num += 1
                for chunk in chunk_text(chapter):
                    documents.append({
                        "text": chunk,
                        "source": f"Bainville, Histoire de France, 1924, ch.{ch_num}",
                        "source_type": "bainville",
                        "date": "",
                        "reliability": 2,  # source secondaire (historien)
                        "url": "https://archive.org/details/histoire-de-france-jacques-bainville",
                    })

    # ── 7. Contributions site ─────────────────────────────────────────
    contribs_path = SITE_DATA / "contributions.json"
    if contribs_path.exists():
        with open(contribs_path, "r", encoding="utf-8") as f:
            contribs = json.load(f)
        for c in contribs:
            text = c.get("body", "")
            if len(text) < 100:
                continue
            author = c.get("author", {}).get("name", "inconnu")
            for chunk in chunk_text(text):
                documents.append({
                    "text": chunk,
                    "source": f"Contribution {c.get('type', '')}: {c.get('title', '')[:40]} ({author})",
                    "source_type": "contribution",
                    "date": "",
                    "reliability": 2,
                    "url": "",
                })

    return documents


def build_index(documents: list[dict]):
    """Construit l'index ChromaDB."""
    try:
        import chromadb
    except ImportError:
        print("ERREUR: pip install chromadb")
        return

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # Supprimer la collection existante si elle existe
    try:
        client.delete_collection("patrimoine_sens")
    except Exception:
        pass

    collection = client.create_collection(
        name="patrimoine_sens",
        metadata={"description": "RAG Patrimoine & Sens — 18M chars de sources historiques"},
    )

    # Dédupliquer globalement par ID
    seen_ids = set()
    unique_docs = []
    for d in documents:
        doc_id = make_id(d["text"], d["source"])
        if doc_id not in seen_ids:
            seen_ids.add(doc_id)
            unique_docs.append(d)
    documents = unique_docs
    print(f"  {len(documents)} chunks uniques (doublons supprimés)")

    # Indexer par batch de 100
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        ids = [make_id(d["text"], d["source"]) for d in batch]
        texts = [d["text"] for d in batch]
        metadatas = [{
            "source": d["source"],
            "source_type": d["source_type"],
            "date": d.get("date", ""),
            "reliability": d.get("reliability", 3),
            "url": d.get("url", ""),
        } for d in batch]

        collection.add(
            ids=ids,
            documents=texts,
            metadatas=metadatas,
        )

        if (i // batch_size) % 10 == 0:
            print(f"  Indexé {i + len(batch)}/{len(documents)} chunks...")

    print(f"\nIndex construit: {collection.count()} chunks dans ChromaDB")
    return collection


def query_index(query: str, n_results: int = 5):
    """Interroge l'index RAG."""
    try:
        import chromadb
    except ImportError:
        print("ERREUR: pip install chromadb")
        return

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    collection = client.get_collection("patrimoine_sens")

    results = collection.query(
        query_texts=[query],
        n_results=n_results,
    )

    print(f"\nQuery: '{query}'")
    print(f"Résultats: {len(results['documents'][0])}")
    print()
    for i, (doc, meta, dist) in enumerate(zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    )):
        rel = meta.get("reliability", "?")
        rel_label = {1: "★★★ primaire", 2: "★★ secondaire", 3: "★ tertiaire", 4: "○ témoignage"}.get(rel, "?")
        print(f"  [{i+1}] Score: {1-dist:.3f} | Fiabilité: {rel_label}")
        print(f"      Source: {meta.get('source', '?')[:80]}")
        print(f"      Date: {meta.get('date', '?')}")
        print(f"      Texte: {doc[:200]}...")
        print()


def print_stats(documents: list[dict]):
    """Affiche les stats des documents."""
    from collections import Counter
    types = Counter(d["source_type"] for d in documents)
    reliabilities = Counter(d["reliability"] for d in documents)

    print(f"\n{'='*60}")
    print(f"  STATS RAG INDEX")
    print(f"{'='*60}")
    print(f"  Total chunks: {len(documents)}")
    print(f"  Total chars: {sum(len(d['text']) for d in documents)/1000:.0f}K")
    print(f"\n  Par source:")
    for t, c in types.most_common():
        print(f"    {t:30} : {c:6d} chunks")
    print(f"\n  Par fiabilité:")
    rel_labels = {1: "★★★ primaire", 2: "★★ secondaire", 3: "★ tertiaire", 4: "○ témoignage"}
    for r in sorted(reliabilities.keys()):
        print(f"    {rel_labels.get(r, '?'):20} : {reliabilities[r]:6d} chunks")


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--stats", action="store_true")
    parser.add_argument("--query", type=str)
    args = parser.parse_args()

    if args.query:
        query_index(args.query)
        return

    print("Chargement des sources...")
    documents = load_all_sources()
    print_stats(documents)

    if not args.stats:
        print("\nConstruction de l'index ChromaDB...")
        build_index(documents)


if __name__ == "__main__":
    main()
