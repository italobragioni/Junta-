import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { currentMonthRange, monthName } from "@/lib/dates";
import { expensesByCategory } from "@/lib/finance";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/states";
import { AddBudgetButton, DeleteBudgetButton } from "./budget-forms";

export const metadata: Metadata = { title: "Orçamento" };

export default async function OrcamentoPage() {
  const user = await requireUser();
  const range = currentMonthRange();

  const [categories, budgets, spend] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id, type: "EXPENSE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.budget.findMany({
      where: { userId: user.id, month: range.month, year: range.year },
      include: { category: { select: { name: true } } },
      orderBy: { limitAmountCents: "desc" },
    }),
    expensesByCategory(user.id, range),
  ]);

  const spentMap = new Map(spend.map((s) => [s.categoryId, s.totalCents]));

  return (
    <div>
      <PageHeader
        title="Orçamento"
        description={`Limites por categoria · ${monthName(range.month)} ${range.year}`}
        action={
          <AddBudgetButton
            categories={categories}
            month={range.month}
            year={range.year}
          />
        }
      />

      {budgets.length === 0 ? (
        <EmptyState
          icon={<Wallet className="h-6 w-6" />}
          title="Nenhum orçamento definido"
          description="Defina quanto pretende gastar em cada categoria neste mês e receba alertas ao se aproximar do limite."
          action={
            <AddBudgetButton
              categories={categories}
              month={range.month}
              year={range.year}
              label="Definir primeiro orçamento"
            />
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((b) => {
            const spent = spentMap.get(b.categoryId) ?? 0;
            const remaining = b.limitAmountCents - spent;
            const pct =
              b.limitAmountCents > 0
                ? (spent / b.limitAmountCents) * 100
                : 0;
            const over = remaining < 0;
            const warn = pct >= 80 && !over;
            return (
              <Card key={b.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{b.category.name}</h3>
                    <DeleteBudgetButton id={b.id} />
                  </div>
                  <div className="mt-2 flex items-end justify-between text-sm">
                    <span className="text-muted-foreground">
                      Gasto {formatCents(spent)} de {formatCents(b.limitAmountCents)}
                    </span>
                    <span className="font-semibold">{pct.toFixed(0)}%</span>
                  </div>
                  <ProgressBar
                    value={pct}
                    className="mt-2"
                    tone={over ? "danger" : warn ? "warning" : "brand"}
                  />
                  <p
                    className={
                      "mt-2 text-sm font-medium " +
                      (over ? "text-red-600" : "text-muted-foreground")
                    }
                  >
                    {over
                      ? `Orçamento excedido em ${formatCents(Math.abs(remaining))}`
                      : `Restante ${formatCents(remaining)}`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
