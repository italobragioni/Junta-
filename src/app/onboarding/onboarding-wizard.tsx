"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ArrowLeft, PiggyBank, Plane, Home, TrendingDown, Sparkles, Check, SkipForward,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { cn } from "@/lib/utils";
import { completeOnboarding, createInitialAccount, skipOnboarding } from "@/lib/actions/profile";
import { toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toast";

const GOALS = [
  { id: "reserva", label: "Montar uma reserva", icon: PiggyBank },
  { id: "viagem", label: "Fazer uma viagem", icon: Plane },
  { id: "imovel", label: "Comprar um imóvel", icon: Home },
  { id: "dividas", label: "Quitar dívidas", icon: TrendingDown },
  { id: "organizar", label: "Só me organizar", icon: Sparkles },
];

const STEPS = 4;

export function OnboardingWizard({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState(defaultName);
  const [goal, setGoal] = React.useState("organizar");
  const [income, setIncome] = React.useState(0);
  const [accountName, setAccountName] = React.useState("Conta principal");
  const [accountBalance, setAccountBalance] = React.useState(0);
  const [pending, setPending] = React.useState(false);

  async function finish() {
    setPending(true);
    const goalLabel = GOALS.find((g) => g.id === goal)?.label ?? "";
    await completeOnboarding({ displayName: name, primaryGoal: goalLabel, monthlyIncomeCents: income });
    if (accountName.trim()) {
      await createInitialAccount(accountName.trim(), accountBalance);
    }
    toast.success("Tudo pronto! Bem-vindo ao Finora 🎉");
    router.push("/painel");
    router.refresh();
  }

  const next = () => setStep((s) => Math.min(STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{ background: "radial-gradient(50% 40% at 50% 0%, rgba(99,102,241,0.14), transparent 70%)" }} />

      <header className="flex items-center justify-between px-5 py-5">
        <Logo />
        <form action={skipOnboarding}>
          <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
            Pular <SkipForward className="h-4 w-4" />
          </Button>
        </form>
      </header>

      {/* Progresso */}
      <div className="mx-auto w-full max-w-md px-5">
        <div className="flex gap-1.5">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-brand" : "bg-muted")} />
          ))}
        </div>
      </div>

      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-md animate-slide-up">
          {step === 0 && (
            <StepCard title={`Olá! Como podemos te chamar?`} subtitle="Vamos montar seu painel financeiro em poucos passos.">
              <Field label="Seu nome">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoFocus />
              </Field>
            </StepCard>
          )}

          {step === 1 && (
            <StepCard title="Qual seu principal objetivo?" subtitle="Isso ajuda a personalizar suas metas.">
              <div className="grid grid-cols-1 gap-2">
                {GOALS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setGoal(id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                      goal === id ? "border-brand bg-brand/5 text-brand" : "border-border hover:bg-muted/50",
                    )}
                  >
                    <Icon className="h-5 w-5" /> {label}
                    {goal === id && <Check className="ml-auto h-4 w-4" />}
                  </button>
                ))}
              </div>
            </StepCard>
          )}

          {step === 2 && (
            <StepCard title="Qual sua renda mensal aproximada?" subtitle="Usamos para calcular sua taxa de economia. Pode ajustar depois.">
              <Field label="Renda mensal">
                <MoneyInput value={income} onValueChange={setIncome} autoFocus />
              </Field>
            </StepCard>
          )}

          {step === 3 && (
            <StepCard title="Vamos criar sua primeira conta" subtitle="Pode ser sua conta do banco, carteira ou dinheiro em espécie.">
              <Field label="Nome da conta">
                <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Ex.: Nubank" />
              </Field>
              <Field label="Saldo atual" hint="Quanto há nessa conta hoje.">
                <MoneyInput value={accountBalance} onValueChange={setAccountBalance} />
              </Field>
            </StepCard>
          )}

          <div className="mt-6 flex items-center justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={back}><ArrowLeft className="h-4 w-4" /> Voltar</Button>
            ) : <span />}
            {step < STEPS - 1 ? (
              <Button onClick={next} disabled={step === 0 && !name.trim()}>Continuar <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={finish} loading={pending}>Concluir <Check className="h-4 w-4" /></Button>
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-muted-foreground">{subtitle}</p>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </div>
  );
}
