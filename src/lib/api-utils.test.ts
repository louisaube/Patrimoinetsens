import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Simule la fonction auth() d'Auth.js (src/lib/auth.ts)
const mockAuth = vi.fn()

vi.mock('@/lib/auth', () => ({
  auth: mockAuth,
}))

// requireAuth retourne AuthUser | NextResponse (résout toujours, ne rejette pas)
describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne l\'utilisateur authentifié quand la session est valide', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'u-1', email: 'marie@example.com', name: 'Marie' },
    })
    const { requireAuth } = await import('./api-utils')
    const result = await requireAuth()
    expect(result).toEqual({ id: 'u-1', email: 'marie@example.com', name: 'Marie' })
  })

  it('retourne une NextResponse 401 lorsque la session est null', async () => {
    mockAuth.mockResolvedValue(null)
    const { requireAuth } = await import('./api-utils')
    const result = await requireAuth()
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(401)
  })

  it('retourne une NextResponse 401 lorsque session.user est absent', async () => {
    mockAuth.mockResolvedValue({})
    const { requireAuth } = await import('./api-utils')
    const result = await requireAuth()
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(401)
  })

  it('retourne une NextResponse 401 lorsque session.user.id est absent', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } })
    const { requireAuth } = await import('./api-utils')
    const result = await requireAuth()
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(401)
  })

  it('retourne uniquement id, email, name (pas de données sensibles supplémentaires)', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'u-2', email: 'denis@example.com', name: 'Denis', image: 'https://example.com/avatar.jpg' },
    })
    const { requireAuth } = await import('./api-utils')
    const result = await requireAuth()
    // Vérifie que les clés sont exactement celles attendues (pas d'image, pas d'autres champs sensibles)
    expect(Object.keys(result as object).sort()).toEqual(['email', 'id', 'name'])
  })
})

// requireOwner est synchrone et retourne NextResponse | null
describe('requireOwner', () => {
  it('retourne null si resourceUserId === sessionUserId', async () => {
    const { requireOwner } = await import('./api-utils')
    const result = requireOwner('u-abc', 'u-abc')
    expect(result).toBeNull()
  })

  it('retourne une NextResponse 403 si resourceUserId !== sessionUserId', async () => {
    const { requireOwner } = await import('./api-utils')
    const result = requireOwner('u-abc', 'u-xyz')
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(403)
  })

  it('retourne une NextResponse 403 si resourceUserId est vide', async () => {
    const { requireOwner } = await import('./api-utils')
    const result = requireOwner('', 'u-xyz')
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(403)
  })

  it('retourne une NextResponse 403 si sessionUserId est vide', async () => {
    const { requireOwner } = await import('./api-utils')
    const result = requireOwner('u-abc', '')
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(403)
  })

  it('est sensible à la casse (IDs diffèrent par casse = 403)', async () => {
    const { requireOwner } = await import('./api-utils')
    const result = requireOwner('U-ABC', 'u-abc')
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(403)
  })
})

// isAuthError distingue AuthUser d'une NextResponse
describe('isAuthError', () => {
  it('retourne true pour une NextResponse', async () => {
    const { isAuthError } = await import('./api-utils')
    const response = NextResponse.json({ error: 'test' }, { status: 401 })
    expect(isAuthError(response)).toBe(true)
  })

  it('retourne false pour un AuthUser', async () => {
    const { isAuthError } = await import('./api-utils')
    const user = { id: 'u-1', email: 'test@example.com', name: 'Test' }
    expect(isAuthError(user)).toBe(false)
  })
})
