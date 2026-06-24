"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Minus, Plus, Home } from "lucide-react";
import type { Artwork } from "@/lib/types";

function DeepZoomViewerInner({ artwork }: { artwork: Artwork }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // OpenSeadragon type viewer (tipado laxo: la lib no exporta el tipo Viewer aquí).
  const viewerRef = useRef<{ destroy: () => void; viewport: { zoomBy: (f: number) => void; applyConstraints: () => void; goHome: () => void } } | null>(null);

  useEffect(() => {
    let active = true;

    async function init() {
      const OpenSeadragon = (await import("openseadragon")).default;
      if (!active || !containerRef.current) return;

      viewerRef.current = OpenSeadragon({
        element: containerRef.current,
        prefixUrl:
          "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
        tileSources: {
          type: "image",
          url: artwork.image,
        },
        showNavigationControl: false,
        showNavigator: false,
        gestureSettingsMouse: { clickToZoom: false },
        animationTime: 0.6,
        springStiffness: 8,
        minZoomImageRatio: 0.8,
        maxZoomPixelRatio: 3,
        visibilityRatio: 1,
        constrainDuringPan: true,
      }) as unknown as typeof viewerRef.current;
    }

    init();

    return () => {
      active = false;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [artwork.image]);

  const zoom = (factor: number) => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.zoomBy(factor);
    v.viewport.applyConstraints();
  };

  const home = () => viewerRef.current?.viewport.goHome();

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-surface-muted">
      <div ref={containerRef} className="absolute inset-0 [&_canvas]:!outline-none" />

      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 rounded-lg border border-border bg-surface/90 p-1.5 shadow-e2 backdrop-blur">
        <button
          type="button"
          onClick={() => zoom(1.4)}
          aria-label="Acercar"
          className="grid size-9 place-items-center rounded-md text-foreground transition-colors hover:bg-surface-muted"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoom(1 / 1.4)}
          aria-label="Alejar"
          className="grid size-9 place-items-center rounded-md text-foreground transition-colors hover:bg-surface-muted"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={home}
          aria-label="Reiniciar vista"
          className="grid size-9 place-items-center rounded-md text-foreground transition-colors hover:bg-surface-muted"
        >
          <Home className="size-4" />
        </button>
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-md border border-border bg-surface/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
        Zoom HD · arrastrá para explorar
      </span>
    </div>
  );
}

// OpenSeadragon toca window → sólo en cliente.
export const DeepZoomViewer = dynamic(
  () => Promise.resolve(DeepZoomViewerInner),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/5] w-full animate-pulse rounded-xl border border-border bg-surface-muted" />
    ),
  },
);
