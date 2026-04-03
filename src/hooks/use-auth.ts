"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import type { UserProfile } from "@/types"

export interface UseAuthReturn {
  user: UserProfile | null
  loading: boolean
  signIn: typeof signIn
  signOut: typeof signOut
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()

  const user: UserProfile | null = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? "",
        email: session.user.email ?? "",
        name: session.user.name ?? undefined,
        avatarUrl: session.user.image ?? undefined,
      }
    : null

  return {
    user,
    loading: status === "loading",
    signIn,
    signOut,
  }
}
