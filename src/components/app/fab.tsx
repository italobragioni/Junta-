"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  ExpenseForm,
  type CategoryOption,
} from "@/app/(app)/despesas/expense-form";

/** Floating "Adicionar gasto" action, mobile-first (hidden on desktop). */
export function FloatingAddExpense({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Adicionar gasto"
        className="fixed bottom-20 right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 lg:hidden"
      >
        <Plus className="h-5 w-5" />
        Adicionar gasto
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova despesa"
        description="Registre um gasto em segundos."
      >
        <ExpenseForm categories={categories} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
