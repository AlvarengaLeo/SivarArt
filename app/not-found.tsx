import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden">
      <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10" />

      <div className="container py-28 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-xl border border-border bg-surface font-display text-3xl font-semibold text-primary shadow-e1">
          &amp;
        </span>

        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-primary">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-6xl font-semibold sm:text-7xl">
          Página no encontrada
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          La obra que buscás no está en esta sala. Volvamos a la galería
          principal para seguir descubriendo el arte salvadoreño.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/descubrir">
              <Compass className="size-4" />
              Explorar la galería
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
