"use client";

import { useActionState } from "react";
import { signUpAction } from "../actions";
import { initialActionState } from "@/lib/action-result";
import { Input, Label, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && !state.fieldErrors && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Seu nome"
          required
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          required
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          required
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>
      <SubmitButton size="lg" className="w-full">
        Começar gratuitamente
      </SubmitButton>
    </form>
  );
}
