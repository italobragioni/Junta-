"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { newPasswordAction } from "../actions";
import { idleResult } from "@/lib/action-result";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Salvando…" : "Salvar nova senha"}
    </Button>
  );
}

export default function NewPasswordPage() {
  const [state, action] = useActionState(newPasswordAction, idleResult);
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Nova senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha uma nova senha para sua conta.
      </p>
      {state.ok && state.message ? (
        <div className="mt-6">
          <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            {state.message}
          </div>
          <Link
            href="/entrar"
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-600 px-5 font-semibold text-white"
          >
            Ir para entrar
          </Link>
        </div>
      ) : (
        <form action={action} className="mt-6 flex flex-col gap-4" noValidate>
          {state.error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required />
            <FieldError message={state.fieldErrors?.password} />
            <p className="mt-1 text-xs text-muted-foreground">Mínimo de 8 caracteres.</p>
          </div>
          <Submit />
        </form>
      )}
    </div>
  );
}
