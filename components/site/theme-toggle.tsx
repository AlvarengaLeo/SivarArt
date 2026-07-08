"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-11 w-11 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
      aria-label="Cambiar tema"
    >
      {mounted && isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
