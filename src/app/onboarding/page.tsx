import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authContext, getProfile } from "@/lib/db/queries";
import { OnboardingWizard } from "./onboarding-wizard";

export const metadata: Metadata = { title: "Bem-vindo" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const ctx = await authContext();
  if (!ctx) redirect("/entrar");
  const profile = await getProfile();
  if (profile?.onboarding_completed) redirect("/painel");

  return (
    <OnboardingWizard
      defaultName={profile?.display_name || ctx.email?.split("@")[0] || ""}
    />
  );
}
