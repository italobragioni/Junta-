"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createExpenseAction, updateExpenseAction } from "./actions";
import { initialActionState } from "@/lib/action-result";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { toDateInputValue } from "@/lib/dates";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface ExpenseInitial {
  id: string;
  description: string;
  amountCents: number;
  categoryId: string | null;
  date: string; // yyyy-mm-dd
  recurring: boolean;
}

export function ExpenseForm({
  categories,
  expense,
  onSuccess,
}: {
  categories: CategoryOption[];
  expense?: ExpenseInitial;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(expense);
  const [state, formAction] = useActionState(
    isEdit ? updateExpenseAction : createExpenseAction,
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
      {expense && <input type="hidden" name="id" value={expense.id} />}
      {state.error && !state.fieldErrors && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          placeholder="Ex.: Supermercado"
          defaultValue={expense?.description}
          required
        />
        <FieldError message={state.fieldErrors?.description} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amount">Valor</Label>
          <CurrencyInput
            id="amount"
            name="amount"
            defaultCents={expense?.amountCents}
            required
          />
          <FieldError message={state.fieldErrors?.amount} />
        </div>
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={expense?.date ?? toDateInputValue(new Date())}
            required
          />
          <FieldError message={state.fieldErrors?.date} />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <Select
          id="categoryId"
          name="categoryId"
          defaultValue={expense?.categoryId ?? categories[0]?.id}
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="recurring"
          defaultChecked={expense?.recurring}
          className="h-4 w-4 rounded border-input text-brand-600 focus:ring-brand-400"
        />
        Despesa recorrente (repete todo mês)
      </label>

      <SubmitButton className="w-full">
        {isEdit ? "Salvar alterações" : "Adicionar gasto"}
      </SubmitButton>
    </form>
  );
}
