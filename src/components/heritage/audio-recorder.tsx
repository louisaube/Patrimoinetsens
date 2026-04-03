"use client"

// =============================================================================
// AudioRecorder — Patrimoine & Sens (V1.1)
// Intent : Permet à Bernard d'enregistrer un récit oral directement dans
//          le navigateur. Le blob audio est envoyé à /api/transcribe (Whisper)
//          et la transcription est injectée dans le formulaire de contribution.
// =============================================================================

import * as React from "react"
import { Mic, Square, Play, Pause, RotateCcw, Wand2, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type RecorderState =
  | "idle"          // Prêt à enregistrer
  | "recording"     // Enregistrement en cours
  | "recorded"      // Audio capturé, en attente de transcription ou de relecture
  | "transcribing"  // Appel Whisper en cours

interface AudioRecorderProps {
  /** Appelé quand la transcription Whisper est prête. */
  onTranscription: (text: string) => void
  className?: string
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function AudioRecorder({ onTranscription, className }: AudioRecorderProps) {
  const [recorderState, setRecorderState] = React.useState<RecorderState>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [duration, setDuration] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [transcribed, setTranscribed] = React.useState(false)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const audioBlobRef = React.useRef<Blob | null>(null)
  const audioUrlRef = React.useRef<string | null>(null)
  const audioElementRef = React.useRef<HTMLAudioElement | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // Nettoyage à l'unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    }
  }, [])

  // ─── Démarrer l'enregistrement ─────────────────────────────────────────────

  const startRecording = async () => {
    setError(null)
    setTranscribed(false)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        })
        audioBlobRef.current = blob

        // Libérer l'ancien URL si présent
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = URL.createObjectURL(blob)

        // Arrêter toutes les pistes pour libérer le micro
        stream.getTracks().forEach((track) => track.stop())

        setRecorderState("recorded")
      }

      mediaRecorder.start(250) // Collecte toutes les 250 ms
      setRecorderState("recording")
      setDuration(0)

      // Timer d'affichage de la durée
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue"
      if (message.includes("Permission") || message.includes("NotAllowed")) {
        setError("Accès au microphone refusé. Autorisez l'accès dans les paramètres du navigateur.")
      } else {
        setError("Impossible d'accéder au microphone.")
      }
    }
  }

  // ─── Arrêter l'enregistrement ──────────────────────────────────────────────

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    mediaRecorderRef.current?.stop()
  }

  // ─── Lecture / Pause ───────────────────────────────────────────────────────

  const togglePlay = () => {
    if (!audioUrlRef.current) return

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrlRef.current)
      audioElementRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioElementRef.current.pause()
      setIsPlaying(false)
    } else {
      void audioElementRef.current.play()
      setIsPlaying(true)
    }
  }

  // ─── Recommencer ──────────────────────────────────────────────────────────

  const reset = () => {
    audioElementRef.current?.pause()
    audioElementRef.current = null
    audioBlobRef.current = null
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    setRecorderState("idle")
    setDuration(0)
    setIsPlaying(false)
    setError(null)
    setTranscribed(false)
  }

  // ─── Transcrire via Whisper ────────────────────────────────────────────────

  const transcribe = async () => {
    if (!audioBlobRef.current) return
    setRecorderState("transcribing")
    setError(null)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlobRef.current)

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const { error: apiError } = (await res.json()) as { error: string }
        throw new Error(apiError ?? `Erreur ${res.status}`)
      }

      const { text } = (await res.json()) as { text: string }

      onTranscription(text)
      setTranscribed(true)
      setRecorderState("recorded")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Échec de la transcription")
      setRecorderState("recorded")
    }
  }

  // ─── Formatage durée ───────────────────────────────────────────────────────

  const formatDuration = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  // ─── Rendu ────────────────────────────────────────────────────────────────

  return (
    <div className={cn("rounded-xl border border-purple-100 bg-purple-50 p-4 space-y-3", className)}>
      {/* Titre */}
      <div className="flex items-center gap-2">
        <Mic className="size-4 text-purple-500" />
        <p className="text-sm font-medium text-purple-800">Enregistrement audio</p>
        <span className="text-xs text-purple-400 ml-auto">
          Votre voix sera transcrite automatiquement
        </span>
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-3">
        {/* Bouton principal : Enregistrer / Arrêter */}
        {recorderState === "idle" && (
          <Button
            type="button"
            onClick={() => void startRecording()}
            variant="outline"
            className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Mic className="size-4" />
            Démarrer l&apos;enregistrement
          </Button>
        )}

        {recorderState === "recording" && (
          <Button
            type="button"
            onClick={stopRecording}
            variant="outline"
            className="gap-2 border-red-300 text-red-700 hover:bg-red-50 animate-pulse"
          >
            <Square className="size-4 fill-red-500 text-red-500" />
            Arrêter ({formatDuration(duration)})
          </Button>
        )}

        {(recorderState === "recorded" || recorderState === "transcribing") && (
          <>
            {/* Lecture */}
            <Button
              type="button"
              onClick={togglePlay}
              size="icon"
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-100"
              aria-label={isPlaying ? "Mettre en pause" : "Écouter l'enregistrement"}
              disabled={recorderState === "transcribing"}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>

            {/* Durée */}
            <span className="text-xs text-purple-600 font-mono">
              {formatDuration(duration)}
            </span>

            {/* Transcrire */}
            {!transcribed && (
              <Button
                type="button"
                onClick={() => void transcribe()}
                disabled={recorderState === "transcribing"}
                className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
              >
                {recorderState === "transcribing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Transcription…
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" />
                    Transcrire
                  </>
                )}
              </Button>
            )}

            {transcribed && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="size-4" />
                Transcrit — texte inséré ci-dessous
              </span>
            )}

            {/* Recommencer */}
            <Button
              type="button"
              onClick={reset}
              size="icon"
              variant="ghost"
              className="text-stone-400 hover:text-stone-600 ml-auto"
              aria-label="Recommencer l'enregistrement"
              disabled={recorderState === "transcribing"}
            >
              <RotateCcw className="size-4" />
            </Button>
          </>
        )}
      </div>

      {/* Indicateur d'enregistrement en cours */}
      {recorderState === "recording" && (
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-600">Enregistrement en cours</span>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
