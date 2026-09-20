import type { Metadata } from "next";
import { Repeat } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { formatDate, toDateInputValue } from "@/lib/dates";
import { monthlyEquivalentCents, yearlyEquivalentCents } from "@/lib/finance";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { AlertCard } from "@/components/financial/alert-card";
import {
  AddSubscriptionButton,
  EditSubscriptionButton,
  DeleteSubscriptionButton,
} from "./subscription-forms";

export const metadata: Metadata = { title: "Assinaturas" };

const CYCLE_LABELS: Record<string, string> = {
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  QUARTERLY: "Trimestral",
  YEARLY: "Anual",
};

export default async function AssinaturasPage() {
  const user = await requireUser();
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    orderBy: [{ active: "desc" }, { amountCents: "desc" }],
  });

  const active = subscriptions.filter((s) => s.active);
  const monthlyTotal = active.reduce(
    (acc, s) => acc + monthlyEquivalentCents(s.amountCents, s.billingCycle),
    0,
  );
  const yearlyTotal = active.reduce(
    (acc, s) => acc + yearlyEquivalentCents(s.amountCents, s.billingCycle),
    0,
  );

  return (
    <div>
      <PageHeader
        title="Suas assinaturas"
        description="Controle seus serviços recorrentes e o quanto eles custam."
        action={<AddSubscriptionButton />}
      />

      {subscriptions.length === 0 ? (
        <EmptyState
          icon={<Repeat className="h-6 w-6" />}
          title="Nenhuma assinatura cadastrada"
          description="Cadastre Netflix, Spotify, academia e outros serviços para ver quanto gasta por mês e por ano."
          action={<AddSubscriptionButton label="Adicionar primeira assinatura" />}
        />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">Por mês</p>
              <p className="mt-1 font-bold leading-tight tabular-nums text-brand-600 text-[clamp(1.25rem,5vw,1.5rem)]">
                {formatCents(monthlyTotal)}
              </p>
            </Card>
            <Card className="p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">Por ano</p>
              <p className="mt-1 font-bold leading-tight tabular-nums text-[clamp(1.25rem,5vw,1.5rem)]">
                {formatCents(yearlyTotal)}
              </p>
            </Card>
          </div>

          {active.length >= 5 && (
            <div className="mb-4">
              <AlertCard
                alert={{
                  id: "many-subs",
                  kind: "warning",
                  title: "Você tem muitas assinaturas",
                  message: `São ${active.length} assinaturas ativas, somando ${formatCents(
                    monthlyTotal,
                  )}/mês. Vale revisar quais você realmente usa.`,
                }}
              />
            </div>
          )}

          <Card className="divide-y divide-border">
            {subscriptions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {s.name}
                    {!s.active && (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        inativa
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {CYCLE_LABELS[s.billingCycle]}
                    {s.nextBillingDate &&
                      ` · Próxima: ${formatDate(s.nextBillingDate)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="mr-1 text-right">
                    <p className="whitespace-nowrap font-semibold">
                      {formatCents(s.amountCents)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCents(
                        monthlyEquivalentCents(s.amountCents, s.billingCycle),
                      )}
                      /mês
                    </p>
                  </div>
                  <EditSubscriptionButton
                    subscription={{
                      id: s.id,
                      name: s.name,
                      amountCents: s.amountCents,
                      billingCycle: s.billingCycle,
                      nextBillingDate: s.nextBillingDate
                        ? toDateInputValue(s.nextBillingDate)
                        : "",
                      active: s.active,
                    }}
                  />
                  <DeleteSubscriptionButton id={s.id} />
                </div>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
