"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, logActivity, dbError } from "./helpers";
import { cardSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function saveCard(raw: unknown): Promise<ActionResult> {
  const parsed = cardSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    name: d.name,
    brand: d.brand || null,
    color: d.color,
    limit_cents: d.limitCents,
    closing_day: d.closingDay,
    due_day: d.dueDay,
  };

  const { error } = d.id
    ? await ctx.supabase.from("credit_cards").update(payload).eq("id", d.id)
    : await ctx.supabase.from("credit_cards").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };

  await logActivity(ctx, "cartao", d.id ? "editar" : "criar", `Cartão: ${d.name}`);
  revalidatePath("/cartoes");
  revalidatePath("/painel");
  return { ok: true, message: d.id ? "Cartão atualizado." : "Cartão criado." };
}

export async function deleteCard(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;

  const { count } = await ctx.supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("card_id", id);

  if ((count ?? 0) > 0) {
    const { error } = await ctx.supabase.from("credit_cards").update({ archived: true }).eq("id", id);
    if (error) return { ok: false, error: dbError(error.message) };
    revalidatePath("/cartoes");
    return { ok: true, message: "Cartão arquivado (tinha lançamentos)." };
  }

  const { error } = await ctx.supabase.from("credit_cards").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/cartoes");
  return { ok: true, message: "Cartão excluído." };
}
