import "server-only";

import {
  listAccounts, listCards, listTransactions, listBills, listDebts, listPatrimony, listBudgets,
} from "@/lib/db/queries";
import { sumCents, type Cents } from "@/lib/money";
import {
  summarize, expensesByCategory, committedPercent, netWorth, isExpense, isIncome, averageExpense,
} from "./calculations";
import { currentPeriod, lastNPeriods, periodOf, periodRange, addMonthsToPeriod } from "./period";

export interface DashboardData {
  period: string;
  totalBalanceCents: Cents;
  incomeCents: Cents;
  expenseCents: Cents;
  resultCents: Cents;
  savingsRate: number;
  committedPercent: number;
  payableCents: Cents;
  receivableCents: Cents;
  cardDebtCents: Cents;
  netWorthCents: Cents;
  assetsCents: Cents;
  liabilitiesCents: Cents;
  prevExpenseCents: Cents;
  expenseTrend: number; // % vs mês anterior
  monthly: { period: string; income: number; expense: number; balance: number }[];
  categories: { categoryId: string | null; totalCents: number; share: number }[];
  alerts: DashboardAlert[];
  hasData: boolean;
}

export interface DashboardAlert {
  tone: "warn" | "negative" | "positive" | "brand";
  title: string;
  description: string;
}

/** Painel resiliente: se qualquer consulta falhar, nunca derruba a página. */
export async function getDashboard(period = currentPeriod()): Promise<DashboardData> {
  try {
    return await computeDashboard(period);
  } catch (e) {
    console.error("getDashboard error:", (e as Error)?.message);
    return emptyDashboard(period);
  }
}

function emptyDashboard(period: string): DashboardData {
  return {
    period,
    totalBalanceCents: 0, incomeCents: 0, expenseCents: 0, resultCents: 0,
    savingsRate: 0, committedPercent: 0, payableCents: 0, receivableCents: 0,
    cardDebtCents: 0, netWorthCents: 0, assetsCents: 0, liabilitiesCents: 0,
    prevExpenseCents: 0, expenseTrend: 0,
    monthly: lastNPeriods(period, 12).map((p) => ({ period: p, income: 0, expense: 0, balance: 0 })),
    categories: [], alerts: [], hasData: false,
  };
}

