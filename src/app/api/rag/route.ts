import { NextRequest, NextResponse } from "next/server"

/**
 * API RAG — Interroge le corpus historique de Sens avec citations sourcées.
 *
 * GET /api/rag?q=Quand la cathédrale a-t-elle été construite ?
 *
 * Retourne les chunks les plus pertinents avec leur source et fiabilité.
 * Le frontend peut ensuite les afficher ou les passer à un LLM.
 */

const RAG_BACKEND = process.env.RAG_BACKEND_URL || "http://localhost:8787"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")

  if (!q) {
    return NextResponse.json(
      { error: "Missing ?q= parameter" },
      { status: 400 }
    )
  }

  try {
    // Appeler le backend Python RAG
    const res = await fetch(`${RAG_BACKEND}/api/rag?q=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "RAG backend error", status: res.status },
        { status: 502 }
      )
    }

    const data = await res.json()

    return NextResponse.json({
      query: data.query,
      sources: data.sources_used,
      context_length: data.context_length,
      // On ne retourne pas le prompt complet côté client
      // Le frontend affiche les sources et peut demander une réponse au LLM
      chunks: data.chunks?.map((c: Record<string, unknown>) => ({
        text: (c.text as string)?.substring(0, 500),
        source: c.source,
        reliability: c.reliability,
        reliability_label: c.reliability_label,
        date: c.date,
        score: c.adjusted_score,
      })),
    })
  } catch (error) {
    // Si le backend RAG n'est pas démarré, retourner une erreur propre
    return NextResponse.json(
      {
        error: "RAG backend not available. Start it with: python tools/rag/query_rag.py --api",
        detail: String(error),
      },
      { status: 503 }
    )
  }
}
