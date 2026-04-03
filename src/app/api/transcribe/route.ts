// =============================================================================
// API /api/transcribe — transcription audio via OpenAI Whisper
// Intent : Reçoit un fichier audio (multipart/form-data), le transmet à
//          l'API Whisper d'OpenAI, retourne le texte transcrit.
//          Auth requise : on ne transcrit pas anonymement.
//          Usage cible : Bernard qui enregistre ses récits oraux (V1.1).
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireAuth, isAuthError } from '@/lib/api-utils'

// Client OpenAI — initialisé à la demande (pas au module load pour éviter
// les erreurs au build si OPENAI_API_KEY n'est pas encore définie)
function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY manquante dans les variables d\'environnement')
  }
  return new OpenAI({ apiKey })
}

// -----------------------------------------------------------------------------
// POST /api/transcribe
// Body : multipart/form-data avec un champ "audio" (fichier audio)
// Response : { text: string }
// -----------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userOrError = await requireAuth()
  if (isAuthError(userOrError)) return userOrError

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'Fichier audio manquant (champ "audio" requis)' },
        { status: 400 }
      )
    }

    // Limite de taille : 25 Mo (limite API Whisper)
    const MAX_SIZE_BYTES = 25 * 1024 * 1024
    if (audioFile.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Fichier audio trop volumineux (max 25 Mo)' },
        { status: 413 }
      )
    }

    // Déduction de l'extension depuis le type MIME
    const mimeType = audioFile.type || 'audio/webm'
    const extension = mimeType.includes('ogg') ? 'ogg'
      : mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a'
      : mimeType.includes('wav') ? 'wav'
      : mimeType.includes('mp3') || mimeType.includes('mpeg') ? 'mp3'
      : 'webm'

    const fileName = `recording.${extension}`

    // Conversion Blob → File (requis par le SDK OpenAI)
    const audioAsFile = new File([audioFile], fileName, { type: mimeType })

    const openai = getOpenAI()
    const transcription = await openai.audio.transcriptions.create({
      file: audioAsFile,
      model: 'whisper-1',
      language: 'fr',        // Force le français pour réduire les hallucinations
      response_format: 'text',
    })

    return NextResponse.json({ text: transcription })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'

    // Erreur de configuration (pas de clé API) → 503
    if (message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'Service de transcription non configuré' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la transcription audio' },
      { status: 500 }
    )
  }
}
