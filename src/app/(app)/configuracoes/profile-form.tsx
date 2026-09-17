"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "./actions";
import { initialActionState } from "@/lib/action-result";
import { Input, Label, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function ProfileForm({ name }: { name: string }) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    initialActionState,
  );
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      setSaved(true);
      router.refresh();
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" defaultValue={name} required />
        <FieldError message={state.fieldErrors?.name} />
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton>Salvar</SubmitButton>
        {saved && (
          <span className="text-sm text-brand-600">Alterações salvas!</span>
        )}
      </div>
    </form>
  );
}
