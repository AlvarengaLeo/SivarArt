import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { IMAGES } from "@/lib/mock";
import { HeroSculptureCanvas } from "@/components/landing/hero-sculpture";

const PILLARS = [
  {
    n: "01",
    title: "Galería 3D inmersiva",
    body: "Recorré salas en 3D con obra salvadoreña en alta resolución.",
    href: "/descubrir/galeria",
    image: IMAGES.hero1,
  },
  {
    n: "02",
    title: "Marketplace",
    body: "Comprá arte, insumos y enmarcado. Comisiones transparentes; el creador cobra.",
    href: "/tienda/arte",
    image: IMAGES.obraMemoria,
  },
  {
    n: "03",
    title: "Sivar Academy",
    body: "Aprendé técnicas directamente de los artistas. Ellos enseñan, vos creás.",
    href: "/academy",
    image: IMAGES.seccionAcademy,
  },
  {
    n: "04",
    title: "Mapa cultural",
    body: "Descubrí arte por región: sitios, artistas y el Hub físico de El Salvador.",
    href: "/mapa",
    image: IMAGES.seccionMapa,
  },
  {
    n: "05",
    title: "Economía circular",
    body: "Enmarcadores e insumos importados conectados — costos bajos, comunidad fuerte.",
    href: "/about",
    image: IMAGES.cursoMural,
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
        {/* glow radial + retícula sutil */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 55% at 70% 42%, hsl(233 92% 74% / 0.16), transparent 70%)",
          }}
        />
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-20 opacity-[0.12]" />

        {/* escultura 3D a la derecha (full detrás en móvil) */}
        <div className="absolute inset-0 -z-[5] lg:left-[42%]">
          <HeroSculptureCanvas />
        </div>
        {/* velo para legibilidad del texto */}
        <div className="pointer-events-none absolute inset-0 -z-[4] bg-gradient-to-r from-background via-background/85 to-transparent lg:via-background/60" />

        <div className="container relative pt-24">
          <div className="max-w-2xl">
            <Reveal>
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-primary">
                Un ecosistema para el arte
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl">
                Conectamos arte, artistas y personas en{" "}
                <span className="italic text-primary">El Salvador.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 h-px w-14 bg-primary/60" />
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-lg text-muted-foreground">
                Explorá, comprá y aprendé en un solo lugar. Impulsamos a la
                comunidad artística con tecnología, transparencia y propósito.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-[hsl(226_80%_60%)] shadow-[0_10px_36px_hsl(233_92%_60%/0.4)]"
                >
                  <Link href="/descubrir">
                    Descubrí arte <ArrowRight />
                  </Link>
                </Button>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/90 transition-colors hover:text-primary"
                >
                  Cómo funciona
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ficha de la obra */}
        <div className="absolute bottom-16 right-8 z-10 hidden max-w-[13rem] border-l border-primary/40 pl-4 xl:block">
          <p className="font-display text-base text-primary">S/T (Cabeza)</p>
          <p className="mt-1 text-sm text-foreground/90">Fernanda Cuéllar</p>
          <p className="text-sm text-muted-foreground">Bronce</p>
          <p className="text-sm text-muted-foreground">Colección privada</p>
        </div>
      </section>

      {/* ── 5 pilares (tarjetas con imagen) ──────────────── */}
      <section className="relative pb-24">
        <div className="container">
          <RevealGroup
            gap={0.08}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
          >
            {PILLARS.map((p) => (
              <RevealItem key={p.n} className="h-full">
                <Link
                  href={p.href}
                  className="group relative flex h-full min-h-[17rem] flex-col justify-end overflow-hidden rounded-xl border border-border p-5"
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover opacity-35 transition duration-500 ease-standard group-hover:scale-105 group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20" />
                  <div className="relative">
                    <span className="font-mono text-xs text-primary">{p.n}</span>
                    <h3 className="mt-2 font-display text-lg font-medium leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {p.body}
                    </p>
                    <ArrowUpRight className="mt-3 size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Economía circular ────────────────────────────── */}
      <section className="border-y border-border bg-surface/40 py-24">
        <div className="container">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              La ventaja competitiva
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-medium sm:text-4xl">
              Un motor creativo sostenible.
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {CIRCLE.map((s) => (
              <RevealItem key={s.n} className="h-full">
                <div className="h-full rounded-lg border border-border bg-surface p-6">
                  <span className="font-mono text-3xl font-semibold text-primary/40">
                    {s.n}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-medium">
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
            className="scale-110 object-cover opacity-60"
          />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/50" />

        <div className="container py-32 sm:py-40">
          <div className="max-w-xl">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                Un punto de encuentro físico
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-3 text-balance font-display text-3xl font-medium sm:text-4xl">
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
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 50%, hsl(233 92% 74% / 0.12), transparent 70%)",
          }}
        />
        <div className="container text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-medium sm:text-5xl">
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
