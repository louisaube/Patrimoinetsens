"use client"

import * as React from "react"
import { Locate } from "lucide-react"
import type { Map as MapLibreMap } from "maplibre-gl"
import type { MapMarker } from "@/types"
import { categoryColor, categoryLabel } from "@/lib/utils"
import { TimeSlider, EPOCHS } from "./time-slider"

interface HeritageMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
  className?: string
  /** Activer le voyage dans le temps (couches historiques) */
  enableTimeLayers?: boolean
}

// Popup affiché au clic sur un marqueur
interface MarkerPopup {
  marker: MapMarker
  x: number
  y: number
}

// ─── Couches historiques WMTS (IGN Géoplateforme — accès libre) ─────────────
const IGN_WMTS_BASE = "https://data.geopf.fr/wmts"

function ignWmtsTileUrl(layer: string, format: string, tileMatrixSet: string): string {
  return (
    `${IGN_WMTS_BASE}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0` +
    `&LAYER=${layer}&STYLE=normal&FORMAT=${encodeURIComponent(format)}` +
    `&TILEMATRIXSET=${tileMatrixSet}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`
  )
}

const HISTORICAL_TILE_SOURCES: Record<string, { url: string; maxzoom: number }> = {
  cassini: {
    url: ignWmtsTileUrl("GEOGRAPHICALGRIDSYSTEMS.CASSINI", "image/jpeg", "PM"),
    maxzoom: 14,
  },
  etatmajor: {
    url: ignWmtsTileUrl("GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40", "image/jpeg", "PM"),
    maxzoom: 15,
  },
}

// ─── Plans archéologiques géoréférencés (images à superposer) ───────────────
// Coordonnées des 4 coins estimées par triangulation :
// Forum (48.1975, 3.2840), Amphithéâtre (48.1960, 3.2915),
// Sainte-Colombe (48.206, 3.275), Motte du Ciar (48.185, 3.284)
// Format MapLibre : [topLeft, topRight, bottomRight, bottomLeft] en [lng, lat]
interface ImageOverlayConfig {
  url: string
  coordinates: [[number, number], [number, number], [number, number], [number, number]]
  label: string
}

const ARCHAEOLOGICAL_PLANS: Record<string, ImageOverlayConfig> = {
  roman: {
    url: "/data/plans/agedincum-restitution-trame-urbaine.jpg",
    label: "Restitution de la trame urbaine antique (Gallia 72-1, fig. 4)",
    coordinates: [
      [3.2615, 48.2105],  // top-left (NW) — au-dessus de Sainte-Colombe
      [3.3005, 48.2105],  // top-right (NE) — est de l'amphithéâtre
      [3.3005, 48.1790],  // bottom-right (SE) — sud de la Motte du Ciar
      [3.2615, 48.1790],  // bottom-left (SW) — ouest du temple
    ],
  },
  medieval: {
    url: "/data/plans/agedincum-decouvertes-bas-empire.jpg",
    label: "Découvertes du Bas-Empire et enceinte (Gallia 72-1, fig. 9)",
    coordinates: [
      [3.2615, 48.2105],
      [3.3005, 48.2105],
      [3.3005, 48.1790],
      [3.2615, 48.1790],
    ],
  },
}

// ─── Couleurs pour les couches GeoJSON archéologiques ───────────────────────
const GEOJSON_STYLES = {
  axe: { color: "#dc2626", width: 3, dasharray: [6, 4] },
  enceinte: { color: "#b45309", width: 2.5, fillColor: "rgba(180, 83, 9, 0.08)" },
  monument: { color: "#7c3aed", radius: 8 },
  porte: { color: "#dc2626", radius: 6 },
  voie: { color: "#ea580c", width: 2, dasharray: [8, 6] },
  infrastructure: { color: "#0284c7", width: 2, dasharray: [4, 4] },
} as const

