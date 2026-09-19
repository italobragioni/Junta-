import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/app/avatar";
import { PlanBadge } from "@/components/plans/plan-badge";
import { LogoutButton } from "@/components/app/logout-button";
import { ProfileForm } from "./profile-form";
import { PreferencesForm } from "./preferences-form";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const user = await requireUser();
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      createdAt: true,
      monthlyIncomeCents: true,
      incomeFrequency: true,
      primaryGoal: true,
    },
  });
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu perfil"
        description="Gerencie seus dados pessoais, preferências e segurança."
      />

      {/* Identity */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={profile.name} />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{profile.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {profile.email}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Cliente desde {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
            <div className="sm:w-64">
              <PlanBadge plan={user.plan} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal data */}
      <Card>
        <CardHeader>
          <CardTitle>Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm name={profile.name} email={profile.email} />
        </CardContent>
      </Card>

      {/* Financial preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <PreferencesForm
            monthlyIncomeCents={profile.monthlyIncomeCents ?? 0}
            incomeFrequency={profile.incomeFrequency ?? "MONTHLY"}
            primaryGoal={profile.primaryGoal ?? ""}
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/configuracoes/assinatura"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
          >
            <CreditCard className="h-4 w-4" />
            Gerenciar assinatura
          </Link>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
