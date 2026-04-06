"use client"

import * as React from "react"
import Link from "next/link"
import { use } from "react"
import {
  ArrowLeft,
  AlertTriangle,
  Flame,
  Skull,
  MapPin,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/reports/status-badge"
import { useReport, useUpdateReport } from "@/hooks/use-reports"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/toast"
import { cn, formatDate, reportTypeLabel, severityColor } from "@/lib/utils"
import type { ReportStatus } from "@/types"

// ─── Constantes ───────────────────────────────────────────────────────────────

const TYPE_ICONS = {
  degradation: AlertTriangle,
  danger: Flame,
  disparition: Skull,
} as const

/**
 * Transitions autorisées pour le reporter.
 * Seules les progressions vers l'avant — pas de "rejete" accessible au reporter.
 */
const NEXT_STATUS: Partial<Record<ReportStatus, ReportStatus>> = {
  soumis: "en_cours",
  en_cours: "resolu",
}

const TRANSITION_LABELS: Partial<Record<ReportStatus, string>> = {
  en_cours: "Marquer en cours",
  resolu: "Marquer comme résolu",
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user } = useAuth()
  const { toast } = useToast()

  const { data: report, loading, error, mutate } = useReport(id)
  const { loading: updating, mutate: updateReport } = useUpdateReport(id)

  const isOwner = user?.id != null && user.id === report?.reporterId
  const nextStatus = report ? NEXT_STATUS[report.status] : undefined

  const handleTransition = async () => {
    if (!nextStatus) return
    const updated = await updateReport({ status: nextStatus })
    if (updated) {
      toast({
        title: "Statut mis à jour",
        description: `Signalement passé à « ${nextStatus.replace("_", " ")} ».`,
        variant: "success",
      })
      mutate()
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      })
    }
  }

  // ─── États de chargement / erreur ─────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-stone-400" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <p className="text-stone-500">Signalement introuvable.</p>
        <Link href="/reports" className="mt-4 inline-block text-sm text-blue-800 hover:underline">
          ← Retour aux signalements
        </Link>
      </div>
    )
  }

  const Icon = TYPE_ICONS[report.reportType] ?? AlertTriangle

  // ─── Rendu ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-xl px-4 py-6 space-y-6">
      {/* Retour */}
      <Link
        href="/reports"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"
        aria-label="Retour à la liste des signalements"
      >
        <ArrowLeft className="size-4" />
        Signalements
      </Link>

      {/* En-tête du signalement */}
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <Icon className="size-6 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-xl font-bold text-stone-800">
            {reportTypeLabel(report.reportType)}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", severityColor(report.severity))}
            >
              {report.severity}
            </Badge>
            <StatusBadge status={report.status} />
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="border-stone-100 bg-white shadow-sm">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-stone-700">Description</p>
          <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </CardContent>
      </Card>

      {/* Métadonnées */}
      <div className="space-y-2 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-stone-400" />
          <span>
            {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-stone-400" />
          <span>Signalé le {formatDate(report.createdAt)}</span>
        </div>
        {report.updatedAt !== report.createdAt && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-stone-400" />
            <span>Mis à jour le {formatDate(report.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Lien élément patrimonial */}
      {report.heritageItemId && (
        <div>
          <p className="text-xs text-stone-400 mb-1">Élément concerné</p>
          <Link
            href={`/heritage/${report.heritageItemId}`}
            className="text-sm text-blue-800 hover:underline font-medium"
          >
            Voir la fiche patrimoniale →
          </Link>
        </div>
      )}

      <Separator />

      {/* Cycle de vie — visible seulement au reporter */}
      {isOwner && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-700">Avancement</p>

          {/* Visualisation du cycle */}
          <div className="flex items-center gap-2 text-xs">
            {(["soumis", "en_cours", "resolu"] as ReportStatus[]).map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && (
                  <div
                    className={cn(
                      "h-px flex-1 transition-colors",
                      ["en_cours", "resolu"].includes(report.status) && i === 1
                        ? "bg-amber-300"
                        : report.status === "resolu" && i === 2
                        ? "bg-blue-300"
                        : "bg-stone-200"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full font-medium transition-colors",
                    report.status === step
                      ? "bg-blue-100 text-blue-900"
                      : ["en_cours", "resolu"].includes(report.status) &&
                        step === "soumis"
                      ? "text-stone-400 line-through"
                      : "text-stone-400"
                  )}
                >
                  {step.replace("_", " ")}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Bouton de transition */}
          {nextStatus && (
            <Button
              onClick={() => void handleTransition()}
              disabled={updating}
              variant="outline"
              className="gap-2 border-stone-200"
            >
              {updating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4 text-blue-700" />
              )}
              {TRANSITION_LABELS[nextStatus]}
            </Button>
          )}

          {report.status === "resolu" && (
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Ce signalement est marqué comme résolu. Merci !
            </p>
          )}
        </div>
      )}
    </div>
  )
}
