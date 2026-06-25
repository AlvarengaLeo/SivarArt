import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const demo = params.demo === "1";
  const refParam = params.ref;
  const ref =
    typeof refParam === "string"
      ? refParam
      : `SVA-${new Date().getFullYear()}-${String(
          (params.order ?? "0001"),
        ).slice(0, 8)}`;

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden py-28">
      <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
      <div className="container">
        <Reveal className="mx-auto max-w-lg">
        <Card className="text-center shadow-e2">
          <CardContent className="p-10">
            <RevealGroup gap={0.12}>
              <RevealItem>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-9" />
                </span>
              </RevealItem>

              {demo && (
                <RevealItem>
                  <Badge variant="gold" className="mt-6">
                    Modo demo
                  </Badge>
                </RevealItem>
              )}

              <RevealItem>
                <h1 className="mt-6 font-display text-3xl font-semibold">
                  ¡Gracias por tu compra!
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Tu pedido fue recibido. Te enviaremos la confirmación y los
                  detalles de envío por correo.
                </p>
              </RevealItem>

              <RevealItem>
                <p className="mt-6 font-mono text-sm text-muted-foreground">
                  Número de orden
                </p>
                <p className="font-mono text-lg font-semibold text-primary">
                  {ref}
                </p>
              </RevealItem>

              <RevealItem>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/tienda">Volver a la tienda</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
                  </Button>
                </div>
              </RevealItem>
            </RevealGroup>
          </CardContent>
        </Card>
        </Reveal>
      </div>
    </section>
  );
}
