"use server";

import { revalidatePath } from "next/cache";
import { requireCtx, logActivity, dbError } from "./helpers";
import { billSchema, payBillSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";
import { addMonthsToPeriod, clampDayToPeriod } from "@/lib/finance/period";

export async function saveBill(raw: unknown): Promise<ActionResult> {
  const parsed = billSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const payload = {
    user_id: ctx.userId,
    kind: d.kind,
    description: d.description,
    amount_cents: d.amountCents,
    due_date: d.dueDate,
    category_id: d.categoryId ?? null,
    account_id: d.accountId ?? null,
    frequency: d.frequency,
    notes: d.notes || null,
  };
  const { error } = d.id
    ? await ctx.supabase.from("bills").update(payload).eq("id", d.id)
    : await ctx.supabase.from("bills").insert(payload);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/contas-a-pagar");
  revalidatePath("/painel");
  return { ok: true, message: d.id ? "Conta atualizada." : "Conta agendada." };
}

/**
 * Marca uma conta como paga/recebida: gera o lançamento real (receita ou
 * despesa), liga à conta (bill.transaction_id) e, se for recorrente, agenda a
 * próxima ocorrência. Não duplica: o status vira 'paid'.
 */
export async function payBill(raw: unknown): Promise<ActionResult> {
  const parsed = payBillSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const { data: bill } = await ctx.supabase.from("bills").select("*").eq("id", d.billId).single();
  if (!bill) return { ok: false, error: "Conta não encontrada." };
  if (bill.status === "paid") return { ok: false, error: "Esta conta já foi quitada." };

  // Gera o lançamento correspondente.
  const kind = bill.kind === "payable" ? "expense" : "income";
  const { data: tx, error: txErr } = await ctx.supabase
    .from("transactions")
    .insert({
      user_id: ctx.userId,
      kind,
      description: bill.description,
      amount_cents: bill.amount_cents,
      category_id: bill.category_id,
      account_id: d.accountId ?? bill.account_id,
      occurred_on: d.paidOn,
      status: "cleared",
    })
    .select("id")
    .single();
  if (txErr) return { ok: false, error: dbError(txErr.message) };

  // Marca como paga e liga o lançamento.
  const { error: upErr } = await ctx.supabase
    .from("bills")
    .update({ status: "paid", paid_on: d.paidOn, transaction_id: tx!.id })
    .eq("id", d.billId);
  if (upErr) return { ok: false, error: dbError(upErr.message) };

  // Recorrência: agenda a próxima ocorrência (mesma estrutura, mês seguinte).
  if (bill.frequency && bill.frequency !== "none") {
    const period = String(bill.due_date).slice(0, 7);
    const day = Number(String(bill.due_date).slice(8, 10));
    const nextPeriod = addMonthsToPeriod(period, bill.frequency === "yearly" ? 12 : 1);
    const nextDue = clampDayToPeriod(nextPeriod, day);
    await ctx.supabase.from("bills").insert({
      user_id: ctx.userId,
      kind: bill.kind,
      description: bill.description,
      amount_cents: bill.amount_cents,
      due_date: nextDue,
      category_id: bill.category_id,
      account_id: bill.account_id,
      frequency: bill.frequency,
      notes: bill.notes,
    });
  }

  await logActivity(ctx, "conta", "quitar", `Conta paga: ${bill.description}`, bill.amount_cents);
  revalidatePath("/contas-a-pagar");
  revalidatePath("/painel");
  revalidatePath("/transacoes");
  return { ok: true, message: bill.kind === "payable" ? "Conta paga!" : "Recebimento registrado!" };
}

export async function deleteBill(id: string): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("bills").delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidatePath("/contas-a-pagar");
  return { ok: true, message: "Conta removida." };
}
