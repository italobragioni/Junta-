"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCtx, dbError } from "./helpers";
import { profileSchema, onboardingSchema, categorySchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function saveProfile(raw: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ display_name: d.displayName, timezone: d.timezone, theme: d.theme })
    .eq("id", ctx.userId);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/configuracoes");
  return { ok: true, message: "Perfil atualizado." };
}

/** Conclui o onboarding e já cria os primeiros registros opcionais. */
export async function completeOnboarding(raw: unknown): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const update: Record<string, unknown> = {
    onboarding_completed: true,
    monthly_income_cents: d.monthlyIncomeCents,
  };
  if (d.displayName) update.display_name = d.displayName;
  if (d.primaryGoal) update.primary_goal = d.primaryGoal;

  const { error } = await ctx.supabase.from("profiles").update(update).eq("id", ctx.userId);
  if (error) return { ok: false, error: dbError(error.message) };
  return { ok: true };
}

export async function skipOnboarding(): Promise<void> {
  const auth = await requireCtx();
  if (!("error" in auth)) {
    await auth.ctx.supabase.from("profiles").update({ onboarding_completed: true }).eq("id", auth.ctx.userId);
  }
  redirect("/painel");
}

/** Cria a conta inicial do usuário durante o onboarding. */
export async function createInitialAccount(name: string, balanceCents: number): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("accounts").insert({
    user_id: auth.ctx.userId,
    name: name || "Conta principal",
    type: "checking",
    opening_balance_cents: balanceCents,
  });
  if (error) return { ok: false, error: dbError(error.message) };
  return { ok: true };
}

// --- Categorias ------------------------------------------------------------
export async function saveCategory(raw: unknown): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    name: d.name,
    type: d.type,
    color: d.color,
    icon: d.icon,
  };
  const { error } = d.id
    ? await ctx.supabase.from("categories").update(payload).eq("id", d.id)
    : await ctx.supabase.from("categories").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/configuracoes");
  return { ok: true, message: d.id ? "Categoria atualizada." : "Categoria criada." };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("categories").update({ archived: true }).eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/configuracoes");
  return { ok: true, message: "Categoria removida." };
}
