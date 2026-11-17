"use client";

import { toReais } from "@/lib/money";
import { TRANSACTION_KIND_LABELS } from "@/lib/db/labels";
import type { Transaction, Category, Account, CreditCard } from "@/lib/db/types";

/** Escapa um campo para CSV (separador ';' — padrão pt-BR no Excel). */
function cell(value: string | number): string {
  const s = String(value);
  if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Monta e baixa um CSV genérico (com BOM para acentos no Excel). */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const lines = [headers, ...rows].map((r) => r.map(cell).join(";"));
  const csv = "﻿" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Valor em reais com vírgula decimal (para o Excel brasileiro). */
function reaisBR(cents: number): string {
  return toReais(cents).toFixed(2).replace(".", ",");
}

interface Lookups {
  categories: Map<string, Category>;
  accounts: Map<string, Account>;
  cards: Map<string, CreditCard>;
}

export function exportTransactionsCsv(transactions: Transaction[], lookups: Lookups) {
  const headers = ["Data", "Tipo", "Descrição", "Categoria", "Conta/Cartão", "Valor", "Status", "Parcela"];
  const rows = transactions.map((t) => {
    const category = t.category_id ? lookups.categories.get(t.category_id)?.name ?? "" : "";
    const where =
      t.kind === "transfer"
        ? `${lookups.accounts.get(t.account_id!)?.name ?? ""} → ${lookups.accounts.get(t.to_account_id!)?.name ?? ""}`
        : t.card_id
          ? lookups.cards.get(t.card_id)?.name ?? ""
          : t.account_id
            ? lookups.accounts.get(t.account_id)?.name ?? ""
            : "";
    const sign = t.kind === "income" ? 1 : t.kind === "transfer" ? 1 : -1;
    const parcela = t.installment_total && t.installment_total > 1 ? `${t.installment_number}/${t.installment_total}` : "";
    return [
      t.occurred_on,
      TRANSACTION_KIND_LABELS[t.kind],
      t.description,
      category,
      where,
      reaisBR(sign * t.amount_cents),
      t.status === "cleared" ? "Realizado" : "Previsto",
      parcela,
    ];
  });
  downloadCsv(`finora-transacoes-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
}
