import type { Metadata } from "next";
import {
  Users, Crown, DollarSign, TrendingUp, ArrowLeftRight, Wallet, CreditCard,
  Target, TrendingDown, UserPlus, Receipt, AlertTriangle,
} from "lucide-react";
import { getAdminMetrics, type AdminMetrics } from "@/lib/admin/metrics";
import { formatBRL, formatDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const m = await getAdminMetrics();

  if (!m.available) {
    return (
      <div className="mx-auto max-w-lg">
        <Card><CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div className="text-sm">
            <p className="font-semibold">Chave de administrador do banco ausente</p>
            <p className="mt-1 text-muted-foreground">
              Para o painel ver os dados de todos os usuários, configure a variável
              <code className="mx-1 rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code>
              na Vercel e faça um Redeploy. (É a mesma chave usada pelo webhook da Cakto.)
            </p>
          </div>
        </CardContent></Card>
      </div>
    );
  }

  return <AdminDashboard m={m} />;
}

export function AdminDashboard({ m }: { m: AdminMetrics }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral de tudo que acontece no Finora.</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Usuários" value={String(m.totalUsers)} icon={Users} tone="brand" sub={`+${m.newUsers7d} em 7 dias`} />
        <Metric label="Assinantes Premium" value={String(m.premiumUsers)} icon={Crown} tone="positive" sub={`${m.activeSubs} ativos`} />
        <Metric label="MRR (receita/mês)" value={formatBRL(m.mrrCents)} icon={DollarSign} tone="positive" sub="assinaturas ativas" />
        <Metric label="Novos (30 dias)" value={String(m.newUsers30d)} icon={UserPlus} tone="brand" sub={`${m.newUsers7d} nos últimos 7`} />
      </div>

      {/* Assinaturas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Ativas" value={String(m.activeSubs)} icon={TrendingUp} tone="positive" />
        <Metric label="Canceladas" value={String(m.canceledSubs)} icon={TrendingDown} tone="negative" />
        <Metric label="Em atraso" value={String(m.pastDueSubs)} icon={AlertTriangle} tone="warn" />
        <Metric label="Conversão" value={m.totalUsers > 0 ? `${((m.premiumUsers / m.totalUsers) * 100).toFixed(0)}%` : "0%"} icon={Crown} tone="brand" sub="usuários → Premium" />
      </div>

      {/* Atividade agregada */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Atividade no app (todos os usuários)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Metric label="Lançamentos" value={String(m.totalTransactions)} icon={ArrowLeftRight} tone="neutral" />
          <Metric label="Contas" value={String(m.totalAccounts)} icon={Wallet} tone="neutral" />
          <Metric label="Cartões" value={String(m.totalCards)} icon={CreditCard} tone="neutral" />
          <Metric label="Metas" value={String(m.totalGoals)} icon={Target} tone="neutral" />
          <Metric label="Dívidas" value={String(m.totalDebts)} icon={TrendingDown} tone="neutral" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Usuários recentes */}
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-5">
            <h2 className="mb-3 text-base font-semibold">Usuários recentes</h2>
            {m.recentUsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Nenhum usuário ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-2 font-medium">Usuário</th>
                      <th className="py-2 px-2 font-medium">Plano</th>
                      <th className="py-2 pl-2 text-right font-medium">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.recentUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/60">
                        <td className="py-2.5 pr-2">
                          <p className="font-medium">{u.display_name || "—"}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email || "—"}</p>
                        </td>
                        <td className="py-2.5 px-2">
                          {u.premium ? (
                            <Badge variant="positive"><Crown className="h-3 w-3" /> Premium</Badge>
                          ) : (
                            <Badge variant="neutral">Gratuito</Badge>
                          )}
                        </td>
                        <td className="py-2.5 pl-2 text-right text-xs text-muted-foreground">{formatDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Eventos de cobrança */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-5">
            <h2 className="mb-3 text-base font-semibold">Pagamentos recentes</h2>
            {m.recentBilling.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Nenhum evento de cobrança ainda.</p>
            ) : (
              <ul className="space-y-2.5">
                {m.recentBilling.map((e) => (
                  <li key={e.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Receipt className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{eventLabel(e.event)}</p>
                      <p className="truncate text-xs text-muted-foreground">{e.customer_email || "—"}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon, tone, sub }: {
  label: string; value: string; icon: typeof Users;
  tone: "brand" | "positive" | "negative" | "warn" | "neutral"; sub?: string;
}) {
  const bubble =
    tone === "positive" ? "bg-positive-soft text-positive"
      : tone === "negative" ? "bg-negative-soft text-negative"
        : tone === "warn" ? "bg-warn-soft text-warn"
          : tone === "brand" ? "bg-brand/10 text-brand"
            : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm text-muted-foreground">{label}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bubble}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 truncate text-2xl font-bold tabular">{value}</p>
      {sub && <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function eventLabel(event: string): string {
  const map: Record<string, string> = {
    purchase_approved: "Pagamento aprovado",
    subscription_created: "Assinatura criada",
    subscription_renewed: "Assinatura renovada",
    subscription_canceled: "Assinatura cancelada",
    subscription_paused: "Assinatura pausada",
    subscription_resumed: "Assinatura retomada",
    subscription_late: "Pagamento atrasado",
    subscription_renewal_refused: "Renovação recusada",
    refund: "Estorno",
    chargeback: "Chargeback",
  };
  return map[event] ?? event;
}
