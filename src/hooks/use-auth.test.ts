import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

// Contrôle de useSession via le mock next-auth/react.
// signIn et signOut sont des fonctions mockées stables réutilisées dans tous les tests.
const mockSignIn = vi.fn()
const mockSignOut = vi.fn()
const mockUseSession = vi.fn()

vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
  signIn: mockSignIn,
  signOut: mockSignOut,
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null user when session is null (unauthenticated)', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
  })

  it('returns loading true when status is loading', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(true)
  })

  it('returns loading false when status is authenticated', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'u-1', email: 'marie@example.com', name: 'Marie', image: null } },
      status: 'authenticated',
    })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(false)
  })

  it('returns loading false when status is unauthenticated', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(false)
  })

  it('maps session user to UserProfile correctly', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'u-42',
          email: 'denis@example.com',
          name: 'Denis Moreau',
          image: 'https://example.com/avatar.jpg',
        },
      },
      status: 'authenticated',
    })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toEqual({
      id: 'u-42',
      email: 'denis@example.com',
      name: 'Denis Moreau',
      avatarUrl: 'https://example.com/avatar.jpg',
    })
  })

  it('falls back to empty string when id is missing from session', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'anon@example.com', name: null, image: null } },
      status: 'authenticated',
    })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.user?.id).toBe('')
    expect(result.current.user?.email).toBe('anon@example.com')
  })

  it('maps null name to undefined in UserProfile', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'u-5', email: 'claire@example.com', name: null, image: null } },
      status: 'authenticated',
    })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.user?.name).toBeUndefined()
  })

  it('maps null image to undefined in UserProfile (avatarUrl)', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'u-6', email: 'claire@example.com', name: 'Claire', image: null } },
      status: 'authenticated',
    })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.user?.avatarUrl).toBeUndefined()
  })

  it('exposes signIn from next-auth/react', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.signIn).toBe(mockSignIn)
  })

  it('exposes signOut from next-auth/react', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
    const { useAuth } = await import('./use-auth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.signOut).toBe(mockSignOut)
  })
})
