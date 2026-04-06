// =============================================================================
// Utilitaires de sécurité pour les API routes — Patrimoine & Sens
// Intent : Guards centralisés pour l'authentification et l'autorisation.
//          Évite la duplication de la logique de vérification dans chaque route.
//          Règle métier critique : un utilisateur ne peut modifier que ses propres
//          contributions/items/reports.
// =============================================================================

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AuthUser = {
  id: string
  email?: string | null
  name?: string | null
}

// -----------------------------------------------------------------------------
// Guards
// -----------------------------------------------------------------------------

/**
 * Vérifie qu'une session valide existe.
 * Retourne l'utilisateur authentifié ou lance une réponse 401.
 */
export async function requireAuth(): Promise<AuthUser | NextResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentification requise' },
      { status: 401 }
    )
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  }
}

/**
 * Vérifie que l'utilisateur est le propriétaire de la ressource.
 * Retourne une réponse 403 si les IDs ne correspondent pas.
 */
export function requireOwner(
  resourceUserId: string,
  sessionUserId: string
): NextResponse | null {
  if (resourceUserId !== sessionUserId) {
    return NextResponse.json(
      { error: 'Accès interdit : vous n\'êtes pas le propriétaire de cette ressource' },
      { status: 403 }
    )
  }
  return null
}

/**
 * Vérifie que la base de données est disponible.
 * Retourne une réponse 503 si db est null (dev local sans DATABASE_URL).
 */
export function requireDb(): NextResponse | null {
  if (!db) {
    return NextResponse.json(
      { error: 'Base de données non configurée (DATABASE_URL manquant). En dev local, les données sont servies en JSON statique.' },
      { status: 503 }
    )
  }
  return null
}

/**
 * Helper de typage : détermine si le résultat de requireAuth est une erreur.
 */
export function isAuthError(
  result: AuthUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse
}
