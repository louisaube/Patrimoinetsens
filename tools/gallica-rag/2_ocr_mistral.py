"""
Étape 2 : OCR des bulletins SAS via Mistral OCR API.

Envoie les PDFs téléchargés à Mistral OCR pour obtenir du texte
structuré de haute qualité. Coût : ~2000 pages par dollar en batch.

Usage:
    python 2_ocr_mistral.py                # OCR tous les bulletins
    python 2_ocr_mistral.py --year 1846    # OCR un seul bulletin
    python 2_ocr_mistral.py --estimate     # Estime le coût sans lancer

Prérequis:
    MISTRAL_API_KEY dans .env ou variable d'environnement
"""

import argparse
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from mistralai import Mistral

load_dotenv()


def ocr_pdf(client: Mistral, pdf_path: Path, output_dir: Path) -> Path:
    """Envoie un PDF à Mistral OCR et sauvegarde le résultat."""
    output_path = output_dir / f"{pdf_path.stem}.json"

    if output_path.exists():
        print(f"  Déjà traité: {output_path}")
        return output_path

    print(f"  OCR en cours: {pdf_path.name}...")

    # Upload du fichier
    with open(pdf_path, "rb") as f:
        uploaded = client.files.upload(
            file={"file_name": pdf_path.name, "content": f},
            purpose="ocr",
        )

    # Lancer l'OCR
    result = client.ocr.process(
        model="mistral-ocr-latest",
        document={
            "type": "document_url",
            "document_url": uploaded.url,
        },
    )

    # Sauvegarder le résultat complet
    result_data = {
        "source": pdf_path.name,
        "pages": [],
    }

    for page in result.pages:
        result_data["pages"].append({
            "page_number": page.index,
            "markdown": page.markdown,
        })

    output_path.write_text(json.dumps(result_data, ensure_ascii=False, indent=2), encoding="utf-8")

    n_pages = len(result_data["pages"])
    print(f"  OK — {n_pages} pages → {output_path}")
    return output_path


def estimate_cost(pdf_dir: Path) -> None:
    """Estime le coût total de l'OCR."""
    total_size = 0
    total_files = 0

    for pdf in sorted(pdf_dir.glob("sas_*.pdf")):
        size = pdf.stat().st_size
        total_size += size
        total_files += 1
        print(f"  {pdf.name}: {size / (1024*1024):.1f} Mo")

    # Estimation : ~300 pages par bulletin en moyenne
    est_pages = total_files * 300
    cost_realtime = est_pages / 1000  # 1000 pages/$
    cost_batch = est_pages / 2000     # 2000 pages/$ en batch

    print(f"\nTotal: {total_files} fichiers, {total_size / (1024*1024):.0f} Mo")
    print(f"Pages estimées: ~{est_pages}")
    print(f"Coût temps réel: ~${cost_realtime:.2f}")
    print(f"Coût batch:      ~${cost_batch:.2f}")


def main():
    parser = argparse.ArgumentParser(description="OCR des bulletins SAS via Mistral")
    parser.add_argument("--year", type=int, help="Année spécifique")
    parser.add_argument("--estimate", action="store_true", help="Estime le coût")
    args = parser.parse_args()

    pdf_dir = Path(__file__).parent / "output" / "pdfs"
    ocr_dir = Path(__file__).parent / "output" / "ocr"
    ocr_dir.mkdir(parents=True, exist_ok=True)

    if args.estimate:
        estimate_cost(pdf_dir)
        return

    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        print("ERREUR: MISTRAL_API_KEY non définie. Ajoutez-la dans .env")
        return

    client = Mistral(api_key=api_key)

    pdfs = sorted(pdf_dir.glob("sas_*.pdf"))
    if args.year:
        pdfs = [p for p in pdfs if str(args.year) in p.name]

    if not pdfs:
        print("Aucun PDF trouvé. Lancez d'abord 1_fetch_pdfs.py")
        return

    print(f"Bulletins à traiter: {len(pdfs)}")
    for i, pdf in enumerate(pdfs, 1):
        print(f"\n[{i}/{len(pdfs)}]")
        try:
            ocr_pdf(client, pdf, ocr_dir)
        except Exception as e:
            print(f"  ERREUR: {e}")

    print("\nOCR terminé.")


if __name__ == "__main__":
    main()
