"use client";

import * as React from "react";
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { createTransaction, createTransfer } from "@/lib/actions/transactions";
import { PAYMENT_METHOD_LABELS, RECURRENCE_LABELS } from "@/lib/db/labels";
import type { AccountWithBalance, Category, CreditCardWithBalance, PaymentMethod, Recurrence } from "@/lib/db/types";

type Mode = "expense" | "income" | "transfer";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({
  categories,
  accounts,
  cards,
  defaultMode = "expense",
  onDone,
}: {
  categories: Category[];
  accounts: AccountWithBalance[];
  cards: CreditCardWithBalance[];
  defaultMode?: Mode;
  onDone?: () => void;
}) {
  const [mode, setMode] = React.useState<Mode>(defaultMode);
  const [amount, setAmount] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>("");
  const [payWith, setPayWith] = React.useState<"account" | "card">("account");
  const [accountId, setAccountId] = React.useState<string>(accounts[0]?.id ?? "");
  const [cardId, setCardId] = React.useState<string>(cards[0]?.id ?? "");
  const [toAccountId, setToAccountId] = React.useState<string>(accounts[1]?.id ?? "");
  const [occurredOn, setOccurredOn] = React.useState(today());
  const [method, setMethod] = React.useState<PaymentMethod | "">("");
  const [installments, setInstallments] = React.useState(1);
  const [recurring, setRecurring] = React.useState<Recurrence>("none");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const typeCategories = categories.filter((c) => c.type === (mode === "income" ? "income" : "expense"));

  // Mantém categoria válida ao trocar de modo.
  React.useEffect(() => {
    if (mode !== "transfer" && !typeCategories.some((c) => c.id === categoryId)) {
      setCategoryId(typeCategories[0]?.id ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const useCard = mode === "expense" && payWith === "card";

  async function submit() {
    setError("");
    if (amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }
    setPending(true);
    try {
      let res;
      if (mode === "transfer") {
        res = await createTransfer({
          fromAccountId: accountId,
          toAccountId,
          amountCents: amount,
          occurredOn,
          description,
        });
      } else {
        res = await createTransaction({
          kind: useCard ? "card_expense" : mode,
          description,
          amountCents: amount,
          categoryId: categoryId || undefined,
          accountId: useCard ? undefined : accountId || undefined,
          cardId: useCard ? cardId || undefined : undefined,
          paymentMethod: method || undefined,
          occurredOn,
          status: "cleared",
          installments: useCard ? installments : 1,
          recurring,
        });
      }
      if (res.ok) {
        toast.success(res.message ?? "Salvo!");
        onDone?.();
      } else {
        setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Seletor de tipo */}
      <div className="grid grid-cols-3 gap-2">
        <ModeButton active={mode === "expense"} onClick={() => setMode("expense")} tone="negative" icon={ArrowDownCircle} label="Despesa" />
        <ModeButton active={mode === "income"} onClick={() => setMode("income")} tone="positive" icon={ArrowUpCircle} label="Receita" />
        <ModeButton active={mode === "transfer"} onClick={() => setMode("transfer")} tone="brand" icon={ArrowLeftRight} label="Transferir" />
      </div>

      <Field label="Valor">
        <MoneyInput value={amount} onValueChange={setAmount} autoFocus />
      </Field>

      {mode !== "transfer" ? (
        <>
          <Field label="Descrição">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={mode === "income" ? "Ex.: Salário" : "Ex.: Mercado"} />
          </Field>

          <Field label="Categoria">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Escolha a categoria" /></SelectTrigger>
              <SelectContent>
                {typeCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {mode === "expense" && cards.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <PayToggle active={payWith === "account"} onClick={() => setPayWith("account")} icon={Wallet} label="Conta" />
              <PayToggle active={payWith === "card"} onClick={() => setPayWith("card")} icon={CreditCard} label="Cartão" />
            </div>
          )}

          {useCard ? (
            <>
              <Field label="Cartão">
                <Select value={cardId} onValueChange={setCardId}>
                  <SelectTrigger><SelectValue placeholder="Escolha o cartão" /></SelectTrigger>
                  <SelectContent>
                    {cards.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Parcelas" hint={installments > 1 ? `${installments}x — cada parcela cai numa fatura.` : undefined}>
                <Select value={String(installments)} onValueChange={(v) => setInstallments(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </>
          ) : (
            <Field label={mode === "income" ? "Receber na conta" : "Pagar com a conta"}>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger><SelectValue placeholder="Escolha a conta" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data">
              <Input type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} />
            </Field>
            {!useCard && (
              <Field label="Forma de pagamento">
                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>

          {!useCard && (
            <Field label="Repetir" hint="Cria uma regra para os próximos meses.">
              <Select value={recurring} onValueChange={(v) => setRecurring(v as Recurrence)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(RECURRENCE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </>
      ) : (
        <>
          <Field label="De">
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger><SelectValue placeholder="Conta de origem" /></SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Para">
            <Select value={toAccountId} onValueChange={setToAccountId}>
              <SelectTrigger><SelectValue placeholder="Conta de destino" /></SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Data">
            <Input type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} />
          </Field>
          <p className="rounded-xl bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
            Transferências entre suas contas não contam como receita nem despesa.
          </p>
        </>
      )}

      {error && <p className="text-sm font-medium text-negative">{error}</p>}

      <Button onClick={submit} loading={pending} size="lg" className="w-full">
        {mode === "transfer" ? "Transferir" : "Salvar lançamento"}
      </Button>
    </div>
  );
}

function ModeButton({ active, onClick, tone, icon: Icon, label }: {
  active: boolean; onClick: () => void; tone: "positive" | "negative" | "brand"; icon: typeof Wallet; label: string;
}) {
  const toneCls = active
    ? tone === "positive" ? "border-positive bg-positive-soft text-positive"
      : tone === "negative" ? "border-negative bg-negative-soft text-negative"
        : "border-brand bg-brand/10 text-brand"
    : "border-border text-muted-foreground hover:bg-muted/50";
  return (
    <button type="button" onClick={onClick}
      className={cn("flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-xs font-semibold transition-all", toneCls)}>
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function PayToggle({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: typeof Wallet; label: string;
}) {
  return (
    <button type="button" onClick={onClick}
      className={cn("flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
        active ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted/50")}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
