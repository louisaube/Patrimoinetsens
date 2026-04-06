import { Badge } from "@/components/ui/badge"
import { reportStatusLabel } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { ReportStatus } from "@/types"

// Couleurs par statut : progression visuelle du cycle de vie
const STATUS_CLASSES: Record<ReportStatus, string> = {
  soumis:   "bg-stone-100  text-stone-700  border-stone-200",
  en_cours: "bg-amber-100  text-amber-800  border-amber-200",
  resolu:   "bg-blue-100 text-blue-900 border-blue-200",
  rejete:   "bg-red-100    text-red-700    border-red-200",
}

interface StatusBadgeProps {
  status: ReportStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", STATUS_CLASSES[status], className)}
    >
      {reportStatusLabel(status)}
    </Badge>
  )
}
