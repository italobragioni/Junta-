import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { findLessonById } from "@/lib/content";
import { toClientQuestion } from "@/lib/content/sanitize";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { startOrGetSession } from "@/lib/progress/engine";
import { LessonRunner } from "../../licao/[lessonId]/lesson-runner";

export default async function ReviewLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = findLessonById(lessonId);
  if (!lesson) notFound();

  const user = await getCurrentUser();
  const supabase = await getServerSupabase();
  if (!user || !supabase) notFound();

  const { data: reviewRows } = await supabase
    .from("review_items")
    .select("question_id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);

  const wrongIds = new Set((reviewRows ?? []).map((r) => r.question_id as string));
  const questions = lesson.questions.filter((q) => wrongIds.has(q.id));

  const Header = (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/revisar" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Revisar
        </Link>
        <Logo showWordmark={false} />
        <span className="w-16" />
      </div>
    </header>
  );

  if (questions.length === 0) {
    return (
      <div className="min-h-dvh">
        {Header}
        <main className="container-app py-10 text-center text-muted-foreground">
          <p>Não há questões para revisar nesta lição.</p>
          <Link href="/revisar" className="mt-4 inline-block font-semibold text-brand-700 underline">
            Voltar
          </Link>
        </main>
      </div>
    );
  }

  if (!getAdminSupabase()) notFound();
  const sessionId = await startOrGetSession(user.id, lesson.id, true);

  return (
    <div className="min-h-dvh">
      {Header}
      <main className="container-app py-6">
        <h1 className="mb-1 text-2xl font-extrabold">Revisão: {lesson.title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Responda novamente as questões que você errou. Esta revisão não gera XP
          de primeira conclusão.
        </p>
        <LessonRunner
          lessonId={lesson.id}
          sessionId={sessionId}
          teaching={[]}
          questions={questions.map(toClientQuestion)}
          sources={lesson.sources}
          isReview
        />
      </main>
    </div>
  );
}
