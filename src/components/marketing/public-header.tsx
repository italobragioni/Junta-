import Link from "next/link";
import { Logo } from "@/components/brand/logo";

/** Marketing header — sits on the dark green gradient hero. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/70 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" aria-label="Civio — início">
          <Logo wordmarkClassName="text-white" />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            href="/entrar"
            className="rounded-xl px-3 py-2 text-white/90 hover:bg-white/10"
          >
            Entrar
          </Link>
          <Link
            href="/criar-conta"
            className="rounded-xl bg-gold px-4 py-2 text-ink hover:bg-gold-300"
          >
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
