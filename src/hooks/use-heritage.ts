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

// ─── Types ────────────────────────────────────────────────────────────────────

interface AsyncState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface CreateContributionInput {
  type: ContributionType
  title?: string
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

// ─── useHeritage — détail d'un item via API ─────────────────────────────────

export function useHeritage(id: string): AsyncState<HeritageDetail> & { mutate: () => void } {
  const [state, setState] = React.useState<AsyncState<HeritageDetail>>({
    data: null,
    error: null,
    loading: true,
  })
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setState({ data: null, error: null, loading: true })

    fetch(`/api/heritage/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json()
      })
      .then((raw) => {
        if (cancelled) return
        // L'API retourne contributions avec contributionType/authorId,
        // on transforme vers le format UI (type/author)
        const contributions: Contribution[] = (raw.contributions ?? []).map(
          (c: Record<string, unknown>) => ({
            id: c.id,
            type: c.contributionType as ContributionType,
            title: (c.title as string | null) ?? null,
            body: c.body,
            author: { id: c.authorId as string, name: (c.authorId as string).slice(0, 8) },
            createdAt: c.createdAt as string,
            updatedAt: c.updatedAt as string,
            period: c.period ?? null,
            sources: c.sources ?? null,
            furtherReading: (c.furtherReading as string | null) ?? null,
          })
        )

        const detail: HeritageDetail = {
          id: raw.id,
          title: raw.title,
          category: raw.category,
          status: raw.status,
          latitude: raw.latitude,
          longitude: raw.longitude,
          coverPhotoUrl: raw.coverPhotoUrl,
          periodStart: raw.periodStart,
          periodEnd: raw.periodEnd,
          contributionCount: contributions.length,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
          contributions,
        }

        setState({ data: detail, error: null, loading: false })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            error: err instanceof Error ? err.message : "Erreur inconnue",
            loading: false,
          })
      })

    return () => { cancelled = true }
  }, [id, tick])

  const mutate = React.useCallback(() => setTick((t) => t + 1), [])

  return { ...state, mutate }
}

// ─── useHeritageList — liste via API ────────────────────────────────────────

export interface HeritageListFilters {
  q?: string
  category?: string
  periodStart?: number
  periodEnd?: number
}

export function useHeritageList(
  filters?: HeritageListFilters
): AsyncState<HeritageSummary[]> & { mutate: () => void } {
  const [state, setState] = React.useState<AsyncState<HeritageSummary[]>>({
    data: null,
    error: null,
    loading: true,
  })
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setState({ data: null, error: null, loading: true })

    const params = new URLSearchParams()
    if (filters?.q?.trim()) params.set("q", filters.q.trim())
    if (filters?.category) params.set("category", filters.category)
    if (filters?.periodStart != null) params.set("periodStart", String(filters.periodStart))
    if (filters?.periodEnd != null) params.set("periodEnd", String(filters.periodEnd))
    const qs = params.toString()

    fetch(`/api/heritage${qs ? `?${qs}` : ""}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<HeritageSummary[]>
      })
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            error: err instanceof Error ? err.message : "Erreur inconnue",
            loading: false,
          })
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.q, filters?.category, filters?.periodStart, filters?.periodEnd, tick])

  const mutate = React.useCallback(() => setTick((t) => t + 1), [])

  return { ...state, mutate }
}

// ─── useCreateContribution — POST /api/heritage/[id]/contributions ──────────

export function useCreateContribution(heritageId: string) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    async (input: CreateContributionInput): Promise<Contribution | null> => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/heritage/${heritageId}/contributions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contributionType: input.type,
            title: input.title,
            body: input.body,
            period: input.period,
            sources: input.sources,
          }),
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error((err as { error?: string }).error ?? `Erreur ${res.status}`)
        }

        const created = await res.json()
        return {
          id: created.id,
          type: created.contributionType,
          body: created.body,
          author: { id: created.authorId, name: "" },
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
          period: created.period,
          sources: created.sources,
        } as Contribution
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue"
        setError(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [heritageId]
  )

  return { loading, error, mutate }
}

// ─── useStats — GET /api/stats ──────────────────────────────────────────────

export interface SiteStats {
  heritageItems: number
  contributions: number
  reports: number
}

export function useStats(): AsyncState<SiteStats> {
  const [state, setState] = React.useState<AsyncState<SiteStats>>({
    data: null,
    error: null,
    loading: true,
  })

  React.useEffect(() => {
    let cancelled = false

    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<SiteStats>
      })
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            error: err instanceof Error ? err.message : "Erreur inconnue",
            loading: false,
          })
      })

    return () => { cancelled = true }
  }, [])

  return state
}

// ─── useCreateReport — POST /api/reports ────────────────────────────────────

export function useCreateReport() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(async (input: CreateReportInput): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, mutate }
}
