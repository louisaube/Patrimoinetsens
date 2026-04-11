// =============================================================================
// Configuration Auth.js v5 (next-auth@beta) — Patrimoine & Sens
// Intent : Authentification via magic link email et OAuth Google.
//          En dev local sans DATABASE_URL, l'adapter est désactivé (JWT-only).
//          En prod, le DrizzleAdapter persiste dans Neon PostgreSQL.
// =============================================================================

import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import Credentials from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

const adapter = db
  ? DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    })
  : undefined

const providers = []

// N'ajouter les providers que si les clés sont configurées
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  )
}

if (process.env.AUTH_RESEND_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM ?? 'noreply@patrimoine-sens.fr',
    })
  )
}

// Dev-only : credentials provider pour tester sans clés OAuth/email
if (process.env.NODE_ENV === 'development' && db) {
  providers.push(
    Credentials({
      name: 'Dev Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'dev@patrimoine-sens.fr' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        if (!email) return null

        // Cherche ou crée l'utilisateur dev
        const [existing] = await db!
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (existing) {
          return { id: existing.id, email: existing.email, name: existing.name }
        }

        // Auto-création en dev
        const [created] = await db!
          .insert(users)
          .values({ email, name: email.split('@')[0] })
          .returning()

        return { id: created.id, email: created.email, name: created.name }
      },
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers,

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token.id && typeof token.id === 'string') {
        session.user.id = token.id
      }
      return session
    },
  },

  secret: process.env.AUTH_SECRET ?? 'dev-secret-patrimoine-sens-local',
})
