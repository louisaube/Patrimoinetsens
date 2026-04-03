"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ContributionForm } from "@/components/heritage/contribution-form"
import { useCreateContribution } from "@/hooks/use-heritage"
import { useToast } from "@/components/ui/toast"

// Pour la démo : titre de la cathédrale
const MOCK_HERITAGE_TITLE: Record<string, string> = {
  "1": "Cathédrale Saint-Étienne de Sens",
  "2": "Palais synodal",
  "3": "Maison d'Abraham",
}

export default function ContributePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const heritageTitle = MOCK_HERITAGE_TITLE[id] ?? "Élément patrimonial"
  const { mutate: createContribution } = useCreateContribution(id)
  const { toast } = useToast()

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/heritage/${id}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-serif text-xl font-bold text-stone-800 leading-tight">
            Ajouter une contribution
          </h1>
          <p className="text-sm text-stone-500 truncate">à {heritageTitle}</p>
        </div>
      </div>

      {/* Formulaire */}
      <ContributionForm
        heritageTitle={heritageTitle}
        onSubmit={async (data) => {
          const created = await createContribution({
            type: data.type,
            body: data.body,
            period: data.period || undefined,
            sources: data.sources.filter((s) => s.trim()),
          })
          if (created) {
            toast({
              title: "Contribution publiée",
              description: "Votre contribution a été ajoutée à la fiche.",
              variant: "success",
            })
            router.push(`/heritage/${id}`)
          } else {
            toast({
              title: "Erreur",
              description: "Impossible de publier la contribution. Réessayez.",
              variant: "destructive",
            })
          }
        }}
      />
    </div>
  )
}
