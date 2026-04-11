"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, X, ImageIcon, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HeritageImage {
  id: string
  source: string
  title: string
  url: string
  thumbnail: string
  license: string
  width?: number
  height?: number
  description?: string
}

interface ImageGalleryProps {
  images: HeritageImage[]
  className?: string
}

// ─── Source labels ────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, string> = {
  commons: "Commons",
  gallica: "Gallica",
  archives_yonne: "Arch. Yonne",
  heritage: "Photo locale",
}

// ─── Nettoyage du titre ──────────────────────────────────────────────────────

function cleanTitle(title: string): string {
  // Retirer les extensions de fichier
  let clean = title.replace(/\.(jpg|jpeg|png|tif|tiff|gif|webp|svg)$/i, "")
  // Retirer les mentions "Médiathèque de l'architecture..."
  clean = clean.replace(/\s*-?\s*Médiathèque de l'architecture.*$/i, "")
  // Retirer les codes APMH
  clean = clean.replace(/\s*-?\s*APMH\d+.*$/i, "")
  // Retirer "Sens -" en fin
  clean = clean.replace(/\s*-\s*Sens\s*$/i, "")
  // Nettoyer les tirets multiples
  clean = clean.replace(/\s*-\s*-\s*/g, " — ")
  return clean.trim()
}

// ─── Galerie compacte ────────────────────────────────────────────────────────

export function ImageCarousel({ images, className }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
  const [imgErrors, setImgErrors] = React.useState<Set<string>>(new Set())
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const validImages = images.filter((img) => !imgErrors.has(img.id))

  if (validImages.length === 0) return null

  const handleError = (id: string) => {
    setImgErrors((prev) => new Set(prev).add(id))
  }

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  // Nombre d'images visibles selon la taille
  const showCount = Math.min(validImages.length, 12)
  const displayImages = validImages.slice(0, showCount)
  const hasMore = validImages.length > showCount

  return (
    <>
      <div className={cn("relative group", className)}>
        {/* Titre de section */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <ImageIcon className="size-3.5" />
            Iconographie
            <span className="font-normal text-slate-400">
              ({validImages.length} image{validImages.length > 1 ? "s" : ""})
            </span>
          </p>
        </div>

        {/* Bande scrollable */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          >
            {displayImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(i)}
                className="group/thumb shrink-0 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:border-blue-400 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ width: 140, height: 100 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumbnail || img.url}
                  alt={cleanTitle(img.title)}
                  className="h-full w-full object-cover"
                  onError={() => handleError(img.id)}
                  loading="lazy"
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/40 transition-all flex items-center justify-center">
                  <ZoomIn className="size-4 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                </div>
                {/* Légende en bas */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                  <p className="text-[9px] text-white/90 truncate leading-tight">
                    {cleanTitle(img.title)}
                  </p>
                  <p className="text-[8px] text-white/50">
                    {SOURCE_LABELS[img.source] ?? img.source}
                  </p>
                </div>
              </button>
            ))}

            {/* Bouton "voir plus" */}
            {hasMore && (
              <button
                onClick={() => setLightboxIndex(showCount)}
                className="shrink-0 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-400 hover:text-blue-700 transition-all"
                style={{ width: 100, height: 100 }}
              >
                <span className="text-lg font-bold">+{validImages.length - showCount}</span>
                <span className="text-[10px]">images</span>
              </button>
            )}
          </div>

          {/* Flèches de scroll */}
          {displayImages.length > 4 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-0 bottom-1 w-8 flex items-center justify-center bg-gradient-to-r from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Défiler à gauche"
              >
                <ChevronLeft className="size-4 text-slate-600" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-0 bottom-1 w-8 flex items-center justify-center bg-gradient-to-l from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Défiler à droite"
              >
                <ChevronRight className="size-4 text-slate-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={validImages}
          startIndex={Math.min(lightboxIndex, validImages.length - 1)}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: HeritageImage[]
  startIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = React.useState(startIndex)
  const img = images[index]

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length)
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [images.length, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Fermer */}
      <button
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        onClick={onClose}
        aria-label="Fermer"
      >
        <X className="size-5" />
      </button>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Précédente"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Suivante"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.url}
          alt={cleanTitle(img.title)}
          className="max-h-[75vh] w-auto mx-auto object-contain rounded"
        />
      </div>

      {/* Légende */}
      <div className="mt-4 text-center px-8 max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-white/90 leading-relaxed">
          {cleanTitle(img.title)}
        </p>
        <p className="text-xs text-white/40 mt-1">
          {SOURCE_LABELS[img.source] ?? img.source} · {img.license}
          {images.length > 1 && ` · ${index + 1} / ${images.length}`}
        </p>
      </div>
    </div>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useHeritageImages(heritageId: string) {
  const [images, setImages] = React.useState<HeritageImage[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/heritage/${heritageId}/images`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<{ images: HeritageImage[]; total: number }>
      })
      .then((data) => {
        if (!cancelled) {
          setImages(data.images)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [heritageId])

  return { images, loading }
}
