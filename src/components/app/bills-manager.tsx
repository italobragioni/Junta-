"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus, CalendarClock, Pencil, Trash2, CheckCircle2, AlertTriangle, ArrowDownCircle, ArrowUpCircle,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { saveBill, payBill, deleteBill } from "@/lib/actions/bills";
import { RECURRENCE_LABELS } from "@/lib/db/labels";
import { formatBRL, formatDate, relativeDay, daysUntil } from "@/lib/format";
import { sumCents } from "@/lib/money";
import type { Bill, Category, Account, Recurrence, BillKind } from "@/lib/db/types";

export function BillsManager({
  bills,
  categories,
  accounts,
}: {
  bills: Bill[];
  categories: Category[];
  accounts: Account[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<{ bill?: Bill; kind: BillKind } | null>(null);
  const [toDelete, setToDelete] = React.useState<Bill | null>(null);
  const [payTarget, setPayTarget] = React.useState<Bill | null>(null);

  const payables = bills.filter((b) => b.kind === "payable");
  const receivables = bills.filter((b) => b.kind === "receivable");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas a pagar e receber</h1>
          <p className="mt-1 text-sm text-muted-foreground">Nunca mais perca um vencimento.</p>
        </div>
      </div>

      <Tabs defaultValue="payable">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="payable" className="flex-1"><ArrowDownCircle className="h-4 w-4" /> A pagar</TabsTrigger>
          <TabsTrigger value="receivable" className="flex-1"><ArrowUpCircle className="h-4 w-4" /> A receber</TabsTrigger>
        </TabsList>

        <TabsContent value="payable">
          <BillSection
            kind="payable"
            bills={payables}
            onNew={() => setForm({ kind: "payable" })}
            onEdit={(b) => setForm({ bill: b, kind: "payable" })}
            onDelete={setToDelete}
            onPay={setPayTarget}
          />
        </TabsContent>
        <TabsContent value="receivable">
          <BillSection
            kind="receivable"
            bills={receivables}
            onNew={() => setForm({ kind: "receivable" })}
            onEdit={(b) => setForm({ bill: b, kind: "receivable" })}
            onDelete={setToDelete}
            onPay={setPayTarget}
          />
        </TabsContent>
      </Tabs>

      {form && (
        <BillDialog
          kind={form.kind}
          bill={form.bill}
          categories={categories}
          onClose={() => setForm(null)}
          onSaved={() => { setForm(null); router.refresh(); }}
        />
      )}
      {payTarget && (
        <PayBillDialog
          bill={payTarget}
          accounts={accounts}
          onClose={() => setPayTarget(null)}
          onSaved={() => { setPayTarget(null); router.refresh(); }}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Excluir?"
        description={`"${toDelete?.description}" será removida.`}
        confirmLabel="Excluir"
        onConfirm={async () => {
          if (!toDelete) return;
          const res = await deleteBill(toDelete.id);
          if (res.ok) { toast.success("Removida."); router.refresh(); }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function BillSection({ kind, bills, onNew, onEdit, onDelete, onPay }: {
  kind: BillKind; bills: Bill[];
  onNew: () => void; onEdit: (b: Bill) => void; onDelete: (b: Bill) => void; onPay: (b: Bill) => void;
}) {
  const open = bills.filter((b) => b.status === "open").sort((a, b) => a.due_date.localeCompare(b.due_date));
  const paid = bills.filter((b) => b.status === "paid");
  const openTotal = sumCents(open.map((b) => b.amount_cents));
  const overdue = open.filter((b) => daysUntil(b.due_date) < 0);

  const label = kind === "payable" ? "a pagar" : "a receber";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Total {label}: </span>
          <span className="font-semibold tabular">{formatBRL(openTotal)}</span>
          {overdue.length > 0 && (
            <Badge variant="negative" className="ml-2"><AlertTriangle className="h-3 w-3" /> {overdue.length} em atraso</Badge>
          )}
        </div>
        <Button size="sm" onClick={onNew}><Plus className="h-4 w-4" /> Nova</Button>
      </div>

      {open.length === 0 && paid.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={`Nada ${label}`}
          description={kind === "payable" ? "Agende contas como aluguel, luz e internet para receber lembretes." : "Registre valores que você tem a receber."}
          action={<Button size="sm" onClick={onNew}><Plus className="h-4 w-4" /> Adicionar</Button>}
        />
      ) : (
        <>
          {open.map((b) => <BillRow key={b.id} bill={b} onEdit={() => onEdit(b)} onDelete={() => onDelete(b)} onPay={() => onPay(b)} />)}
          {paid.length > 0 && (
            <>
              <p className="pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Quitadas</p>
              {paid.slice(0, 10).map((b) => <BillRow key={b.id} bill={b} onEdit={() => onEdit(b)} onDelete={() => onDelete(b)} onPay={() => {}} />)}
            </>
          )}
        </>
      )}
    </div>
  );
}

function BillRow({ bill, onEdit, onDelete, onPay }: { bill: Bill; onEdit: () => void; onDelete: () => void; onPay: () => void }) {
  const paid = bill.status === "paid";
  const days = daysUntil(bill.due_date);
  const overdue = !paid && days < 0;
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3.5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${paid ? "bg-positive-soft text-positive" : overdue ? "bg-negative-soft text-negative" : "bg-muted text-muted-foreground"}`}>
          {paid ? <CheckCircle2 className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{bill.description}</p>
          <p className="text-xs text-muted-foreground">
            {paid ? `Pago em ${formatDate(bill.paid_on!)}` : (
              <span className={overdue ? "font-medium text-negative" : ""}>
                Vence {formatDate(bill.due_date)} · {relativeDay(bill.due_date)}
              </span>
            )}
            {bill.frequency !== "none" && !paid && " · recorrente"}
          </p>
        </div>
        <span className="tabular text-sm font-semibold">{formatBRL(bill.amount_cents)}</span>
        {!paid && (
          <Button size="sm" variant={overdue ? "negative" : "outline"} onClick={onPay}>
            {bill.kind === "payable" ? "Pagar" : "Receber"}
          </Button>
        )}
        <div className="flex gap-0.5">
          <button onClick={onEdit} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={onDelete} className="rounded-lg p-1.5 text-muted-foreground hover:bg-negative-soft hover:text-negative" aria-label="Excluir"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </CardContent>
    </Card>
  );
}

function BillDialog({ kind, bill, categories, onClose, onSaved }: {
  kind: BillKind; bill?: Bill; categories: Category[];
  onClose: () => void; onSaved: () => void;
}) {
  const [description, setDescription] = React.useState(bill?.description ?? "");
  const [amount, setAmount] = React.useState(bill?.amount_cents ?? 0);
  const [dueDate, setDueDate] = React.useState(bill?.due_date ?? new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = React.useState(bill?.category_id ?? "");
  const [frequency, setFrequency] = React.useState<Recurrence>(bill?.frequency ?? "none");
  const [notes, setNotes] = React.useState(bill?.notes ?? "");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  const cats = categories.filter((c) => c.type === (kind === "payable" ? "expense" : "income"));

  async function submit() {
    setError(""); setPending(true);
    const res = await saveBill({
      id: bill?.id, kind, description, amountCents: amount, dueDate,
      categoryId: categoryId || undefined, frequency, notes,
    });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{bill ? "Editar" : kind === "payable" ? "Nova conta a pagar" : "Nova conta a receber"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Descrição"><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Aluguel" autoFocus /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor"><MoneyInput value={amount} onValueChange={setAmount} /></Field>
            <Field label="Vencimento"><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
          </div>
          <Field label="Categoria">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
              <SelectContent>{cats.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
            </Select>
          </Field>
          <Field label="Repetir">
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Recurrence)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(RECURRENCE_LABELS).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}</SelectContent>
            </Select>
          </Field>
          <Field label="Observações"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{bill ? "Salvar" : "Agendar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PayBillDialog({ bill, accounts, onClose, onSaved }: {
  bill: Bill; accounts: Account[]; onClose: () => void; onSaved: () => void;
}) {
  const [accountId, setAccountId] = React.useState(bill.account_id ?? accounts[0]?.id ?? "");
  const [paidOn, setPaidOn] = React.useState(new Date().toISOString().slice(0, 10));
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await payBill({ billId: bill.id, accountId: accountId || undefined, paidOn });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Feito!"); onSaved(); }
    else setError(res.error ?? "Erro.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{bill.kind === "payable" ? "Pagar conta" : "Registrar recebimento"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <p className="rounded-xl bg-muted px-3.5 py-2.5 text-sm">
            <span className="font-medium">{bill.description}</span> — {formatBRL(bill.amount_cents)}
          </p>
          <Field label={bill.kind === "payable" ? "Pagar com a conta" : "Receber na conta"}>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger><SelectValue placeholder="Escolha a conta" /></SelectTrigger>
              <SelectContent>{accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}</SelectContent>
            </Select>
          </Field>
          <Field label="Data"><Input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} /></Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{bill.kind === "payable" ? "Confirmar pagamento" : "Confirmar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
