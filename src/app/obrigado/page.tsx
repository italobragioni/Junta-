import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authContext, getSubscription } from "@/lib/db/queries";
import { isAdminEmail } from "@/lib/env";
import { isPremium } from "@/lib/billing/status";
import { ThankYouWaiting } from "@/components/app/thank-you-waiting";

export const metadata: Metadata = { title: "Pagamento confirmado" };
export const dynamic = "force-dynamic";

export default async function ObrigadoPage() {
  const ctx = await authContext();
  if (!ctx) redirect("/entrar");

  // Se o acesso já está ativo, vai direto ao painel.
  if (isAdminEmail(ctx.email)) redirect("/painel");
  const sub = await getSubscription();
  if (isPremium(sub)) redirect("/painel");

  // Ainda confirmando: tela de espera que redireciona sozinha quando ativar.
  return <ThankYouWaiting />;
}
