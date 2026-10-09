"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { resetRequestAction } from "../actions";
import { idleResult } from "@/lib/action-result";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Enviando…" : "Enviar link"}
    </Button>
  );
}

export default function RecoverPage() {
  const [state, action] = useActionState(resetRequestAction, idleResult);
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Recuperar senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enviaremos um link para você criar uma nova senha.
      </p>
      {state.ok && state.message ? (
        <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          {state.message}
        </div>
      ) : (
        <form action={action} className="mt-6 flex flex-col gap-4" noValidate>
          {state.error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
            <FieldError message={state.fieldErrors?.email} />
          </div>
          <Submit />
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link href="/entrar" className="font-semibold text-brand-700 underline">
          Voltar para entrar
        </Link>
      </p>
    </div>
  );
}
