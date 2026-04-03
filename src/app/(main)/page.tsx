"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, PlusCircle, AlertTriangle, BookOpen, Mic, Heart, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { categoryLabel, contributionTypeLabel, formatDate } from "@/lib/utils"
import type { ContributionType, HeritageCategory } from "@/types"

// ─── Données mock ────────────────────────────────────────────────────────────

const STATS = [
  { label: "Éléments documentés", value: 47 },
  { label: "Contributions", value: 213 },
  { label: "Signalements", value: 12 },
]

const CTA_CARDS = [
  {
    href: "/map",
    icon: MapPin,
    title: "Explorer la carte",
    description: "Découvrez le patrimoine géolocalisé de Sens et ses environs.",
    color: "bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    href: "/heritage/new",
    icon: PlusCircle,
    title: "Documenter un élément",
    description: "Créez une fiche pour un édifice, monument ou élément naturel.",
    color: "bg-amber-50 text-amber-800",
    iconBg: "bg-amber-100",
  },
  {
    href: "/report",
    icon: AlertTriangle,
    title: "Signaler un problème",
    description: "Dégradation, danger, disparition — signalez en deux clics.",
    color: "bg-red-50 text-red-700",
    iconBg: "bg-red-100",
  },
]

const RECENT_CONTRIBUTIONS: Array<{
  id: string
  type: ContributionType
  body: string
  authorName: string
  heritageTitle: string
  heritageCategory: HeritageCategory
  createdAt: string
}> = [
  {
    id: "1",
    type: "historique",
    body: "La cathédrale Saint-Étienne de Sens est l'une des premières cathédrales gothiques de France, dont la construction débuta vers 1135 sous l'archevêque Henri le Sanglier.",
    authorName: "Denis Moreau",
    heritageTitle: "Cathédrale Saint-Étienne",
    heritageCategory: "edifice_religieux",
    createdAt: "2026-03-28T10:30:00Z",
  },
  {
    id: "2",
    type: "temoignage",
    body: "J'ai photographié les vitraux de la nef centrale lors de la restauration de 2019. Les couleurs sont saisissantes au soleil couchant.",
    authorName: "Marie Dupont",
    heritageTitle: "Cathédrale Saint-Étienne",
    heritageCategory: "edifice_religieux",
    createdAt: "2026-03-26T14:00:00Z",
  },
  {
    id: "3",
    type: "recit",
    body: "On raconte que Thomas Becket, archevêque de Canterbury, trouva refuge à Sens après son exil en 1164. La ville lui ouvrit ses portes et ses caves !",
    authorName: "Bernard Leclerc",
    heritageTitle: "Palais synodal",
    heritageCategory: "batiment_historique",
    createdAt: "2026-03-25T09:15:00Z",
  },
]

const CONTRIBUTION_ICONS: Record<ContributionType, React.FC<{ className?: string }>> = {
  historique: BookOpen,
  recit: Mic,
  temoignage: Heart,
  observation: Eye,
}

// ─── Composant AnimatedCounter ───────────────────────────────────────────────

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = React.useState(0)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()

        const duration = 1200
        const step = Math.ceil(target / (duration / 16))
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          setCount(current)
          if (current >= target) clearInterval(timer)
        }, 16)
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString("fr-FR")}</span>
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-3 pt-4">
        <h1 className="font-serif text-3xl font-bold text-stone-800 leading-tight sm:text-4xl">
          Patrimoine <span className="text-emerald-700">&amp; Sens</span>
        </h1>
        <p className="text-stone-500 text-base sm:text-lg max-w-xl mx-auto">
          Documentez et protégez le patrimoine local — bâtiments historiques,
          édifices religieux, mobilier urbain, patrimoine naturel.
        </p>
      </section>

      {/* Compteurs */}
      <section>
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="bg-white border-stone-100 shadow-sm text-center">
              <CardContent className="py-5 px-3">
                <p className="font-serif text-3xl font-bold text-emerald-700">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="mt-1 text-xs text-stone-500 leading-tight">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-stone-700 mb-4">
          Que souhaitez-vous faire ?
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CTA_CARDS.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="bg-white border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 h-full cursor-pointer group">
                <CardContent className="flex flex-col gap-3 p-5 h-full">
                  <div className={`flex size-10 items-center justify-center rounded-lg ${card.iconBg}`}>
                    <card.icon className={`size-5 ${card.color.split(" ")[1]}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm group-hover:text-emerald-800 transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator />

      {/* Dernières contributions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-stone-700">
            Dernières contributions
          </h2>
          <Link
            href="/map"
            className="text-sm text-emerald-700 hover:underline font-medium"
          >
            Tout explorer →
          </Link>
        </div>

        <div className="space-y-3">
          {RECENT_CONTRIBUTIONS.map((contribution) => {
            const Icon = CONTRIBUTION_ICONS[contribution.type]
            return (
              <Card
                key={contribution.id}
                className="bg-white border-stone-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-100 mt-0.5">
                      <Icon className="size-4 text-stone-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link
                          href={`/heritage/1`}
                          className="text-sm font-medium text-stone-800 hover:text-emerald-700 truncate"
                        >
                          {contribution.heritageTitle}
                        </Link>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {categoryLabel(contribution.heritageCategory)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {contributionTypeLabel(contribution.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {contribution.body}
                      </p>
                      <p className="mt-1.5 text-xs text-stone-400">
                        Par{" "}
                        <span className="font-medium text-stone-500">
                          {contribution.authorName}
                        </span>{" "}
                        · {formatDate(contribution.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Pied de page léger */}
      <div className="pb-4 text-center text-xs text-stone-400">
        Patrimoine &amp; Sens — Sens, Yonne · Association patrimoniale locale
      </div>
    </div>
  )
}
