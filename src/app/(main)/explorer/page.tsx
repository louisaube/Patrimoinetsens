"use client"

import * as React from "react"
import Link from "next/link"
import { Search, MapPin, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { useHeritageList } from "@/hooks/use-heritage"
import { categoryLabel, categoryColor, formatPeriod, PERIOD_FILTERS } from "@/lib/utils"
import type { HeritageCategory, HeritageSummary } from "@/types"

const ALL_CATEGORIES: Array<{ value: HeritageCategory; label: string }> = [
  { value: "batiment_historique", label: categoryLabel("batiment_historique") },
  { value: "edifice_religieux", label: categoryLabel("edifice_religieux") },
  { value: "mobilier_urbain", label: categoryLabel("mobilier_urbain") },
  { value: "patrimoine_naturel", label: categoryLabel("patrimoine_naturel") },
  { value: "autre", label: categoryLabel("autre") },
]

type SortKey = "title" | "date" | "contributions"

export default function ExplorerPage() {
  const [query, setQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("")
  const [periodLabel, setPeriodLabel] = React.useState("")
  const [sort, setSort] = React.useState<SortKey>("contributions")

  // Debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const selectedPeriod = PERIOD_FILTERS.find((p) => p.label === periodLabel) ?? null

  const { data, loading } = useHeritageList({
    q: debouncedQuery || undefined,
    category: categoryFilter || undefined,
    periodStart: selectedPeriod?.start ?? undefined,
    periodEnd: selectedPeriod?.end ?? undefined,
  })

  const sorted = React.useMemo(() => {
    if (!data) return []
    const items = [...data]
    switch (sort) {
      case "title":
        return items.sort((a, b) => a.title.localeCompare(b.title, "fr"))
      case "date":
        return items.sort((a, b) => (a.periodStart ?? 9999) - (b.periodStart ?? 9999))
      case "contributions":
        return items.sort((a, b) => b.contributionCount - a.contributionCount)
      default:
        return items
    }
  }, [data, sort])

  const hasFilters = Boolean(debouncedQuery || categoryFilter || periodLabel)

  const clearAll = () => {
    setQuery("")
    setDebouncedQuery("")
    setCategoryFilter("")
    setPeriodLabel("")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-800 md:text-3xl">
          Explorer le patrimoine
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading
            ? "Chargement..."
            : `${sorted.length} element${sorted.length !== 1 ? "s" : ""} patrimoniaux${hasFilters ? " (filtre actif)" : ""}`}
        </p>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="sticky top-0 z-10 -mx-4 bg-slate-50/95 backdrop-blur-sm px-4 pb-4 pt-2 border-b border-slate-200 mb-6 space-y-3">
        {/* Recherche texte */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher... (cathedrale, remparts, tanneries...)"
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setDebouncedQuery("") }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border-slate-200 text-xs h-8 py-0 flex-1 min-w-[140px]"
          >
            <option value="">Toutes categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>

          <Select
            value={periodLabel}
            onChange={(e) => setPeriodLabel(e.target.value)}
            className="bg-white border-slate-200 text-xs h-8 py-0 flex-1 min-w-[140px]"
          >
            <option value="">Toutes periodes</option>
            {PERIOD_FILTERS.map((p) => (
              <option key={p.label} value={p.label}>{p.label}</option>
            ))}
          </Select>

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-white border-slate-200 text-xs h-8 py-0 w-[140px]"
          >
            <option value="contributions">+ contribues</option>
            <option value="title">Alphabetique</option>
            <option value="date">Chronologique</option>
          </Select>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-white rounded-md px-2 py-1 border border-slate-200"
            >
              <X className="size-3" />
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Resultats */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white border border-slate-200 p-4 h-24" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <Search className="mx-auto size-10 text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">
            {hasFilters
              ? "Aucun resultat pour ces criteres."
              : "Aucun element patrimonial."}
          </p>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="mt-2 text-xs text-blue-700 hover:underline"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => (
            <HeritageCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function HeritageCard({ item }: { item: HeritageSummary }) {
  return (
    <Link
      href={`/heritage/${item.id}`}
      className="group block rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all p-4"
    >
      <div className="flex items-start gap-4">
        {/* Color dot */}
        <div
          className="mt-1 size-3 shrink-0 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: categoryColor(item.category) }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800 group-hover:text-blue-800 transition-colors leading-tight">
            {item.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {categoryLabel(item.category)}
            </Badge>

            {(item.periodStart || item.periodEnd) && (
              <span className="text-[10px] text-slate-400">
                {formatPeriod(item.periodStart, item.periodEnd)}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
            </span>
            <span>
              {item.contributionCount} contribution{item.contributionCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
