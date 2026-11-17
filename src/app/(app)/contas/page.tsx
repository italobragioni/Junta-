import type { Metadata } from "next";
import { listAccounts } from "@/lib/db/queries";
import { AccountsManager } from "@/components/app/accounts-manager";

export const metadata: Metadata = { title: "Contas" };
export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = await listAccounts();
  return <AccountsManager accounts={accounts} />;
}
