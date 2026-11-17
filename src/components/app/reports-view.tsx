"use client";

import * as React from "react";
import { Download, TrendingUp, TrendingDown, Scale, PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle, StatCard, MoneyText } from "./ui";
import { IncomeExpenseChart, CategoryDonut } from "./charts";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatBRL, formatMonth, formatPercent } from "@/lib/format";
import { downloadCsv } from "@/lib/export/csv";
import { toReais } from "@/lib/money";

export interface MonthlyReport {
  period: string;
  income: number;
  expense: number;
  result: number;
  savingsRate: number;
}
export interface CategoryReport {
  name: string;
  color: string;
  totalCents: number;
  share: number;
}

export function ReportsView({
  monthly,
  categoriesByPeriod,
  periods,
}: {
  monthly: MonthlyReport[];
  categoriesByPeriod: Record<string, CategoryReport[]>;
  periods: string[];
}) {
  const [period, setPeriod] = React.useState(periods[periods.length - 1]);
  const cats = categoriesByPeriod[period] ?? [];

  const totals = monthly.reduce(
    (acc, m) => ({ income: acc.income + m.income, expense: acc.expense + m.expense }),
    { income: 0, expense: 0 },
  );
  const avgSavings = monthly.length ? monthly.reduce((s, m) => s + m.savingsRate, 0) / monthly.length : 0;

  function exportMonthly() {
    downloadCsv(
      `finora-relatorio-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Mês", "Receitas", "Despesas", "Resultado", "Taxa de economia (%)"],
      monthly.map((m) => [
        formatMonth(m.period),
        toReais(m.income).toFixed(2).replace(".", ","),
        toReais(m.expense).toFixed(2).replace(".", ","),
        toReais(m.result).toFixed(2).replace(".", ","),
        m.savingsRate.toFixed(1).replace(".", ","),
      ]),
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="mt-1 text-sm text-muted-foreground">Análise dos últimos 12 meses.</p>
        </div>
        <Button variant="outline" onClick={exportMonthly}><Download className="h-4 w-4" /> Exportar</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Receitas (12m)" cents={totals.income} icon={TrendingUp} tone="positive" />
        <StatCard label="Despesas (12m)" cents={totals.expense} icon={TrendingDown} tone="negative" />
        <StatCard label="Resultado (12m)" cents={totals.income - totals.expense} icon={Scale} tone={totals.income - totals.expense >= 0 ? "positive" : "negative"} />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Taxa de economia média</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand"><PiggyBank className="h-4 w-4" /></span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular">{formatPercent(avgSavings, 1)}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <SectionTitle>Receitas × despesas por mês</SectionTitle>
          <IncomeExpenseChart data={monthly.map((m) => ({ period: m.period, income: m.income, expense: m.expense }))} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <SectionTitle>Comparativo mensal</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-2 font-medium">Mês</th>
                  <th className="py-2 px-2 text-right font-medium">Receitas</th>
                  <th className="py-2 px-2 text-right font-medium">Despesas</th>
                  <th className="py-2 px-2 text-right font-medium">Resultado</th>
                  <th className="py-2 pl-2 text-right font-medium">Economia</th>
                </tr>
              </thead>
              <tbody>
                {[...monthly].reverse().map((m) => (
                  <tr key={m.period} className="border-b border-border/60">
                    <td className="py-2.5 pr-2 font-medium capitalize">{formatMonth(m.period)}</td>
                    <td className="py-2.5 px-2 text-right tabular text-positive">{formatBRL(m.income)}</td>
                    <td className="py-2.5 px-2 text-right tabular text-negative">{formatBRL(m.expense)}</td>
                    <td className="py-2.5 px-2 text-right"><MoneyText cents={m.result} className="text-sm" /></td>
                    <td className="py-2.5 pl-2 text-right tabular text-muted-foreground">{formatPercent(m.savingsRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <SectionTitle className="mb-0">Gastos por categoria</SectionTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[...periods].reverse().map((p) => (<SelectItem key={p} value={p} className="capitalize">{formatMonth(p)}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          {cats.length > 0 ? (
            <div className="mt-3 grid items-center gap-4 sm:grid-cols-2">
              <CategoryDonut data={cats.map((c) => ({ name: c.name, value: c.totalCents, color: c.color }))} />
              <ul className="space-y-2">
                {cats.map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                      {c.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="tabular font-medium">{formatBRL(c.totalCents)}</span>
                      <span className="text-xs text-muted-foreground">{formatPercent(c.share)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">Sem despesas neste mês.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
