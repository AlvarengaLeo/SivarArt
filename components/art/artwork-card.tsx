"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-provider";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const { add } = useCart();

  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-surface shadow-e1 transition-shadow hover:shadow-e2">
      <Link href={`/obra/${artwork.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
          <Image
            src={artwork.image}
            alt={`${artwork.title} — ${artwork.artistName}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-standard group-hover:scale-[1.03]"
          />
          {!artwork.available && (
            <span className="absolute left-3 top-3">
              <Badge variant="muted">Vendido</Badge>
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/obra/${artwork.slug}`}>
              <h3 className="truncate font-display text-base font-semibold">
                {artwork.title}
              </h3>
            </Link>
            <Link
              href={`/artista/${artwork.artistSlug}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {artwork.artistName}
            </Link>
          </div>
          <span className="shrink-0 font-medium">
            {formatUSD(artwork.priceCents)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline">{artwork.movement}</Badge>
          {artwork.available && (
            <button
              onClick={() =>
                add({
                  id: artwork.id,
                  kind: "artwork",
                  title: artwork.title,
                  priceCents: artwork.priceCents,
                  qty: 1,
                  image: artwork.image,
                })
              }
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="size-3.5" /> Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
