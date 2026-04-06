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
    id: "medieval",
    label: "Sens médiéval",
    shortLabel: "1200",
    period: "IVe–XVe s.",
    description: "Plan archéologique Bas-Empire + enceinte de l'Amande (Gallia 72-1, Nouvel et al. 2015)",
  },
  {
    id: "roman",
    label: "Agedincum",
    shortLabel: "Ier s.",
    period: "Ier s. av. J.-C. – IVe s.",
    description: "Restitution de la trame urbaine romaine (Gallia 72-1, fig. 4 — Nouvel, Delor-Ahü et al. 2015)",
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
