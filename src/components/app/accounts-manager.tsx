"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeftRight, Wallet, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBubble } from "@/components/ui/icon";
import { MoneyText } from "./ui";
import { AccountFormDialog } from "./account-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useQuickAdd } from "./quick-add";
import { deleteAccount } from "@/lib/actions/accounts";
import { toast } from "@/components/ui/toast";
import { formatBRL } from "@/lib/format";
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ICONS } from "@/lib/db/labels";
import { sumCents } from "@/lib/money";
import type { AccountWithBalance } from "@/lib/db/types";

export function AccountsManager({ accounts }: { accounts: AccountWithBalance[] }) {
  const router = useRouter();
  const { open: openQuickAdd } = useQuickAdd();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AccountWithBalance | undefined>();
  const [toDelete, setToDelete] = React.useState<AccountWithBalance | undefined>();
  const [menuId, setMenuId] = React.useState<string | null>(null);

  const total = sumCents(accounts.filter((a) => a.include_in_total).map((a) => a.balance_cents));

  function newAccount() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function editAccount(a: AccountWithBalance) {
    setEditing(a);
    setFormOpen(true);
    setMenuId(null);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const res = await deleteAccount(toDelete.id);
    if (res.ok) {
      toast.success(res.message ?? "Conta removida.");
      router.refresh();
    } else {
      toast.error(res.error ?? "Erro ao excluir.");
    }
    setToDelete(undefined);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas e carteiras</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saldo total: <MoneyText cents={total} colored={false} className="text-foreground" />
          </p>
        </div>
        <div className="flex gap-2">
          {accounts.length >= 2 && (
            <Button variant="outline" onClick={() => openQuickAdd("transfer")}>
              <ArrowLeftRight className="h-4 w-4" /> Transferir
            </Button>
          )}
          <Button onClick={newAccount}>
            <Plus className="h-4 w-4" /> Nova conta
          </Button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Nenhuma conta cadastrada"
          description="Cadastre suas contas, carteiras e dinheiro em espécie para acompanhar o saldo."
          action={<Button onClick={newAccount}><Plus className="h-4 w-4" /> Criar conta</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => (
            <Card key={a.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <IconBubble name={ACCOUNT_TYPE_ICONS[a.type]} color={a.color} size="lg" />
                  <div className="relative">
                    <button
                      onClick={() => setMenuId(menuId === a.id ? null : a.id)}
                      onBlur={() => setTimeout(() => setMenuId((v) => (v === a.id ? null : v)), 150)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label="Ações"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuId === a.id && (
                      <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-float">
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => editAccount(a)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                          <Pencil className="h-4 w-4" /> Editar
                        </button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => { setToDelete(a); setMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-negative hover:bg-negative-soft">
                          <Trash2 className="h-4 w-4" /> Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 truncate font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {ACCOUNT_TYPE_LABELS[a.type]}{a.institution ? ` · ${a.institution}` : ""}
                </p>
                <p className="mt-2 text-xl font-bold tabular">{formatBRL(a.balance_cents)}</p>
                {!a.include_in_total && (
                  <span className="mt-1 inline-block text-[11px] text-muted-foreground">Fora do saldo total</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AccountFormDialog open={formOpen} onOpenChange={setFormOpen} account={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(undefined)}
        title="Excluir conta?"
        description={`"${toDelete?.name}" será removida. Se houver lançamentos, a conta será apenas arquivada.`}
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
