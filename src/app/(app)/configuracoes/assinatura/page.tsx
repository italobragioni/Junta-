import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlanUsage } from "@/lib/plan-access";
import { PLANS, type PlanId } from "@/lib/plans";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/plans/plan-badge";
import { PlanUsageList } from "@/components/plans/plan-usage";
import { ManageSubscriptionButton } from "./manage-button";

export const metadata: Metadata = { title: "Assinatura" };

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  TRIALING: "Em período de teste",
  PAST_DUE: "Pagamento pendente",
  CANCELED: "Cancelada",
  INCOMPLETE: "Incompleta",
};

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const [billing, usage] = await Promise.all([
    prisma.planSubscription.findUnique({
      where: { userId: user.id },
      select: {
        status: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
    getPlanUsage(user),
  ]);

  const plan: PlanId = user.plan;
  const isPaid = plan !== "FREE";
  const status = billing?.status ?? "ACTIVE";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assinatura"
        description="Gerencie seu plano e acompanhe o uso."
      />

      {sp.checkout === "success" && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          Pagamento recebido! Seu plano é atualizado automaticamente assim que a
          confirmação é processada. Se ainda aparecer o plano antigo, atualize a
          página em instantes.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plano atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PlanBadge plan={plan} />

          <div className="space-y-2 text-sm">
            <Row label="Plano" value={PLANS[plan].name} />
            <Row label="Status" value={STATUS_LABELS[status] ?? status} />
            {isPaid && billing?.currentPeriodEnd && (
              <Row
                label={
                  billing.cancelAtPeriodEnd ? "Acesso até" : "Próxima cobrança"
                }
                value={formatDate(billing.currentPeriodEnd)}
              />
            )}
          </div>

          {isPaid && billing?.cancelAtPeriodEnd && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Sua assinatura foi cancelada e permanece ativa até o fim do período
              pago. Depois disso, sua conta volta ao plano Gratuito — seus dados
              financeiros continuam salvos.
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {isPaid ? (
              <ManageSubscriptionButton />
            ) : (
              <Link href="/planos">
                <Button>Ver planos</Button>
              </Link>
            )}
            {plan === "BASIC" && (
              <Link href="/planos">
                <Button variant="outline">Fazer upgrade para Pro</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seu plano</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanUsageList usage={usage} />
          {plan === "FREE" && (
            <p className="mt-4 text-sm text-muted-foreground">
              Precisa de mais espaço?{" "}
              <Link
                href="/planos"
                className="font-medium text-brand-600 hover:underline"
              >
                Conheça os planos Básico e Pro
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
