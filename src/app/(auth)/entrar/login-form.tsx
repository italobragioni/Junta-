"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAction } from "../actions";
import { idleResult } from "@/lib/action-result";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState(loginAction, idleResult);
  return (
    <Card>
      <CardContent className="p-5">
        <form action={action} className="flex flex-col gap-4">
          {next && <input type="hidden" name="next" value={next} />}
          <FormAlert state={state} />
          <Field label="E-mail" htmlFor="email" error={state.fieldErrors?.email}>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
          </Field>
          <Field label="Senha" htmlFor="password" error={state.fieldErrors?.password}>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
          </Field>
          <div className="flex justify-end -mt-1">
            <Link href="/recuperar-senha" className="text-sm font-medium text-brand hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <SubmitButton size="lg" className="w-full">Entrar</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
