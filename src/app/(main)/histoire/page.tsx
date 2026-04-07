"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, BookOpen, ChevronDown, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import chapitresData from "../../../../public/data/histoire-chapitres.json"

// ─── Types ──────────────────────────────────────────────────────────────────

interface StoryEvent {
  year: number
  title: string
  text: string
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

// ─── Composant événement ────────────────────────────────────────────────────

function EventCard({ event, chapterColor }: { event: StoryEvent; chapterColor: string }) {
  const [expanded, setExpanded] = React.useState(false)

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

      {/* Text */}
      <p className="text-stone-700 leading-relaxed text-[15px]">
        {event.text}
      </p>

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
        {chapter.events.map((event, i) => (
          <EventCard key={i} event={event} chapterColor={chapter.color} />
        ))}
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

// ─── Page principale ────────────────────────────────────────────────────────

export default function HistoirePage() {
  const [activeChapter, setActiveChapter] = React.useState(chapters[0]?.id ?? "I")

  // Intersection Observer pour mettre à jour le chapitre actif au scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
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

    for (const ch of chapters) {
      const el = document.getElementById(`chapitre-${ch.id}`)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  // Compter les événements
  const totalEvents = chapters.reduce((sum, ch) => sum + ch.events.length, 0)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative bg-stone-900 text-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
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

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 pb-24">
        <ChapterNav activeChapter={activeChapter} />

        <div className="space-y-12">
          {chapters.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
          <p className="text-sm text-stone-400">
            Sources : Daguin, Brousse, Cailleaux, Bulletins SAS, Mérimée, Cahiers de doléances (1789).
          </p>
          <p className="text-xs text-stone-300 mt-2">
            Niveau de lecture : collège / lycée. Chaque fait est sourcé.
          </p>
        </footer>
      </main>
    </div>
  )
}
