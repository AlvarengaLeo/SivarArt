"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Supply } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";

export function SupplyCard({ supply }: { supply: Supply }) {
  const { add } = useCart();

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-e2">
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <Image
          src={supply.image}
          alt={supply.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-standard group-hover:scale-[1.03]"
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="muted" className="w-fit">
          {supply.category}
        </Badge>
        <h3 className="font-display text-base font-semibold leading-tight">
          {supply.name}
        </h3>
        <p className="text-xs text-muted-foreground">{supply.brand}</p>
        <span className="mt-auto pt-1 text-lg font-semibold">
          {formatUSD(supply.priceCents)}
        </span>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() =>
            add({
              id: supply.id,
              kind: "supply",
              title: supply.name,
              priceCents: supply.priceCents,
              qty: 1,
              image: supply.image,
            })
          }
        >
          <Plus /> Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
