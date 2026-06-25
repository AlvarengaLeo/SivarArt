"use client";

import { useMemo, useState } from "react";
import { Check, Frame, Recycle, Users } from "lucide-react";
import { cn, formatUSD } from "@/lib/utils";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

const BENEFITS = [
  {
    icon: Recycle,
    title: "Economía circular",
    body: "Reutilizamos y reacondicionamos marcos siempre que es posible, reduciendo desperdicio y costo.",
  },
  {
    icon: Users,
    title: "Red de enmarcadores",
    body: "Trabajamos con talleres locales formalizados que reciben volumen real a través de SivarArt.",
  },
  {
    icon: Frame,
    title: "Acabado profesional",
    body: "Montaje con materiales de archivo para proteger tu obra por décadas.",
  },
];

const SIZES = [
  { id: "s", label: "Pequeño · hasta 40×50 cm", baseCents: 2500 },
  { id: "m", label: "Mediano · hasta 70×100 cm", baseCents: 4500 },
  { id: "l", label: "Grande · hasta 120×150 cm", baseCents: 7500 },
] as const;

const MATERIALS = [
  { id: "pino", label: "Pino natural", multiplier: 1 },
  { id: "aluminio", label: "Aluminio minimalista", multiplier: 1.3 },
  { id: "nogal", label: "Nogal premium", multiplier: 1.6 },
] as const;

type SizeId = (typeof SIZES)[number]["id"];
type MaterialId = (typeof MATERIALS)[number]["id"];

export default function EnmarcadoPage() {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState<SizeId>("m");
  const [materialId, setMaterialId] = useState<MaterialId>("pino");

  const size = SIZES.find((s) => s.id === sizeId)!;
  const material = MATERIALS.find((m) => m.id === materialId)!;

  const estimateCents = useMemo(
    () => Math.round(size.baseCents * material.multiplier),
    [size, material],
  );

  return (
    <>
      <PageHeader
        eyebrow="Tienda · Enmarcado"
        title="Servicio de enmarcado"
        description="Dale a tu obra el marco que merece. Un servicio de economía circular hecho con nuestra red de talleres salvadoreños."
      />

      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-[1fr_420px]">
          <RevealGroup className="space-y-6">
            {BENEFITS.map((b) => (
              <RevealItem key={b.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <b.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Configurá tu marco</CardTitle>
              <CardDescription>
                Estimá el precio según tamaño y material. El precio final se
                confirma tras revisar tu obra.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Option
                label="Tamaño"
                items={SIZES.map((s) => ({ id: s.id, label: s.label }))}
                value={sizeId}
                onChange={(id) => setSizeId(id as SizeId)}
              />
              <Option
                label="Material"
                items={MATERIALS.map((m) => ({ id: m.id, label: m.label }))}
                value={materialId}
                onChange={(id) => setMaterialId(id as MaterialId)}
              />

              <div className="flex items-baseline justify-between rounded-lg bg-surface-muted px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  Precio estimado
                </span>
                <span className="font-display text-2xl font-semibold">
                  {formatUSD(estimateCents)}
                </span>
              </div>

              <Button
                className="w-full"
                onClick={() =>
                  add({
                    id: `enmarcado-${sizeId}-${materialId}`,
                    kind: "supply",
                    title: `Enmarcado · ${size.label.split(" · ")[0]} · ${material.label}`,
                    priceCents: estimateCents,
                    qty: 1,
                  })
                }
              >
                Agregar enmarcado al carrito
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                <Check className="mr-1 inline size-3.5 text-primary" />
                Sin compromiso · ajustable antes de pagar
              </p>
            </CardContent>
          </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Option({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const active = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors duration-200 ease-standard",
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-surface hover:bg-surface-muted",
              )}
            >
              <span>{item.label}</span>
              {active && (
                <Badge variant="default" className="shrink-0">
                  <Check className="size-3" />
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
