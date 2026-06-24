import { NextResponse } from "next/server";
import { wompi } from "@/lib/payments/wompi";

export const runtime = "nodejs";

/**
 * Webhook de Wompi SV — notificación de resultado de pago.
 *
 * Idempotencia (TODO producción): antes de procesar, insertar el evento en
 * la tabla `webhook_events` (clave única por providerTxnId / merchantRef).
 * Si ya existe, responder 200 sin re-procesar. Esto evita aplicar el mismo
 * pago dos veces si Wompi reintenta la notificación.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await wompi.verifyWebhook(payload);

  if (!result.ok) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (result.approved) {
    // TODO (producción): actualizar la orden a "pagada" vía createAdminClient()
    // (bypass RLS), usando result.merchantRef para conciliar y registrando
    // result.providerTxnId. Hacerlo de forma idempotente (ver nota arriba).
    // const supabase = createAdminClient();
    // await supabase.from("orders").update({ status: "paid", ... })
    //   .eq("merchant_ref", result.merchantRef);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
