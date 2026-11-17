import type { Metadata } from "next";
import { listPatrimony, listAccounts, listDebts } from "@/lib/db/queries";
import { PatrimonyManager } from "@/components/app/patrimony-manager";

export const metadata: Metadata = { title: "Patrimônio" };
export const dynamic = "force-dynamic";

export default async function PatrimonyPage() {
  const [items, accounts, debts] = await Promise.all([
    listPatrimony(),
    listAccounts(),
    listDebts(),
  ]);
  return <PatrimonyManager items={items} accounts={accounts} debts={debts} />;
}
