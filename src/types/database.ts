// =============================================================================
// Types TypeScript — Patrimoine & Sens
// Intent : Re-exports depuis le schéma Drizzle comme source de vérité unique.
//          Les types Row/Insert sont inférés directement depuis le schéma,
//          garantissant la cohérence sans duplication manuelle.
// =============================================================================

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  heritageItems,
  contributions,
  reports,
  users,
} from '@/lib/db/schema'

// Re-export des enums (valeurs littérales TypeScript)
export type {
  categoryEnum,
  itemStatusEnum,
  contributionTypeEnum,
  reportTypeEnum,
  severityEnum,
  reportStatusEnum,
} from '@/lib/db/schema'

// Re-export des types inférés depuis le schéma Drizzle
export type {
  User,
  NewUser,
  HeritageItem,
  NewHeritageItem,
  Contribution,
  NewContribution,
  Report,
  NewReport,
} from '@/lib/db/schema'

// -----------------------------------------------------------------------------
// Aliases de compatibilité — nommage cohérent avec les conventions Row/Insert
// -----------------------------------------------------------------------------

/** Élément patrimonial tel que retourné par une requête SELECT. */
export type HeritageItemRow = InferSelectModel<typeof heritageItems>

/** Payload pour l'insertion d'un élément patrimonial. */
export type HeritageItemInsert = InferInsertModel<typeof heritageItems>

/** Contribution telle que retournée par une requête SELECT. */
export type ContributionRow = InferSelectModel<typeof contributions>

/** Payload pour l'insertion d'une contribution. */
export type ContributionInsert = InferInsertModel<typeof contributions>

/** Signalement tel que retourné par une requête SELECT. */
export type ReportRow = InferSelectModel<typeof reports>

/** Payload pour l'insertion d'un signalement. */
export type ReportInsert = InferInsertModel<typeof reports>

/** Utilisateur tel que retourné par une requête SELECT. */
export type UserRow = InferSelectModel<typeof users>

// -----------------------------------------------------------------------------
// Types enrichis pour les jointures fréquentes
// -----------------------------------------------------------------------------

/** Élément patrimonial avec décompte de contributions (liste/carte). */
export type HeritageItemWithCount = HeritageItemRow & {
  contributionCount: number
}

/** Élément patrimonial avec ses contributions complètes (page détail). */
export type HeritageItemWithContributions = HeritageItemRow & {
  contributions: ContributionRow[]
  contributionsByType: Partial<Record<string, ContributionRow[]>>
}

/** Contribution avec contexte de l'item parent (fil d'activité). */
export type ContributionWithContext = ContributionRow & {
  heritageItem: Pick<HeritageItemRow, 'id' | 'title' | 'category'> | null
}
