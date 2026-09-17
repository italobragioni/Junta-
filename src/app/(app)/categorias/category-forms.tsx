"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/action-result";
import { createCategoryAction, deleteCategoryAction } from "./actions";

export function AddCategoryButton() {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(
    createCategoryAction,
    initialActionState,
  );
  const router = useRouter();
  useEffect(() => {
    if (state.ok) {
      router.refresh();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Nova categoria
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova categoria de despesa"
      >
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="type" value="EXPENSE" />
          {state.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" placeholder="Ex.: Pets" required />
            <FieldError message={state.fieldErrors?.name} />
          </div>
          <SubmitButton className="w-full">Criar categoria</SubmitButton>
        </form>
      </Modal>
    </>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (
      !confirm(
        "Excluir esta categoria? As despesas dela ficarão sem categoria.",
      )
    )
      return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteCategoryAction(fd);
    router.refresh();
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Excluir"
      onClick={onDelete}
      className="text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
