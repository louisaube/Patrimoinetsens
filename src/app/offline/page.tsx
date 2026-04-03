import Link from "next/link"
import { WifiOff, MapPin, AlertTriangle } from "lucide-react"

// Page affichée par le Service Worker quand la navigation échoue hors-ligne
// et que la page demandée n'est pas en cache.

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stone-50 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-stone-200">
        <WifiOff className="size-10 text-stone-500" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-bold text-stone-800">
          Vous êtes hors-ligne
        </h1>
        <p className="text-stone-500 max-w-xs mx-auto">
          Cette page n&apos;est pas disponible sans connexion.
          Les pages déjà visitées restent accessibles.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/map"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800 transition-colors"
        >
          <MapPin className="size-4" />
          Carte (hors-ligne)
        </Link>
        <Link
          href="/report"
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
        >
          <AlertTriangle className="size-4" />
          Signaler (hors-ligne)
        </Link>
      </div>

      <p className="text-xs text-stone-400">
        Vos actions seront synchronisées à la reconnexion.
      </p>
    </div>
  )
}
