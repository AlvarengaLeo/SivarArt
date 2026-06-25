import Link from "next/link";
import { COURSES } from "@/lib/mock";
import { CourseCard } from "@/components/art/course-card";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = {
  title: "Sivar Academy",
  description: "Aprendé de los artistas salvadoreños.",
};

export default function AcademyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Sivar Academy"
        title="Aprendé de los artistas"
        description="Cursos en video impartidos por creadores salvadoreños. Desde tus primeros trazos hasta dominar tu propio estilo."
      />

      <section className="container py-14">
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => (
            <RevealItem key={course.slug}>
              <CourseCard course={course} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="container py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Para creadores
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Enseñá y monetizá tu talento
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Publicá tu propio curso, construí tu audiencia y generá ingresos
              recurrentes. Vos ponés el conocimiento; nosotros la plataforma y
              los pagos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/registro">Convertite en instructor</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/studio">Conocé el Studio</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
