/**
 * PaymentProvider — abstracción de pasarela de pago.
 * Implementación por defecto: Wompi SV (ver ./wompi.ts).
 * Mantener esta interfaz estable permite cambiar/añadir rails sin tocar el dominio.
 */

export interface CreatePaymentInput {
  /** Identificador único del comercio para conciliar (idempotencia). */
  merchantRef: string;
  /** Monto en centavos (USD). */
  amountCents: number;
  /** Nombre/descripción mostrada al comprador. */
  productName: string;
  /** URL a la que Wompi notificará el resultado. */
  webhookUrl: string;
  /** URL de retorno tras pagar. */
  redirectUrl?: string;
}

export interface CreatePaymentResult {
  /** Id del enlace/transacción en el proveedor. */
  providerRef: string;
  /** URL hosted del checkout para redirigir al comprador. */
  checkoutUrl: string;
  /** QR opcional. */
  qrUrl?: string;
}

export interface WebhookResult {
  ok: boolean;
  merchantRef?: string;
  providerTxnId?: string;
  approved?: boolean;
  amountCents?: number;
  paymentMethod?: string;
  authCode?: string;
  raw?: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  /** Valida firma/hash del webhook y normaliza el payload. */
  verifyWebhook(payload: unknown, signature?: string): Promise<WebhookResult>;
}
