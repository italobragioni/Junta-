"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, logActivity, dbError } from "./helpers";
import { debtSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function saveDebt(raw: unknown): Promise<ActionResult> {
  const parsed = debtSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    name: d.name,
    kind: d.kind,
    creditor: d.creditor || null,
    principal_cents: d.principalCents,
    balance_cents: d.balanceCents,
    interest_rate: d.interestRate,
    installments_total: d.installmentsTotal ?? null,
    installment_cents: d.installmentCents ?? null,
    next_due: d.nextDue ?? null,
  };
  const { error } = d.id
    ? await ctx.supabase.from("debts").update(payload).eq("id", d.id)
    : await ctx.supabase.from("debts").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/dividas");
  return { ok: true, message: d.id ? "Dívida atualizada." : "Dívida cadastrada." };
}

/** Registra um pagamento, abatendo o saldo devedor. */
export async function payDebt(debtId: string, amountCents: number, paidOn: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  if (amountCents <= 0) return { ok: false, error: "Informe um valor." };

  const { data: debt } = await ctx.supabase.from("debts").select("balance_cents, name").eq("id", debtId).single();
  if (!debt) return { ok: false, error: "Dívida não encontrada." };

  const newBalance = Math.max(0, debt.balance_cents - amountCents);
  const { error } = await ctx.supabase.from("debt_payments").insert({
    user_id: ctx.userId,
    debt_id: debtId,
    amount_cents: amountCents,
    paid_on: paidOn,
  });
  if (error) return { ok: false, error: dbError(error.message) };
  await ctx.supabase.from("debts").update({ balance_cents: newBalance }).eq("id", debtId);
  await logActivity(ctx, "divida", "pagamento", `Pagamento: ${debt.name}`, amountCents);
  revalidatePath("/dividas");
  return { ok: true, message: newBalance === 0 ? "Dívida quitada! 🎉" : "Pagamento registrado." };
}

export async function deleteDebt(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("debts").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/dividas");
  return { ok: true, message: "Dívida removida." };
}
