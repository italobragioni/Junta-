import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { formatDate, toDateInputValue, currentMonthRange } from "@/lib/dates";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import {
  AddIncomeButton,
  EditIncomeButton,
  DeleteIncomeButton,
} from "./income-dialogs";

export const metadata: Metadata = { title: "Receitas" };

export default async function ReceitasPage() {
  const user = await requireUser();
  const range = currentMonthRange();

  const incomes = await prisma.income.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 500,
  });

  const monthTotal = incomes
    .filter(
      (i) =>
        i.recurring || (i.date >= range.start && i.date < range.end),
    )
    .reduce((acc, i) => acc + i.amountCents, 0);

  return (
    <div>
      <PageHeader
        title="Receitas"
        description="Salário, freelance, comissão, benefícios e outras entradas."
        action={<AddIncomeButton />}
      />

      <Card className="mb-4 flex items-center justify-between p-4">
        <span className="text-sm text-muted-foreground">Renda deste mês</span>
        <span className="text-lg font-bold text-brand-600">
          {formatCents(monthTotal)}
        </span>
      </Card>

      {incomes.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="h-6 w-6" />}
          title="Nenhuma receita cadastrada"
          description="Adicione suas fontes de renda para calcularmos quanto você pode economizar."
          action={<AddIncomeButton label="Adicionar primeira receita" />}
        />
      ) : (
        <Card className="divide-y divide-border">
          {incomes.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{i.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {i.category ?? "Outras receitas"} · {formatDate(i.date)}
                  {i.recurring && " · Recorrente"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="mr-1 whitespace-nowrap font-semibold text-brand-600">
                  {formatCents(i.amountCents)}
                </span>
                <EditIncomeButton
                  income={{
                    id: i.id,
                    description: i.description,
                    amountCents: i.amountCents,
                    category: i.category,
                    date: toDateInputValue(i.date),
                    recurring: i.recurring,
                  }}
                />
                <DeleteIncomeButton id={i.id} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
