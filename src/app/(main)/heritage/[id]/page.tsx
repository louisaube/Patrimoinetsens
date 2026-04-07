"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  BookOpen,
  Mic,
  Heart,
  Eye,
  Plus,
  MapPin,
  ArrowLeft,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ContributionList } from "@/components/heritage/contribution-list"
import { categoryLabel } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useHeritage } from "@/hooks/use-heritage"

// ─── Page ────────────────────────────────────────────────────────────────────

const TABS = [
  { value: "historique", label: "Historique", icon: BookOpen },
  { value: "recit", label: "Récits", icon: Mic },
  { value: "temoignage", label: "Témoignages", icon: Heart },
  { value: "observation", label: "Observations", icon: Eye },
] as const

export default function HeritageDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()
  const { data: heritage, loading, error } = useHeritage(id)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-stone-500">Chargement...</p>
      </div>
    )
  }

  if (error || !heritage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-stone-500">Fiche introuvable</p>
        <Link href="/" className="text-blue-800 underline text-sm">
          Retour
        </Link>
      </div>
    )
  }

  const countByType = (type: string) =>
    heritage.contributions.filter((c) => c.type === type).length

  return (
    <div className="relative min-h-screen">
      {/* Image couverture */}
      <div className="relative h-52 w-full overflow-hidden bg-stone-200 sm:h-64">
        {heritage.coverPhotoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heritage.coverPhotoUrl}
            alt={heritage.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="size-12 text-stone-400" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Bouton retour */}
        <Link
          href="/"
          aria-label="Retour à la liste"
          className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-700 hover:bg-white transition-all"
        >
          <ArrowLeft className="size-4" />
        </Link>

        {/* Titre sur l'image */}
        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {categoryLabel(heritage.category)}
          </Badge>
          <h1 className="font-serif text-xl font-bold text-white leading-tight sm:text-2xl">
            {heritage.title}
          </h1>
        </div>
      </div>

      {/* Corps */}
      <div className="mx-auto max-w-2xl px-4 pb-24">
        {/* Mini-carte position */}
        <div className="mt-4">
          <a
            href={`https://www.openstreetmap.org/?mlat=${heritage.latitude}&mlon=${heritage.longitude}&zoom=17`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-blue-800 hover:underline"
          >
            <MapPin className="size-3.5" />
            {heritage.latitude.toFixed(4)}, {heritage.longitude.toFixed(4)} — Voir sur OpenStreetMap
          </a>
        </div>

        {/* Tabs contributions */}
        <div className="mt-6">
          <Tabs defaultValue="historique">
            <TabsList className="w-full grid grid-cols-4 h-auto p-1">
              {TABS.map(({ value, label, icon: Icon }) => {
                const count = countByType(value)
                return (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="flex-col gap-1 py-2 h-auto text-xs"
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{label}</span>
                    {count > 0 && (
                      <span className="inline-flex size-4 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {TABS.map(({ value }) => (
              <TabsContent key={value} value={value} className="mt-4">
                <ContributionList
                  contributions={heritage.contributions}
                  type={value}
                  heritageId={id}
                  // currentUserId="u3" // décommentez pour tester les boutons d'édition
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* FAB Contribuer — accessible uniquement si authentifié */}
      {user && (
        <div className="fixed bottom-20 right-4 z-30 md:bottom-6">
          <Link
            href={`/heritage/${id}/contribute`}
            className="inline-flex items-center gap-2 rounded-full shadow-lg bg-blue-800 hover:bg-blue-900 text-white px-5 h-12 font-medium text-sm transition-colors"
          >
            <Plus className="size-5" />
            <span>Contribuer</span>
          </Link>
        </div>
      )}
    </div>
  )
}
