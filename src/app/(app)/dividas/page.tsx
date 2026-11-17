import type { Metadata } from "next";
import { listDebts } from "@/lib/db/queries";
import { DebtsManager } from "@/components/app/debts-manager";

export const metadata: Metadata = { title: "Dívidas" };
export const dynamic = "force-dynamic";

export default async function DebtsPage() {
  const debts = await listDebts();
  return <DebtsManager debts={debts} />;
}
