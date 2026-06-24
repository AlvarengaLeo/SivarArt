"use client";

import { useState } from "react";
import { Boxes, LayoutGrid, MousePointer2 } from "lucide-react";
import { ARTWORKS } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArtworkCard } from "@/components/art/artwork-card";
import { GalleryCanvas } from "@/components/gallery/gallery-canvas";

type View = "3d" | "list";

export default function GaleriaPage() {
  const [view, setView] = useState<View>("3d");

  return (
    <div className="pt-20">
      {/* Barra de controles */}
      <div className="container flex flex-wrap items-center justify-between gap-4 py-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-primary">
            Galería inmersiva
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
            Recorré la sala
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Modo de vista"
          className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-e1"
        >
          <button
            role="tab"
            aria-selected={view === "3d"}
            onClick={() => setView("3d")}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              view === "3d"
                ? "bg-primary text-primary-foreground shadow-e1"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Boxes className="size-4" /> Vista 3D
          </button>
          <button
            role="tab"
            aria-selected={view === "list"}
            onClick={() => setView("list")}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              view === "list"
                ? "bg-primary text-primary-foreground shadow-e1"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="size-4" /> Vista lista
          </button>
        </div>
      </div>

      {/* Vista 3D — oculta en móvil por defecto vía aria pero renderizada según toggle */}
      {view === "3d" && (
        <section className="hidden md:block">
          <div className="container">
            <div className="relative h-[72vh] w-full overflow-hidden rounded-xl border border-border bg-surface-muted shadow-e2">
              <div className="blueprint-grid blueprint-grid-fade absolute inset-0 opacity-40" />
              <GalleryCanvas artworks={ARTWORKS} />
              <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface/85 px-4 py-2 text-xs text-muted-foreground shadow-e1 backdrop-blur">
                <MousePointer2 className="size-3.5" />
                Arrastrá para rotar · scroll para acercar · clic en una obra para
                ver el detalle
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gemelo accesible / fallback móvil: grid DOM */}
      {(view === "list" || view === "3d") && (
        <section
          className={cn(
            "container py-10",
            view === "3d" && "md:hidden",
          )}
        >
          {view === "3d" && (
            <p className="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              La vista 3D está disponible en pantallas grandes. Acá tenés todas
              las obras en formato lista.
            </p>
          )}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {ARTWORKS.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}

      <div className="container pb-16">
        <Button asChild variant="ghost">
          <a href="/descubrir">← Volver a Descubrir</a>
        </Button>
      </div>
    </div>
  );
}
