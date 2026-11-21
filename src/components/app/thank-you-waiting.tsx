"use client";

import * as React from "react";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL, WhatsAppIcon } from "@/components/brand/whatsapp-button";

/**
 * Página de retorno pós-pagamento: fica verificando o status e, assim que o
 * Premium é confirmado pelo webhook da Cakto, leva a pessoa ao painel.
 */
export function ThankYouWaiting() {
  const [slow, setSlow] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    let attempts = 0;

    const check = async () => {
      try {
        const res = await fetch("/api/subscription/status", { cache: "no-store" });
        const data = await res.json();
        if (data?.premium && active) {
          setDone(true);
          setTimeout(() => window.location.assign("/painel"), 900);
          return true;
        }
      } catch {
        /* ignora erros transitórios */
      }
      return false;
    };

    check();
    const interval = setInterval(async () => {
      attempts += 1;
      if (attempts > 40) setSlow(true); // ~2min
      const ok = await check();
      if (ok) clearInterval(interval);
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-5 text-center">
      <div className="w-full max-w-sm">
        {done ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-positive-soft text-positive">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight">Pagamento confirmado! 🎉</h1>
            <p className="mt-1 text-sm text-muted-foreground">Levando você para o painel…</p>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient text-white">
              <Loader2 className="h-9 w-9 animate-spin" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight">Confirmando seu pagamento…</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Estamos liberando seu acesso. Isso leva alguns instantes — pode deixar esta tela aberta.
            </p>

            {slow && (
              <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm">
                <p className="text-muted-foreground">
                  Está demorando mais que o normal. Seu acesso é liberado automaticamente assim que a Cakto confirma o pagamento. Você pode tentar o painel ou falar com a gente.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Button asChild size="sm" className="w-full">
                    <a href="/painel">Tentar o painel <ArrowRight className="h-4 w-4" /></a>
                  </Button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Falar no WhatsApp
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
