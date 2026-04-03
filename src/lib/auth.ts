// =============================================================================
// Configuration Auth.js v5 (next-auth@beta) — Patrimoine & Sens
// Intent : Authentification via magic link email et OAuth Google.
//          Le DrizzleAdapter persiste les sessions/comptes dans Neon PostgreSQL.
//          Strategy JWT choisie pour simplicité MVP (pas de session DB lookup).
//          Le callback session expose user.id côté client sans exposition d'infos sensibles.
// =============================================================================

import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM ?? 'noreply@patrimoine-sens.fr',
    }),
  ],

  session: {
    // JWT : pas de lookup DB à chaque requête — adapté au MVP
    strategy: 'jwt',
  },

  callbacks: {
    // Injecte l'id utilisateur dans le token JWT
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    // Expose user.id dans la session côté client
    session({ session, token }) {
      if (token.id && typeof token.id === 'string') {
        session.user.id = token.id
      }
      return session
    },
  },

  secret: process.env.AUTH_SECRET,
})
