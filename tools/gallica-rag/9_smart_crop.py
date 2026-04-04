"""
Etape 9 : Crop intelligent des blasons par detection de bande coloree.

Au lieu de faire confiance aux bbox de Pixtral (souvent fausses),
on detecte programmatiquement :
1. De quel cote de la page sont les blasons (gauche ou droite)
   -> bande avec la plus forte saturation HSV
2. Ou sont les blasons dans la bande verticale
   -> pics de saturation dans le profil vertical
3. On croppe chaque blason individuellement

On conserve les NOMS et DESCRIPTIONS de Pixtral (fiables),
mais on remplace les BBOX (non fiables).

Usage:
    python 9_smart_crop.py
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image

OUTPUT_DIR = Path(__file__).parent / "output" / "hozier_sens"
PAGES_DIR = OUTPUT_DIR / "pages"
BLASONS_DIR = OUTPUT_DIR / "blasons"
DETECTIONS_PATH = OUTPUT_DIR / "detections.json"

# Largeur de la bande a scanner (% de la page)
STRIP_WIDTH_PCT = 0.18
# Seuil de saturation pour detecter un blason
SAT_THRESHOLD = 60
# Hauteur minimale d'un blason (% de la page)
MIN_BLASON_H_PCT = 0.04
# Espace min entre deux blasons (% de la page)
MIN_GAP_PCT = 0.03


def is_heraldic_pixel(hsv_arr: np.ndarray) -> np.ndarray:
    """Detecte les pixels de couleurs heraldiques (bleu, rouge, or/jaune, vert).
    Exclut les tons bruns de la reliure et le beige du parchemin."""
    h_ch = hsv_arr[:, :, 0]  # Hue (0-255 en Pillow HSV)
    s_ch = hsv_arr[:, :, 1]  # Saturation
    v_ch = hsv_arr[:, :, 2]  # Value

    # Saturation minimale pour une couleur vive
    sat_mask = s_ch > 80
    val_mask = v_ch > 40  # pas trop sombre

    # Bleu (azur) : H ~130-175 en Pillow scale (0-255)
    blue = (h_ch > 130) & (h_ch < 175)
    # Rouge (gueules) : H ~0-15 ou ~240-255
    red = (h_ch < 15) | (h_ch > 240)
    # Jaune/Or : H ~20-45
    yellow = (h_ch > 20) & (h_ch < 45)
    # Vert (sinople) : H ~55-100
    green = (h_ch > 55) & (h_ch < 100)

    heraldic = (blue | red | yellow | green) & sat_mask & val_mask
    return heraldic


def detect_blason_strip(img_hsv: np.ndarray) -> str:
    """Determine si les blasons sont a gauche ou a droite via couleurs heraldiques."""
    h, w = img_hsv.shape[:2]
    strip_w = int(w * STRIP_WIDTH_PCT)

    heraldic = is_heraldic_pixel(img_hsv)

    left_score = float(np.mean(heraldic[:, :strip_w]))
    right_score = float(np.mean(heraldic[:, w - strip_w:]))

    print(f"  Scores heraldiques: gauche={left_score:.4f}, droite={right_score:.4f}")
    return "left" if left_score > right_score else "right"


def find_blason_positions(img_hsv: np.ndarray, side: str, n_expected: int = 5) -> list[tuple[int, int, int, int]]:
    """Trouve les positions verticales des blasons dans la bande.

    Utilise le profil de colonnes heraldiques pour trouver les pics x,
    puis le profil vertical pour trouver chaque blason individuellement.
    """
    h, w = img_hsv.shape[:2]
    strip_w = int(w * STRIP_WIDTH_PCT)

    if side == "left":
        x1_strip, x2_strip = 0, strip_w
    else:
        x1_strip, x2_strip = w - strip_w, w

    heraldic = is_heraldic_pixel(img_hsv)
    strip_heraldic = heraldic[:, x1_strip:x2_strip]

    # Trouver la colonne x exacte des blasons (pic horizontal)
    x_profile = np.mean(strip_heraldic, axis=0).astype(float)
    if x_profile.max() > 0:
        # Zone x ou se concentrent les blasons
        x_threshold = x_profile.max() * 0.3
        x_cols = np.where(x_profile > x_threshold)[0]
        if len(x_cols) > 0:
            local_x1 = max(0, int(x_cols[0]) - 5)
            local_x2 = min(strip_w, int(x_cols[-1]) + 5)
        else:
            local_x1, local_x2 = 0, strip_w
    else:
        local_x1, local_x2 = 0, strip_w

    # Convertir en coordonnees image
    abs_x1 = x1_strip + local_x1
    abs_x2 = x1_strip + local_x2
    # Elargir un peu
    margin_x = max(10, (abs_x2 - abs_x1) // 4)
    abs_x1 = max(0, abs_x1 - margin_x)
    abs_x2 = min(w, abs_x2 + margin_x)

    # Profil vertical dans la zone x precise
    y_profile = np.mean(strip_heraldic[:, local_x1:local_x2], axis=1).astype(float)

    # Lisser
    kernel_size = max(3, h // 150)
    kernel = np.ones(kernel_size) / kernel_size
    smooth = np.convolve(y_profile, kernel, mode="same")

    # Seuil adaptatif : utiliser un pourcentage du max
    if smooth.max() > 0:
        threshold = max(0.02, smooth.max() * 0.15)
    else:
        threshold = 0.02

    above = smooth > threshold

    # Extraire les segments contigus
    segments = []
    in_segment = False
    start = 0
    min_h_px = int(h * 0.02)  # Seuil bas pour ne pas rater les petits blasons
    min_gap = int(h * 0.02)

    for i in range(len(above)):
        if above[i] and not in_segment:
            start = i
            in_segment = True
        elif not above[i] and in_segment:
            if i - start >= min_h_px:
                segments.append((start, i))
            in_segment = False

    if in_segment and len(above) - start >= min_h_px:
        segments.append((start, len(above)))

    # Fusionner les segments trop proches
    merged = []
    for seg in segments:
        if merged and seg[0] - merged[-1][1] < min_gap:
            merged[-1] = (merged[-1][0], seg[1])
        else:
            merged.append(seg)

    # Convertir en bbox
    margin_y = int(h * 0.01)
    bboxes = []
    for y_start, y_end in merged:
        bboxes.append((
            abs_x1,
            max(0, y_start - margin_y),
            abs_x2,
            min(h, y_end + margin_y),
        ))

    return bboxes


def smart_crop_page(page_path: Path, page_blasons: list[dict]) -> list[Path]:
    """Croppe intelligemment les blasons d'une page."""
    img = Image.open(page_path)
    img_hsv = np.array(img.convert("HSV"))

    side = detect_blason_strip(img_hsv)
    bboxes = find_blason_positions(img_hsv, side)

    n_expected = len(page_blasons)
    n_found = len(bboxes)

    print(f"  Bande: {side}, {n_found} blasons detectes (attendu: {n_expected})")

    # Si on a moins de bbox que de blasons attendus, subdiviser les gros segments
    bboxes.sort(key=lambda b: b[1])
    page_blasons.sort(key=lambda b: b["position"])

    if len(bboxes) < n_expected:
        # Determiner la zone x de la bande
        img_h, img_w = img_hsv.shape[:2]
        strip_w = int(img_w * STRIP_WIDTH_PCT)
        if side == "left":
            x1, x2 = 0, strip_w
        else:
            x1, x2 = img_w - strip_w, img_w

        # Si on a des segments, utiliser leur etendue verticale
        if bboxes:
            all_y1 = min(b[1] for b in bboxes)
            all_y2 = max(b[3] for b in bboxes)
            total_h = all_y2 - all_y1
        else:
            total_h = 0

        # Si le segment est trop petit (< 30% de la page), utiliser toute la page
        min_region = int(img_h * 0.3)
        if total_h < min_region:
            # Layout regulier : blasons de 5% a 95% de la hauteur
            all_y1 = int(img_h * 0.05)
            all_y2 = int(img_h * 0.95)
            total_h = all_y2 - all_y1
            print(f"  -> Segment trop petit, fallback pleine page")

        slot_h = total_h // n_expected
        bboxes = []
        for i in range(n_expected):
            y_start = all_y1 + i * slot_h
            y_end = y_start + slot_h
            bboxes.append((x1, y_start, x2, y_end))

        print(f"  -> Subdivise en {n_expected} segments de {slot_h}px")

    results = []
    for i, blason in enumerate(page_blasons):
        if i < len(bboxes):
            bbox = bboxes[i]
        else:
            print(f"    SKIP {blason['nom']} (pas de bbox)")
            continue

        safe_name = blason["nom"].replace(" ", "_").replace("'", "")[:40]
        output_path = BLASONS_DIR / f"blason_{blason['page']:03d}_{blason['position']:02d}_{safe_name}.jpg"

        cropped = img.crop(bbox)
        cropped.save(output_path, "JPEG", quality=90)
        results.append(output_path)
        print(f"    OK {blason['nom'][:40]}")

    return results


