import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { PlanCards } from "@/components/plans/plan-cards";
import { ComparisonTable } from "@/components/plans/comparison-table";

export const metadata: Metadata = {
  title: "Planos e preços",
  description:
    "Escolha o plano do Junta+: Gratuito, Básico ou Pro. Comece grátis e faça upgrade quando quiser.",
};

export default async function PlanosPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border/60">
        <div className="container-app flex h-16 items-center justify-between">
          <Logo />
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Voltar ao app
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button size="sm">Começar grátis</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="container-app flex-1 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Escolha seu plano
          </h1>
          <p className="mt-3 text-muted-foreground">
            Comece gratuitamente. Faça upgrade quando precisar de mais — sem
            fidelidade, cancele quando quiser.
          </p>
        </div>

        <div className="mt-10">
          <PlanCards authed={Boolean(user)} currentPlan={user?.plan} />
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
            Compare os planos
          </h2>
          <ComparisonTable />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          Os valores são cobrados mensalmente. O Junta+ ajuda você a organizar e
          analisar os dados que você mesmo informa e não constitui
          aconselhamento financeiro profissional.
        </p>
      </main>
    </div>
  );
}
