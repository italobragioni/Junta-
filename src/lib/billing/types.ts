import type { SubscriptionState } from "@/lib/plans/access";

/**
 * Provider-agnostic, normalized billing event. The Cakto adapter is
 * responsible for turning a verified webhook payload into one of these. The
 * exact provider payload shape, event names and signature scheme are NOT
 * invented here — they must be filled in from Cakto's official documentation
 * (see src/lib/billing/cakto.ts).
 */
export type NormalizedEventType =
  | "payment_confirmed" // first paid period / purchase confirmed
  | "subscription_renewed" // a new paid period
  | "subscription_canceled" // renewal cancelled; keep access until period end
  | "payment_refunded" // reverse access
  | "chargeback"; // reverse access

export interface NormalizedBillingEvent {
  /** Provider's unique event id — the idempotency key. */
  providerEventId: string;
  type: NormalizedEventType;
  /** Our opaque purchase-intent id that ties this to a specific account. */
  intentId: string;
  /** Provider product/plan id — must be on the allowlist to be honored. */
  productId: string;
  /** New paid-through instant (ISO) for confirm/renew events. */
  paidThrough: string | null;
  /** When the event occurred at the provider (ISO) — for ordering. */
  occurredAt: string;
}

export interface ProcessContext {
  current: SubscriptionState;
  /** Allowed provider product ids for the Premium plan. */
  allowedProductIds: string[];
  /** ISO timestamp of the newest event already applied to this subscription. */
  lastEventAt: string | null;
  /** True if this providerEventId was already processed (idempotency). */
  alreadyProcessed: boolean;
}

export interface ProcessResult {
  /** The subscription state after applying the event. */
  next: SubscriptionState;
  /** Whether this call changed anything (false for duplicates/ignored). */
  changed: boolean;
  /** Whether the event was accepted as valid for processing. */
  accepted: boolean;
  reason:
    | "applied"
    | "duplicate"
    | "stale" // older than an event already applied
    | "product_not_allowed"
    | "already_revoked";
  /** New lastEventAt to persist when accepted. */
  lastEventAt: string | null;
}
