import type { SubscriptionState } from "@/lib/plans/access";
import type {
  NormalizedBillingEvent,
  ProcessContext,
  ProcessResult,
} from "./types";

/**
 * Pure reducer that applies a normalized, already-authenticated billing event
 * to a subscription. This is where the invariants live, independent of the
 * provider:
 *
 *  - idempotency: a duplicate providerEventId changes nothing.
 *  - product allowlist: an event for an unknown product is rejected.
 *  - out-of-order safety: an event older than one already applied is ignored,
 *    and a refund/chargeback revocation is sticky — a stale renewal can never
 *    un-revoke reversed access.
 *  - cancellation preserves already-paid access until the period ends (we
 *    simply stop extending; accessUntil is left as-is).
 *
 * Account binding (that intentId belongs to this user) is enforced by the
 * caller before this runs.
 */
export function processBillingEvent(
  event: NormalizedBillingEvent,
  ctx: ProcessContext,
): ProcessResult {
  if (ctx.alreadyProcessed) {
    return {
      next: ctx.current,
      changed: false,
      accepted: false,
      reason: "duplicate",
      lastEventAt: ctx.lastEventAt,
    };
  }

  if (!ctx.allowedProductIds.includes(event.productId)) {
    return {
      next: ctx.current,
      changed: false,
      accepted: false,
      reason: "product_not_allowed",
      lastEventAt: ctx.lastEventAt,
    };
  }

  const isStale =
    ctx.lastEventAt !== null &&
    new Date(event.occurredAt).getTime() < new Date(ctx.lastEventAt).getTime();

  if (isStale) {
    return {
      next: ctx.current,
      changed: false,
      accepted: false,
      reason: "stale",
      lastEventAt: ctx.lastEventAt,
    };
  }

  const current = ctx.current;

  switch (event.type) {
    case "payment_refunded":
    case "chargeback": {
      const next: SubscriptionState = { ...current, revoked: true };
      return {
        next,
        changed: !current.revoked,
        accepted: true,
        reason: "applied",
        lastEventAt: event.occurredAt,
      };
    }

    case "payment_confirmed":
    case "subscription_renewed": {
      // A renewal/confirmation never resurrects access that was reversed.
      // Clearing a revocation requires an explicit reconciliation path, not a
      // webhook, so a replayed/stale "renew" cannot bypass a refund.
      if (current.revoked) {
        return {
          next: current,
          changed: false,
          accepted: false,
          reason: "already_revoked",
          lastEventAt: ctx.lastEventAt,
        };
      }
      const next: SubscriptionState = {
        accessUntil: event.paidThrough ?? current.accessUntil,
        revoked: false,
      };
      return {
        next,
        changed: next.accessUntil !== current.accessUntil,
        accepted: true,
        reason: "applied",
        lastEventAt: event.occurredAt,
      };
    }

    case "subscription_canceled": {
      // Stop extending; keep the already-paid accessUntil untouched.
      return {
        next: current,
        changed: false,
        accepted: true,
        reason: "applied",
        lastEventAt: event.occurredAt,
      };
    }
  }
}
