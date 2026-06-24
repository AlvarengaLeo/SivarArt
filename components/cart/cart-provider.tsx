"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";

interface CartCtx {
  lines: CartLine[];
  count: number;
  totalCents: number;
  add: (line: CartLine) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sivarart.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === line.id);
      if (found)
        return prev.map((l) =>
          l.id === line.id ? { ...l, qty: l.qty + line.qty } : l,
        );
      return [...prev, line];
    });
    setOpen(true);
  }, []);

  const remove = useCallback(
    (id: string) => setLines((p) => p.filter((l) => l.id !== id)),
    [],
  );
  const setQty = useCallback(
    (id: string, qty: number) =>
      setLines((p) =>
        p.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)),
      ),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const totalCents = lines.reduce((s, l) => s + l.qty * l.priceCents, 0);
    return { lines, count, totalCents, add, remove, setQty, clear, open, setOpen };
  }, [lines, add, remove, setQty, clear, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
