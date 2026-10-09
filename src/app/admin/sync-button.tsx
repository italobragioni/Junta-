"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { syncContentAction } from "./actions";

export function SyncButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(true);
  return (
    <div>
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await syncContentAction();
            setOk(res.ok);
            setMsg(res.message);
          })
        }
      >
        {pending ? "Sincronizando…" : "Sincronizar conteúdo"}
      </Button>
      {msg && (
        <p className={`mt-2 text-sm ${ok ? "text-emerald-700" : "text-red-600"}`}>{msg}</p>
      )}
    </div>
  );
}
