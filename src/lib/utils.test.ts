import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  categoryLabel,
  contributionTypeLabel,
  severityColor,
  reportStatusLabel,
  categoryColor,
  getInitials,
} from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes (false excluded)', () => {
    expect(cn('base', false && 'skipped', 'added')).toBe('base added')
  })

  it('deduplicates tailwind utilities — last wins', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('returns empty string with no input', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDate', () => {
  it('formats ISO date string to French locale', () => {
    const result = formatDate('2026-03-30T00:00:00Z')
    expect(result).toMatch(/30/)
    expect(result).toMatch(/2026/)
  })

  it('formats a year-2000 date', () => {
    const result = formatDate('2000-01-01T00:00:00Z')
    expect(result).toMatch(/2000/)
  })
})

describe('categoryLabel', () => {
  it('returns label for batiment_historique', () => {
    expect(categoryLabel('batiment_historique')).toBe('Bâtiment historique')
  })

  it('returns label for edifice_religieux', () => {
    expect(categoryLabel('edifice_religieux')).toBe('Édifice religieux')
  })

  it('returns label for mobilier_urbain', () => {
    expect(categoryLabel('mobilier_urbain')).toBe('Mobilier urbain')
  })

  it('returns label for patrimoine_naturel', () => {
    expect(categoryLabel('patrimoine_naturel')).toBe('Patrimoine naturel')
  })

  it('returns label for autre', () => {
    expect(categoryLabel('autre')).toBe('Autre')
  })

  it('returns the key itself for unknown category', () => {
    expect(categoryLabel('unknown_cat')).toBe('unknown_cat')
  })
})

describe('contributionTypeLabel', () => {
  it('returns Historique for historique', () => {
    expect(contributionTypeLabel('historique')).toBe('Historique')
  })

  it('returns Récit for recit', () => {
    expect(contributionTypeLabel('recit')).toBe('Récit')
  })

  it('returns Témoignage for temoignage', () => {
    expect(contributionTypeLabel('temoignage')).toBe('Témoignage')
  })

  it('returns Observation for observation', () => {
    expect(contributionTypeLabel('observation')).toBe('Observation')
  })

  it('returns the key itself for unknown type', () => {
    expect(contributionTypeLabel('unknown')).toBe('unknown')
  })
})

describe('severityColor', () => {
  it('returns emerald classes for faible', () => {
    expect(severityColor('faible')).toContain('emerald')
  })

  it('returns amber classes for moyen', () => {
    expect(severityColor('moyen')).toContain('amber')
  })

  it('returns orange classes for urgent', () => {
    expect(severityColor('urgent')).toContain('orange')
  })

  it('returns red classes for critique', () => {
    expect(severityColor('critique')).toContain('red')
  })

  it('returns gray classes for unknown severity', () => {
    expect(severityColor('unknown')).toContain('gray')
  })
})

describe('reportStatusLabel', () => {
  it('returns Soumis for soumis', () => {
    expect(reportStatusLabel('soumis')).toBe('Soumis')
  })

  it('returns En cours for en_cours', () => {
    expect(reportStatusLabel('en_cours')).toBe('En cours')
  })

  it('returns Résolu for resolu', () => {
    expect(reportStatusLabel('resolu')).toBe('Résolu')
  })

  it('returns Rejeté for rejete', () => {
    expect(reportStatusLabel('rejete')).toBe('Rejeté')
  })

  it('returns the key itself for unknown status', () => {
    expect(reportStatusLabel('pending')).toBe('pending')
  })
})

describe('categoryColor', () => {
  it('returns hex color for batiment_historique', () => {
    expect(categoryColor('batiment_historique')).toBe('#92400e')
  })

  it('returns hex color for edifice_religieux', () => {
    expect(categoryColor('edifice_religieux')).toBe('#1e40af')
  })

  it('returns hex color for mobilier_urbain', () => {
    expect(categoryColor('mobilier_urbain')).toBe('#065f46')
  })

  it('returns hex color for patrimoine_naturel', () => {
    expect(categoryColor('patrimoine_naturel')).toBe('#14532d')
  })

  it('returns hex color for autre', () => {
    expect(categoryColor('autre')).toBe('#78716c')
  })

  it('returns fallback gray for unknown category', () => {
    expect(categoryColor('unknown')).toBe('#78716c')
  })
})

describe('getInitials', () => {
  it('returns 2 uppercase initials for a full name', () => {
    expect(getInitials('Denis Moreau')).toBe('DM')
  })

  it('returns 1 initial for a single word name', () => {
    expect(getInitials('Marie')).toBe('M')
  })

  it('caps at 2 characters for a name with 3 words', () => {
    expect(getInitials('Jean Pierre Dupont')).toBe('JP')
  })

  it('uppercases lowercase input', () => {
    expect(getInitials('alice bob')).toBe('AB')
  })

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })
})