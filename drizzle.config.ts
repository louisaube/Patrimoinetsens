// =============================================================================
// Configuration Drizzle Kit — Patrimoine & Sens
// Intent : Paramétrage des commandes drizzle-kit (generate, migrate, push, studio).
//          PostgreSQL classique via postgres-js.
// =============================================================================

import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
config({ path: '.env.local' })

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
