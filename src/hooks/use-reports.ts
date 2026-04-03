"use client"

// =============================================================================
// Hooks signalements — Patrimoine & Sens
// Intent : Encapsule tous les accès à /api/reports.
//          useReportsList — lecture avec filtres optionnels
//          useReport      — lecture d'un seul signalement
//          useCreateReport — création (auth requise)
//          useUpdateReport — mise à jour statut (reporter only)
// =============================================================================

import * as React from "react"
import type { Report, ReportStatus, ReportSeverity } from "@/types"

// -----------------------------------------------------------------------------
// Types internes
// -----------------------------------------------------------------------------

interface AsyncState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface ReportsFilters {
  status?: ReportStatus
  severity?: ReportSeverity
}

export interface CreateReportInput {
  /** Correspond à la colonne Drizzle reportType. */
  reportType: import("@/types").ReportType
  description: string
  severity: ReportSeverity
  latitude: number
  longitude: number
  heritageItemId?: string
}

export interface UpdateReportInput {
  status?: ReportStatus
  description?: string
}

// -----------------------------------------------------------------------------
// useReportsList
// -----------------------------------------------------------------------------

export function useReportsList(
  filters?: ReportsFilters
): AsyncState<Report[]> & { mutate: () => void } {
  const [state, setState] = React.useState<AsyncState<Report[]>>({
    data: null,
    error: null,
    loading: true,
  })
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setState({ data: null, error: null, loading: true })

    const params = new URLSearchParams()
    if (filters?.status) params.set("status", filters.status)
    if (filters?.severity) params.set("severity", filters.severity)
    const qs = params.toString()

    fetch(`/api/reports${qs ? `?${qs}` : ""}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<Report[]>
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
  }, [filters?.status, filters?.severity, tick])

  const mutate = React.useCallback(() => setTick((t) => t + 1), [])

  return { ...state, mutate }
}

// -----------------------------------------------------------------------------
// useReport — lecture d'un signalement par id
// -----------------------------------------------------------------------------

export function useReport(id: string): AsyncState<Report> & { mutate: () => void } {
  const [state, setState] = React.useState<AsyncState<Report>>({
    data: null,
    error: null,
    loading: true,
  })
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setState({ data: null, error: null, loading: true })

    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<Report>
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

// -----------------------------------------------------------------------------
// useCreateReport
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// useUpdateReport — mise à jour d'un signalement (reporter only)
// -----------------------------------------------------------------------------

export function useUpdateReport(id: string) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    async (input: UpdateReportInput): Promise<Report | null> => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/reports/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })

        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return (await res.json()) as Report
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
        return null
      } finally {
        setLoading(false)
      }
    },
    [id]
  )

  return { loading, error, mutate }
}
