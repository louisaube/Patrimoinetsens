import Link from "next/link"
import { AlertTriangle, Flame, Skull, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/reports/status-badge"
import { cn, formatDate, reportTypeLabel, severityColor } from "@/lib/utils"
import type { Report } from "@/types"

// Icônes par type de signalement
const TYPE_ICONS = {
  degradation: AlertTriangle,
  danger: Flame,
  disparition: Skull,
} as const

interface ReportCardProps {
  report: Report
  /** ID de l'utilisateur connecté — affiche actions si c'est le reporter. */
  currentUserId?: string | null
}

export function ReportCard({ report, currentUserId }: ReportCardProps) {
  const Icon = TYPE_ICONS[report.reportType] ?? AlertTriangle
  const isOwner = currentUserId === report.reporterId

  return (
    <Link href={`/reports/${report.id}`}>
      <Card className="bg-white border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icône type */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 mt-0.5">
              <Icon className="size-4 text-red-500" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Ligne badges */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-stone-800 group-hover:text-emerald-800 transition-colors">
                  {reportTypeLabel(report.reportType)}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-xs shrink-0", severityColor(report.severity))}
                >
                  {report.severity}
                </Badge>
                <StatusBadge status={report.status} />
                {isOwner && (
                  <Badge variant="outline" className="text-xs text-stone-500 shrink-0">
                    Mon signalement
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 line-clamp-2">
                {report.description}
              </p>

              {/* Pied de carte */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </span>
                <span>{formatDate(report.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
