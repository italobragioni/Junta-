import type { Metadata } from "next";
import { listRecurring, listCategories, listAccounts } from "@/lib/db/queries";
import { SubscriptionsManager } from "@/components/app/subscriptions-manager";

export const metadata: Metadata = { title: "Assinaturas" };
export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const [recurring, categories, accounts] = await Promise.all([
    listRecurring(),
    listCategories(),
    listAccounts(),
  ]);
  const subscriptions = recurring.filter((r) => r.is_subscription);
  return <SubscriptionsManager subscriptions={subscriptions} categories={categories} accounts={accounts} />;
}
