// =============================================================================
// Client Drizzle ORM — Patrimoine & Sens
// Intent : Connexion à Neon PostgreSQL quand DATABASE_URL est défini.
//          En dev local sans DATABASE_URL, exporte null — les hooks utilisent
//          les données JSON statiques (public/data/) directement.
// =============================================================================

import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

/** Instance Drizzle — null si pas de DATABASE_URL (dev local JSON-only). */
export const db = databaseUrl
  ? (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { drizzle } = require('drizzle-orm/neon-http')
      return drizzle(neon(databaseUrl), { schema })
    })()
  : null
