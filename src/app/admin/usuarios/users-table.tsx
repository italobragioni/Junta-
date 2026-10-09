"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { setUserPlanAction } from "../actions";
import type { AdminUser } from "@/lib/admin/users";

function PlanControls({ user }: { user: AdminUser }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isPremium = user.plan === "premium";

  function change(makePremium: boolean) {
    start(async () => {
      setError(null);
      const res = await setUserPlanAction(user.id, makePremium);
      if (!res.ok) setError(res.error ?? "Erro.");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {isPremium ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => change(false)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
        >
          {pending ? "…" : "Tornar gratuito"}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => change(true)}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {pending ? "…" : "Tornar Premium"}
        </button>
      )}
      {error && <span className="text-[11px] text-red-600">{error}</span>}
    </div>
  );
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(term) ||
        u.displayName.toLowerCase().includes(term),
    );
  }, [q, users]);

  const premiumCount = users.filter((u) => u.plan === "premium").length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{users.length}</strong> cadastrados
        </span>
        <span>
          <strong className="text-foreground">{premiumCount}</strong> Premium
        </span>
      </div>

      <Input
        placeholder="Buscar por e-mail ou nome…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4"
        aria-label="Buscar usuários"
      />

      <ul className="flex flex-col gap-2">
        {filtered.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {u.displayName || "(sem nome)"}
                {u.role === "admin" && (
                  <Badge tone="brand" className="ml-2">
                    admin
                  </Badge>
                )}
              </p>
              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge tone={u.plan === "premium" ? "premium" : "muted"}>
                  {u.plan === "premium" ? "Premium" : "Gratuito"}
                </Badge>
                {u.plan === "premium" && u.accessUntil && (
                  <span className="text-[11px] text-muted-foreground">
                    até {new Date(u.accessUntil).toLocaleDateString("pt-BR")}
                  </span>
                )}
                {u.createdAt && (
                  <span className="text-[11px] text-muted-foreground">
                    desde {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </div>
            <PlanControls user={u} />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhum usuário encontrado.
          </li>
        )}
      </ul>
    </div>
  );
}
