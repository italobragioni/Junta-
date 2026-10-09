"use client";

import { useState, useTransition } from "react";
import { startCheckoutAction } from "./actions";

export function SubscribeButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await startCheckoutAction();
            if (!res.ok) setError(res.error ?? "Erro.");
          })
        }
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gold px-6 text-base font-bold text-ink shadow-lg shadow-black/20 transition-colors hover:bg-gold-300 disabled:opacity-60"
      >
        {pending ? "Abrindo checkout…" : "Assinar o Premium"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
