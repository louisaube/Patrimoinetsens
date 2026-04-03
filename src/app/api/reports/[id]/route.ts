// =============================================================================
// API /api/reports/[id] — modification d'un signalement
// Intent : PATCH réservé au rapporteur du signalement (reporter_id check).
//          Le statut peut évoluer (en_cours, resolu, rejete) uniquement par
//          l'auteur du signalement en MVP (dashboard municipal prévu en V2 P3).
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { requireAuth, requireOwner, isAuthError } from '@/lib/api-utils'
import type { NewReport } from '@/lib/db/schema'

// -----------------------------------------------------------------------------
// GET /api/reports/[id]
// Retourne le détail d'un signalement (public).
// -----------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  try {
    const report = await db.query.reports.findFirst({
      where: eq(reports.id, id),
    })

    if (!report) {
      return NextResponse.json({ error: 'Signalement introuvable' }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du chargement du signalement' },
      { status: 500 }
    )
  }
}

// -----------------------------------------------------------------------------
// PATCH /api/reports/[id]
// Modifie un signalement (reporter only).
// -----------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const existing = await db.query.reports.findFirst({
      where: eq(reports.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Signalement introuvable' }, { status: 404 })
    }

    const ownerError = requireOwner(existing.reporterId, userOrError.id)
    if (ownerError) return ownerError

    const body = await request.json() as Partial<Omit<NewReport, 'id' | 'reporterId' | 'createdAt'>>

    const [updated] = await db
      .update(reports)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la modification du signalement' },
      { status: 500 }
    )
  }
}
