import type { Metadata } from "next";
import { isAiConfigured, isBillingConfigured } from "@/lib/env";
import { getSubscription } from "@/lib/db/queries";
import { isPremium } from "@/lib/billing/status";
import { FinoraChat } from "@/components/app/finora-chat";
import { PremiumUpsell } from "@/components/app/premium-upsell";

export const metadata: Metadata = { title: "Finora IA" };
export const dynamic = "force-dynamic";

export default async function FinoraAiPage() {
  // Só exige Premium quando a cobrança está ativa. Enquanto a Cakto não estiver
  // configurada, a Finora IA fica liberada para todos.
  if (isBillingConfigured()) {
    const sub = await getSubscription();
    if (!isPremium(sub)) {
      return (
        <PremiumUpsell
          feature="Finora IA"
          description="Converse com seu assistente financeiro pessoal e tenha respostas sobre o seu dinheiro."
        />
      );
    }
  }
  return <FinoraChat aiConfigured={isAiConfigured()} />;
}
