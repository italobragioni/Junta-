"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePreferencesAction } from "./actions";
import { initialActionState } from "@/lib/action-result";
import { Label, Select, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionError } from "@/components/ui/action-error";

const GOALS = [
  "Criar reserva de emergência",
  "Sair das dívidas",
  "Comprar algo",
  "Viajar",
  "Investir",
  "Economizar dinheiro",
  "Outro",
];

export function PreferencesForm({
  monthlyIncomeCents,
  incomeFrequency,
  primaryGoal,
}: {
  monthlyIncomeCents: number;
  incomeFrequency: string;
  primaryGoal: string;
}) {
  const [state, formAction] = useActionState(
    updatePreferencesAction,
    initialActionState,
  );
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      setSaved(true);
      router.refresh();
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const goalValue = GOALS.includes(primaryGoal) ? primaryGoal : GOALS[0];

  return (
    <form action={formAction} className="space-y-4">
      <ActionError state={state} />
      <div>
        <Label htmlFor="monthlyIncome">Renda mensal</Label>
        <CurrencyInput
          id="monthlyIncome"
          name="monthlyIncome"
          defaultCents={monthlyIncomeCents}
        />
        <FieldError message={state.fieldErrors?.monthlyIncome} />
        <p className="mt-1 text-xs text-muted-foreground">
          Usada como referência nos cálculos. Não altera suas receitas
          cadastradas.
        </p>
      </div>
      <div>
        <Label htmlFor="incomeFrequency">Frequência de recebimento</Label>
        <Select
          id="incomeFrequency"
          name="incomeFrequency"
          defaultValue={incomeFrequency || "MONTHLY"}
        >
          <option value="MONTHLY">Mensalmente</option>
          <option value="WEEKLY">Semanalmente</option>
          <option value="BIWEEKLY">Quinzenalmente</option>
          <option value="OTHER">De outra forma</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="primaryGoal">Objetivo principal</Label>
        <Select id="primaryGoal" name="primaryGoal" defaultValue={goalValue}>
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton>Salvar preferências</SubmitButton>
        {saved && (
          <span className="text-sm text-brand-600">Preferências salvas!</span>
        )}
      </div>
    </form>
  );
}
