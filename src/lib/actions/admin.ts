"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/env";
import type { ActionResult } from "@/lib/action-result";

/** Garante que quem chama é admin. Retorna o client service-role ou null. */
async function adminService(): Promise<ReturnType<typeof getAdminSupabase> | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return getAdminSupabase();
}

/** Libera Premium manualmente para o usuário com o e-mail informado. */
export async function grantPremiumByEmail(emailRaw: string): Promise<ActionResult> {
  const service = await adminService();
  if (!service) return { ok: false, error: "Acesso negado ou chave de servidor ausente." };

  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!email) return { ok: false, error: "Informe o e-mail." };

  const { data: profile } = await service
    .from("profiles").select("id, email").ilike("email", email).maybeSingle();
  if (!profile) {
    return {
      ok: false,
      error: "Nenhuma conta com esse e-mail. Peça para a pessoa CRIAR a conta no Finora com esse mesmo e-mail e tente de novo.",
    };
  }

  const periodEnd = new Date(Date.now() + 31 * 86_400_000).toISOString();
  const { error } = await service.from("subscriptions").upsert(
    {
      user_id: profile.id as string,
      status: "active",
      plan: "premium",
      current_period_end: periodEnd,
      cakto_customer_email: email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) return { ok: false, error: error.message };

  // Auditoria
  await service.from("billing_events").insert({
    id: `manual_grant:${profile.id}:${Date.now()}`,
    event: "manual_grant",
    user_id: profile.id as string,
    customer_email: email,
    raw: { by: "admin" },
  });

  revalidatePath("/admin");
  return { ok: true, message: `Premium liberado para ${email} por 31 dias.` };
}

/** Revoga o Premium de um usuário pelo e-mail (volta para gratuito). */
export async function revokePremiumByEmail(emailRaw: string): Promise<ActionResult> {
  const service = await adminService();
  if (!service) return { ok: false, error: "Acesso negado ou chave de servidor ausente." };

  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!email) return { ok: false, error: "Informe o e-mail." };

  const { data: profile } = await service
    .from("profiles").select("id").ilike("email", email).maybeSingle();
  if (!profile) return { ok: false, error: "Nenhuma conta com esse e-mail." };

  const { error } = await service.from("subscriptions").upsert(
    {
      user_id: profile.id as string,
      status: "canceled",
      plan: "free",
      current_period_end: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  return { ok: true, message: `Premium revogado para ${email}.` };
}
