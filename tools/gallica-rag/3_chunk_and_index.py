"""
Étape 3 : Chunking des textes OCR et indexation vectorielle.

Découpe les bulletins SAS en articles/sections, génère des embeddings,
et les stocke dans ChromaDB (local) pour requêtes RAG.

Usage:
    python 3_chunk_and_index.py            # Indexe tous les bulletins OCR
    python 3_chunk_and_index.py --year 1846
    python 3_chunk_and_index.py --stats    # Affiche les stats de l'index

Prérequis:
    OPENAI_API_KEY dans .env (pour les embeddings text-embedding-3-small)
"""

import argparse
import json
import os
import re
from pathlib import Path

import chromadb
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def split_into_sections(text: str, year: int) -> list[dict]:
    """Découpe un texte de bulletin en sections/articles."""
    sections = []
    # Patterns de titres typiques des bulletins SAS
    title_patterns = [
        r"^(?:MÉMOIRE|RAPPORT|NOTE|NOTICE|COMMUNICATION|LETTRE|DISCOURS)\b",
        r"^(?:SUR|DE|DES|DU|LA|LE|LES)\s+[A-Z]",
        r"^[A-Z][A-Z\s]{10,}$",  # Lignes tout en majuscules
    ]

    lines = text.split("\n")
    current_section = {"title": f"Bulletin SAS {year} — Introduction", "body": [], "year": year}

    for line in lines:
        line = line.strip()
        if not line:
            continue

        is_title = any(re.match(p, line) for p in title_patterns)
        if is_title and len(current_section["body"]) > 50:
            # Sauver la section précédente
            current_section["body"] = " ".join(current_section["body"])
            sections.append(current_section)
            # Commencer une nouvelle section
            current_section = {"title": line.strip(), "body": [], "year": year}
        else:
            current_section["body"].append(line)

    # Dernière section
    if current_section["body"]:
        current_section["body"] = " ".join(current_section["body"])
        sections.append(current_section)

    return sections


def chunk_section(section: dict, max_tokens: int = 800, overlap: int = 100) -> list[dict]:
    """Découpe une section en chunks de taille fixe avec chevauchement."""
    text = section["body"]
    words = text.split()
    chunks = []

    # Approximation : 1 token ≈ 0.75 mots en français
    max_words = int(max_tokens * 0.75)
    overlap_words = int(overlap * 0.75)

    start = 0
    while start < len(words):
        end = start + max_words
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words)

        chunks.append({
            "text": chunk_text,
            "metadata": {
                "source": f"Bulletin SAS {section['year']}",
                "year": section["year"],
                "section_title": section["title"],
                "chunk_index": len(chunks),
            },
        })

        start = end - overlap_words
        if start >= len(words):
            break

    return chunks


def main():
    parser = argparse.ArgumentParser(description="Chunking et indexation des bulletins SAS")
    parser.add_argument("--year", type=int, help="Année spécifique")
    parser.add_argument("--stats", action="store_true", help="Stats de l'index")
    args = parser.parse_args()

    ocr_dir = Path(__file__).parent / "output" / "ocr"
    db_dir = Path(__file__).parent / "output" / "chromadb"
    db_dir.mkdir(parents=True, exist_ok=True)

    # ChromaDB local
    chroma_client = chromadb.PersistentClient(path=str(db_dir))
    collection = chroma_client.get_or_create_collection(
        name="sas_bulletins",
        metadata={"description": "Bulletins de la Société Archéologique de Sens (1846-1937)"},
    )

    if args.stats:
        print(f"Collection: sas_bulletins")
        print(f"Documents: {collection.count()}")
        return

    # OpenAI pour les embeddings
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERREUR: OPENAI_API_KEY non définie.")
        return

    openai_client = OpenAI(api_key=api_key)

    ocr_files = sorted(ocr_dir.glob("sas_*.json"))
    if args.year:
        ocr_files = [f for f in ocr_files if str(args.year) in f.name]

    if not ocr_files:
        print("Aucun fichier OCR trouvé. Lancez d'abord 2_ocr_mistral.py")
        return

    total_chunks = 0
    for ocr_file in ocr_files:
        year = int(ocr_file.stem.split("_")[1])
        print(f"\n[{year}] Traitement de {ocr_file.name}...")

        with open(ocr_file, encoding="utf-8") as f:
            data = json.load(f)

        # Combiner toutes les pages en un seul texte
        full_text = "\n\n".join(page["markdown"] for page in data["pages"])

        # Découper en sections puis en chunks
        sections = split_into_sections(full_text, year)
        print(f"  {len(sections)} sections détectées")

        all_chunks = []
        for section in sections:
            chunks = chunk_section(section)
            all_chunks.extend(chunks)

        print(f"  {len(all_chunks)} chunks générés")

        # Générer les embeddings par batch
        batch_size = 50
        for i in range(0, len(all_chunks), batch_size):
            batch = all_chunks[i : i + batch_size]
            texts = [c["text"] for c in batch]

            response = openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=texts,
            )

            ids = [f"sas_{year}_chunk_{i+j}" for j in range(len(batch))]
            embeddings = [e.embedding for e in response.data]
            metadatas = [c["metadata"] for c in batch]
            documents = texts

            collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents,
            )

        total_chunks += len(all_chunks)
        print(f"  Indexé: {len(all_chunks)} chunks")

    print(f"\nTotal: {total_chunks} chunks indexés dans ChromaDB")
    print(f"Base: {db_dir}")


if __name__ == "__main__":
    main()
