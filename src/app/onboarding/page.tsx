import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authContext, getProfile, getSubscription } from "@/lib/db/queries";
import { isBillingConfigured, isAdminEmail } from "@/lib/env";
import { isPremium } from "@/lib/billing/status";
import { OnboardingWizard } from "./onboarding-wizard";

export const metadata: Metadata = { title: "Bem-vindo" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const ctx = await authContext();
  if (!ctx) redirect("/entrar");

  // Paywall: precisa ser assinante (ou admin) para acessar o onboarding.
  if (isBillingConfigured() && !isAdminEmail(ctx.email)) {
    const sub = await getSubscription();
    if (!isPremium(sub)) redirect("/assinar");
  }

  const profile = await getProfile();
  if (profile?.onboarding_completed) redirect("/painel");

  return (
    <OnboardingWizard
      defaultName={profile?.display_name || ctx.email?.split("@")[0] || ""}
    />
  );
}
