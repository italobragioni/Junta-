"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { changePasswordAction } from "./actions";
import { initialActionState } from "@/lib/action-result";
import { Input, Label, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionError } from "@/components/ui/action-error";

export function PasswordForm() {
  const [state, formAction] = useActionState(
    changePasswordAction,
    initialActionState,
  );
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      setSaved(true);
      formRef.current?.reset();
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <ActionError state={state} />
      <div>
        <Label htmlFor="currentPassword">Senha atual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
        <FieldError message={state.fieldErrors?.currentPassword} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="newPassword">Nova senha</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            required
          />
          <FieldError message={state.fieldErrors?.newPassword} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
          <FieldError message={state.fieldErrors?.confirmPassword} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton>Alterar senha</SubmitButton>
        {saved && (
          <span className="text-sm text-brand-600">Senha alterada!</span>
        )}
      </div>
    </form>
  );
}
