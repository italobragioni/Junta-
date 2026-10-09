"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { signupAction } from "../actions";
import { idleResult } from "@/lib/action-result";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Criando…" : "Criar conta"}
    </Button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signupAction, idleResult);

  if (state.ok && state.message) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div>
        <Label htmlFor="displayName">Nome</Label>
        <Input id="displayName" name="displayName" autoComplete="name" required />
        <FieldError message={state.fieldErrors?.displayName} />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError message={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
        <FieldError message={state.fieldErrors?.password} />
        <p className="mt-1 text-xs text-muted-foreground">Mínimo de 8 caracteres.</p>
      </div>
      <Submit />
    </form>
  );
}
