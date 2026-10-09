import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <h1 className="text-2xl font-extrabold">Página não encontrada</h1>
      <p className="text-muted-foreground">
        O conteúdo que você procura não existe ou não está disponível.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-600 px-6 font-semibold text-white"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
