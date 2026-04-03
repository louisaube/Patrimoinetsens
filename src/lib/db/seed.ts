// =============================================================================
// Seed Drizzle — Patrimoine & Sens (orchestrateur)
// Intent : Données de développement représentatives basées sur des éléments
//          patrimoniaux réels de Sens (Yonne, Bourgogne).
//          NE PAS exécuter en production.
//
// Sources utilisées :
//   Base Mérimée (Ministère de la Culture) — open data officiel MH
//   Denis Cailleaux, *La cathédrale en chantier*, CTHS, Paris, 1999
//   Gérard Daguin, histoire-sens-senonais-yonne.com (chroniqueur local, † 2018)
//   SenoN.org, "Histoire de Sens" (site communautaire actif)
//   Bernard Brousse, *Sens, une cité d'art et d'histoire*, Le Charmoiset, 2024
//   Société Archéologique de Sens (SAS), Bulletins 1846-présent
//   Quantin, Maximilien, *Cartulaire général de l'Yonne*, 1854-1860
//   Wikipedia FR (articles sourcés avec références PA Mérimée)
//   Alain Dommanget, *Les grandes affaires criminelles de l'Yonne*, 2010
//   BnF/Gallica — presse locale ancienne de l'Yonne
//
// Structure :
//   seed-users.ts          → 4 personas (Denis, Bernard, Marie, Claire)
//   seed-items.ts          → 60+ heritage items (lieux, monuments, sites industriels)
//   seed-contributions.ts  → 80+ contributions (historique, recit, observation, temoignage)
//   seed.ts                → cet orchestrateur (import + insert)
//
// Usage : npm run db:seed
// =============================================================================

import 'dotenv/config'
import { db } from './index'
import { users, heritageItems, contributions, reports } from './schema'
import { seedUsers } from './seed-users'
import { seedHeritageItems } from './seed-items'
import { seedContributions } from './seed-contributions'

// Signalement de test (Claire — fontaine de la Samaritaine)
const seedReports = [
  {
    id: 'a7777777-0001-0001-0001-000000000001',
    reporterId: 'd4444444-4444-4444-4444-444444444444',
    heritageItemId: 'e5555555-0007-0007-0007-000000000007',
    reportType: 'degradation' as const,
    description: 'Bras cassé sur la figure sculptée côté est. Débris visibles dans le bassin. Graffiti récent sur le socle.',
    severity: 'moyen' as const,
    status: 'soumis' as const,
    photos: null,
    latitude: 48.1965,
    longitude: 3.2855,
  },
] as const

async function seed() {
  console.log('Démarrage du seed...')

  // Utilisateurs
  await db.insert(users).values(seedUsers as never).onConflictDoNothing()
  console.log(`${seedUsers.length} utilisateurs insérés`)

  // Éléments patrimoniaux
  await db.insert(heritageItems).values(seedHeritageItems as never).onConflictDoNothing()
  console.log(`${seedHeritageItems.length} éléments patrimoniaux insérés`)

  // Contributions
  await db.insert(contributions).values(seedContributions as never).onConflictDoNothing()
  console.log(`${seedContributions.length} contributions insérées`)

  // Signalements
  await db.insert(reports).values(seedReports as never).onConflictDoNothing()
  console.log(`${seedReports.length} signalements insérés`)

  console.log('Seed terminé.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Erreur seed :', err)
  process.exit(1)
})
