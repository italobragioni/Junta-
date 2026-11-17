import { describe, it, expect } from "vitest";
import {
  invoicePeriodFor, dueDateFor, buildInstallmentPlan, summarizeInvoices, bestPurchaseDay,
} from "@/lib/finance/invoices";
import { addMonthsToPeriod, monthsBetweenPeriods, lastNPeriods } from "@/lib/finance/period";
import { summarize, expensesByCategory, budgetStatus, netWorth, committedPercent, type TxLike } from "@/lib/finance/calculations";
import { simulatePayoff, compareStrategies } from "@/lib/finance/debts";

describe("period", () => {
  it("soma meses atravessando o ano", () => {
    expect(addMonthsToPeriod("2026-11", 2)).toBe("2027-01");
    expect(addMonthsToPeriod("2026-01", -1)).toBe("2025-12");
  });
  it("conta meses entre períodos", () => {
    expect(monthsBetweenPeriods("2026-01", "2026-12")).toBe(11);
  });
  it("lista os últimos N meses", () => {
    expect(lastNPeriods("2026-03", 3)).toEqual(["2026-01", "2026-02", "2026-03"]);
  });
});

describe("faturas de cartão", () => {
  it("compra antes/depois do fechamento cai na fatura certa", () => {
    // Fechamento dia 20.
    expect(invoicePeriodFor("2026-11-15", 20)).toBe("2026-11"); // antes → fatura nov
    expect(invoicePeriodFor("2026-11-20", 20)).toBe("2026-11"); // no dia → nov
    expect(invoicePeriodFor("2026-11-21", 20)).toBe("2026-12"); // depois → dez
  });
  it("vencimento é no mês seguinte quando due < closing", () => {
    // Fecha dia 20, vence dia 5 → vence no mês seguinte ao fechamento.
    expect(dueDateFor("2026-11", 5, 20)).toBe("2026-12-05");
    // Fecha dia 1, vence dia 10 → mesmo mês.
    expect(dueDateFor("2026-11", 10, 1)).toBe("2026-11-10");
  });
  it("melhor dia de compra é o dia seguinte ao fechamento", () => {
    expect(bestPurchaseDay(20)).toBe(21);
    expect(bestPurchaseDay(31)).toBe(1);
  });

  it("parcelamento gera parcelas em meses consecutivos e soma o total", () => {
    const plan = buildInstallmentPlan(120000, 3, "2026-11-10", 20);
    expect(plan.map((p) => p.invoicePeriod)).toEqual(["2026-11", "2026-12", "2027-01"]);
    expect(plan.map((p) => p.amountCents)).toEqual([40000, 40000, 40000]);
    expect(plan.reduce((s, p) => s + p.amountCents, 0)).toBe(120000);
    expect(plan.map((p) => p.installmentNumber)).toEqual([1, 2, 3]);
  });

  it("parcelamento não-exato distribui o centavo e soma o total", () => {
    const plan = buildInstallmentPlan(100000, 3, "2026-11-10", 20); // R$1000 em 3x
    expect(plan.map((p) => p.amountCents)).toEqual([33334, 33333, 33333]);
    expect(plan.reduce((s, p) => s + p.amountCents, 0)).toBe(100000);
  });

  it("resumo de faturas: paga quando pagamento >= total", () => {
    const txs = [
      { invoice_period: "2026-11", kind: "card_expense", amount_cents: 40000 },
      { invoice_period: "2026-11", kind: "card_expense", amount_cents: 10000 },
      { invoice_period: "2026-11", kind: "card_payment", amount_cents: 50000 },
      { invoice_period: "2026-12", kind: "card_expense", amount_cents: 40000 },
    ];
    const invoices = summarizeInvoices(txs, 20, 5, new Date(2026, 11, 1));
    const nov = invoices.find((i) => i.period === "2026-11")!;
    const dez = invoices.find((i) => i.period === "2026-12")!;
    expect(nov.totalCents).toBe(50000);
    expect(nov.isPaid).toBe(true);
    expect(dez.isPaid).toBe(false);
  });
});

