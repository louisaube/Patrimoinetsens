"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, Mic, Heart, Eye, Pencil, Trash2, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn, contributionTypeLabel, formatDate, getInitials } from "@/lib/utils"
import type { Contribution, ContributionType } from "@/types"

const TYPE_ICONS: Record<ContributionType, React.FC<{ className?: string }>> = {
  historique: BookOpen,
  recit: Mic,
  temoignage: Heart,
  observation: Eye,
}

const TYPE_COLORS: Record<ContributionType, string> = {
  historique: "bg-blue-50 text-blue-700 border-blue-200",
  recit: "bg-purple-50 text-purple-700 border-purple-200",
  temoignage: "bg-rose-50 text-rose-700 border-rose-200",
  observation: "bg-amber-50 text-amber-700 border-amber-200",
}

interface ContributionCardProps {
  contribution: Contribution
  currentUserId?: string
  heritageId: string
}

export function ContributionCard({
  contribution,
  currentUserId,
  heritageId,
}: ContributionCardProps) {
  const Icon = TYPE_ICONS[contribution.type]
  const isOwner = currentUserId === contribution.author.id

  return (
    <Card
      className={cn(
        "bg-white border-stone-100 shadow-sm transition-all duration-200 hover:shadow-md"
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* En-tête : avatar, nom, date, badge type */}
        <div className="flex items-start gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarImage
              src={contribution.author.avatarUrl}
              alt={contribution.author.name}
            />
            <AvatarFallback className="bg-stone-100 text-stone-600 text-xs">
              {getInitials(contribution.author.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-stone-800">
                {contribution.author.name}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs gap-1",
                  TYPE_COLORS[contribution.type]
                )}
              >
                <Icon className="size-3" />
                {contributionTypeLabel(contribution.type)}
              </Badge>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {formatDate(contribution.createdAt)}
              {contribution.updatedAt !== contribution.createdAt && (
                <span className="italic"> · modifié</span>
              )}
            </p>
          </div>

          {/* Actions propriétaire */}
          {isOwner && (
            <div className="flex gap-1 shrink-0">
              <Link
                href={`/heritage/${heritageId}/contribute?edit=${contribution.id}`}
                className="inline-flex size-7 items-center justify-center rounded-md text-stone-400 hover:text-stone-700 hover:bg-muted transition-colors"
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">Modifier</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-stone-400 hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>
          )}
        </div>

        <Separator className="bg-stone-50" />

        {/* Champs spécifiques historique */}
        {contribution.type === "historique" && (
          <div className="space-y-2">
            {contribution.period && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium uppercase tracking-wide">
                  Période
                </span>
                <span className="text-stone-700 font-medium">
                  {contribution.period}
                </span>
              </div>
            )}
            {contribution.sources && contribution.sources.length > 0 && (
              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">
                  Sources
                </p>
                <ul className="space-y-1">
                  {contribution.sources.map((source, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600">
                      <Quote className="size-3 shrink-0 mt-0.5 text-stone-400" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Corps de la contribution */}
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
          {contribution.body}
        </p>
      </CardContent>
    </Card>
  )
}
