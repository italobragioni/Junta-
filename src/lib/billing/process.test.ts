import { describe, expect, it } from "vitest";

import { processBillingEvent } from "./process";
import type { NormalizedBillingEvent, ProcessContext } from "./types";
import { FREE_SUBSCRIPTION, type SubscriptionState } from "@/lib/plans/access";

/**
 * Fixtures are explicitly synthetic — they stand in for the real Cakto payload
 * mapping, which is pending the provider's official docs. These tests exercise
 * the provider-agnostic invariants only.
 */
const ALLOWED = ["prod_premium_mensal"];

function evt(partial: Partial<NormalizedBillingEvent>): NormalizedBillingEvent {
  return {
    providerEventId: "evt_1",
    type: "payment_confirmed",
    intentId: "intent_1",
    customerEmail: "aluno@example.com",
    productId: "prod_premium_mensal",
    paidThrough: "2026-07-15T00:00:00Z",
    occurredAt: "2026-06-15T00:00:00Z",
    ...partial,
  };
}

function ctx(partial: Partial<ProcessContext> = {}): ProcessContext {
  return {
    current: FREE_SUBSCRIPTION,
    allowedProductIds: ALLOWED,
    lastEventAt: null,
    alreadyProcessed: false,
    ...partial,
  };
}

describe("processBillingEvent", () => {
  it("confirms a payment and grants access", () => {
    const r = processBillingEvent(evt({}), ctx());
    expect(r.accepted).toBe(true);
    expect(r.next.accessUntil).toBe("2026-07-15T00:00:00Z");
    expect(r.next.revoked).toBe(false);
  });

  it("is idempotent: a duplicate event changes nothing", () => {
    const r = processBillingEvent(evt({}), ctx({ alreadyProcessed: true }));
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe("duplicate");
    expect(r.changed).toBe(false);
  });

  it("rejects events for products not on the allowlist", () => {
    const r = processBillingEvent(evt({ productId: "prod_outro" }), ctx());
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe("product_not_allowed");
  });

  it("ignores an event older than one already applied (out of order)", () => {
    const r = processBillingEvent(
      evt({ occurredAt: "2026-06-01T00:00:00Z" }),
      ctx({ lastEventAt: "2026-06-10T00:00:00Z" }),
    );
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe("stale");
  });

  it("revokes access on refund/chargeback", () => {
    const current: SubscriptionState = { accessUntil: "2026-07-15T00:00:00Z", revoked: false };
    const r = processBillingEvent(
      evt({ type: "payment_refunded", providerEventId: "evt_refund", occurredAt: "2026-06-20T00:00:00Z" }),
      ctx({ current }),
    );
    expect(r.accepted).toBe(true);
    expect(r.next.revoked).toBe(true);
  });

  it("does NOT un-revoke reversed access with a later renewal event", () => {
    const revoked: SubscriptionState = { accessUntil: "2026-07-15T00:00:00Z", revoked: true };
    const r = processBillingEvent(
      evt({ type: "subscription_renewed", providerEventId: "evt_renew", occurredAt: "2026-06-25T00:00:00Z" }),
      ctx({ current: revoked }),
    );
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe("already_revoked");
    expect(r.next.revoked).toBe(true);
  });

  it("cancellation preserves already-paid access until period end", () => {
    const current: SubscriptionState = { accessUntil: "2026-07-15T00:00:00Z", revoked: false };
    const r = processBillingEvent(
      evt({ type: "subscription_canceled", providerEventId: "evt_cancel", occurredAt: "2026-06-20T00:00:00Z" }),
      ctx({ current }),
    );
    expect(r.accepted).toBe(true);
    expect(r.next.accessUntil).toBe("2026-07-15T00:00:00Z"); // untouched
  });
});
