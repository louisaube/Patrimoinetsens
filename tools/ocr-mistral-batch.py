"""OCR Cartulaire (20p) + Julliot restant via Mistral Pixtral."""
import pymupdf, base64, json, os, sys, time, glob, requests

sys.stdout.reconfigure(encoding="utf-8")

API_KEY = "8ZYCxJ10znbeeMxinO3laaB14VB51Vm1"
OUTPUT_DIR = r"C:\Users\louis\Desktop\K&C\Patrimoine & Sens\tools\scraping\output\gallica-ocr"
TEMP_DIR = os.path.join(OUTPUT_DIR, "temp_pages")
os.makedirs(TEMP_DIR, exist_ok=True)

PROMPT = "Transcris integralement le texte de cette page de livre ancien. Conserve la mise en page. Ne commente pas."

def ocr_image(img_path):
    with open(img_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    resp = requests.post(
        "https://api.mistral.ai/v1/chat/completions",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={
            "model": "pixtral-large-latest",
            "messages": [{"role": "user", "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                {"type": "text", "text": PROMPT}
            ]}],
            "max_tokens": 4096,
        },
        timeout=90,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

def save_results(output_file, title, total_pages, results):
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "title": title,
            "total_pages": total_pages,
            "pages_ocr": len(results),
            "total_chars": sum(r["chars"] for r in results),
            "pages": sorted(results, key=lambda x: x["page"])
        }, f, ensure_ascii=False, indent=2)

def load_existing(output_file):
    if os.path.exists(output_file):
        with open(output_file, encoding="utf-8") as f:
            data = json.load(f)
            return data.get("pages", [])
    return []

# ===== 1. CARTULAIRE DU CHAPITRE (20 pages) =====
cart_matches = glob.glob(r"C:\Users\louis\Downloads\Cartulaire_du_chapitre*btv1b10038469c.pdf")
if cart_matches:
    print("=== Cartulaire du chapitre (20 pages) ===")
    out_file = os.path.join(OUTPUT_DIR, "cartulaire_chapitre_ocr.json")
    results = load_existing(out_file)
    existing_pages = {p["page"] for p in results}

    doc = pymupdf.open(cart_matches[0])
    processed = errors = 0

    for i in range(2, 22):  # pages 3-22
        page_num = i + 1
        if page_num in existing_pages:
            continue

        pix = doc[i].get_pixmap(dpi=200)
        img_path = os.path.join(TEMP_DIR, f"cart_p{page_num:04d}.jpg")
        pix.save(img_path)

        if os.path.getsize(img_path) < 10000:
            continue

        try:
            text = ocr_image(img_path)
            results.append({"page": page_num, "text": text, "chars": len(text)})
            processed += 1
            if processed % 5 == 0:
                print(f"  {processed} pages...")
                save_results(out_file, "Cartulaire du chapitre de Sens", len(doc), results)
            time.sleep(1.2)
        except Exception as e:
            errors += 1
            print(f"  ERR p{page_num}: {e}")
            if "429" in str(e):
                time.sleep(30)

    save_results(out_file, "Cartulaire du chapitre de Sens", len(doc), results)
    print(f"  Done: {processed} new, {len(results)} total, {errors} errors")

# ===== 2. JULLIOT (pages restantes) =====
julliot_dir = os.path.join(OUTPUT_DIR, "julliot_pages")
julliot_pages = sorted(glob.glob(os.path.join(julliot_dir, "p*.jpg")))
if julliot_pages:
    print(f"\n=== Julliot ({len(julliot_pages)} pages) ===")
    out_file = os.path.join(OUTPUT_DIR, "julliot_ocr.json")
    results = load_existing(out_file)
    existing_files = {p.get("file", "") for p in results}

    processed = errors = 0
    for page_path in julliot_pages:
        fname = os.path.basename(page_path)
        if fname in existing_files:
            continue
        if os.path.getsize(page_path) < 15000:
            continue

        try:
            text = ocr_image(page_path)
            page_num = int(fname[1:5])
            results.append({"page": page_num, "text": text, "chars": len(text), "file": fname})
            processed += 1
            if processed % 5 == 0:
                print(f"  {processed} pages...")
                save_results(out_file, "Essai sur l enceinte de Sens (Julliot)", len(julliot_pages), results)
            time.sleep(1.2)
        except Exception as e:
            errors += 1
            if "429" in str(e):
                print(f"  Rate limit, pause 30s...")
                time.sleep(30)
            if errors > 15:
                print("  Stop.")
                break

    save_results(out_file, "Essai sur l enceinte de Sens (Julliot)", len(julliot_pages), results)
    print(f"  Done: {processed} new, {len(results)} total, {errors} errors")

print("\n=== TERMINE ===")
