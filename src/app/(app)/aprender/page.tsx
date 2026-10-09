import Link from "next/link";
import { Check, Lock, Play, Flame, Star } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TRAILS, prerequisiteLesson } from "@/lib/content";
import { getUserState } from "@/lib/progress/read";
import { lessonAccess } from "@/lib/plans/access";
import { levelForXp, levelProgress, xpToNextLevel } from "@/lib/gamification/xp";
import { cn } from "@/lib/utils";

export const metadata = { title: "Aprender" };

export default async function LearnPage() {
  const state = await getUserState();
  const plan = state?.plan ?? "free";
  const completed = new Set(state?.completedLessonIds ?? []);
  const xp = state?.totalXp ?? 0;

  return (
    <div>
      {/* Stats header */}
      <header className="border-b border-border bg-card">
        <div className="container-app py-4">
          <div className="mb-3 flex items-center justify-between">
            <Logo size={28} />
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-ink">
                <Flame className="h-4 w-4 text-gold-500" aria-hidden /> {state?.currentStreak ?? 0}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-ink">
                <Star className="h-4 w-4 text-gold-500" aria-hidden /> {xp} XP
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-sm font-semibold">Nível {levelForXp(xp)}</span>
            <ProgressBar
              value={levelProgress(xp) * 100}
              label={`Progresso do nível ${levelForXp(xp)}`}
            />
            <span className="shrink-0 text-xs text-muted-foreground">
              {xpToNextLevel(xp)} XP p/ o próximo
            </span>
          </div>
          {plan === "free" && (
            <p className="mt-3 text-xs text-muted-foreground">
              Plano gratuito.{" "}
              <Link href="/assinar" className="font-semibold text-brand-700 underline">
                Conheça o Premium
              </Link>
            </p>
          )}
        </div>
      </header>

      <main className="container-app py-6">
        <h1 className="sr-only">Trilhas de aprendizado</h1>

        {TRAILS.map((trail) => {
          const publishedCount = trail.lessons.filter((l) => l.status === "publicado").length;
          // Hide trails that have nothing published yet (drafts in preparation),
          // so the learner sees only categories that actually have content.
          if (publishedCount === 0) return null;
          return (
            <section key={trail.id} className="mb-10">
              <div className="mb-3">
                <h2 className="text-xl font-extrabold">{trail.title}</h2>
                <p className="text-sm text-muted-foreground">{trail.description}</p>
              </div>

              <ol className="flex flex-col gap-3" aria-label={`Lições de ${trail.title}`}>
                  {trail.lessons.map((lesson) => {
                    const prereq = prerequisiteLesson(lesson.id);
                    const prerequisiteMet = !prereq || completed.has(prereq.id);
                    const access = lessonAccess({
                      lessonStatus: lesson.status,
                      lessonPlan: lesson.plan,
                      userPlan: plan,
                      prerequisiteMet,
                    });
                    const isDone = completed.has(lesson.id);

                    // Never render unpublished lessons as locked content.
                    if (lesson.status !== "publicado") return null;

                    const node = (
                      <div
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border p-4",
                          isDone && "border-emerald-200 bg-emerald-50",
                          !isDone && access.allowed && "border-brand-200 bg-card",
                          !access.allowed && "border-border bg-muted/50",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                            isDone && "bg-emerald-500 text-white",
                            !isDone && access.allowed && "bg-brand-600 text-white",
                            !access.allowed && "bg-muted text-muted-foreground",
                          )}
                          aria-hidden
                        >
                          {isDone ? (
                            <Check className="h-5 w-5" />
                          ) : access.allowed ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold leading-snug">
                            {lesson.order}. {lesson.title}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {lesson.objective}
                          </p>
                          {!access.allowed && access.reason === "plan" && (
                            <Badge tone="premium" className="mt-1">
                              <Lock className="h-3 w-3" aria-hidden /> Premium
                            </Badge>
                          )}
                          {!access.allowed && access.reason === "prerequisite" && (
                            <Badge tone="muted" className="mt-1">
                              Conclua a lição anterior
                            </Badge>
                          )}
                          {isDone && (
                            <Badge tone="success" className="mt-1">
                              Concluída
                            </Badge>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <li key={lesson.id}>
                        {access.allowed ? (
                          <Link
                            href={`/licao/${lesson.id}`}
                            className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                          >
                            {node}
                          </Link>
                        ) : access.reason === "plan" ? (
                          <Link href="/assinar" className="block rounded-2xl">
                            {node}
                          </Link>
                        ) : (
                          <div aria-disabled>{node}</div>
                        )}
                      </li>
                    );
                  })}
                </ol>
            </section>
          );
        })}
      </main>
    </div>
  );
}
