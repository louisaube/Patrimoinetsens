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
  /** Correspond à la colonne Drizzle contributionType. */
  type: ContributionType
  body: string
  period?: string
  sources?: string[]
}

export interface CreateReportInput {
  /** Doit correspondre au nom de colonne Drizzle : reportType. */
  reportType: ReportType
  description: string
  severity: ReportSeverity
  latitude?: number
  longitude?: number
  heritageItemId?: string
}

// ─── useHeritage ─────────────────────────────────────────────────────────────

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
        return res.json() as Promise<HeritageDetail>
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

    return () => {
      cancelled = true
    }
  }, [id, tick])

  const mutate = React.useCallback(() => setTick((t) => t + 1), [])

  return { ...state, mutate }
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
  const [state, setState] = React.useState<AsyncState<HeritageSummary[]>>({
    data: null,
    error: null,
    loading: true,
  })
  const [tick, setTick] = React.useState(0)

  const filtersKey = JSON.stringify(filters ?? {})

  React.useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const params = new URLSearchParams()
    if (filters?.category) params.set("category", filters.category)
    if (filters?.periodStart != null) params.set("periodStart", String(filters.periodStart))
    if (filters?.periodEnd != null) params.set("periodEnd", String(filters.periodEnd))

    const qs = params.toString()
    fetch(qs ? `/api/heritage?${qs}` : "/api/heritage")
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

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, filtersKey])

  const mutate = React.useCallback(() => setTick((t) => t + 1), [])

  return { ...state, mutate }
}

// ─── useCreateContribution ───────────────────────────────────────────────────

export function useCreateContribution(heritageId: string) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    async (input: CreateContributionInput): Promise<Contribution | null> => {
      setLoading(true)
      setError(null)

      try {
        // Renommage type → contributionType pour correspondre au schéma Drizzle
        const { type, ...rest } = input
        const res = await fetch(`/api/heritage/${heritageId}/contributions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rest, contributionType: type }),
        })

        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return (await res.json()) as Contribution
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue"
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [heritageId]
  )

  return { loading, error, mutate }
}

// ─── useCreateReport ─────────────────────────────────────────────────────────

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
      const message = err instanceof Error ? err.message : "Erreur inconnue"
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, mutate }
}
