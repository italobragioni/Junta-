"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { billingAvailable, buildCheckoutUrl, PREMIUM_PRODUCT_IDS } from "@/lib/billing/cakto";

/**
 * Start a Premium purchase. Creates an opaque purchase intent bound to the
 * account on the SERVER, then sends the user to the hosted checkout. Access is
 * NEVER granted here — only a verified provider webhook can do that.
 *
 * If billing is not fully configured, this does nothing and the UI shows that
 * checkout is unavailable. There is no public "become Premium" shortcut.
 */
export async function startCheckoutAction(): Promise<{ ok: boolean; error?: string }> {
  if (!billingAvailable()) {
    return { ok: false, error: "A cobrança não está configurada neste ambiente." };
  }
  const user = await getCurrentUser();
  const db = getAdminSupabase();
  if (!user || !db) return { ok: false, error: "Sessão expirada." };

  const productId = PREMIUM_PRODUCT_IDS[0] ?? null;
  const { data: intent, error } = await db
    .from("purchase_intents")
    .insert({
      user_id: user.id,
      plan: "premium",
      product_id: productId,
      status: "criada",
      // Stored so the webhook can bind the payment to this account by email.
      email: user.email ?? null,
    })
    .select("id")
    .single();
  if (error || !intent) return { ok: false, error: "Não foi possível iniciar a compra." };

  const url = buildCheckoutUrl(intent.id as string);
  if (!url) return { ok: false, error: "Checkout indisponível." };

  await db.from("purchase_intents").update({ status: "em_confirmacao" }).eq("id", intent.id);
  redirect(url);
}
