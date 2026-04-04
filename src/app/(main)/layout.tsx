"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MapPin,
  Search,
  AlertTriangle,
  ClipboardList,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, getInitials } from "@/lib/utils"
import { OfflineBanner } from "@/components/ui/offline-banner"

const NAV_ITEMS = [
  {
    label: "Carte",
    href: "/map",
    icon: MapPin,
  },
  {
    label: "Explorer",
    href: "/",
    icon: Search,
  },
  {
    label: "Signaler",
    href: "/report",
    icon: AlertTriangle,
  },
  {
    label: "Profil",
    href: "/profile",
    icon: User,
  },
] as const

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.FC<{ className?: string }>
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
        active
          ? "text-emerald-700"
          : "text-stone-500 hover:text-stone-800"
      )}
    >
      <Icon
        className={cn(
          "size-5 transition-colors",
          active ? "text-emerald-700" : "text-stone-400"
        )}
      />
      <span>{label}</span>
    </Link>
  )
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const userInitials = user?.name
    ? getInitials(user.name)
    : user?.email?.slice(0, 2).toUpperCase() ?? "U"

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <OfflineBanner />
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-stone-200 md:bg-white md:shadow-sm">
        {/* Logo */}
        <div className="border-b border-stone-100 px-4 py-5">
          <Link href="/" className="block">
            <h1 className="font-serif text-lg font-bold text-stone-800 leading-tight">
              Patrimoine
            </h1>
            <p className="font-serif text-lg font-bold text-emerald-700 leading-tight">
              &amp; Sens
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                <item.icon
                  className={cn(
                    "size-4",
                    isActive ? "text-emerald-700" : "text-stone-400"
                  )}
                />
                {item.label}
              </Link>
            )
          })}

          {/* Séparateur + liens secondaires (desktop uniquement) */}
          <div className="pt-1">
            <div className="my-1 h-px bg-stone-100" />
            {(() => {
              const isActive = pathname.startsWith("/armorial")
              return (
                <Link
                  href="/armorial"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  )}
                >
                  <Shield
                    className={cn("size-4", isActive ? "text-emerald-700" : "text-stone-400")}
                  />
                  Armorial d&apos;Hozier
                </Link>
              )
            })()}
            {(() => {
              const isActive = pathname.startsWith("/reports")
              return (
                <Link
                  href="/reports"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-red-50 text-red-800"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  )}
                >
                  <ClipboardList
                    className={cn("size-4", isActive ? "text-red-600" : "text-stone-400")}
                  />
                  Tous les signalements
                </Link>
              )
            })()}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-stone-100 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-all">
                <Avatar className="size-7">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name ?? ""} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="truncate font-medium text-xs">
                    {user?.name ?? user?.email ?? "Utilisateur"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="flex items-center gap-2 w-full">
                  <Settings className="size-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void signOut()}>
                <LogOut className="size-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Zone principale */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 shadow-sm md:hidden">
          <Link href="/">
            <h1 className="font-serif text-base font-bold text-stone-800">
              Patrimoine <span className="text-emerald-700">&amp; Sens</span>
            </h1>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name ?? ""} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.name ?? user?.email ?? "Utilisateur"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="flex items-center gap-2 w-full">
                  <Settings className="size-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void signOut()}>
                <LogOut className="size-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>

        {/* Bottom nav mobile */}
        <nav className="fixed bottom-0 inset-x-0 z-40 flex border-t border-stone-200 bg-white md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <div key={item.href} className="flex-1 flex justify-center">
                <NavItem
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive}
                />
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
