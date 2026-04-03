"use client"

import * as React from "react"
import { AlertTriangle, Upload, MapPin, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, severityColor } from "@/lib/utils"
import { useCreateReport } from "@/hooks/use-reports"
import { useHeritageList } from "@/hooks/use-heritage"
import { useToast } from "@/components/ui/toast"
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl"
import type { ReportType, ReportSeverity } from "@/types"

// ─── Mini-carte cliquable ────────────────────────────────────────────────────

interface ClickableMapProps {
  pin: { lat: number; lng: number } | null
  onPinSet: (lat: number, lng: number) => void
}

function ClickableMap({ pin, onPinSet }: ClickableMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<MapLibreMap | null>(null)
  const markerRef = React.useRef<MapLibreMarker | null>(null)

  React.useEffect(() => {
    if (!containerRef.current) return

    let map: MapLibreMap | null = null

    async function initMap() {
      const maplibregl = (await import("maplibre-gl")).default
      await import("maplibre-gl/dist/maplibre-gl.css")

      map = new maplibregl.Map({
        container: containerRef.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: [3.2837, 48.1977],
        zoom: 13,
      })

      mapRef.current = map

      map.on("click", (e) => {
        const { lat, lng } = e.lngLat
        onPinSet(lat, lng)

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat])
        } else {
          markerRef.current = new maplibregl.Marker({ color: "#dc2626" })
            .setLngLat([lng, lat])
            .addTo(map!)
        }
      })
    }

    void initMap()

    return () => {
      map?.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-stone-200">
      <div ref={containerRef} className="absolute inset-0" />
      {!pin && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
          <div className="rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
            Cliquez sur la carte pour placer le signalement
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page signalement ────────────────────────────────────────────────────────

interface FormState {
  type: ReportType
  description: string
  severity: ReportSeverity
  pin: { lat: number; lng: number } | null
  photos: File[]
  heritageItemId: string | null
}

const SEVERITY_LABELS: Record<ReportSeverity, string> = {
  faible: "Faible — signalement informatif",
  moyen: "Moyen — attention requise",
  urgent: "Urgent — intervention à prévoir",
  critique: "Critique — danger immédiat",
}

export default function ReportPage() {
  const [form, setForm] = React.useState<FormState>({
    type: "degradation",
    description: "",
    severity: "moyen",
    pin: null,
    photos: [],
    heritageItemId: null,
  })
  const [dragOver, setDragOver] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const { loading: submitting, mutate: createReport } = useCreateReport()
  const { data: heritageList, loading: heritageLoading } = useHeritageList()
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    )
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files].slice(0, 5) }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files].slice(0, 5) }))
  }

  const removePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pin) {
      toast({
        title: "Position requise",
        description: "Placez le signalement sur la carte avant d'envoyer.",
        variant: "destructive",
      })
      return
    }
    const success = await createReport({
      reportType: form.type,
      description: form.description,
      severity: form.severity,
      latitude: form.pin.lat,
      longitude: form.pin.lng,
      ...(form.heritageItemId ? { heritageItemId: form.heritageItemId } : {}),
    })
    if (success) {
      toast({
        title: "Signalement envoyé",
        description: "Votre signalement sera traité prochainement.",
        variant: "success",
      })
      setSubmitted(true)
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le signalement. Réessayez.",
        variant: "destructive",
      })
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-8 text-emerald-700" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-stone-800">
            Signalement envoyé
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Merci pour votre contribution. Votre signalement sera traité prochainement.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="mt-2"
        >
          Nouveau signalement
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 pb-24 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-red-100">
          <AlertTriangle className="size-5 text-red-600" />
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold text-stone-800">
            Signaler un problème
          </h1>
          <p className="text-sm text-stone-500">
            Dégradation, danger ou disparition
          </p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {/* Type */}
        <div className="space-y-2">
          <label htmlFor="report-type" className="block text-sm font-medium text-stone-700">
            Type de signalement
          </label>
          <Select
            id="report-type"
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, type: e.target.value as ReportType }))
            }
          >
            <option value="degradation">Dégradation</option>
            <option value="danger">Danger</option>
            <option value="disparition">Disparition</option>
          </Select>
        </div>

        {/* Sévérité */}
        <div className="space-y-2">
          <label htmlFor="report-severity" className="block text-sm font-medium text-stone-700">
            Sévérité
          </label>
          <Select
            id="report-severity"
            value={form.severity}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                severity: e.target.value as ReportSeverity,
              }))
            }
          >
            {(["faible", "moyen", "urgent", "critique"] as ReportSeverity[]).map(
              (s) => (
                <option key={s} value={s}>
                  {SEVERITY_LABELS[s]}
                </option>
              )
            )}
          </Select>
          <Badge
            variant="outline"
            className={cn("text-xs", severityColor(form.severity))}
          >
            {form.severity.charAt(0).toUpperCase() + form.severity.slice(1)}
          </Badge>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-stone-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            placeholder="Décrivez le problème constaté avec précision (localisation, état, urgence…)"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={5}
            required
          />
        </div>

        {/* Photos */}
        <div className="space-y-2">
          <label htmlFor="report-photos" className="block text-sm font-medium text-stone-700">
            Photos{" "}
            <span className="text-stone-400 font-normal">
              (max 5, optionnel)
            </span>
          </label>

          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 opacity-60 cursor-not-allowed"
            aria-disabled="true"
          >
            <Upload className="size-6 text-stone-300" />
            <p className="text-sm text-stone-400">
              Upload de photos disponible prochainement (V1.1)
            </p>
          </div>

          <input
            ref={fileInputRef}
            id="report-photos"
            type="file"
            accept="image/*"
            multiple
            disabled
            className="sr-only"
            onChange={handleFileChange}
          />

          {/* Aperçu photos */}
          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.photos.map((file, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Photo ${i + 1}`}
                    className="size-16 rounded-lg object-cover border border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label={`Supprimer la photo ${i + 1}`}
                    className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Position GPS */}
        <div role="group" aria-labelledby="label-position-gps" className="space-y-2">
          <p id="label-position-gps" className="block text-sm font-medium text-stone-700">
            Position GPS{" "}
            <span className="text-stone-400 font-normal">(optionnel)</span>
          </p>
          <ClickableMap
            pin={form.pin}
            onPinSet={(lat, lng) => setForm((prev) => ({ ...prev, pin: { lat, lng } }))}
          />
          {form.pin && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-700">
              <MapPin className="size-3.5" />
              Position : {form.pin.lat.toFixed(5)}, {form.pin.lng.toFixed(5)}
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, pin: null }))}
                className="ml-2 text-stone-400 hover:text-stone-600 underline"
              >
                Effacer
              </button>
            </p>
          )}
        </div>

        {/* Lier à un élément patrimonial */}
        <div className="space-y-2">
          <label htmlFor="heritage-item" className="block text-sm font-medium text-stone-700">
            Lier à un élément patrimonial{" "}
            <span className="text-stone-400 font-normal">(optionnel)</span>
          </label>
          <Select
            id="heritage-item"
            value={form.heritageItemId ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                heritageItemId: e.target.value || null,
              }))
            }
            disabled={heritageLoading}
          >
            <option value="">— Aucun élément lié —</option>
            {heritageList?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </Select>
        </div>

        {/* Soumettre */}
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white h-11"
          disabled={submitting || !form.description.trim() || !form.pin}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <AlertTriangle className="size-4 mr-2" />
              Envoyer le signalement
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
