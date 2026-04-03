// =============================================================================
// Configuration Drizzle Kit — Patrimoine & Sens
// Intent : Paramétrage des commandes drizzle-kit (generate, migrate, push, studio).
//          Les migrations sont versionnées dans ./drizzle/ (distinct de supabase/).
// =============================================================================

import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
