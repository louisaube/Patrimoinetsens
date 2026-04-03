// =============================================================================
// Client Drizzle ORM — Patrimoine & Sens
// Intent : Connexion à Neon PostgreSQL via le driver serverless HTTP.
//          Le mode HTTP est requis pour les Edge Functions et App Router Next.js.
//          Exporte le client db utilisé par toutes les API routes.
// =============================================================================

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL est manquant dans les variables d\'environnement')
}

const sql = neon(databaseUrl)

/** Instance Drizzle partagée avec le schéma complet. */
export const db = drizzle(sql, { schema })
