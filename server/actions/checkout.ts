"use server";

import { randomUUID } from "node:crypto";
import { wompi } from "@/lib/payments/wompi";
import type { CartLine } from "@/lib/types";

export interface CheckoutCustomer {
  name: string;
  email: string;
  address: string;
}

export interface CheckoutPayload {
  lines: Pick<CartLine, "id" | "title" | "priceCents" | "qty">[];
  customer: CheckoutCustomer;
}

export interface CheckoutResult {
  url?: string;
  demo?: boolean;
  error?: string;
}

export async function createCheckout(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  try {
    const { lines } = payload;

    if (!lines || lines.length === 0) {
      return { error: "El carrito está vacío." };
    }

    const amountCents = lines.reduce(
      (sum, line) => sum + line.priceCents * line.qty,
      0,
    );

    if (amountCents <= 0) {
      return { error: "El monto total no es válido." };
    }

    // merchantRef único y conciliable (sin Math.random / Date.now).
    const merchantRef = `sivarart-${randomUUID()}`;

    // Modo demo: sin credenciales de Wompi configuradas.
    if (!process.env.WOMPI_APP_ID) {
      return { demo: true, url: "/tienda/checkout/success?demo=1" };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const { checkoutUrl } = await wompi.createPayment({
      merchantRef,
      amountCents,
      productName: "Compra SivarArt",
      webhookUrl: `${siteUrl}/api/webhooks/wompi`,
      redirectUrl: `${siteUrl}/tienda/checkout/success`,
    });

    return { url: checkoutUrl };
  } catch (err) {
    console.error("createCheckout error:", err);
    return {
      error: "No se pudo iniciar el pago. Intentá de nuevo en unos minutos.",
    };
  }
}
