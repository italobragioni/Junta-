"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { resetRequestAction } from "../actions";
import { idleResult } from "@/lib/action-result";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export default function RecoverPage() {
  const [state, action] = useFormState(resetRequestAction, idleResult);
  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold tracking-tight">Recuperar senha</h1>
      <p className="mt-1.5 text-muted-foreground">
        Enviaremos um link para você criar uma nova senha.
      </p>
      <Card className="mt-6">
        <CardContent className="p-5">
          <form action={action} className="flex flex-col gap-4">
            <FormAlert state={state} />
            <Field label="E-mail" htmlFor="email" error={state.fieldErrors?.email}>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
            </Field>
            <SubmitButton size="lg" className="w-full">Enviar link</SubmitButton>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm">
        <Link href="/entrar" className="font-semibold text-brand hover:underline">
          Voltar para entrar
        </Link>
      </p>
    </div>
  );
}
