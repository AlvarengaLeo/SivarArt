"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export function AddToCartButton({ artwork }: { artwork: Artwork }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (!artwork.available) {
    return (
      <Button size="lg" variant="secondary" disabled className="w-full">
        Vendido
      </Button>
    );
  }

  function handleAdd() {
    add({
      id: artwork.id,
      kind: "artwork",
      title: artwork.title,
      priceCents: artwork.priceCents,
      qty: 1,
      image: artwork.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Button size="lg" onClick={handleAdd} className="w-full">
      {added ? (
        <>
          <Check /> Agregado
        </>
      ) : (
        <>
          <ShoppingBag /> Agregar al carrito
        </>
      )}
    </Button>
  );
}
