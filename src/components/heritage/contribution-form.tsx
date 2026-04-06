"use client"

import * as React from "react"
import { Plus, Trash2, BookOpen, Mic, Heart, Eye, Loader2, Eye as EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AudioRecorder } from "@/components/heritage/audio-recorder"
import { cn, contributionTypeLabel } from "@/lib/utils"
import type { ContributionType } from "@/types"

const CONTRIBUTION_TYPES: Array<{
  value: ContributionType
  icon: React.FC<{ className?: string }>
  description: string
}> = [
  {
    value: "historique",
    icon: BookOpen,
    description: "Faits historiques datés, sources bibliographiques",
  },
  {
    value: "recit",
    icon: Mic,
    description: "Anecdotes, légendes, traditions orales",
  },
  {
    value: "temoignage",
    icon: Heart,
    description: "Souvenirs personnels, photographies",
  },
  {
    value: "observation",
    icon: Eye,
    description: "État actuel, observations terrain",
  },
]

const MAX_BODY_LENGTH = 3000

interface FormState {
  type: ContributionType
  body: string
  period: string
  sources: string[]
}

interface FormErrors {
  body?: string
  sources?: string
}

interface ContributionFormProps {
  heritageTitle: string
  onSubmit?: (data: FormState) => Promise<void>
  initialType?: ContributionType
}

