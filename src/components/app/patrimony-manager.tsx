"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Landmark, Pencil, Trash2, Home, Car, TrendingUp, Wallet, Building2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { savePatrimonyItem, deletePatrimonyItem } from "@/lib/actions/patrimony";
import { PATRIMONY_KIND_LABELS } from "@/lib/db/labels";
import { netWorth } from "@/lib/finance/calculations";
import { formatBRL } from "@/lib/format";
import { sumCents } from "@/lib/money";
import type { PatrimonyItem, PatrimonyKind, AccountWithBalance, Debt } from "@/lib/db/types";

const KIND_ICONS: Record<string, typeof Home> = {
  cash: Wallet, property: Home, vehicle: Car, investment: TrendingUp, receivable: Building2, other: Landmark,
};

export function PatrimonyManager({
  items,
  accounts,
  debts,
}: {
  items: PatrimonyItem[];
  accounts: AccountWithBalance[];
  debts: Debt[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<{ item?: PatrimonyItem } | null>(null);
  const [toDelete, setToDelete] = React.useState<PatrimonyItem | null>(null);

  const accountTotal = sumCents(accounts.filter((a) => a.include_in_total).map((a) => a.balance_cents));
  const debtTotal = sumCents(debts.map((d) => d.balance_cents));
  const manualAssets = items.filter((i) => !i.is_liability);
  const manualLiabilities = items.filter((i) => i.is_liability);

  const nw = netWorth({
    accountBalancesCents: accounts.filter((a) => a.include_in_total).map((a) => a.balance_cents),
    assetItemsCents: manualAssets.map((i) => i.value_cents),
    liabilityItemsCents: manualLiabilities.map((i) => i.value_cents),
    debtBalancesCents: debts.map((d) => d.balance_cents),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patrimônio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tudo o que você tem, menos o que deve.</p>
        </div>
        <Button onClick={() => setForm({})}><Plus className="h-4 w-4" /> Adicionar bem</Button>
      </div>

      {/* Patrimônio líquido */}
      <Card className="overflow-hidden">
        <div className="brand-gradient p-5 text-white">
          <p className="text-sm opacity-85">Patrimônio líquido</p>
          <p className="mt-1 text-3xl font-bold tabular">{formatBRL(nw.netCents)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/15 px-3 py-2">
              <p className="opacity-85">Ativos</p>
              <p className="font-semibold tabular">{formatBRL(nw.assetsCents)}</p>
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2">
              <p className="opacity-85">Passivos</p>
              <p className="font-semibold tabular">{formatBRL(nw.liabilitiesCents)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ativos */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Ativos</h2>
        <div className="space-y-2">
          {accountTotal !== 0 && (
            <AutoRow icon={Wallet} name="Contas e carteiras" sub="Somado automaticamente" value={accountTotal} />
          )}
          {manualAssets.map((i) => (
            <ItemRow key={i.id} item={i} onEdit={() => setForm({ item: i })} onDelete={() => setToDelete(i)} />
          ))}
          {accountTotal === 0 && manualAssets.length === 0 && (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              Adicione imóveis, veículos e investimentos.
            </p>
          )}
        </div>
      </section>

      {/* Passivos */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Passivos</h2>
        <div className="space-y-2">
          {debtTotal !== 0 && (
            <AutoRow icon={TrendingUp} name="Dívidas" sub="Somado automaticamente" value={debtTotal} liability />
          )}
          {manualLiabilities.map((i) => (
            <ItemRow key={i.id} item={i} onEdit={() => setForm({ item: i })} onDelete={() => setToDelete(i)} />
          ))}
          {debtTotal === 0 && manualLiabilities.length === 0 && (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              Nenhum passivo. 🎉
            </p>
          )}
        </div>
      </section>

      {form && <ItemDialog item={form.item} onClose={() => setForm(null)} onSaved={() => { setForm(null); router.refresh(); }} />}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Remover item?"
        description={`"${toDelete?.name}" será removido do patrimônio.`}
        confirmLabel="Remover"
        onConfirm={async () => {
          if (!toDelete) return;
          const res = await deletePatrimonyItem(toDelete.id);
          if (res.ok) { toast.success("Removido."); router.refresh(); }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function AutoRow({ icon: Icon, name, sub, value, liability }: {
  icon: typeof Home; name: string; sub: string; value: number; liability?: boolean;
}) {
  return (
    <Card><CardContent className="flex items-center gap-3 p-3.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground"><Icon className="h-5 w-5" /></span>
      <div className="flex-1"><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
      <span className={`tabular text-sm font-semibold ${liability ? "text-negative" : ""}`}>{formatBRL(value)}</span>
    </CardContent></Card>
  );
}

function ItemRow({ item, onEdit, onDelete }: { item: PatrimonyItem; onEdit: () => void; onDelete: () => void }) {
  const Icon = KIND_ICONS[item.kind] ?? Landmark;
  return (
    <Card><CardContent className="flex items-center gap-3 p-3.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">{PATRIMONY_KIND_LABELS[item.kind]}</p>
      </div>
      <span className={`tabular text-sm font-semibold ${item.is_liability ? "text-negative" : ""}`}>{formatBRL(item.value_cents)}</span>
      <div className="flex gap-0.5">
        <button onClick={onEdit} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3.5 w-3.5" /></button>
        <button onClick={onDelete} className="rounded-lg p-1.5 text-muted-foreground hover:bg-negative-soft hover:text-negative" aria-label="Remover"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </CardContent></Card>
  );
}

function ItemDialog({ item, onClose, onSaved }: { item?: PatrimonyItem; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = React.useState(item?.name ?? "");
  const [kind, setKind] = React.useState<PatrimonyKind>(item?.kind ?? "property");
  const [value, setValue] = React.useState(item?.value_cents ?? 0);
  const [isLiability, setIsLiability] = React.useState(item?.is_liability ?? false);
  const [notes, setNotes] = React.useState(item?.notes ?? "");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await savePatrimonyItem({ id: item?.id, name, kind, valueCents: value, isLiability, notes });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Editar bem" : "Adicionar ao patrimônio"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Apartamento, Carro" autoFocus /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select value={kind} onValueChange={(v) => setKind(v as PatrimonyKind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(PATRIMONY_KIND_LABELS).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}</SelectContent>
              </Select>
            </Field>
            <Field label="Valor atual"><MoneyInput value={value} onValueChange={setValue} /></Field>
          </div>
          <label className="flex items-center justify-between rounded-xl border border-border px-3.5 py-3">
            <span className="text-sm"><span className="font-medium">É um passivo (dívida)?</span><span className="block text-xs text-muted-foreground">Marque para contar como passivo.</span></span>
            <Switch checked={isLiability} onCheckedChange={setIsLiability} />
          </label>
          <Field label="Observações"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{item ? "Salvar" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
