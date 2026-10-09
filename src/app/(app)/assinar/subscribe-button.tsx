"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startCheckoutAction } from "./actions";

export function SubscribeButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <Button
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await startCheckoutAction();
            if (!res.ok) setError(res.error ?? "Erro.");
          })
        }
      >
        {pending ? "Abrindo checkout…" : "Assinar o Premium"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
