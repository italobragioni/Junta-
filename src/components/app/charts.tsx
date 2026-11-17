"use client";

import * as React from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { toReais } from "@/lib/money";
import { formatBRL, formatCompactBRL, SHORT_MONTHS } from "@/lib/format";

const BRAND = "#6366f1";
const POSITIVE = "#10b981";
const NEGATIVE = "#f43f5e";
const GRID = "#94a3b84d";
const AXIS = "#94a3b8";

function monthLabel(period: string) {
  const m = Number(period.slice(5, 7)) - 1;
  return SHORT_MONTHS[m] ?? period;
}

function MoneyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-float">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-2 tabular text-popover-foreground">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: {formatBRL(Math.round((p.value ?? 0) * 100))}
        </p>
      ))}
    </div>
  );
}

/** Evolução do saldo total ao longo dos meses. */
export function BalanceAreaChart({ data }: { data: { period: string; balance: number }[] }) {
  const chart = data.map((d) => ({ name: monthLabel(d.period), Saldo: toReais(d.balance) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chart} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
            <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => formatCompactBRL(Math.round(v * 100))} tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
        <Tooltip content={<MoneyTooltip />} />
        <Area type="monotone" dataKey="Saldo" stroke={BRAND} strokeWidth={2.5} fill="url(#balanceFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Receitas versus despesas por mês. */
export function IncomeExpenseChart({ data }: { data: { period: string; income: number; expense: number }[] }) {
  const chart = data.map((d) => ({
    name: monthLabel(d.period),
    Receitas: toReais(d.income),
    Despesas: toReais(d.expense),
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chart} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => formatCompactBRL(Math.round(v * 100))} tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
        <Tooltip content={<MoneyTooltip />} cursor={{ fill: "#94a3b81a" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Receitas" fill={POSITIVE} radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="Despesas" fill={NEGATIVE} radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Rosca de distribuição de gastos por categoria. */
export function CategoryDonut({ data }: { data: { name: string; value: number; color: string }[] }) {
  const chart = data.map((d) => ({ ...d, value: toReais(d.value) }));
  if (chart.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={chart} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={2} stroke="none">
          {chart.map((d, i) => (<Cell key={i} fill={d.color} />))}
        </Pie>
        <Tooltip content={<MoneyTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Mini gráfico de barras para o topo da landing / cards. */
export function MiniBars({ values, color = BRAND }: { values: number[]; color?: string }) {
  const data = values.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data}>
        <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
