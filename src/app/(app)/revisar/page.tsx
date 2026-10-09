import Link from "next/link";
import { RefreshCw, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServerSupabase, getCurrentUser } from "@/lib/supabase/server";
import { findLessonById } from "@/lib/content";

export const metadata = { title: "Revisar" };

export default async function ReviewPage() {
  const user = await getCurrentUser();
  const supabase = await getServerSupabase();

  let items: { lesson_id: string; question_id: string; reviewed: boolean }[] = [];
  if (user && supabase) {
    const { data } = await supabase
      .from("review_items")
      .select("lesson_id, question_id, reviewed")
      .eq("user_id", user.id);
    items = data ?? [];
  }

  // Group by lesson.
  const byLesson = new Map<string, { total: number; pending: number }>();
  for (const it of items) {
    const g = byLesson.get(it.lesson_id) ?? { total: 0, pending: 0 };
    g.total += 1;
    if (!it.reviewed) g.pending += 1;
    byLesson.set(it.lesson_id, g);
  }

  const lessons = [...byLesson.entries()]
    .map(([lessonId, counts]) => ({ lesson: findLessonById(lessonId), lessonId, ...counts }))
    .filter((l) => l.lesson);

  return (
    <div>
      <header className="border-b border-border bg-card">
        <div className="container-app py-5">
          <h1 className="text-2xl font-extrabold">Revisar</h1>
          <p className="text-sm text-muted-foreground">
            Volte às questões que você errou — sem pressa e sem punição.
          </p>
        </div>
      </header>

      <main className="container-app py-6">
        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-500" aria-hidden />
            <p>Nada para revisar por enquanto. Continue aprendendo!</p>
            <Link href="/aprender" className="mt-4 inline-block font-semibold text-brand-700 underline">
              Ir para as trilhas
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {lessons.map(({ lesson, lessonId, total, pending }) => (
              <li key={lessonId}>
                <Link href={`/revisar/${lessonId}`} className="block">
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                        <RefreshCw className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug">{lesson!.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {total} {total === 1 ? "questão" : "questões"} para revisar
                        </p>
                      </div>
                      {pending > 0 ? (
                        <Badge tone="amber">{pending} pendente(s)</Badge>
                      ) : (
                        <Badge tone="success">Revisadas</Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
