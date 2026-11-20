import { redirect } from "next/navigation";
import { authContext, getProfile, getSubscription, listCategories, listAccounts, listCards } from "@/lib/db/queries";
import { isBillingConfigured, isAdminEmail } from "@/lib/env";
import { isPremium } from "@/lib/billing/status";
import { AppShell } from "@/components/app/app-shell";
import { QuickAddProvider } from "@/components/app/quick-add";
import { Toaster } from "@/components/ui/toast";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await authContext();
  if (!ctx) redirect("/entrar");

  // Paywall total: sem assinatura ativa (e sem ser admin), só a tela de
  // assinatura é acessível. Só vale quando a cobrança está configurada.
  if (isBillingConfigured() && !isAdminEmail(ctx.email)) {
    const sub = await getSubscription();
    if (!isPremium(sub)) redirect("/assinar");
  }

  // Consultas resilientes: um erro aqui nunca deve derrubar toda a área logada.
  let profile: Awaited<ReturnType<typeof getProfile>> = null;
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let accounts: Awaited<ReturnType<typeof listAccounts>> = [];
  let cards: Awaited<ReturnType<typeof listCards>> = [];
  try {
    [profile, categories, accounts, cards] = await Promise.all([
      getProfile(),
      listCategories(),
      listAccounts(),
      listCards(),
    ]);
  } catch (e) {
    console.error("AppLayout queries error:", (e as Error)?.message);
  }

  // Primeiro acesso: leva ao assistente de configuração.
  if (profile && !profile.onboarding_completed) redirect("/onboarding");

  const displayName = profile?.display_name || ctx.email?.split("@")[0] || "Você";

  return (
    <QuickAddProvider data={{ categories, accounts, cards }}>
      <AppShell displayName={displayName}>{children}</AppShell>
      <Toaster />
    </QuickAddProvider>
  );
}
