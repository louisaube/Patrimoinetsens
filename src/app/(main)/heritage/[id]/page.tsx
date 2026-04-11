"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  BookOpen,
  Mic,
  Heart,
  Eye,
  Plus,
  MapPin,
  ArrowLeft,
  Clock,
  ChevronDown,
  ChevronUp,
  Quote,
  ExternalLink,
  List,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  categoryLabel,
  contributionTypeLabel,
  formatDate,
  formatPeriod,
  getInitials,
  cn,
} from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useHeritage } from "@/hooks/use-heritage"
import { ImageCarousel, useHeritageImages } from "@/components/heritage/image-carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Contribution, ContributionType } from "@/types"

// ─── Constantes ──────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<ContributionType, React.FC<{ className?: string }>> = {
  historique: BookOpen,
  recit: Mic,
  temoignage: Heart,
  observation: Eye,
}

const TYPE_COLORS: Record<ContributionType, string> = {
  historique: "bg-blue-50 text-blue-700 border-blue-200",
  recit: "bg-purple-50 text-purple-700 border-purple-200",
  temoignage: "bg-rose-50 text-rose-700 border-rose-200",
  observation: "bg-amber-50 text-amber-700 border-amber-200",
}

const TYPE_ACCENT: Record<ContributionType, string> = {
  historique: "border-l-blue-400",
  recit: "border-l-purple-400",
  temoignage: "border-l-rose-400",
  observation: "border-l-amber-400",
}

// ─── Composant contribution longue ───────────────────────────────────────────

