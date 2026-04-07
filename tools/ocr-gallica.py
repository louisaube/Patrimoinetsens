#!/usr/bin/env python3
"""
OCR de livres Gallica téléchargés via API Mistral (Pixtral) ou Claude.
Usage:
  python tools/ocr-gallica.py --book poree --api mistral
  python tools/ocr-gallica.py --book taveau --api claude
  python tools/ocr-gallica.py --book julliot --api mistral --start 10 --end 50

Nécessite:
  - MISTRAL_API_KEY dans .env.local (pour api=mistral)
  - ANTHROPIC_API_KEY dans .env.local (pour api=claude)
"""

import argparse, base64, json, os, sys, time, glob
from pathlib import Path

# ─── Configuration des livres ────────────────────────────────────────────────
BOOKS = {
    "poree": {
        "title": "Histoire des rues et des maisons de Sens (Charles Porée, 1920)",
        "pages_dir": "tools/scraping/output/poree/pages",
        "output_file": "tools/scraping/output/poree/poree_ocr.json",
        "pattern": "p*.jpg",
    },
    "taveau": {
        "title": "Cartulaire sénonais de Balthasar Taveau",
        "pages_dir": None,  # PDF direct, pas de pages extraites
        "pdf_path": "tools/scraping/output/gallica-books/Cartulaire_sénonais_de_Balthasar_Taveau_Taveau_Balthasar_bp.pdf",
        "output_file": "tools/scraping/output/gallica-books/taveau_ocr.json",
        "pattern": "p*.jpg",
    },
    "julliot": {
        "title": "Essai sur l'enceinte de Sens (Gustave Julliot)",
        "pages_dir": None,
        "pdf_path": "tools/scraping/output/gallica-books/Essai_sur_l'enceinte_de_la_Julliot_Gustave_bpt6k9710605x.pdf.pdf",
        "output_file": "tools/scraping/output/gallica-books/julliot_ocr.json",
        "pattern": "p*.jpg",
    },
    "gaudaire": {
        "title": "Une ville pendant la guerre (Gaston Gaudaire, ~1919)",
        "pages_dir": None,
        "pdf_path": "tools/scraping/output/gallica-books/Une_ville_pendant_la_guerre_Gaudaire_Gaston_bpt6k146014n.pdf.pdf",
        "output_file": "tools/scraping/output/gallica-books/gaudaire_ocr.json",
        "pattern": "p*.jpg",
    },
}

# ─── Chargement clés API ─────────────────────────────────────────────────────
def load_env():
    """Charge les variables depuis .env.local"""
    env_file = Path(__file__).parent.parent / ".env.local"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

def image_to_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

# ─── OCR via Mistral Pixtral ────────────────────────────────────────────────
def ocr_mistral(image_path):
    """OCR une page via Mistral Pixtral vision."""
    import requests

    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY non trouvée dans .env.local")

    b64 = image_to_base64(image_path)

    resp = requests.post(
        "https://api.mistral.ai/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": "pixtral-large-latest",
            "messages": [{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
                    },
                    {
                        "type": "text",
                        "text": "Transcris intégralement le texte de cette page de livre ancien. Conserve la mise en page (titres, paragraphes, notes de bas de page). Ne commente pas, ne résume pas — transcris fidèlement caractère par caractère, y compris les accents et la ponctuation d'époque."
                    }
                ]
            }],
            "max_tokens": 4096,
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

# ─── OCR via Claude ──────────────────────────────────────────────────────────
def ocr_claude(image_path):
    """OCR une page via Claude vision."""
    import requests

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY non trouvée dans .env.local")

    b64 = image_to_base64(image_path)

    resp = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 4096,
            "messages": [{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": "image/jpeg", "data": b64}
                    },
                    {
                        "type": "text",
                        "text": "Transcris intégralement le texte de cette page de livre ancien. Conserve la mise en page (titres, paragraphes, notes de bas de page). Ne commente pas, ne résume pas — transcris fidèlement caractère par caractère, y compris les accents et la ponctuation d'époque."
                    }
                ]
            }],
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["content"][0]["text"]

# ─── Extraction pages depuis PDF ─────────────────────────────────────────────
def extract_pages_from_pdf(pdf_path, output_dir, start=1, end=None):
    """Extrait les pages d'un PDF en images JPG via PyMuPDF."""
    import pymupdf

    os.makedirs(output_dir, exist_ok=True)
    doc = pymupdf.open(pdf_path)
    total = len(doc)
    end = min(end or total, total)

    extracted = 0
    for i in range(start - 1, end):
        out_path = os.path.join(output_dir, f"p{i+1:04d}.jpg")
        if os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
            extracted += 1
            continue
        page = doc[i]
        pix = page.get_pixmap(dpi=200)
        pix.save(out_path)
        extracted += 1

    print(f"  Extrait {extracted} pages de {pdf_path}")
    return extracted

# ─── Pipeline principal ──────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="OCR de livres Gallica")
    parser.add_argument("--book", required=True, choices=BOOKS.keys())
    parser.add_argument("--api", default="mistral", choices=["mistral", "claude"])
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int, default=None)
    parser.add_argument("--batch-size", type=int, default=10, help="Pages par batch avant sauvegarde")
    args = parser.parse_args()

    load_env()

    book = BOOKS[args.book]
    print(f"═══ OCR: {book['title']} ═══")
    print(f"API: {args.api}")

    # Déterminer le dossier de pages
    pages_dir = book.get("pages_dir")
    if not pages_dir and book.get("pdf_path"):
        pages_dir = book["pdf_path"].rsplit(".", 1)[0] + "_pages"
        print(f"  Extraction des pages du PDF...")
        extract_pages_from_pdf(book["pdf_path"], pages_dir, args.start, args.end)

    # Lister les pages
    pages = sorted(glob.glob(os.path.join(pages_dir, book["pattern"])))
    if args.end:
        pages = [p for p in pages if int(Path(p).stem[1:]) <= args.end]
    pages = [p for p in pages if int(Path(p).stem[1:]) >= args.start]
    print(f"  {len(pages)} pages à traiter (p{args.start:04d} → p{args.end or '????'})")

    # Charger résultats existants
    output_file = book["output_file"]
    results = {}
    if os.path.exists(output_file):
        with open(output_file) as f:
            results = json.load(f)
        print(f"  {len(results)} pages déjà OCR-isées")

    # OCR
    ocr_fn = ocr_mistral if args.api == "mistral" else ocr_claude
    processed = 0
    errors = 0

    for i, page_path in enumerate(pages):
        page_num = Path(page_path).stem  # ex: "p0025"

        if page_num in results:
            continue

        try:
            text = ocr_fn(page_path)
            results[page_num] = {
                "text": text,
                "page": int(page_num[1:]),
                "file": os.path.basename(page_path),
            }
            processed += 1

            if processed % 10 == 0:
                print(f"  {processed} pages traitées...")

            # Sauvegarde incrémentale
            if processed % args.batch_size == 0:
                with open(output_file, "w") as f:
                    json.dump(results, f, ensure_ascii=False, indent=2)

            # Rate limiting
            time.sleep(1.0 if args.api == "mistral" else 0.5)

        except Exception as e:
            errors += 1
            print(f"  ERR {page_num}: {e}")
            if errors > 10:
                print("  Trop d'erreurs, arrêt.")
                break
            time.sleep(5)

    # Sauvegarde finale
    with open(output_file, "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n═══ Terminé ═══")
    print(f"  Traitées: {processed}, Erreurs: {errors}, Total OCR: {len(results)}")
    print(f"  Sauvé dans: {output_file}")

if __name__ == "__main__":
    main()
