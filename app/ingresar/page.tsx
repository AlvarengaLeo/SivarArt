import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Ingresar",
  description: "Accedé a tu cuenta de SivarArt.",
};

export default function IngresarPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-28">
      <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
      <Card className="w-full max-w-md shadow-e3">
        <CardHeader className="text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-primary">
            SivarArt
          </p>
          <CardTitle className="text-2xl">Bienvenido de vuelta</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ingresá para continuar a tu cuenta.
          </p>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link
              href="/registro"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
