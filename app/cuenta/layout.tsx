import Link from "next/link";
import { Package, Image as ImageIcon, GraduationCap, Settings } from "lucide-react";
import { requireUser } from "@/lib/auth";

const NAV = [
  { href: "/cuenta", label: "Pedidos", icon: Package },
  { href: "/cuenta/coleccion", label: "Mi colección", icon: ImageIcon },
  { href: "/cuenta/cursos", label: "Mis cursos", icon: GraduationCap },
  { href: "/cuenta/ajustes", label: "Ajustes", icon: Settings },
];

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/ingresar");

  return (
    <div className="min-h-screen pt-20">
      <div className="container grid grid-cols-1 gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="px-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Mi cuenta
          </p>
          <nav className="mt-3 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
