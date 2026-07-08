import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-muted": "hsl(var(--surface-muted) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          hover: "hsl(var(--primary-hover) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        gold: "hsl(var(--gold) / <alpha-value>)",
        terracotta: "hsl(var(--terracotta) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      // Tipografía FLUIDA (clamp) → escala suave en cualquier dimensión, sin saltos.
      fontSize: {
        "fluid-hero": ["clamp(2.1rem, 4vw + 1rem, 3.2rem)", { lineHeight: "1.07" }],
        "fluid-h2": ["clamp(1.55rem, 2.4vw + 0.8rem, 2.35rem)", { lineHeight: "1.14" }],
        "fluid-h3": ["clamp(1.1rem, 0.8vw + 0.75rem, 1.3rem)", { lineHeight: "1.3" }],
        "fluid-body": ["clamp(1rem, 0.4vw + 0.9rem, 1.125rem)", { lineHeight: "1.6" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        e1: "0 1px 2px rgba(14,27,44,.06)",
        e2: "0 4px 16px rgba(14,27,44,.08)",
        e3: "0 12px 40px rgba(14,27,44,.12)",
      },
      maxWidth: {
        reading: "70ch",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.16, 1, 0.3, 1)",
        emphasized: "cubic-bezier(0.83, 0, 0.17, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "draw-grid": {
          from: { backgroundSize: "0% 0%" },
          to: { backgroundSize: "100% 100%" },
        },
      },
      animation: {
        "fade-up": "fade-up .56s var(--ease-standard, cubic-bezier(0.16,1,0.3,1)) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
