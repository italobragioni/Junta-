"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { IncomeForm, type IncomeInitial } from "./income-form";
import { deleteIncomeAction } from "./actions";

export function AddIncomeButton({ label = "Adicionar receita" }: { label?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova receita"
        description="Registre uma entrada de dinheiro."
      >
        <IncomeForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function EditIncomeButton({ income }: { income: IncomeInitial }) {
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
      <Modal open={open} onClose={() => setOpen(false)} title="Editar receita">
        <IncomeForm income={income} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function DeleteIncomeButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm("Excluir esta receita?")) return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteIncomeAction(fd);
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
