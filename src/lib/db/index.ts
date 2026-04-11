// =============================================================================
// Client Drizzle ORM — Patrimoine & Sens
// Intent : Connexion à PostgreSQL classique via postgres-js (postgresjs).
//          Requiert DATABASE_URL dans .env.local.
//          En dev local sans DATABASE_URL, exporte null — les hooks utilisent
//          les données JSON statiques (public/data/) directement.
// =============================================================================

import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

/** Instance Drizzle — null si pas de DATABASE_URL (dev local JSON-only). */
export const db = databaseUrl
  ? (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const postgres = require('postgres')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { drizzle } = require('drizzle-orm/postgres-js')
      const client = postgres(databaseUrl)
      return drizzle(client, { schema })
    })()
  : null
