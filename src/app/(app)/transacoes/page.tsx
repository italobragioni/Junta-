import type { Metadata } from "next";
import { listTransactions, listCategories, listAccounts, listCards } from "@/lib/db/queries";
import { currentPeriod, periodRange } from "@/lib/finance/period";
import { TransactionsView } from "@/components/app/transactions-view";

export const metadata: Metadata = { title: "Transações" };
export const dynamic = "force-dynamic";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const period = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : currentPeriod();
  const { start, end } = periodRange(period);

  const [transactions, categories, accounts, cards] = await Promise.all([
    listTransactions({ from: start, to: end, limit: 2000 }),
    listCategories(),
    listAccounts(),
    listCards(),
  ]);

  return (
    <TransactionsView
      period={period}
      transactions={transactions}
      categories={categories}
      accounts={accounts}
      cards={cards}
    />
  );
}
