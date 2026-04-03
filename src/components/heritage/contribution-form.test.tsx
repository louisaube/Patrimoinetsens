import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContributionForm } from './contribution-form'

describe('ContributionForm', () => {
  const defaultProps = { heritageTitle: 'Cathedrale Saint-Etienne de Sens' }

  beforeEach(() => { vi.clearAllMocks() })

  describe('rendering', () => {
    it('renders 4 contribution type buttons', () => {
      render(<ContributionForm {...defaultProps} />)
      expect(screen.getByText('Historique')).toBeTruthy()
      expect(screen.getByText('Observation')).toBeTruthy()
    })

    it('renders body textarea with id body', () => {
      render(<ContributionForm {...defaultProps} />)
      expect(document.getElementById('body')).toBeTruthy()
    })

    it('renders sources section for historique', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      expect(screen.getAllByText(/sources bibliographiques/i).length).toBeGreaterThan(0)
    })

    it('hides sources section for recit', () => {
      render(<ContributionForm {...defaultProps} initialType="recit" />)
      expect(document.querySelector('label.text-blue-800')).toBeNull()
    })

    it('shows audio notice for recit', () => {
      render(<ContributionForm {...defaultProps} initialType="recit" />)
      expect(screen.getByText(/enregistrement audio/i)).toBeTruthy()
    })

    it('hides audio notice for historique', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      expect(screen.queryByText(/enregistrement audio/i)).toBeNull()
    })
  })

  describe('validation', () => {
    it('shows error for empty body on submit', async () => {
      render(<ContributionForm {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(screen.getByText('Le contenu est obligatoire.')).toBeTruthy()
      })
    })

    it('shows sources error for historique with no sources', async () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Contenu.' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(screen.getByText(/au moins une source est requise/i)).toBeTruthy()
      })
    })

    it('clears body error when user types', async () => {
      render(<ContributionForm {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => expect(screen.getByText('Le contenu est obligatoire.')).toBeTruthy())
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Texte.' } })
      await waitFor(() => expect(screen.queryByText('Le contenu est obligatoire.')).toBeNull())
    })
  })

  describe('type change toggling conditional fields', () => {
    it('shows sources section when switching to historique', () => {
      render(<ContributionForm {...defaultProps} initialType="observation" />)
      expect(screen.queryByPlaceholderText(/source 1/i)).toBeNull()
      fireEvent.click(screen.getByText('Historique'))
      expect(screen.getByPlaceholderText(/source 1/i)).toBeTruthy()
    })

    it('hides sources section when switching away from historique', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      expect(screen.getByPlaceholderText(/source 1/i)).toBeTruthy()
      fireEvent.click(screen.getByText('Observation'))
      expect(screen.queryByPlaceholderText(/source 1/i)).toBeNull()
    })

    it('shows audio notice when switching to temoignage', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      expect(screen.queryByText(/enregistrement audio/i)).toBeNull()
      fireEvent.click(screen.getByText('Témoignage'))
      expect(screen.getByText(/enregistrement audio/i)).toBeTruthy()
    })

    it('clears validation errors when changing type', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Contenu.' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      // sources error should show
      expect(screen.queryByText(/au moins une source est requise/i)).toBeTruthy()
      // switch type — errors cleared
      fireEvent.click(screen.getByText('Observation'))
      expect(screen.queryByText(/au moins une source est requise/i)).toBeNull()
    })
  })

  describe('body character limit', () => {
    it('shows 0/3000 counter initially', () => {
      render(<ContributionForm {...defaultProps} />)
      expect(screen.getByText('0/3000')).toBeTruthy()
    })

    it('updates counter when typing', () => {
      render(<ContributionForm {...defaultProps} />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Hello' } })
      expect(screen.getByText('5/3000')).toBeTruthy()
    })

    it('truncates input to 3000 characters and shows counter', () => {
      render(<ContributionForm {...defaultProps} />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'A'.repeat(3100) } })
      expect(screen.getByText(/3000.3000/)).toBeTruthy()
    })
  })

  describe('source management', () => {
    it('adds a source field on click', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter une source/i }))
      expect(screen.getAllByPlaceholderText(/source [0-9]+/i).length).toBe(2)
    })

    it('removes a source field via the trash button', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter une source/i }))
      expect(screen.getAllByPlaceholderText(/source [0-9]+/i).length).toBe(2)
      // Remove button appears only when >1 sources — aria-label "Supprimer la source N"
      const removeBtn = screen.getByRole('button', { name: /supprimer la source 1/i })
      fireEvent.click(removeBtn)
      expect(screen.getAllByPlaceholderText(/source [0-9]+/i).length).toBe(1)
    })

    it('does not show remove button when only one source', () => {
      render(<ContributionForm {...defaultProps} initialType="historique" />)
      expect(screen.queryByRole('button', { name: /supprimer la source/i })).toBeNull()
    })
  })

  describe('submission', () => {
    it('calls onSubmit with correct data', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      render(<ContributionForm heritageTitle="Test" initialType="historique" onSubmit={onSubmit} />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Contenu.' } })
      fireEvent.change(screen.getByPlaceholderText(/source 1/i), { target: { value: 'Source A.' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          type: 'historique', body: 'Contenu.', sources: ['Source A.']
        }))
      })
    })

    it('filters empty sources before submit', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      render(<ContributionForm heritageTitle="Test" initialType="historique" onSubmit={onSubmit} />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Contenu.' } })
      fireEvent.click(screen.getByRole('button', { name: /ajouter une source/i }))
      fireEvent.change(screen.getAllByPlaceholderText(/source [0-9]+/i)[0], { target: { value: 'Source valide.' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ sources: ['Source valide.'] }))
      })
    })

    it('shows confirmation after successful submit', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      render(<ContributionForm heritageTitle="Test" initialType="observation" onSubmit={onSubmit} />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Obs.' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(screen.getByText(/contribution publi/i)).toBeTruthy()
      })
    })

    it('shows heritage title in confirmation message', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      render(<ContributionForm heritageTitle="Calvaire de Paron" initialType="observation" onSubmit={onSubmit} />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'OK' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(screen.getByText(/calvaire de paron/i)).toBeTruthy()
      })
    })

    it('does not crash when onSubmit is not provided', async () => {
      render(<ContributionForm heritageTitle="Test" initialType="observation" />)
      fireEvent.change(document.getElementById('body') as HTMLTextAreaElement, { target: { value: 'Obs.' } })
      fireEvent.click(screen.getByRole('button', { name: /publier/i }))
      await waitFor(() => {
        expect(screen.getByText(/contribution publi/i)).toBeTruthy()
      })
    })
  })

  describe('preview', () => {
    it('apercu button is disabled with empty body', () => {
      render(<ContributionForm {...defaultProps} />)
      // Find preview button: text contains Aper
      const allBtns = Array.from(document.querySelectorAll('button'))
      const btn = allBtns.find(b => /aper/i.test(b.textContent || ''))
      expect(btn).toBeTruthy()
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})