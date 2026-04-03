"use client"

import * as React from "react"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getInitials } from "@/lib/utils"

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  const initials = user?.name
    ? getInitials(user.name)
    : user?.email?.slice(0, 2).toUpperCase() ?? "U"

  return (
    <div className="mx-auto max-w-xl px-4 py-6 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-stone-100">
          <User className="size-5 text-stone-600" />
        </div>
        <h1 className="font-serif text-xl font-bold text-stone-800">Mon profil</h1>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarImage src={user?.avatarUrl} alt={user?.name ?? ""} />
            <AvatarFallback className="bg-emerald-100 text-emerald-800 text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-stone-800 truncate">
              {user?.name ?? "Utilisateur"}
            </p>
            <p className="text-sm text-stone-500 truncate">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Statistiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Contributions</span>
            <span className="font-medium text-stone-800">0</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Signalements</span>
            <span className="font-medium text-stone-800">0</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Fiches créées</span>
            <span className="font-medium text-stone-800">0</span>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => void signOut()}
      >
        <LogOut className="size-4 mr-2" />
        Se déconnecter
      </Button>
    </div>
  )
}
