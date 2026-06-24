import Link from "next/link";

const COLS = [
  {
    title: "Explorar",
    links: [
      { href: "/descubrir", label: "Descubrir" },
      { href: "/descubrir/galeria", label: "Galería 3D" },
      { href: "/descubrir/filtro-ai", label: "Filtro IA" },
      { href: "/mapa", label: "Mapa cultural" },
    ],
  },
  {
    title: "Comercio",
    links: [
      { href: "/tienda/arte", label: "Comprar arte" },
      { href: "/tienda/insumos", label: "Insumos" },
      { href: "/tienda/enmarcado", label: "Enmarcado" },
      { href: "/academy", label: "Sivar Academy" },
    ],
  },
  {
    title: "Artistas",
    links: [
      { href: "/registro", label: "Vendé tu arte" },
      { href: "/studio", label: "Studio" },
      { href: "/hub", label: "El Hub" },
      { href: "/about", label: "Nosotros" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted/40">
      <div className="container grid gap-10 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground font-mono text-sm">
              &amp;
            </span>
            <span className="font-semibold">SivarArt</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            El hogar del arte salvadoreño. Descubrí, aprendé y adquirí —
            apoyando directamente a quienes lo crean.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Hecho en El Salvador 🇸🇻
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SivarArt. Todos los derechos reservados.</p>
          <p>Democratizando el arte a través de la economía circular.</p>
        </div>
      </div>
    </footer>
  );
}
