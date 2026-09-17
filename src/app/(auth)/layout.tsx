import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-brand-50/60 to-background">
      <header className="container-app flex h-16 items-center">
        <Logo />
      </header>
      <main className="container-app flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="container-app py-6 text-center text-xs text-muted-foreground">
        <Link href="/termos" className="hover:text-foreground">
          Termos
        </Link>
        <span className="mx-2">·</span>
        <Link href="/privacidade" className="hover:text-foreground">
          Privacidade
        </Link>
      </footer>
    </div>
  );
}
