"use client"

import * as React from "react"
import { X } from "lucide-react"
import { HeritageMap } from "@/components/map/heritage-map"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { categoryLabel, PERIOD_FILTERS } from "@/lib/utils"
import { useHeritageList } from "@/hooks/use-heritage"
import type { MapMarker, HeritageCategory } from "@/types"

const CATEGORY_COLORS: Record<HeritageCategory, string> = {
  batiment_historique: "bg-amber-100 text-amber-800",
  edifice_religieux: "bg-blue-100 text-blue-800",
  mobilier_urbain: "bg-blue-100 text-blue-800",
  patrimoine_naturel: "bg-green-100 text-green-800",
  autre: "bg-stone-100 text-stone-800",
}

const LEGEND_ITEMS: HeritageCategory[] = [
  "batiment_historique",
  "edifice_religieux",
  "mobilier_urbain",
  "patrimoine_naturel",
]

const ALL_CATEGORIES: Array<{ value: HeritageCategory; label: string }> = [
  { value: "batiment_historique", label: categoryLabel("batiment_historique") },
  { value: "edifice_religieux", label: categoryLabel("edifice_religieux") },
  { value: "mobilier_urbain", label: categoryLabel("mobilier_urbain") },
  { value: "patrimoine_naturel", label: categoryLabel("patrimoine_naturel") },
  { value: "autre", label: categoryLabel("autre") },
]

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = React.useState<MapMarker | null>(null)
  const [categoryFilter, setCategoryFilter] = React.useState<string>("")
  const [periodLabel, setPeriodLabel] = React.useState<string>("")

  const selectedPeriod = PERIOD_FILTERS.find((p) => p.label === periodLabel) ?? null

  const { data: heritageData, loading } = useHeritageList({
    category: categoryFilter || undefined,
    periodStart: selectedPeriod?.start ?? undefined,
    periodEnd: selectedPeriod?.end ?? undefined,
  })

  const markers: MapMarker[] = React.useMemo(
    () =>
      (heritageData ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        latitude: item.latitude,
        longitude: item.longitude,
      })),
    [heritageData]
  )

  const hasFilters = Boolean(categoryFilter || periodLabel)

  const clearFilters = () => {
    setCategoryFilter("")
    setPeriodLabel("")
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Carte plein écran */}
      <HeritageMap
        markers={markers}
        center={[3.2837, 48.1977]}
        zoom={14}
        onMarkerClick={setSelectedMarker}
        className="h-full w-full"
        enableTimeLayers
      />

      {/* Panneau de filtres — top right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 w-52">
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/95 backdrop-blur-sm border-stone-200 shadow-md text-xs h-8 py-0"
        >
          <option value="">Toutes catégories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>

        <Select
          value={periodLabel}
          onChange={(e) => setPeriodLabel(e.target.value)}
          className="bg-white/95 backdrop-blur-sm border-stone-200 shadow-md text-xs h-8 py-0"
        >
          <option value="">Toutes périodes</option>
          {PERIOD_FILTERS.map((p) => (
            <option key={p.label} value={p.label}>
              {p.label}
            </option>
          ))}
        </Select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 self-end text-xs text-stone-500 hover:text-stone-800 bg-white/90 rounded-md px-2 py-1 shadow-sm border border-stone-200"
          >
            <X className="size-3" />
            Effacer filtres
          </button>
        )}
      </div>

      {/* Légende */}
      <div className="absolute bottom-24 left-3 z-10 rounded-xl bg-white/95 backdrop-blur-sm border border-stone-200 p-3 shadow-md md:bottom-4">
        <p className="text-xs font-semibold text-stone-600 mb-2">Catégories</p>
        <div className="space-y-1.5">
          {LEGEND_ITEMS.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="size-3 rounded-full border border-white shadow-sm shrink-0"
                style={{
                  backgroundColor:
                    cat === "batiment_historique"
                      ? "#92400e"
                      : cat === "edifice_religieux"
                      ? "#1e40af"
                      : cat === "mobilier_urbain"
                      ? "#1e3a5f"
                      : "#14532d",
                }}
              />
              <span className="text-xs text-stone-600">{categoryLabel(cat)}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone-400 border-t border-stone-100 pt-2">
          {loading ? "…" : markers.length} élément{markers.length !== 1 ? "s" : ""}
          {hasFilters ? " (filtré)" : ""}
        </p>
      </div>

      {/* Panneau info marqueur sélectionné (mobile) */}
      {selectedMarker && (
        <div className="absolute bottom-20 left-0 right-0 z-10 px-3 md:hidden">
          <div className="rounded-xl bg-white border border-stone-200 shadow-lg p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-stone-800 truncate">
                {selectedMarker.title}
              </p>
              <Badge
                className={`text-xs mt-1 ${CATEGORY_COLORS[selectedMarker.category] ?? ""}`}
                variant="outline"
              >
                {categoryLabel(selectedMarker.category)}
              </Badge>
            </div>
            <a
              href={`/heritage/${selectedMarker.id}`}
              className="shrink-0 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 transition-colors"
            >
              Voir
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
