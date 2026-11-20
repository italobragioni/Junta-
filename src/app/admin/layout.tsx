import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, LogOut } from "lucide-react";
import { authContext } from "@/lib/db/queries";
import { isAdminEmail } from "@/lib/env";
import { logoutAction } from "@/app/(auth)/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await authContext();
  if (!ctx) redirect("/entrar");
  if (!isAdminEmail(ctx.email)) redirect("/painel");

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2 font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Admin · Finora
          </span>
          <div className="flex items-center gap-1">
            <Link href="/painel" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">App</span>
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
