import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canUseFeature } from "@/lib/plans";
import { getFinancialOverview } from "@/lib/finance";
import { formatCents, formatPercent } from "@/lib/money";
import { formatDate, monthName, currentMonthRange } from "@/lib/dates";
import { Logo } from "@/components/brand/logo";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Relatório financeiro" };

export default async function RelatorioPage() {
  const user = await requireUser();
  // PDF report is a Pro feature.
  if (!canUseFeature(user.plan, "PDF_EXPORT")) redirect("/planos");

  const range = currentMonthRange();
  const [overview, expenses] = await Promise.all([
    getFinancialOverview(user.id),
    prisma.expense.findMany({
      where: {
        userId: user.id,
        OR: [
          { recurring: true },
          { recurring: false, date: { gte: range.start, lt: range.end } },
        ],
      },
      orderBy: { date: "desc" },
      include: { category: { select: { name: true } } },
      take: 200,
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-neutral-900">
      <div className="mb-6 flex items-center justify-between">
        <Logo href="/dashboard" />
        <PrintButton />
      </div>

      <h1 className="text-2xl font-bold">Relatório financeiro</h1>
      <p className="text-sm text-neutral-500">
        {user.name} · {monthName(overview.month)} {overview.year} · gerado em{" "}
        {formatDate(new Date())}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Renda", value: formatCents(overview.incomeCents) },
          { label: "Gastos", value: formatCents(overview.expensesCents) },
          { label: "Disponível", value: formatCents(overview.availableCents) },
          {
            label: "Economia",
            value: `${formatCents(overview.savingsCents)} (${formatPercent(overview.savingsRate)})`,
          },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-neutral-200 p-3">
            <p className="text-xs text-neutral-500">{c.label}</p>
            <p className="mt-1 font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Gastos por categoria</h2>
      <table className="mt-2 w-full border-collapse text-sm">
        <tbody>
          {overview.categories.map((c) => (
            <tr key={c.categoryId ?? c.name} className="border-b border-neutral-200">
              <td className="py-1.5">{c.name}</td>
              <td className="py-1.5 text-right font-medium">
                {formatCents(c.totalCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8 text-lg font-semibold">Despesas do mês</h2>
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-300 text-left text-neutral-500">
            <th className="py-1.5 font-medium">Data</th>
            <th className="py-1.5 font-medium">Descrição</th>
            <th className="py-1.5 font-medium">Categoria</th>
            <th className="py-1.5 text-right font-medium">Valor</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-neutral-100">
              <td className="py-1.5">{formatDate(e.date)}</td>
              <td className="py-1.5">{e.description}</td>
              <td className="py-1.5">{e.category?.name ?? "Sem categoria"}</td>
              <td className="py-1.5 text-right">{formatCents(e.amountCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-xs text-neutral-400">
        Junta+ · Relatório baseado exclusivamente nos dados informados por você.
        Não constitui aconselhamento financeiro profissional.
      </p>
    </div>
  );
}
