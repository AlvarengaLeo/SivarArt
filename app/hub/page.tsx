import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Store, Clock, MapPin, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal, RevealGroup } from "@/components/reveal";
import { HubTour } from "@/components/hub/hub-tour";

export const metadata: Metadata = {
  title: "El Hub — tienda + galería incubadora | SivarArt",
  description:
    "El espacio físico de SivarArt en San Salvador: centro de suministros importados e incubadora de micro-exposiciones para artistas emergentes.",
};

const HOURS = [
  ["Lunes a viernes", "9:00 — 18:00"],
  ["Sábado", "9:00 — 14:00"],
  ["Domingo", "Cerrado"],
];

export default function HubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Comunidad · Espacio físico"
        title="El Hub — tienda + galería incubadora"
        description="Donde el ecosistema se vuelve tangible: insumos a precio justo, enmarcado y un escenario para que el talento emergente exponga por primera vez."
      />

      {/* Tour 3D */}
      <section className="container py-12">
        <HubTour />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Arrastrá para recorrer la sala. Tocá los marcadores para ubicar cada
          zona.
        </p>
      </section>

      {/* Dos pilares del Hub */}
      <section className="border-t border-border bg-surface/40 py-20">
        <div className="container">
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <CardHeader>
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary">
                    <Store className="size-6" />
                  </span>
                  <CardTitle className="mt-4 text-2xl">
                    Centro de suministros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Pinturas, lienzos, pinceles y equipo importado a precio
                    preferencial para la comunidad. Compramos en volumen para que
                    el artista salvadoreño no pague de más.
                  </p>
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link href="/tienda/insumos">
                      Ver insumos <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal>
              <Card className="h-full">
                <CardHeader>
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary">
                    <Boxes className="size-6" />
                  </span>
                  <CardTitle className="mt-4 text-2xl">
                    Incubadora de micro-exposiciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Un muro rotativo curado para artistas emergentes: su primera
                    exposición, acompañamiento y conexión directa con
                    compradores del ecosistema SivarArt.
                  </p>
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link href="/registro">
                      Aplicá a la incubadora <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      {/* Horarios + dirección */}
      <section className="py-20">
        <div className="container grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Clock className="size-5 text-primary" />
                Horarios
              </h3>
              <dl className="mt-4 divide-y divide-border">
                {HOURS.map(([day, time]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{day}</dt>
                    <dd className="font-medium">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <MapPin className="size-5 text-primary" />
                Dónde estamos
              </h3>
              <p className="mt-4 text-muted-foreground">
                Colonia Escalón, San Salvador
                <br />
                El Salvador, C.A.
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                (Dirección simulada para el prototipo.)
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-5">
                <Link href="/mapa">Verlo en el mapa cultural</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10" />
        <div className="container text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              Vení a conocer el corazón físico de SivarArt.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/registro">
                  Reservá una visita <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/registro">Aplicá a la incubadora</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
