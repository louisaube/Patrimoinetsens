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
import { useStats } from "@/hooks/use-heritage"
import annuaireData from "../../../public/armorial/annuaire.json"

/** Contributions réelles tirées du seed (Denis, Bernard) */
const HIGHLIGHTS = [
  {
    id: "e5555555-0001-0001-0001-000000000001",
    title: "Cathédrale Saint-Étienne",
    category: "Édifice religieux",
    period: "1135 — 1534",
    icon: Church,
    excerpt:
      "Vers 1135, l'archevêque Henri Sanglier engage un chantier sans précédent. Les voûtes d'ogives sur plan sexpartite (divisé en six quartiers, une prouesse technique pour l'époque), la lumière qui inonde la nef — tout cela précède Chartres, Paris et Bourges. Le chœur est consacré en 1164, en présence d'Alexandre III, pape réfugié en France.",
    author: "Denis Cailleaux",
    type: "historique" as const,
  },
  {
    id: "e5555555-0001-0001-0001-000000000001",
    title: "Thomas Becket à Sens",
    category: "Récit",
    period: "1164 — 1170",
    icon: Mic,
    excerpt:
      "L'archevêque de Canterbury débarque à Sens en 1164, chassé d'Angleterre par Henri II Plantagenêt, roi d'Angleterre. Le pape le protège ; la cathédrale l'accueille. Pendant six années d'exil, Becket dit la messe à l'aube dans le transept nord (le bras gauche de la croix que forme l'édifice) — avant de rentrer mourir assassiné dans sa propre cathédrale.",
    author: "Bernard Brousse",
    type: "recit" as const,
  },
  {
    id: "e5555555-0002-0002-0002-000000000002",
    title: "Palais synodal",
    category: "Bâtiment historique",
    period: "1222 — 1875",
    icon: Landmark,
    excerpt:
      "L'archevêque Gauthier Cornut fait bâtir ce palais vers 1230. La salle synodale — c'est-à-dire la salle de concile où les évêques se réunissaient — mesure trente mètres de long et douze mètres sous plafond. Sens commandait alors à Paris : l'archevêque, primat des Gaules (le plus haut dignitaire de l'Église de France), avait autorité sur sept diocèses. Architecture, restauration Viollet-le-Duc, cachots de l'officialité — sept contributions à découvrir.",
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
  return <span>{target.toLocaleString("fr-FR")}</span>
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { data: stats } = useStats()
  const heritageCount = stats?.heritageItems ?? 136
  const contributionCount = stats?.contributions ?? 881

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
          Cathédrale gothique, remparts gallo-romains, maisons à colombages,
          101&nbsp;blasons de 1696 — vingt siècles d&apos;histoire sénonaise,
          documentés, géolocalisés, racontés.
        </p>
      </section>

      {/* ── Compteurs ── */}
      <section>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Éléments patrimoniaux", value: heritageCount, sub: "documentés", href: "/explorer" },
            { label: "Contributions", value: contributionCount, sub: "d'historiens et passionnés", href: "/explorer" },
            { label: "Blasons d'Hozier", value: annuaireData.entries.length, sub: "Élection de Sens, 1696", href: "/armorial" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="bg-white border-slate-200 shadow-sm text-center hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
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
            </Link>
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
                  {heritageCount} éléments géolocalisés
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
            href="/explorer"
            className="text-sm text-blue-800 hover:underline font-medium flex items-center gap-1"
          >
            Tout explorer <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {HIGHLIGHTS.map((item, i) => (
            <Link key={`${item.id}-${i}`} href={`/heritage/${item.id}`} className="block group">
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 mt-0.5">
                      <item.icon className="size-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-800 transition-colors">
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
            </Link>
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
            Avant que Paris ne devienne Paris, Sens était déjà capitale.
            Capitale des Sénons, peuple gaulois dont le nom a traversé
            vingt siècles. Centre d&apos;une vaste province religieuse dont
            l&apos;archevêque, le{" "}
            <strong>primat des Gaules</strong> (c&apos;est-à-dire le chef de
            l&apos;Église de France), avait autorité sur sept diocèses
            (territoires placés sous l&apos;autorité d&apos;un évêque)
            — Paris, Chartres, Meaux, Orléans, Auxerre, Nevers et Troyes.
          </p>
          <p>
            Sa cathédrale (1135) inaugure l&apos;architecture gothique.
            Un pape en exil y a résidé. Thomas Becket y a trouvé asile
            six années durant. {heritageCount}&nbsp;édifices y sont classés
            ou inscrits aux Monuments historiques.
          </p>
          <p>
            <strong>Patrimoine &amp; Sens</strong> réunit historiens,
            érudits locaux et habitants autour d&apos;une ambition commune :
            documenter, géolocaliser et raconter ce patrimoine — avec la rigueur
            des sources et le plaisir du récit.
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
