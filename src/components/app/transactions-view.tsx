"use client";

import * as React from "react";
import { Search, Download, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PeriodNav } from "./period-nav";
import { TransactionList } from "./transaction-list";
import { buildLookups } from "@/lib/tx-lookups";
import { MoneyText } from "./ui";
import { formatDate } from "@/lib/format";
import { exportTransactionsCsv } from "@/lib/export/csv";
import { Button } from "@/components/ui/button";
import type { Transaction, Category, Account, CreditCard } from "@/lib/db/types";

type Kind = "all" | "income" | "expense" | "transfer";

export function TransactionsView({
  period,
  transactions,
  categories,
  accounts,
  cards,
}: {
  period: string;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  cards: CreditCard[];
}) {
  const [kind, setKind] = React.useState<Kind>("all");
  const [categoryId, setCategoryId] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const lookups = React.useMemo(() => buildLookups(categories, accounts, cards), [categories, accounts, cards]);

  const filtered = React.useMemo(() => {
    return transactions.filter((t) => {
      if (kind === "income" && t.kind !== "income") return false;
      if (kind === "transfer" && t.kind !== "transfer") return false;
      if (kind === "expense" && t.kind !== "expense" && t.kind !== "card_expense") return false;
      if (categoryId !== "all" && t.category_id !== categoryId) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, kind, categoryId, search]);

  // Agrupa por dia.
  const groups = React.useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const arr = map.get(t.occurred_on) ?? [];
      arr.push(t);
      map.set(t.occurred_on, arr);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  const totalIn = filtered.filter((t) => t.kind === "income").reduce((s, t) => s + t.amount_cents, 0);
  const totalOut = filtered
    .filter((t) => t.kind === "expense" || t.kind === "card_expense")
    .reduce((s, t) => s + t.amount_cents, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} lançamento(s) no período.</p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodNav period={period} />
          <Button
            variant="outline"
            size="icon"
            aria-label="Exportar CSV"
            onClick={() => exportTransactionsCsv(filtered, lookups)}
            disabled={filtered.length === 0}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-3">
        <Card><CardContent className="flex items-center gap-2 p-3.5">
          <ArrowUpCircle className="h-5 w-5 text-positive" />
          <div><p className="text-xs text-muted-foreground">Entradas</p><MoneyText cents={totalIn} className="text-base" /></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-2 p-3.5">
          <ArrowDownCircle className="h-5 w-5 text-negative" />
          <div><p className="text-xs text-muted-foreground">Saídas</p><MoneyText cents={-totalOut} className="text-base" /></div>
        </CardContent></Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar lançamento…" className="pl-9" />
        </div>
        <Select value={kind} onValueChange={(v) => setKind(v as Kind)}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
            <SelectItem value="transfer">Transferências</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista agrupada por dia */}
      {groups.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">
          Nenhum lançamento encontrado com esses filtros.
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {groups.map(([day, items]) => (
            <Card key={day}>
              <CardContent className="p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{formatDate(day)}</p>
                <TransactionList transactions={items} lookups={lookups} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
