import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, webhookSecret } from "@/lib/billing/stripe";
import { applyStripeSubscription, endSubscription } from "@/lib/billing/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = webhookSecret();
  if (!stripe || !secret) {
    // Payments not configured — nothing to process.
    return NextResponse.json({ received: true, skipped: true });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    // Never trust an unverified payload.
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  async function applyBySubscriptionId(subscriptionId: string | null) {
    if (!subscriptionId || !stripe) return;
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    await applyStripeSubscription(sub);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;
        await applyBySubscriptionId(subId);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await applyStripeSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.deleted": {
        await endSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "invoice.payment_failed":
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription?: string | { id: string } | null;
        };
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id ?? null;
        await applyBySubscriptionId(subId);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Log without sensitive financial data.
    console.error("Stripe webhook handler error:", (err as Error).message);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
