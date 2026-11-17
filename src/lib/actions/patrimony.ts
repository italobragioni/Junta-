"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, dbError } from "./helpers";
import { patrimonySchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function savePatrimonyItem(raw: unknown): Promise<ActionResult> {
  const parsed = patrimonySchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    name: d.name,
    kind: d.kind,
    value_cents: d.valueCents,
    is_liability: d.isLiability,
    notes: d.notes || null,
  };
  const { error } = d.id
    ? await ctx.supabase.from("patrimony_items").update(payload).eq("id", d.id)
    : await ctx.supabase.from("patrimony_items").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/patrimonio");
  revalidatePath("/painel");
  return { ok: true, message: d.id ? "Item atualizado." : "Item adicionado." };
}

export async function deletePatrimonyItem(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("patrimony_items").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/patrimonio");
  revalidatePath("/painel");
  return { ok: true, message: "Item removido." };
}
