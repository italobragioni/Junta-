import type { Metadata } from "next";
import { getProfile, listCategories, authContext } from "@/lib/db/queries";
import { SettingsView } from "@/components/app/settings-view";

export const metadata: Metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [profile, categories, ctx] = await Promise.all([
    getProfile(),
    listCategories(),
    authContext(),
  ]);
  return <SettingsView profile={profile} email={ctx?.email ?? null} categories={categories} />;
}
