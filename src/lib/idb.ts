// =============================================================================
// IndexedDB — Patrimoine & Sens (V1.1)
// Intent : Journal persistant des actions effectuées hors-ligne.
//          À la reconnexion, useOfflineSync rejoue les actions dans l'ordre.
//          Pas de lib externe — IDB natif suffit pour ce volume.
// =============================================================================

const DB_NAME = 'patrimoine-sens-offline'
const DB_VERSION = 1
const QUEUE_STORE = 'pending_queue'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type EntityType = 'heritage' | 'contribution' | 'report'

export interface PendingAction {
  id: string
  timestamp: number
  method: 'POST' | 'PATCH' | 'DELETE'
  url: string
  /** Corps JSON stringifié, null pour DELETE. */
  body: string | null
  entityType: EntityType
  /** Description lisible pour l'UI : "Contribution sur Cathédrale…" */
  label: string
}

// -----------------------------------------------------------------------------
// Ouverture de la DB
// -----------------------------------------------------------------------------

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB non disponible (environnement serveur)'))
  }

  if (dbPromise) return dbPromise

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        const store = db.createObjectStore(QUEUE_STORE, { keyPath: 'id' })
        // Index sur timestamp pour rejouer dans l'ordre chronologique
        store.createIndex('by_timestamp', 'timestamp', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      dbPromise = null
      reject(request.error)
    }
  })

  return dbPromise
}

// -----------------------------------------------------------------------------
// API publique
// -----------------------------------------------------------------------------

/** Ajoute une action à la queue hors-ligne. */
export async function queueAction(
  action: Omit<PendingAction, 'id' | 'timestamp'>
): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    tx.objectStore(QUEUE_STORE).add({
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    } satisfies PendingAction)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** Retourne toutes les actions en attente, triées par timestamp croissant. */
export async function getPendingActions(): Promise<PendingAction[]> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readonly')
    const request = tx.objectStore(QUEUE_STORE)
      .index('by_timestamp')
      .getAll()

    request.onsuccess = () => resolve(request.result as PendingAction[])
    request.onerror = () => reject(request.error)
  })
}

/** Supprime une action de la queue (succès ou erreur permanente). */
export async function removeAction(id: string): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    tx.objectStore(QUEUE_STORE).delete(id)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** Nombre d'actions en attente (pour le badge UI). */
export async function getPendingCount(): Promise<number> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(QUEUE_STORE, 'readonly')
      const request = tx.objectStore(QUEUE_STORE).count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch {
    return 0 // SSR ou IDB indisponible
  }
}

/** Vide toute la queue (reset debug). */
export async function clearQueue(): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    tx.objectStore(QUEUE_STORE).clear()

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