export function ContributionForm({
  heritageTitle,
  onSubmit,
  initialType = "historique",
}: ContributionFormProps) {
  const [form, setForm] = React.useState<FormState>({
    type: initialType,
    body: "",
    period: "",
    sources: [""],
  })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [preview, setPreview] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.body.trim()) {
      newErrors.body = "Le contenu est obligatoire."
    }
    if (form.type === "historique") {
      const filledSources = form.sources.filter((s) => s.trim())
      if (filledSources.length === 0) {
        newErrors.sources = "Au moins une source est requise pour une contribution historique."
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTypeChange = (type: ContributionType) => {
    setForm((prev) => ({ ...prev, type }))
    setErrors({})
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, MAX_BODY_LENGTH)
    setForm((prev) => ({ ...prev, body: value }))
    if (errors.body && value.trim()) {
      setErrors((prev) => ({ ...prev, body: undefined }))
    }
  }

  const addSource = () => {
    setForm((prev) => ({ ...prev, sources: [...prev.sources, ""] }))
  }

  const removeSource = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }))
  }

  const updateSource = (index: number, value: string) => {
    setForm((prev) => {
      const sources = [...prev.sources]
      sources[index] = value
      return { ...prev, sources }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit?.({
        ...form,
        sources: form.sources.filter((s) => s.trim()),
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-blue-100">
          <BookOpen className="size-7 text-blue-800" />
        </div>
        <div>
          <p className="font-semibold text-stone-800">Contribution publiée !</p>
          <p className="text-sm text-stone-500 mt-1">
            Votre contribution à &quot;{heritageTitle}&quot; a bien été enregistrée.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {/* Sélecteur de type */}
      <div>
        <p className="text-sm font-medium text-stone-700 mb-3">
          Type de contribution
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONTRIBUTION_TYPES.map(({ value, icon: Icon, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleTypeChange(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center text-xs transition-all duration-200",
                form.type === value
                  ? "border-blue-700 bg-blue-50 text-blue-900"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              )}
            >
              <Icon className="size-5" />
              <span className="font-medium">{contributionTypeLabel(value)}</span>
              <span className="hidden text-xs opacity-70 sm:block leading-tight">
                {description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Champs conditionnels : Historique */}
      {form.type === "historique" && (
        <div className="space-y-4 rounded-xl bg-blue-50 border border-blue-100 p-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-800">
              Période <span className="text-stone-400 font-normal">(optionnel)</span>
            </label>
            <Input
              type="text"
              placeholder="ex : XIIe siècle, 1134-1164, Moyen Âge…"
              value={form.period}
              onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value }))}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-800">
              Sources bibliographiques{" "}
              <Badge variant="outline" className="text-xs ml-1 border-blue-300 text-blue-700">
                Requis
              </Badge>
            </label>
            <div className="space-y-2">
              {form.sources.map((source, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Source ${i + 1} — auteur, titre, année…`}
                    value={source}
                    onChange={(e) => updateSource(i, e.target.value)}
                    className="bg-white flex-1"
                  />
                  {form.sources.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Supprimer la source ${i + 1}`}
                      className="text-red-400 hover:text-red-600 shrink-0"
                      onClick={() => removeSource(i)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSource}
              className="text-blue-700 border-blue-300 hover:bg-blue-50"
            >
              <Plus className="size-4 mr-1" />
              Ajouter une source
            </Button>
            {errors.sources && (
              <p className="text-xs text-red-600">{errors.sources}</p>
            )}
          </div>
        </div>
      )}

      {/* Enregistrement audio pour récit/témoignage */}
      {(form.type === "recit" || form.type === "temoignage") && (
        <AudioRecorder
          onTranscription={(text) =>
            setForm((prev) => ({
              ...prev,
              // Ajoute la transcription après le texte existant (non-destructif)
              body: prev.body.trim()
                ? `${prev.body.trim()}\n\n${text}`
                : text,
            }))
          }
        />
      )}

      {/* Corps de la contribution */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="body"
            className="block text-sm font-medium text-stone-700"
          >
            Contenu{" "}
            <Badge variant="outline" className="text-xs ml-1">
              Requis
            </Badge>
          </label>
          <span
            className={cn(
              "text-xs",
              form.body.length > MAX_BODY_LENGTH * 0.9
                ? "text-red-500"
                : "text-stone-400"
            )}
          >
            {form.body.length}/{MAX_BODY_LENGTH}
          </span>
        </div>
        <Textarea
          id="body"
          placeholder={
            form.type === "historique"
              ? "Rédigez votre contribution historique avec rigueur et précision…"
              : form.type === "recit"
              ? "Racontez votre récit, légende ou anecdote locale…"
              : form.type === "temoignage"
              ? "Partagez votre souvenir, vécu ou témoignage personnel…"
              : "Décrivez ce que vous observez sur le terrain…"
          }
          value={form.body}
          onChange={handleBodyChange}
          rows={8}
          className={cn(
            "resize-none",
            errors.body && "border-red-400 focus-visible:ring-red-300"
          )}
        />
        {errors.body && (
          <p className="text-xs text-red-600">{errors.body}</p>
        )}
      </div>

      {/* Aperçu */}
      {preview && form.body.trim() && (
        <Card className="border-stone-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
              Aperçu
            </p>
            {form.type === "historique" && form.period && (
              <p className="text-xs text-stone-500 mb-1">
                Période : <span className="font-medium text-stone-700">{form.period}</span>
              </p>
            )}
            <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
              {form.body}
            </p>
            {form.type === "historique" &&
              form.sources.filter((s) => s.trim()).length > 0 && (
                <div className="mt-3 border-t border-stone-100 pt-2">
                  <p className="text-xs text-stone-400 font-medium mb-1">Sources</p>
                  <ul className="space-y-0.5">
                    {form.sources
                      .filter((s) => s.trim())
                      .map((s, i) => (
                        <li key={i} className="text-xs text-stone-600">
                          [{i + 1}] {s}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPreview(!preview)}
          disabled={!form.body.trim()}
        >
          <EyeIcon className="size-4 mr-2" />
          {preview ? "Masquer l'aperçu" : "Aperçu"}
        </Button>
        <Button
          type="submit"
          className="bg-blue-800 hover:bg-blue-900 text-white"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Publication…
            </>
          ) : (
            "Publier la contribution"
          )}
        </Button>
      </div>
    </form>
  )
}
