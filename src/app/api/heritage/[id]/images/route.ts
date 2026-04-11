// =============================================================================
// API /api/heritage/[id]/images — images liées à un élément patrimonial
// Intent : Retourne les images du catalogue (Commons, Gallica, Archives Yonne)
//          matchées à cet item par le pipeline de labelling.
//          Source : fichier JSON statique, pas de DB.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface CatalogImage {
  id: string
  source: string
  title: string
  url: string
  thumbnail: string
  license: string
  tags: string[]
  relatedHeritageItemId: string | null
  width?: number
  height?: number
  description?: string
}

interface ImageCatalog {
  images: CatalogImage[]
}

// Cache le catalogue en mémoire (rechargé au redémarrage du serveur)
let catalogCache: CatalogImage[] | null = null

function loadCatalog(): CatalogImage[] {
  if (catalogCache) return catalogCache

  const catalogPath = join(process.cwd(), 'tools', 'scraping', 'output', 'image_catalog.json')

  if (!existsSync(catalogPath)) {
    console.warn('[images API] Catalogue introuvable:', catalogPath)
    return []
  }

  try {
    const raw = readFileSync(catalogPath, 'utf-8')
    const data = JSON.parse(raw) as ImageCatalog
    catalogCache = data.images ?? []
    return catalogCache
  } catch (err) {
    console.error('[images API] Erreur lecture catalogue:', err)
    return []
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const catalog = loadCatalog()

  const images = catalog
    .filter((img) => img.relatedHeritageItemId === id)
    .map((img) => ({
      id: img.id,
      source: img.source,
      title: img.title,
      url: img.url,
      thumbnail: img.thumbnail,
      license: img.license,
      width: img.width,
      height: img.height,
      description: img.description ?? '',
    }))

  return NextResponse.json({ images, total: images.length })
}
