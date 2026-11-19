import Link from "next/link";
import { Crown, Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { env } from "@/lib/env";

/** Tela de bloqueio amigável para recursos Premium. */
export function PremiumUpsell({
  feature,
  description,
}: {
  feature: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-md">
      <Card className="overflow-hidden">
        <div className="brand-gradient p-6 text-center text-white">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Crown className="h-7 w-7" />
          </span>
          <h1 className="mt-3 text-xl font-bold">{feature} é Premium</h1>
          <p className="mx-auto mt-1 max-w-xs text-sm text-white/85">
            {description ?? "Assine o Finora Premium para desbloquear este recurso."}
          </p>
        </div>
        <CardContent className="p-5">
          <ul className="space-y-2.5">
            {[
              "Finora IA ilimitada",
              "Relatórios e exportações avançadas",
              "Metas e orçamentos sem limites",
              "Suporte prioritário",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-positive-soft text-positive">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-5 w-full">
            <Link href="/assinar">
              Assinar por {formatBRL(env.premiumPriceCents)}/mês
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
