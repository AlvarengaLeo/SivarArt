import Link from "next/link";
import { ArrowRight, Frame, Package, Palette } from "lucide-react";
import { ARTWORKS } from "@/lib/mock";
import { PageHeader } from "@/components/site/page-header";
import { Reveal, RevealGroup } from "@/components/reveal";
import { ArtworkCard } from "@/components/art/artwork-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ZONES = [
  {
    href: "/tienda/arte",
    icon: Palette,
    title: "Arte",
    description:
      "Obra original de artistas salvadoreños. Filtrá por movimiento, región y técnica.",
  },
  {
    href: "/tienda/insumos",
    icon: Package,
    title: "Insumos",
    description:
      "Pinturas, lienzos, pinceles y equipo importado a precio de comunidad.",
  },
  {
    href: "/tienda/enmarcado",
    icon: Frame,
    title: "Enmarcado",
    description:
      "Servicio de enmarcado con economía circular y nuestra red de talleres locales.",
  },
];

export default function TiendaPage() {
  const featured = ARTWORKS.filter((a) => a.available).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="La tienda de SivarArt"
        description="Comprá arte original, insumos profesionales y enmarcado — apoyando directamente a quienes crean."
      />

      <section className="py-16">
        <div className="container">
          <RevealGroup className="grid gap-6 md:grid-cols-3">
            {ZONES.map((zone) => (
              <Reveal key={zone.href}>
                <Link href={zone.href} className="group block h-full">
                  <Card className="h-full transition-shadow hover:shadow-e2">
                    <CardHeader>
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                        <zone.icon className="size-5" />
                      </span>
                      <CardTitle className="mt-4 flex items-center justify-between">
                        {zone.title}
                        <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 ease-standard group-hover:translate-x-1 group-hover:text-primary" />
                      </CardTitle>
                      <CardDescription>{zone.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-surface/40 py-16">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">
                  Selección de la casa
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold">
                  Obras destacadas
                </h2>
              </div>
              <Link
                href="/tienda/arte"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
              >
                Ver todo <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {featured.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
