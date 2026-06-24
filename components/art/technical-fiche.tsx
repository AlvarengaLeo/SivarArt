import type { Artwork } from "@/lib/types";

/** Ficha técnica tipo museo: etiquetas mono uppercase, valores en texto normal. */
export function TechnicalFiche({ artwork }: { artwork: Artwork }) {
  const rows: { label: string; value: string }[] = [
    { label: "Técnica", value: artwork.medium },
    { label: "Movimiento", value: artwork.movement },
    { label: "Región", value: artwork.region },
    { label: "Año", value: String(artwork.year) },
    {
      label: "Dimensiones",
      value: `${artwork.widthCm} × ${artwork.heightCm} cm`,
    },
    { label: "Tipo", value: artwork.type === "physical" ? "Física" : "Digital" },
  ];

  return (
    <div>
      <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 px-4 py-3"
          >
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {row.label}
            </dt>
            <dd className="text-right text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {artwork.description && (
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {artwork.description}
        </p>
      )}
    </div>
  );
}
