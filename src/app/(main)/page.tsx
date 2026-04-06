"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  BookOpen,
  Mic,
  Shield,
  Church,
  Landmark,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import annuaireData from "../../../public/armorial/annuaire.json"

// ─── Vraies données ─────────────────────────────────────────────────────────

const STATS = {
  heritageItems: 71,
  contributions: 56,
  blasons: annuaireData.entries.length,
}

/** Contributions réelles tirées du seed (Denis, Bernard) */
const HIGHLIGHTS = [
  {
    id: "cathedrale",
    title: "Cathédrale Saint-Étienne",
    category: "Édifice religieux",
    period: "1135 — 1534",
    icon: Church,
    excerpt:
      "On dit souvent que Sens est « la première cathédrale gothique ». La réalité est plus intéressante : les travaux ont démarré vers 1135, le chœur a été consacré en 1164 en présence du pape Alexandre III.",
    author: "Denis Cailleaux",
    type: "historique" as const,
  },
  {
    id: "becket",
    title: "Thomas Becket à Sens",
    category: "Récit",
    period: "1164 — 1170",
    icon: Mic,
    excerpt:
      "En 1164, Thomas Becket, archevêque de Canterbury, s'enfuit d'Angleterre. Il se réfugie à Sens, protégé par le pape. Pendant six ans, il prie chaque matin dans la cathédrale avant le lever du jour.",
    author: "Bernard Brousse",
    type: "recit" as const,
  },
  {
    id: "palais",
    title: "Palais synodal",
    category: "Bâtiment historique",
    period: "XIIIe siècle",
    icon: Landmark,
    excerpt:
      "Au XIIIe siècle, l'archevêque de Sens — primat des Gaules — commande un palais digne de son rang. La salle synodale, où se réunissaient les évêques des sept diocèses, est l'une des plus belles salles civiles du Moyen Âge.",
    author: "Denis Cailleaux",
    type: "historique" as const,
  },
]

/** 4 blasons aléatoires pour la vitrine armorial */
const FEATURED_BLASONS = [0, 6, 33, 52].map((i) => annuaireData.entries[i])

const TYPE_COLORS = {
  historique: "bg-blue-100 text-blue-800",
  recit: "bg-amber-100 text-amber-800",
}

// ─── Composant AnimatedCounter ──────────────────────────────────────────────

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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-12">
      {/* ── Hero ── */}
      <section className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
          <span className="size-2 rounded-full bg-amber-400" />
          Sens, Yonne · Primat des Gaules
        </div>
        <h1 className="font-serif text-4xl font-bold text-slate-900 leading-tight sm:text-5xl tracking-tight">
          Patrimoine{" "}
          <span className="text-blue-800">&amp;&nbsp;Sens</span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          L&apos;encyclopédie vivante du patrimoine sénonais.
          Cathédrale gothique, maisons à colombages, remparts gallo-romains,
          101&nbsp;blasons de 1696 — documentés, géolocalisés, racontés.
        </p>
      </section>

      {/* ── Compteurs ── */}
      <section>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Éléments patrimoniaux", value: STATS.heritageItems, sub: "documentés" },
            { label: "Contributions", value: STATS.contributions, sub: "d'historiens et passionnés" },
            { label: "Blasons d'Hozier", value: STATS.blasons, sub: "Élection de Sens, 1696" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white border-slate-200 shadow-sm text-center">
              <CardContent className="py-5 px-3">
                <p className="font-serif text-3xl font-bold text-blue-800">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="mt-1 text-xs text-slate-600 leading-tight font-medium">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Navigation rapide ── */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/map">
          <Card className="bg-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all h-full cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                <MapPin className="size-5 text-blue-800" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm group-hover:underline">
                  Explorer la carte
                </h3>
                <p className="text-xs text-blue-700/70">
                  71 éléments géolocalisés
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/armorial">
          <Card className="bg-amber-50 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all h-full cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                <Shield className="size-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 text-sm group-hover:underline">
                  Armorial d&apos;Hozier
                </h3>
                <p className="text-xs text-amber-700/70">
                  101 blasons de 1696
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/report">
          <Card className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100">
                <BookOpen className="size-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm group-hover:underline">
                  Contribuer
                </h3>
                <p className="text-xs text-slate-500">
                  Signaler, documenter, raconter
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* ── Vitrine : contributions réelles ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl font-bold text-slate-800">
            À la une
          </h2>
          <Link
            href="/map"
            className="text-sm text-blue-800 hover:underline font-medium flex items-center gap-1"
          >
            Tout explorer <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {HIGHLIGHTS.map((item) => (
            <Card
              key={item.id}
              className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 mt-0.5">
                    <item.icon className="size-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-slate-800">
                        {item.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge className={`text-xs ${TYPE_COLORS[item.type]}`}>
                        {item.type === "historique" ? "Historique" : "Récit"}
                      </Badge>
                      <span className="text-xs text-slate-400 ml-auto">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Par{" "}
                      <span className="font-medium text-slate-500">
                        {item.author}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Vitrine Armorial ── */}
      <section className="rounded-xl bg-gradient-to-br from-slate-800 to-blue-900 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Armorial d&apos;Hozier
            </h2>
            <p className="text-sm text-blue-200 mt-1">
              Élection de Sens · 101 blasons · 1696
            </p>
          </div>
          <Link
            href="/armorial"
            className="text-sm text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1"
          >
            Voir tout <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURED_BLASONS.map((blason) => (
            <Link
              key={blason.image}
              href="/armorial"
              className="group"
            >
              <div className="rounded-lg overflow-hidden bg-white/10 border border-white/20 hover:border-amber-400/50 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/armorial/blasons/${encodeURIComponent(blason.image)}`}
                  alt={`Blason de ${blason.nom}`}
                  className="w-full aspect-square object-contain p-3 bg-stone-50/90"
                  loading="lazy"
                />
                <div className="p-2.5 bg-slate-900/50">
                  <p className="text-xs text-white font-medium truncate">
                    {blason.nom}
                  </p>
                  <p className="text-[10px] text-blue-300 truncate">
                    {blason.titre}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contexte historique ── */}
      <section className="rounded-xl bg-amber-50 border border-amber-200 p-6">
        <h2 className="font-serif text-xl font-bold text-amber-900 mb-3">
          Pourquoi Sens ?
        </h2>
        <div className="text-sm text-amber-800 leading-relaxed space-y-3">
          <p>
            Sens est une ville qu&apos;on sous-estime. Au Moyen Âge, son archevêque
            était le <strong>Primat des Gaules</strong> — il avait autorité
            sur Paris, Chartres, Meaux, Orléans, Auxerre, Nevers et Troyes.
          </p>
          <p>
            Sa cathédrale (1135) est l&apos;un des tout premiers édifices gothiques.
            Un pape y a vécu. Thomas Becket y a trouvé refuge.
            71&nbsp;monuments sont classés ou inscrits.
          </p>
          <p>
            <strong>Patrimoine &amp; Sens</strong> réunit historiens, passionnés
            et habitants pour documenter ce patrimoine — avec rigueur, mais
            accessible à tous.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pb-4 text-center space-y-1">
        <p className="text-xs text-slate-400">
          Patrimoine &amp; Sens — Sens, Yonne
        </p>
        <p className="text-[10px] text-slate-300">
          Sources : Gallica/BnF · Mérimée · Rietstap · Sigilla IRHT/CNRS · Brousse 2024
        </p>
      </footer>
    </div>
  )
}
