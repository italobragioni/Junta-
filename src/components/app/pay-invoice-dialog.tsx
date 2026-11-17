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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { payCardInvoice } from "@/lib/actions/transactions";
import { formatMonth } from "@/lib/format";
import type { AccountWithBalance } from "@/lib/db/types";

export function PayInvoiceDialog({
  open,
  onOpenChange,
  cardId,
  cardName,
  invoicePeriod,
  suggestedCents,
  accounts,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cardId: string;
  cardName: string;
  invoicePeriod: string;
  suggestedCents: number;
  accounts: AccountWithBalance[];
}) {
  const router = useRouter();
  const [amount, setAmount] = React.useState(suggestedCents);
  const [accountId, setAccountId] = React.useState(accounts[0]?.id ?? "");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setAmount(suggestedCents);
      setDate(new Date().toISOString().slice(0, 10));
      setError("");
    }
  }, [open, suggestedCents]);

  async function submit() {
    setError("");
    if (!accountId) { setError("Escolha a conta de pagamento."); return; }
    setPending(true);
    const res = await payCardInvoice({
      cardId, accountId, invoicePeriod, amountCents: amount, occurredOn: date,
    });
    setPending(false);
    if (res.ok) {
      toast.success("Pagamento registrado.");
      onOpenChange(false);
      router.refresh();
    } else {
      setError(res.error ?? "Não foi possível registrar.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagar fatura — {cardName}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <p className="rounded-xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
            Fatura de <span className="font-medium capitalize text-foreground">{formatMonth(invoicePeriod)}</span>.
            O pagamento sai da conta e abate a dívida do cartão — sem duplicar as compras já lançadas.
          </p>
          <Field label="Valor do pagamento">
            <MoneyInput value={amount} onValueChange={setAmount} autoFocus />
          </Field>
          <Field label="Pagar com a conta">
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger><SelectValue placeholder="Escolha a conta" /></SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Data do pagamento">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>Registrar pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
