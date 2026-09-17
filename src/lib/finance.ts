import "server-only";
import type { BillingCycle } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  currentMonthRange,
  previousMonthRange,
  lastNMonths,
  monthsUntil,
  type MonthRange,
} from "@/lib/dates";

/** Monthly-equivalent cost in cents for a subscription billing cycle. */
export function monthlyEquivalentCents(
  amountCents: number,
  cycle: BillingCycle,
): number {
  switch (cycle) {
    case "WEEKLY":
      return Math.round((amountCents * 52) / 12);
    case "MONTHLY":
      return amountCents;
    case "QUARTERLY":
      return Math.round(amountCents / 3);
    case "YEARLY":
      return Math.round(amountCents / 12);
    default:
      return amountCents;
  }
}

export function yearlyEquivalentCents(
  amountCents: number,
  cycle: BillingCycle,
): number {
  return monthlyEquivalentCents(amountCents, cycle) * 12;
}

// ---- Aggregations scoped by user ----

async function incomeForRange(
  userId: string,
  range: MonthRange,
): Promise<number> {
  // Monthly income = all recurring incomes (treated as monthly) + one-off
  // incomes dated within the range.
  const [recurring, oneOff] = await Promise.all([
    prisma.income.aggregate({
      where: { userId, recurring: true },
      _sum: { amountCents: true },
    }),
    prisma.income.aggregate({
      where: {
        userId,
        recurring: false,
        date: { gte: range.start, lt: range.end },
      },
      _sum: { amountCents: true },
    }),
  ]);
  return (recurring._sum.amountCents ?? 0) + (oneOff._sum.amountCents ?? 0);
}

async function expensesForRange(
  userId: string,
  range: MonthRange,
): Promise<number> {
  const [recurring, oneOff] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId, recurring: true },
      _sum: { amountCents: true },
    }),
    prisma.expense.aggregate({
      where: {
        userId,
        recurring: false,
        date: { gte: range.start, lt: range.end },
      },
      _sum: { amountCents: true },
    }),
  ]);
  return (recurring._sum.amountCents ?? 0) + (oneOff._sum.amountCents ?? 0);
}

async function subscriptionsMonthlyTotal(userId: string): Promise<number> {
  const subs = await prisma.subscription.findMany({
    where: { userId, active: true },
    select: { amountCents: true, billingCycle: true },
  });
  return subs.reduce(
    (acc, s) => acc + monthlyEquivalentCents(s.amountCents, s.billingCycle),
    0,
  );
}

export interface CategorySpend {
  categoryId: string | null;
  name: string;
  totalCents: number;
}

