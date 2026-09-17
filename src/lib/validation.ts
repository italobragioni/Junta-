import { z } from "zod";
import { parseToCents } from "@/lib/money";

/** A currency field: accepts strings/numbers, outputs positive integer cents. */
export const centsFromInput = z
  .union([z.string(), z.number()])
  .transform((val, ctx) => {
    const cents = parseToCents(val);
    if (cents === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valor inválido." });
      return z.NEVER;
    }
    return cents;
  })
  .pipe(
    z
      .number()
      .int()
      .positive("O valor deve ser maior que zero.")
      .max(1_000_000_000_00, "Valor muito alto."),
  );

/** Cents that may be zero (e.g. goal current amount, budget can be 0? keep >0). */
export const centsNonNegative = z
  .union([z.string(), z.number()])
  .transform((val, ctx) => {
    const cents = parseToCents(val);
    if (cents === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valor inválido." });
      return z.NEVER;
    }
    return cents;
  })
  .pipe(z.number().int().min(0).max(1_000_000_000_00, "Valor muito alto."));

export const dateFromInput = z
  .string()
  .min(1, "Informe a data.")
  .refine((v) => !Number.isNaN(new Date(v).getTime()), "Data inválida.");

// ---- Auth ----

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z
    .string()
    .min(8, "A senha deve ter ao menos 8 caracteres.")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

// ---- Onboarding ----

export const onboardingSchema = z.object({
  monthlyIncome: centsFromInput,
  incomeFrequency: z.enum(["MONTHLY", "WEEKLY", "BIWEEKLY", "OTHER"]),
  primaryGoal: z.string().trim().min(1, "Selecione um objetivo.").max(120),
});

// ---- Income ----

export const incomeSchema = z.object({
  description: z.string().trim().min(1, "Informe a descrição.").max(120),
  amount: centsFromInput,
  category: z.string().trim().max(60).optional().or(z.literal("")),
  date: dateFromInput,
  recurring: z.coerce.boolean().optional().default(false),
});

// ---- Expense ----

export const expenseSchema = z.object({
  description: z.string().trim().min(1, "Informe a descrição.").max(120),
  amount: centsFromInput,
  categoryId: z.string().trim().min(1, "Selecione uma categoria.").max(40),
  date: dateFromInput,
  recurring: z.coerce.boolean().optional().default(false),
});

// ---- Category ----

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(40),
  type: z.enum(["INCOME", "EXPENSE"]),
});

// ---- Goal ----

export const goalSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da meta.").max(80),
  targetAmount: centsFromInput,
  currentAmount: centsNonNegative.optional(),
  targetDate: z.string().optional().or(z.literal("")),
});

export const addToGoalSchema = z.object({
  goalId: z.string().min(1),
  amount: centsFromInput,
});

// ---- Budget ----

export const budgetSchema = z.object({
  categoryId: z.string().trim().min(1, "Selecione uma categoria.").max(40),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  limitAmount: centsFromInput,
});

// ---- Subscription ----

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(80),
  amount: centsFromInput,
  billingCycle: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  nextBillingDate: z.string().optional().or(z.literal("")),
  active: z.coerce.boolean().optional().default(true),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
