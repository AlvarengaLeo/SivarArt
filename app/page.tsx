import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  GraduationCap,
  MapPin,
  Palette,
  ScanFace,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { IMAGES } from "@/lib/mock";
import { HeroCanvas } from "@/components/landing/hero-canvas";

const PILLARS = [
  {
    icon: Boxes,
    title: "Galería 3D inmersiva",
    body: "Recorré salas en 3D con obra salvadoreña y zoom gigapíxel sobre cada pincelada.",
  },
  {
    icon: Store,
    title: "Marketplace que paga al artista",
    body: "Comprá arte, insumos y enmarcado. Comisiones transparentes; el creador cobra.",
  },
  {
    icon: GraduationCap,
    title: "Sivar Academy",
    body: "Aprendé técnicas directamente de los artistas. Ellos enseñan, vos creás.",
  },
  {
    icon: ScanFace,
    title: "Filtro IA estilo La Palma",
    body: "Convertí tu foto al estilo de la artesanía salvadoreña y compartilo.",
  },
  {
    icon: MapPin,
    title: "Mapa cultural",
    body: "Descubrí arte por región: sitios, artistas y el Hub físico de El Salvador.",
  },
  {
    icon: Palette,
    title: "Economía circular",
    body: "Enmarcadores e insumos importados conectados — costos bajos, comunidad fuerte.",
  },
];

const CIRCLE = [
  {
    n: "01",
    t: "Descuentos exclusivos",
    d: "Los artistas acceden a enmarcado e insumos a precio preferencial.",
  },
  {
    n: "02",
    t: "Generación de demanda",
    d: "El flujo de compradores y pintores llega a los talleres locales.",
  },
  {
    n: "03",
    t: "Volumen para talleres",
    d: "Los enmarcadores formalizados aumentan drásticamente sus ventas.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh items-center overflow-hidden">
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-20" />
        <div className="absolute inset-0 -z-10">
          <HeroCanvas />
        </div>
        {/* velo para legibilidad del texto sobre las obras */}
        <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative w-full px-6 pt-28 sm:px-10 lg:px-20">
          <div className="max-w-4xl">
            <Reveal>
              <h1 className="font-display text-3xl font-semibold leading-[1.08] sm:text-[2.75rem] lg:text-5xl">
                <span className="block">Democratizando la creatividad</span>
                <span className="block">
                  de <span className="text-primary">El Salvador</span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Descubrilo en una galería 3D inmersiva, aprendé de sus artistas y
                adquirí una pieza — apoyando directamente a quienes la crean.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/descubrir/galeria">
                    Entrar a la galería <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/tienda/arte">Explorar la tienda</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Pilares ──────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/40 py-24">
        <div className="container">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Un ecosistema integral
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              Un mercado fragmentado requiere una solución completa.
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <RevealItem key={p.title} className="h-full">
                <article className="group h-full rounded-lg border border-border bg-surface p-6 shadow-e1 transition-shadow hover:shadow-e2">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Economía circular ────────────────────────────── */}
      <section className="border-y border-border bg-surface/40 py-24">
        <div className="container">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              La ventaja competitiva
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              Un motor creativo sostenible.
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {CIRCLE.map((s) => (
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

      {/* ── Banda visual · El Hub ────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Parallax speed={0.18} className="absolute inset-0 -z-10">
          <Image
            src={IMAGES.seccionHub}
            alt="Interior de una galería de arte iluminada"
            fill
            sizes="100vw"
            className="scale-110 object-cover"
          />
        </Parallax>
        {/* overlay para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-40" />

        <div className="container py-32 sm:py-40">
          <div className="max-w-xl">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-wider text-primary">
                Un punto de encuentro físico
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl">
                El Hub: donde lo digital y lo tangible se encuentran.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-lg text-muted-foreground">
                Un espacio real en El Salvador para exhibir, enmarcar y conectar a
                la comunidad — la base de todo el ecosistema SivarArt.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/mapa">
                    Ver el mapa cultural <ArrowRight />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10" />
        <div className="container text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
              Transformemos el talento de El Salvador en una industria creativa
              sostenible.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/registro">
                  Unite como artista <ArrowRight />
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
