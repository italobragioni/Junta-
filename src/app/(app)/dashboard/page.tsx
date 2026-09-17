import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFinancialOverview } from "@/lib/finance";
import { getSmartAlerts } from "@/lib/analysis";
import { formatCents, formatPercent } from "@/lib/money";
import { monthName } from "@/lib/dates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { FinancialCard } from "@/components/financial/financial-card";
import { CategoryRanking } from "@/components/financial/category-ranking";
import { AlertCard } from "@/components/financial/alert-card";
import { AddIncomeButton } from "../receitas/income-dialogs";
import { AddExpenseButton } from "../despesas/expense-dialogs";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();

  const [overview, alerts, categories] = await Promise.all([
    getFinancialOverview(user.id),
    getSmartAlerts(user.id),
    prisma.category.findMany({
      where: { userId: user.id, type: "EXPENSE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const firstName = user.name.split(" ")[0];
  const { canSpend, savingsProgress } = overview;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {firstName} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Aqui está sua vida financeira · {monthName(overview.month)}{" "}
          {overview.year}
        </p>
      </div>

      {!overview.hasEnoughData && (
        <EmptyState
          icon={<Sparkles className="h-6 w-6" />}
          title="Vamos começar a organizar"
          description="Adicione suas receitas e despesas para ver seu resumo financeiro, quanto pode gastar e quanto consegue economizar."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <AddExpenseButton categories={categories} />
              <AddIncomeButton />
            </div>
          }
        />
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinancialCard
          label="Renda"
          value={formatCents(overview.incomeCents)}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="positive"
        />
        <FinancialCard
          label="Gastos"
          value={formatCents(overview.expensesCents)}
          icon={<TrendingDown className="h-4 w-4" />}
          tone="negative"
        />
        <FinancialCard
          label="Disponível"
          value={formatCents(overview.availableCents)}
          icon={<Wallet className="h-4 w-4" />}
          tone={overview.availableCents >= 0 ? "neutral" : "negative"}
        />
        <FinancialCard
          label="Economia"
          value={formatCents(overview.savingsCents)}
          icon={<PiggyBank className="h-4 w-4" />}
          tone="brand"
          hint={
            overview.incomeCents > 0
              ? `${formatPercent(overview.savingsRate)} da sua renda`
              : undefined
          }
        />
      </div>

      {/* Highlight: how much you can spend */}
      <Card className="overflow-hidden border-brand-200 bg-brand-600 text-white">
        <CardContent className="p-6 sm:p-8">
          <p className="text-sm font-medium text-brand-50">
            Quanto você pode gastar
          </p>
          {canSpend.hasEnoughData ? (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {formatCents(canSpend.valueCents)}
              </p>
              <p className="mt-2 max-w-xl text-sm text-brand-50">
                Este é o valor estimado que você ainda pode gastar este mês sem
                ultrapassar seu orçamento
                {canSpend.monthlyGoalTargetCents > 0 &&
                  " e mantendo suas metas de economia"}
                {canSpend.limitedByBudget && " (limitado pelo seu orçamento)"}.
              </p>
            </>
          ) : (
            <p className="mt-2 max-w-xl text-sm text-brand-50">
              Informe sua renda e despesas para calcularmos quanto você ainda
              pode gastar com segurança este mês.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Savings progress */}
        <Card>
          <CardHeader>
            <CardTitle>Seu progresso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold text-brand-600">
              {formatCents(savingsProgress.thisMonthCents)}
            </p>
            <p className="text-sm text-muted-foreground">
              Você já economizou este valor em {monthName(overview.month)}.
            </p>
            {savingsProgress.deltaCents !== null ? (
              <p className="text-sm font-medium">
                {savingsProgress.deltaCents >= 0 ? (
                  <span className="text-brand-600">
                    Você economizou {formatCents(savingsProgress.deltaCents)} a
                    mais que no mês passado. 🎉
                  </span>
                ) : (
                  <span className="text-amber-600">
                    Você economizou{" "}
                    {formatCents(Math.abs(savingsProgress.deltaCents))} a menos
                    que no mês passado.
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Continue registrando para compararmos com os próximos meses.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category ranking */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Gastos por categoria</CardTitle>
            <Link
              href="/analise"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Ver análise
            </Link>
          </CardHeader>
          <CardContent>
            <CategoryRanking categories={overview.categories} />
          </CardContent>
        </Card>
      </div>

      {/* Smart alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Alertas inteligentes</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickLink
          href="/analise"
          title="Onde estou gastando demais?"
          description="Descubra desperdícios e oportunidades."
        />
        <QuickLink
          href="/metas"
          title="Minhas metas"
          description="Acompanhe seus objetivos financeiros."
        />
        <QuickLink
          href="/orcamento"
          title="Orçamento"
          description="Defina limites por categoria."
        />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-brand-600" />
        </div>
      </Card>
    </Link>
  );
}