/** Monta todos os dados do painel para um período (YYYY-MM). */
async function computeDashboard(period: string): Promise<DashboardData> {
  const months = lastNPeriods(period, 12);
  const windowStart = periodRange(months[0]).start;
  const windowEnd = periodRange(period).end;

  const [accounts, cards, txs, bills, debts, patrimony, budgets] = await Promise.all([
    listAccounts(),
    listCards(),
    listTransactions({ from: windowStart, to: windowEnd, limit: 5000 }),
    listBills("open"),
    listDebts(),
    listPatrimony(),
    listBudgets(period),
  ]);

  const totalBalanceCents = sumCents(
    accounts.filter((a) => a.include_in_total).map((a) => a.balance_cents),
  );

  const monthTxs = txs.filter((t) => periodOf(t.occurred_on) === period);
  const prevTxs = txs.filter((t) => periodOf(t.occurred_on) === addMonthsToPeriod(period, -1));
  const sum = summarize(monthTxs);
  const prevSum = summarize(prevTxs);

  const cardDebtCents = sumCents(cards.map((c) => c.used_cents));
  const payableCents = sumCents(bills.filter((b) => b.kind === "payable").map((b) => b.amount_cents));
  const receivableCents = sumCents(bills.filter((b) => b.kind === "receivable").map((b) => b.amount_cents));

  const nw = netWorth({
    accountBalancesCents: accounts.filter((a) => a.include_in_total).map((a) => a.balance_cents),
    assetItemsCents: patrimony.filter((p) => !p.is_liability).map((p) => p.value_cents),
    liabilityItemsCents: patrimony.filter((p) => p.is_liability).map((p) => p.value_cents),
    debtBalancesCents: debts.map((d) => d.balance_cents),
  });

  // Séries mensais (receita x despesa) + evolução de saldo ancorada no saldo real.
  const monthlyRaw = months.map((m) => {
    const mt = txs.filter((t) => periodOf(t.occurred_on) === m);
    const income = sumCents(mt.filter(isIncome).map((t) => t.amount_cents));
    const expense = sumCents(mt.filter(isExpense).map((t) => t.amount_cents));
    // Fluxo de caixa que afeta o saldo das contas (não a competência):
    const cashIn = income;
    const cashOut = sumCents(
      mt.filter((t) => t.kind === "expense" || t.kind === "card_payment").map((t) => t.amount_cents),
    );
    return { period: m, income, expense, cashDelta: cashIn - cashOut };
  });

  // Evolução do saldo: ancora o último mês no saldo total atual e caminha para trás.
  const balances: number[] = new Array(monthlyRaw.length);
  balances[balances.length - 1] = totalBalanceCents;
  for (let i = balances.length - 2; i >= 0; i--) {
    balances[i] = balances[i + 1] - monthlyRaw[i + 1].cashDelta;
  }
  const monthly = monthlyRaw.map((m, i) => ({
    period: m.period,
    income: m.income,
    expense: m.expense,
    balance: balances[i],
  }));

  const categories = expensesByCategory(monthTxs).slice(0, 8);

  // Alertas inteligentes
  const alerts = buildAlerts({
    period, sum, prevSum, bills, budgets, monthTxs, months, txs,
  });

  const hasData = txs.length > 0 || accounts.length > 0;

  return {
    period,
    totalBalanceCents,
    incomeCents: sum.incomeCents,
    expenseCents: sum.expenseCents,
    resultCents: sum.resultCents,
    savingsRate: sum.savingsRate,
    committedPercent: committedPercent(sum.incomeCents, sum.expenseCents),
    payableCents,
    receivableCents,
    cardDebtCents,
    netWorthCents: nw.netCents,
    assetsCents: nw.assetsCents,
    liabilitiesCents: nw.liabilitiesCents,
    prevExpenseCents: prevSum.expenseCents,
    expenseTrend:
      prevSum.expenseCents > 0
        ? ((sum.expenseCents - prevSum.expenseCents) / prevSum.expenseCents) * 100
        : 0,
    monthly,
    categories,
    alerts,
    hasData,
  };
}

function buildAlerts(p: {
  period: string;
  sum: ReturnType<typeof summarize>;
  prevSum: ReturnType<typeof summarize>;
  bills: { kind: string; amount_cents: number; due_date: string; description: string }[];
  budgets: { category_id: string; limit_cents: number }[];
  monthTxs: { kind: string; amount_cents: number; category_id: string | null; occurred_on: string; status: string }[];
  months: string[];
  txs: { kind: string; amount_cents: number; category_id: string | null; occurred_on: string; status: string }[];
}): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  // Resultado negativo
  if (p.sum.resultCents < 0) {
    alerts.push({
      tone: "negative",
      title: "Você gastou mais do que recebeu",
      description: "Suas despesas superaram as receitas neste mês. Reveja os gastos nas maiores categorias.",
    });
  }

  // Gasto acima da média dos meses anteriores
  const prevSummaries = p.months
    .slice(0, -1)
    .map((m) => summarize(p.txs.filter((t) => periodOf(t.occurred_on) === m)))
    .filter((s) => s.expenseCents > 0);
  const avg = averageExpense(prevSummaries);
  if (avg > 0 && p.sum.expenseCents > avg * 1.2) {
    alerts.push({
      tone: "warn",
      title: "Gastos acima da média",
      description: "Suas despesas estão mais de 20% acima da média dos últimos meses.",
    });
  }

  // Contas vencendo em até 7 dias
  const soon = p.bills.filter((b) => {
    const diff = (new Date(b.due_date).getTime() - Date.now()) / 86_400_000;
    return diff >= 0 && diff <= 7;
  });
  if (soon.length > 0) {
    alerts.push({
      tone: "brand",
      title: `${soon.length} conta(s) vencem nos próximos 7 dias`,
      description: "Confira a aba Contas a pagar para não perder nenhum vencimento.",
    });
  }

  // Economia positiva
  if (p.sum.resultCents > 0 && p.sum.savingsRate >= 20) {
    alerts.push({
      tone: "positive",
      title: "Ótimo mês!",
      description: `Você guardou ${p.sum.savingsRate.toFixed(0)}% da sua renda. Que tal direcionar para uma meta?`,
    });
  }

  return alerts;
}
