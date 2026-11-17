import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(99,102,241,0.14), transparent 70%)",
        }}
      />
      <header className="px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
