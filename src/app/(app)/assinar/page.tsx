import Link from "next/link";
import { ArrowLeft, Check, Info } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserState } from "@/lib/progress/read";
import { billingAvailable } from "@/lib/billing/cakto";
import { SubscribeButton } from "./subscribe-button";

export const metadata = { title: "Assinar o Premium" };

const INCLUDED = [
  "Todas as lições publicadas",
  "Novas trilhas quando forem efetivamente lançadas",
  "Revisão dos erros de todo o conteúdo acessível",
];

export default async function SubscribePage() {
  const state = await getUserState();
  const canBuy = billingAvailable();
  const isPremium = state?.plan === "premium";

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/aprender" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
          </Link>
          <Logo showWordmark={false} />
          <span className="w-16" />
        </div>
      </header>

      <main className="container-app py-8">
        <h1 className="text-2xl font-extrabold">Civio Premium</h1>
        <p className="mt-1 text-muted-foreground">
          Acesso completo às lições publicadas.
        </p>

        <Card className="mt-6 border-brand-200">
          <CardContent className="pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">R$ 19,90</span>
              <span className="text-muted-foreground">/mês</span>
              <Badge tone="amber" className="ml-auto">Preço de teste</Badge>
            </div>

            <ul className="mt-5 flex flex-col gap-2">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs text-muted-foreground">
              Mostramos exatamente o que está incluído antes de iniciar a
              assinatura. Não prometemos conteúdo que ainda não existe. O cancelamento
              preserva o acesso já pago até o fim do período.
            </p>

            <div className="mt-6">
              {isPremium ? (
                <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  Você já tem o Premium ativo. Obrigado pelo apoio!
                </div>
              ) : canBuy ? (
                <SubscribeButton />
              ) : (
                <div
                  role="note"
                  className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                >
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <p>
                    A cobrança ainda não está ativada neste ambiente. A integração
                    de pagamento (Cakto) precisa ser configurada e verificada antes
                    de aceitar assinaturas. Consulte o README.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
