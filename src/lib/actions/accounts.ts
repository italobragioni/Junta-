"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, logActivity, dbError } from "./helpers";
import { accountSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function saveAccount(raw: unknown): Promise<ActionResult> {
  const parsed = accountSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    name: d.name,
    type: d.type,
    institution: d.institution || null,
    color: d.color,
    opening_balance_cents: d.openingBalanceCents,
    include_in_total: d.includeInTotal,
  };

  const { error } = d.id
    ? await ctx.supabase.from("accounts").update(payload).eq("id", d.id)
    : await ctx.supabase.from("accounts").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };

  await logActivity(ctx, "conta", d.id ? "editar" : "criar", `Conta: ${d.name}`);
  revalidatePath("/contas");
  revalidatePath("/painel");
  return { ok: true, message: d.id ? "Conta atualizada." : "Conta criada." };
}

export async function deleteAccount(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;

  // Se houver lançamentos, apenas arquiva (preserva histórico e cálculos).
  const { count } = await ctx.supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .or(`account_id.eq.${id},to_account_id.eq.${id}`);

  if ((count ?? 0) > 0) {
    const { error } = await ctx.supabase.from("accounts").update({ archived: true }).eq("id", id);
    if (error) return { ok: false, error: dbError(error.message) };
    revalidatePath("/contas");
    revalidatePath("/painel");
    return { ok: true, message: "Conta arquivada (tinha lançamentos)." };
  }

  const { error } = await ctx.supabase.from("accounts").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/contas");
  revalidatePath("/painel");
  return { ok: true, message: "Conta excluída." };
}