describe("resumos do painel", () => {
  const txs: TxLike[] = [
    { kind: "income", amount_cents: 500000, category_id: "sal", occurred_on: "2026-11-05", status: "cleared" },
    { kind: "expense", amount_cents: 120000, category_id: "food", occurred_on: "2026-11-06", status: "cleared" },
    { kind: "card_expense", amount_cents: 80000, category_id: "shop", occurred_on: "2026-11-07", status: "cleared" },
    { kind: "transfer", amount_cents: 100000, category_id: null, occurred_on: "2026-11-08", status: "cleared" },
    { kind: "card_payment", amount_cents: 80000, category_id: null, occurred_on: "2026-11-09", status: "cleared" },
  ];

  it("transferência e pagamento de fatura NÃO contam como receita/despesa", () => {
    const s = summarize(txs);
    expect(s.incomeCents).toBe(500000);
    expect(s.expenseCents).toBe(200000); // 120000 + 80000 (card), NÃO o pagamento
    expect(s.resultCents).toBe(300000);
  });

  it("taxa de economia e % comprometido", () => {
    const s = summarize(txs);
    expect(s.savingsRate).toBeCloseTo(60); // 300000/500000
    expect(committedPercent(s.incomeCents, s.expenseCents)).toBeCloseTo(40);
  });

  it("distribuição por categoria ordenada", () => {
    const slices = expensesByCategory(txs);
    expect(slices[0].categoryId).toBe("food"); // 120000 > 80000
    expect(slices[0].totalCents).toBe(120000);
    expect(slices.reduce((s, c) => s + c.totalCents, 0)).toBe(200000);
  });

  it("orçamento: níveis de alerta", () => {
    expect(budgetStatus(80000, 40000, "food").alertLevel).toBe(50);
    expect(budgetStatus(80000, 60000, "food").alertLevel).toBe(75);
    expect(budgetStatus(80000, 76000, "food").alertLevel).toBe(90);
    expect(budgetStatus(80000, 90000, "food").alertLevel).toBe(100);
    expect(budgetStatus(80000, 90000, "food").remainingCents).toBe(-10000);
  });

  it("patrimônio líquido = ativos - passivos", () => {
    const nw = netWorth({
      accountBalancesCents: [500000, 150000],
      assetItemsCents: [30000000], // imóvel
      liabilityItemsCents: [0],
      debtBalancesCents: [1200000], // financiamento
    });
    expect(nw.assetsCents).toBe(30650000);
    expect(nw.liabilitiesCents).toBe(1200000);
    expect(nw.netCents).toBe(29450000);
  });
});

describe("simulador de dívidas", () => {
  const debts = [
    { id: "a", name: "Cartão", balanceCents: 300000, monthlyRate: 12, minPaymentCents: 30000 },
    { id: "b", name: "Empréstimo", balanceCents: 1000000, monthlyRate: 3, minPaymentCents: 50000 },
  ];

  it("quita todas as dívidas em tempo finito", () => {
    const r = simulatePayoff(debts, "avalanche", 50000);
    expect(r.months).toBeGreaterThan(0);
    expect(r.months).toBeLessThan(1200);
    expect(r.payoffOrder.length).toBe(2);
  });

  it("avalanche ataca o maior juros primeiro (cartão)", () => {
    const r = simulatePayoff(debts, "avalanche", 50000);
    expect(r.payoffOrder[0].id).toBe("a"); // cartão 12% quitado antes
  });

  it("bola de neve ataca o menor saldo primeiro (cartão)", () => {
    const r = simulatePayoff(debts, "snowball", 50000);
    expect(r.payoffOrder[0].id).toBe("a"); // 300000 < 1000000
  });

  it("avalanche economiza >= juros que a bola de neve (ou igual)", () => {
    const c = compareStrategies(debts, 50000);
    expect(c.avalanche.totalInterestCents).toBeLessThanOrEqual(c.snowball.totalInterestCents + 1);
    expect(c.interestSavedAvalancheCents).toBeGreaterThanOrEqual(0);
  });
});
