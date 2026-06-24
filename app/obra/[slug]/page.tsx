import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { getArtwork, artworksByArtist } from "@/lib/mock";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArtworkCard } from "@/components/art/artwork-card";
import { TechnicalFiche } from "@/components/art/technical-fiche";
import { AddToCartButton } from "@/components/art/add-to-cart-button";
import { DeepZoomViewer } from "@/components/art/deep-zoom-viewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtwork(slug);
  if (!artwork) return { title: "Obra no encontrada · SivarArt" };
  return {
    title: `${artwork.title} — ${artwork.artistName} · SivarArt`,
    description: artwork.description,
  };
}

export default async function ObraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = getArtwork(slug);
  if (!artwork) notFound();

  const related = artworksByArtist(artwork.artistSlug)
    .filter((a) => a.slug !== artwork.slug)
    .slice(0, 4);

  return (
    <div className="pt-28">
      <div className="container">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/descubrir/galeria">
            <ArrowLeft /> Volver a la galería
          </Link>
        </Button>

        {/* 2 columnas */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Izquierda: visor zoom HD */}
          <DeepZoomViewer artwork={artwork} />

          {/* Derecha: ficha + compra */}
          <div>
            <Badge variant="outline">{artwork.movement}</Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              {artwork.title}
            </h1>
            <Link
              href={`/artista/${artwork.artistSlug}`}
              className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <User className="size-4" />
              {artwork.artistName}
            </Link>

            <p className="mt-6 font-display text-3xl font-semibold text-primary">
              {formatUSD(artwork.priceCents)}
            </p>

            <div className="mt-6">
              <AddToCartButton artwork={artwork} />
            </div>

            <Separator className="my-8" />

            <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Ficha técnica
            </h2>
            <TechnicalFiche artwork={artwork} />
          </div>
        </div>

        {/* Relacionadas */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-semibold">
              Más de {artwork.artistName}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="h-16" />
    </div>
  );
}
