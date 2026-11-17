"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, logActivity, dbError } from "./helpers";
import { goalSchema, contributionSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function saveGoal(raw: unknown): Promise<ActionResult> {
  const parsed = goalSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    name: d.name,
    target_cents: d.targetCents,
    color: d.color,
    deadline: d.deadline ?? null,
  };
  const { error } = d.id
    ? await ctx.supabase.from("goals").update(payload).eq("id", d.id)
    : await ctx.supabase.from("goals").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/metas");
  return { ok: true, message: d.id ? "Meta atualizada." : "Meta criada." };
}

export async function addContribution(raw: unknown): Promise<ActionResult> {
  const parsed = contributionSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const { error } = await ctx.supabase.from("goal_contributions").insert({
    user_id: ctx.userId,
    goal_id: d.goalId,
    amount_cents: d.amountCents,
    contributed_on: d.contributedOn,
    notes: d.notes || null,
  });
  if (error) return { ok: false, error: dbError(error.message) };
  await logActivity(ctx, "meta", "aporte", "Aporte em meta", d.amountCents);
  revalidatePath("/metas");
  return { ok: true, message: "Aporte registrado." };
}

export async function deleteGoal(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("goals").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/metas");
  return { ok: true, message: "Meta removida." };
}
