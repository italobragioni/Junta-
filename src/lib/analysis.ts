import "server-only";
import { prisma } from "@/lib/db";
import {
  categoryMonthlyAverages,
  expensesByCategory,
} from "@/lib/finance";
import { currentMonthRange } from "@/lib/dates";

export interface OverspendingItem {
  categoryId: string | null;
  name: string;
  currentCents: number;
  averageCents: number;
  differenceCents: number; // current - average (positive = overspending)
  percentOver: number;
  // If they cut this overspend, how much they'd save in a year.
  yearlyPotentialCents: number;
}

/**
 * "Onde estou gastando demais?" — compares this month's spend per category
 * against the average of previous months. Only returns categories that are
 * meaningfully above their historical average, based on real data.
 */
export async function getOverspending(
  userId: string,
  now: Date = new Date(),
): Promise<{ items: OverspendingItem[]; hasHistory: boolean }> {
  const range = currentMonthRange(now);
  const [current, averages] = await Promise.all([
    expensesByCategory(userId, range),
    categoryMonthlyAverages(userId, 3, now),
  ]);

  const hasHistory = averages.size > 0;
  if (!hasHistory) return { items: [], hasHistory };

  const items: OverspendingItem[] = [];
  for (const cat of current) {
    const key = cat.categoryId ?? "__none__";
    const average = averages.get(key) ?? 0;
    const difference = cat.totalCents - average;
    // Only flag if above average by a relevant margin (>10% and >R$20).
    if (average > 0 && difference > 2000 && difference / average > 0.1) {
      items.push({
        categoryId: cat.categoryId,
        name: cat.name,
        currentCents: cat.totalCents,
        averageCents: average,
        differenceCents: difference,
        percentOver: (difference / average) * 100,
        yearlyPotentialCents: difference * 12,
      });
    }
  }

  items.sort((a, b) => b.differenceCents - a.differenceCents);
  return { items, hasHistory };
}

export interface SmartAlert {
  id: string;
  kind: "warning" | "info" | "success";
  title: string;
  message: string;
}

/**
 * Builds intelligent alerts from real data only. Never fabricates comparisons
 * when history is missing.
 */
export async function getSmartAlerts(
  userId: string,
  now: Date = new Date(),
): Promise<SmartAlert[]> {
  const alerts: SmartAlert[] = [];
  const range = currentMonthRange(now);

  // 1) Category increase vs average
  const { items } = await getOverspending(userId, now);
  for (const item of items.slice(0, 2)) {
    alerts.push({
      id: `overspend-${item.categoryId ?? "none"}`,
      kind: "warning",
      title: `Gasto acima da média em ${item.name}`,
      message: `Seu gasto com ${item.name.toLowerCase()} aumentou ${item.percentOver.toFixed(
        0,
      )}% em relação à média dos últimos meses.`,
    });
  }

  // 2) Budgets over threshold
  const budgets = await prisma.budget.findMany({
    where: { userId, month: range.month, year: range.year },
    include: { category: { select: { name: true } } },
  });
  if (budgets.length > 0) {
    const spend = await expensesByCategory(userId, range);
    const spentMap = new Map(spend.map((s) => [s.categoryId, s.totalCents]));
    for (const b of budgets) {
      const spent = spentMap.get(b.categoryId) ?? 0;
      if (b.limitAmountCents <= 0) continue;
      const pct = (spent / b.limitAmountCents) * 100;
      if (pct >= 100) {
        alerts.push({
          id: `budget-over-${b.id}`,
          kind: "warning",
          title: `Orçamento excedido: ${b.category.name}`,
          message: `Você ultrapassou o orçamento de ${b.category.name.toLowerCase()}.`,
        });
      } else if (pct >= 80) {
        alerts.push({
          id: `budget-warn-${b.id}`,
          kind: "warning",
          title: `Atenção ao orçamento de ${b.category.name}`,
          message: `Você já utilizou ${pct.toFixed(0)}% do orçamento de ${b.category.name.toLowerCase()}.`,
        });
      }
    }
  }

  // 3) Subscriptions total
  const subs = await prisma.subscription.findMany({
    where: { userId, active: true },
    select: { amountCents: true, billingCycle: true },
  });
  if (subs.length >= 1) {
    const { monthlyEquivalentCents } = await import("@/lib/finance");
    const monthly = subs.reduce(
      (acc, s) => acc + monthlyEquivalentCents(s.amountCents, s.billingCycle),
      0,
    );
    if (monthly > 0) {
      const { formatCents } = await import("@/lib/money");
      alerts.push({
        id: "subscriptions-total",
        kind: subs.length >= 5 ? "warning" : "info",
        title: "Assinaturas recorrentes",
        message: `Você possui ${formatCents(monthly)}/mês em assinaturas recorrentes${
          subs.length >= 5 ? ". Vale revisar se usa todas." : "."
        }`,
      });
    }
  }

  return alerts;
}
