import { NextResponse, type NextRequest } from "next/server";

import { isBillingConfigured } from "@/lib/env";
import { getAdminSupabase } from "@/lib/supabase/admin";
import {
  verifyWebhook,
  parseWebhookEvent,
  PREMIUM_PRODUCT_IDS,
} from "@/lib/billing/cakto";
import { processBillingEvent } from "@/lib/billing/process";
import { FREE_SUBSCRIPTION, type SubscriptionState } from "@/lib/plans/access";

/**
 * Cakto webhook endpoint.
 *
 * Disabled unless billing is fully configured. Authenticity is verified by the
 * body `secret` (Cakto's scheme). The processing pipeline (idempotency,
 * product allowlist, account binding, out-of-order safety) is complete and
 * tested. Nothing sensitive is logged or stored.
 */
export async function POST(request: NextRequest) {
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: "billing_disabled" }, { status: 404 });
  }

  const db = getAdminSupabase();
  if (!db) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const rawBody = await request.text();

  // 1. Authenticity (constant-time comparison of the body secret).
  const verification = verifyWebhook(rawBody);
  if (!verification.ok) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  // 2. Parse & normalize.
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const event = parseWebhookEvent(payload);
  // Non-access events (pix generated, checkout, etc.) are acknowledged so the
  // provider stops retrying — they simply do not change anything.
  if (!event) {
    return NextResponse.json({ received: true, reason: "ignored" });
  }

  // 3. Account binding. Prefer our echoed opaque ref; otherwise match the
  // customer email to a pending Premium intent (the intent stores the account
  // email set at checkout time). Never bind on a free-text email alone.
  let intent: { id: string; user_id: string } | null = null;

  if (event.intentId) {
    const { data } = await db
      .from("purchase_intents")
      .select("id, user_id")
      .eq("id", event.intentId)
      .maybeSingle();
    if (data) intent = { id: data.id as string, user_id: data.user_id as string };
  }

  if (!intent && event.customerEmail) {
    const { data } = await db
      .from("purchase_intents")
      .select("id, user_id")
      .ilike("email", event.customerEmail)
      .eq("plan", "premium")
      .in("status", ["criada", "em_confirmacao"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) intent = { id: data.id as string, user_id: data.user_id as string };
  }

  if (!intent) {
    // Can't safely tie this payment to an account. Acknowledge (so Cakto stops
    // retrying) but record nothing and grant nothing; reconcile in the panel.
    return NextResponse.json({ received: true, reason: "unbound" });
  }
  const userId = intent.user_id;

  // 4. Idempotency: has this provider event already been processed?
  const { data: existingEvent } = await db
    .from("payment_events")
    .select("id")
    .eq("provider_event_id", event.providerEventId)
    .maybeSingle();
  const alreadyProcessed = Boolean(existingEvent);

  // 5. Current subscription + ordering cursor.
  const { data: subRow } = await db
    .from("subscriptions")
    .select("access_until, revoked, last_event_at")
    .eq("user_id", userId)
    .maybeSingle();
  const current: SubscriptionState = subRow
    ? { accessUntil: subRow.access_until ?? null, revoked: Boolean(subRow.revoked) }
    : FREE_SUBSCRIPTION;

  const result = processBillingEvent(event, {
    current,
    allowedProductIds: PREMIUM_PRODUCT_IDS,
    lastEventAt: (subRow?.last_event_at as string) ?? null,
    alreadyProcessed,
  });

  // 6. Record the event (redacted) for audit/idempotency — once.
  if (!alreadyProcessed) {
    await db.from("payment_events").insert({
      provider_event_id: event.providerEventId,
      user_id: userId,
      intent_id: intent.id,
      type: event.type,
      product_id: event.productId,
      summary: { reason: result.reason, accepted: result.accepted },
    });
  }

  // 7. Apply the state change only when accepted.
  if (result.accepted && result.changed) {
    await db.from("subscriptions").upsert(
      {
        user_id: userId,
        access_until: result.next.accessUntil,
        revoked: result.next.revoked,
        last_event_at: result.lastEventAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (event.type === "payment_confirmed") {
      await db.from("purchase_intents").update({ status: "confirmada" }).eq("id", intent.id);
    }
  }

  // Acknowledge receipt (even for no-op duplicates) so the provider stops retrying.
  return NextResponse.json({ received: true, reason: result.reason });
}
