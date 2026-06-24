import type { Metadata } from "next";
import { ShieldCheck, Cpu, WifiOff } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { StyleFilter } from "@/components/ai/style-filter";

export const metadata: Metadata = {
  title: "Filtro IA — estilo La Palma | SivarArt",
  description:
    "Transformá tu foto al estilo del arte naïf salvadoreño. Procesamiento 100% en tu dispositivo: privado y sin subir nada.",
};

const NOTES = [
  {
    icon: Cpu,
    title: "Corre en tu dispositivo",
    body: "El efecto se calcula píxel por píxel en tu navegador con Canvas 2D. Sin servidores.",
  },
  {
    icon: ShieldCheck,
    title: "100% privado",
    body: "Tu imagen nunca se sube a internet. Lo que ves se queda contigo.",
  },
  {
    icon: WifiOff,
    title: "Sin modelos pesados",
    body: "Nada de descargas gigantes ni esperas: posterización, saturación y contornos al instante.",
  },
];

export default function FiltroAIPage() {
  return (
    <>
      <PageHeader
        eyebrow="Descubrir · Filtro IA"
        title="Filtro IA — estilo La Palma"
        description="Convertí cualquier foto al inconfundible estilo naïf salvadoreño. Todo el procesamiento ocurre en tu dispositivo, así que tu imagen es completamente privada."
      />

      <section className="container py-12">
        <StyleFilter />
      </section>

      <section className="border-t border-border bg-surface/40 py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-3">
            {NOTES.map((n) => (
              <div
                key={n.title}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                  <n.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
