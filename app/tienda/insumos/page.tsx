import { SUPPLIES } from "@/lib/mock";
import { PageHeader } from "@/components/site/page-header";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { SupplyCard } from "@/components/shop/supply-card";

export default function InsumosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tienda · Insumos"
        title="Insumos para artistas"
        description="Pinturas, soportes, pinceles y equipo importado — disponibles a precio de comunidad para impulsar a cada creador."
      />

      <section className="py-12">
        <div className="container">
          <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {SUPPLIES.map((supply) => (
              <RevealItem key={supply.id}>
                <SupplyCard supply={supply} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
