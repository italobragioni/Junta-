"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { grantPremiumByEmail, revokePremiumByEmail } from "@/lib/actions/admin";

export function AdminGrantForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = React.useState(defaultEmail);
  const [busy, setBusy] = React.useState<"grant" | "revoke" | null>(null);
  const [result, setResult] = React.useState<{ ok: boolean; msg: string } | null>(null);

  async function run(kind: "grant" | "revoke") {
    setBusy(kind);
    setResult(null);
    const res = kind === "grant" ? await grantPremiumByEmail(email) : await revokePremiumByEmail(email);
    setBusy(null);
    setResult({ ok: res.ok, msg: res.ok ? res.message ?? "Feito." : res.error ?? "Erro." });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-mail do cliente"
          className="flex-1"
        />
        <Button onClick={() => run("grant")} disabled={busy !== null || !email.trim()}>
          {busy === "grant" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
          Liberar Premium
        </Button>
        <Button variant="outline" onClick={() => run("revoke")} disabled={busy !== null || !email.trim()}>
          Revogar
        </Button>
      </div>
      {result && (
        <div className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-sm ${result.ok ? "bg-positive-soft text-foreground" : "bg-negative-soft text-foreground"}`}>
          {result.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-negative" />}
          <span>{result.msg}</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Libera por 31 dias. A pessoa precisa já ter criado a conta no Finora com esse e-mail.
      </p>
    </div>
  );
}
