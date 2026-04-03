// =============================================================================
// API /api/contributions/[id] — modification et suppression d'une contribution
// Intent : PATCH et DELETE réservés à l'auteur de la contribution (author_id check).
//          Règle métier critique : un utilisateur ne peut modifier que ses propres
//          contributions. La modération porte sur le contenu inapproprié, jamais
//          sur la véracité historique.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contributions } from '@/lib/db/schema'
import { requireAuth, requireOwner, isAuthError } from '@/lib/api-utils'
import type { NewContribution } from '@/lib/db/schema'

// -----------------------------------------------------------------------------
// PATCH /api/contributions/[id]
// Modifie une contribution (author only).
// -----------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const existing = await db.query.contributions.findFirst({
      where: eq(contributions.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Contribution introuvable' }, { status: 404 })
    }

    // Vérification que l'utilisateur est bien l'auteur de cette contribution
    const ownerError = requireOwner(existing.authorId, userOrError.id)
    if (ownerError) return ownerError

    const body = await request.json() as Partial<Omit<NewContribution, 'id' | 'authorId' | 'heritageItemId' | 'createdAt'>>

    const [updated] = await db
      .update(contributions)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(contributions.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la contribution' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// DELETE /api/contributions/[id]
// Supprime une contribution (author only).
// -----------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const existing = await db.query.contributions.findFirst({
      where: eq(contributions.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Contribution introuvable' }, { status: 404 })
    }

    // Vérification que l'utilisateur est bien l'auteur de cette contribution
    const ownerError = requireOwner(existing.authorId, userOrError.id)
    if (ownerError) return ownerError

    await db.delete(contributions).where(eq(contributions.id, id))

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la contribution' },
      { status: 500 }
    )
  }
}
