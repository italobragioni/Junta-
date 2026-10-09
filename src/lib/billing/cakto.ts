import "server-only";

import { env, isBillingConfigured } from "@/lib/env";
import type { NormalizedBillingEvent } from "./types";

/**
 * Cakto adapter.
 *
 * ⚠️ PENDING REAL INTEGRATION. The spec forbids inventing endpoints, event
 * names, webhook signature schemes or account-binding fields. Those marked
 * TODO below MUST be implemented against Cakto's current official docs:
 *   - https://www.cakto.com.br/assinaturas
 *   - https://ajuda.cakto.com.br/pt-br/articles/103-como-utilizar-a-api-da-cakto-para-integracoes-personalizadas
 *
 * Until BILLING is fully configured (CIVIO_BILLING_ENABLED=true plus secret,
 * checkout base URL and service role key), checkout and webhooks stay
 * disabled. There is never a public "become Premium" button in production.
 */

export const PREMIUM_PRODUCT_IDS: string[] = (
  env.caktoCheckoutBaseUrl ? (process.env.CAKTO_PREMIUM_PRODUCT_IDS ?? "") : ""
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function billingAvailable(): boolean {
  return isBillingConfigured();
}

/**
 * Build the hosted-checkout URL for a created purchase intent.
 *
 * TODO(cakto): confirm, from the official docs, how an opaque reference is
 * attached to a Cakto hosted checkout (query param name, metadata field, or a
 * server-side "create checkout" API call) so the webhook can be correlated
 * back to `intentId`. The placeholder below MUST be replaced — do not ship a
 * guessed parameter name.
 */
export function buildCheckoutUrl(intentId: string): string | null {
  if (!billingAvailable() || !env.caktoCheckoutBaseUrl) return null;
  const base = env.caktoCheckoutBaseUrl;
  // Placeholder correlation — replace with the documented mechanism.
  const url = new URL(base);
  url.searchParams.set("ref", intentId);
  return url.toString();
}

export interface WebhookVerification {
  ok: boolean;
  reason: string;
}

/**
 * Verify a webhook's authenticity.
 *
 * TODO(cakto): implement the real signature verification from the official
 * docs (header name + HMAC/secret scheme). This MUST return { ok: false }
 * until implemented, so that in a misconfigured or not-yet-integrated state no
 * webhook can ever grant access.
 */
export function verifyWebhook(
  _rawBody: string,
  _headers: Headers,
): WebhookVerification {
  if (!billingAvailable()) {
    return { ok: false, reason: "billing_disabled" };
  }
  // Not yet implemented against real docs — deny by default.
  return { ok: false, reason: "signature_verification_not_implemented" };
}

/**
 * Map a verified provider payload to our normalized event.
 *
 * TODO(cakto): implement the real payload → NormalizedBillingEvent mapping
 * (event type names, product id field, paid-through field, intent reference
 * field) from the official docs. Returns null until implemented.
 */
export function parseWebhookEvent(
  _payload: unknown,
): NormalizedBillingEvent | null {
  return null;
}
