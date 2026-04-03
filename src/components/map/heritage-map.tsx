"use client"

import * as React from "react"
import { Locate } from "lucide-react"
import type { Map as MapLibreMap } from "maplibre-gl"
import type { MapMarker } from "@/types"
import { categoryColor, categoryLabel } from "@/lib/utils"

interface HeritageMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
  className?: string
}

// Popup affiché au clic sur un marqueur
interface MarkerPopup {
  marker: MapMarker
  x: number
  y: number
}

export function HeritageMap({
  markers,
  center = [3.2837, 48.1977],
  zoom = 14,
  onMarkerClick,
  className = "",
}: HeritageMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<MapLibreMap | null>(null)
  const [popup, setPopup] = React.useState<MarkerPopup | null>(null)
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const [geolocating, setGeolocating] = React.useState(false)

  React.useEffect(() => {
    if (!mapContainerRef.current) return

    let map: MapLibreMap | null = null

    async function initMap() {
      const maplibregl = (await import("maplibre-gl")).default
      await import("maplibre-gl/dist/maplibre-gl.css")

      map = new maplibregl.Map({
        container: mapContainerRef.current!,
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
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center,
        zoom,
      })

      mapRef.current = map

      map.on("load", () => {
        setMapLoaded(true)

        // Ajout des marqueurs
        markers.forEach((marker) => {
          const el = document.createElement("div")
          el.className = "heritage-marker"
          el.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            background-color: ${categoryColor(marker.category)};
            transition: transform 0.15s ease;
          `

          el.addEventListener("mouseenter", () => {
            el.style.transform = "rotate(-45deg) scale(1.15)"
          })
          el.addEventListener("mouseleave", () => {
            el.style.transform = "rotate(-45deg) scale(1)"
          })

          el.addEventListener("click", (e) => {
            e.stopPropagation()
            const point = map!.project([marker.longitude, marker.latitude])
            setPopup({ marker, x: point.x, y: point.y })
            onMarkerClick?.(marker)
          })

          new maplibregl.Marker({ element: el })
            .setLngLat([marker.longitude, marker.latitude])
            .addTo(map!)
        })
      })

      map.on("click", () => setPopup(null))
      map.on("move", () => {
        setPopup((prev) => {
          if (!prev || !map) return null
          const point = map.project([prev.marker.longitude, prev.marker.latitude])
          return { ...prev, x: point.x, y: point.y }
        })
      })
    }

    void initMap()

    return () => {
      map?.remove()
      mapRef.current = null
      setMapLoaded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGeolocate = () => {
    if (!mapRef.current || !navigator.geolocation) return
    setGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 16,
        })
        setGeolocating(false)
      },
      () => setGeolocating(false),
      { timeout: 8000 }
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur carte */}
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Loader */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="text-stone-500 text-sm animate-pulse">
            Chargement de la carte…
          </div>
        </div>
      )}

      {/* Bouton géolocalisation */}
      <button
        onClick={handleGeolocate}
        disabled={geolocating}
        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-lg bg-white shadow-md border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-60"
        title="Centrer sur ma position"
      >
        <Locate className={`size-4 ${geolocating ? "animate-pulse text-emerald-600" : ""}`} />
      </button>

      {/* Popup marqueur */}
      {popup && (
        <div
          className="absolute z-20 min-w-[200px] -translate-x-1/2 -translate-y-full"
          style={{ left: popup.x, top: popup.y - 36 }}
        >
          <div className="rounded-xl bg-white shadow-lg border border-stone-200 p-3">
            <p className="font-semibold text-sm text-stone-800 leading-tight">
              {popup.marker.title}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {categoryLabel(popup.marker.category)}
            </p>
            <a
              href={`/heritage/${popup.marker.id}`}
              className="mt-2 block w-full rounded-lg bg-emerald-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-emerald-800 transition-colors"
            >
              Voir la fiche →
            </a>
          </div>
          {/* Flèche */}
          <div className="mx-auto mt-0 h-2 w-4 overflow-hidden">
            <div className="h-3 w-3 rotate-45 bg-white border-r border-b border-stone-200 mx-auto -mt-1.5" />
          </div>
        </div>
      )}
    </div>
  )
}
