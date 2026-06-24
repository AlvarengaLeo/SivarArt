"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface ShopFilterValue {
  query: string;
  movement: string | null;
  region: string | null;
}

export function FilterBar({
  value,
  onChange,
  movements,
  regions,
}: {
  value: ShopFilterValue;
  onChange: (next: ShopFilterValue) => void;
  movements: readonly string[];
  regions: readonly string[];
}) {
  const toggle = (key: "movement" | "region", item: string) =>
    onChange({ ...value, [key]: value[key] === item ? null : item });

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-e1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título, artista o medio…"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          className="pl-10"
          aria-label="Buscar obras"
        />
      </div>

      <FilterRow label="Movimiento">
        {movements.map((m) => (
          <Chip
            key={m}
            active={value.movement === m}
            onClick={() => toggle("movement", m)}
          >
            {m}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="Región">
        {regions.map((r) => (
          <Chip
            key={r}
            active={value.region === r}
            onClick={() => toggle("region", r)}
          >
            {r}
          </Chip>
        ))}
      </FilterRow>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ease-standard",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-e1"
          : "border-border bg-surface text-foreground hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}
