import { z } from "zod";

/** Input validation (always on the server). */

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail.")
  .email("E-mail inválido.");

export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter ao menos 8 caracteres.")
  .max(72, "A senha é muito longa.");

export const signupSchema = z.object({
  displayName: z.string().trim().min(1, "Informe seu nome.").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
});

export const resetRequestSchema = z.object({ email: emailSchema });

export const newPasswordSchema = z.object({ password: passwordSchema });

export const dailyGoalSchema = z.object({
  dailyGoal: z.coerce.number().int().refine((n) => n === 1 || n === 2, {
    message: "A meta diária deve ser 1 ou 2 lições.",
  }),
});

export const preferencesSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  timezone: z.string().trim().min(1).max(64),
  reduceMotion: z.boolean(),
  soundEnabled: z.boolean(),
});

export const answerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().min(1).max(64),
  optionId: z.string().min(1).max(64),
});

export const reportSchema = z.object({
  lessonId: z.string().min(1).max(64),
  questionId: z.string().max(64).optional(),
  message: z.string().trim().min(5, "Descreva o problema.").max(1000),
});

/** Admin: edit lesson editorial fields. */
export const lessonEditSchema = z.object({
  lessonId: z.string().min(1).max(64),
  title: z.string().trim().min(1).max(200),
  objective: z.string().trim().min(1).max(500),
  status: z.enum(["rascunho", "em_revisao", "publicado", "arquivado"]),
});
