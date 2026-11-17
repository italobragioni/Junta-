"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Repeat, Pencil, Trash2, RefreshCw, CalendarClock } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { IconBubble } from "@/components/ui/icon";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatCard } from "./ui";
import { toast } from "@/components/ui/toast";
import { saveSubscription, deleteRecurring, runDueRecurring } from "@/lib/actions/recurring";
import { formatBRL, formatDate } from "@/lib/format";
import { sumCents } from "@/lib/money";
import type { RecurringRule, Category, Account } from "@/lib/db/types";

export function SubscriptionsManager({
  subscriptions,
  categories,
  accounts,
}: {
  subscriptions: RecurringRule[];
  categories: Category[];
  accounts: Account[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<{ sub?: RecurringRule } | null>(null);
  const [toDelete, setToDelete] = React.useState<RecurringRule | null>(null);
  const [running, setRunning] = React.useState(false);

  const monthly = subscriptions.filter((s) => s.frequency === "monthly");
  const yearly = subscriptions.filter((s) => s.frequency === "yearly");
  const monthlyTotal = sumCents(monthly.map((s) => s.amount_cents)) + Math.round(sumCents(yearly.map((s) => s.amount_cents)) / 12);
  const yearlyTotal = sumCents(monthly.map((s) => s.amount_cents)) * 12 + sumCents(yearly.map((s) => s.amount_cents));
  const catMap = new Map(categories.map((c) => [c.id, c]));

  async function generate() {
    setRunning(true);
    const res = await runDueRecurring();
    setRunning(false);
    if (res.ok) { toast.success(res.message ?? "Pronto."); router.refresh(); }
    else toast.error(res.error ?? "Erro.");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assinaturas e recorrências</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe gastos que se repetem todo mês.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generate} loading={running}>
            <RefreshCw className="h-4 w-4" /> Gerar lançamentos
          </Button>
          <Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Nova</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Custo mensal" cents={monthlyTotal} icon={Repeat} tone="brand" />
        <StatCard label="Custo anual" cents={yearlyTotal} icon={CalendarClock} tone="neutral" />
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Nenhuma assinatura cadastrada"
          description="Cadastre Netflix, Spotify, academia e outros gastos recorrentes para controlar o total."
          action={<Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Adicionar assinatura</Button>}
        />
      ) : (
        <div className="space-y-2">
          {subscriptions.map((s) => {
            const cat = s.category_id ? catMap.get(s.category_id) : undefined;
            return (
              <Card key={s.id}><CardContent className="flex items-center gap-3 p-3.5">
                <IconBubble name={cat?.icon ?? "repeat"} color={cat?.color ?? "#a855f7"} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.frequency === "monthly" ? "Mensal" : "Anual"} · dia {s.day_of_month} · próx. {formatDate(s.next_run)}
                  </p>
                </div>
                <span className="tabular text-sm font-semibold">{formatBRL(s.amount_cents)}</span>
                <div className="flex gap-0.5">
                  <button onClick={() => setForm({ sub: s })} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setToDelete(s)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-negative-soft hover:text-negative" aria-label="Remover"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </CardContent></Card>
            );
          })}
        </div>
      )}

      {form && <SubDialog sub={form.sub} categories={categories} accounts={accounts} onClose={() => setForm(null)} onSaved={() => { setForm(null); router.refresh(); }} />}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Remover assinatura?"
        description={`"${toDelete?.description}" deixará de gerar lançamentos.`}
        confirmLabel="Remover"
        onConfirm={async () => {
          if (!toDelete) return;
          const res = await deleteRecurring(toDelete.id);
          if (res.ok) { toast.success("Removida."); router.refresh(); }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function SubDialog({ sub, categories, accounts, onClose, onSaved }: {
  sub?: RecurringRule; categories: Category[]; accounts: Account[];
  onClose: () => void; onSaved: () => void;
}) {
  const [description, setDescription] = React.useState(sub?.description ?? "");
  const [amount, setAmount] = React.useState(sub?.amount_cents ?? 0);
  const [categoryId, setCategoryId] = React.useState(sub?.category_id ?? "");
  const [accountId, setAccountId] = React.useState(sub?.account_id ?? "");
  const [day, setDay] = React.useState(sub?.day_of_month ?? 1);
  const [frequency, setFrequency] = React.useState<"monthly" | "yearly">((sub?.frequency as "monthly" | "yearly") ?? "monthly");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  const expenseCats = categories.filter((c) => c.type === "expense");

  async function submit() {
    setError(""); setPending(true);
    const res = await saveSubscription({
      id: sub?.id, description, amountCents: amount,
      categoryId: categoryId || undefined, accountId: accountId || undefined,
      dayOfMonth: day, frequency,
    });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{sub ? "Editar assinatura" : "Nova assinatura"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome"><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Netflix" autoFocus /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor"><MoneyInput value={amount} onValueChange={setAmount} /></Field>
            <Field label="Frequência">
              <Select value={frequency} onValueChange={(v) => setFrequency(v as "monthly" | "yearly")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Mensal</SelectItem><SelectItem value="yearly">Anual</SelectItem></SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dia da cobrança">
              <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (<SelectItem key={n} value={String(n)}>Dia {n}</SelectItem>))}</SelectContent>
              </Select>
            </Field>
            <Field label="Categoria">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                <SelectContent>{expenseCats.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Conta (opcional)">
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger><SelectValue placeholder="Conta de pagamento" /></SelectTrigger>
              <SelectContent>{accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}</SelectContent>
            </Select>
          </Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{sub ? "Salvar" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
