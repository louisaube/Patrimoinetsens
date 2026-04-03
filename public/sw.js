// =============================================================================
// Service Worker — Patrimoine & Sens (V1.1)
// Intent : Cache statique shell + cache réseau pour les GET API.
//          Permet à Marie de consulter les fiches sur le terrain sans réseau.
//          Les mutations offline (POST/PATCH) sont gérées côté app (IDB queue).
// =============================================================================

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `patrimoine-static-${CACHE_VERSION}`
const API_CACHE    = `patrimoine-api-${CACHE_VERSION}`

// Assets à précacher lors de l'installation
const STATIC_PRECACHE = [
  '/',
  '/map',
  '/reports',
  '/offline',
]

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) =>
        // addAll échoue silencieusement si certains assets ne sont pas disponibles
        cache.addAll(STATIC_PRECACHE).catch(() => {})
      )
      .then(() => self.skipWaiting())
  )
})

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ─── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ne pas intercepter : requêtes externes, non-HTTP, extensions Chrome
  if (!url.origin.startsWith('http') || url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/_next/')) return

  // ── API GET : network-first, fallback cache ─────────────────────────────
  if (url.pathname.startsWith('/api/') && request.method === 'GET') {
    event.respondWith(networkFirstWithCache(request, API_CACHE))
    return
  }

  // ── API mutations : laisser passer (queue gérée par l'app) ─────────────
  if (url.pathname.startsWith('/api/')) return

  // ── Navigation : network-first, fallback page offline ──────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/offline').then((cached) =>
          cached ?? new Response('Hors-ligne', { status: 503 })
        )
      )
    )
    return
  }

  // ── Assets statiques : stale-while-revalidate ──────────────────────────
  if (request.method === 'GET') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
  }
})

// ─── Stratégies de cache ──────────────────────────────────────────────────────

async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response(
      JSON.stringify({ error: 'Données indisponibles hors-ligne', offline: true }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json', 'X-Offline': '1' },
      }
    )
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)

  return cached ?? (await fetchPromise) ?? new Response('', { status: 503 })
}

// ─── Background Sync (rejouer la queue quand réseau revient) ─────────────────

self.addEventListener('sync', (event) => {
  if (event.tag === 'patrimoine-sync') {
    // Signal aux clients que la sync peut commencer
    event.waitUntil(
      self.clients.matchAll().then((clients) =>
        clients.forEach((client) =>
          client.postMessage({ type: 'SYNC_REQUESTED' })
        )
      )
    )
  }
})
