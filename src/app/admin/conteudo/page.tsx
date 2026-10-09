import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAdminSupabase } from "@/lib/supabase/admin";
import { TRAILS } from "@/lib/content";
import { StatusControls } from "./status-controls";

export const metadata = { title: "Conteúdo" };

type Status = "rascunho" | "em_revisao" | "publicado" | "arquivado";

const STATUS_TONE: Record<Status, "success" | "amber" | "muted"> = {
  publicado: "success",
  em_revisao: "amber",
  rascunho: "muted",
  arquivado: "muted",
};

export default async function AdminContentPage() {
  const db = requireAdminSupabase();
  const { data: lessons } = await db
    .from("lessons")
    .select("id, title, objective, status, plan, path_id, order")
    .order("order", { ascending: true });

  const rows = lessons ?? [];
  const synced = rows.length > 0;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold">Conteúdo</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Gerencie o status editorial. Conteúdo criado nunca é publicado
        automaticamente — publicar é uma ação explícita, com validação.
      </p>

      {!synced ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Nenhuma lição no banco ainda. Volte ao painel e clique em
          “Sincronizar conteúdo”.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {TRAILS.map((trail) => {
            const trailLessons = rows.filter((l) => l.path_id === trail.id);
            if (trailLessons.length === 0) return null;
            return (
              <section key={trail.id}>
                <h2 className="mb-2 text-lg font-bold">{trail.title}</h2>
                <ul className="flex flex-col gap-3">
                  {trailLessons.map((l) => {
                    const status = l.status as Status;
                    return (
                      <li key={l.id}>
                        <Card>
                          <CardContent className="pt-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-bold leading-snug">
                                  {l.order}. {l.title}
                                </p>
                                <p className="text-sm text-muted-foreground">{l.objective}</p>
                              </div>
                              <div className="flex shrink-0 flex-col items-end gap-1">
                                <Badge tone={STATUS_TONE[status]}>{status}</Badge>
                                <Badge tone={l.plan === "premium" ? "premium" : "brand"}>
                                  {l.plan}
                                </Badge>
                              </div>
                            </div>
                            <StatusControls lessonId={l.id} current={status} />
                            {status === "publicado" && (
                              <Link
                                href={`/licao/${l.id}`}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 underline"
                              >
                                <ExternalLink className="h-3 w-3" aria-hidden /> Pré-visualizar como aluno
                              </Link>
                            )}
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