export function HeritageMap({
  markers,
  center = [3.2837, 48.1977],
  zoom = 14,
  onMarkerClick,
  className = "",
  enableTimeLayers = false,
}: HeritageMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<MapLibreMap | null>(null)
  const [popup, setPopup] = React.useState<MarkerPopup | null>(null)
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const [geolocating, setGeolocating] = React.useState(false)

  // Time travel state
  const [epoch, setEpoch] = React.useState("today")
  const [overlayOpacity, setOverlayOpacity] = React.useState(70)

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

        // ── Ajout des sources WMTS historiques (toujours présentes, opacité 0) ──
        if (enableTimeLayers) {
          for (const [key, src] of Object.entries(HISTORICAL_TILE_SOURCES)) {
            map!.addSource(`hist-${key}`, {
              type: "raster",
              tiles: [src.url],
              tileSize: 256,
              maxzoom: src.maxzoom,
              attribution: "© IGN — Géoplateforme",
            })
            map!.addLayer({
              id: `hist-layer-${key}`,
              type: "raster",
              source: `hist-${key}`,
              paint: { "raster-opacity": 0 },
            })
          }
        }

        // ── Marqueurs patrimoine ────────────────────────────────────────────
        markers.forEach((marker) => {
          // Conteneur invisible avec zone de hit stable (évite le flicker hover)
          const el = document.createElement("div")
          el.className = "heritage-marker"
          el.style.cssText = `
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          `
          // Pin visible à l'intérieur
          const pin = document.createElement("div")
          pin.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            background-color: ${categoryColor(marker.category)};
            transition: transform 0.15s ease;
            pointer-events: none;
          `
          el.appendChild(pin)

          el.addEventListener("mouseenter", () => {
            pin.style.transform = "rotate(-45deg) scale(1.15)"
          })
          el.addEventListener("mouseleave", () => {
            pin.style.transform = "rotate(-45deg) scale(1)"
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

  // ── Synchroniser l'époque sélectionnée avec les couches de la carte ───────
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded || !enableTimeLayers) return

    const opacity = overlayOpacity / 100

    // Couches raster WMTS (Cassini, État-major)
    for (const key of Object.keys(HISTORICAL_TILE_SOURCES)) {
      const layerId = `hist-layer-${key}`
      if (!map.getLayer(layerId)) continue
      map.setPaintProperty(layerId, "raster-opacity", epoch === key ? opacity : 0)
    }

    // Plans archéologiques géoréférencés (images Gallia)
    for (const [planEpoch, config] of Object.entries(ARCHAEOLOGICAL_PLANS)) {
      const sourceId = `plan-${planEpoch}`
      const layerId = `plan-layer-${planEpoch}`
      const visible = epoch === planEpoch

      if (visible && !map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "image",
          url: config.url,
          coordinates: config.coordinates,
        })
        map.addLayer(
          {
            id: layerId,
            type: "raster",
            source: sourceId,
            paint: { "raster-opacity": opacity * 0.85 },
          },
          // Insérer sous les couches GeoJSON (qui seront ajoutées après)
          map.getLayer(`geo-${planEpoch}-lines`) ? `geo-${planEpoch}-lines` : undefined,
        )
      } else if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, "raster-opacity", visible ? opacity * 0.85 : 0)
      }
    }

    // Couches GeoJSON archéologiques (tracés vectoriels par-dessus les plans)
    const geojsonEpochs = ["roman", "medieval"] as const
    for (const geoEpoch of geojsonEpochs) {
      const visible = epoch === geoEpoch
      const sourceId = `geo-${geoEpoch}`

      if (visible && !map.getSource(sourceId)) {
        // Charger le GeoJSON à la demande
        const file = geoEpoch === "roman" ? "agedincum-roman.geojson" : "sens-medieval.geojson"
        fetch(`/data/${file}`)
          .then((r) => r.json())
          .then((data) => {
            if (map.getSource(sourceId)) return // déjà ajouté

            map.addSource(sourceId, { type: "geojson", data })

            // Lignes (axes, voies, infrastructure)
            map.addLayer({
              id: `${sourceId}-lines`,
              type: "line",
              source: sourceId,
              filter: ["in", ["get", "type"], ["literal", ["axe", "voie", "infrastructure"]]],
              paint: {
                "line-color": [
                  "match", ["get", "type"],
                  "axe", GEOJSON_STYLES.axe.color,
                  "voie", GEOJSON_STYLES.voie.color,
                  "infrastructure", GEOJSON_STYLES.infrastructure.color,
                  "#666",
                ],
                "line-width": 3,
                "line-dasharray": [6, 4],
                "line-opacity": opacity,
              },
            })

            // Polygones (enceinte, forum)
            map.addLayer({
              id: `${sourceId}-fills`,
              type: "fill",
              source: sourceId,
              filter: ["==", ["geometry-type"], "Polygon"],
              paint: {
                "fill-color": [
                  "match", ["get", "type"],
                  "enceinte", GEOJSON_STYLES.enceinte.fillColor,
                  "monument", "rgba(124, 58, 237, 0.1)",
                  "rgba(100,100,100,0.05)",
                ],
                "fill-opacity": opacity,
              },
            })

            // Contours polygones
            map.addLayer({
              id: `${sourceId}-outlines`,
              type: "line",
              source: sourceId,
              filter: ["==", ["geometry-type"], "Polygon"],
              paint: {
                "line-color": [
                  "match", ["get", "type"],
                  "enceinte", GEOJSON_STYLES.enceinte.color,
                  "monument", GEOJSON_STYLES.monument.color,
                  "#666",
                ],
                "line-width": 2.5,
                "line-dasharray": [4, 3],
                "line-opacity": opacity,
              },
            })

            // Points (monuments, portes)
            map.addLayer({
              id: `${sourceId}-points`,
              type: "circle",
              source: sourceId,
              filter: ["==", ["geometry-type"], "Point"],
              paint: {
                "circle-radius": [
                  "match", ["get", "type"],
                  "monument", 8,
                  "porte", 6,
                  6,
                ],
                "circle-color": [
                  "match", ["get", "type"],
                  "monument", GEOJSON_STYLES.monument.color,
                  "porte", GEOJSON_STYLES.porte.color,
                  "#666",
                ],
                "circle-opacity": opacity,
                "circle-stroke-width": 2,
                "circle-stroke-color": "white",
                "circle-stroke-opacity": opacity,
              },
            })

            // Labels
            map.addLayer({
              id: `${sourceId}-labels`,
              type: "symbol",
              source: sourceId,
              layout: {
                "text-field": ["get", "name"],
                "text-size": 11,
                "text-offset": [0, 1.2],
                "text-anchor": "top",
                "text-font": ["Open Sans Regular"],
              },
              paint: {
                "text-color": "#1e293b",
                "text-halo-color": "white",
                "text-halo-width": 1.5,
                "text-opacity": opacity,
              },
            })
          })
          .catch(() => {})
      } else if (map.getSource(sourceId)) {
        // Ajuster la visibilité des couches existantes
        const layerSuffixes = ["-lines", "-fills", "-outlines", "-points", "-labels"]
        for (const suffix of layerSuffixes) {
          const layerId = `${sourceId}${suffix}`
          if (!map.getLayer(layerId)) continue
          const paintProp = suffix === "-lines" || suffix === "-outlines"
            ? "line-opacity"
            : suffix === "-fills"
              ? "fill-opacity"
              : suffix === "-points"
                ? "circle-opacity"
                : "text-opacity"
          map.setPaintProperty(layerId, paintProp, visible ? opacity : 0)

          // Stroke opacity pour les cercles
          if (suffix === "-points") {
            map.setPaintProperty(layerId, "circle-stroke-opacity", visible ? opacity : 0)
          }
        }
      }
    }
  }, [epoch, overlayOpacity, mapLoaded, enableTimeLayers])

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
        <Locate className={`size-4 ${geolocating ? "animate-pulse text-blue-700" : ""}`} />
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
              className="mt-2 block w-full rounded-lg bg-blue-800 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-900 transition-colors"
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

      {/* Time slider */}
      {enableTimeLayers && mapLoaded && (
        <TimeSlider
          value={epoch}
          onChange={setEpoch}
          opacity={overlayOpacity}
          onOpacityChange={setOverlayOpacity}
        />
      )}
    </div>
  )
}
