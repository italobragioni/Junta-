"use client";

import * as React from "react";
import { Sparkles, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Leva ao checkout da Cakto (nova aba) e passa a "escutar" a confirmação do
 * pagamento. Assim que o Premium é ativado pelo webhook, redireciona sozinho
 * para o painel — sem a pessoa precisar atualizar.
 */
export function SubscribeButton({ checkoutUrl, priceLabel }: { checkoutUrl: string; priceLabel: string }) {
  const [waiting, setWaiting] = React.useState(false);
  const [checking, setChecking] = React.useState(false);

  // Checa o status; se já é Premium, vai para o painel (reload para o layout
  // reavaliar o acesso).
  const check = React.useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/subscription/status", { cache: "no-store" });
      const data = await res.json();
      if (data?.premium) {
        window.location.assign("/painel");
        return true;
      }
    } catch {
      /* ignora erros transitórios */
    }
    return false;
  }, []);

  // Enquanto estiver aguardando: verifica a cada 5s e também quando a aba volta ao foco.
  React.useEffect(() => {
    if (!waiting) return;
    let active = true;
    const interval = setInterval(() => {
      if (active) check();
    }, 5000);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [waiting, check]);

  function start() {
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    setWaiting(true);
  }

  async function checkNow() {
    setChecking(true);
    const done = await check();
    setChecking(false);
    if (!done && !waiting) setWaiting(true);
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <Button size="lg" className="w-full" onClick={start}>
        <Sparkles className="h-4 w-4" />
        Assinar por {priceLabel}/mês
        <ExternalLink className="h-4 w-4" />
      </Button>

      {waiting ? (
        <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-center text-sm">
          <p className="flex items-center justify-center gap-2 font-medium text-brand">
            <Loader2 className="h-4 w-4 animate-spin" />
            Aguardando a confirmação do pagamento…
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Assim que for aprovado, você entra automaticamente. Pode deixar esta aba aberta.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={checkNow}
          disabled={checking}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Já paguei — verificar agora
        </button>
      )}
    </div>
  );
}
