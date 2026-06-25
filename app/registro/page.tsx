import Link from "next/link";
import Image from "next/image";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { IMAGES } from "@/lib/mock";

export const metadata = {
  title: "Registro",
  description: "Creá tu cuenta en SivarArt.",
};

export default function RegistroPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-28">
      <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
      <Reveal className="w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-xl shadow-e3 lg:grid-cols-2">
          {/* Panel visual (solo desktop) */}
          <div className="relative hidden lg:block">
            <Parallax speed={0.12} className="h-full w-full">
              <Image
                src={IMAGES.seccionAcademy}
                alt="Academia SivarArt"
                fill
                sizes="(min-width: 1024px) 50vw, 0px"
                className="object-cover"
              />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-background">
              <p className="font-mono text-xs uppercase tracking-wider text-background/80">
                SivarArt
              </p>
              <p className="mt-2 font-display text-2xl font-semibold leading-snug">
                Sumate a la comunidad del arte salvadoreño.
              </p>
            </div>
          </div>

          <Card className="w-full rounded-none border-0 shadow-none">
            <CardHeader className="text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-primary">
                SivarArt
              </p>
              <CardTitle className="text-2xl">Creá tu cuenta</CardTitle>
              <p className="text-sm text-muted-foreground">
                Unite como artista o coleccionista.
              </p>
            </CardHeader>
            <CardContent>
              <AuthForm mode="signup" />
              <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿Ya tenés cuenta?{" "}
                <Link
                  href="/ingresar"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Ingresá
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </Reveal>
    </main>
  );
}
