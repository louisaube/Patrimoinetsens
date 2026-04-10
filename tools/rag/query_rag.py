#!/usr/bin/env python3
"""
query_rag.py
============
Pipeline de requête RAG avec citations obligatoires.
Chaque réponse DOIT citer ses sources avec leur fiabilité.

Usage:
    python query_rag.py "Quand la cathédrale de Sens a-t-elle été construite ?"
    python query_rag.py --interactive     # Mode interactif
    python query_rag.py --api             # Lance un serveur API (port 8787)
"""

import argparse
import json
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHROMA_DIR = Path(__file__).parent / "chroma_db"
RELIABILITY_LABELS = {
    1: "source primaire (document d'archive)",
    2: "source secondaire (historien)",
    3: "source tertiaire (encyclopédie)",
    4: "témoignage (non vérifié)",
}


def get_collection():
    import chromadb
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return client.get_collection("patrimoine_sens")


def retrieve(query: str, n_results: int = 10) -> list[dict]:
    """Récupère les chunks les plus pertinents avec métadonnées."""
    collection = get_collection()
    results = collection.query(
        query_texts=[query],
        n_results=n_results,
    )

    chunks = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        score = 1 - dist  # convertir distance en score de similarité
        reliability = meta.get("reliability", 3)

        # Bonus de fiabilité : les sources primaires sont promues
        adjusted_score = score * (1 + (4 - reliability) * 0.1)

        chunks.append({
            "text": doc,
            "source": meta.get("source", "?"),
            "source_type": meta.get("source_type", "?"),
            "date": meta.get("date", ""),
            "reliability": reliability,
            "reliability_label": RELIABILITY_LABELS.get(reliability, "?"),
            "url": meta.get("url", ""),
            "score": score,
            "adjusted_score": adjusted_score,
        })

    # Re-trier par score ajusté (fiabilité prise en compte)
    chunks.sort(key=lambda x: -x["adjusted_score"])
    return chunks


def format_context(chunks: list[dict], max_chunks: int = 5) -> str:
    """Formate les chunks en contexte pour un LLM."""
    context_parts = []
    for i, chunk in enumerate(chunks[:max_chunks]):
        rel = "★" * (4 - chunk["reliability"] + 1)
        context_parts.append(
            f"[Source {i+1}] {rel} {chunk['reliability_label']}\n"
            f"Référence: {chunk['source']}\n"
            f"Date: {chunk['date'] or 'non datée'}\n"
            f"Texte: {chunk['text'][:800]}\n"
        )
    return "\n---\n".join(context_parts)


def build_prompt(query: str, context: str) -> str:
    """Construit le prompt pour le LLM avec instructions de citation."""
    return f"""Tu es un historien spécialisé dans l'histoire de Sens (Yonne, France).
Tu réponds aux questions en te basant UNIQUEMENT sur les sources fournies ci-dessous.

RÈGLES ABSOLUES :
1. CITE toujours tes sources entre crochets : [Source 1], [Source 2], etc.
2. Si deux sources se contredisent, dis-le explicitement.
3. Si une information ne vient que d'une source tertiaire (★), précise-le.
4. Si tu ne trouves pas la réponse dans les sources, dis "Je ne dispose pas de sources suffisantes."
5. NE JAMAIS inventer un fait qui n'est pas dans les sources.
6. Niveau de langue : lycée (vulgarisation accessible).
7. Quand c'est pertinent, mentionne le contexte national (Bainville).

SOURCES DISPONIBLES :
{context}

QUESTION : {query}

RÉPONSE (avec citations obligatoires) :"""


def answer(query: str, verbose: bool = False) -> dict:
    """Répond à une question avec citations."""
    chunks = retrieve(query, n_results=10)
    context = format_context(chunks, max_chunks=7)
    prompt = build_prompt(query, context)

    if verbose:
        print(f"\n{'='*60}")
        print(f"  Question: {query}")
        print(f"  Chunks récupérés: {len(chunks)}")
        print(f"{'='*60}")
        for i, c in enumerate(chunks[:5]):
            rel = "★" * (4 - c["reliability"] + 1)
            print(f"  [{i+1}] {rel} Score:{c['adjusted_score']:.3f} | {c['source'][:60]}")
        print()

    return {
        "query": query,
        "prompt": prompt,
        "chunks": chunks[:7],
        "context_length": len(context),
        "sources_used": [
            {"ref": f"[Source {i+1}]", "source": c["source"], "reliability": c["reliability_label"]}
            for i, c in enumerate(chunks[:7])
        ],
    }


def interactive_mode():
    """Mode interactif en ligne de commande."""
    print("RAG Patrimoine & Sens — Mode interactif")
    print("Tapez 'quit' pour quitter.\n")

    while True:
        query = input("Question > ").strip()
        if query.lower() in ("quit", "exit", "q"):
            break
        if not query:
            continue

        result = answer(query, verbose=True)

        print("\nPROMPT POUR LLM:")
        print("-" * 40)
        print(result["prompt"][:2000])
        if len(result["prompt"]) > 2000:
            print(f"... ({len(result['prompt'])} chars total)")
        print("-" * 40)

        print("\nSOURCES UTILISÉES:")
        for s in result["sources_used"]:
            print(f"  {s['ref']} {s['source'][:60]} ({s['reliability']})")
        print()


def api_mode():
    """Lance un serveur HTTP simple pour les requêtes RAG."""
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import urllib.parse

    class RAGHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)

            if parsed.path == "/api/rag":
                query = params.get("q", [""])[0]
                if not query:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Missing ?q= parameter"}).encode())
                    return

                result = answer(query)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False, indent=2).encode("utf-8"))
            else:
                self.send_response(404)
                self.end_headers()

        def log_message(self, format, *args):
            print(f"  {args[0]}")

    port = 8787
    server = HTTPServer(("", port), RAGHandler)
    print(f"RAG API running on http://localhost:{port}/api/rag?q=...")
    print("Ctrl+C pour arrêter.\n")
    server.serve_forever()


def main():
    parser = argparse.ArgumentParser(description="RAG Patrimoine & Sens")
    parser.add_argument("query", nargs="?", help="Question à poser")
    parser.add_argument("--interactive", action="store_true", help="Mode interactif")
    parser.add_argument("--api", action="store_true", help="Serveur API HTTP")
    args = parser.parse_args()

    if args.api:
        api_mode()
    elif args.interactive:
        interactive_mode()
    elif args.query:
        result = answer(args.query, verbose=True)
        print("\nPROMPT POUR LLM:")
        print(result["prompt"][:3000])
        print(f"\n... ({len(result['prompt'])} chars)")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
