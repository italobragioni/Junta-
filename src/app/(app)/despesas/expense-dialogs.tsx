"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ExpenseForm, type CategoryOption, type ExpenseInitial } from "./expense-form";
import { deleteExpenseAction } from "./actions";

export function AddExpenseButton({
  categories,
  variant = "primary",
  size = "md",
  label = "Adicionar gasto",
}: {
  categories: CategoryOption[];
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova despesa"
        description="Registre um gasto para acompanhar para onde vai seu dinheiro."
      >
        <ExpenseForm categories={categories} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function EditExpenseButton({
  categories,
  expense,
}: {
  categories: CategoryOption[];
  expense: ExpenseInitial;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Editar"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Editar despesa"
      >
        <ExpenseForm
          categories={categories}
          expense={expense}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

export function DeleteExpenseButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm("Excluir esta despesa?")) return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteExpenseAction(fd);
    router.refresh();
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Excluir"
      onClick={onDelete}
      className="text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
