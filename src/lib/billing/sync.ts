import "server-only";
import type Stripe from "stripe";
import type { BillingStatus, Plan } from "@prisma/client";
import { prisma } from "@/lib/db";
import { planForPriceId } from "./stripe";
import type { PlanId } from "@/lib/plans";

export function mapStripeStatus(status: Stripe.Subscription.Status): BillingStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "paused":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}

/** Statuses that still grant access to the paid plan (incl. grace period). */
function grantsAccess(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

function toDate(unixSeconds: number | null | undefined): Date | null {
  return unixSeconds ? new Date(unixSeconds * 1000) : null;
}

/** Read the current period bounds tolerantly across Stripe API versions. */
function periodBounds(sub: Stripe.Subscription): {
  start: number | undefined;
  end: number | undefined;
} {
  const top = sub as unknown as {
    current_period_start?: number;
    current_period_end?: number;
  };
  if (top.current_period_start || top.current_period_end) {
    return { start: top.current_period_start, end: top.current_period_end };
  }
  const item = sub.items?.data?.[0] as unknown as {
    current_period_start?: number;
    current_period_end?: number;
  };
  return { start: item?.current_period_start, end: item?.current_period_end };
}

/** Resolve which user a Stripe subscription belongs to. */
async function resolveUserId(sub: Stripe.Subscription): Promise<string | null> {
  const metaUserId = sub.metadata?.userId;
  if (metaUserId) return metaUserId;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!customerId) return null;

  const existing = await prisma.planSubscription.findFirst({
    where: { providerCustomerId: customerId },
    select: { userId: true },
  });
  return existing?.userId ?? null;
}

/**
 * Apply a Stripe subscription's state to our DB: updates the PlanSubscription
 * record and the user's effective plan. The user's plan is set ONLY here (and
 * on cancellation) — never from the browser.
 */
export async function applyStripeSubscription(
  sub: Stripe.Subscription,
): Promise<void> {
  const userId = await resolveUserId(sub);
  if (!userId) return;

  const priceId = sub.items.data[0]?.price?.id;
  const planFromPrice = planForPriceId(priceId);
  const status = mapStripeStatus(sub.status);
  const effectivePlan: PlanId =
    grantsAccess(sub.status) && planFromPrice ? planFromPrice : "FREE";

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  const { start, end } = periodBounds(sub);

  const data = {
    plan: (planFromPrice ?? "FREE") as Plan,
    status,
    provider: "stripe",
    providerCustomerId: customerId,
    providerSubscriptionId: sub.id,
    currentPeriodStart: toDate(start),
    currentPeriodEnd: toDate(end),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  };

  await prisma.$transaction([
    prisma.planSubscription.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    }),
    prisma.user.update({
      where: { id: userId },
      data: { plan: effectivePlan as Plan },
    }),
  ]);
}

/**
 * Subscription ended (deleted). Per spec: after the paid period the user
 * returns to FREE/ACTIVE. Financial data is never deleted.
 */
export async function endSubscription(sub: Stripe.Subscription): Promise<void> {
  const userId = await resolveUserId(sub);
  if (!userId) return;

  await prisma.$transaction([
    prisma.planSubscription.updateMany({
      where: { userId },
      data: {
        plan: "FREE",
        status: "ACTIVE",
        providerSubscriptionId: null,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
        currentPeriodStart: null,
      },
    }),
    prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } }),
  ]);
}
