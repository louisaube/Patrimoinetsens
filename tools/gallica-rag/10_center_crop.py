"""
Blason-centered crop pipeline for Armorial d'Hozier pages.

Key insight: exclude yellow/or from primary detection because
aged parchment (hue ~33, sat ~37) falls in the yellow HSV range
and pollutes the mask. Blue, red, green alone are sufficient to
locate the painted shields.

Pass 1 (CC): Connected components on no-yellow heraldic mask,
             iter=8 dilation, keep blobs >= 80x80.
Pass 2 (Hybrid): For pages where CC finds fewer blobs than expected,
             use CC blobs as anchors + interpolate missing positions.
"""
import json
import numpy as np
from scipy import ndimage
from PIL import Image
from pathlib import Path

PAGES_DIR = Path("output/hozier_sens/pages")
BLASONS_DIR = Path("output/hozier_sens/blasons")
MIN_BLASON_DIM = 80


def get_heraldic_mask_no_yellow(hsv):
    """Heraldic pixel mask excluding yellow/or to avoid parchment noise."""
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    sat_ok = s > 55
    val_ok = v > 40
    blue = (h > 130) & (h < 175)
    red = (h < 15) | (h > 240)
    green = (h > 55) & (h < 100)
    return (blue | red | green) & sat_ok & val_ok


