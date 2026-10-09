"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import {
  recordAnswer,
  completeLesson,
  type GradeResult,
  type CompletionOutcome,
} from "@/lib/progress/engine";
import { answerSchema, reportSchema } from "@/lib/validation";

export async function gradeQuestionAction(input: {
  sessionId: string;
  questionId: string;
  optionId: string;
}): Promise<GradeResult> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado.");
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos.");
  return recordAnswer(user.id, parsed.data.sessionId, parsed.data.questionId, parsed.data.optionId);
}

export async function completeLessonAction(
  sessionId: string,
): Promise<CompletionOutcome> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado.");
  const outcome = await completeLesson(user.id, sessionId);
  revalidatePath("/aprender");
  revalidatePath("/revisar");
  revalidatePath("/perfil");
  return outcome;
}

export async function reportProblemAction(input: {
  lessonId: string;
  questionId?: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Não autenticado." };
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const db = getAdminSupabase();
  if (!db) return { ok: false, error: "Indisponível no momento." };
  const { error } = await db.from("content_reports").insert({
    user_id: user.id,
    lesson_id: parsed.data.lessonId,
    question_id: parsed.data.questionId ?? null,
    message: parsed.data.message,
  });
  if (error) return { ok: false, error: "Não foi possível enviar o relato." };
  return { ok: true };
}
