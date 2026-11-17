import type { Metadata } from "next";
import { listTransactions, listCategories } from "@/lib/db/queries";
import { currentPeriod, lastNPeriods, periodRange } from "@/lib/finance/period";
import { summarize, expensesByCategory, inPeriod } from "@/lib/finance/calculations";
import { ReportsView, type MonthlyReport, type CategoryReport } from "@/components/app/reports-view";

export const metadata: Metadata = { title: "Relatórios" };
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const period = currentPeriod();
  const periods = lastNPeriods(period, 12);
  const start = periodRange(periods[0]).start;
  const end = periodRange(period).end;

  const [txs, categories] = await Promise.all([
    listTransactions({ from: start, to: end, limit: 5000 }),
    listCategories(),
  ]);
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const monthly: MonthlyReport[] = periods.map((p) => {
    const mt = inPeriod(txs, p);
    const s = summarize(mt);
    return { period: p, income: s.incomeCents, expense: s.expenseCents, result: s.resultCents, savingsRate: s.savingsRate };
  });

  const categoriesByPeriod: Record<string, CategoryReport[]> = {};
  for (const p of periods) {
    const slices = expensesByCategory(inPeriod(txs, p)).slice(0, 10);
    categoriesByPeriod[p] = slices.map((sl) => {
      const cat = sl.categoryId ? catMap.get(sl.categoryId) : undefined;
      return {
        name: cat?.name ?? "Sem categoria",
        color: cat?.color ?? "#94a3b8",
        totalCents: sl.totalCents,
        share: sl.share,
      };
    });
  }

  return <ReportsView monthly={monthly} categoriesByPeriod={categoriesByPeriod} periods={periods} />;
}
