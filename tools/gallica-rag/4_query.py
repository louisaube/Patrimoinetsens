"""
Étape 4 : Requête RAG sur les bulletins SAS indexés.

Interroge la base vectorielle pour trouver des informations
sur un monument, une personnalité, un événement de Sens.

Usage:
    python 4_query.py "cathédrale Saint-Étienne"
    python 4_query.py "remparts enceinte gallo-romaine" --top 10
    python 4_query.py "Thomas Becket" --year-range 1846 1900
"""

import argparse
import os
from pathlib import Path

import chromadb
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def query_rag(question: str, top_k: int = 5, year_min: int | None = None, year_max: int | None = None) -> list[dict]:
    """Interroge la base vectorielle et retourne les chunks pertinents."""
    db_dir = Path(__file__).parent / "output" / "chromadb"
    chroma_client = chromadb.PersistentClient(path=str(db_dir))
    collection = chroma_client.get_collection("sas_bulletins")

    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Embedding de la question
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=[question],
    )
    query_embedding = response.data[0].embedding

    # Filtres optionnels par année
    where_filter = None
    if year_min and year_max:
        where_filter = {"$and": [{"year": {"$gte": year_min}}, {"year": {"$lte": year_max}}]}
    elif year_min:
        where_filter = {"year": {"$gte": year_min}}
    elif year_max:
        where_filter = {"year": {"$lte": year_max}}

    # Requête
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_filter,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        chunks.append({
            "text": doc,
            "source": meta["source"],
            "year": meta["year"],
            "section": meta["section_title"],
            "relevance": 1 - dist,  # cosine similarity
        })

    return chunks


def main():
    parser = argparse.ArgumentParser(description="Requête RAG sur les bulletins SAS")
    parser.add_argument("question", help="Question sur le patrimoine de Sens")
    parser.add_argument("--top", type=int, default=5, help="Nombre de résultats")
    parser.add_argument("--year-range", type=int, nargs=2, help="Plage d'années (ex: 1846 1900)")
    args = parser.parse_args()

    year_min = args.year_range[0] if args.year_range else None
    year_max = args.year_range[1] if args.year_range else None

    print(f"Question: {args.question}")
    print(f"Top {args.top} résultats")
    if year_min or year_max:
        print(f"Années: {year_min or '...'} — {year_max or '...'}")
    print()

    chunks = query_rag(args.question, args.top, year_min, year_max)

    for i, chunk in enumerate(chunks, 1):
        print(f"── Résultat {i} (pertinence: {chunk['relevance']:.2%}) ──")
        print(f"Source: {chunk['source']}, section: {chunk['section']}")
        print(f"Texte: {chunk['text'][:500]}...")
        print()


if __name__ == "__main__":
    main()
