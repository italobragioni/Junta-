import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo size="lg" />
      <div>
        <p className="text-6xl font-bold brand-text-gradient">404</p>
        <h1 className="mt-2 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-1 text-muted-foreground">
          O endereço que você tentou abrir não existe.
        </p>
      </div>
      <Button asChild>
        <Link href="/painel">Ir para o painel</Link>
      </Button>
    </div>
  );
}
