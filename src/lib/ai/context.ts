import "server-only";

import {
  listAccounts, listCards, listTransactions, listBudgets, listGoals, listDebts, listBills, listCategories,
} from "@/lib/db/queries";
import { currentPeriod, lastNPeriods, periodRange } from "@/lib/finance/period";
import { summarize, expensesByCategory, inPeriod, budgetStatus } from "@/lib/finance/calculations";
import { sumCents } from "@/lib/money";
import { formatBRL, formatMonth } from "@/lib/format";

export interface FinancialFacts {
  period: string;
  periodLabel: string;
  totalBalanceCents: number;
  incomeCents: number;
  expenseCents: number;
  resultCents: number;
  savingsRate: number;
  cardDebtCents: number;
  topCategories: { name: string; totalCents: number; share: number }[];
  byCategoryCents: Record<string, number>;
  budgets: { name: string; limitCents: number; usedCents: number; percent: number }[];
  goals: { name: string; savedCents: number; targetCents: number }[];
  debts: { name: string; balanceCents: number; rate: number }[];
  upcomingBills: { description: string; amountCents: number; dueDate: string }[];
  months: { period: string; incomeCents: number; expenseCents: number }[];
  hasData: boolean;
}

/** Reúne fatos financeiros REAIS do usuário — base para a Finora IA (sem invenção). */
export async function buildFinancialFacts(): Promise<FinancialFacts> {
  const period = currentPeriod();
  const months = lastNPeriods(period, 6);
  const start = periodRange(months[0]).start;
  const end = periodRange(period).end;

  const [accounts, cards, txs, budgets, goals, debts, bills, categories] = await Promise.all([
    listAccounts(), listCards(), listTransactions({ from: start, to: end, limit: 5000 }),
    listBudgets(period), listGoals(), listDebts(), listBills("open"), listCategories(),
  ]);
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const monthTxs = inPeriod(txs, period);
  const s = summarize(monthTxs);
  const totalBalanceCents = sumCents(accounts.filter((a) => a.include_in_total).map((a) => a.balance_cents));

  const slices = expensesByCategory(monthTxs);
  const byCategoryCents: Record<string, number> = {};
  for (const sl of slices) {
    const name = sl.categoryId ? catMap.get(sl.categoryId)?.name ?? "Outros" : "Outros";
    byCategoryCents[name] = sl.totalCents;
  }
  const topCategories = slices.slice(0, 6).map((sl) => ({
    name: sl.categoryId ? catMap.get(sl.categoryId)?.name ?? "Outros" : "Outros",
    totalCents: sl.totalCents,
    share: sl.share,
  }));

  const budgetStatuses = budgets.map((b) => {
    const used = byCategoryCents[catMap.get(b.category_id)?.name ?? ""] ?? 0;
    const st = budgetStatus(b.limit_cents, used, b.category_id);
    return { name: catMap.get(b.category_id)?.name ?? "Categoria", limitCents: b.limit_cents, usedCents: used, percent: st.percent };
  });

  const today = new Date();
  const in30 = new Date(today.getTime() + 30 * 86_400_000).toISOString().slice(0, 10);
  const upcomingBills = bills
    .filter((b) => b.kind === "payable" && b.due_date >= today.toISOString().slice(0, 10) && b.due_date <= in30)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 8)
    .map((b) => ({ description: b.description, amountCents: b.amount_cents, dueDate: b.due_date }));

  return {
    period,
    periodLabel: formatMonth(period),
    totalBalanceCents,
    incomeCents: s.incomeCents,
    expenseCents: s.expenseCents,
    resultCents: s.resultCents,
    savingsRate: s.savingsRate,
    cardDebtCents: sumCents(cards.map((c) => c.used_cents)),
    topCategories,
    byCategoryCents,
    budgets: budgetStatuses,
    goals: goals.map((g) => ({ name: g.name, savedCents: g.saved_cents, targetCents: g.target_cents })),
    debts: debts.map((d) => ({ name: d.name, balanceCents: d.balance_cents, rate: d.interest_rate })),
    upcomingBills,
    months: months.map((p) => {
      const ms = summarize(inPeriod(txs, p));
      return { period: p, incomeCents: ms.incomeCents, expenseCents: ms.expenseCents };
    }),
    hasData: txs.length > 0 || accounts.length > 0,
  };
}

/** Texto compacto dos fatos — vai no prompt da IA como contexto confiável. */
export function factsToPrompt(f: FinancialFacts): string {
  const lines: string[] = [];
  lines.push(`Mês atual: ${f.periodLabel}.`);
  lines.push(`Saldo total em contas: ${formatBRL(f.totalBalanceCents)}.`);
  lines.push(`Receitas do mês: ${formatBRL(f.incomeCents)}.`);
  lines.push(`Despesas do mês: ${formatBRL(f.expenseCents)}.`);
  lines.push(`Resultado do mês: ${formatBRL(f.resultCents)} (taxa de economia ${f.savingsRate.toFixed(0)}%).`);
  if (f.cardDebtCents > 0) lines.push(`Dívida em cartões: ${formatBRL(f.cardDebtCents)}.`);
  if (f.topCategories.length) {
    lines.push("Gastos por categoria neste mês:");
    for (const c of f.topCategories) lines.push(`- ${c.name}: ${formatBRL(c.totalCents)} (${c.share.toFixed(0)}%).`);
  }
  if (f.budgets.length) {
    lines.push("Orçamentos:");
    for (const b of f.budgets) lines.push(`- ${b.name}: usou ${formatBRL(b.usedCents)} de ${formatBRL(b.limitCents)} (${b.percent.toFixed(0)}%).`);
  }
  if (f.goals.length) {
    lines.push("Metas:");
    for (const g of f.goals) lines.push(`- ${g.name}: ${formatBRL(g.savedCents)} de ${formatBRL(g.targetCents)}.`);
  }
  if (f.debts.length) {
    lines.push("Dívidas:");
    for (const d of f.debts) lines.push(`- ${d.name}: saldo ${formatBRL(d.balanceCents)}${d.rate ? `, juros ${d.rate}% a.m.` : ""}.`);
  }
  if (f.upcomingBills.length) {
    lines.push("Contas a pagar nos próximos 30 dias:");
    for (const b of f.upcomingBills) lines.push(`- ${b.description}: ${formatBRL(b.amountCents)} vence ${b.dueDate}.`);
  }
  if (f.months.length) {
    lines.push("Histórico (receita/despesa por mês):");
    for (const m of f.months) lines.push(`- ${m.period}: +${formatBRL(m.incomeCents)} / -${formatBRL(m.expenseCents)}.`);
  }
  return lines.join("\n");
}
