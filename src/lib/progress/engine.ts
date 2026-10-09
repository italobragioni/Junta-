import "server-only";

import { requireAdminSupabase } from "@/lib/supabase/admin";
import {
  answerKeyFor,
  findLessonById,
  findTrailOfLesson,
} from "@/lib/content";
import { firstCompletionXp } from "@/lib/gamification/xp";
import { applyActivity, localDay, type StreakState } from "@/lib/gamification/streak";
import { allAnswered, canComplete, type QuestionProgress } from "@/lib/lessons/grading";

/**
 * Server-side learning engine. All writes use the service role and are scoped
 * to an already-authenticated userId passed by the caller. Rewards depend on
 * verifiable server events, with unique constraints guarding against
 * double-tap / resubmit / concurrent tabs.
 */

export interface GradeResult {
  correct: boolean;
  correctOptionId: string;
  explanation: string;
}

/** Get the user's in-progress session for a lesson, or start a new one. */
export async function startOrGetSession(
  userId: string,
  lessonId: string,
  isReview = false,
): Promise<string> {
  const db = requireAdminSupabase();
  const lesson = findLessonById(lessonId);
  if (!lesson) throw new Error("Lição não encontrada.");

  const { data: existing } = await db
    .from("lesson_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("is_review", isReview)
    .eq("status", "em_andamento")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data, error } = await db
    .from("lesson_sessions")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      // Pin the version at start — later edits never change this session.
      lesson_version: lesson.version,
      is_review: isReview,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

/**
 * Record an answer. Grading happens here, server-side, against the answer key
 * the client never receives. Only after the attempt is stored is the correct
 * option / explanation returned.
 */
export async function recordAnswer(
  userId: string,
  sessionId: string,
  questionId: string,
  selectedOptionId: string,
): Promise<GradeResult> {
  const db = requireAdminSupabase();

  const { data: session, error: sErr } = await db
    .from("lesson_sessions")
    .select("id, lesson_id, status")
    .eq("id", sessionId)
    .eq("user_id", userId) // ownership check
    .single();
  if (sErr || !session) throw new Error("Sessão inválida.");

  const lessonId = session.lesson_id as string;
  const key = answerKeyFor(lessonId)[questionId];
  const lesson = findLessonById(lessonId);
  const question = lesson?.questions.find((q) => q.id === questionId);
  if (!key || !question) throw new Error("Questão inválida.");

  const correct = key === selectedOptionId;

  // Attempt number for this question within this session.
  const { count } = await db
    .from("responses")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("question_id", questionId);
  const attempt = (count ?? 0) + 1;
  const isFirstAttempt = attempt === 1;

  await db.from("responses").insert({
    session_id: sessionId,
    user_id: userId,
    lesson_id: lessonId,
    question_id: questionId,
    selected_option_id: selectedOptionId,
    correct,
    attempt,
    is_first_attempt: isFirstAttempt,
  });

  // Track review items: first wrong attempt opens an item; a later correct
  // answer marks it reviewed.
  if (isFirstAttempt && !correct) {
    await db
      .from("review_items")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          question_id: questionId,
          reviewed: false,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,question_id" },
      );
  }
  if (correct) {
    await db
      .from("review_items")
      .update({ reviewed: true, last_seen_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("question_id", questionId);
  }

  return { correct, correctOptionId: key, explanation: question.explanation };
}

/**
 * Build per-question progress for a session from its recorded responses.
 * For a full lesson the question set is the whole lesson; for a review session
 * it is only the questions presented in that session (those with responses).
 */
async function sessionProgress(
  userId: string,
  sessionId: string,
  lessonId: string,
  reviewOnly: boolean,
): Promise<QuestionProgress[]> {
  const db = requireAdminSupabase();
  const lesson = findLessonById(lessonId)!;

  const { data: responses } = await db
    .from("responses")
    .select("question_id, correct, attempt, is_first_attempt")
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  const rows = responses ?? [];
  const questionIds = reviewOnly
    ? [...new Set(rows.map((r) => r.question_id as string))]
    : lesson.questions.map((q) => q.id);

  return questionIds.map((qid) => {
    const rs = rows.filter((r) => r.question_id === qid);
    const first = rs.find((r) => r.is_first_attempt);
    return {
      questionId: qid,
      answered: rs.length > 0,
      firstTryCorrect: Boolean(first?.correct),
      everCorrect: rs.some((r) => r.correct),
    };
  });
}

export interface CompletionOutcome {
  completed: boolean;
  firstCompletion: boolean;
  xpAwarded: number;
  newAchievements: string[];
}

/**
 * Complete a lesson session. Idempotent: the first-completion reward is
 * anchored on a unique (user_id, lesson_id) row and an XP ledger keyed by a
 * unique dedupe_key, so repeated calls / double taps never double-award.
 */
export async function completeLesson(
  userId: string,
  sessionId: string,
): Promise<CompletionOutcome> {
  const db = requireAdminSupabase();

  const { data: session, error } = await db
    .from("lesson_sessions")
    .select("id, lesson_id, is_review, status")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();
  if (error || !session) throw new Error("Sessão inválida.");

  const lessonId = session.lesson_id as string;
  const isReview = session.is_review as boolean;
  const progress = await sessionProgress(userId, sessionId, lessonId, isReview);

  // Normal lesson: completes once every question is answered (one pass, errors
  // go to Revisar). Review session: completes only when errors are fixed.
  const done = isReview ? canComplete(progress) : allAnswered(progress);
  if (!done) {
    return { completed: false, firstCompletion: false, xpAwarded: 0, newAchievements: [] };
  }

  await db
    .from("lesson_sessions")
    .update({ status: "concluida", completed_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("status", "em_andamento");

  const firstTryCorrect = progress.filter((p) => p.firstTryCorrect).length;
  let firstCompletion = false;
  let xpAwarded = 0;

  // Review sessions never grant the first-completion reward again.
  if (!isReview) {
    const { data: inserted } = await db
      .from("lesson_completions")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          xp_awarded: firstCompletionXp(firstTryCorrect),
          first_try_correct: firstTryCorrect,
        },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
      )
      .select("lesson_id");

    firstCompletion = Boolean(inserted && inserted.length > 0);
    if (firstCompletion) {
      xpAwarded = firstCompletionXp(firstTryCorrect);
      await db.from("xp_events").upsert(
        {
          user_id: userId,
          kind: "lesson_completion",
          amount: xpAwarded,
          dedupe_key: `completion:${lessonId}`,
        },
        { onConflict: "user_id,dedupe_key", ignoreDuplicates: true },
      );
    }
  }

  // Activity + streak (counts a real completion or review-with-questions).
  await bumpActivityAndStreak(userId);
  // Recompute total XP from the ledger (single source of truth).
  await recomputeTotalXp(userId);
  const newAchievements = await evaluateAchievements(userId);

  return { completed: true, firstCompletion, xpAwarded, newAchievements };
}

async function recomputeTotalXp(userId: string): Promise<void> {
  const db = requireAdminSupabase();
  const { data } = await db.from("xp_events").select("amount").eq("user_id", userId);
  const total = (data ?? []).reduce((acc, r) => acc + (r.amount as number), 0);
  await db.from("user_stats").upsert(
    { user_id: userId, total_xp: total },
    { onConflict: "user_id" },
  );
}

async function bumpActivityAndStreak(userId: string): Promise<void> {
  const db = requireAdminSupabase();
  const { data: profile } = await db
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .maybeSingle();
  const tz = (profile?.timezone as string) || "America/Sao_Paulo";
  const today = localDay(new Date(), tz);

  // One activity row per day. If today is new, advance the streak.
  const { data: insertedDay } = await db
    .from("activity_days")
    .upsert({ user_id: userId, day: today }, { onConflict: "user_id,day", ignoreDuplicates: true })
    .select("day");

  if (!insertedDay || insertedDay.length === 0) return; // already active today

  const { data: stats } = await db
    .from("user_stats")
    .select("current_streak, best_streak, last_active_day")
    .eq("user_id", userId)
    .maybeSingle();

  const prev: StreakState = {
    current: (stats?.current_streak as number) ?? 0,
    best: (stats?.best_streak as number) ?? 0,
    lastActiveDay: (stats?.last_active_day as string) ?? null,
  };
  const next = applyActivity(prev, today);

  await db.from("user_stats").upsert(
    {
      user_id: userId,
      current_streak: next.current,
      best_streak: next.best,
      last_active_day: next.lastActiveDay,
    },
    { onConflict: "user_id" },
  );
}

async function evaluateAchievements(userId: string): Promise<string[]> {
  const db = requireAdminSupabase();
  const earned: string[] = [];

  const [{ count: completionCount }, { data: stats }, { data: completions }] =
    await Promise.all([
      db
        .from("lesson_completions")
        .select("lesson_id", { count: "exact", head: true })
        .eq("user_id", userId),
      db
        .from("user_stats")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      db.from("lesson_completions").select("lesson_id").eq("user_id", userId),
    ]);

  const toAward: string[] = [];
  if ((completionCount ?? 0) >= 1) toAward.push("primeira_licao");
  const streak = (stats?.current_streak as number) ?? 0;
  if (streak >= 3) toAward.push("tres_dias");
  if (streak >= 7) toAward.push("sete_dias");

  // First full trail: all PUBLISHED lessons of some trail completed.
  const done = new Set((completions ?? []).map((c) => c.lesson_id as string));
  for (const lessonId of done) {
    const trail = findTrailOfLesson(lessonId);
    if (!trail) continue;
    const published = trail.lessons.filter((l) => l.status === "publicado");
    if (published.length > 0 && published.every((l) => done.has(l.id))) {
      toAward.push("primeira_trilha");
      break;
    }
  }

  for (const code of toAward) {
    const { data } = await db
      .from("user_achievements")
      .upsert({ user_id: userId, code }, { onConflict: "user_id,code", ignoreDuplicates: true })
      .select("code");
    if (data && data.length > 0) earned.push(code);
  }
  return earned;
}
