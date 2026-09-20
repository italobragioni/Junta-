"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/money";
import { PLAN_ORDER, PLANS, type PlanId } from "@/lib/plans";

const HIGHLIGHTS: Record<PlanId, string[]> = {
  FREE: [
    "Até 10 receitas por mês",
    "Até 10 despesas por mês",
    "1 meta e 1 orçamento",
    "Até 3 assinaturas",
    "Análises básicas + simulador",
    "Histórico de 3 meses",
  ],
  BASIC: [
    "Receitas e despesas ilimitadas",
    "Até 5 metas e 5 orçamentos",
    "Até 10 assinaturas",
    "Análise avançada + “Posso comprar?”",
    "Exportação CSV",
    "Histórico de 12 meses",
  ],
  PRO: [
    "Tudo do Básico, sem limites",
    "Metas, orçamentos e assinaturas ilimitados",
    "Assistente com IA + insights",
    "Exportação CSV e PDF",
    "Histórico ilimitado",
    "Recursos futuros exclusivos",
  ],
};

export function PlanCards({
  authed,
  currentPlan,
}: {
  authed: boolean;
  currentPlan?: PlanId;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<PlanId | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function choose(plan: PlanId) {
    setError(null);
    if (!authed) {
      router.push("/cadastro");
      return;
    }
    if (plan === "FREE") {
      router.push("/configuracoes/assinatura");
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Não foi possível iniciar o checkout.");
      }
    } catch {
      setError("Não foi possível iniciar o checkout. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const isPro = id === "PRO";
          const isCurrent = currentPlan === id;
          return (
            <Card
              key={id}
              className={cn(
                "relative flex flex-col p-6",
                isPro && "border-brand-300 ring-2 ring-brand-500",
              )}
            >
              {isPro && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Mais completo
                </span>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-bold tracking-tight">
                  {plan.priceCents === 0 ? "R$ 0" : formatCents(plan.priceCents)}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">/mês</span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {HIGHLIGHTS[id].map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Seu plano atual
                  </Button>
                ) : id === "FREE" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => choose(id)}
                  >
                    {authed ? "Gerenciar assinatura" : "Começar grátis"}
                  </Button>
                ) : (
                  <Button
                    variant={isPro ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => choose(id)}
                    disabled={loading !== null}
                  >
                    {loading === id && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {authed ? `Escolher ${plan.name}` : "Começar grátis"}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      {!authed && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Você cria sua conta gratuitamente e escolhe um plano pago quando
          quiser.{" "}
          <Link href="/cadastro" className="font-medium text-brand-600">
            Criar conta
          </Link>
        </p>
      )}
    </div>
  );
}
