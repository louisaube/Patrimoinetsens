// =============================================================================
// API /api/reports — liste et création de signalements citoyens
// Intent : GET retourne les signalements (avec filtres optionnels).
//          POST crée un signalement (auth requise, reporter_id = session user).
//          Claire doit pouvoir signaler en 2 clics depuis son téléphone.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { desc, eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { requireAuth, isAuthError } from '@/lib/api-utils'
import type { NewReport, Report } from '@/lib/db/schema'
import type { SQL } from 'drizzle-orm'

// -----------------------------------------------------------------------------
// GET /api/reports
// Retourne les signalements triés par date de création décroissante.
// Filtres optionnels : ?status=soumis&severity=urgent
// -----------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')

    // Construction dynamique des conditions WHERE
    const conditions: SQL[] = []
    if (status) conditions.push(eq(reports.status, status as Report['status']))
    if (severity) conditions.push(eq(reports.severity, severity as Report['severity']))

    const allReports = await db
      .select()
      .from(reports)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reports.createdAt))

    return NextResponse.json(allReports)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du chargement des signalements' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// POST /api/reports
// Crée un signalement géolocalisé (auth requise).
// -----------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const body = await request.json() as Omit<NewReport, 'reporterId' | 'id' | 'createdAt' | 'updatedAt'>

    if (!body.description?.trim()) {
      return NextResponse.json({ error: 'La description est requise' }, { status: 400 })
    }
    if (typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
      return NextResponse.json({ error: 'Les coordonnées GPS sont requises' }, { status: 400 })
    }

    const [created] = await db
      .insert(reports)
      .values({
        ...body,
        reporterId: userOrError.id,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création du signalement' },
      { status: 500 }
    )
  }
}
