"use client"

import * as React from "react"

export interface HistoricalEpoch {
  id: string
  label: string
  shortLabel: string
  period: string
  description: string
}

export const EPOCHS: HistoricalEpoch[] = [
  {
    id: "today",
    label: "Aujourd'hui",
    shortLabel: "2024",
    period: "XXIe s.",
    description: "Carte actuelle OpenStreetMap",
  },
  {
    id: "lalande",
    label: "Plan Lalande",
    shortLabel: "1880",
    period: "1880",
    description: "Plan de Sens & de ses faubourgs par A. Lalande — édifices publics, chemins de fer, faubourgs (Gallica/BnF)",
  },
  {
    id: "etatmajor",
    label: "État-major",
    shortLabel: "1850",
    period: "1820–1866",
    description: "Carte de l'état-major — levés topographiques du XIXe siècle (IGN)",
  },
  {
    id: "cassini",
    label: "Cassini",
    shortLabel: "1750",
    period: "1756–1815",
    description: "Carte de Cassini — première carte topographique du royaume de France (IGN/BnF)",
  },
  {
    id: "diocese",
    label: "Diocèse de Sens",
    shortLabel: "1741",
    period: "1741",
    description: "Carte topographique du diocèse de Sens par Outhier — 5 archidiaconés, 12 doyennés (Gallica/BnF)",
  },
  {
    id: "medieval",
    label: "Sens médiéval",
    shortLabel: "1200",
    period: "XIIe–XVe s.",
    description: "Enceinte de l'Amande, cathédrale, portes — tracés archéologiques + plan Bas-Empire (Gallia 72-1)",
  },
  {
    id: "lateantique",
    label: "Senones",
    shortLabel: "IVe s.",
    period: "IVe–Ve s.",
    description: "Antiquité tardive — enceinte fortifiée sur cadastre actuel (Gallia 78-1, Bourillon et al.)",
  },
  {
    id: "highempire",
    label: "Haut-Empire",
    shortLabel: "IIe s.",
    period: "Ier–IIIe s. ap. J.-C.",
    description: "Extension maximale ~160 ha — découvertes sur cadastre actuel (Gallia 78-1, Bourillon et al.)",
  },
  {
    id: "roman",
    label: "Agedincum",
    shortLabel: "Ier s.",
    period: "Ier s. av. J.-C. – Ier s. ap. J.-C.",
    description: "Restitution de la trame urbaine — cardo, decumanus, forum (Gallia 72-1, Nouvel, Delor-Ahü et al. 2015)",
  },
]

interface TimeSliderProps {
  value: string
  onChange: (epochId: string) => void
  opacity: number
  onOpacityChange: (opacity: number) => void
}

export function TimeSlider({ value, onChange, opacity, onOpacityChange }: TimeSliderProps) {
  const currentIndex = EPOCHS.findIndex((e) => e.id === value)
  const current = EPOCHS[currentIndex]

  return (
    <div className="absolute bottom-4 left-3 right-3 z-10">
      <div className="rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-stone-200 p-3">
        {/* Titre et description de l'époque */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="font-semibold text-sm text-stone-800">
              {current?.label}
            </span>
            <span className="text-xs text-stone-500 ml-2">
              {current?.period}
            </span>
          </div>
          {value !== "today" && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                Opacité
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={opacity}
                onChange={(e) => onOpacityChange(Number(e.target.value))}
                className="w-16 h-1 accent-blue-700"
              />
            </div>
          )}
        </div>

        <p className="text-[11px] text-stone-500 mb-2.5 leading-tight">
          {current?.description}
        </p>

        {/* Barre d'époques cliquables */}
        <div className="flex items-center gap-1">
          {EPOCHS.map((epoch, i) => (
            <button
              key={epoch.id}
              onClick={() => onChange(epoch.id)}
              className={`
                flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all
                ${epoch.id === value
                  ? "bg-blue-800 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }
              `}
              title={epoch.description}
            >
              {epoch.shortLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
