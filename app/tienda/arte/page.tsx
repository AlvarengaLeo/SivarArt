"use client";

import { useMemo, useState } from "react";
import { ARTWORKS, MOVEMENTS, REGIONS } from "@/lib/mock";
import { PageHeader } from "@/components/site/page-header";
import { ArtworkCard } from "@/components/art/artwork-card";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { FilterBar, type ShopFilterValue } from "@/components/shop/filter-bar";

export default function ArtePage() {
  const [filters, setFilters] = useState<ShopFilterValue>({
    query: "",
    movement: null,
    region: null,
  });

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return ARTWORKS.filter((a) => {
      if (filters.movement && a.movement !== filters.movement) return false;
      if (filters.region && a.region !== filters.region) return false;
      if (q) {
        const haystack =
          `${a.title} ${a.artistName} ${a.medium} ${a.movement}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <>
      <PageHeader
        eyebrow="Tienda · Arte"
        title="Catálogo de obras"
        description="Explorá obra original salvadoreña y llevá una pieza a casa."
      />

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterBar
              value={filters}
              onChange={setFilters}
              movements={MOVEMENTS}
              regions={REGIONS}
            />
          </aside>

          <div>
            <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
              {results.length}{" "}
              {results.length === 1 ? "obra encontrada" : "obras encontradas"}
            </p>

            {results.length > 0 ? (
              <RevealGroup className="grid grid-cols-2 gap-6 xl:grid-cols-3">
                {results.map((artwork) => (
                  <RevealItem key={artwork.id}>
                    <ArtworkCard artwork={artwork} />
                  </RevealItem>
                ))}
              </RevealGroup>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface/40 p-12 text-center">
                <p className="font-display text-lg font-semibold">
                  Sin resultados
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Probá quitar algún filtro o ajustar la búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