export async function expensesByCategory(
  userId: string,
  range: MonthRange,
): Promise<CategorySpend[]> {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      OR: [
        { recurring: true },
        { recurring: false, date: { gte: range.start, lt: range.end } },
      ],
    },
    select: {
      amountCents: true,
      categoryId: true,
      category: { select: { name: true } },
    },
  });

  const map = new Map<string, CategorySpend>();
  for (const e of expenses) {
    const key = e.categoryId ?? "__none__";
    const name = e.category?.name ?? "Sem categoria";
    const existing = map.get(key);
    if (existing) {
      existing.totalCents += e.amountCents;
    } else {
      map.set(key, {
        categoryId: e.categoryId ?? null,
        name,
        totalCents: e.amountCents,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.totalCents - a.totalCents);
}

// ---- Goals monthly target ----

/**
 * Estimates how much the user should set aside per month to reach all goals.
 * Uses months-until-target when a date exists; otherwise assumes a gentle
 * 12-month horizon so the number stays meaningful without inventing urgency.
 */
async function monthlyGoalTarget(userId: string): Promise<number> {
  const goals = await prisma.financialGoal.findMany({
    where: { userId },
    select: {
      targetAmountCents: true,
      currentAmountCents: true,
      targetDate: true,
    },
  });

  let total = 0;
  for (const g of goals) {
    const remaining = Math.max(0, g.targetAmountCents - g.currentAmountCents);
    if (remaining <= 0) continue;
    const months = g.targetDate
      ? Math.max(1, monthsUntil(g.targetDate))
      : 12;
    total += Math.round(remaining / months);
  }
  return total;
}

async function totalRemainingBudget(
  userId: string,
  range: MonthRange,
): Promise<number | null> {
  const budgets = await prisma.budget.findMany({
    where: { userId, month: range.month, year: range.year },
    select: { limitAmountCents: true, categoryId: true },
  });
  if (budgets.length === 0) return null;

  const spendByCat = await expensesByCategory(userId, range);
  const spentMap = new Map(spendByCat.map((s) => [s.categoryId, s.totalCents]));

  let remaining = 0;
  for (const b of budgets) {
    const spent = spentMap.get(b.categoryId) ?? 0;
    remaining += Math.max(0, b.limitAmountCents - spent);
  }
  return remaining;
}

// ---- Dashboard overview ----

export interface FinancialOverview {
  month: number;
  year: number;
  incomeCents: number;
  expensesCents: number; // realized expenses + monthly subscriptions
  subscriptionsMonthlyCents: number;
  availableCents: number; // income - expenses
  savingsCents: number; // max(0, available)
  savingsRate: number; // percentage of income saved
  hasEnoughData: boolean;
  categories: CategorySpend[];
  // "Quanto você pode gastar"
  canSpend: {
    valueCents: number;
    monthlyGoalTargetCents: number;
    plannedRecurringCents: number;
    spentSoFarCents: number;
    limitedByBudget: boolean;
    hasEnoughData: boolean;
  };
  // savings progress vs previous month
  savingsProgress: {
    thisMonthCents: number;
    previousMonthCents: number | null;
    deltaCents: number | null;
  };
}

export async function getFinancialOverview(
  userId: string,
  now: Date = new Date(),
): Promise<FinancialOverview> {
  const range = currentMonthRange(now);
  const prevRange = previousMonthRange(now);

  const [
    incomeCents,
    realizedExpenses,
    subscriptionsMonthlyCents,
    categories,
    goalTarget,
    remainingBudget,
    prevIncome,
    prevExpenses,
    prevSubs,
  ] = await Promise.all([
    incomeForRange(userId, range),
    expensesForRange(userId, range),
    subscriptionsMonthlyTotal(userId),
    expensesByCategory(userId, range),
    monthlyGoalTarget(userId),
    totalRemainingBudget(userId, range),
    incomeForRange(userId, prevRange),
    expensesForRange(userId, prevRange),
    // previous subscriptions total is approximated by current active subs
    subscriptionsMonthlyTotal(userId),
  ]);

  const expensesCents = realizedExpenses + subscriptionsMonthlyCents;
  const availableCents = incomeCents - expensesCents;
  const savingsCents = Math.max(0, availableCents);
  const savingsRate =
    incomeCents > 0 ? (availableCents / incomeCents) * 100 : 0;

  const hasEnoughData = incomeCents > 0 || realizedExpenses > 0;

  // can-spend
  const spentSoFarCents = realizedExpenses;
  const plannedRecurringCents = subscriptionsMonthlyCents;
  let canSpendValue =
    incomeCents - spentSoFarCents - plannedRecurringCents - goalTarget;
  let limitedByBudget = false;
  if (remainingBudget !== null && remainingBudget < canSpendValue) {
    canSpendValue = remainingBudget;
    limitedByBudget = true;
  }
  canSpendValue = Math.max(0, canSpendValue);

  const prevAvailable = prevIncome - (prevExpenses + prevSubs);
  const prevSavings = Math.max(0, prevAvailable);
  const hadPrevData = prevIncome > 0 || prevExpenses > 0;

  return {
    month: range.month,
    year: range.year,
    incomeCents,
    expensesCents,
    subscriptionsMonthlyCents,
    availableCents,
    savingsCents,
    savingsRate,
    hasEnoughData,
    categories,
    canSpend: {
      valueCents: canSpendValue,
      monthlyGoalTargetCents: goalTarget,
      plannedRecurringCents,
      spentSoFarCents,
      limitedByBudget,
      hasEnoughData: incomeCents > 0,
    },
    savingsProgress: {
      thisMonthCents: savingsCents,
      previousMonthCents: hadPrevData ? prevSavings : null,
      deltaCents: hadPrevData ? savingsCents - prevSavings : null,
    },
  };
}

/** Average monthly spend per category over the last N months (excluding current). */
export async function categoryMonthlyAverages(
  userId: string,
  monthsBack = 3,
  now: Date = new Date(),
): Promise<Map<string, number>> {
  const ranges = lastNMonths(monthsBack + 1, now).slice(1); // exclude current
  if (ranges.length === 0) return new Map();

  const totals = new Map<string, number>();
  for (const range of ranges) {
    const cats = await expensesByCategory(userId, range);
    for (const c of cats) {
      const key = c.categoryId ?? "__none__";
      totals.set(key, (totals.get(key) ?? 0) + c.totalCents);
    }
  }
  const averages = new Map<string, number>();
  for (const [key, sum] of totals) {
    averages.set(key, Math.round(sum / ranges.length));
  }
  return averages;
}
