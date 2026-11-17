import type { Metadata } from "next";
import { listBills, listCategories, listAccounts } from "@/lib/db/queries";
import { BillsManager } from "@/components/app/bills-manager";

export const metadata: Metadata = { title: "Contas a pagar" };
export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const [bills, categories, accounts] = await Promise.all([
    listBills(),
    listCategories(),
    listAccounts(),
  ]);
  return <BillsManager bills={bills} categories={categories} accounts={accounts} />;
}
