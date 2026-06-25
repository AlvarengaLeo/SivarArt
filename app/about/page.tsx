import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  GraduationCap,
  Frame,
  Boxes,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { IMAGES } from "@/lib/mock";

export const metadata: Metadata = {
  title: "Sobre SivarArt | Nuestra historia y misión",
  description:
    "Democratizar el arte salvadoreño con una economía circular que paga al artista. De El Salvador a Centroamérica y al mundo.",
};

const STAGES = [
  {
    n: "01",
    t: "El Salvador",
    d: "Empezamos en casa: artistas, talleres y compradores locales en un mismo ecosistema.",
  },
  {
    n: "02",
    t: "Centroamérica",
    d: "Replicamos el modelo en la región, conectando escenas creativas hermanas.",
  },
  {
    n: "03",
    t: "Global",
    d: "Llevamos el arte centroamericano al coleccionismo internacional, sin intermediarios abusivos.",
  },
];

const REVENUE = [
  {
    icon: Store,
    t: "Marketplace de arte",
    d: "Comisión transparente sobre cada obra vendida; el creador siempre cobra.",
  },
  {
    icon: Boxes,
    t: "Insumos importados",
    d: "Venta de materiales en volumen a precio justo desde el Hub.",
  },
  {
    icon: Frame,
    t: "Enmarcado y servicios",
    d: "Red de enmarcadores formalizados que reciben demanda constante.",
  },
  {
    icon: GraduationCap,
    t: "Sivar Academy",
    d: "Cursos donde los artistas enseñan y monetizan su conocimiento.",
  },
  {
    icon: Sparkles,
    t: "Experiencias premium",
    d: "Filtro IA, galería 3D e impresión fine-art como servicios de valor agregado.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre nosotros"
        title="Democratizar el arte salvadoreño."
        description="SivarArt nace de una convicción simple: el talento de El Salvador merece una industria creativa sostenible, no caridad ni intermediarios que se quedan con todo."
      />

      {/* Historia */}
      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Nuestra historia
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  El arte salvadoreño es extraordinario y profundamente nuestro
                  —del estilo naïf de La Palma a las nuevas voces urbanas— pero
                  vive fragmentado: difícil de descubrir, casi imposible de
                  comprar y rara vez rentable para quien lo crea.
                </p>
                <p>
                  Construimos SivarArt para cerrar ese círculo: un ecosistema
                  donde descubrir, aprender, comprar y crear se sostienen
                  mutuamente, y donde cada transacción fortalece a la comunidad
                  que la hace posible.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Nuestra misión
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Convertir el talento creativo de El Salvador en una industria
                  sostenible mediante una{" "}
                  <span className="font-medium text-foreground">
                    economía circular
                  </span>
                  : el dinero que entra al ecosistema vuelve a los artistas, los
                  talleres y los enmarcadores locales.
                </p>
                <p>
                  Queremos que un comprador en cualquier parte del mundo pueda
                  apoyar directamente a un artista salvadoreño, con tecnología de
                  primer nivel y total transparencia.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trayectoria ES → Centroamérica → Global */}
      <section className="border-y border-border bg-surface/40 py-20">
        <div className="container">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              La visión
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              De El Salvador al mundo.
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {STAGES.map((s) => (
              <RevealItem key={s.n} className="h-full">
                <div className="h-full rounded-lg border border-border bg-surface p-6">
                  <span className="font-mono text-3xl font-semibold text-primary/30">
                    {s.n}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Banda visual — paisaje salvadoreño */}
      <section className="border-b border-border">
        <Parallax speed={0.18} className="relative h-64 w-full sm:h-80">
          <Image
            src={IMAGES.seccionMapa}
            alt="Atardecer en El Salvador"
            fill
            sizes="100vw"
            className="scale-110 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent" />
        </Parallax>
      </section>

      {/* Modelo de negocio — 5 fuentes */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Modelo de negocio
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              Cinco fuentes de ingreso, un mismo círculo virtuoso.
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REVENUE.map((r) => (
              <RevealItem key={r.t} className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                      <r.icon className="size-5" />
                    </span>
                    <CardTitle className="mt-4 text-lg">{r.t}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{r.d}</p>
                  </CardContent>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10" />
        <div className="container text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              Sé parte del ecosistema creativo de El Salvador.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/registro">
                  Unite como artista <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/descubrir">Descubrir el arte</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
