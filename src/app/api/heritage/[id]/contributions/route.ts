// =============================================================================
// API /api/heritage/[id]/contributions — contributions d'un item patrimonial
// Intent : GET retourne les contributions de l'item triées par date.
//          POST crée une contribution (auth requise, author_id = session user).
//          Règle absolue : chaque contribution est signée par son auteur.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { heritageItems, contributions } from '@/lib/db/schema'
import { requireAuth, isAuthError } from '@/lib/api-utils'
import type { NewContribution } from '@/lib/db/schema'

// -----------------------------------------------------------------------------
// GET /api/heritage/[id]/contributions
// -----------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  try {
    const itemContributions = await db
      .select()
      .from(contributions)
      .where(eq(contributions.heritageItemId, id))
      .orderBy(desc(contributions.createdAt))

    return NextResponse.json(itemContributions)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du chargement des contributions' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// POST /api/heritage/[id]/contributions
// Crée une contribution sur l'item (auth requise).
// -----------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    // Vérification que l'item parent existe
    const item = await db.query.heritageItems.findFirst({
      where: eq(heritageItems.id, id),
    })

    if (!item) {
      return NextResponse.json({ error: 'Élément patrimonial introuvable' }, { status: 404 })
    }

    const body = await request.json() as Omit<NewContribution, 'authorId' | 'heritageItemId' | 'id' | 'createdAt' | 'updatedAt'>

    if (!body.body?.trim()) {
      return NextResponse.json({ error: 'Le corps de la contribution est requis' }, { status: 400 })
    }

    const [created] = await db
      .insert(contributions)
      .values({
        ...body,
        heritageItemId: id,
        authorId: userOrError.id,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la contribution' },
      { status: 500 }
    )
  }
}
