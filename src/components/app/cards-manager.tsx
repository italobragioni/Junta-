"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, CreditCard, MoreVertical, ChevronDown, CheckCircle2, Clock,
} from "lucide-react";
import { FitText } from "@/components/ui/fit-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CardFormDialog } from "./card-form";
import { PayInvoiceDialog } from "./pay-invoice-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { deleteCard } from "@/lib/actions/cards";
import { formatBRL, formatMonth, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CreditCardWithBalance, AccountWithBalance } from "@/lib/db/types";
import type { InvoiceSummary } from "@/lib/finance/invoices";

export interface CardView {
  card: CreditCardWithBalance;
  invoices: InvoiceSummary[];
  openInvoice: { period: string; totalCents: number; dueDate: string } | null;
}

export function CardsManager({ views, accounts }: { views: CardView[]; accounts: AccountWithBalance[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CreditCardWithBalance | undefined>();
  const [toDelete, setToDelete] = React.useState<CreditCardWithBalance | undefined>();
  const [pay, setPay] = React.useState<{ cardId: string; name: string; period: string; cents: number } | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    const res = await deleteCard(toDelete.id);
    if (res.ok) { toast.success(res.message ?? "Removido."); router.refresh(); }
    else toast.error(res.error ?? "Erro.");
    setToDelete(undefined);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cartões de crédito</h1>
          <p className="mt-1 text-sm text-muted-foreground">Faturas, limites e parcelamentos.</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Novo cartão
        </Button>
      </div>

      {views.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Nenhum cartão cadastrado"
          description="Cadastre seus cartões para registrar compras, parcelamentos e faturas automaticamente."
          action={<Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> Criar cartão</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {views.map((v) => (
            <CardItem
              key={v.card.id}
              view={v}
              onEdit={() => { setEditing(v.card); setFormOpen(true); }}
              onDelete={() => setToDelete(v.card)}
              onPay={(period, cents) => setPay({ cardId: v.card.id, name: v.card.name, period, cents })}
            />
          ))}
        </div>
      )}

      <CardFormDialog open={formOpen} onOpenChange={setFormOpen} card={editing} />
      {pay && (
        <PayInvoiceDialog
          open={!!pay}
          onOpenChange={(o) => !o && setPay(null)}
          cardId={pay.cardId}
          cardName={pay.name}
          invoicePeriod={pay.period}
          suggestedCents={pay.cents}
          accounts={accounts}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(undefined)}
        title="Excluir cartão?"
        description={`"${toDelete?.name}" será removido. Com lançamentos, será apenas arquivado.`}
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function CardItem({ view, onEdit, onDelete, onPay }: {
  view: CardView;
  onEdit: () => void;
  onDelete: () => void;
  onPay: (period: string, cents: number) => void;
}) {
  const { card, invoices, openInvoice } = view;
  const [menu, setMenu] = React.useState(false);
  const [showInvoices, setShowInvoices] = React.useState(false);
  const usedPct = card.limit_cents > 0 ? (card.used_cents / card.limit_cents) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      {/* Visual do cartão */}
      <div className="relative p-5 text-white" style={{ background: `linear-gradient(135deg, ${card.color}, ${shade(card.color)})` }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm/none opacity-80">{card.brand || "Cartão"}</p>
            <p className="mt-1 text-lg font-bold">{card.name}</p>
          </div>
          <div className="relative">
            <button onClick={() => setMenu(!menu)} onBlur={() => setTimeout(() => setMenu(false), 150)} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Ações">
              <MoreVertical className="h-4 w-4" />
            </button>
            {menu && (
              <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-border bg-popover py-1 text-popover-foreground shadow-float">
                <button onMouseDown={(e) => e.preventDefault()} onClick={onEdit} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-4 w-4" /> Editar</button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={onDelete} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-negative hover:bg-negative-soft"><Trash2 className="h-4 w-4" /> Excluir</button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div className="min-w-0">
            <p className="text-xs opacity-80">Fatura atual</p>
            <FitText max={26} min={15} className="font-bold tabular tracking-tight">{formatBRL(openInvoice?.totalCents ?? 0)}</FitText>
          </div>
          <CreditCard className="h-8 w-8 shrink-0 opacity-70" />
        </div>
      </div>

      <CardContent className="p-4">
        {/* Limite */}
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="shrink-0 text-muted-foreground">Limite usado</span>
          <span className="min-w-0 truncate text-right tabular font-medium">{formatBRL(card.used_cents)} / {formatBRL(card.limit_cents)}</span>
        </div>
        <Progress className="mt-2" value={usedPct} tone={usedPct >= 90 ? "negative" : usedPct >= 70 ? "warn" : "brand"} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Disponível: <span className="font-medium text-foreground">{formatBRL(card.available_cents)}</span>
          {" · "}Fecha dia {card.closing_day} · Vence dia {card.due_day}
        </p>

        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            variant={openInvoice && openInvoice.totalCents > 0 ? "primary" : "outline"}
            disabled={!openInvoice || openInvoice.totalCents <= 0}
            onClick={() => openInvoice && onPay(openInvoice.period, openInvoice.totalCents)}
          >
            Pagar fatura
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowInvoices((v) => !v)}>
            Faturas <ChevronDown className={cn("h-4 w-4 transition-transform", showInvoices && "rotate-180")} />
          </Button>
        </div>

        {showInvoices && (
          <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
            {invoices.length === 0 && <li className="text-sm text-muted-foreground">Nenhuma fatura ainda.</li>}
            {[...invoices].reverse().map((inv) => (
              <li key={inv.period} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate capitalize">{formatMonth(inv.period)}</span>
                  {inv.isPaid ? (
                    <Badge variant="positive"><CheckCircle2 className="h-3 w-3" /> Paga</Badge>
                  ) : inv.isClosed ? (
                    <Badge variant="warn"><Clock className="h-3 w-3" /> Fechada</Badge>
                  ) : (
                    <Badge variant="brand">Aberta</Badge>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="tabular font-medium">{formatBRL(inv.totalCents)}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(inv.dueDate)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** Escurece levemente uma cor hex para o gradiente do cartão. */
function shade(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = Math.max(0, ((n >> 16) & 255) - 40);
  const g = Math.max(0, ((n >> 8) & 255) - 40);
  const b = Math.max(0, (n & 255) - 40);
  return `rgb(${r},${g},${b})`;
}
