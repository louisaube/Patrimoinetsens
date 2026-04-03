// =============================================================================
// API /api/heritage/[id] — détail, modification, suppression d'un item
// Intent : GET retourne l'item avec ses contributions groupées par type.
//          PATCH et DELETE sont réservés au créateur de la fiche (owner check).
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { heritageItems } from '@/lib/db/schema'
import { requireAuth, requireOwner, isAuthError } from '@/lib/api-utils'
import type { NewHeritageItem } from '@/lib/db/schema'

// -----------------------------------------------------------------------------
// GET /api/heritage/[id]
// Retourne l'item avec ses contributions, groupées par type pour l'affichage.
// -----------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  try {
    const item = await db.query.heritageItems.findFirst({
      where: eq(heritageItems.id, id),
      with: {
        contributions: {
          orderBy: (c, { desc }) => [desc(c.createdAt)],
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: 'Élément patrimonial introuvable' }, { status: 404 })
    }

    // Groupement des contributions par type pour faciliter l'affichage
    const contributionsByType = item.contributions.reduce<
      Record<string, typeof item.contributions>
    >((acc, contribution) => {
      const type = contribution.contributionType
      if (!acc[type]) acc[type] = []
      acc[type].push(contribution)
      return acc
    }, {})

    return NextResponse.json({ ...item, contributionsByType })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'élément patrimonial' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// PATCH /api/heritage/[id]
// Modifie un item (owner only).
// -----------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const existing = await db.query.heritageItems.findFirst({
      where: eq(heritageItems.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Élément patrimonial introuvable' }, { status: 404 })
    }

    const ownerError = requireOwner(existing.createdBy, userOrError.id)
    if (ownerError) return ownerError

    const body = await request.json() as Partial<Omit<NewHeritageItem, 'id' | 'createdBy' | 'createdAt'>>

    const [updated] = await db
      .update(heritageItems)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(heritageItems.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la fiche patrimoniale' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// DELETE /api/heritage/[id]
// Supprime un item et ses contributions en cascade (owner only).
// -----------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const existing = await db.query.heritageItems.findFirst({
      where: eq(heritageItems.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Élément patrimonial introuvable' }, { status: 404 })
    }

    const ownerError = requireOwner(existing.createdBy, userOrError.id)
    if (ownerError) return ownerError

    // Les contributions sont supprimées en cascade (ON DELETE CASCADE en schéma)
    await db.delete(heritageItems).where(eq(heritageItems.id, id))

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la fiche patrimoniale' },
      { status: 500 }
    )
  }
}

