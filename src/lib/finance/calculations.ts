/**
 * Cálculos financeiros do painel e relatórios. Funções PURAS (sem I/O),
 * para serem testáveis e reutilizadas no servidor e no cliente.
 *
 * Regras de contagem (evitam dupla contagem):
 *   - Receita do mês   = soma de kind='income'.
 *   - Despesa do mês    = soma de kind='expense' + kind='card_expense'
 *                         (a compra no cartão JÁ é a despesa, pela competência).
 *   - Transferências e pagamentos de fatura NÃO entram em receita/despesa.
 */

import { sumCents, type Cents } from "../money";
import { periodOf } from "./period";

export interface TxLike {
  kind: string;
  amount_cents: number;
  category_id: string | null;
  occurred_on: string;
  status: string;
}

export const isIncome = (t: TxLike) => t.kind === "income";
export const isExpense = (t: TxLike) => t.kind === "expense" || t.kind === "card_expense";

/** Filtra lançamentos de um período (YYYY-MM). */
export function inPeriod(transactions: TxLike[], period: string): TxLike[] {
  return transactions.filter((t) => periodOf(t.occurred_on) === period);
}

/** Filtra por intervalo de datas inclusivo (YYYY-MM-DD). */
export function inRange(transactions: TxLike[], start: string, end: string): TxLike[] {
  return transactions.filter((t) => t.occurred_on >= start && t.occurred_on <= end);
}

export interface PeriodSummary {
  incomeCents: Cents;
  expenseCents: Cents;
  resultCents: Cents; // receita - despesa
  savingsRate: number; // % da receita que sobrou (0..100)
}

/** Resumo de receita/despesa/resultado para um conjunto de lançamentos. */
export function summarize(transactions: TxLike[]): PeriodSummary {
  const incomeCents = sumCents(transactions.filter(isIncome).map((t) => t.amount_cents));
  const expenseCents = sumCents(transactions.filter(isExpense).map((t) => t.amount_cents));
  const resultCents = incomeCents - expenseCents;
  const savingsRate = incomeCents > 0 ? (resultCents / incomeCents) * 100 : 0;
  return { incomeCents, expenseCents, resultCents, savingsRate };
}

export interface CategorySlice {
  categoryId: string | null;
  totalCents: Cents;
  share: number; // % do total
}

/** Distribuição de despesas por categoria, ordenada do maior para o menor. */
export function expensesByCategory(transactions: TxLike[]): CategorySlice[] {
  const map = new Map<string | null, Cents>();
  for (const t of transactions.filter(isExpense)) {
    map.set(t.category_id, (map.get(t.category_id) ?? 0) + t.amount_cents);
  }
  const total = sumCents([...map.values()]);
  return [...map.entries()]
    .map(([categoryId, totalCents]) => ({
      categoryId,
      totalCents,
      share: total > 0 ? (totalCents / total) * 100 : 0,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);
}

/** Percentual da renda comprometida com despesas (0..100+). */
export function committedPercent(incomeCents: Cents, expenseCents: Cents): number {
  if (incomeCents <= 0) return expenseCents > 0 ? 100 : 0;
  return (expenseCents / incomeCents) * 100;
}

export interface BudgetStatus {
  categoryId: string;
  limitCents: Cents;
  usedCents: Cents;
  remainingCents: Cents;
  percent: number;
  alertLevel: 0 | 50 | 75 | 90 | 100;
}

/** Status de um orçamento: usado vs. limite, e nível de alerta atingido. */
export function budgetStatus(limitCents: Cents, usedCents: Cents, categoryId: string): BudgetStatus {
  const percent = limitCents > 0 ? (usedCents / limitCents) * 100 : 0;
  let alertLevel: BudgetStatus["alertLevel"] = 0;
  if (percent >= 100) alertLevel = 100;
  else if (percent >= 90) alertLevel = 90;
  else if (percent >= 75) alertLevel = 75;
  else if (percent >= 50) alertLevel = 50;
  return {
    categoryId,
    limitCents,
    usedCents,
    remainingCents: limitCents - usedCents,
    percent,
    alertLevel,
  };
}

export interface NetWorth {
  assetsCents: Cents;
  liabilitiesCents: Cents;
  netCents: Cents;
}

/**
 * Patrimônio líquido = ativos - passivos.
 * Ativos  = saldos de contas (que você incluir no total) + bens manuais (ativos).
 * Passivos = dívidas + itens manuais marcados como passivo.
 */
export function netWorth(params: {
  accountBalancesCents: Cents[];
  assetItemsCents: Cents[];
  liabilityItemsCents: Cents[];
  debtBalancesCents: Cents[];
}): NetWorth {
  const assetsCents =
    sumCents(params.accountBalancesCents) + sumCents(params.assetItemsCents);
  const liabilitiesCents =
    sumCents(params.liabilityItemsCents) + sumCents(params.debtBalancesCents);
  return { assetsCents, liabilitiesCents, netCents: assetsCents - liabilitiesCents };
}

/** Média mensal de despesas de uma lista de resumos (para alertas). */
export function averageExpense(summaries: PeriodSummary[]): Cents {
  if (summaries.length === 0) return 0;
  return Math.round(sumCents(summaries.map((s) => s.expenseCents)) / summaries.length);
}
