"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, dbError, type Ctx } from "./helpers";
import { fromZod, type ActionResult } from "@/lib/action-result";
import { z } from "zod";
import { addMonthsToPeriod, clampDayToPeriod } from "@/lib/finance/period";

const subscriptionSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  description: z.string().trim().min(1, "Informe o nome.").max(80),
  amountCents: z.coerce.number().int().min(1, "Informe o valor."),
  categoryId: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  accountId: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  dayOfMonth: z.coerce.number().int().min(1).max(31).default(1),
  frequency: z.enum(["monthly", "yearly"]).default("monthly"),
});

export async function saveSubscription(raw: unknown): Promise<ActionResult> {
  const parsed = subscriptionSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const today = new Date();
  const period = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const nextRun = clampDayToPeriod(period, d.dayOfMonth);

  const payload = {
    user_id: ctx.userId,
    kind: "expense" as const,
    description: d.description,
    amount_cents: d.amountCents,
    category_id: d.categoryId ?? null,
    account_id: d.accountId ?? null,
    frequency: d.frequency,
    day_of_month: d.dayOfMonth,
    start_date: nextRun,
    next_run: nextRun,
    is_subscription: true,
  };
  const { error } = d.id
    ? await ctx.supabase.from("recurring_rules").update(payload).eq("id", d.id)
    : await ctx.supabase.from("recurring_rules").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/assinaturas");
  return { ok: true, message: d.id ? "Assinatura atualizada." : "Assinatura adicionada." };
}

export async function deleteRecurring(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("recurring_rules").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/assinaturas");
  return { ok: true, message: "Removida." };
}

/**
 * Gera os lançamentos de todas as regras vencidas (next_run <= hoje),
 * avançando next_run conforme a frequência. Idempotente por data.
 */
export async function runDueRecurring(): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const today = new Date().toISOString().slice(0, 10);

  const { data: rules } = await ctx.supabase
    .from("recurring_rules")
    .select("*")
    .eq("active", true)
    .lte("next_run", today);

  if (!rules || rules.length === 0) return { ok: true, message: "Nada a gerar." };

  let generated = 0;
  for (const rule of rules) {
    let next = rule.next_run as string;
    // Gera todas as ocorrências atrasadas até hoje (máx. 24 por segurança).
    let guard = 0;
    while (next <= today && guard < 24) {
      await insertFromRule(ctx, rule, next);
      generated += 1;
      next = advance(next, rule.frequency, rule.day_of_month);
      guard += 1;
      if (rule.end_date && next > rule.end_date) break;
    }
    await ctx.supabase.from("recurring_rules").update({ next_run: next }).eq("id", rule.id);
  }

  revalidatePath("/assinaturas");
  revalidatePath("/painel");
  revalidatePath("/transacoes");
  return { ok: true, message: generated > 0 ? `${generated} lançamento(s) gerado(s).` : "Tudo em dia." };
}

async function insertFromRule(ctx: Ctx, rule: Record<string, unknown>, date: string) {
  await ctx.supabase.from("transactions").insert({
    user_id: ctx.userId,
    kind: rule.kind,
    description: rule.description,
    amount_cents: rule.amount_cents,
    category_id: rule.category_id ?? null,
    account_id: rule.account_id ?? null,
    payment_method: rule.payment_method ?? null,
    occurred_on: date,
    status: "cleared",
    recurring_rule_id: rule.id,
  });
}

function advance(date: string, frequency: string, dayOfMonth: number | null): string {
  const period = date.slice(0, 7);
  const day = dayOfMonth ?? Number(date.slice(8, 10));
  if (frequency === "yearly") return clampDayToPeriod(addMonthsToPeriod(period, 12), day);
  if (frequency === "weekly") {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }
  if (frequency === "daily") {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  return clampDayToPeriod(addMonthsToPeriod(period, 1), day);
}