function ContributionSection({
  contribution,
  index,
}: {
  contribution: Contribution
  index: number
}) {
  const [expanded, setExpanded] = React.useState(true)
  const [showFurtherReading, setShowFurtherReading] = React.useState(false)
  const Icon = TYPE_ICONS[contribution.type]

  return (
    <section
      id={`contribution-${contribution.id}`}
      className={cn(
        "scroll-mt-20 border-l-4 rounded-r-lg bg-white shadow-sm",
        TYPE_ACCENT[contribution.type]
      )}
    >
      {/* En-tête cliquable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-5 text-left hover:bg-slate-50/50 transition-colors"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 text-sm font-bold mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-serif text-lg font-bold text-slate-800 leading-tight">
              {contribution.title ?? `Contribution ${index + 1}`}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge
              variant="outline"
              className={cn("gap-1", TYPE_COLORS[contribution.type])}
            >
              <Icon className="size-3" />
              {contributionTypeLabel(contribution.type)}
            </Badge>
            {contribution.period && (
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="size-3" />
                {contribution.period}
              </span>
            )}
            <span className="text-slate-400">
              Par{" "}
              <span className="font-medium text-slate-500">
                {contribution.author.name}
              </span>
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="size-4 text-slate-400 shrink-0 mt-2" />
        ) : (
          <ChevronDown className="size-4 text-slate-400 shrink-0 mt-2" />
        )}
      </button>

      {/* Corps */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <Separator className="bg-slate-100" />

          {/* Texte principal */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {contribution.body}
          </div>

          {/* Sources */}
          {contribution.sources && contribution.sources.length > 0 && (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">
                Sources
              </p>
              <ul className="space-y-1.5">
                {contribution.sources.map((source, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-600"
                  >
                    <Quote className="size-3 shrink-0 mt-0.5 text-slate-400" />
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pour aller plus loin */}
          {contribution.furtherReading && (
            <div>
              <button
                onClick={() => setShowFurtherReading(!showFurtherReading)}
                className="flex items-center gap-2 text-xs text-blue-700 hover:text-blue-900 font-medium transition-colors"
              >
                <BookOpen className="size-3.5" />
                Pour aller plus loin
                {showFurtherReading ? (
                  <ChevronUp className="size-3" />
                ) : (
                  <ChevronDown className="size-3" />
                )}
              </button>
              {showFurtherReading && (
                <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs text-blue-800 leading-relaxed whitespace-pre-wrap">
                    {contribution.furtherReading}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HeritageDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()
  const { data: heritage, loading, error } = useHeritage(id)
  const { images } = useHeritageImages(id)
  const [showToc, setShowToc] = React.useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    )
  }

  if (error || !heritage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Fiche introuvable</p>
        <Link href="/explorer" className="text-blue-800 underline text-sm">
          Retour à l&apos;explorateur
        </Link>
      </div>
    )
  }

  // Séparer les contributions par type et compter
  const historiques = heritage.contributions.filter((c) => c.type === "historique")
  const recits = heritage.contributions.filter((c) => c.type === "recit")
  const temoignages = heritage.contributions.filter((c) => c.type === "temoignage")
  const observations = heritage.contributions.filter((c) => c.type === "observation")

  // Toutes les contributions dans l'ordre d'affichage : historiques d'abord, puis récits, etc.
  const allContributions = [...historiques, ...recits, ...temoignages, ...observations]

  const typeCounts = [
    { type: "historique" as const, label: "Historique", count: historiques.length },
    { type: "recit" as const, label: "Récits", count: recits.length },
    { type: "temoignage" as const, label: "Témoignages", count: temoignages.length },
    { type: "observation" as const, label: "Observations", count: observations.length },
  ].filter((t) => t.count > 0)

  return (
    <div className="relative min-h-screen">
      {/* ── En-tête : image couverture ou carrousel ── */}
      <div className="relative">
        {/* Image couverture (hero) */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-200 sm:h-72">
          {heritage.coverPhotoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heritage.coverPhotoUrl}
              alt={heritage.title}
              className="h-full w-full object-cover"
            />
          ) : images.length > 0 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={images[0].thumbnail || images[0].url}
              alt={images[0].title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-blue-100">
              <MapPin className="size-16 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <Link
            href="/explorer"
            aria-label="Retour"
            className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white transition-all"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="mb-2 text-xs">
              {categoryLabel(heritage.category)}
            </Badge>
            <h1 className="font-serif text-2xl font-bold text-white leading-tight sm:text-3xl">
              {heritage.title}
            </h1>
            {(heritage.periodStart || heritage.periodEnd) && (
              <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {formatPeriod(heritage.periodStart, heritage.periodEnd)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="mx-auto max-w-3xl px-4 pb-24">
        {/* Barre d'info rapide */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
          <a
            href={`https://www.openstreetmap.org/?mlat=${heritage.latitude}&mlon=${heritage.longitude}&zoom=17`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-800 hover:underline"
          >
            <MapPin className="size-3.5" />
            Voir sur OpenStreetMap
            <ExternalLink className="size-3" />
          </a>
          <span className="text-slate-400">
            {heritage.contributions.length} contribution{heritage.contributions.length > 1 ? "s" : ""}
          </span>
          {typeCounts.map(({ type, label, count }) => {
            const Icon = TYPE_ICONS[type]
            return (
              <span key={type} className="flex items-center gap-1 text-slate-400">
                <Icon className="size-3" />
                {count} {label.toLowerCase()}
              </span>
            )
          })}
        </div>

        {/* ── Carrousel d'images ── */}
        {images.length > 1 && (
          <div className="mt-6">
            <ImageCarousel images={images} />
          </div>
        )}

        {/* ── Chapeau — synthèse courte ── */}
        {allContributions.length > 0 && (() => {
          const first = allContributions[0]
          // Extraire le premier paragraphe (avant le premier \n\n)
          const firstParagraph = first.body.split("\n\n")[0]
          return (
            <section className="mt-6 rounded-xl bg-white border border-slate-200 shadow-sm p-5">
              <h2 className="font-serif text-lg font-bold text-slate-800 mb-3">
                En bref
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {firstParagraph}
              </p>
              {allContributions.length > 1 && (
                <p className="mt-3 text-xs text-slate-400">
                  {allContributions.length} sections détaillées ci-dessous — architecture, rôle, restauration, récits…
                </p>
              )}
            </section>
          )
        })()}

        {/* ── Sommaire ── */}
        {allContributions.length > 2 && (
          <div className="mt-6">
            <button
              onClick={() => setShowToc(!showToc)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <List className="size-4" />
              Sommaire ({allContributions.length} sections)
              {showToc ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            {showToc && (
              <Card className="mt-2 bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <ol className="space-y-1.5">
                    {allContributions.map((c, i) => {
                      const Icon = TYPE_ICONS[c.type]
                      return (
                        <li key={c.id}>
                          <a
                            href={`#contribution-${c.id}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-800 transition-colors"
                            onClick={() => setShowToc(false)}
                          >
                            <span className="text-xs text-slate-400 w-5 text-right shrink-0">
                              {i + 1}.
                            </span>
                            <Icon className="size-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">
                              {c.title ?? `Contribution ${i + 1}`}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] ml-auto shrink-0",
                                TYPE_COLORS[c.type]
                              )}
                            >
                              {contributionTypeLabel(c.type)}
                            </Badge>
                          </a>
                        </li>
                      )
                    })}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Développement — contributions comme chapitres ── */}
        {allContributions.length > 0 && (
          <div className="mt-8 mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl font-bold text-slate-800">
              Développement
            </h2>
            <Separator className="flex-1" />
          </div>
        )}
        <div className="space-y-4">
          {allContributions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-slate-400 text-sm">
                Aucune contribution pour l&apos;instant.
              </p>
              <p className="text-slate-300 text-xs mt-1">
                Soyez le premier à documenter cet élément !
              </p>
            </div>
          ) : (
            allContributions.map((contribution, i) => (
              <ContributionSection
                key={contribution.id}
                contribution={contribution}
                index={i}
              />
            ))
          )}
        </div>
      </div>

      {/* ── FAB Contribuer ── */}
      {user && (
        <div className="fixed bottom-20 right-4 z-30 md:bottom-6">
          <Link
            href={`/heritage/${id}/contribute`}
            className="inline-flex items-center gap-2 rounded-full shadow-lg bg-blue-800 hover:bg-blue-900 text-white px-5 h-12 font-medium text-sm transition-colors"
          >
            <Plus className="size-5" />
            <span>Contribuer</span>
          </Link>
        </div>
      )}
    </div>
  )
}
