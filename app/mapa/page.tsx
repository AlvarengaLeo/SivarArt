import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CulturalMap } from "@/components/map/cultural-map";
import { LOCATIONS, REGIONS } from "@/lib/mock";
import type { MapLocation } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mapa cultural de El Salvador | SivarArt",
  description:
    "Explorá galerías, estudios, sitios artísticos y el Hub físico de SivarArt por región en El Salvador.",
};

const KIND_LABEL: Record<MapLocation["kind"], string> = {
  hub: "Hub",
  gallery: "Galería",
  studio: "Estudio",
  landmark: "Sitio",
};

const KIND_VARIANT: Record<
  MapLocation["kind"],
  "default" | "terracotta" | "gold" | "muted"
> = {
  hub: "default",
  gallery: "terracotta",
  studio: "gold",
  landmark: "muted",
};

export default function MapaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Descubrir · Mapa"
        title="Mapa cultural de El Salvador"
        description="Del Hub en San Salvador a la cuna del naïf en La Palma: ubicá galerías, estudios y sitios clave del arte salvadoreño."
      />

      <section className="container py-12">
        <CulturalMap />
      </section>

      {/* Gemelo DOM accesible: misma información, navegable sin el mapa. */}
      <section className="border-t border-border bg-surface/40 py-16">
        <div className="container">
          <h2 className="font-display text-2xl font-semibold">
            Lugares por región
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Una lista accesible con todos los puntos del mapa.
          </p>

          <div className="mt-10 space-y-12">
            {REGIONS.map((region) => {
              const items = LOCATIONS.filter((l) => l.region === region);
              if (items.length === 0) return null;
              return (
                <div key={region}>
                  <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                    <MapPin className="size-4" />
                    {region}
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((loc) => (
                      <Card key={loc.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg">{loc.name}</CardTitle>
                            <Badge variant={KIND_VARIANT[loc.kind]}>
                              {KIND_LABEL[loc.kind]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {loc.description}
                          </p>
                          <p className="mt-3 font-mono text-xs text-muted-foreground">
                            {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
