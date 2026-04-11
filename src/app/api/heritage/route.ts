// =============================================================================
// API /api/heritage — liste et création d'éléments patrimoniaux
// Intent : GET retourne les items publiés avec le décompte de contributions
//          pour alimenter la carte et la page d'accueil.
//          POST crée un item (authentification requise, created_by = session user).
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { eq, sql, desc, and, gte, lte, ilike, or } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { heritageItems, contributions } from '@/lib/db/schema'
import { requireAuth, isAuthError, requireDb } from '@/lib/api-utils'
import type { NewHeritageItem } from '@/lib/db/schema'

// -----------------------------------------------------------------------------
// GET /api/heritage
// Retourne les items publiés avec le décompte agrégé de leurs contributions.
// Filtres optionnels : ?category=edifice_religieux&periodStart=1000&periodEnd=1300
// -----------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  const dbErr = requireDb()
  if (dbErr) return dbErr
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category')
    const periodStart = searchParams.get('periodStart')
    const periodEnd = searchParams.get('periodEnd')
    const query = searchParams.get('q')

    const conditions: SQL[] = [eq(heritageItems.status, 'publie')]

    if (query && query.trim()) {
      const term = `%${query.trim()}%`
      // Recherche dans le titre de la fiche, le titre des contributions, et le corps des contributions
      conditions.push(
        or(
          ilike(heritageItems.title, term),
          ilike(contributions.title, term),
          ilike(contributions.body, term),
        )!
      )
    }
    if (category) {
      conditions.push(eq(heritageItems.category, category as (typeof heritageItems.category)['_']['data']))
    }
    if (periodStart) {
      conditions.push(gte(heritageItems.periodStart, parseInt(periodStart, 10)))
    }
    if (periodEnd) {
      conditions.push(lte(heritageItems.periodStart, parseInt(periodEnd, 10)))
    }

    const items = await db!
      .select({
        id: heritageItems.id,
        createdBy: heritageItems.createdBy,
        title: heritageItems.title,
        category: heritageItems.category,
        status: heritageItems.status,
        latitude: heritageItems.latitude,
        longitude: heritageItems.longitude,
        coverPhotoUrl: heritageItems.coverPhotoUrl,
        periodStart: heritageItems.periodStart,
        periodEnd: heritageItems.periodEnd,
        createdAt: heritageItems.createdAt,
        updatedAt: heritageItems.updatedAt,
        contributionCount: sql<number>`count(${contributions.id})::int`,
      })
      .from(heritageItems)
      .leftJoin(contributions, eq(contributions.heritageItemId, heritageItems.id))
      .where(and(...conditions))
      .groupBy(heritageItems.id)
      .orderBy(desc(heritageItems.createdAt))

    return NextResponse.json(items)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du chargement des éléments patrimoniaux' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// POST /api/heritage
// Crée un nouvel élément patrimonial (auth requise).
// -----------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const body = await request.json() as Omit<NewHeritageItem, 'createdBy' | 'id' | 'createdAt' | 'updatedAt'>

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
    }
    if (typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
      return NextResponse.json({ error: 'Les coordonnées GPS sont requises' }, { status: 400 })
    }

    const [created] = await db!
      .insert(heritageItems)
      .values({
        ...body,
        createdBy: userOrError.id,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la fiche patrimoniale' },
      { status: 500 }
    )
  }
}
