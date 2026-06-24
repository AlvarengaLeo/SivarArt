import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden py-28">
      <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
      <div className="container">
        <Card className="mx-auto max-w-lg text-center shadow-e2">
          <CardContent className="p-10">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-terracotta/15 text-terracotta">
              <XCircle className="size-9" />
            </span>

            <h1 className="mt-6 font-display text-3xl font-semibold">
              Pago cancelado
            </h1>
            <p className="mt-3 text-muted-foreground">
              No se realizó ningún cargo. Tu carrito sigue intacto por si querés
              intentarlo de nuevo.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/tienda/checkout">Volver al carrito</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/tienda">Seguir explorando</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
