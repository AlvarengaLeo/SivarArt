"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bitcoin, CreditCard, Loader2, QrCode, Wallet } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-provider";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCheckout } from "@/server/actions/checkout";

const METHODS = [
  { icon: CreditCard, label: "Tarjeta" },
  { icon: Wallet, label: "Puntos Agrícola" },
  { icon: Bitcoin, label: "Bitcoin" },
  { icon: QrCode, label: "QR" },
];

export default function CheckoutPage() {
  const { lines, totalCents, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createCheckout({
        lines: lines.map((l) => ({
          id: l.id,
          title: l.title,
          priceCents: l.priceCents,
          qty: l.qty,
        })),
        customer: form,
      });

      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.url) {
        if (res.demo) clear();
        window.location.href = res.url;
      }
    });
  };

  if (lines.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Tienda · Checkout" title="Tu carrito está vacío" />
        <section className="py-16">
          <div className="container">
            <Card className="mx-auto max-w-md text-center">
              <CardContent className="p-10">
                <p className="text-muted-foreground">
                  Todavía no agregaste nada. Descubrí obra original salvadoreña.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/tienda/arte">Explorar el arte</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Tienda · Checkout"
        title="Finalizá tu compra"
        description="Revisá tu pedido y pagá de forma segura con Wompi SV."
      />

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Datos del comprador */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos de envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="María González"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="maria@correo.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    required
                    value={form.address}
                    onChange={update("address")}
                    placeholder="Colonia Escalón, San Salvador"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {METHODS.map((m) => (
                    <Badge key={m.label} variant="outline" className="px-3 py-1.5">
                      <m.icon className="size-3.5" /> {m.label}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Procesado de forma segura por Wompi SV (Banco Agrícola).
                </p>
              </CardContent>
            </Card>

            {error && (
              <p className="rounded-md border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin" /> Procesando…
                </>
              ) : (
                <>Pagar con Wompi SV · {formatUSD(totalCents)}</>
              )}
            </Button>
          </form>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                          ×{line.qty}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {line.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cantidad: {line.qty}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatUSD(line.priceCents * line.qty)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl font-semibold">
                    {formatUSD(totalCents)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
