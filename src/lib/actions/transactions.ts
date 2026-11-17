"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireCtx, logActivity, dbError, type Ctx } from "./helpers";
import { transactionSchema, transferSchema, cardPaymentSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";
import { buildInstallmentPlan, invoicePeriodFor } from "@/lib/finance/invoices";
import { formatBRL } from "@/lib/format";

const APP_PATHS = ["/painel", "/transacoes", "/contas", "/cartoes", "/relatorios"];
function revalidateApp() {
  for (const p of APP_PATHS) revalidatePath(p);
}

/** Cria receita, despesa ou compra de cartão (com parcelamento e recorrência). */
export async function createTransaction(raw: unknown): Promise<ActionResult> {
  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  try {
    if (d.kind === "card_expense") {
      if (!d.cardId) return { ok: false, error: "Escolha o cartão." };
      // Descobre o dia de fechamento para saber em qual fatura cai.
      const { data: card } = await ctx.supabase
        .from("credit_cards").select("closing_day").eq("id", d.cardId).single();
      const closingDay = (card?.closing_day as number) ?? 1;
      const plan = buildInstallmentPlan(d.amountCents, d.installments, d.occurredOn, closingDay);
      const group = d.installments > 1 ? randomUUID() : null;

      const rows = plan.map((p) => ({
        user_id: ctx.userId,
        kind: "card_expense" as const,
        description: d.description,
        amount_cents: p.amountCents,
        category_id: d.categoryId ?? null,
        card_id: d.cardId,
        payment_method: "credit" as const,
        occurred_on: d.occurredOn,
        status: "cleared" as const,
        notes: d.notes || null,
        installment_group: group,
        installment_number: d.installments > 1 ? p.installmentNumber : null,
        installment_total: d.installments > 1 ? p.installmentTotal : null,
        invoice_period: p.invoicePeriod,
      }));
      const { error } = await ctx.supabase.from("transactions").insert(rows);
      if (error) return { ok: false, error: dbError(error.message) };
      await logActivity(ctx, "cartao", "compra",
        `Compra no cartão: ${d.description}${d.installments > 1 ? ` (${d.installments}x)` : ""}`,
        d.amountCents);
    } else {
      // income / expense
      const { error } = await ctx.supabase.from("transactions").insert({
        user_id: ctx.userId,
        kind: d.kind,
        description: d.description,
        amount_cents: d.amountCents,
        category_id: d.categoryId ?? null,
        account_id: d.accountId ?? null,
        payment_method: d.paymentMethod ?? null,
        occurred_on: d.occurredOn,
        status: d.status,
        notes: d.notes || null,
      });
      if (error) return { ok: false, error: dbError(error.message) };

      if (d.recurring !== "none") {
        await createRecurringRule(ctx, d);
      }
      await logActivity(ctx, d.kind, "criar",
        `${d.kind === "income" ? "Receita" : "Despesa"}: ${d.description}`, d.amountCents);
    }

    revalidateApp();
    return { ok: true, message: "Lançamento salvo." };
  } catch (e) {
    return { ok: false, error: dbError((e as Error)?.message) };
  }
}

async function createRecurringRule(
  ctx: Ctx,
  d: { kind: string; description: string; amountCents: number; categoryId?: string; accountId?: string; paymentMethod?: string; occurredOn: string; recurring: string },
) {
  const day = Number(d.occurredOn.slice(8, 10));
  await ctx.supabase.from("recurring_rules").insert({
    user_id: ctx.userId,
    kind: d.kind,
    description: d.description,
    amount_cents: d.amountCents,
    category_id: d.categoryId ?? null,
    account_id: d.accountId ?? null,
    payment_method: d.paymentMethod ?? null,
    frequency: d.recurring,
    day_of_month: day,
    start_date: d.occurredOn,
    next_run: d.occurredOn,
  });
}

/** Transferência entre contas próprias (NÃO é receita nem despesa). */
export async function createTransfer(raw: unknown): Promise<ActionResult> {
  const parsed = transferSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const { error } = await ctx.supabase.from("transactions").insert({
    user_id: ctx.userId,
    kind: "transfer",
    description: d.description || "Transferência entre contas",
    amount_cents: d.amountCents,
    account_id: d.fromAccountId,
    to_account_id: d.toAccountId,
    occurred_on: d.occurredOn,
    status: "cleared",
  });
  if (error) return { ok: false, error: dbError(error.message) };
  await logActivity(ctx, "transferencia", "criar", "Transferência entre contas", d.amountCents);
  revalidateApp();
  return { ok: true, message: "Transferência registrada." };
}

/** Paga (ou amortiza) uma fatura de cartão: debita a conta, quita a fatura. */
export async function payCardInvoice(raw: unknown): Promise<ActionResult> {
  const parsed = cardPaymentSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  const d = parsed.data;

  const { error } = await ctx.supabase.from("transactions").insert({
    user_id: ctx.userId,
    kind: "card_payment",
    description: `Pagamento de fatura ${d.invoicePeriod}`,
    amount_cents: d.amountCents,
    account_id: d.accountId,
    card_id: d.cardId,
    occurred_on: d.occurredOn,
    invoice_period: d.invoicePeriod,
    status: "cleared",
  });
  if (error) return { ok: false, error: dbError(error.message) };
  await logActivity(ctx, "cartao", "pagamento",
    `Pagamento de fatura (${formatBRL(d.amountCents)})`, d.amountCents);
  revalidateApp();
  return { ok: true, message: "Pagamento de fatura registrado." };
}

/** Marca um lançamento previsto como realizado (ou vice-versa). */
export async function setTransactionStatus(id: string, status: "pending" | "cleared"): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("transactions").update({ status }).eq("id", id);
  if (error) return { ok: false, error: dbError(error.message) };
  revalidateApp();
  return { ok: true };
}

/** Exclui um lançamento. Parcelas: exclui o grupo inteiro. */
export async function deleteTransaction(id: string, installmentGroup?: string | null): Promise<ActionResult> {
  const auth = await requireCtx();
  if ("error" in auth) return { ok: false, error: auth.error };
  const { ctx } = auth;
  let q = ctx.supabase.from("transactions").delete();
  q = installmentGroup ? q.eq("installment_group", installmentGroup) : q.eq("id", id);
  const { error } = await q;
  if (error) return { ok: false, error: dbError(error.message) };
  await logActivity(ctx, "lancamento", "excluir", "Lançamento excluído");
  revalidateApp();
  return { ok: true, message: "Lançamento excluído." };
}
