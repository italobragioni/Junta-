import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { WhatsAppFab } from "@/components/brand/whatsapp-button";
import { logoutAction } from "@/app/(auth)/actions";

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{ background: "radial-gradient(50% 40% at 50% 0%, rgba(99,102,241,0.14), transparent 70%)" }}
      />
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/assinar"><Logo size="sm" /></Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </form>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4">
        {children}
      </main>
      <WhatsAppFab />
    </div>
  );
}
