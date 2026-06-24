import Link from "next/link";
import {
  Package,
  Image as ImageIcon,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CARDS = [
  {
    href: "/cuenta/coleccion",
    title: "Mi colección",
    description: "3 obras adquiridas",
    icon: ImageIcon,
  },
  {
    href: "/cuenta",
    title: "Pedidos",
    description: "2 pedidos en total",
    icon: Package,
  },
  {
    href: "/cuenta/cursos",
    title: "Mis cursos",
    description: "1 curso en progreso",
    icon: GraduationCap,
  },
];

export default async function CuentaPage() {
  const user = await getUser();
  const email = user?.email ?? "coleccionista@sivarart.com";

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          Tu cuenta
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Hola de nuevo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sesión iniciada como{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {CARDS.map(({ href, title, description, icon: Icon }) => (
          <Link key={title} href={href} className="group block">
            <Card className="h-full transition-shadow hover:shadow-e2">
              <CardHeader>
                <Icon className="size-6 text-primary" />
                <CardTitle className="mt-2 flex items-center justify-between text-lg">
                  {title}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pedidos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border text-sm">
            <li className="flex items-center justify-between py-3">
              <span>
                <span className="font-medium">Memoria de Cuscatlán</span>
                <span className="block text-xs text-muted-foreground">
                  Pedido #SA-1042 · Entregado
                </span>
              </span>
              <span className="tabular-nums text-muted-foreground">
                $1,450.00
              </span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span>
                <span className="font-medium">Introducción al acrílico</span>
                <span className="block text-xs text-muted-foreground">
                  Pedido #SA-1039 · Acceso activo
                </span>
              </span>
              <span className="tabular-nums text-muted-foreground">$29.00</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
