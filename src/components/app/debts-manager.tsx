"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus, TrendingDown, Pencil, Trash2, Calculator, Snowflake, Mountain, Sparkles,
} from "lucide-react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { saveDebt, payDebt, deleteDebt } from "@/lib/actions/debts";
import { compareStrategies, type DebtInput } from "@/lib/finance/debts";
import { DEBT_KIND_LABELS } from "@/lib/db/labels";
import { formatBRL, formatDate } from "@/lib/format";
import { sumCents } from "@/lib/money";
import type { Debt, DebtKind } from "@/lib/db/types";

export function DebtsManager({ debts }: { debts: Debt[] }) {
  const router = useRouter();
  const [form, setForm] = React.useState<{ debt?: Debt } | null>(null);
  const [payTarget, setPayTarget] = React.useState<Debt | null>(null);
  const [toDelete, setToDelete] = React.useState<Debt | null>(null);

  const totalDebt = sumCents(debts.map((d) => d.balance_cents));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dívidas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Total devedor: <span className="font-semibold text-negative tabular">{formatBRL(totalDebt)}</span>
          </p>
        </div>
        <Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Nova dívida</Button>
      </div>

      {debts.length === 0 ? (
        <EmptyState
          icon={TrendingDown}
          title="Nenhuma dívida cadastrada"
          description="Cadastre empréstimos e financiamentos para simular a melhor forma de quitar."
          action={<Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Cadastrar dívida</Button>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {debts.map((d) => (
              <DebtRow key={d.id} debt={d} onEdit={() => setForm({ debt: d })} onPay={() => setPayTarget(d)} onDelete={() => setToDelete(d)} />
            ))}
          </div>
          <DebtSimulator debts={debts} />
        </>
      )}

      {form && <DebtDialog debt={form.debt} onClose={() => setForm(null)} onSaved={() => { setForm(null); router.refresh(); }} />}
      {payTarget && <PayDebtDialog debt={payTarget} onClose={() => setPayTarget(null)} onSaved={() => { setPayTarget(null); router.refresh(); }} />}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Excluir dívida?"
        description={`"${toDelete?.name}" e seus pagamentos serão removidos.`}
        confirmLabel="Excluir"
        onConfirm={async () => {
          if (!toDelete) return;
          const res = await deleteDebt(toDelete.id);
          if (res.ok) { toast.success("Removida."); router.refresh(); }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function DebtRow({ debt, onEdit, onPay, onDelete }: { debt: Debt; onEdit: () => void; onPay: () => void; onDelete: () => void }) {
  const paidPct = debt.principal_cents > 0 ? ((debt.principal_cents - debt.balance_cents) / debt.principal_cents) * 100 : 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold">{debt.name}</p>
            <p className="text-xs text-muted-foreground">
              {DEBT_KIND_LABELS[debt.kind]}{debt.creditor ? ` · ${debt.creditor}` : ""}
              {debt.interest_rate > 0 ? ` · ${debt.interest_rate}% a.m.` : ""}
            </p>
          </div>
          <div className="flex gap-0.5">
            <button onClick={onEdit} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={onDelete} className="rounded-lg p-1.5 text-muted-foreground hover:bg-negative-soft hover:text-negative" aria-label="Excluir"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Saldo devedor</p>
            <p className="text-xl font-bold tabular text-negative">{formatBRL(debt.balance_cents)}</p>
          </div>
          <Button size="sm" variant="outline" onClick={onPay}>Pagar</Button>
        </div>
        <Progress className="mt-2" value={paidPct} tone="positive" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {paidPct.toFixed(0)}% quitado de {formatBRL(debt.principal_cents)}
          {debt.next_due ? ` · próx. venc. ${formatDate(debt.next_due)}` : ""}
        </p>
      </CardContent>
    </Card>
  );
}

/** Simulador bola de neve × avalanche. */
function DebtSimulator({ debts }: { debts: Debt[] }) {
  const [extra, setExtra] = React.useState(20000); // R$200 extra/mês
  const inputs: DebtInput[] = debts
    .filter((d) => d.balance_cents > 0)
    .map((d) => ({
      id: d.id,
      name: d.name,
      balanceCents: d.balance_cents,
      monthlyRate: d.interest_rate,
      minPaymentCents: d.installment_cents ?? Math.max(1000, Math.round(d.balance_cents * 0.03)),
    }));

  const result = React.useMemo(() => (inputs.length ? compareStrategies(inputs, extra) : null), [inputs, extra]);
  if (!result) return null;

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand"><Calculator className="h-5 w-5" /></span>
          <div>
            <h2 className="font-semibold">Simulador de quitação</h2>
            <p className="text-xs text-muted-foreground">Quanto você consegue pagar a mais por mês?</p>
          </div>
        </div>

        <div className="mt-4 max-w-xs">
          <Field label="Pagamento extra mensal">
            <MoneyInput value={extra} onValueChange={setExtra} />
          </Field>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <StrategyCard
            icon={Snowflake}
            title="Bola de neve"
            subtitle="Quita primeiro a menor dívida"
            months={result.snowball.months}
            interest={result.snowball.totalInterestCents}
            saved={result.interestSavedSnowballCents}
            order={result.snowball.payoffOrder}
          />
          <StrategyCard
            icon={Mountain}
            title="Avalanche"
            subtitle="Quita primeiro o maior juros"
            months={result.avalanche.months}
            interest={result.avalanche.totalInterestCents}
            saved={result.interestSavedAvalancheCents}
            recommended
            order={result.avalanche.payoffOrder}
          />
        </div>

        <p className="mt-3 flex items-start gap-2 rounded-xl bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          Pagando apenas os mínimos, você levaria {result.minimumOnly.months} meses e gastaria {formatBRL(result.minimumOnly.totalInterestCents)} em juros. Com o extra, a <strong>avalanche</strong> costuma economizar mais.
        </p>
      </CardContent>
    </Card>
  );
}

function StrategyCard({ icon: Icon, title, subtitle, months, interest, saved, order, recommended }: {
  icon: typeof Snowflake; title: string; subtitle: string;
  months: number; interest: number; saved: number;
  order: { name: string; month: number }[]; recommended?: boolean;
}) {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const timeStr = years > 0 ? `${years}a ${rem}m` : `${months} meses`;
  return (
    <div className={`rounded-2xl border p-4 ${recommended ? "border-brand bg-brand/5" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-brand" />
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {recommended && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">Recomendado</span>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-muted/60 py-2">
          <p className="text-[11px] text-muted-foreground">Tempo</p>
          <p className="text-sm font-bold">{timeStr}</p>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <p className="text-[11px] text-muted-foreground">Juros</p>
          <p className="text-sm font-bold tabular">{formatBRL(interest)}</p>
        </div>
      </div>
      {saved > 0 && (
        <p className="mt-2 text-center text-xs font-medium text-positive">Economiza {formatBRL(saved)} em juros</p>
      )}
      {order.length > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">Ordem: {order.map((o) => o.name).join(" → ")}</p>
      )}
    </div>
  );
}

function DebtDialog({ debt, onClose, onSaved }: { debt?: Debt; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = React.useState(debt?.name ?? "");
  const [kind, setKind] = React.useState<DebtKind>(debt?.kind ?? "loan");
  const [creditor, setCreditor] = React.useState(debt?.creditor ?? "");
  const [principal, setPrincipal] = React.useState(debt?.principal_cents ?? 0);
  const [balance, setBalance] = React.useState(debt?.balance_cents ?? 0);
  const [rate, setRate] = React.useState(String(debt?.interest_rate ?? 0));
  const [installments, setInstallments] = React.useState(String(debt?.installments_total ?? ""));
  const [installmentCents, setInstallmentCents] = React.useState(debt?.installment_cents ?? 0);
  const [nextDue, setNextDue] = React.useState(debt?.next_due ?? "");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  // Primeira vez: igual ao principal.
  React.useEffect(() => {
    if (!debt && balance === 0 && principal > 0) setBalance(principal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal]);

  async function submit() {
    setError(""); setPending(true);
    const res = await saveDebt({
      id: debt?.id, name, kind, creditor,
      principalCents: principal, balanceCents: balance || principal,
      interestRate: Number(rate.replace(",", ".")) || 0,
      installmentsTotal: installments ? Number(installments) : undefined,
      installmentCents: installmentCents || undefined,
      nextDue: nextDue || "",
    });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{debt ? "Editar dívida" : "Nova dívida"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Financiamento do carro" autoFocus /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select value={kind} onValueChange={(v) => setKind(v as DebtKind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(DEBT_KIND_LABELS).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}</SelectContent>
              </Select>
            </Field>
            <Field label="Credor"><Input value={creditor} onChange={(e) => setCreditor(e.target.value)} placeholder="Opcional" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor original"><MoneyInput value={principal} onValueChange={setPrincipal} /></Field>
            <Field label="Saldo devedor"><MoneyInput value={balance} onValueChange={setBalance} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Juros (% ao mês)"><Input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0" /></Field>
            <Field label="Valor da parcela"><MoneyInput value={installmentCents} onValueChange={setInstallmentCents} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nº de parcelas"><Input inputMode="numeric" value={installments} onChange={(e) => setInstallments(e.target.value)} placeholder="Opcional" /></Field>
            <Field label="Próx. vencimento"><Input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} /></Field>
          </div>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{debt ? "Salvar" : "Cadastrar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PayDebtDialog({ debt, onClose, onSaved }: { debt: Debt; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = React.useState(debt.installment_cents ?? 0);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await payDebt(debt.id, amount, date);
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Registrado."); onSaved(); }
    else setError(res.error ?? "Erro.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Pagar “{debt.name}”</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <p className="rounded-xl bg-muted px-3.5 py-2.5 text-sm">Saldo devedor: <span className="font-semibold tabular">{formatBRL(debt.balance_cents)}</span></p>
          <Field label="Valor do pagamento"><MoneyInput value={amount} onValueChange={setAmount} autoFocus /></Field>
          <Field label="Data"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>Registrar pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
