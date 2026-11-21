import { NextResponse } from "next/server";
import { env, isBillingConfigured } from "@/lib/env";
import { getAdminSupabase } from "@/lib/supabase/admin";
import {
  verifyCaktoWebhook, resolveAction, firstData, type CaktoWebhook, type BillingAction,
} from "@/lib/billing/cakto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: "billing_disabled" }, { status: 503 });
  }

  const raw = await request.text();
  if (!verifyCaktoWebhook(raw, request.headers, env.caktoWebhookSecret!)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: CaktoWebhook;
  try {
    payload = JSON.parse(raw) as CaktoWebhook;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "no_admin" }, { status: 503 });

  const data = firstData(payload);
  const action = resolveAction(payload.event, data?.status);
  const eventId = data?.id || `${payload.event}:${Date.now()}`;

  // Idempotência: se já processamos este pedido/evento, responde 200 e sai.
  const { data: existing } = await supabase
    .from("billing_events").select("id").eq("id", eventId).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, deduped: true });

  const email = data?.customer?.email?.trim().toLowerCase() || null;
  // Identificador do usuário que mandamos no link (callback e/ou sck).
  const ref = (data?.callback?.trim() || data?.sck?.trim() || "").trim();

  // Descobre o usuário: por id (callback/sck) e, se não achar, pelo e-mail.
  let userId: string | null = null;
  if (ref && UUID_RE.test(ref)) {
    const { data: p } = await supabase.from("profiles").select("id").eq("id", ref).maybeSingle();
    if (p) userId = p.id as string;
  }
  if (!userId && email) {
    const { data: p } = await supabase.from("profiles").select("id").ilike("email", email).maybeSingle();
    if (p) userId = p.id as string;
  }

  // Registra o evento (auditoria + idempotência), mesmo sem achar o usuário.
  await supabase.from("billing_events").insert({
    id: eventId, event: payload.event, user_id: userId, customer_email: email, raw: payload as unknown as object,
  });

  if (userId && action !== "ignore") {
    await applyAction(supabase, userId, action, { email, orderId: data?.id ?? null, subId: data?.subscription?.id ?? null });
  }

  return NextResponse.json({ ok: true });
}

type Admin = NonNullable<ReturnType<typeof getAdminSupabase>>;

async function applyAction(
  supabase: Admin,
  userId: string,
  action: BillingAction,
  info: { email: string | null; orderId: string | null; subId: string | null },
) {
  const now = new Date();
  const base = {
    user_id: userId,
    cakto_customer_email: info.email,
    cakto_order_id: info.orderId,
    cakto_subscription_id: info.subId,
    updated_at: now.toISOString(),
  };

  if (action === "activate") {
    const periodEnd = new Date(now.getTime() + 31 * 86_400_000);
    await supabase.from("subscriptions").upsert(
      { ...base, status: "active", plan: "premium", current_period_end: periodEnd.toISOString() },
      { onConflict: "user_id" },
    );
  } else if (action === "past_due") {
    await supabase.from("subscriptions").upsert(
      { ...base, status: "past_due" },
      { onConflict: "user_id" },
    );
  } else if (action === "deactivate") {
    // Cancelado: mantém Premium até o fim do período já pago (carência).
    await supabase.from("subscriptions").upsert(
      { ...base, status: "canceled" },
      { onConflict: "user_id" },
    );
  } else if (action === "revoke") {
    // Estorno/chargeback: revoga imediatamente.
    await supabase.from("subscriptions").upsert(
      { ...base, status: "canceled", plan: "free", current_period_end: now.toISOString() },
      { onConflict: "user_id" },
    );
  }
}
