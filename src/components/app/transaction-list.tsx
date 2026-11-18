"use client";

import * as React from "react";
import { ArrowLeftRight, Trash2, CreditCard, MoreVertical, CircleCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconBubble } from "@/components/ui/icon";
import { MoneyText } from "./ui";
import { formatDateShort } from "@/lib/format";
import { deleteTransaction, setTransactionStatus } from "@/lib/actions/transactions";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/db/types";
import type { TxLookups } from "@/lib/tx-lookups";

export type { TxLookups };

export function TransactionList({
  transactions,
  lookups,
  emptyHint,
}: {
  transactions: Transaction[];
  lookups: TxLookups;
  emptyHint?: string;
}) {
  if (transactions.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyHint ?? "Nenhum lançamento por aqui ainda."}
      </div>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {transactions.map((t) => (
        <TransactionRow key={t.id} tx={t} lookups={lookups} />
      ))}
    </ul>
  );
}

function TransactionRow({ tx, lookups }: { tx: Transaction; lookups: TxLookups }) {
  const router = useRouter();
  const [menu, setMenu] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const category = tx.category_id ? lookups.categories.get(tx.category_id) : undefined;
  const isTransfer = tx.kind === "transfer";
  const isCard = tx.kind === "card_expense" || tx.kind === "card_payment";
  const signCents =
    tx.kind === "income" ? tx.amount_cents : isTransfer ? 0 : -tx.amount_cents;

  const subtitle = isTransfer
    ? `${lookups.accounts.get(tx.account_id!)?.name ?? "?"} → ${lookups.accounts.get(tx.to_account_id!)?.name ?? "?"}`
    : isCard
      ? lookups.cards.get(tx.card_id!)?.name ?? "Cartão"
      : [category?.name, tx.account_id ? lookups.accounts.get(tx.account_id)?.name : null]
          .filter(Boolean)
          .join(" · ");

  async function onDelete() {
    setBusy(true);
    const res = await deleteTransaction(tx.id, tx.installment_group);
    if (res.ok) {
      toast.success("Lançamento excluído.");
      router.refresh();
    } else {
      toast.error(res.error ?? "Erro ao excluir.");
      setBusy(false);
    }
  }

  async function onToggleStatus() {
    setBusy(true);
    const res = await setTransactionStatus(tx.id, tx.status === "cleared" ? "pending" : "cleared");
    if (res.ok) router.refresh();
    else setBusy(false);
    setMenu(false);
  }

  return (
    <li className={cn("flex items-center gap-3 px-1 py-3 transition-opacity", busy && "opacity-50")}>
      {isTransfer ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <ArrowLeftRight className="h-5 w-5" />
        </span>
      ) : isCard && !category ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <CreditCard className="h-5 w-5" />
        </span>
      ) : (
        <IconBubble name={category?.icon ?? "tag"} color={category?.color} />
      )}

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-medium">
          {tx.description}
          {tx.installment_total && tx.installment_total > 1 && (
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {tx.installment_number}/{tx.installment_total}
            </span>
          )}
          {tx.status === "pending" && (
            <Clock className="h-3.5 w-3.5 shrink-0 text-warn" aria-label="Previsto" />
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">{subtitle || "—"}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        {isTransfer ? (
          <span className="tabular text-sm font-semibold text-muted-foreground">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(tx.amount_cents / 100)}
          </span>
        ) : (
          <MoneyText cents={signCents} className="text-sm" />
        )}
        <span className="text-xs text-muted-foreground">{formatDateShort(tx.occurred_on)}</span>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenu((v) => !v)}
          onBlur={() => setTimeout(() => setMenu(false), 150)}
          aria-label="Ações"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menu && (
          <div className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-float">
            {!isTransfer && !isCard && (
              <button onMouseDown={(e) => e.preventDefault()} onClick={onToggleStatus} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                <CircleCheck className="h-4 w-4" />
                {tx.status === "cleared" ? "Marcar como previsto" : "Marcar como realizado"}
              </button>
            )}
            <button onMouseDown={(e) => e.preventDefault()} onClick={onDelete} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-negative hover:bg-negative-soft">
              <Trash2 className="h-4 w-4" />
              {tx.installment_group ? "Excluir parcelas" : "Excluir"}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
