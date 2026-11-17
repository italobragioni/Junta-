"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Target, Pencil, Trash2, PiggyBank, CalendarClock, Sparkles } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { ColorPicker } from "@/components/ui/color-picker";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { saveGoal, addContribution, deleteGoal } from "@/lib/actions/goals";
import { formatBRL, formatDate, formatPercent } from "@/lib/format";
import { monthsBetweenPeriods, periodOf, currentPeriod } from "@/lib/finance/period";
import type { Goal } from "@/lib/db/types";

type GoalV = Goal & { saved_cents: number };

export function GoalsManager({ goals }: { goals: GoalV[] }) {
  const router = useRouter();
  const [form, setForm] = React.useState<{ goal?: GoalV } | null>(null);
  const [contribute, setContribute] = React.useState<GoalV | null>(null);
  const [toDelete, setToDelete] = React.useState<GoalV | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Metas financeiras</h1>
          <p className="mt-1 text-sm text-muted-foreground">Transforme sonhos em planos com prazo.</p>
        </div>
        <Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Nova meta</Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhuma meta ainda"
          description="Crie metas como reserva de emergência, uma viagem ou a entrada de um imóvel."
          action={<Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Criar meta</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g}
              onEdit={() => setForm({ goal: g })}
              onContribute={() => setContribute(g)}
              onDelete={() => setToDelete(g)}
            />
          ))}
        </div>
      )}

      {form && <GoalDialog goal={form.goal} onClose={() => setForm(null)} onSaved={() => { setForm(null); router.refresh(); }} />}
      {contribute && <ContributeDialog goal={contribute} onClose={() => setContribute(null)} onSaved={() => { setContribute(null); router.refresh(); }} />}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Excluir meta?"
        description={`"${toDelete?.name}" e seus aportes serão removidos.`}
        confirmLabel="Excluir"
        onConfirm={async () => {
          if (!toDelete) return;
          const res = await deleteGoal(toDelete.id);
          if (res.ok) { toast.success("Removida."); router.refresh(); }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function GoalCard({ goal, onEdit, onContribute, onDelete }: {
  goal: GoalV; onEdit: () => void; onContribute: () => void; onDelete: () => void;
}) {
  const pct = goal.target_cents > 0 ? (goal.saved_cents / goal.target_cents) * 100 : 0;
  const done = goal.saved_cents >= goal.target_cents;
  const remaining = Math.max(0, goal.target_cents - goal.saved_cents);
  const forecast = buildForecast(goal);

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5" style={{ background: goal.color }} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${goal.color}1f`, color: goal.color }}>
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{goal.name}</p>
              {goal.deadline && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3" /> até {formatDate(goal.deadline)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-0.5">
            <button onClick={onEdit} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={onDelete} className="rounded-lg p-1.5 text-muted-foreground hover:bg-negative-soft hover:text-negative" aria-label="Excluir"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <span className="text-xl font-bold tabular">{formatBRL(goal.saved_cents)}</span>
          <span className="text-sm text-muted-foreground tabular">de {formatBRL(goal.target_cents)}</span>
        </div>
        <Progress className="mt-2" value={pct} tone={done ? "positive" : "brand"} />
        <p className="mt-1.5 text-xs text-muted-foreground">{formatPercent(pct)} concluído</p>

        {done ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-positive-soft px-3 py-2 text-sm font-medium text-positive">
            <Sparkles className="h-4 w-4" /> Meta alcançada! 🎉
          </div>
        ) : (
          <>
            {forecast && (
              <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{forecast}</p>
            )}
            <Button size="sm" className="mt-3 w-full" variant="outline" onClick={onContribute}>
              <PiggyBank className="h-4 w-4" /> Guardar {remaining > 0 ? `(faltam ${formatBRL(remaining)})` : ""}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Previsão simples: ritmo médio desde o início → meses restantes; ou valor/mês até o prazo. */
function buildForecast(goal: GoalV): string | null {
  const remaining = goal.target_cents - goal.saved_cents;
  if (remaining <= 0) return null;

  if (goal.deadline) {
    const monthsLeft = Math.max(1, monthsBetweenPeriods(currentPeriod(), periodOf(goal.deadline)));
    const perMonth = Math.ceil(remaining / monthsLeft);
    return `Guarde ${formatBRL(perMonth)} por mês para alcançar no prazo.`;
  }

  const elapsed = Math.max(1, monthsBetweenPeriods(periodOf(goal.started_on), currentPeriod()) + 1);
  const rate = goal.saved_cents / elapsed;
  if (rate <= 0) return "Faça o primeiro aporte para estimar a conclusão.";
  const monthsToGo = Math.ceil(remaining / rate);
  return `No ritmo atual, conclui em ~${monthsToGo} ${monthsToGo === 1 ? "mês" : "meses"}.`;
}

function GoalDialog({ goal, onClose, onSaved }: { goal?: GoalV; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = React.useState(goal?.name ?? "");
  const [target, setTarget] = React.useState(goal?.target_cents ?? 0);
  const [deadline, setDeadline] = React.useState(goal?.deadline ?? "");
  const [color, setColor] = React.useState(goal?.color ?? "#8b5cf6");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await saveGoal({ id: goal?.id, name, targetCents: target, color, deadline: deadline || "" });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{goal ? "Editar meta" : "Nova meta"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome da meta"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Viagem para a praia" autoFocus /></Field>
          <Field label="Valor desejado"><MoneyInput value={target} onValueChange={setTarget} /></Field>
          <Field label="Prazo (opcional)"><Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></Field>
          <Field label="Cor"><ColorPicker value={color} onChange={setColor} /></Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{goal ? "Salvar" : "Criar meta"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ContributeDialog({ goal, onClose, onSaved }: { goal: GoalV; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = React.useState(0);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await addContribution({ goalId: goal.id, amountCents: amount, contributedOn: date, notes: "" });
    setPending(false);
    if (res.ok) { toast.success("Aporte registrado!"); onSaved(); }
    else setError(res.error ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Guardar para “{goal.name}”</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Valor do aporte"><MoneyInput value={amount} onValueChange={setAmount} autoFocus /></Field>
          <Field label="Data"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <p className="text-xs text-muted-foreground">Dica: aportes somam ao total guardado da meta.</p>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
