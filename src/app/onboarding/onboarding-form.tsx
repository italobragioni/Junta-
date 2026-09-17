"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "./actions";
import { initialActionState } from "@/lib/action-result";
import { Card, CardContent } from "@/components/ui/card";
import { Label, Select, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";

const GOALS = [
  "Criar reserva de emergência",
  "Sair das dívidas",
  "Comprar algo",
  "Viajar",
  "Investir",
  "Economizar dinheiro",
  "Outro",
];

export function OnboardingForm() {
  const [state, formAction] = useActionState(
    completeOnboardingAction,
    initialActionState,
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-5">
          {state.error && !state.fieldErrors && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <div>
            <Label htmlFor="monthlyIncome">1. Qual sua renda mensal?</Label>
            <CurrencyInput
              id="monthlyIncome"
              name="monthlyIncome"
              required
            />
            <FieldError message={state.fieldErrors?.monthlyIncome} />
          </div>

          <div>
            <Label htmlFor="incomeFrequency">
              2. Com que frequência você recebe?
            </Label>
            <Select id="incomeFrequency" name="incomeFrequency" defaultValue="MONTHLY">
              <option value="MONTHLY">Mensalmente</option>
              <option value="WEEKLY">Semanalmente</option>
              <option value="BIWEEKLY">Quinzenalmente</option>
              <option value="OTHER">De outra forma</option>
            </Select>
            <FieldError message={state.fieldErrors?.incomeFrequency} />
          </div>

          <div>
            <Label htmlFor="primaryGoal">
              3. Qual seu principal objetivo financeiro?
            </Label>
            <Select id="primaryGoal" name="primaryGoal" defaultValue={GOALS[0]}>
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
            <FieldError message={state.fieldErrors?.primaryGoal} />
          </div>

          <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
            Vamos descobrir quanto você consegue juntar. 🚀
          </div>

          <SubmitButton size="lg" className="w-full">
            Ir para o dashboard
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
