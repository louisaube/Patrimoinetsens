import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { HeritageCategory, ContributionType, ReportSeverity, ReportStatus } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function categoryLabel(category: HeritageCategory | string): string {
  const labels: Record<string, string> = {
    batiment_historique: "Bâtiment historique",
    edifice_religieux: "Édifice religieux",
    mobilier_urbain: "Mobilier urbain",
    patrimoine_naturel: "Patrimoine naturel",
    autre: "Autre",
  }
  return labels[category] ?? category
}

export function contributionTypeLabel(type: ContributionType | string): string {
  const labels: Record<string, string> = {
    historique: "Historique",
    recit: "Récit",
    temoignage: "Témoignage",
    observation: "Observation",
  }
  return labels[type] ?? type
}

export function severityColor(severity: ReportSeverity | string): string {
  const colors: Record<string, string> = {
    faible: "bg-emerald-100 text-emerald-800 border-emerald-200",
    moyen: "bg-amber-100 text-amber-800 border-amber-200",
    urgent: "bg-orange-100 text-orange-800 border-orange-200",
    critique: "bg-red-100 text-red-800 border-red-200",
  }
  return colors[severity] ?? "bg-gray-100 text-gray-800 border-gray-200"
}

export function reportTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    degradation: "Dégradation",
    danger: "Danger",
    disparition: "Disparition",
  }
  return labels[type] ?? type
}

export function reportStatusLabel(status: ReportStatus | string): string {
  const labels: Record<string, string> = {
    soumis: "Soumis",
    en_cours: "En cours",
    resolu: "Résolu",
    rejete: "Rejeté",
  }
  return labels[status] ?? status
}

export function categoryColor(category: HeritageCategory | string): string {
  const colors: Record<string, string> = {
    batiment_historique: "#92400e",
    edifice_religieux: "#1e40af",
    mobilier_urbain: "#065f46",
    patrimoine_naturel: "#14532d",
    autre: "#78716c",
  }
  return colors[category] ?? "#78716c"
}

// ─── Utilitaires période historique ──────────────────────────────────────────

/**
 * Siècles prédéfinis pour le filtre UI.
 * Chaque entrée = plage d'années [start, end] (fin exclusive).
 * Couvre l'essentiel du patrimoine français medieval → contemporain.
 */
export const PERIOD_FILTERS = [
  { label: "Antiquité (av. J.-C.–Ve s.)",   start: -500,  end:  500  },
  { label: "Haut Moyen Âge (Ve–Xe s.)",     start:  500,  end: 1000  },
  { label: "Moyen Âge central (XIe–XIIIe)", start: 1000,  end: 1300  },
  { label: "Bas Moyen Âge (XIVe–XVe s.)",   start: 1300,  end: 1500  },
  { label: "Renaissance (XVIe s.)",          start: 1500,  end: 1600  },
  { label: "XVIIe siècle",                   start: 1600,  end: 1700  },
  { label: "XVIIIe siècle",                  start: 1700,  end: 1800  },
  { label: "XIXe siècle",                    start: 1800,  end: 1900  },
  { label: "XXe siècle",                     start: 1900,  end: 2000  },
  { label: "XXIe siècle",                    start: 2000,  end: 2100  },
] as const

export type PeriodFilterKey = typeof PERIOD_FILTERS[number]['label']

/** Formate une plage d'années en label lisible (ex: 1134 → "XIIe siècle"). */
export function formatPeriod(start?: number | null, end?: number | null): string {
  if (!start && !end) return ""
  if (start && end) return `${start} – ${end}`
  if (start) return `À partir de ${start}`
  return `Jusqu'en ${end}`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
