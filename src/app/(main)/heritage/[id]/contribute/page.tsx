"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ContributionForm } from "@/components/heritage/contribution-form"
import { useCreateContribution, useHeritage } from "@/hooks/use-heritage"
import { useToast } from "@/components/ui/toast"

export default function ContributePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: heritage, loading } = useHeritage(id)
  const { mutate: createContribution } = useCreateContribution(id)
  const { toast } = useToast()

  const heritageTitle = heritage?.title ?? "Élément patrimonial"

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/heritage/${id}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-serif text-xl font-bold text-slate-800 leading-tight">
            Ajouter une contribution
          </h1>
          <p className="text-sm text-slate-500 truncate">à {heritageTitle}</p>
        </div>
      </div>

      {/* Formulaire */}
      <ContributionForm
        heritageTitle={heritageTitle}
        onSubmit={async (data) => {
          const created = await createContribution({
            type: data.type,
            title: data.title || undefined,
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
