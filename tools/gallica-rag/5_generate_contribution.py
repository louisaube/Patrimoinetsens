"""
Étape 5 : Génération de contributions P&S à partir des résultats RAG.

Prend les chunks pertinents trouvés par le RAG et génère une contribution
au niveau collège/lycée, avec sources citées et structure "Pour aller plus loin".

Usage:
    python 5_generate_contribution.py "cathédrale Saint-Étienne" --type historique
    python 5_generate_contribution.py "Thomas Becket" --type recit
    python 5_generate_contribution.py --all-subjects  # Génère pour tous les sujets du config
"""

import argparse
import json
import os
from pathlib import Path

import anthropic
import yaml
from dotenv import load_dotenv

load_dotenv()

# Importer le module de requête RAG
from importlib import import_module
query_module = import_module("4_query")
query_rag = query_module.query_rag

SYSTEM_PROMPT = """Tu es un rédacteur pour l'application Patrimoine & Sens, une encyclopédie vivante du patrimoine de Sens (Yonne).

RÈGLES ABSOLUES :
1. Niveau de lecture : collège/lycée (11-18 ans). Phrases courtes (15-20 mots max).
2. Voix active, jamais passive. Pas de jargon sans explication.
3. Raconter AVANT d'expliquer. Le récit accroche, l'analyse vient après.
4. CITER tes sources exactement (Bulletin SAS vol. X, année Y, p. Z).
5. Ne jamais inventer de faits. Si tu n'es pas sûr, dis-le.
6. Bannir : "communément désigné", "il convient de noter", "nonobstant".

STRUCTURE DE SORTIE (JSON) :
{
  "title": "Titre accrocheur, court",
  "body": "Texte principal (niveau collège/lycée, 150-300 mots)",
  "sources": ["Source 1", "Source 2"],
  "pour_aller_plus_loin": "Paragraphe optionnel pour les lecteurs curieux (niveau lycée+)",
  "period": "Période couverte (ex: 1135-1534)"
}"""


def generate_contribution(
    subject: str,
    contribution_type: str,
    chunks: list[dict],
) -> dict:
    """Génère une contribution P&S à partir des chunks RAG."""
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    # Construire le contexte à partir des chunks
    context = "\n\n".join(
        f"[{c['source']}, section: {c['section']}]\n{c['text']}"
        for c in chunks
    )

    type_instructions = {
        "historique": "Contribution de type HISTORIQUE (Denis) : factuel, sourcé, mais accessible. Cite les bulletins SAS précisément.",
        "recit": "Contribution de type RÉCIT (Bernard) : narratif, vivant, personnel. Tu racontes comme un conteur local passionné.",
        "observation": "Contribution de type OBSERVATION (Marie) : relevé terrain, état du monument, factuel et visuel.",
        "temoignage": "Contribution de type TÉMOIGNAGE (Claire) : expérience personnelle, souvenir, rapport à la ville.",
    }

    user_prompt = f"""Sujet : {subject}
Type : {contribution_type}
{type_instructions.get(contribution_type, '')}

SOURCES DISPONIBLES (extraites des Bulletins de la Société Archéologique de Sens) :

{context}

Génère une contribution en JSON. N'invente RIEN — utilise uniquement les sources ci-dessus."""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    # Parser le JSON de la réponse
    text = response.content[0].text
    # Extraire le JSON du markdown si nécessaire
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0]
    elif "```" in text:
        text = text.split("```")[1].split("```")[0]

    return json.loads(text.strip())


def main():
    parser = argparse.ArgumentParser(description="Génère des contributions P&S via RAG")
    parser.add_argument("subject", nargs="?", help="Sujet (monument, personnalité, événement)")
    parser.add_argument("--type", choices=["historique", "recit", "observation", "temoignage"], default="historique")
    parser.add_argument("--top", type=int, default=8, help="Nombre de chunks RAG")
    parser.add_argument("--all-subjects", action="store_true", help="Génère pour tous les sujets du config")
    args = parser.parse_args()

    output_dir = Path(__file__).parent / "output" / "contributions"
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.all_subjects:
        config_path = Path(__file__).parent / "config.yaml"
        with open(config_path, encoding="utf-8") as f:
            config = yaml.safe_load(f)
        subjects = config.get("heritage_subjects", [])
    elif args.subject:
        subjects = [args.subject]
    else:
        parser.error("Spécifie un sujet ou utilise --all-subjects")
        return

    for subject in subjects:
        print(f"\n{'='*60}")
        print(f"Sujet: {subject}")
        print(f"Type: {args.type}")

        # Requête RAG
        chunks = query_rag(subject, args.top)
        if not chunks:
            print("  Aucun résultat RAG trouvé.")
            continue

        print(f"  {len(chunks)} chunks trouvés (meilleur: {chunks[0]['relevance']:.0%})")

        # Génération
        try:
            contribution = generate_contribution(subject, args.type, chunks)
            print(f"  Titre: {contribution['title']}")
            print(f"  Corps: {contribution['body'][:200]}...")

            # Sauvegarder
            safe_name = subject.replace(" ", "_").replace("/", "_")[:50]
            out_path = output_dir / f"{safe_name}_{args.type}.json"
            out_path.write_text(json.dumps(contribution, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  Sauvé: {out_path}")

        except Exception as e:
            print(f"  ERREUR: {e}")

    print(f"\nContributions générées dans {output_dir}")


if __name__ == "__main__":
    main()
