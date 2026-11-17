import type { Metadata } from "next";
import { listCards, listAccounts, listTransactions } from "@/lib/db/queries";
import { summarizeInvoices, openInvoicePeriod } from "@/lib/finance/invoices";
import { CardsManager, type CardView } from "@/components/app/cards-manager";

export const metadata: Metadata = { title: "Cartões" };
export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const [cards, accounts, cardTxs] = await Promise.all([
    listCards(),
    listAccounts(),
    listTransactions({ limit: 5000 }),
  ]);

  const byCard = new Map<string, typeof cardTxs>();
  for (const t of cardTxs) {
    if ((t.kind === "card_expense" || t.kind === "card_payment") && t.card_id) {
      const arr = byCard.get(t.card_id) ?? [];
      arr.push(t);
      byCard.set(t.card_id, arr);
    }
  }

  const views: CardView[] = cards.map((card) => {
    const txs = byCard.get(card.id) ?? [];
    const invoices = summarizeInvoices(
      txs.map((t) => ({ invoice_period: t.invoice_period, kind: t.kind, amount_cents: t.amount_cents })),
      card.closing_day,
      card.due_day,
    );
    const openPeriod = openInvoicePeriod(card.closing_day);
    const open = invoices.find((i) => i.period === openPeriod);
    // Fatura aberta: mostra a corrente mesmo que não haja no histórico ainda.
    const openInvoice = open
      ? { period: open.period, totalCents: open.totalCents, dueDate: open.dueDate }
      : { period: openPeriod, totalCents: 0, dueDate: "" };
    // Se a fatura aberta já está paga, não oferece pagamento (total 0 lógico).
    const unpaidOpen = open && open.isPaid ? { ...openInvoice, totalCents: 0 } : openInvoice;

    return { card, invoices, openInvoice: unpaidOpen };
  });

  return <CardsManager views={views} accounts={accounts} />;
}
