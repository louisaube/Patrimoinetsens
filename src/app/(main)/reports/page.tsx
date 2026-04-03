"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ReportCard } from "@/components/reports/report-card"
import { useReportsList } from "@/hooks/use-reports"
import { useAuth } from "@/hooks/use-auth"
import type { ReportStatus, ReportSeverity } from "@/types"

// ─── Labels filtres ───────────────────────────────────────────────────────────

const STATUS_OPTIONS: Array<{ value: ReportStatus | ""; label: string }> = [
  { value: "", label: "Tous les statuts" },
  { value: "soumis", label: "Soumis" },
  { value: "en_cours", label: "En cours" },
  { value: "resolu", label: "Résolu" },
  { value: "rejete", label: "Rejeté" },
]

const SEVERITY_OPTIONS: Array<{ value: ReportSeverity | ""; label: string }> = [
  { value: "", label: "Toutes les sévérités" },
  { value: "critique", label: "Critique" },
  { value: "urgent", label: "Urgent" },
  { value: "moyen", label: "Moyen" },
  { value: "faible", label: "Faible" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = React.useState<ReportStatus | "">("")
  const [severityFilter, setSeverityFilter] = React.useState<ReportSeverity | "">("")

  const { data: reports, loading, error } = useReportsList({
    status: statusFilter || undefined,
    severity: severityFilter || undefined,
  })

  const hasFilters = statusFilter !== "" || severityFilter !== ""

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle className="size-5 text-red-600" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-stone-800">Signalements</h1>
            <p className="text-sm text-stone-500">
              {loading
                ? "Chargement…"
                : `${reports?.length ?? 0} signalement${(reports?.length ?? 0) !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <Link href="/report">
          <Button size="sm" className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Signaler</span>
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="size-4 text-stone-400 shrink-0" />
        <Select
          id="filter-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "")}
          className="h-8 text-xs w-auto flex-shrink-0"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Select
          id="filter-severity"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as ReportSeverity | "")}
          className="h-8 text-xs w-auto flex-shrink-0"
        >
          {SEVERITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        {hasFilters && (
          <button
            onClick={() => {
              setStatusFilter("")
              setSeverityFilter("")
            }}
            className="text-xs text-stone-400 hover:text-stone-600 underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Liste */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-stone-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger les signalements. Réessayez.
        </div>
      )}

      {!loading && !error && reports?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-stone-100">
            <AlertTriangle className="size-7 text-stone-300" />
          </div>
          <div>
            <p className="font-medium text-stone-600">Aucun signalement</p>
            <p className="mt-1 text-sm text-stone-400">
              {hasFilters
                ? "Modifiez les filtres pour voir plus de résultats."
                : "Soyez le premier à signaler un problème."}
            </p>
          </div>
          {!hasFilters && (
            <Link href="/report">
              <Button size="sm" variant="outline">
                Faire un signalement
              </Button>
            </Link>
          )}
        </div>
      )}

      {!loading && !error && reports && reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