def find_blobs_cc(hsv, img_w, img_h):
    """Find real blason blobs via connected components.

    Oversized blobs (taller than 20% of page height) are split vertically
    into N sub-blobs — this handles cases where adjacent blasons fuse
    into one large connected component (e.g. husband+wife shared arms).
    """
    mask = get_heraldic_mask_no_yellow(hsv)
    struct = np.ones((5, 5))
    dilated = ndimage.binary_dilation(mask, structure=struct, iterations=8)
    labeled, n_labels = ndimage.label(dilated)

    max_h = img_h * 0.20  # max height for a single blason
    max_w = img_w * 0.30

    blobs = []
    for i in range(1, n_labels + 1):
        ys, xs = np.where(labeled == i)
        y1, y2 = int(ys.min()), int(ys.max())
        x1, x2 = int(xs.min()), int(xs.max())
        bw, bh = x2 - x1, y2 - y1

        if bw < MIN_BLASON_DIM or bh < MIN_BLASON_DIM:
            continue
        # Exclude small blobs touching page edges (binding/margin noise)
        # But keep large edge blobs — they may contain real blasons
        # and will be split below if oversized.
        if x1 < 5 and bw < MIN_BLASON_DIM * 2:
            continue
        if y1 < 5 and bh < MIN_BLASON_DIM * 2:
            continue

        # If blob is too tall, split into N sub-blobs vertically
        if bh > max_h:
            n_split = round(bh / (max_h * 0.7))
            if n_split < 2:
                n_split = 2
            sub_h = bh // n_split
            for j in range(n_split):
                sy1 = y1 + j * sub_h
                sy2 = y1 + (j + 1) * sub_h if j < n_split - 1 else y2
                sbh = sy2 - sy1
                if sbh < MIN_BLASON_DIM:
                    continue
                # Refine x-bounds: find dense heraldic region in this sub-row
                sub_mask = mask[sy1:sy2, :]
                col_sums = np.sum(sub_mask, axis=0).astype(float)
                # Smooth to find main cluster
                kern = np.ones(15) / 15
                col_smooth = np.convolve(col_sums, kern, mode="same")
                thresh = col_smooth.max() * 0.15
                active_cols = np.where(col_smooth > thresh)[0]
                if len(active_cols) > 0:
                    sx1 = int(active_cols[0])
                    sx2 = int(active_cols[-1])
                    sbw = sx2 - sx1
                else:
                    sx1, sx2, sbw = x1, x2, bw
                # If still too wide, trim to max_w centered on densest region
                if sbw > max_w:
                    peak_col = int(np.argmax(col_smooth))
                    half = int(max_w // 2)
                    sx1 = max(0, peak_col - half)
                    sx2 = min(img_w, peak_col + half)
                    sbw = sx2 - sx1
                if sbw < MIN_BLASON_DIM:
                    continue
                blobs.append({
                    "x1": sx1, "y1": sy1, "x2": sx2, "y2": sy2,
                    "cx": (sx1 + sx2) // 2, "cy": (sy1 + sy2) // 2,
                    "w": sbw, "h": sbh,
                })
            continue

        if bw > max_w:
            continue
        ratio = bw / bh
        if ratio < 0.3 or ratio > 2.5:
            continue

        blobs.append({
            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            "cx": (x1 + x2) // 2, "cy": (y1 + y2) // 2,
            "w": bw, "h": bh,
        })

    return blobs


def filter_to_column(blobs, n_expected, img_w):
    """Keep blobs in the dominant vertical column."""
    if len(blobs) <= n_expected:
        blobs.sort(key=lambda b: b["cy"])
        return blobs

    # Find column with most blobs
    best_cluster = []
    for b in blobs:
        cluster = [bb for bb in blobs if abs(bb["cx"] - b["cx"]) < img_w * 0.12]
        if len(cluster) > len(best_cluster):
            best_cluster = cluster

    if len(best_cluster) >= n_expected:
        blobs = best_cluster

    # Still too many? Keep biggest by area
    if len(blobs) > n_expected:
        blobs.sort(key=lambda b: b["w"] * b["h"], reverse=True)
        blobs = blobs[:n_expected]

    blobs.sort(key=lambda b: b["cy"])
    return blobs


def interpolate_missing(blobs, n_expected, img_h):
    """
    When CC finds fewer blobs than expected, interpolate missing positions.

    Gap-detection approach: instead of assuming uniform spacing from page top,
    find which gaps between consecutive blobs are abnormally large and insert
    synthetic blobs only there. Also check for room above first / below last.
    """
    if len(blobs) >= n_expected or len(blobs) < 2:
        return blobs

    blobs.sort(key=lambda b: b["cy"])
    n_missing = n_expected - len(blobs)

    avg_w = int(np.mean([b["w"] for b in blobs]))
    avg_h = int(np.mean([b["h"] for b in blobs]))
    avg_cx = int(np.mean([b["cx"] for b in blobs]))

    # Estimate base spacing: use gaps that aren't abnormally large
    gaps = []
    for i in range(len(blobs) - 1):
        gaps.append(blobs[i + 1]["cy"] - blobs[i]["cy"])

    min_gap = min(gaps)
    # Normal gaps are those below 1.5x the minimum
    normal_gaps = [g for g in gaps if g < min_gap * 1.6]
    if not normal_gaps:
        normal_gaps = gaps
    base_spacing = int(np.median(normal_gaps))

    # Build result: start with real blobs
    result = list(blobs)
    inserted = 0

    def make_synthetic(cy):
        half_w, half_h = avg_w // 2, avg_h // 2
        return {
            "x1": avg_cx - half_w, "y1": cy - half_h,
            "x2": avg_cx + half_w, "y2": cy + half_h,
            "cx": avg_cx, "cy": cy,
            "w": avg_w, "h": avg_h,
            "synthetic": True,
        }

    # PRIORITY 1: Fill large internal gaps (most reliable signal)
    result.sort(key=lambda b: b["cy"])
    i = 0
    while i < len(result) - 1 and inserted < n_missing:
        gap = result[i + 1]["cy"] - result[i]["cy"]
        n_fill = round(gap / base_spacing) - 1
        if n_fill > 0:
            n_fill = min(n_fill, n_missing - inserted)
            fill_spacing = gap / (n_fill + 1)
            for j in range(n_fill):
                cy = int(result[i]["cy"] + (j + 1) * fill_spacing)
                result.insert(i + 1 + j, make_synthetic(cy))
                inserted += 1
            i += n_fill
        i += 1

    # PRIORITY 2: Check room above first blob
    if inserted < n_missing:
        content_y1 = int(img_h * 0.05)
        room_above = result[0]["cy"] - content_y1
        slots_above = max(0, round(room_above / base_spacing) - 1)
        # Only insert above if there's clearly room (> 0.7 * spacing)
        if room_above > base_spacing * 0.7 and slots_above > 0:
            to_insert = min(slots_above, n_missing - inserted)
            for j in range(to_insert, 0, -1):
                cy = result[0]["cy"] - j * base_spacing
                result.insert(0, make_synthetic(cy))
                inserted += 1

    # PRIORITY 3: Check room below last blob
    if inserted < n_missing:
        content_y2 = int(img_h * 0.95)
        room_below = content_y2 - result[-1]["cy"]
        if room_below > base_spacing * 0.7:
            to_insert = min(max(0, round(room_below / base_spacing) - 1),
                            n_missing - inserted)
            for j in range(1, to_insert + 1):
                cy = result[-1]["cy"] + j * base_spacing
                result.append(make_synthetic(cy))
                inserted += 1

    result.sort(key=lambda b: b["cy"])
    return result[:n_expected]


def process_page(page_path, page_blasons, total_on_page):
    """Process one page: detect ALL blason positions, crop requested ones.

    Key fix: always detect `total_on_page` blobs (including Beauvais),
    then use each entry's `position` field to index into the full blob list.
    This prevents misalignment on mixed Sens/Beauvais pages.
    """
    img = Image.open(page_path)
    img_w, img_h = img.size
    hsv = np.array(img.convert("HSV"))

    # Detect ALL blobs on the page, not just n_sens
    blobs = find_blobs_cc(hsv, img_w, img_h)
    blobs = filter_to_column(blobs, total_on_page, img_w)

    method = "CC"
    if len(blobs) < total_on_page:
        blobs = interpolate_missing(blobs, total_on_page, img_h)
        method = "HY"

    # Crop each requested blason using position-based indexing
    crops = []
    for blason in page_blasons:
        pos_idx = blason["position"] - 1  # 0-based index

        if pos_idx >= len(blobs):
            crops.append(None)
            continue

        blob = blobs[pos_idx]
        bw, bh = blob["w"], blob["h"]

        # Uniform margin: 30% of max dimension
        margin = int(max(bw, bh) * 0.30)
        cx1 = max(0, blob["x1"] - margin)
        cy1 = max(0, blob["y1"] - margin)
        cx2 = min(img_w, blob["x2"] + margin)
        cy2 = min(img_h, blob["y2"] + margin)

        safe_name = blason["nom"].replace(" ", "_").replace("'", "")[:40]
        output_path = BLASONS_DIR / f"blason_{blason['page']:03d}_{blason['position']:02d}_{safe_name}.jpg"

        # Delete old files for this position
        for old in BLASONS_DIR.glob(f"blason_{blason['page']:03d}_{blason['position']:02d}_*.jpg"):
            old.unlink()

        cropped = img.crop((cx1, cy1, cx2, cy2))
        cropped.save(output_path, "JPEG", quality=92)
        crops.append(output_path)

        syn = " (interpolated)" if blob.get("synthetic") else ""
        print(f"  pos{blason['position']} {safe_name[:30]:30s} {blob['w']:3d}x{blob['h']:3d}{syn}")

    return method, crops


def main():
    with open("output/hozier_sens/detections.json", encoding="utf-8") as f:
        detections = json.load(f)

    all_entries = [
        b for b in detections
        if b["page"] not in (37, 40)
    ]
    sens = [
        b for b in all_entries
        if "beauvais" not in b.get("lieu", "").lower()
    ]
    pages = sorted(set(b["page"] for b in sens))

    # Compute total blasons per page (including Beauvais)
    from collections import defaultdict
    total_per_page = defaultdict(int)
    for b in all_entries:
        total_per_page[b["page"]] = max(total_per_page[b["page"]], b["position"])

    total_cc = 0
    total_hy = 0

    for page_num in pages:
        page_path = PAGES_DIR / f"hozier_sens_p{page_num}.jpg"
        if not page_path.exists():
            page_path = PAGES_DIR / f"hozier_sens_p{page_num:03d}.jpg"
        if not page_path.exists():
            continue

        page_blasons = sorted(
            [b for b in sens if b["page"] == page_num],
            key=lambda b: b["position"],
        )
        n_sens = len(page_blasons)
        n_total = total_per_page[page_num]

        print(f"\nPage {page_num} ({n_sens} Sens / {n_total} total):")
        method, crops = process_page(page_path, page_blasons, n_total)

        n_ok = sum(1 for c in crops if c is not None)
        if method == "CC":
            total_cc += n_ok
        else:
            total_hy += n_ok
        print(f"  => {method} {n_ok}/{n_sens}")

    print(f"\n=== {total_cc} CC + {total_hy} Hybrid = {total_cc + total_hy} total ===")

    # Post-fix: p52 Guillaume Viart (pos1) and Louise Alix (pos2) share
    # the same physical blason (husband+wife arms). Pos2 should use pos1's crop,
    # and the remaining entries (pos3-6) map to physical slots 2-5.
    print("\n--- Post-fix: p52 couple Viart ---")
    p52_path = PAGES_DIR / "hozier_sens_p52.jpg"
    if p52_path.exists():
        p52_blasons = sorted(
            [b for b in sens if b["page"] == 52],
            key=lambda b: b["position"],
        )
        img = Image.open(p52_path)
        img_w, img_h = img.size
        hsv = np.array(img.convert("HSV"))

        # Detect all blobs (5 physical blasons)
        blobs = find_blobs_cc(hsv, img_w, img_h)
        blobs = filter_to_column(blobs, 5, img_w)
        if len(blobs) < 5:
            blobs = interpolate_missing(blobs, 5, img_h)
        blobs.sort(key=lambda b: b["cy"])

        # Mapping: pos1→blob0, pos2→blob0 (shared), pos3→blob1, ..., pos6→blob4
        pos_to_blob = {1: 0, 2: 0, 3: 1, 4: 2, 5: 3, 6: 4}

        for blason in p52_blasons:
            bi = pos_to_blob.get(blason["position"])
            if bi is None or bi >= len(blobs):
                continue
            blob = blobs[bi]
            margin = int(max(blob["w"], blob["h"]) * 0.30)
            cx1 = max(0, blob["x1"] - margin)
            cy1 = max(0, blob["y1"] - margin)
            cx2 = min(img_w, blob["x2"] + margin)
            cy2 = min(img_h, blob["y2"] + margin)

            safe_name = blason["nom"].replace(" ", "_").replace("'", "")[:40]
            for old in BLASONS_DIR.glob(f"blason_052_{blason['position']:02d}_*.jpg"):
                old.unlink()
            out = BLASONS_DIR / f"blason_052_{blason['position']:02d}_{safe_name}.jpg"
            img.crop((cx1, cy1, cx2, cy2)).save(out, "JPEG", quality=92)
            print(f"  pos{blason['position']} {safe_name[:30]:30s} {blob['w']:3d}x{blob['h']:3d}")


if __name__ == "__main__":
    main()
