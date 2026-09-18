"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label, Select, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionError } from "@/components/ui/action-error";
import { initialActionState } from "@/lib/action-result";
import { upsertBudgetAction, deleteBudgetAction } from "./actions";

interface CategoryOption {
  id: string;
  name: string;
}

function BudgetForm({
  categories,
  month,
  year,
  defaults,
  onSuccess,
}: {
  categories: CategoryOption[];
  month: number;
  year: number;
  defaults?: { categoryId: string; limitCents: number };
  onSuccess: () => void;
}) {
  const [state, formAction] = useActionState(
    upsertBudgetAction,
    initialActionState,
  );
  const router = useRouter();
  useEffect(() => {
    if (state.ok) {
      router.refresh();
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="month" value={month} />
      <input type="hidden" name="year" value={year} />
      <ActionError state={state} />
      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <Select
          id="categoryId"
          name="categoryId"
          defaultValue={defaults?.categoryId ?? categories[0]?.id}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <FieldError message={state.fieldErrors?.categoryId} />
      </div>
      <div>
        <Label htmlFor="limitAmount">Limite mensal</Label>
        <CurrencyInput
          id="limitAmount"
          name="limitAmount"
          defaultCents={defaults?.limitCents}
          required
        />
        <FieldError message={state.fieldErrors?.limitAmount} />
      </div>
      <SubmitButton className="w-full">Salvar orçamento</SubmitButton>
    </form>
  );
}

export function AddBudgetButton({
  categories,
  month,
  year,
  label = "Definir orçamento",
}: {
  categories: CategoryOption[];
  month: number;
  year: number;
  label?: string;
}) {
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
        title="Orçamento por categoria"
        description="Se já existir um orçamento para a categoria neste mês, ele será atualizado."
      >
        <BudgetForm
          categories={categories}
          month={month}
          year={year}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

export function DeleteBudgetButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm("Remover este orçamento?")) return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteBudgetAction(fd);
    router.refresh();
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Remover"
      onClick={onDelete}
      className="text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
