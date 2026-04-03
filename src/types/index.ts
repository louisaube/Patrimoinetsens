// Types UI de l'application Patrimoine & Sens
// Alignés sur les enums SQL (migration 001) et database.ts

export type HeritageCategory =
  | "batiment_historique"
  | "edifice_religieux"
  | "mobilier_urbain"
  | "patrimoine_naturel"
  | "autre"

export type ContributionType =
  | "historique"
  | "recit"
  | "temoignage"
  | "observation"

export type ReportSeverity = "faible" | "moyen" | "urgent" | "critique"

export type ReportType = "degradation" | "danger" | "disparition"

export type ReportStatus = "soumis" | "en_cours" | "resolu" | "rejete"

export interface HeritageSummary {
  id: string
  title: string
  category: HeritageCategory
  status?: string
  latitude: number
  longitude: number
  coverPhotoUrl?: string | null
  periodStart?: number | null
  periodEnd?: number | null
  contributionCount: number
  createdAt?: string
  updatedAt?: string
}

export interface ContributionAuthor {
  id: string
  name: string
  avatarUrl?: string
}

export interface Contribution {
  id: string
  type: ContributionType
  body: string
  author: ContributionAuthor
  createdAt: string
  updatedAt: string
  // Champs spécifiques historique
  period?: string | null
  sources?: string[] | null
}

export interface HeritageDetail extends HeritageSummary {
  contributions: Contribution[]
}

export interface MapMarker {
  id: string
  title: string
  category: HeritageCategory
  latitude: number
  longitude: number
}

export interface Report {
  id: string
  /** Nom de colonne Drizzle : reportType (pas type). */
  reportType: ReportType
  reporterId: string
  description: string
  severity: ReportSeverity
  status: ReportStatus
  latitude: number
  longitude: number
  heritageItemId?: string | null
  photos?: string[] | null
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatarUrl?: string
}

export interface AuthState {
  user: UserProfile | null
  loading: boolean
}
