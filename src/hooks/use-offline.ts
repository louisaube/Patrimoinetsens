"use client"

// =============================================================================
// useOfflineSync — Patrimoine & Sens (V1.1)
// Intent : Détecte l'état réseau, expose le décompte de la queue hors-ligne,
//          et rejoue automatiquement les actions à la reconnexion.
//          Écoute aussi les messages du Service Worker (sync backgroundSync).
// =============================================================================

import * as React from "react"
import {
  getPendingActions,
  getPendingCount,
  removeAction,
  queueAction,
} from "@/lib/idb"
import type { PendingAction } from "@/lib/idb"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface OfflineSyncState {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
  lastSyncedAt: number | null
  syncError: string | null
}

export interface UseOfflineSyncReturn extends OfflineSyncState {
  /** Rejoue manuellement la queue (appelé aussi automatiquement à la reconnexion). */
  sync: () => Promise<void>
  /** Rafraîchit le décompte depuis IDB. */
  refreshCount: () => Promise<void>
  /** Ajoute une action à la queue. */
  queue: typeof queueAction
}

// -----------------------------------------------------------------------------
// Context partagé pour éviter plusieurs instances du hook
// -----------------------------------------------------------------------------

const OfflineSyncContext = React.createContext<UseOfflineSyncReturn | null>(null)

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const value = useOfflineSyncInternal()
  return React.createElement(OfflineSyncContext.Provider, { value }, children)
}

// -----------------------------------------------------------------------------
// Hook public — consomme le context
// -----------------------------------------------------------------------------

export function useOfflineSync(): UseOfflineSyncReturn {
  const ctx = React.useContext(OfflineSyncContext)
  if (!ctx) throw new Error('useOfflineSync doit être utilisé dans OfflineSyncProvider')
  return ctx
}

// -----------------------------------------------------------------------------
// Logique interne
// -----------------------------------------------------------------------------

function useOfflineSyncInternal(): UseOfflineSyncReturn {
  // Toujours initialiser à `true` (SSR-safe) — la valeur réelle est lue dans useEffect
  // pour éviter le hydration mismatch (navigator.onLine peut différer serveur/client)
  const [state, setState] = React.useState<OfflineSyncState>({
    isOnline: true,
    pendingCount: 0,
    isSyncing: false,
    lastSyncedAt: null,
    syncError: null,
  })

  const refreshCount = React.useCallback(async () => {
    const count = await getPendingCount()
    setState((prev) => ({ ...prev, pendingCount: count }))
  }, [])

  const sync = React.useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.onLine) return

    setState((prev) => ({ ...prev, isSyncing: true, syncError: null }))

    try {
      const actions = await getPendingActions()
      let hadNetworkError = false

      for (const action of actions) {
        if (hadNetworkError) break // Stop si réseau toujours instable

        try {
          const res = await fetch(action.url, {
            method: action.method,
            headers: action.body
              ? { 'Content-Type': 'application/json' }
              : undefined,
            body: action.body ?? undefined,
          })

          if (res.ok) {
            await removeAction(action.id)
            continue
          }

          // Erreurs permanentes → retirer de la queue sans relancer
          if (res.status === 401 || res.status === 403 || res.status === 404 || res.status === 422) {
            await removeAction(action.id)
            continue
          }

          // 5xx → laisser en queue, arrêter la boucle
          hadNetworkError = true
        } catch {
          // Réseau encore indisponible
          hadNetworkError = true
        }
      }

      setState((prev) => ({
        ...prev,
        lastSyncedAt: Date.now(),
        syncError: hadNetworkError ? 'Certaines actions n\'ont pas pu être synchronisées.' : null,
      }))
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        syncError: err instanceof Error ? err.message : 'Erreur de synchronisation',
      }))
    } finally {
      setState((prev) => ({ ...prev, isSyncing: false }))
      await refreshCount()
    }
  }, [refreshCount])

  // Listeners online/offline + message SW
  React.useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }))
      void sync()
    }
    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }))
    }

    // Message du Service Worker (Background Sync)
    const handleSWMessage = (event: MessageEvent) => {
      if ((event.data as { type?: string })?.type === 'SYNC_REQUESTED') {
        void sync()
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    navigator.serviceWorker?.addEventListener('message', handleSWMessage)

    // Sync valeur réelle au montage (peut différer de l'initialisation SSR)
    setState((prev) => ({ ...prev, isOnline: navigator.onLine }))

    // Décompte initial
    void refreshCount()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage)
    }
  }, [sync, refreshCount])

  return { ...state, sync, refreshCount, queue: queueAction }
}
