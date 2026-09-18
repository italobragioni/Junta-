"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createIncomeAction, updateIncomeAction } from "./actions";
import { initialActionState } from "@/lib/action-result";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionError } from "@/components/ui/action-error";
import { DEFAULT_INCOME_CATEGORIES } from "@/lib/categories";
import { toDateInputValue } from "@/lib/dates";

export interface IncomeInitial {
  id: string;
  description: string;
  amountCents: number;
  category: string | null;
  date: string;
  recurring: boolean;
}

export function IncomeForm({
  income,
  onSuccess,
}: {
  income?: IncomeInitial;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(income);
  const [state, formAction] = useActionState(
    isEdit ? updateIncomeAction : createIncomeAction,
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
      {income && <input type="hidden" name="id" value={income.id} />}
      <ActionError state={state} />

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          placeholder="Ex.: Salário da empresa"
          defaultValue={income?.description}
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
            defaultCents={income?.amountCents}
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
            defaultValue={income?.date ?? toDateInputValue(new Date())}
            required
          />
          <FieldError message={state.fieldErrors?.date} />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Fonte</Label>
        <Select
          id="category"
          name="category"
          defaultValue={income?.category ?? DEFAULT_INCOME_CATEGORIES[0]}
        >
          {DEFAULT_INCOME_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="recurring"
          defaultChecked={income?.recurring}
          className="h-4 w-4 rounded border-input text-brand-600 focus:ring-brand-400"
        />
        Receita recorrente (repete todo mês)
      </label>

      <SubmitButton className="w-full">
        {isEdit ? "Salvar alterações" : "Adicionar receita"}
      </SubmitButton>
    </form>
  );
}
