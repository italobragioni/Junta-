import Link from "next/link";
import { Flame, Star, Trophy, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserState } from "@/lib/progress/read";
import { levelForXp } from "@/lib/gamification/xp";
import { ACHIEVEMENTS, ACHIEVEMENT_BY_CODE } from "@/lib/gamification/achievements";
import { PreferencesForm } from "./preferences-form";
import { GoalForm } from "./goal-form";
import { LogoutButton } from "./logout-button";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const state = await getUserState();
  if (!state) {
    return (
      <main className="container-app py-10 text-muted-foreground">
        Não foi possível carregar seu perfil.
      </main>
    );
  }

  const earned = new Set(state.achievementCodes);

  return (
    <div>
      <header className="border-b border-border bg-card">
        <div className="container-app py-5">
          <h1 className="text-2xl font-extrabold">
            {state.profile.displayName || "Seu perfil"}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-ink">
              <Star className="h-4 w-4 text-gold-500" aria-hidden /> Nível {levelForXp(state.totalXp)} · {state.totalXp} XP
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-ink">
              <Flame className="h-4 w-4 text-gold-500" aria-hidden /> {state.currentStreak} dia(s) · recorde {state.bestStreak}
            </span>
          </div>
        </div>
      </header>

      <main className="container-app flex flex-col gap-5 py-6">
        {/* Plan */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden /> Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.plan === "premium" ? (
              <div>
                <Badge tone="premium">Premium ativo</Badge>
                {state.subscription.accessUntil && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Acesso pago até{" "}
                    {new Date(state.subscription.accessUntil).toLocaleDateString("pt-BR")}.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Badge tone="muted">Gratuito</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você tem acesso às 3 primeiras lições da trilha inicial.
                </p>
                <Link
                  href="/assinar"
                  className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white"
                >
                  Conhecer o Premium
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily goal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Meta diária</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalForm current={state.profile.dailyGoal} />
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold-500" aria-hidden /> Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {ACHIEVEMENTS.map((a) => {
                const has = earned.has(a.code);
                return (
                  <li
                    key={a.code}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${
                      has ? "border-gold/40 bg-gold/10" : "border-border opacity-60"
                    }`}
                  >
                    <Trophy
                      className={`h-5 w-5 shrink-0 ${has ? "text-gold-500" : "text-muted-foreground"}`}
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-bold">{ACHIEVEMENT_BY_CODE[a.code].title}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesForm
              displayName={state.profile.displayName}
              timezone={state.profile.timezone}
              reduceMotion={state.profile.reduceMotion}
              soundEnabled={state.profile.soundEnabled}
            />
          </CardContent>
        </Card>

        {state.profile.role === "admin" && (
          <Link
            href="/admin"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-50 px-5 font-semibold text-brand-700"
          >
            Abrir painel administrativo
          </Link>
        )}

        <LogoutButton />
      </main>
    </div>
  );
}
