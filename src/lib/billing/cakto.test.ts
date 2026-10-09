import { describe, expect, it } from "vitest";

import { parseWebhookEvent } from "./cakto";

/**
 * Locks the Cakto payload -> normalized event mapping against the official
 * event identifiers (docs.cakto.com.br, consulted 2026-10-09). The exact
 * subscription paid-through field still needs a live test before go-live.
 */
function payload(event: string, extra: Record<string, unknown> = {}) {
  return {
    event,
    secret: "whatever",
    data: {
      id: "ord_123",
      status: "paid",
      product: { id: "prod_premium" },
      customer: { email: "aluno@example.com" },
      amount: 1990,
      paidAt: "2026-06-15T00:00:00Z",
      ...extra,
    },
  };
}

describe("parseWebhookEvent (Cakto)", () => {
  it("maps purchase_approved to a granting event with a 31-day period", () => {
    const e = parseWebhookEvent(payload("purchase_approved"))!;
    expect(e.type).toBe("payment_confirmed");
    expect(e.productId).toBe("prod_premium");
    expect(e.customerEmail).toBe("aluno@example.com");
    expect(e.providerEventId).toBe("purchase_approved:ord_123");
    expect(e.paidThrough).toBe("2026-07-16T00:00:00.000Z"); // +31 days
  });

  it("maps refund and chargeback to reversals (no paid-through)", () => {
    expect(parseWebhookEvent(payload("refund"))!.type).toBe("payment_refunded");
    expect(parseWebhookEvent(payload("chargeback"))!.type).toBe("chargeback");
    expect(parseWebhookEvent(payload("refund"))!.paidThrough).toBeNull();
  });

  it("maps subscription renew/cancel", () => {
    expect(parseWebhookEvent(payload("subscription_renewed"))!.type).toBe("subscription_renewed");
    expect(parseWebhookEvent(payload("subscription_canceled"))!.type).toBe("subscription_canceled");
  });

  it("ignores non-access events", () => {
    expect(parseWebhookEvent(payload("pix_gerado"))).toBeNull();
    expect(parseWebhookEvent(payload("checkout_abandonment"))).toBeNull();
    expect(parseWebhookEvent({ foo: "bar" })).toBeNull();
  });

  it("reads product id when data.product is a plain string", () => {
    const e = parseWebhookEvent(payload("purchase_approved", { product: "prod_str" }))!;
    expect(e.productId).toBe("prod_str");
  });
});
