"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { newPasswordAction } from "../actions";
import { idleResult } from "@/lib/action-result";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export default function ResetPage() {
  const [state, action] = useFormState(newPasswordAction, idleResult);
  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold tracking-tight">Nova senha</h1>
      <p className="mt-1.5 text-muted-foreground">Escolha uma nova senha para sua conta.</p>
      <Card className="mt-6">
        <CardContent className="p-5">
          <form action={action} className="flex flex-col gap-4">
            <FormAlert state={state} />
            <Field label="Nova senha" htmlFor="password" error={state.fieldErrors?.password} hint="Mínimo de 8 caracteres.">
              <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="Digite a nova senha" required />
            </Field>
            <SubmitButton size="lg" className="w-full">Salvar nova senha</SubmitButton>
          </form>
          {state.ok && (
            <p className="mt-4 text-center text-sm">
              <Link href="/entrar" className="font-semibold text-brand hover:underline">
                Ir para entrar
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
