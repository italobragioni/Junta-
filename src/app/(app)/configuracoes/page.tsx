import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/app/logout-button";
import { PlanBadge } from "@/components/plans/plan-badge";
import { Button } from "@/components/ui/button";
import { canUseFeature } from "@/lib/plans";
import { Download, FileText, Lock, UserRound } from "lucide-react";

export const metadata: Metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const user = await requireUser();
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      monthlyIncomeCents: true,
      primaryGoal: true,
      createdAt: true,
    },
  });

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta e preferências."
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Assinatura</CardTitle>
          <Link
            href="/configuracoes/assinatura"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            Gerenciar <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <PlanBadge plan={user.plan} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Perfil</CardTitle>
          <Link
            href="/perfil"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            Editar <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm">
            <UserRound className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{profile.name}</p>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="E-mail" value={profile.email} />
          {profile.monthlyIncomeCents != null && (
            <Row
              label="Renda informada"
              value={formatCents(profile.monthlyIncomeCents)}
            />
          )}
          {profile.primaryGoal && (
            <Row label="Objetivo principal" value={profile.primaryGoal} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exportar dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canUseFeature(user.plan, "CSV_EXPORT") ? (
            <div className="flex flex-wrap gap-2">
              <a href="/api/export?type=expenses" download>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Despesas (CSV)
                </Button>
              </a>
              <a href="/api/export?type=incomes" download>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Receitas (CSV)
                </Button>
              </a>
            </div>
          ) : (
            <LockedHint text="Exportação CSV disponível no plano Básico." />
          )}

          {canUseFeature(user.plan, "PDF_EXPORT") ? (
            <Link href="/relatorio" target="_blank">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4" />
                Relatório PDF
              </Button>
            </Link>
          ) : (
            <LockedHint text="Relatório em PDF disponível no plano Pro." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Sua senha é armazenada de forma segura (hash) e nunca em texto puro.
          </p>
          <p>
            A recuperação de senha por e-mail está preparada para
            implementação futura.
          </p>
          <div className="pt-2">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LockedHint({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Lock className="h-4 w-4" />
        {text}
      </span>
      <Link
        href="/planos"
        className="shrink-0 font-medium text-brand-600 hover:underline"
      >
        Ver planos
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
