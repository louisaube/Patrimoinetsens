// =============================================================================
// Schéma Drizzle ORM — Patrimoine & Sens
// Intent : Traduction du schéma SQL (001_initial_schema.sql) en Drizzle ORM.
//          Tables métier : heritageItems, contributions, reports.
//          Tables Auth.js : users, accounts, sessions, verificationTokens.
//          La règle absolue est préservée : seul l'auteur modifie sa contribution.
// =============================================================================

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  doublePrecision,
  timestamp,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

// -----------------------------------------------------------------------------
// Enums : domaines métier fermés (miroir des types PostgreSQL)
// -----------------------------------------------------------------------------

/** Les quatre catégories patrimoniales du périmètre MVP + échappatoire "autre". */
export const categoryEnum = pgEnum('category_enum', [
  'batiment_historique',
  'edifice_religieux',
  'mobilier_urbain',
  'patrimoine_naturel',
  'personnalite',
  'autre',
])

/** Cycle de vie d'une fiche patrimoine. */
export const itemStatusEnum = pgEnum('item_status_enum', [
  'brouillon',
  'publie',
  'archive',
])

/** Typologie des contributions : Denis (historique), Bernard (recit), etc. */
export const contributionTypeEnum = pgEnum('contribution_type_enum', [
  'historique',
  'recit',
  'temoignage',
  'observation',
])

/** Nature du signalement citoyen. */
export const reportTypeEnum = pgEnum('report_type_enum', [
  'degradation',
  'danger',
  'disparition',
])

/** Criticité du signalement pour priorisation (dashboard V2). */
export const severityEnum = pgEnum('severity_enum', [
  'faible',
  'moyen',
  'urgent',
  'critique',
])

/** Cycle de vie d'un signalement. */
export const reportStatusEnum = pgEnum('report_status_enum', [
  'soumis',
  'en_cours',
  'resolu',
  'rejete',
])

// -----------------------------------------------------------------------------
// Tables Auth.js — conventions requises par @auth/drizzle-adapter
// -----------------------------------------------------------------------------

/** Utilisateurs authentifiés — table centrale Auth.js. */
export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

/** Comptes OAuth liés à un utilisateur (Google, etc.). */
export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

/** Sessions actives (utilisé en mode "database" strategy — conservé pour compatibilité adapter). */
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

/** Tokens de vérification pour magic link / email. */
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// -----------------------------------------------------------------------------
// Table heritage_items : le conteneur patrimoine
// Intent : Fiche géolocalisée minimaliste. Le contenu réel vient des
//          contributions. Un item peut exister sans contribution (brouillon terrain).
// -----------------------------------------------------------------------------

export const heritageItems = pgTable('heritage_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** Auteur de la fiche. Seul lui peut modifier le conteneur. */
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  title: text('title').notNull(),
  category: categoryEnum('category').notNull(),
  /** Brouillon = visible créateur seul. Publie = public. Archive = hors consultation. */
  status: itemStatusEnum('status').notNull().default('brouillon'),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  coverPhotoUrl: text('cover_photo_url'),
  /**
   * Période historique structurée pour le filtrage par siècle/ère.
   * Exprimée en années : 1100 = début XIIe siècle, -50 = 50 av. J.-C.
   * Nullable : une fiche peut exister sans datation connue.
   */
  periodStart: integer('period_start'),
  periodEnd: integer('period_end'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// -----------------------------------------------------------------------------
// Table contributions : le contenu typé signé
// Intent : Chaque contribution appartient à son auteur et ne peut être modifiée
//          que par lui. Denis et Bernard coexistent sur le même item sans
//          interférence. ON DELETE CASCADE préserve la cohérence si l'item
//          parent est supprimé.
// -----------------------------------------------------------------------------

export const contributions = pgTable('contributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  heritageItemId: uuid('heritage_item_id')
    .notNull()
    .references(() => heritageItems.id, { onDelete: 'cascade' }),
  /** Règle absolue : seul l'auteur peut modifier sa contribution. */
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  contributionType: contributionTypeEnum('contribution_type').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  /** Bibliographie pour les contributions de type historique (usage Denis). */
  sources: text('sources').array(),
  /**
   * "Pour aller plus loin" — contenu de niveau 2+ (lycée/université).
   * Références académiques, liens Gallica, publications spécialisées.
   * Séparé du body (niveau collège/lycée) pour ne pas alourdir la lecture.
   */
  furtherReading: text('further_reading'),
  /** Période historique en texte libre (ex: "XIIe siècle", "1150-1240"). */
  period: text('period'),
  /** URL Storage du fichier audio pour les récits oraux (V1.1 Whisper). */
  audioUrl: text('audio_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// -----------------------------------------------------------------------------
// Table reports : signalements citoyens
// Intent : Permettre à Claire de signaler en 2 clics une dégradation.
//          heritageItemId est nullable : on peut signaler un danger sans
//          qu'une fiche patrimoine existe encore.
// -----------------------------------------------------------------------------

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: text('reporter_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  /** Nullable : signalement possible sans fiche patrimoine existante. */
  heritageItemId: uuid('heritage_item_id').references(() => heritageItems.id, {
    onDelete: 'set null',
  }),
  reportType: reportTypeEnum('report_type').notNull(),
  description: text('description').notNull(),
  /** Criticité utilisée pour priorisation dans le dashboard municipal (V2 P3). */
  severity: severityEnum('severity').notNull(),
  status: reportStatusEnum('status').notNull().default('soumis'),
  photos: text('photos').array(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// -----------------------------------------------------------------------------
// Relations Drizzle — permettent les requêtes avec jointures typées
// -----------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  heritageItems: many(heritageItems),
  contributions: many(contributions),
  reports: many(reports),
}))

export const heritageItemsRelations = relations(heritageItems, ({ one, many }) => ({
  creator: one(users, {
    fields: [heritageItems.createdBy],
    references: [users.id],
  }),
  contributions: many(contributions),
  reports: many(reports),
}))

export const contributionsRelations = relations(contributions, ({ one }) => ({
  heritageItem: one(heritageItems, {
    fields: [contributions.heritageItemId],
    references: [heritageItems.id],
  }),
  author: one(users, {
    fields: [contributions.authorId],
    references: [users.id],
  }),
}))

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
  heritageItem: one(heritageItems, {
    fields: [reports.heritageItemId],
    references: [heritageItems.id],
  }),
}))

// -----------------------------------------------------------------------------
// Types inférés depuis le schéma Drizzle
// -----------------------------------------------------------------------------

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type HeritageItem = InferSelectModel<typeof heritageItems>
export type NewHeritageItem = InferInsertModel<typeof heritageItems>

export type Contribution = InferSelectModel<typeof contributions>
export type NewContribution = InferInsertModel<typeof contributions>

export type Report = InferSelectModel<typeof reports>
export type NewReport = InferInsertModel<typeof reports>
