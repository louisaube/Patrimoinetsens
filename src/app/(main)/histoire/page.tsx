"use client"

import * as React from "react"
import Link from "next/link"
import type maplibregl from "maplibre-gl"
import { MapPin, BookOpen, ChevronDown, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import chapitresData from "../../../../public/data/histoire-chapitres.json"
import glossaireData from "../../../../public/data/histoire-glossaire.json"

// ─── Types ──────────────────────────────────────────────────────────────────

interface StoryEvent {
  year: number
  title: string
  text: string
  longText?: string
  location: { lat: number; lng: number; label: string }
  sources: string[]
  heritageItemId: string | null
}

interface Chapter {
  id: string
  title: string
  period: string
  periodLabel: string
  summary: string
  color: string
  events: StoryEvent[]
}

const chapters = chapitresData.chapters as Chapter[]

// ─── Mini-carte statique (pas besoin de MapLibre ici, juste un lien OSM) ────

function EventLocationBadge({ event }: { event: StoryEvent }) {
  const { lat, lng, label } = event.location
  return (
    <a
      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=17`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 hover:underline transition-colors"
    >
      <MapPin className="size-3 shrink-0" />
      <span>{label}</span>
    </a>
  )
}

// ─── Glossaire inline (tooltip sur les termes) ─────────────────────────────

const glossaryTerms = glossaireData.terms as { term: string; definition: string }[]
const glossaryMap = new Map(glossaryTerms.map((t) => [t.term.toLowerCase(), t.definition]))

function GlossaryText({ text }: { text: string }) {
  // Chercher les termes du glossaire dans le texte et les wrapper en tooltips
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  // Trier les termes par longueur décroissante (matcher les plus longs d'abord)
  const sortedTerms = [...glossaryMap.keys()].sort((a, b) => b.length - a.length)

  while (remaining.length > 0) {
    let earliestMatch: { index: number; term: string; length: number } | null = null

    for (const term of sortedTerms) {
      const idx = remaining.toLowerCase().indexOf(term)
      if (idx !== -1 && (!earliestMatch || idx < earliestMatch.index)) {
        earliestMatch = { index: idx, term, length: term.length }
      }
    }

    if (!earliestMatch) {
      parts.push(remaining)
      break
    }

    // Texte avant le terme
    if (earliestMatch.index > 0) {
      parts.push(remaining.slice(0, earliestMatch.index))
    }

    // Le terme avec tooltip
    const matchedText = remaining.slice(earliestMatch.index, earliestMatch.index + earliestMatch.length)
    const definition = glossaryMap.get(earliestMatch.term)
    parts.push(
      <span
        key={key++}
        className="border-b border-dotted border-amber-400 cursor-help"
        title={definition}
      >
        {matchedText}
      </span>
    )

    remaining = remaining.slice(earliestMatch.index + earliestMatch.length)

    // Éviter les boucles infinies sur le même terme
    if (remaining.toLowerCase().startsWith(earliestMatch.term)) {
      parts.push(remaining[0])
      remaining = remaining.slice(1)
    }
  }

  return <p>{parts}</p>
}

// ─── Composant événement ────────────────────────────────────────────────────

function EventCard({ event, chapterColor }: { event: StoryEvent; chapterColor: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const [showLong, setShowLong] = React.useState(false)

  return (
    <article className="relative pl-8 pb-8 group">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1 size-4 rounded-full border-2 border-white shadow-sm"
        style={{ backgroundColor: chapterColor }}
      />
      {/* Timeline line */}
      <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-stone-200 group-last:hidden" />

      {/* Year */}
      <div className="flex items-baseline gap-3 mb-1">
        <span
          className="font-mono text-sm font-bold"
          style={{ color: chapterColor }}
        >
          {event.year < 0 ? `${Math.abs(event.year)} av. J.-C.` : event.year}
        </span>
        <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
          {event.title}
        </h3>
      </div>

      {/* Location */}
      <div className="mb-2">
        <EventLocationBadge event={event} />
      </div>

      {/* Text with glossary highlights */}
      <div className="text-stone-700 leading-relaxed text-[15px]">
        <GlossaryText text={event.text} />
      </div>

      {/* Version longue */}
      {event.longText && (
        <div className="mt-2">
          <button
            onClick={() => setShowLong(!showLong)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
          >
            <BookOpen className="size-3" />
            {showLong ? "Version courte" : "Lire la version longue"}
            <ChevronDown
              className={`size-3 transition-transform ${showLong ? "rotate-180" : ""}`}
            />
          </button>
          {showLong && (
            <div className="mt-3 pl-3 border-l-2 border-amber-200 space-y-3">
              {event.longText.split("\n\n").map((para, i) => (
                <p key={i} className="text-stone-600 leading-relaxed text-[14px]">
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Heritage item link */}
      {event.heritageItemId && (
        <Link
          href={`/heritage/${event.heritageItemId}`}
          className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-800 hover:underline"
        >
          <BookOpen className="size-3" />
          Voir la fiche patrimoine
          <ExternalLink className="size-3" />
        </Link>
      )}

      {/* Sources (collapsible) */}
      {event.sources.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            <ChevronDown
              className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            {event.sources.length} source{event.sources.length > 1 ? "s" : ""}
          </button>
          {expanded && (
            <ul className="mt-1 space-y-0.5">
              {event.sources.map((s, i) => (
                <li key={i} className="text-xs text-stone-400 italic pl-4">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  )
}

// ─── Composant chapitre ─────────────────────────────────────────────────────

function ChapterSection({ chapter }: { chapter: Chapter }) {
  return (
    <section id={`chapitre-${chapter.id}`} className="scroll-mt-20">
      {/* Chapter header */}
      <div className="mb-6 pt-8 first:pt-0">
        <div className="flex items-center gap-3 mb-2">
          <Badge
            className="text-white text-xs font-mono px-2 py-0.5"
            style={{ backgroundColor: chapter.color }}
          >
            {chapter.id}
          </Badge>
          <span className="text-xs text-stone-400 font-mono">
            {chapter.period}
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          {chapter.title}
        </h2>
        <p className="mt-2 text-stone-600 leading-relaxed">
          {chapter.summary}
        </p>
      </div>

      {/* Events timeline */}
      <div className="ml-2">
        {chapter.events.map((event, i) => {
          const chapterIdx = chapters.indexOf(chapter)
          return (
            <div key={i} data-event-idx={`${chapterIdx}-${i}`}>
              <EventCard event={event} chapterColor={chapter.color} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Navigation chapitres ───────────────────────────────────────────────────

function ChapterNav({ activeChapter }: { activeChapter: string }) {
  return (
    <nav className="sticky top-16 z-10 bg-white/80 backdrop-blur-sm border-b border-stone-100 -mx-4 px-4 py-2 mb-6 overflow-x-auto">
      <div className="flex gap-1">
        {chapters.map((ch) => (
          <a
            key={ch.id}
            href={`#chapitre-${ch.id}`}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeChapter === ch.id
                ? "text-white"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            }`}
            style={activeChapter === ch.id ? { backgroundColor: ch.color } : undefined}
          >
            <span className="font-mono">{ch.id}</span>
            <span className="hidden sm:inline">{ch.periodLabel}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}

// ─── Mini-carte synchronisée (desktop only) ────────────────────────────────

function SyncMap({ activeEvent }: { activeEvent: StoryEvent | null }) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const mapInstanceRef = React.useRef<maplibregl.Map | null>(null)
  const markerRef = React.useRef<maplibregl.Marker | null>(null)

  // Charger MapLibre dynamiquement (côté client uniquement)
  React.useEffect(() => {
    let cancelled = false

    async function initMap() {
      const maplibregl = (await import("maplibre-gl")).default
      await import("maplibre-gl/dist/maplibre-gl.css")

      if (cancelled || !mapRef.current) return

      const map = new maplibregl.Map({
        container: mapRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [3.2837, 48.1977],
        zoom: 14,
        attributionControl: false,
        interactive: true,
      })

      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right")

      const marker = new maplibregl.Marker({ color: "#92400e" })
        .setLngLat([3.2837, 48.1977])
        .addTo(map)

      mapInstanceRef.current = map
      markerRef.current = marker
    }

    initMap()
    return () => { cancelled = true }
  }, [])

  // Fly to active event location
  React.useEffect(() => {
    if (!activeEvent || !mapInstanceRef.current || !markerRef.current) return
    const { lat, lng } = activeEvent.location
    mapInstanceRef.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1200,
      essential: true,
    })
    markerRef.current.setLngLat([lng, lat])
  }, [activeEvent])

  return (
    <div className="hidden lg:block">
      <div className="sticky top-20 h-[calc(100vh-6rem)] rounded-xl overflow-hidden border border-stone-200 shadow-sm">
        <div ref={mapRef} className="h-full w-full" />
        {activeEvent && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <p className="text-xs font-mono text-amber-700">
              {activeEvent.year < 0 ? `${Math.abs(activeEvent.year)} av. J.-C.` : activeEvent.year}
            </p>
            <p className="text-sm font-medium text-stone-900 leading-tight truncate">
              {activeEvent.location.label}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page principale ────────────────────────────────────────────────────────

export default function HistoirePage() {
  const [activeChapter, setActiveChapter] = React.useState(chapters[0]?.id ?? "I")
  const [activeEvent, setActiveEvent] = React.useState<StoryEvent | null>(null)

  // Observer pour chapitres ET événements
  React.useEffect(() => {
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("chapitre-", "")
            setActiveChapter(id)
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    const eventObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute("data-event-idx")
            if (idx) {
              const [chIdx, evIdx] = idx.split("-").map(Number)
              const ev = chapters[chIdx]?.events[evIdx]
              if (ev) setActiveEvent(ev)
            }
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    )

    for (const ch of chapters) {
      const el = document.getElementById(`chapitre-${ch.id}`)
      if (el) chapterObserver.observe(el)
    }

    document.querySelectorAll("[data-event-idx]").forEach((el) => {
      eventObserver.observe(el)
    })

    return () => {
      chapterObserver.disconnect()
      eventObserver.disconnect()
    }
  }, [])

  const totalEvents = chapters.reduce((sum, ch) => sum + ch.events.length, 0)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative bg-stone-900 text-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
            {chapitresData.subtitle}
          </p>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
            {chapitresData.title}
          </h1>
          <p className="mt-4 text-stone-300 max-w-lg mx-auto leading-relaxed">
            De Brennus aux Trente Glorieuses, l&apos;histoire de Sens racontée
            comme un livre — chapitre par chapitre, lieu par lieu.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-stone-400">
            <span>{chapters.length} chapitres</span>
            <span className="size-1 rounded-full bg-stone-600" />
            <span>{totalEvents} événements</span>
            <span className="size-1 rounded-full bg-stone-600" />
            <span>2 500 ans</span>
          </div>
        </div>
      </header>

      {/* Split-screen: récit (gauche) + carte (droite, desktop only) */}
      <div className="lg:grid lg:grid-cols-[1fr,400px] lg:gap-6 lg:max-w-6xl lg:mx-auto lg:px-6">
        {/* Content — récit */}
        <main className="mx-auto max-w-2xl px-4 pb-24 lg:max-w-none lg:px-0">
          <ChapterNav activeChapter={activeChapter} />

          <div className="space-y-12">
            {chapters.map((chapter) => (
              <ChapterSection key={chapter.id} chapter={chapter} />
            ))}
          </div>

          <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
            <p className="text-sm text-stone-400">
              Sources : Daguin, Brousse, Cailleaux, Bulletins SAS, Mérimée, Cahiers de doléances (1789).
            </p>
            <p className="text-xs text-stone-300 mt-2">
              Niveau de lecture : collège / lycée. Chaque fait est sourcé.
            </p>
          </footer>
        </main>

        {/* Carte synchronisée — desktop only */}
        <SyncMap activeEvent={activeEvent} />
      </div>
    </div>
  )
}
