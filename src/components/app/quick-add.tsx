"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody,
} from "@/components/ui/dialog";
import { TransactionForm } from "./transaction-form";
import type { AccountWithBalance, Category, CreditCardWithBalance } from "@/lib/db/types";

type Mode = "expense" | "income" | "transfer";

interface RefData {
  categories: Category[];
  accounts: AccountWithBalance[];
  cards: CreditCardWithBalance[];
}

const QuickAddContext = React.createContext<{ open: (mode?: Mode) => void } | null>(null);

export function useQuickAdd() {
  const ctx = React.useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd deve estar dentro de QuickAddProvider");
  return ctx;
}

/** Provê o modal de ação rápida para toda a área logada. */
export function QuickAddProvider({ data, children }: { data: RefData; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>("expense");
  const router = useRouter();

  const api = React.useMemo(
    () => ({
      open: (m: Mode = "expense") => {
        setMode(m);
        setOpen(true);
      },
    }),
    [],
  );

  const noAccounts = data.accounts.length === 0;

  return (
    <QuickAddContext.Provider value={api}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo lançamento</DialogTitle>
          </DialogHeader>
          <DialogBody className="pb-5">
            {noAccounts ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Crie uma conta primeiro para registrar lançamentos.
                <br />
                <button
                  className="mt-3 font-semibold text-brand hover:underline"
                  onClick={() => {
                    setOpen(false);
                    router.push("/contas");
                  }}
                >
                  Ir para Contas
                </button>
              </div>
            ) : (
              <TransactionForm
                categories={data.categories}
                accounts={data.accounts}
                cards={data.cards}
                defaultMode={mode}
                onDone={() => {
                  setOpen(false);
                  router.refresh();
                }}
              />
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </QuickAddContext.Provider>
  );
}

/** Botão flutuante de ação rápida (canto inferior no mobile, barra no desktop). */
export function QuickAddFab() {
  const { open } = useQuickAdd();
  return (
    <button
      onClick={() => open("expense")}
      aria-label="Novo lançamento"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-float transition-transform active:scale-95 lg:hidden"
    >
      <Plus className="h-7 w-7" />
    </button>
  );
}
