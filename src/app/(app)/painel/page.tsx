import Link from "next/link";
import {
  Wallet, TrendingUp, TrendingDown, Scale, CalendarClock, CreditCard, Landmark,
  PiggyBank, ArrowRight, Sparkles, AlertTriangle, CheckCircle2, Info, Bell,
} from "lucide-react";
import { getDashboard } from "@/lib/finance/dashboard";
import { listCategories, listAccounts, listCards, listTransactions } from "@/lib/db/queries";
import { currentPeriod } from "@/lib/finance/period";
import { formatBRL, formatPercent, formatMonth } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard, SectionTitle, MoneyText } from "@/components/app/ui";
import { PeriodNav } from "@/components/app/period-nav";
import { BalanceAreaChart, IncomeExpenseChart, CategoryDonut } from "@/components/app/charts";
import { TransactionList, buildLookups } from "@/components/app/transaction-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const period = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : currentPeriod();

  let data: Awaited<ReturnType<typeof getDashboard>>;
  let categories: Awaited<ReturnType<typeof listCategories>>;
  let accounts: Awaited<ReturnType<typeof listAccounts>>;
  let cards: Awaited<ReturnType<typeof listCards>>;
  let recent: Awaited<ReturnType<typeof listTransactions>>;
  try {
    [data, categories, accounts, cards, recent] = await Promise.all([
      getDashboard(period),
      listCategories(),
      listAccounts(),
      listCards(),
      listTransactions({ limit: 8 }),
    ]);
  } catch (e) {
    return <PainelDiagnostico error={e as Error} />;
  }

  const lookups = buildLookups(categories, accounts, cards);
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const donutData = data.categories.map((c) => {
    const cat = c.categoryId ? catMap.get(c.categoryId) : undefined;
    return { name: cat?.name ?? "Sem categoria", value: c.totalCents, color: cat?.color ?? "#94a3b8" };
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho + navegação de mês */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">Seu panorama financeiro completo.</p>
        </div>
        <PeriodNav period={period} />
      </div>

      {/* Resumo inteligente */}
      {data.hasData && (
        <Card className="overflow-hidden">
          <CardContent className="flex items-start gap-3 p-4 sm:p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl brand-gradient text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-foreground/90">
              <SmartSummary
                month={formatMonth(period)}
                income={data.incomeCents}
                expense={data.expenseCents}
                result={data.resultCents}
                savingsRate={data.savingsRate}
              />
            </p>
          </CardContent>
        </Card>
      )}

      {/* Indicadores principais */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Saldo total" cents={data.totalBalanceCents} icon={Wallet} tone="brand" sublabel="em todas as contas" />
        <StatCard label="Receitas do mês" cents={data.incomeCents} icon={TrendingUp} tone="positive" />
        <StatCard label="Despesas do mês" cents={data.expenseCents} icon={TrendingDown} tone="negative" trend={Math.round(data.expenseTrend)} sublabel="vs. mês anterior" />
        <ResultCard cents={data.resultCents} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Contas a pagar" cents={data.payableCents} icon={CalendarClock} tone="neutral" />
        <StatCard label="Contas a receber" cents={data.receivableCents} icon={Landmark} tone="neutral" />
        <StatCard label="Dívida em cartões" cents={data.cardDebtCents} icon={CreditCard} tone="neutral" />
        <StatCard label="Patrimônio líquido" cents={data.netWorthCents} icon={PiggyBank} tone="brand" />
      </div>

      {/* Renda comprometida */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <SectionTitle className="mb-0">Renda comprometida</SectionTitle>
            <span className="text-sm font-semibold tabular">{formatPercent(data.committedPercent)}</span>
          </div>
          <Progress
            className="mt-3"
            value={data.committedPercent}
            tone={data.committedPercent >= 100 ? "negative" : data.committedPercent >= 80 ? "warn" : "positive"}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {data.committedPercent >= 100
              ? "Você comprometeu toda a sua renda deste mês."
              : `Sobra ${formatPercent(Math.max(0, 100 - data.committedPercent))} da sua renda para guardar ou investir.`}
          </p>
        </CardContent>
      </Card>

      {/* Alertas */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>Alertas importantes</SectionTitle>
          {data.alerts.map((a, i) => (
            <AlertRow key={i} {...a} />
          ))}
        </div>
      )}

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <SectionTitle>Evolução do saldo</SectionTitle>
            <BalanceAreaChart data={data.monthly} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <SectionTitle>Receitas × despesas</SectionTitle>
            <IncomeExpenseChart data={data.monthly} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-5">
            <SectionTitle>Gastos por categoria</SectionTitle>
            {donutData.length > 0 ? (
              <>
                <CategoryDonut data={donutData} />
                <ul className="mt-2 space-y-1.5">
                  {donutData.slice(0, 5).map((d) => (
                    <li key={d.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="tabular text-muted-foreground">{formatBRL(d.value)}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma despesa neste mês.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-5">
            <SectionTitle action={<Link href="/transacoes" className="text-sm font-medium text-brand hover:underline">Ver todas</Link>}>
              Últimos lançamentos
            </SectionTitle>
            <TransactionList transactions={recent} lookups={lookups} emptyHint="Registre seu primeiro lançamento com o botão +." />
          </CardContent>
        </Card>
      </div>

      {!data.hasData && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <ArrowRight className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">Vamos começar?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie suas contas e registre o primeiro lançamento para ver seu painel ganhar vida.
              </p>
            </div>
            <Link href="/contas" className="font-semibold text-brand hover:underline">Criar primeira conta</Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResultCard({ cents }: { cents: number }) {
  const positive = cents >= 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Resultado do mês</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${positive ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"}`}>
          <Scale className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2"><MoneyText cents={cents} signed className="text-2xl font-bold" /></p>
      <p className="mt-1 text-xs text-muted-foreground">{positive ? "Você fechou no azul 🎉" : "Fechou no vermelho"}</p>
    </div>
  );
}

function SmartSummary({ month, income, expense, result, savingsRate }: {
  month: string; income: number; expense: number; result: number; savingsRate: number;
}) {
  if (income === 0 && expense === 0) {
    return <>Ainda não há movimentações em <span className="font-semibold capitalize">{month}</span>. Registre receitas e despesas para ver seu resumo inteligente aqui.</>;
  }
  return (
    <>
      Em <span className="font-semibold capitalize">{month}</span>, você recebeu{" "}
      <span className="font-semibold text-positive">{formatBRL(income)}</span> e gastou{" "}
      <span className="font-semibold text-negative">{formatBRL(expense)}</span>.{" "}
      {result >= 0 ? (
        <>Seu saldo foi positivo em <span className="font-semibold text-positive">{formatBRL(result)}</span> — guardando {savingsRate.toFixed(0)}% da renda.</>
      ) : (
        <>Você fechou negativo em <span className="font-semibold text-negative">{formatBRL(Math.abs(result))}</span>. Vale revisar os maiores gastos.</>
      )}
    </>
  );
}

function AlertRow({ tone, title, description }: { tone: string; title: string; description: string }) {
  const map: Record<string, { cls: string; icon: typeof Info }> = {
    negative: { cls: "border-negative/30 bg-negative-soft text-negative", icon: AlertTriangle },
    warn: { cls: "border-warn/30 bg-warn-soft text-warn", icon: AlertTriangle },
    positive: { cls: "border-positive/30 bg-positive-soft text-positive", icon: CheckCircle2 },
    brand: { cls: "border-brand/30 bg-brand/10 text-brand", icon: Bell },
  };
  const { cls, icon: Icon } = map[tone] ?? map.brand;
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${cls}`}>
      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-foreground/70">{description}</p>
      </div>
    </div>
  );
}

/** Painel de diagnóstico temporário: mostra o erro real em vez de quebrar a página. */
function PainelDiagnostico({ error }: { error: Error }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encontramos um problema ao montar seu painel. Os detalhes abaixo ajudam a corrigir.
        </p>
      </div>
      <div className="rounded-2xl border border-negative/30 bg-negative-soft p-4">
        <p className="text-sm font-semibold text-negative">
          {error?.name || "Erro"}: {error?.message || "sem mensagem"}
        </p>
        {error?.stack && (
          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-foreground/70">
            {error.stack}
          </pre>
        )}
      </div>
      <Link href="/contas" className="inline-block font-semibold text-brand hover:underline">
        Ir para Contas →
      </Link>
    </div>
  );
}
