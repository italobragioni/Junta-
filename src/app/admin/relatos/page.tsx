import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAdminSupabase } from "@/lib/supabase/admin";
import { findLessonById } from "@/lib/content";
import { ResolveButton } from "./resolve-button";

export const metadata = { title: "Relatos de erro" };

export default async function AdminReportsPage() {
  const db = requireAdminSupabase();
  const { data: reports } = await db
    .from("content_reports")
    .select("id, lesson_id, question_id, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = reports ?? [];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold">Relatos de erro</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Mensagens enviadas pelos alunos sobre as lições.
      </p>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum relato por enquanto.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => {
            const lesson = findLessonById(r.lesson_id as string);
            return (
              <li key={r.id as string}>
                <Card>
                  <CardContent className="pt-5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-bold">
                        {lesson?.title ?? r.lesson_id}
                        {r.question_id ? ` · questão ${r.question_id}` : ""}
                      </p>
                      <Badge tone={r.status === "aberto" ? "amber" : "success"}>
                        {r.status as string}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/90">{r.message as string}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(r.created_at as string).toLocaleString("pt-BR")}
                    </p>
                    {r.status === "aberto" && (
                      <div className="mt-3">
                        <ResolveButton reportId={r.id as string} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
