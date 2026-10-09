import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasServiceRole } from "@/lib/env";
import { computeMetrics } from "@/lib/admin/metrics";
import { SyncButton } from "./sync-button";

export const metadata = { title: "Painel administrativo" };

function pct(n: number, d: number): string {
  if (d === 0) return "—";
  return `${Math.round((n / d) * 100)}%`;
}

export default async function AdminHome() {
  if (!hasServiceRole()) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        O painel requer a chave de serviço do Supabase
        (SUPABASE_SERVICE_ROLE_KEY) configurada no servidor. Consulte o README.
      </div>
    );
  }

  const m = await computeMetrics();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Visão geral</h1>
        <SyncButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ativação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">
              {pct(m.activation.numerator, m.activation.denominator)}
            </p>
            <p className="text-sm text-muted-foreground">
              {m.activation.numerator} de {m.activation.denominator} cadastrados
              concluíram ao menos uma lição.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{m.activation.interval}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Retorno em 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">
              {pct(m.retention7d.numerator, m.retention7d.denominator)}
            </p>
            <p className="text-sm text-muted-foreground">
              {m.retention7d.numerator} de {m.retention7d.denominator} alunos
              ativados voltaram a ter atividade.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{m.retention7d.interval}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alunos cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">{m.totalLearners}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assinaturas ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">{m.activeSubscriptions}</p>
            <p className="text-sm text-muted-foreground">
              Período pago vigente, não estornado.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/usuarios"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-600 px-5 font-semibold text-white"
        >
          Gerenciar usuários
        </Link>
        <Link
          href="/admin/conteudo"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-border bg-card px-5 font-semibold"
        >
          Gerenciar conteúdo
        </Link>
        <Link
          href="/admin/relatos"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-border bg-card px-5 font-semibold"
        >
          Ver relatos de erro
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Os números acima são reais, calculados a partir do banco de dados. Rode
        “Sincronizar conteúdo” uma vez após configurar o banco para carregar as
        trilhas e lições.
      </p>
    </div>
  );
}
