import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { isSupabaseConfigured } from "@/lib/env";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border">
        <div className="container-app flex h-16 items-center">
          <Link href="/" aria-label="Civio — início">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="container-app flex w-full flex-1 flex-col justify-center py-8">
        <div className="mx-auto w-full max-w-sm">
          {!configured && (
            <div
              role="note"
              className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              Modo demonstração: o login ainda não está configurado neste
              ambiente. Você pode{" "}
              <Link href="/demonstracao" className="font-semibold underline">
                experimentar uma lição
              </Link>
              .
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
