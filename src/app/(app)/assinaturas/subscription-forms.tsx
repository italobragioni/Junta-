"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionError } from "@/components/ui/action-error";
import { initialActionState } from "@/lib/action-result";
import {
  createSubscriptionAction,
  updateSubscriptionAction,
  deleteSubscriptionAction,
} from "./actions";

export interface SubscriptionInitial {
  id: string;
  name: string;
  amountCents: number;
  billingCycle: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  nextBillingDate: string;
  active: boolean;
}

const CYCLES: { value: string; label: string }[] = [
  { value: "MONTHLY", label: "Mensal" },
  { value: "WEEKLY", label: "Semanal" },
  { value: "QUARTERLY", label: "Trimestral" },
  { value: "YEARLY", label: "Anual" },
];

function SubscriptionForm({
  subscription,
  onSuccess,
}: {
  subscription?: SubscriptionInitial;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(subscription);
  const [state, formAction] = useActionState(
    isEdit ? updateSubscriptionAction : createSubscriptionAction,
    initialActionState,
  );
  const router = useRouter();
  useEffect(() => {
    if (state.ok) {
      router.refresh();
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {subscription && <input type="hidden" name="id" value={subscription.id} />}
      <ActionError state={state} />
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: Netflix"
          defaultValue={subscription?.name}
          required
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amount">Valor</Label>
          <CurrencyInput
            id="amount"
            name="amount"
            defaultCents={subscription?.amountCents}
            required
          />
          <FieldError message={state.fieldErrors?.amount} />
        </div>
        <div>
          <Label htmlFor="billingCycle">Periodicidade</Label>
          <Select
            id="billingCycle"
            name="billingCycle"
            defaultValue={subscription?.billingCycle ?? "MONTHLY"}
          >
            {CYCLES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="nextBillingDate">Próxima cobrança (opcional)</Label>
        <Input
          id="nextBillingDate"
          name="nextBillingDate"
          type="date"
          defaultValue={subscription?.nextBillingDate}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={subscription?.active ?? true}
          className="h-4 w-4 rounded border-input text-brand-600 focus:ring-brand-400"
        />
        Assinatura ativa
      </label>
      <SubmitButton className="w-full">
        {isEdit ? "Salvar alterações" : "Adicionar assinatura"}
      </SubmitButton>
    </form>
  );
}

export function AddSubscriptionButton({
  label = "Adicionar assinatura",
}: {
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova assinatura"
      >
        <SubscriptionForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function EditSubscriptionButton({
  subscription,
}: {
  subscription: SubscriptionInitial;
}) {
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Editar assinatura"
      >
        <SubscriptionForm
          subscription={subscription}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

export function DeleteSubscriptionButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm("Excluir esta assinatura?")) return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteSubscriptionAction(fd);
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
