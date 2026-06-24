"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LOCATIONS, REGIONS } from "@/lib/mock";
import type { MapLocation } from "@/lib/types";
import { cn } from "@/lib/utils";

const SV_CENTER: [number, number] = [-88.9, 13.8];
const SV_ZOOM = 8;

/** Color de marcador según el tipo de lugar. */
const KIND_COLOR: Record<MapLocation["kind"], string> = {
  hub: "#3B54E8", // cobalto
  gallery: "#C2410C", // terracotta
  studio: "#B7791F", // gold
  landmark: "#0E1B2C", // navy
};

const KIND_LABEL: Record<MapLocation["kind"], string> = {
  hub: "Hub",
  gallery: "Galería",
  studio: "Estudio",
  landmark: "Sitio",
};

type RegionFilter = (typeof REGIONS)[number] | "Todas";

function CulturalMapInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const [region, setRegion] = useState<RegionFilter>("Todas");
  const [ready, setReady] = useState(false);

  // Inicializa el mapa una sola vez (solo en cliente).
  useEffect(() => {
    let map: MapLibreMap | null = null;
    let cancelled = false;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current) return;

      map = new maplibregl.Map({
        container: containerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: SV_CENTER,
        zoom: SV_ZOOM,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({}), "top-right");

      const addMarkers = () => {
        for (const loc of LOCATIONS) {
          const popup = new maplibregl.Popup({ offset: 18 }).setHTML(
            `<div style="font-family:system-ui;max-width:220px">
              <strong style="display:block;color:#0E1B2C">${loc.name}</strong>
              <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#3B54E8;margin:2px 0">${KIND_LABEL[loc.kind]} · ${loc.region}</span>
              <span style="font-size:13px;color:#334155">${loc.description}</span>
            </div>`,
          );
          const marker = new maplibregl.Marker({ color: KIND_COLOR[loc.kind] })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(popup)
            .addTo(map as MapLibreMap);
          // guardamos la región para poder filtrar después
          (marker.getElement() as HTMLElement).dataset.region = loc.region;
          markersRef.current.push(marker);
        }
        setReady(true);
      };

      map.on("load", addMarkers);
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Filtra marcadores visibles y reencuadra según la región elegida.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => {
      const el = m.getElement() as HTMLElement;
      const visible = region === "Todas" || el.dataset.region === region;
      el.style.display = visible ? "" : "none";
    });

    if (region === "Todas") {
      map.flyTo({ center: SV_CENTER, zoom: SV_ZOOM, duration: 800 });
      return;
    }
    const match = LOCATIONS.find((l) => l.region === region);
    if (match) {
      map.flyTo({ center: [match.lng, match.lat], zoom: 10, duration: 800 });
    }
  }, [region, ready]);

  const filters: RegionFilter[] = ["Todas", ...REGIONS];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por región">
        {filters.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            aria-pressed={region === r}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              region === r
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface hover:bg-surface-muted",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="h-[70vh] w-full overflow-hidden rounded-xl border border-border shadow-e1"
        role="application"
        aria-label="Mapa cultural interactivo de El Salvador"
      />

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(Object.keys(KIND_COLOR) as MapLocation["kind"][]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: KIND_COLOR[k] }}
            />
            {KIND_LABEL[k]}
          </span>
        ))}
      </div>
    </div>
  );
}

// maplibre toca window → montar sólo en cliente.
export const CulturalMap = dynamic(() => Promise.resolve(CulturalMapInner), {
  ssr: false,
});
