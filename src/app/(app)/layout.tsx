import { redirect } from "next/navigation";
import { authContext, getProfile, listCategories, listAccounts, listCards } from "@/lib/db/queries";
import { AppShell } from "@/components/app/app-shell";
import { QuickAddProvider } from "@/components/app/quick-add";
import { Toaster } from "@/components/ui/toast";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await authContext();
  if (!ctx) redirect("/entrar");

  const [profile, categories, accounts, cards] = await Promise.all([
    getProfile(),
    listCategories(),
    listAccounts(),
    listCards(),
  ]);

  const displayName = profile?.display_name || ctx.email?.split("@")[0] || "Você";

  return (
    <QuickAddProvider data={{ categories, accounts, cards }}>
      <AppShell displayName={displayName}>{children}</AppShell>
      <Toaster />
    </QuickAddProvider>
  );
}
