import "server-only";
import crypto from "node:crypto";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  WebhookResult,
} from "./provider";

/**
 * Wompi SV — pasarela local de El Salvador (grupo Banco Agrícola / Bancolombia).
 * Docs: https://docs.wompi.sv  (+ https://docs.wompi.sv/llms.txt)
 *
 * Flujo: client_credentials -> access token -> crear "Enlace de Pago" hosted.
 * El webhook llega con datos de la transacción; se valida un hash con el secreto.
 *
 * NOTA (M3): confirmar contra docs.wompi.sv los nombres exactos de endpoint/campos
 * y el algoritmo de hash del webhook antes de producción. Los hosts son overridables
 * por env para sandbox vs producción.
 */

const ID_URL =
  process.env.WOMPI_ID_URL ?? "https://id.wompi.sv/connect/token";
const API_URL = process.env.WOMPI_API_URL ?? "https://api.wompi.sv";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.WOMPI_APP_ID!,
    client_secret: process.env.WOMPI_API_SECRET!,
    audience: "wompi_api",
  });
  const res = await fetch(ID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Wompi auth failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return json.access_token;
}

export class WompiProvider implements PaymentProvider {
  readonly name = "wompi";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/EnlacePago`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        identificadorEnlaceComercio: input.merchantRef,
        monto: input.amountCents / 100,
        nombreProducto: input.productName,
        configuracion: {
          urlWebhook: input.webhookUrl,
          urlRetorno: input.redirectUrl,
          esMontoEditable: false,
          esCantidadEditable: false,
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Wompi createPayment failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as {
      idEnlace: number;
      urlEnlace: string;
      urlQrCodeEnlace?: string;
    };
    return {
      providerRef: String(json.idEnlace),
      checkoutUrl: json.urlEnlace,
      qrUrl: json.urlQrCodeEnlace,
    };
  }

  async verifyWebhook(payload: unknown): Promise<WebhookResult> {
    const data = (payload ?? {}) as Record<string, unknown>;
    // Campos concatenados por Wompi para validar el hash:
    // idTransaccion + monto + esReal + formaPago + esAprobada + codigoAutorizacion + mensaje
    const concat = [
      data.idTransaccion,
      data.monto,
      data.esReal,
      data.formaPago,
      data.esAprobada,
      data.codigoAutorizacion,
      data.mensaje,
    ].join("");
    const expected = crypto
      .createHmac("sha256", process.env.WOMPI_WEBHOOK_SECRET ?? "")
      .update(concat)
      .digest("hex");
    const provided = String(data.hash ?? data.firma ?? "");
    const ok =
      !!provided &&
      crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(provided.padEnd(expected.length).slice(0, expected.length)),
      );

    return {
      ok,
      merchantRef: data.identificadorEnlaceComercio as string | undefined,
      providerTxnId: data.idTransaccion ? String(data.idTransaccion) : undefined,
      approved: data.esAprobada === true || data.esAprobada === "true",
      amountCents:
        typeof data.monto === "number" ? Math.round(data.monto * 100) : undefined,
      paymentMethod: data.formaPago as string | undefined,
      authCode: data.codigoAutorizacion as string | undefined,
      raw: payload,
    };
  }
}

export const wompi = new WompiProvider();
