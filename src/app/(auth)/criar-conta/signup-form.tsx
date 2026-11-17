"use client";

import { useFormState } from "react-dom";
import { signupAction } from "../actions";
import { idleResult } from "@/lib/action-result";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export function SignupForm() {
  const [state, action] = useFormState(signupAction, idleResult);

  if (state.ok) {
    return (
      <Card>
        <CardContent className="p-5">
          <FormAlert state={state} />
          <p className="mt-3 text-sm text-muted-foreground">
            Depois de confirmar (se necessário), é só{" "}
            <a href="/entrar" className="font-semibold text-brand hover:underline">
              entrar
            </a>{" "}
            para montar seu painel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form action={action} className="flex flex-col gap-4">
          <FormAlert state={state} />
          <Field label="Seu nome" htmlFor="displayName" error={state.fieldErrors?.displayName}>
            <Input id="displayName" name="displayName" autoComplete="name" placeholder="Como quer ser chamado?" required />
          </Field>
          <Field label="E-mail" htmlFor="email" error={state.fieldErrors?.email}>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
          </Field>
          <Field label="Senha" htmlFor="password" error={state.fieldErrors?.password} hint="Mínimo de 8 caracteres.">
            <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="Crie uma senha" required />
          </Field>
          <SubmitButton size="lg" className="w-full">Criar conta</SubmitButton>
          <p className="text-center text-xs text-muted-foreground">
            Ao continuar, você concorda em usar o Finora de forma responsável.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
