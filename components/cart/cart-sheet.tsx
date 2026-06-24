"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatUSD } from "@/lib/utils";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
      aria-label="Carrito"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartSheet() {
  const { lines, totalCents, remove, setQty, open, setOpen } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <div className="flex items-center gap-2 border-b border-border p-6">
          <ShoppingBag className="size-5 text-primary" />
          <SheetTitle className="font-display text-lg font-semibold">
            Tu carrito
          </SheetTitle>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
            <SheetClose asChild>
              <Button asChild variant="secondary">
                <Link href="/tienda/arte">Explorar arte</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                    {l.image && (
                      <Image src={l.image} alt={l.title} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium leading-tight">{l.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatUSD(l.priceCents)}
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        onClick={() => setQty(l.id, l.qty - 1)}
                        className="grid h-7 w-7 place-items-center rounded-sm border border-border hover:bg-surface-muted"
                        aria-label="Menos"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button
                        onClick={() => setQty(l.id, l.qty + 1)}
                        className="grid h-7 w-7 place-items-center rounded-sm border border-border hover:bg-surface-muted"
                        aria-label="Más"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        onClick={() => remove(l.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                        aria-label="Quitar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between font-medium">
                <span>Subtotal</span>
                <span className="font-display text-lg">{formatUSD(totalCents)}</span>
              </div>
              <SheetClose asChild>
                <Button asChild size="lg" className="w-full">
                  <Link href="/tienda/checkout">Ir a pagar</Link>
                </Button>
              </SheetClose>
              <p className="text-center text-xs text-muted-foreground">
                Pago seguro con Wompi SV · USD
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
