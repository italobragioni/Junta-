import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { TrendingDown } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { formatDate, toDateInputValue } from "@/lib/dates";
import {
  currentMonthRange,
  previousMonthRange,
  lastNMonths,
} from "@/lib/dates";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { ExpenseFilters } from "./filters";
import {
  AddExpenseButton,
  EditExpenseButton,
  DeleteExpenseButton,
} from "./expense-dialogs";

export const metadata: Metadata = { title: "Despesas" };

interface SearchParams {
  q?: string;
  cat?: string;
  period?: string;
  sort?: string;
}

function periodFilter(period: string | undefined): Prisma.ExpenseWhereInput {
  const now = new Date();
  switch (period) {
    case "last-month": {
      const r = previousMonthRange(now);
      return { date: { gte: r.start, lt: r.end } };
    }
    case "last-3-months": {
      const ranges = lastNMonths(3, now);
      const start = ranges[ranges.length - 1].start;
      const end = currentMonthRange(now).end;
      return { date: { gte: start, lt: end } };
    }
    case "all":
      return {};
    case "this-month":
    default: {
      const r = currentMonthRange(now);
      return { date: { gte: r.start, lt: r.end } };
    }
  }
}

function orderBy(sort: string | undefined): Prisma.ExpenseOrderByWithRelationInput {
  switch (sort) {
    case "date-asc":
      return { date: "asc" };
    case "amount-desc":
      return { amountCents: "desc" };
    case "amount-asc":
      return { amountCents: "asc" };
    case "date-desc":
    default:
      return { date: "desc" };
  }
}

export default async function DespesasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const where: Prisma.ExpenseWhereInput = {
    userId: user.id,
    ...periodFilter(sp.period),
  };
  if (sp.cat) where.categoryId = sp.cat;
  if (sp.q) where.description = { contains: sp.q, mode: "insensitive" };

  const [categories, expenses, totalAgg] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id, type: "EXPENSE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.expense.findMany({
      where,
      orderBy: orderBy(sp.sort),
      include: { category: { select: { name: true } } },
      take: 500,
    }),
    prisma.expense.aggregate({ where, _sum: { amountCents: true } }),
  ]);

  const total = totalAgg._sum.amountCents ?? 0;

  return (
    <div>
      <PageHeader
        title="Despesas"
        description="Adicione, edite e acompanhe seus gastos."
        action={<AddExpenseButton categories={categories} />}
      />

      <ExpenseFilters categories={categories} />

      <Card className="mb-4 flex items-center justify-between p-4">
        <span className="text-sm text-muted-foreground">
          Total do período ({expenses.length}{" "}
          {expenses.length === 1 ? "registro" : "registros"})
        </span>
        <span className="text-lg font-bold text-red-600">
          {formatCents(total)}
        </span>
      </Card>

      {expenses.length === 0 ? (
        <EmptyState
          icon={<TrendingDown className="h-6 w-6" />}
          title="Ainda não há gastos cadastrados"
          description="Adicione seu primeiro gasto para começar a entender para onde seu dinheiro está indo."
          action={
            <AddExpenseButton
              categories={categories}
              label="Adicionar primeiro gasto"
            />
          }
        />
      ) : (
        <Card className="divide-y divide-border">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{e.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {e.category?.name ?? "Sem categoria"} · {formatDate(e.date)}
                  {e.recurring && " · Recorrente"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="mr-1 whitespace-nowrap font-semibold text-red-600">
                  {formatCents(e.amountCents)}
                </span>
                <EditExpenseButton
                  categories={categories}
                  expense={{
                    id: e.id,
                    description: e.description,
                    amountCents: e.amountCents,
                    categoryId: e.categoryId,
                    date: toDateInputValue(e.date),
                    recurring: e.recurring,
                  }}
                />
                <DeleteExpenseButton id={e.id} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
