import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getArtist, artworksByArtist, COURSES } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { ArtworkCard } from "@/components/art/artwork-card";
import { CourseCard } from "@/components/art/course-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return { title: "Artista no encontrado · SivarArt" };
  return {
    title: `${artist.name} · SivarArt`,
    description: artist.bio,
  };
}

export default async function ArtistaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const works = artworksByArtist(artist.slug);
  const courses = COURSES.filter((c) => c.artistSlug === artist.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border pt-28">
        <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
        <div className="container pb-12">
          <Reveal className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <Parallax
              speed={0.12}
              className="relative size-28 shrink-0 rounded-full border border-border bg-surface-muted shadow-e2 sm:size-36"
            >
              <Image
                src={artist.avatar}
                alt={artist.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            </Parallax>
            <div>
              {artist.featured && <Badge variant="gold">Artista destacado</Badge>}
              <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                {artist.name}
              </h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" />
                {artist.region}
              </p>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                {artist.bio}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Obras */}
      <section className="container py-16">
        <Reveal className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Obra
          </h2>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {works.length} {works.length === 1 ? "pieza" : "piezas"}
          </span>
        </Reveal>

        {works.length > 0 ? (
          <RevealGroup className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {works.map((artwork) => (
              <RevealItem key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="mt-6 text-muted-foreground">
            Este artista aún no tiene obra publicada.
          </p>
        )}
      </section>

      {/* Cursos */}
      {courses.length > 0 && (
        <section className="border-t border-border bg-surface/40 py-16">
          <div className="container">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Cursos con {artist.name}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Aprendé su técnica directamente de la fuente.
              </p>
            </Reveal>
            <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <RevealItem key={course.slug}>
                  <CourseCard course={course} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}
    </>
  );
}
