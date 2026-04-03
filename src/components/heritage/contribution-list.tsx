import * as React from "react"
import { ContributionCard } from "@/components/heritage/contribution-card"
import type { Contribution, ContributionType } from "@/types"

interface ContributionListProps {
  contributions: Contribution[]
  type: ContributionType
  currentUserId?: string
  heritageId: string
}

export function ContributionList({
  contributions,
  type,
  currentUserId,
  heritageId,
}: ContributionListProps) {
  const filtered = contributions.filter((c) => c.type === type)

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-stone-400 text-sm">
          Aucune contribution de ce type pour l&apos;instant.
        </p>
        <p className="text-stone-300 text-xs mt-1">
          Soyez le premier à contribuer !
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((contribution) => (
        <ContributionCard
          key={contribution.id}
          contribution={contribution}
          currentUserId={currentUserId}
          heritageId={heritageId}
        />
      ))}
    </div>
  )
}
