import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: number;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <Card className="p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {typeof trend === "number" && (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-sm",
            up ? "text-primary" : "text-terracotta",
          )}
        >
          {up ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}
          {up ? "+" : ""}
          {trend}% vs. mes anterior
        </p>
      )}
    </Card>
  );
}
