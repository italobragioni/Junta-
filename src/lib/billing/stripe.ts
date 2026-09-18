import "server-only";
import Stripe from "stripe";
import type { PlanId } from "@/lib/plans";

/**
 * Stripe is optional in development. Every helper degrades gracefully when the
 * keys are absent so the app keeps working without payments configured.
 */

let cached: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return cached;
}

export function priceIdForPlan(plan: PlanId): string | null {
  if (plan === "BASIC") return process.env.STRIPE_BASIC_PRICE_ID ?? null;
  if (plan === "PRO") return process.env.STRIPE_PRO_PRICE_ID ?? null;
  return null;
}

/** Maps a Stripe price id back to our plan. */
export function planForPriceId(priceId: string | null | undefined): PlanId | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return "BASIC";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "PRO";
  return null;
}

export function webhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}
