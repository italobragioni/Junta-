import { z } from "zod";

/** Validação de entrada — sempre executada no servidor. */

// --- Autenticação ----------------------------------------------------------
export const emailSchema = z.string().trim().min(1, "Informe seu e-mail.").email("E-mail inválido.");
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

// --- Helpers ---------------------------------------------------------------
const cents = z.coerce.number().int("Valor inválido.");
const positiveCents = cents.min(0, "O valor não pode ser negativo.");
const requiredCents = cents.min(1, "Informe um valor.");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.");
const monthStr = z.string().regex(/^\d{4}-\d{2}$/, "Mês inválido.");
const uuid = z.string().uuid("Seleção inválida.");
const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal("").transform(() => undefined));
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida.").default("#6366f1");

const accountType = z.enum(["checking", "savings", "cash", "wallet", "digital", "investment", "other"]);
const paymentMethod = z.enum(["pix", "debit", "credit", "cash", "boleto", "transfer", "other"]);
const recurrence = z.enum(["none", "daily", "weekly", "monthly", "yearly"]);
const txStatus = z.enum(["pending", "cleared"]);
const debtKind = z.enum(["loan", "financing", "installment", "card", "personal"]);
const patrimonyKind = z.enum(["cash", "property", "vehicle", "investment", "receivable", "other"]);

// --- Perfil / Onboarding ---------------------------------------------------
export const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Informe seu nome.").max(80),
  timezone: z.string().trim().min(1).max(64).default("America/Sao_Paulo"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(1).max(80).optional().or(z.literal("")),
  primaryGoal: z.string().trim().max(120).optional().or(z.literal("")),
  monthlyIncomeCents: positiveCents.default(0),
});

// --- Categorias ------------------------------------------------------------
export const categorySchema = z.object({
  id: optionalUuid,
  name: z.string().trim().min(1, "Informe o nome.").max(60),
  type: z.enum(["income", "expense"]),
  color,
  icon: z.string().trim().min(1).max(40).default("tag"),
});

// --- Contas ----------------------------------------------------------------
export const accountSchema = z.object({
  id: optionalUuid,
  name: z.string().trim().min(1, "Informe o nome da conta.").max(60),
  type: accountType,
  institution: z.string().trim().max(60).optional().or(z.literal("")),
  color,
  openingBalanceCents: cents.default(0),
  includeInTotal: z.coerce.boolean().default(true),
});

export const transferSchema = z
  .object({
    fromAccountId: uuid,
    toAccountId: uuid,
    amountCents: requiredCents,
    occurredOn: dateStr,
    description: z.string().trim().max(120).optional().or(z.literal("")),
  })
  .refine((d) => d.fromAccountId !== d.toAccountId, {
    message: "Escolha contas diferentes.",
    path: ["toAccountId"],
  });

// --- Cartões ---------------------------------------------------------------
export const cardSchema = z.object({
  id: optionalUuid,
  name: z.string().trim().min(1, "Informe o nome do cartão.").max(60),
  brand: z.string().trim().max(40).optional().or(z.literal("")),
  color,
  limitCents: positiveCents.default(0),
  closingDay: z.coerce.number().int().min(1).max(31),
  dueDay: z.coerce.number().int().min(1).max(31),
});

// --- Lançamentos (receita/despesa/compra de cartão) ------------------------
export const transactionSchema = z.object({
  id: optionalUuid,
  kind: z.enum(["income", "expense", "card_expense"]),
  description: z.string().trim().min(1, "Descreva o lançamento.").max(120),
  amountCents: requiredCents,
  categoryId: optionalUuid,
  accountId: optionalUuid,
  cardId: optionalUuid,
  paymentMethod: paymentMethod.optional(),
  occurredOn: dateStr,
  status: txStatus.default("cleared"),
  installments: z.coerce.number().int().min(1).max(60).default(1),
  recurring: recurrence.default("none"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const cardPaymentSchema = z.object({
  cardId: uuid,
  accountId: uuid,
  invoicePeriod: monthStr,
  amountCents: requiredCents,
  occurredOn: dateStr,
});

// --- Orçamentos ------------------------------------------------------------
export const budgetSchema = z.object({
  categoryId: uuid,
  month: monthStr,
  limitCents: requiredCents,
});

// --- Metas -----------------------------------------------------------------
export const goalSchema = z.object({
  id: optionalUuid,
  name: z.string().trim().min(1, "Informe o nome da meta.").max(80),
  targetCents: requiredCents,
  color,
  deadline: dateStr.optional().or(z.literal("").transform(() => undefined)),
});
export const contributionSchema = z.object({
  goalId: uuid,
  amountCents: requiredCents,
  contributedOn: dateStr,
  notes: z.string().trim().max(200).optional().or(z.literal("")),
});

// --- Contas a pagar / receber ----------------------------------------------
export const billSchema = z.object({
  id: optionalUuid,
  kind: z.enum(["payable", "receivable"]),
  description: z.string().trim().min(1, "Descreva a conta.").max(120),
  amountCents: requiredCents,
  dueDate: dateStr,
  categoryId: optionalUuid,
  accountId: optionalUuid,
  frequency: recurrence.default("none"),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
});

export const payBillSchema = z.object({
  billId: uuid,
  accountId: optionalUuid,
  paidOn: dateStr,
});

// --- Dívidas ---------------------------------------------------------------
export const debtSchema = z.object({
  id: optionalUuid,
  name: z.string().trim().min(1, "Informe o nome da dívida.").max(80),
  kind: debtKind,
  creditor: z.string().trim().max(60).optional().or(z.literal("")),
  principalCents: requiredCents,
  balanceCents: positiveCents,
  interestRate: z.coerce.number().min(0).max(100).default(0),
  installmentsTotal: z.coerce.number().int().min(0).max(600).optional(),
  installmentCents: positiveCents.optional(),
  nextDue: dateStr.optional().or(z.literal("").transform(() => undefined)),
});

// --- Patrimônio ------------------------------------------------------------
export const patrimonySchema = z.object({
  id: optionalUuid,
  name: z.string().trim().min(1, "Informe o nome do bem.").max(80),
  kind: patrimonyKind,
  valueCents: requiredCents,
  isLiability: z.coerce.boolean().default(false),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type CardInput = z.infer<typeof cardSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type DebtInput = z.infer<typeof debtSchema>;
