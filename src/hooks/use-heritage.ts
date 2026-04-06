"use client"

import * as React from "react"
import type {
  HeritageDetail,
  HeritageSummary,
  Contribution,
  ContributionType,
  ReportType,
  ReportSeverity,
} from "@/types"
import heritageItemsData from "../../public/data/heritage-items.json"
import contributionsData from "../../public/data/contributions.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AsyncState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface CreateContributionInput {
  type: ContributionType
  body: string
  period?: string
  sources?: string[]
}

export interface CreateReportInput {
  reportType: ReportType
  description: string
  severity: ReportSeverity
  latitude?: number
  longitude?: number
  heritageItemId?: string
}

// ─── Data layer (JSON statique → Supabase quand prêt) ───────────────────────

type RawItem = (typeof heritageItemsData)[number]
type RawContrib = (typeof contributionsData)[number]

function toSummary(item: RawItem): HeritageSummary {
  return {
    id: item.id,
    title: item.title,
    category: item.category as HeritageSummary["category"],
    latitude: item.latitude,
    longitude: item.longitude,
    coverPhotoUrl: item.coverPhotoUrl,
    periodStart: item.periodStart,
    periodEnd: item.periodEnd,
    contributionCount: item.contributionCount,
  }
}

function toContribution(c: RawContrib): Contribution {
  return {
    id: c.id,
    type: c.type as ContributionType,
    body: c.body,
    author: { id: c.author.id, name: c.author.name },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    period: c.period,
    sources: c.sources,
  }
}

function toDetail(item: RawItem): HeritageDetail {
  const contribs = contributionsData
    .filter((c) => c.heritageItemId === item.id)
    .map(toContribution)

  return {
    ...toSummary(item),
    contributions: contribs,
  }
}

// ─── useHeritage ─────────────────────────────────────────────────────────────

export function useHeritage(id: string): AsyncState<HeritageDetail> & { mutate: () => void } {
  const item = heritageItemsData.find((i) => i.id === id)
  const data = item ? toDetail(item) : null

  return {
    data,
    error: item ? null : "Élément introuvable",
    loading: false,
    mutate: () => {},
  }
}

// ─── useHeritageList ─────────────────────────────────────────────────────────

export interface HeritageListFilters {
  category?: string
  periodStart?: number
  periodEnd?: number
}

export function useHeritageList(
  filters?: HeritageListFilters
): AsyncState<HeritageSummary[]> & { mutate: () => void } {
  const data = React.useMemo(() => {
    let items = heritageItemsData.filter((i) => i.status === "publie")

    if (filters?.category) {
      items = items.filter((i) => i.category === filters.category)
    }
    if (filters?.periodStart != null) {
      items = items.filter(
        (i) => i.periodEnd != null && i.periodEnd >= filters.periodStart!
      )
    }
    if (filters?.periodEnd != null) {
      items = items.filter(
        (i) => i.periodStart != null && i.periodStart <= filters.periodEnd!
      )
    }

    return items.map(toSummary)
  }, [filters?.category, filters?.periodStart, filters?.periodEnd])

  return {
    data,
    error: null,
    loading: false,
    mutate: () => {},
  }
}

// ─── useCreateContribution (stub — écriture désactivée sans backend) ────────

export function useCreateContribution(heritageId: string) {
  const [loading] = React.useState(false)
  const [error] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    async (_input: CreateContributionInput): Promise<Contribution | null> => {
      console.warn("[P&S] Écriture désactivée — backend non connecté")
      return null
    },
    []
  )

  return { loading, error, mutate }
}

// ─── useCreateReport (stub) ─────────────────────────────────────────────────

export function useCreateReport() {
  const [loading] = React.useState(false)
  const [error] = React.useState<string | null>(null)

  const mutate = React.useCallback(async (_input: CreateReportInput): Promise<boolean> => {
    console.warn("[P&S] Écriture désactivée — backend non connecté")
    return false
  }, [])

  return { loading, error, mutate }
}
