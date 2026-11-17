"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Copy, PieChart, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { IconBubble } from "@/components/ui/icon";
import { PeriodNav } from "./period-nav";
import { toast } from "@/components/ui/toast";
import { saveBudget, deleteBudget, copyBudgets } from "@/lib/actions/budgets";
import { budgetStatus } from "@/lib/finance/calculations";
import { addMonthsToPeriod } from "@/lib/finance/period";
import { formatBRL, formatPercent } from "@/lib/format";
import { sumCents } from "@/lib/money";
import type { Budget, Category } from "@/lib/db/types";

interface Row {
  category: Category;
  budget?: Budget;
  usedCents: number;
}

export function BudgetsManager({
  period,
  categories,
  budgets,
  usedByCategory,
}: {
  period: string;
  categories: Category[];
  budgets: Budget[];
  usedByCategory: Record<string, number>;
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<{ categoryId: string; limitCents: number } | null>(null);

  const expenseCats = categories.filter((c) => c.type === "expense");
  const budgetByCat = new Map(budgets.map((b) => [b.category_id, b]));

  const rows: Row[] = expenseCats
    .map((category) => ({
      category,
      budget: budgetByCat.get(category.id),
      usedCents: usedByCategory[category.id] ?? 0,
    }))
    .filter((r) => r.budget || r.usedCents > 0);

  const totalLimit = sumCents(budgets.map((b) => b.limit_cents));
  const totalUsed = sumCents(rows.filter((r) => r.budget).map((r) => r.usedCents));

  async function onCopy() {
    const res = await copyBudgets(addMonthsToPeriod(period, -1), period);
    if (res.ok) { toast.success(res.message ?? "Copiado."); router.refresh(); }
    else toast.error(res.error ?? "Erro.");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Defina limites por categoria e acompanhe.</p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodNav period={period} />
          <Button variant="outline" size="icon" aria-label="Copiar do mês anterior" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button onClick={() => setEditing({ categoryId: expenseCats[0]?.id ?? "", limitCents: 0 })}>
            <Plus className="h-4 w-4" /> Definir
          </Button>
        </div>
      </div>

      {budgets.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total orçado</span>
              <span className="tabular text-sm">{formatBRL(totalUsed)} / {formatBRL(totalLimit)}</span>
            </div>
            <Progress className="mt-3" value={totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0}
              tone={totalUsed > totalLimit ? "negative" : "positive"} />
          </CardContent>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="Nenhum orçamento definido"
          description="Crie limites mensais por categoria para evitar surpresas no fim do mês."
          action={<Button onClick={() => setEditing({ categoryId: expenseCats[0]?.id ?? "", limitCents: 0 })}><Plus className="h-4 w-4" /> Criar orçamento</Button>}
        />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <BudgetRow key={r.category.id} row={r}
              onEdit={() => setEditing({ categoryId: r.category.id, limitCents: r.budget?.limit_cents ?? 0 })}
              onDelete={r.budget ? async () => {
                const res = await deleteBudget(r.budget!.id);
                if (res.ok) { toast.success("Removido."); router.refresh(); }
              } : undefined}
            />
          ))}
        </div>
      )}

      {editing && (
        <BudgetDialog
          period={period}
          categories={expenseCats}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); router.refresh(); }}
        />
      )}
    </div>
  );
}

function BudgetRow({ row, onEdit, onDelete }: { row: Row; onEdit: () => void; onDelete?: () => void }) {
  const { category, budget, usedCents } = row;
  if (!budget) {
    return (
      <Card><CardContent className="flex items-center gap-3 p-4">
        <IconBubble name={category.icon} color={category.color} />
        <div className="flex-1">
          <p className="text-sm font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">Gasto: {formatBRL(usedCents)} · sem orçamento</p>
        </div>
        <Button size="sm" variant="outline" onClick={onEdit}>Definir</Button>
      </CardContent></Card>
    );
  }
  const st = budgetStatus(budget.limit_cents, usedCents, category.id);
  const tone = st.alertLevel >= 100 ? "negative" : st.alertLevel >= 90 ? "warn" : st.alertLevel >= 75 ? "warn" : "positive";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <IconBubble name={category.icon} color={category.color} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{category.name}</p>
              <span className="tabular text-sm">{formatBRL(usedCents)} / {formatBRL(budget.limit_cents)}</span>
            </div>
          </div>
          <div className="flex gap-0.5">
            <button onClick={onEdit} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3.5 w-3.5" /></button>
            {onDelete && <button onClick={onDelete} className="rounded-lg p-1.5 text-muted-foreground hover:bg-negative-soft hover:text-negative" aria-label="Remover"><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
        </div>
        <Progress className="mt-2.5" value={st.percent} tone={tone} />
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className={st.remainingCents < 0 ? "font-medium text-negative" : "text-muted-foreground"}>
            {st.remainingCents < 0 ? `Ultrapassou ${formatBRL(-st.remainingCents)}` : `Resta ${formatBRL(st.remainingCents)}`}
          </span>
          <span className="text-muted-foreground">{formatPercent(st.percent)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetDialog({ period, categories, initial, onClose, onSaved }: {
  period: string; categories: Category[];
  initial: { categoryId: string; limitCents: number };
  onClose: () => void; onSaved: () => void;
}) {
  const [categoryId, setCategoryId] = React.useState(initial.categoryId);
  const [limit, setLimit] = React.useState(initial.limitCents);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await saveBudget({ categoryId, month: period, limitCents: limit });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Orçamento da categoria</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Categoria">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Limite mensal">
            <MoneyInput value={limit} onValueChange={setLimit} autoFocus />
          </Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
