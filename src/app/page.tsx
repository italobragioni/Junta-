import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Sparkles, Wallet, CreditCard, Target, PieChart,
  TrendingUp, Bell, Lock, Smartphone, BarChart3, Repeat,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { WhatsAppFab } from "@/components/brand/whatsapp-button";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";

const FEATURES = [
  { icon: Wallet, title: "Contas e carteiras", desc: "Todas as suas contas num lugar só, com saldo sempre certo." },
  { icon: CreditCard, title: "Cartões e faturas", desc: "Parcelamentos e faturas calculados automaticamente, sem contar duas vezes." },
  { icon: PieChart, title: "Orçamentos", desc: "Defina limites por categoria e receba alertas antes de estourar." },
  { icon: Target, title: "Metas", desc: "Junte dinheiro para seus sonhos e veja a previsão de quando chega lá." },
  { icon: TrendingUp, title: "Patrimônio", desc: "Acompanhe ativos e dívidas e veja seu patrimônio líquido crescer." },
  { icon: Sparkles, title: "Finora IA", desc: "Pergunte em português e receba respostas sobre o seu dinheiro de verdade." },
];

const PILLARS = [
  { icon: BarChart3, label: "Relatórios completos" },
  { icon: Bell, label: "Alertas inteligentes" },
  { icon: Repeat, label: "Despesas recorrentes" },
  { icon: Smartphone, label: "Feito para o celular" },
];

export default function LandingPage() {
  const ready = isSupabaseConfigured();

  return (
    <div className="min-h-dvh bg-background">
      {/* Topo */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/criar-conta">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Controle financeiro inteligente, do jeito brasileiro
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Seu dinheiro sob controle.
              <br />
              <span className="brand-text-gradient">Seu futuro em movimento.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              O Finora reúne contas, cartões, orçamentos, metas e dívidas em uma
              plataforma linda e simples. Registre uma despesa em segundos e
              entenda para onde vai o seu dinheiro.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/criar-conta">
                  Começar agora — é grátis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/entrar">Já tenho conta</Link>
              </Button>
            </div>
            {!ready && (
              <p className="mx-auto mt-6 max-w-md rounded-xl border border-warn/30 bg-warn-soft px-4 py-2 text-xs text-foreground/80">
                Modo demonstração: conecte o Supabase para ativar cadastro e
                banco de dados. (Instruções no README.)
              </p>
            )}
          </div>

          {/* Mockup do painel */}
          <div className="mx-auto mt-14 max-w-4xl">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="border-y border-border bg-surface/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {PILLARS.map(({ icon: Ico, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm font-medium">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Ico className="h-4.5 w-4.5" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tudo o que você precisa para organizar a vida financeira
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pensado para quem não entende de finanças — e poderoso o bastante
            para quem entende.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Ico, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-105">
                <Ico className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segurança */}
      <section className="border-t border-border bg-surface/50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-positive-soft px-3 py-1 text-xs font-medium text-positive">
              <ShieldCheck className="h-3.5 w-3.5" /> Segurança e privacidade
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Seus dados são só seus
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cada usuário enxerga apenas as próprias informações, com
              isolamento garantido no banco de dados (Row Level Security).
              Seguimos boas práticas da LGPD. Nenhum outro usuário — nem o
              navegador — consegue acessar seus números.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ["Isolamento por usuário no banco de dados", Lock],
                ["Sessões seguras e validação no servidor", ShieldCheck],
                ["Exportação e backup dos seus dados quando quiser", BarChart3],
              ].map(([t, Ico]) => {
                const I = Ico as typeof Lock;
                return (
                  <li key={t as string} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-positive-soft text-positive">
                      <I className="h-4 w-4" />
                    </span>
                    {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-to-br from-brand/10 to-transparent p-8 shadow-card">
            <div className="flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl brand-gradient text-white shadow-float">
                <ShieldCheck className="h-12 w-12" />
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Criptografia em trânsito, autenticação robusta e políticas de
              acesso aplicadas em cada consulta.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl brand-gradient px-6 py-14 text-center text-white shadow-float sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Comece a controlar seu dinheiro hoje
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Leva menos de um minuto para criar sua conta e registrar sua
            primeira movimentação.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 bg-white text-brand-700 hover:bg-white/90">
            <Link href="/criar-conta">
              Criar minha conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Finora. Seu dinheiro sob controle.
          </p>
        </div>
      </footer>

      <WhatsAppFab />
    </div>
  );
}

/** Mini-mockup estático do painel para o hero. */
function DashboardPreview() {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-float sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Saldo total", value: "R$ 18.420,50", tone: "text-foreground" },
          { label: "Receitas do mês", value: "R$ 6.500,00", tone: "text-positive" },
          { label: "Despesas do mês", value: "R$ 3.280,90", tone: "text-negative" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-xl font-bold tabular ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-end justify-between gap-2 sm:gap-3">
          {[40, 65, 50, 80, 55, 90, 70, 100, 60, 85].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md brand-gradient"
                style={{ height: `${h}px`, opacity: 0.35 + (h / 100) * 0.65 }}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Evolução do saldo nos últimos meses
        </p>
      </div>
    </div>
  );
}
