import type { Metadata } from "next";
import { listGoals } from "@/lib/db/queries";
import { GoalsManager } from "@/components/app/goals-manager";

export const metadata: Metadata = { title: "Metas" };
export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const goals = await listGoals();
  return <GoalsManager goals={goals} />;
}
