import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { findLessonById, prerequisiteLesson } from "@/lib/content";
import { toClientQuestion } from "@/lib/content/sanitize";
import { getCurrentUser } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getUserState } from "@/lib/progress/read";
import { lessonAccess } from "@/lib/plans/access";
import { startOrGetSession } from "@/lib/progress/engine";
import { LessonRunner } from "./lesson-runner";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = findLessonById(lessonId);
  if (!lesson || lesson.status !== "publicado") notFound();

  const user = await getCurrentUser();
  if (!user) notFound();

  const state = await getUserState();
  const completed = new Set(state?.completedLessonIds ?? []);
  const prereq = prerequisiteLesson(lesson.id);
  const access = lessonAccess({
    lessonStatus: lesson.status,
    lessonPlan: lesson.plan,
    userPlan: state?.plan ?? "free",
    prerequisiteMet: !prereq || completed.has(prereq.id),
  });

  const Header = (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/aprender" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Trilhas
        </Link>
        <Logo showWordmark={false} />
        <span className="w-16" />
      </div>
    </header>
  );

  if (!access.allowed) {
    return (
      <div className="min-h-dvh">
        {Header}
        <main className="container-app py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" aria-hidden />
          </div>
          <h1 className="text-xl font-extrabold">{lesson.title}</h1>
          {access.reason === "plan" ? (
            <>
              <p className="mt-2 text-muted-foreground">
                Esta lição faz parte do plano Premium.
              </p>
              <Link
                href="/assinar"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-600 px-5 font-semibold text-white"
              >
                Conhecer o Premium
              </Link>
            </>
          ) : (
            <p className="mt-2 text-muted-foreground">
              Conclua a lição anterior para desbloquear esta.
            </p>
          )}
        </main>
      </div>
    );
  }

  // Service role is required to run the engine (start a session, grade).
  if (!getAdminSupabase()) {
    return (
      <div className="min-h-dvh">
        {Header}
        <main className="container-app py-10 text-center text-muted-foreground">
          <p>
            O motor de lições requer configuração do servidor
            (SUPABASE_SERVICE_ROLE_KEY). Consulte o README.
          </p>
        </main>
      </div>
    );
  }

  const sessionId = await startOrGetSession(user.id, lesson.id, false);

  return (
    <div className="min-h-dvh">
      {Header}
      <main className="container-app py-6">
        <h1 className="mb-1 text-2xl font-extrabold">{lesson.title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{lesson.objective}</p>
        <LessonRunner
          lessonId={lesson.id}
          sessionId={sessionId}
          teaching={lesson.teaching}
          questions={lesson.questions.map(toClientQuestion)}
          sources={lesson.sources}
          isReview={false}
        />
      </main>
    </div>
  );
}
