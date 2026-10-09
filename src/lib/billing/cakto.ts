import "server-only";

import crypto from "node:crypto";

import { env, isBillingConfigured } from "@/lib/env";
import type { NormalizedBillingEvent, NormalizedEventType } from "./types";

/**
 * Cakto adapter — implemented against the official docs
 * (https://docs.cakto.com.br, Webhooks / API reference, consulted 2026-10-09).
 *
 * Confirmed from the docs:
 *  - Webhook payload is `{ event, secret, data }`. Authenticity is validated by
 *    comparing the body's `secret` to the webhook's configured secret (Cakto
 *    sends the secret IN THE BODY; there is no HMAC signature header).
 *  - Event identifiers (`custom_id`): purchase_approved, refund, chargeback,
 *    subscription_renewed, subscription_canceled, subscription_renewal_refused,
 *    etc. A webhook is created via POST /public_api/webhook/ bound to products.
 *  - `data` carries `id`, `status`, `product`, `customer` (with email),
 *    `amount`, `paidAt`.
 *
 * STILL VERIFY WITH A LIVE TEST EVENT before go-live (see README): the exact
 * field for a subscription's paid-through date, and whether Cakto echoes a
 * custom reference. Until CIVIO_BILLING_ENABLED=true (plus secret, checkout URL
 * and service role), checkout and webhooks stay disabled.
 */

export const PREMIUM_PRODUCT_IDS: string[] = (process.env.CAKTO_PREMIUM_PRODUCT_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Default paid period granted per confirmed charge (monthly plan). */
const PERIOD_DAYS = 31;

export function billingAvailable(): boolean {
  return isBillingConfigured();
}

/**
 * Hosted-checkout URL for a created purchase intent. CAKTO_CHECKOUT_BASE_URL is
 * the product's checkout link. We append our opaque intent id as `ref` — Cakto
 * returns it only if configured to; account binding does not depend on it (the
 * webhook also matches by customer email), so this is a best-effort stronger
 * signal, not a trusted parameter.
 */
export function buildCheckoutUrl(intentId: string): string | null {
  if (!billingAvailable() || !env.caktoCheckoutBaseUrl) return null;
  try {
    const url = new URL(env.caktoCheckoutBaseUrl);
    url.searchParams.set("ref", intentId);
    return url.toString();
  } catch {
    return null;
  }
}

export interface WebhookVerification {
  ok: boolean;
  reason: string;
}

/** Constant-time string comparison (avoids timing leaks on the secret). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Verify authenticity by comparing the payload's `secret` to the configured
 * webhook secret, in constant time. Denies whenever billing is off, the secret
 * is missing, or it does not match — so a misconfigured deploy never grants
 * access.
 */
export function verifyWebhook(rawBody: string): WebhookVerification {
  if (!billingAvailable() || !env.caktoWebhookSecret) {
    return { ok: false, reason: "billing_disabled" };
  }
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false, reason: "invalid_json" };
  }
  const secret =
    body && typeof body === "object" ? (body as Record<string, unknown>).secret : undefined;
  if (typeof secret !== "string" || secret.length === 0) {
    return { ok: false, reason: "missing_secret" };
  }
  if (!safeEqual(secret, env.caktoWebhookSecret)) {
    return { ok: false, reason: "secret_mismatch" };
  }
  return { ok: true, reason: "ok" };
}

/** Cakto event custom_id -> our access-affecting normalized type (or null). */
const EVENT_MAP: Record<string, NormalizedEventType> = {
  purchase_approved: "payment_confirmed",
  subscription_renewed: "subscription_renewed",
  subscription_canceled: "subscription_canceled",
  refund: "payment_refunded",
  chargeback: "chargeback",
};

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

/** Extract a product id from `data.product` (string or object with id). */
function productId(data: Record<string, unknown>): string {
  const p = data.product;
  if (typeof p === "string") return p;
  const id = asRecord(p).id;
  return typeof id === "string" ? id : "";
}

/**
 * Map a verified Cakto payload to our normalized event. Returns null for events
 * that do not affect access (checkout started, pix generated, etc.), which the
 * route simply acknowledges.
 */
export function parseWebhookEvent(payload: unknown): NormalizedBillingEvent | null {
  const root = asRecord(payload);
  const eventName = str(root.event);
  if (!eventName) return null;
  const type = EVENT_MAP[eventName];
  if (!type) return null; // not access-affecting

  const data = asRecord(root.data);
  const customer = asRecord(data.customer);
  const occurredAt = str(data.paidAt) ?? new Date().toISOString();

  const grants = type === "payment_confirmed" || type === "subscription_renewed";
  const paidThrough = grants
    ? new Date(new Date(occurredAt).getTime() + PERIOD_DAYS * 86_400_000).toISOString()
    : null;

  // Idempotency key: event name + order id dedupes provider resends, which
  // replay the original stored payload.
  const orderId = str(data.id) ?? "";
  const providerEventId = `${eventName}:${orderId}`;

  return {
    providerEventId,
    type,
    intentId: str(root.ref) ?? str(data.ref) ?? "",
    customerEmail: str(customer.email),
    productId: productId(data),
    paidThrough,
    occurredAt,
  };
}
