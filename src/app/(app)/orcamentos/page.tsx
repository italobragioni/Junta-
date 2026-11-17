import type { Metadata } from "next";
import { listBudgets, listCategories, listTransactions } from "@/lib/db/queries";
import { currentPeriod, periodRange } from "@/lib/finance/period";
import { isExpense } from "@/lib/finance/calculations";
import { BudgetsManager } from "@/components/app/budgets-manager";

export const metadata: Metadata = { title: "Orçamentos" };
export const dynamic = "force-dynamic";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const period = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : currentPeriod();
  const { start, end } = periodRange(period);

  const [budgets, categories, txs] = await Promise.all([
    listBudgets(period),
    listCategories(),
    listTransactions({ from: start, to: end, limit: 3000 }),
  ]);

  const usedByCategory: Record<string, number> = {};
  for (const t of txs) {
    if (isExpense(t) && t.category_id) {
      usedByCategory[t.category_id] = (usedByCategory[t.category_id] ?? 0) + t.amount_cents;
    }
  }

  return (
    <BudgetsManager
      period={period}
      categories={categories}
      budgets={budgets}
      usedByCategory={usedByCategory}
    />
  );
}
