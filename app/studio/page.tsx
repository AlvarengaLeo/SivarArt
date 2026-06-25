import { Wallet } from "lucide-react";
import { ARTWORKS } from "@/lib/mock";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/studio/stat-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

const STATS = [
  { label: "Ventas del mes", value: "$1,840", trend: 12 },
  { label: "Vistas", value: "8,420", trend: 7 },
  { label: "Seguidores", value: "312", trend: 4 },
  { label: "Obras publicadas", value: "6", trend: -1 },
];

const STATUSES = ["Publicada", "En revisión", "Vendida"] as const;

export default function StudioDashboardPage() {
  const recent = ARTWORKS.slice(0, 5);

  return (
    <div className="space-y-8">
      <Reveal>
        <header>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu actividad como creador en SivarArt.
          </p>
        </header>
      </Reveal>

      <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <RevealItem key={s.label}>
            <StatCard label={s.label} value={s.value} trend={s.trend} />
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Obras recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 font-medium">Obra</th>
                    <th className="pb-3 font-medium">Precio</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((art, i) => (
                    <tr key={art.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">
                        <span className="font-medium">{art.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {art.medium}
                        </span>
                      </td>
                      <td className="py-3 pr-4 tabular-nums">
                        {formatUSD(art.priceCents)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            STATUSES[i % STATUSES.length] === "Vendida"
                              ? "gold"
                              : STATUSES[i % STATUSES.length] === "En revisión"
                                ? "muted"
                                : "default"
                          }
                        >
                          {STATUSES[i % STATUSES.length]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </Reveal>

        <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="size-5 text-primary" /> Pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Saldo disponible
              </p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {formatUSD(124000)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Los retiros se procesan vía Wompi a tu cuenta bancaria en El
              Salvador. Los pagos se liberan 7 días después de cada venta.
            </p>
            <Button variant="outline" className="w-full">
              Solicitar retiro
            </Button>
          </CardContent>
        </Card>
        </Reveal>
      </div>
    </div>
  );
}
