"use client";

import * as React from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Leva o usuário ao checkout da Cakto (abre em nova aba). */
export function SubscribeButton({ checkoutUrl, priceLabel }: { checkoutUrl: string; priceLabel: string }) {
  const [clicked, setClicked] = React.useState(false);
  return (
    <div className="flex flex-col items-stretch gap-2">
      <Button
        size="lg"
        className="w-full"
        onClick={() => {
          setClicked(true);
          window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        }}
      >
        <Sparkles className="h-4 w-4" />
        Assinar por {priceLabel}/mês
        <ExternalLink className="h-4 w-4" />
      </Button>
      {clicked && (
        <p className="text-center text-xs text-muted-foreground">
          Abrimos o checkout em outra aba. Após o pagamento ser aprovado, seu Premium é ativado automaticamente —
          pode levar alguns instantes. Atualize esta página se necessário.
        </p>
      )}
    </div>
  );
}
