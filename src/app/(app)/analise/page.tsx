import type { Metadata } from "next";
import { Sparkles, TrendingDown } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOverspending, getSmartAlerts } from "@/lib/analysis";
import { getFinancialOverview } from "@/lib/finance";
import { formatCents } from "@/lib/money";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { AlertCard } from "@/components/financial/alert-card";
import { SavingsSimulator, PurchaseAnalyzer } from "./tools";
import { Assistant } from "./assistant";

export const metadata: Metadata = { title: "Análise" };

export default async function AnalisePage() {
  const user = await requireUser();

  const [overspending, alerts, overview, goals] = await Promise.all([
    getOverspending(user.id),
    getSmartAlerts(user.id),
    getFinancialOverview(user.id),
    prisma.financialGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        targetAmountCents: true,
        currentAmountCents: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Análise financeira"
        description="Descubra desperdícios e simule seus objetivos com base nos seus próprios dados."
      />

      {/* Onde estou gastando demais */}
      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <TrendingDown className="h-5 w-5 text-amber-600" />
          <CardTitle>Onde estou gastando demais?</CardTitle>
        </CardHeader>
        <CardContent>
          {!overspending.hasHistory ? (
            <p className="text-sm text-muted-foreground">
              Precisamos de pelo menos um mês de histórico para comparar seus
              gastos. Continue registrando suas despesas.
            </p>
          ) : overspending.items.length === 0 ? (
            <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
              Boas notícias! Nenhuma categoria está significativamente acima da
              sua média dos últimos meses. 👏
            </div>
          ) : (
            <div className="space-y-4">
              {overspending.items.map((item) => (
                <div
                  key={item.categoryId ?? item.name}
                  className="rounded-xl border border-amber-200 bg-amber-50/60 p-4"
                >
                  <p className="font-semibold text-amber-900">
                    ⚠️ {item.name}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Você gastou
                      </p>
                      <p className="font-medium">
                        {formatCents(item.currentCents)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Média</p>
                      <p className="font-medium">
                        {formatCents(item.averageCents)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diferença</p>
                      <p className="font-medium text-amber-700">
                        +{formatCents(item.differenceCents)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-amber-900">
                    Se você reduzir esse gasto em{" "}
                    {formatCents(Math.round(item.differenceCents / 2))} por mês,
                    poderá juntar{" "}
                    <strong>
                      {formatCents(
                        Math.round(item.differenceCents / 2) * 12,
                      )}
                    </strong>{" "}
                    em um ano.
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold">Insights</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
        </div>
      )}

      {/* Assistente */}
      <Assistant />

      {/* Simulador */}
      <SavingsSimulator goals={goals} />

      {/* Posso comprar */}
      <PurchaseAnalyzer
        availableCents={Math.max(0, overview.availableCents)}
        monthlySavingsCents={overview.savingsCents}
      />

      {overview.savingsCents === 0 && overview.incomeCents === 0 && (
        <EmptyState
          title="Adicione dados para simulações mais precisas"
          description="Quanto mais receitas e despesas você registrar, melhores ficam as análises e simulações."
        />
      )}
    </div>
  );
}