def main():
    # Charger les detections
    with open(DETECTIONS_PATH, encoding="utf-8") as f:
        all_blasons = json.load(f)

    # Charger le rapport de qualite pour savoir quelles pages sont mauvaises
    report_path = OUTPUT_DIR / "crop_quality_report.json"
    bad_pages = set()
    if report_path.exists():
        with open(report_path, encoding="utf-8") as f:
            report = json.load(f)
        for b in report.get("bad", []):
            parts = b["file"].split("_")
            bad_pages.add(int(parts[1]))

    if not bad_pages:
        print("Aucune page a re-cropper.")
        return

    print(f"Pages a re-cropper: {sorted(bad_pages)}\n")

    # Aussi ajouter p37 et p40 qui ont rate le rate limit
    # Verifier quelles pages n'ont pas ete re-detectees
    detected_pages = {b["page"] for b in all_blasons}
    missing = bad_pages - detected_pages
    if missing:
        print(f"ATTENTION: pages non re-detectees (rate limit): {sorted(missing)}")
        print("On re-croppe uniquement les pages avec des detections.\n")
        bad_pages = bad_pages & detected_pages

    total_ok = 0
    total_skip = 0

    for page_num in sorted(bad_pages):
        page_path = PAGES_DIR / f"hozier_sens_p{page_num:03d}.jpg"
        if not page_path.exists():
            page_path = PAGES_DIR / f"hozier_sens_p{page_num}.jpg"

        page_blasons = [b for b in all_blasons if b["page"] == page_num]
        if not page_blasons:
            continue

        print(f"\n=== Page {page_num} ({len(page_blasons)} blasons) ===")

        # Supprimer les anciens crops de cette page
        for old in BLASONS_DIR.glob(f"blason_{page_num:03d}_*.jpg"):
            old.unlink()

        results = smart_crop_page(page_path, page_blasons)
        total_ok += len(results)

    print(f"\n{'='*50}")
    print(f"Total: {total_ok} blasons re-croppes")

    # Verification finale
    print(f"\n=== Verification finale ===\n")
    from importlib import import_module
    verify = import_module("8_verify_crops")

    good_count = 0
    bad_count = 0
    for page_num in sorted(bad_pages):
        for crop_path in sorted(BLASONS_DIR.glob(f"blason_{page_num:03d}_*.jpg")):
            result = verify.analyze_crop(crop_path)
            status = "OK" if result["is_good"] else "XX"
            print(f"  {status} {result['file'][:50]:50s}  sat={result['center_saturation']:5.1f}  ratio={result['center_saturated_ratio']:.3f}")
            if result["is_good"]:
                good_count += 1
            else:
                bad_count += 1

    print(f"\nResultat: {good_count} bons, {bad_count} encore mauvais")


if __name__ == "__main__":
    main()
