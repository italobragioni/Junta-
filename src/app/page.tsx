import Link from "next/link";
import {
  Search,
  PiggyBank,
  Target,
  TrendingDown,
  Calculator,
  ShieldCheck,
  ArrowRight,
  Check,
  Wallet,
  LineChart,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/public-header";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanCards } from "@/components/plans/plan-cards";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container-app py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <PiggyBank className="h-3.5 w-3.5" />
            Organize seu dinheiro. Corte desperdícios. Alcance seus objetivos.
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Pare de se perguntar para onde foi seu dinheiro.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Organize seus gastos, descubra onde está desperdiçando e transforme
            pequenas economias em dinheiro para os seus objetivos.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/cadastro">
              <Button size="lg" className="w-full sm:w-auto">
                Começar gratuitamente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Renda → Organização → Redução de desperdícios → Economia → Meta
          </p>
        </section>

        {/* Problema */}
        <Section
          eyebrow="O problema"
          title="O dinheiro some e você não sabe por quê"
          description="No fim do mês, a conta não fecha. Assinaturas esquecidas, gastos por impulso e a sensação de que nunca sobra para o que importa."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <ProblemCard
              title="Para onde foi?"
              text="Você ganha, gasta e não consegue rastrear onde o dinheiro está indo."
            />
            <ProblemCard
              title="Desperdícios invisíveis"
              text="Pequenos gastos recorrentes que, somados, custam caro no ano."
            />
            <ProblemCard
              title="Metas distantes"
              text="Sem um plano claro, juntar dinheiro para um objetivo parece impossível."
            />
          </div>
        </Section>

        {/* Como funciona */}
        <Section
          eyebrow="Como funciona"
          title="Simples do começo ao fim"
          description="Em poucos minutos você tem uma visão clara das suas finanças."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <StepCard
              n={1}
              title="Informe sua renda e gastos"
              text="Cadastre receitas e despesas em segundos, direto do celular."
            />
            <StepCard
              n={2}
              title="Veja para onde vai o dinheiro"
              text="Categorias, orçamentos e alertas mostram seus desperdícios."
            />
            <StepCard
              n={3}
              title="Economize e alcance metas"
              text="Simule quanto pode juntar e acompanhe seus objetivos."
            />
          </div>
        </Section>

        {/* Dashboard */}
        <Section
          eyebrow="Dashboard"
          title="Entenda tudo em uma olhada"
          description="Quanto ganhou, quanto gastou, quanto sobrou e quanto conseguiu economizar — sem gráficos inúteis."
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MiniStat icon={<Wallet className="h-4 w-4" />} label="Renda" />
            <MiniStat icon={<TrendingDown className="h-4 w-4" />} label="Gastos" />
            <MiniStat icon={<LineChart className="h-4 w-4" />} label="Disponível" />
            <MiniStat icon={<PiggyBank className="h-4 w-4" />} label="Economia" />
          </div>
        </Section>

        {/* Feature blocks */}
        <Section
          eyebrow="Recurso diferencial"
          title="Descubra onde você está gastando demais"
          description="O Junta+ compara seus gastos com sua própria média e mostra exatamente onde cortar — e quanto isso rende em um ano."
          icon={<Search className="h-5 w-5" />}
        >
          <FeatureList
            items={[
              "Comparação real com seus meses anteriores",
              "Alertas quando uma categoria dispara",
              "Projeção de quanto você junta ao cortar desperdícios",
            ]}
          />
        </Section>

        <Section
          eyebrow="Metas"
          title="Crie suas metas e veja quanto falta"
          description="Reserva de emergência, viagem, aquele objetivo importante. Saiba quanto guardar por mês para chegar lá."
          icon={<Target className="h-5 w-5" />}
        >
          <FeatureList
            items={[
              "Progresso visual de cada meta",
              "Cálculo automático do quanto guardar por mês",
              "Adicione dinheiro à meta quando quiser",
            ]}
          />
        </Section>

        <Section
          eyebrow="Simulador"
          title="Veja quanto pode economizar e simule objetivos"
          description="Informe quanto consegue guardar por mês e descubra o resultado em 3, 6, 12 e 24 meses. Analise antes de comprar."
          icon={<Calculator className="h-5 w-5" />}
        >
          <FeatureList
            items={[
              'Simulador "Quanto posso juntar?"',
              'Ferramenta "Posso comprar?" baseada nos seus dados',
              "Controle de assinaturas recorrentes",
            ]}
          />
        </Section>

        {/* Segurança */}
        <Section
          eyebrow="Segurança"
          title="Seus dados são só seus"
          description="Levamos a sério a proteção das suas informações financeiras."
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <ProblemCard
              title="Isolamento por usuário"
              text="Cada dado financeiro pertence apenas à sua conta autenticada."
            />
            <ProblemCard
              title="Senhas com hash"
              text="Sua senha nunca é armazenada em texto puro."
            />
            <ProblemCard
              title="Validação no servidor"
              text="Todos os dados são validados no servidor, não só no navegador."
            />
          </div>
        </Section>

        {/* Planos */}
        <Section
          eyebrow="Planos"
          title="Escolha seu plano"
          description="Comece gratuitamente. Faça upgrade para Básico ou Pro quando precisar de mais."
        >
          <PlanCards authed={false} />
          <p className="mt-6 text-center text-sm">
            <Link href="/planos" className="font-medium text-brand-600 hover:underline">
              Comparar todos os recursos →
            </Link>
          </p>
        </Section>

        {/* FAQ */}
        <Section eyebrow="FAQ" title="Perguntas frequentes">
          <div className="mx-auto max-w-2xl space-y-3">
            <Faq
              q="O Junta+ é gratuito?"
              a="Você pode começar gratuitamente e organizar suas finanças sem custo."
            />
            <Faq
              q="Preciso conectar minha conta bancária?"
              a="Não. Nesta versão você registra receitas e despesas manualmente. Integrações bancárias não estão incluídas."
            />
            <Faq
              q="Meus dados ficam seguros?"
              a="Sim. Cada usuário só acessa os próprios dados, senhas são armazenadas com hash e tudo é validado no servidor."
            />
            <Faq
              q="Funciona no celular?"
              a="Sim, o Junta+ foi desenhado com prioridade para a experiência mobile."
            />
          </div>
        </Section>

        {/* CTA final */}
        <section className="container-app py-16">
          <Card className="overflow-hidden bg-brand-600 p-8 text-center text-white sm:p-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight">
              Comece hoje a transformar pequenas economias em grandes objetivos.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-50">
              Descubra para onde seu dinheiro está indo e assuma o controle.
            </p>
            <div className="mt-6">
              <Link href="/cadastro">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-brand-700 hover:bg-brand-50"
                >
                  Começar gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <Logo />
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/termos" className="hover:text-foreground">
              Termos
            </Link>
            <Link href="/privacidade" className="hover:text-foreground">
              Privacidade
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/60 py-14 sm:py-16">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
            {icon}
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

function ProblemCard({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}

function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <Card className="p-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
        {n}
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}

function MiniStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Card className="p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 h-6 w-24 rounded-md bg-muted" />
    </Card>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mx-auto max-w-xl space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-border bg-card p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
        {q}
        <span className="ml-4 text-brand-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-muted-foreground">{a}</p>
    </details>
  );
}
