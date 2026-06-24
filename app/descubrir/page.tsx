import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Boxes, MapPin, ScanFace } from "lucide-react";
import { ARTWORKS } from "@/lib/mock";
import { PageHeader } from "@/components/site/page-header";
import { ArtworkCard } from "@/components/art/artwork-card";
import { Reveal, RevealGroup } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Descubrir · SivarArt",
  description:
    "Explorá el arte salvadoreño: galería 3D inmersiva, filtro IA estilo La Palma y un mapa cultural por región.",
};

const ENTRIES = [
  {
    href: "/descubrir/galeria",
    icon: Boxes,
    eyebrow: "Inmersivo",
    title: "Galería 3D",
    body: "Recorré una sala virtual y acercate a cada pincelada en alta definición.",
  },
  {
    href: "/descubrir/filtro-ai",
    icon: ScanFace,
    eyebrow: "Creativo",
    title: "Filtro IA",
    body: "Transformá tu foto al estilo de la artesanía de La Palma y compartila.",
  },
  {
    href: "/mapa",
    icon: MapPin,
    eyebrow: "Territorio",
    title: "Mapa cultural",
    body: "Descubrí galerías, talleres y sitios de arte a lo largo de El Salvador.",
  },
];

export default function DescubrirPage() {
  const feed = ARTWORKS.slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow="Descubrir"
        title="Tres formas de entrar al arte salvadoreño"
        description="Sumergite en una galería tridimensional, jugá con la IA o recorré el país por su arte. Empezá por donde quieras."
      />

      {/* Tres tarjetas grandes */}
      <section className="container py-16">
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {ENTRIES.map((entry) => (
            <Reveal key={entry.href}>
              <Link
                href={entry.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface p-8 shadow-e1 transition-shadow hover:shadow-e3"
              >
                <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-60" />
                <span className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <entry.icon className="size-6" />
                </span>
                <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {entry.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold">
                  {entry.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {entry.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Explorar
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* Feed de inspiración */}
      <section className="border-t border-border bg-surface/40 py-16">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">
                  Feed de inspiración
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                  Obra que está dando de qué hablar
                </h2>
              </div>
              <Link
                href="/descubrir/galeria"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
              >
                Ver galería completa <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {feed.map((artwork) => (
              <Reveal key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
