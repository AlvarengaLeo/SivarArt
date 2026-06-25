import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, PlayCircle, BarChart3, CheckCircle2 } from "lucide-react";
import { getCourse } from "@/lib/mock";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EnrollButton } from "@/components/academy/enroll-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";

export default async function CursoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const hours = Math.round(course.durationMin / 60);
  const avgMin = Math.max(1, Math.round(course.durationMin / course.lessons));
  const temario = Array.from({ length: course.lessons }, (_, i) => {
    const n = i + 1;
    return {
      n,
      title:
        n === 1
          ? "Bienvenida e introducción"
          : n === course.lessons
            ? "Proyecto final y cierre"
            : `Lección ${n}: ${course.category} en la práctica`,
    };
  });

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border pt-28">
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
        <div className="container grid grid-cols-1 gap-10 pb-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Sivar Academy · {course.category}
            </p>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              {course.summary}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Instructor:{" "}
              <Link
                href={`/artista/${course.artistSlug}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {course.artistName}
              </Link>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                <BarChart3 className="size-3.5" /> {course.level}
              </Badge>
              <Badge variant="outline">
                <PlayCircle className="size-3.5" /> {course.lessons} lecciones
              </Badge>
              <Badge variant="outline">
                <Clock className="size-3.5" /> {hours} h de video
              </Badge>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-xl border border-border bg-surface p-4 shadow-e2"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-muted">
              <Parallax speed={0.08} className="absolute inset-0">
                <div className="relative h-full w-full scale-125">
                  <Image
                    src={course.cover}
                    alt={course.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </Parallax>
            </div>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="font-display text-3xl font-semibold">
                {formatUSD(course.priceCents)}
              </span>
              <span className="text-sm text-muted-foreground">
                acceso de por vida
              </span>
            </div>
            <div className="mt-5">
              <EnrollButton course={course} />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {course.lessons} lecciones · {hours} h · ~{avgMin} min por lección
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-14">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">Temario</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {course.lessons} lecciones · {hours} h de contenido
            </p>
          </Reveal>
          <Separator className="my-6" />
          <RevealGroup className="space-y-1" gap={0.05}>
            {temario.map((l) => (
              <RevealItem
                key={l.n}
                className="flex items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-surface-muted"
              >
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">
                  {String(l.n).padStart(2, "0")}
                </span>
                <span className="text-sm">{l.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {avgMin} min
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </main>
  );
}
