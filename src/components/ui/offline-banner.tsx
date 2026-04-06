"use client"

import { WifiOff, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { useOfflineSync } from "@/hooks/use-offline"
import { cn } from "@/lib/utils"

// =============================================================================
// OfflineBanner
// Intent : Bandeau contextuel en haut de l'écran indiquant l'état réseau.
//          Invisible quand tout va bien (online + 0 pending).
//          Utilisé par Marie sur le terrain pour savoir ce qui est en attente.
// =============================================================================

export function OfflineBanner() {
  const { isOnline, pendingCount, isSyncing, syncError } = useOfflineSync()

  // Cas nominal — rien à afficher
  if (isOnline && pendingCount === 0 && !syncError) return null

  const bgClass = !isOnline
    ? "bg-stone-800"
    : syncError
    ? "bg-amber-600"
    : isSyncing
    ? "bg-blue-800"
    : "bg-blue-700"

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white transition-colors duration-300",
        bgClass
      )}
      role="status"
      aria-live="polite"
    >
      {/* Hors-ligne */}
      {!isOnline && (
        <>
          <WifiOff className="size-3.5 shrink-0" />
          <span>
            Mode hors-ligne
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5">
                {pendingCount} action{pendingCount > 1 ? "s" : ""} en attente
              </span>
            )}
          </span>
        </>
      )}

      {/* En ligne — synchronisation */}
      {isOnline && isSyncing && (
        <>
          <RefreshCw className="size-3.5 shrink-0 animate-spin" />
          <span>Synchronisation en cours…</span>
        </>
      )}

      {/* En ligne — actions encore en attente (sync partielle) */}
      {isOnline && !isSyncing && pendingCount > 0 && !syncError && (
        <>
          <RefreshCw className="size-3.5 shrink-0" />
          <span>
            {pendingCount} action{pendingCount > 1 ? "s" : ""} à synchroniser
          </span>
        </>
      )}

      {/* Erreur de sync */}
      {isOnline && syncError && (
        <>
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{syncError}</span>
        </>
      )}
    </div>
  )
}
