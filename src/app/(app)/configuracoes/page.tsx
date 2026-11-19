import type { Metadata } from "next";
import { getProfile, listCategories, authContext, getSubscription } from "@/lib/db/queries";
import { isPremium } from "@/lib/billing/status";
import { SettingsView } from "@/components/app/settings-view";

export const metadata: Metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [profile, categories, ctx, sub] = await Promise.all([
    getProfile(),
    listCategories(),
    authContext(),
    getSubscription(),
  ]);
  return (
    <SettingsView
      profile={profile}
      email={ctx?.email ?? null}
      categories={categories}
      premium={isPremium(sub)}
      periodEnd={sub?.current_period_end ?? null}
      subStatus={sub?.status ?? "free"}
    />
  );
}
