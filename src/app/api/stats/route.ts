import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { heritageItems, contributions, reports } from '@/lib/db/schema'
import { requireDb } from '@/lib/api-utils'

export async function GET(): Promise<NextResponse> {
  const dbErr = requireDb()
  if (dbErr) return dbErr

  try {
    const [itemCount] = await db!
      .select({ count: sql<number>`count(*)::int` })
      .from(heritageItems)
      .where(sql`${heritageItems.status} = 'publie'`)

    const [contribCount] = await db!
      .select({ count: sql<number>`count(*)::int` })
      .from(contributions)

    const [reportCount] = await db!
      .select({ count: sql<number>`count(*)::int` })
      .from(reports)

    return NextResponse.json({
      heritageItems: itemCount.count,
      contributions: contribCount.count,
      reports: reportCount.count,
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    )
  }
}
