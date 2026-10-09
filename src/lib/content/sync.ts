import "server-only";

import { requireAdminSupabase } from "@/lib/supabase/admin";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { TRAILS } from "./index";
import type { Source } from "./types";

/**
 * Idempotently sync the in-repo content (the editorial source of truth) into
 * the database so the app can enforce RLS/premium gating and the admin panel
 * can edit it. Uses the service role.
 *
 * User data is never touched: learning_paths/lessons/sources are UPSERTED (so
 * completions and sessions that reference a lesson survive), while the
 * versioned content tables (which carry no user foreign keys) are rebuilt.
 *
 * Content-creation rule: lessons keep whatever editorial status they carry in
 * code. Nothing here auto-publishes admin-created content; publishing is an
 * explicit admin action elsewhere.
 */
export async function syncContent(): Promise<{ lessons: number; questions: number }> {
  const db = requireAdminSupabase();

  // 1. Achievements
  await db.from("achievements").upsert(
    ACHIEVEMENTS.map((a) => ({ code: a.code, title: a.title, description: a.description })),
    { onConflict: "code" },
  );

  // 2. Trails
  await db.from("learning_paths").upsert(
    TRAILS.map((t) => ({
      id: t.id,
      slug: t.slug,
      order: t.order,
      title: t.title,
      description: t.description,
    })),
    { onConflict: "id" },
  );

  // 3. Sources (deduped by id across all trails)
  const sourceMap = new Map<string, Source>();
  for (const t of TRAILS)
    for (const l of t.lessons) for (const s of l.sources) sourceMap.set(s.id, s);
  await db.from("sources").upsert(
    [...sourceMap.values()].map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      consulted_at: s.consultedAt,
      excerpt: s.excerpt,
      nature: s.nature,
    })),
    { onConflict: "id" },
  );

  let lessonCount = 0;
  let questionCount = 0;

  for (const t of TRAILS) {
    for (const l of t.lessons) {
      lessonCount++;

      // 4. Lesson (upsert — preserves user rows that reference it)
      await db.from("lessons").upsert(
        {
          id: l.id,
          path_id: t.id,
          slug: l.slug,
          order: l.order,
          title: l.title,
          objective: l.objective,
          plan: l.plan,
          status: l.status,
          version: l.version,
          revised_at: l.revisedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      // 5. Lesson <-> source links (rebuild)
      await db.from("lesson_sources").delete().eq("lesson_id", l.id);
      if (l.sources.length) {
        await db.from("lesson_sources").insert(
          l.sources.map((s) => ({ lesson_id: l.id, source_id: s.id })),
        );
      }

      // 6. Versioned content (rebuild — no user FKs point here)
      await db.from("question_versions").delete().eq("lesson_id", l.id);
      await db.from("lesson_versions").delete().eq("lesson_id", l.id);

      await db.from("lesson_versions").insert({
        lesson_id: l.id,
        version: l.version,
        title: l.title,
        objective: l.objective,
        teaching: l.teaching,
      });

      const { data: insertedQuestions, error: qErr } = await db
        .from("question_versions")
        .insert(
          l.questions.map((q, idx) => ({
            lesson_id: l.id,
            lesson_version: l.version,
            question_id: q.id,
            kind: q.kind,
            objective: q.objective,
            prompt: q.prompt,
            explanation: q.explanation,
            source_ids: q.sourceIds,
            order: idx + 1,
          })),
        )
        .select("id, question_id");
      if (qErr) throw qErr;

      const idByQuestion = new Map(
        (insertedQuestions ?? []).map((r) => [r.question_id as string, r.id as string]),
      );

      const optionRows: {
        question_version_id: string;
        option_id: string;
        text: string;
        order: number;
      }[] = [];
      const keyRows: { question_version_id: string; correct_option_id: string }[] = [];
      for (const q of l.questions) {
        questionCount++;
        const qvId = idByQuestion.get(q.id);
        if (!qvId) continue;
        q.options.forEach((o, idx) =>
          optionRows.push({
            question_version_id: qvId,
            option_id: o.id,
            text: o.text,
            order: idx + 1,
          }),
        );
        keyRows.push({ question_version_id: qvId, correct_option_id: q.correctOptionId });
      }
      if (optionRows.length) await db.from("question_options").insert(optionRows);
      if (keyRows.length) await db.from("answer_keys").insert(keyRows);
    }
  }

  return { lessons: lessonCount, questions: questionCount };
}
