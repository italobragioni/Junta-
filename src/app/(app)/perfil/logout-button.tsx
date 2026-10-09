"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 font-semibold text-foreground hover:bg-muted"
      >
        <LogOut className="h-4 w-4" aria-hidden /> Sair da conta
      </button>
    </form>
  );
}
