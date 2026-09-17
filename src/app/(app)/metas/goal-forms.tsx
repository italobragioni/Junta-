"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/action-result";
import {
  createGoalAction,
  updateGoalAction,
  addToGoalAction,
  deleteGoalAction,
} from "./actions";

export interface GoalInitial {
  id: string;
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  targetDate: string; // yyyy-mm-dd or ""
}

function useCloseOnSuccess(ok: boolean, onSuccess: () => void) {
  const router = useRouter();
  useEffect(() => {
    if (ok) {
      router.refresh();
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);
}

function GoalForm({
  goal,
  onSuccess,
}: {
  goal?: GoalInitial;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(goal);
  const [state, formAction] = useActionState(
    isEdit ? updateGoalAction : createGoalAction,
    initialActionState,
  );
  useCloseOnSuccess(state.ok, onSuccess);

  return (
    <form action={formAction} className="space-y-4">
      {goal && <input type="hidden" name="id" value={goal.id} />}
      {state.error && !state.fieldErrors && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <Label htmlFor="name">Nome da meta</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: Reserva de emergência"
          defaultValue={goal?.name}
          required
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="targetAmount">Meta</Label>
          <CurrencyInput
            id="targetAmount"
            name="targetAmount"
            defaultCents={goal?.targetAmountCents}
            required
          />
          <FieldError message={state.fieldErrors?.targetAmount} />
        </div>
        <div>
          <Label htmlFor="currentAmount">Já guardado</Label>
          <CurrencyInput
            id="currentAmount"
            name="currentAmount"
            defaultCents={goal?.currentAmountCents}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="targetDate">Data alvo (opcional)</Label>
        <Input
          id="targetDate"
          name="targetDate"
          type="date"
          defaultValue={goal?.targetDate}
        />
      </div>
      <SubmitButton className="w-full">
        {isEdit ? "Salvar alterações" : "Criar meta"}
      </SubmitButton>
    </form>
  );
}

export function AddGoalButton({ label = "Nova meta" }: { label?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nova meta">
        <GoalForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function EditGoalButton({ goal }: { goal: GoalInitial }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Editar"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Editar meta">
        <GoalForm goal={goal} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

function AddMoneyForm({
  goalId,
  onSuccess,
}: {
  goalId: string;
  onSuccess: () => void;
}) {
  const [state, formAction] = useActionState(addToGoalAction, initialActionState);
  useCloseOnSuccess(state.ok, onSuccess);
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="goalId" value={goalId} />
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <Label htmlFor="amount">Quanto adicionar?</Label>
        <CurrencyInput id="amount" name="amount" required />
        <FieldError message={state.fieldErrors?.amount} />
      </div>
      <SubmitButton className="w-full">Adicionar à meta</SubmitButton>
    </form>
  );
}

export function AddMoneyButton({ goalId }: { goalId: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <PiggyBank className="h-4 w-4" />
        Adicionar dinheiro
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Adicionar dinheiro à meta"
      >
        <AddMoneyForm goalId={goalId} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function DeleteGoalButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm("Excluir esta meta?")) return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteGoalAction(fd);
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
