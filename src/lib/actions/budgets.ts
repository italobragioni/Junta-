"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, dbError } from "./helpers";
import { budgetSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

/** Cria ou atualiza o orçamento de uma categoria em um mês (upsert). */
export async function saveBudget(raw: unknown): Promise<ActionResult> {
  const parsed = budgetSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const { error } = await ctx.supabase.from("budgets").upsert(
    {
      user_id: ctx.userId,
      category_id: d.categoryId,
      month: d.month,
      limit_cents: d.limitCents,
    },
    { onConflict: "user_id,category_id,month" },
  );
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/orcamentos");
  revalidatePath("/painel");
  return { ok: true, message: "Orçamento salvo." };
}

export async function deleteBudget(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("budgets").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/orcamentos");
  return { ok: true, message: "Orçamento removido." };
}

/** Copia os orçamentos de um mês para outro (ex.: repetir mês anterior). */
export async function copyBudgets(fromMonth: string, toMonth: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const { data } = await ctx.supabase.from("budgets").select("category_id, limit_cents").eq("month", fromMonth);
  if (!data || data.length === 0) return { ok: false, error: "Não há orçamentos no mês de origem." };
  const rows = data.map((b) => ({
    user_id: ctx.userId,
    category_id: b.category_id,
    month: toMonth,
    limit_cents: b.limit_cents,
  }));
  const { error } = await ctx.supabase.from("budgets").upsert(rows, { onConflict: "user_id,category_id,month" });
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/orcamentos");
  return { ok: true, message: "Orçamentos copiados." };
}
