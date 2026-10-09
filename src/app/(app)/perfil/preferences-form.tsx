"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { updatePreferencesAction } from "./actions";
import { idleResult } from "@/lib/action-result";

const TIMEZONES = [
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Cuiaba",
  "America/Belem",
  "America/Fortaleza",
  "America/Recife",
  "America/Rio_Branco",
  "America/Noronha",
];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando…" : "Salvar preferências"}
    </Button>
  );
}

export function PreferencesForm({
  displayName,
  timezone,
  reduceMotion,
  soundEnabled,
}: {
  displayName: string;
  timezone: string;
  reduceMotion: boolean;
  soundEnabled: boolean;
}) {
  const [state, action] = useActionState(updatePreferencesAction, idleResult);
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {state.message && state.ok && (
        <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {state.message}
        </p>
      )}
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div>
        <Label htmlFor="displayName">Nome de exibição</Label>
        <Input id="displayName" name="displayName" defaultValue={displayName} required />
        <FieldError message={state.fieldErrors?.displayName} />
      </div>
      <div>
        <Label htmlFor="timezone">Fuso horário</Label>
        <Select id="timezone" name="timezone" defaultValue={timezone}>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">
          Usado para calcular sua sequência diária. Mudanças só afetam dias
          futuros.
        </p>
      </div>
      <fieldset className="flex flex-col gap-3 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold">Acessibilidade</legend>
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm">Reduzir animações</span>
          <input
            type="checkbox"
            name="reduceMotion"
            defaultChecked={reduceMotion}
            className="h-6 w-6 rounded accent-brand-600"
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm">Sons</span>
          <input
            type="checkbox"
            name="soundEnabled"
            defaultChecked={soundEnabled}
            className="h-6 w-6 rounded accent-brand-600"
          />
        </label>
      </fieldset>
      <Submit />
    </form>
  );
}
