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
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { saveCard } from "@/lib/actions/cards";
import { CARD_BRANDS } from "@/lib/db/labels";
import { bestPurchaseDay } from "@/lib/finance/invoices";
import type { CreditCardWithBalance } from "@/lib/db/types";

export function CardFormDialog({
  open,
  onOpenChange,
  card,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  card?: CreditCardWithBalance;
}) {
  const router = useRouter();
  const editing = !!card;
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [limit, setLimit] = React.useState(0);
  const [closing, setClosing] = React.useState(1);
  const [due, setDue] = React.useState(10);
  const [color, setColor] = React.useState("#0ea5e9");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(card?.name ?? "");
      setBrand(card?.brand ?? "");
      setLimit(card?.limit_cents ?? 0);
      setClosing(card?.closing_day ?? 1);
      setDue(card?.due_day ?? 10);
      setColor(card?.color ?? "#0ea5e9");
      setError("");
    }
  }, [open, card]);

  async function submit() {
    setError("");
    setPending(true);
    const res = await saveCard({
      id: card?.id, name, brand, color,
      limitCents: limit, closingDay: closing, dueDay: due,
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

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Editar cartão" : "Novo cartão"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome do cartão">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Nubank Roxinho" autoFocus />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bandeira">
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CARD_BRANDS.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Limite total">
              <MoneyInput value={limit} onValueChange={setLimit} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dia de fechamento">
              <Select value={String(closing)} onValueChange={(v) => setClosing(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {days.map((d) => (<SelectItem key={d} value={String(d)}>Dia {d}</SelectItem>))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Dia de vencimento">
              <Select value={String(due)} onValueChange={(v) => setDue(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {days.map((d) => (<SelectItem key={d} value={String(d)}>Dia {d}</SelectItem>))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <p className="rounded-xl bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
            Melhor dia para comprar: <strong>dia {bestPurchaseDay(closing)}</strong> (compras caem na próxima fatura, com maior prazo).
          </p>
          <Field label="Cor">
            <ColorPicker value={color} onChange={setColor} />
          </Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{editing ? "Salvar" : "Criar cartão"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
