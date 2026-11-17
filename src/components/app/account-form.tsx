"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { saveAccount } from "@/lib/actions/accounts";
import { ACCOUNT_TYPE_LABELS } from "@/lib/db/labels";
import type { AccountWithBalance, AccountType } from "@/lib/db/types";

export function AccountFormDialog({
  open,
  onOpenChange,
  account,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  account?: AccountWithBalance;
}) {
  const router = useRouter();
  const editing = !!account;
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<AccountType>("checking");
  const [institution, setInstitution] = React.useState("");
  const [opening, setOpening] = React.useState(0);
  const [color, setColor] = React.useState("#6366f1");
  const [includeInTotal, setInclude] = React.useState(true);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(account?.name ?? "");
      setType(account?.type ?? "checking");
      setInstitution(account?.institution ?? "");
      setOpening(account?.opening_balance_cents ?? 0);
      setColor(account?.color ?? "#6366f1");
      setInclude(account?.include_in_total ?? true);
      setError("");
    }
  }, [open, account]);

  async function submit() {
    setError("");
    setPending(true);
    const res = await saveAccount({
      id: account?.id,
      name, type, institution,
      openingBalanceCents: opening,
      color,
      includeInTotal: includeInTotal,
    });
    setPending(false);
    if (res.ok) {
      toast.success(res.message ?? "Salvo!");
      onOpenChange(false);
      router.refresh();
    } else {
      setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Editar conta" : "Nova conta"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome da conta">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Nubank, Carteira" autoFocus />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Instituição">
              <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Opcional" />
            </Field>
          </div>
          <Field label="Saldo inicial" hint="Quanto há nessa conta hoje.">
            <MoneyInput value={opening} onValueChange={setOpening} />
          </Field>
          <Field label="Cor">
            <ColorPicker value={color} onChange={setColor} />
          </Field>
          <label className="flex items-center justify-between rounded-xl border border-border px-3.5 py-3">
            <span className="text-sm">
              <span className="font-medium">Somar no saldo total</span>
              <span className="block text-xs text-muted-foreground">Inclui esta conta no total do painel.</span>
            </span>
            <Switch checked={includeInTotal} onCheckedChange={setInclude} />
          </label>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{editing ? "Salvar" : "Criar conta"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
