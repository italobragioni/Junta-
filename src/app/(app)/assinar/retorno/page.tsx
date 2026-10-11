import Link from "next/link";
import { Clock } from "lucide-react";

import { getUserState } from "@/lib/progress/read";
import { AutoRefresh } from "./auto-refresh";

export const metadata = { title: "Pagamento em confirmação" };

/**
 * The checkout return page. It NEVER grants access — URL parameters and the
 * browser are untrusted. Access only becomes Premium after a verified webhook
 * from the provider. This page just tells the user we're confirming.
 */
export default async function CheckoutReturnPage() {
  const state = await getUserState();
  const isPremium = state?.plan === "premium";

  return (
    <main className="container-app py-16 text-center">
      {/* While confirming, refresh on its own so the page flips to Premium
          the moment the webhook grants access — no manual reload. */}
      <AutoRefresh done={isPremium} />
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
        <Clock className="h-6 w-6 text-brand-600" aria-hidden />
      </div>
      {isPremium ? (
        <>
          <h1 className="text-2xl font-extrabold">Premium ativado!</h1>
          <p className="mt-2 text-muted-foreground">Seu acesso já está liberado.</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold">Pagamento em confirmação</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Recebemos seu retorno do checkout. Assim que o provedor confirmar o
            pagamento, seu acesso Premium será liberado automaticamente — esta
            tela atualiza sozinha, você não precisa fazer nada.
          </p>
        </>
      )}
      <Link
        href="/aprender"
        className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-600 px-6 font-semibold text-white"
      >
        Voltar às trilhas
      </Link>
    </main>
  );
}
