import "server-only";

import crypto from "crypto";

/**
 * Verificação de webhook da Cakto.
 *
 * A Cakto entrega a assinatura no header `X-Cakto-Signature: v1=<hmac>` (HMAC
 * SHA-256 sobre `{timestamp}.{corpo bruto}`, com o segredo do webhook) e o
 * timestamp em `X-Cakto-Timestamp`. Também inclui `secret` no corpo.
 *
 * Validamos o HMAC quando o header existe (mais seguro); caso contrário,
 * comparamos o `secret` do corpo em tempo constante.
 */
export function verifyCaktoWebhook(
  rawBody: string,
  headers: Headers,
  secret: string,
): boolean {
  if (!secret) return false;

  const signature = headers.get("x-cakto-signature");
  const timestamp = headers.get("x-cakto-timestamp");

  if (signature && timestamp) {
    // Rejeita timestamps muito antigos/futuros (janela de 5 minutos).
    const ts = Number(timestamp);
    if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");
    const provided = signature.replace(/^v1=/, "");
    return safeEqual(provided, expected);
  }

  // Fallback: compara o `secret` enviado no corpo.
  try {
    const body = JSON.parse(rawBody) as { secret?: string };
    return typeof body.secret === "string" && safeEqual(body.secret, secret);
  } catch {
    return false;
  }
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export type BillingAction = "activate" | "deactivate" | "past_due" | "revoke" | "ignore";

/** Decide o que cada evento da Cakto faz com a assinatura do usuário. */
export function classifyCaktoEvent(event: string): BillingAction {
  switch (event) {
    // Pagamento aprovado / assinatura ativa
    case "purchase_approved":
    case "subscription_created":
    case "subscription_renewed":
    case "subscription_resumed":
    case "subscription_late_recovered":
      return "activate";
    // Falha temporária — mantém acesso até o fim do período (carência)
    case "subscription_late":
    case "subscription_paused":
    case "subscription_renewal_refused":
      return "past_due";
    // Cancelamento — mantém até o fim do período já pago
    case "subscription_canceled":
      return "deactivate";
    // Estorno / chargeback — revoga imediatamente
    case "refund":
    case "chargeback":
      return "revoke";
    default:
      return "ignore";
  }
}

export interface CaktoData {
  id?: string;
  refId?: string;
  status?: string;
  callback?: string;
  sck?: string;
  customer?: { email?: string; name?: string };
  offer?: { id?: string; name?: string; price?: number };
  product?: { id?: string; short_id?: string; name?: string };
  subscription?: { id?: string } | null;
}

/**
 * Decide a ação considerando o evento E o status do pagamento. É uma rede de
 * segurança: se o nome do evento não for reconhecido mas o status indicar
 * pagamento aprovado, ativamos mesmo assim (e revogamos em estorno).
 */
export function resolveAction(event: string, status?: string): BillingAction {
  const byEvent = classifyCaktoEvent(event);
  if (byEvent !== "ignore") return byEvent;
  const s = (status ?? "").toLowerCase();
  if (s === "paid" || s === "approved" || s === "active") return "activate";
  if (s === "refunded" || s === "chargedback") return "revoke";
  if (s === "canceled") return "deactivate";
  return "ignore";
}

export interface CaktoWebhook {
  event: string;
  secret?: string;
  data: CaktoData | CaktoData[];
}

/** Normaliza o `data` (o webhook V2 pode mandar um array). */
export function firstData(payload: CaktoWebhook): CaktoData | null {
  if (Array.isArray(payload.data)) return payload.data[0] ?? null;
  return payload.data ?? null;
}
