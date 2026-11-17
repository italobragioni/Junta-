/**
 * Lógica de faturas de cartão de crédito.
 *
 * Convenção adotada (a mais comum no Brasil):
 *   - O cartão "fecha" no dia `closingDay`. Compras feitas ATÉ o dia de
 *     fechamento entram na fatura que fecha naquele mês; compras DEPOIS do
 *     fechamento entram na fatura do mês seguinte.
 *   - O `invoice_period` (YYYY-MM) identifica o mês em que a fatura fecha.
 *   - O vencimento (due_day) ocorre no mesmo mês do fechamento se due_day
 *     for maior que closing_day; caso contrário, no mês seguinte.
 *   - "Melhor dia de compra" = o dia seguinte ao fechamento (maior prazo).
 */

import { addMonthsToPeriod, clampDayToPeriod, periodOf, parsePeriod } from "./period";
import { splitInstallments, type Cents } from "../money";

/** Em qual fatura (YYYY-MM) cai uma compra feita em `date`. */
export function invoicePeriodFor(date: string | Date, closingDay: number): string {
  const d = typeof date === "string" ? date : periodOf(date) + "-" + String(date.getDate()).padStart(2, "0");
  const day = Number((typeof date === "string" ? date.slice(8, 10) : String(date.getDate())));
  const base = d.slice(0, 7);
  return day <= closingDay ? base : addMonthsToPeriod(base, 1);
}

/** Data de vencimento (YYYY-MM-DD) da fatura de um período. */
export function dueDateFor(period: string, dueDay: number, closingDay: number): string {
  // Se o vencimento é depois do fechamento, vence no mesmo mês; senão, no próximo.
  const month = dueDay > closingDay ? period : addMonthsToPeriod(period, 1);
  return clampDayToPeriod(month, dueDay);
}

/** Data de fechamento (YYYY-MM-DD) da fatura de um período. */
export function closingDateFor(period: string, closingDay: number): string {
  return clampDayToPeriod(period, closingDay);
}

/** "Melhor dia de compra": o dia após o fechamento. */
export function bestPurchaseDay(closingDay: number): number {
  return (closingDay % 31) + 1;
}

export interface InstallmentPlan {
  invoicePeriod: string;
  installmentNumber: number;
  installmentTotal: number;
  amountCents: Cents;
}

/**
 * Gera o plano de parcelas de uma compra parcelada.
 * A 1ª parcela cai na fatura da data da compra; as seguintes nos meses
 * subsequentes. A soma das parcelas é EXATAMENTE o total (sem perder centavos).
 */
export function buildInstallmentPlan(
  total: Cents,
  installments: number,
  purchaseDate: string,
  closingDay: number,
): InstallmentPlan[] {
  const n = Math.max(1, Math.trunc(installments));
  const parts = splitInstallments(total, n);
  const firstPeriod = invoicePeriodFor(purchaseDate, closingDay);
  return parts.map((amountCents, i) => ({
    invoicePeriod: addMonthsToPeriod(firstPeriod, i),
    installmentNumber: i + 1,
    installmentTotal: n,
    amountCents,
  }));
}

export interface InvoiceSummary {
  period: string;
  closingDate: string;
  dueDate: string;
  totalCents: Cents;
  isClosed: boolean;
  isPaid: boolean;
}

interface InvoiceInput {
  invoice_period: string | null;
  kind: string;
  amount_cents: number;
}

/**
 * Agrupa lançamentos de um cartão em faturas por período.
 * `card_expense` somam; `card_payment` quitam (marca isPaid quando >= total).
 */
export function summarizeInvoices(
  transactions: InvoiceInput[],
  closingDay: number,
  dueDay: number,
  today: Date = new Date(),
): InvoiceSummary[] {
  const expenses = new Map<string, Cents>();
  const payments = new Map<string, Cents>();
  for (const t of transactions) {
    const p = t.invoice_period;
    if (!p) continue;
    if (t.kind === "card_expense") expenses.set(p, (expenses.get(p) ?? 0) + t.amount_cents);
    else if (t.kind === "card_payment") payments.set(p, (payments.get(p) ?? 0) + t.amount_cents);
  }
  const periods = new Set<string>([...expenses.keys(), ...payments.keys()]);
  const todayStr = periodOf(today) + "-" + String(today.getDate()).padStart(2, "0");

  return [...periods]
    .sort()
    .map((period) => {
      const totalCents = expenses.get(period) ?? 0;
      const paid = payments.get(period) ?? 0;
      const closingDate = closingDateFor(period, closingDay);
      return {
        period,
        closingDate,
        dueDate: dueDateFor(period, dueDay, closingDay),
        totalCents,
        isClosed: todayStr > closingDate,
        isPaid: totalCents > 0 && paid >= totalCents,
      };
    });
}

/** Fatura "aberta" atual (a que ainda não fechou) de um cartão. */
export function openInvoicePeriod(closingDay: number, today: Date = new Date()): string {
  const base = periodOf(today);
  return today.getDate() <= closingDay ? base : addMonthsToPeriod(base, 1);
}

export { parsePeriod };
