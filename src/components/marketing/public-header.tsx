import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" aria-label="Civio — início">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            href="/entrar"
            className="rounded-xl px-3 py-2 text-foreground hover:bg-muted"
          >
            Entrar
          </Link>
          <Link
            href="/criar-conta"
            className="rounded-xl bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
