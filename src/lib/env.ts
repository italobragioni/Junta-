/**
 * Finora — acesso centralizado a variáveis de ambiente.
 *
 * O app roda em dois modos:
 *  - CONFIGURADO: credenciais do Supabase presentes → auth + banco reais.
 *  - DEMONSTRAÇÃO: sem credenciais. O app ainda sobe, mostra a landing page e
 *    uma demonstração clara do produto, sem persistir nada.
 *
 * Segredos (service role, chave de IA) só são lidos no servidor e NUNCA levam
 * o prefixo NEXT_PUBLIC_, então não vazam para o bundle do navegador.
 */

function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  // Supabase (auth + banco). As duas NEXT_PUBLIC_ são públicas por natureza;
  // o RLS é o que protege os dados de cada usuário.
  supabaseUrl: normalizeOrigin(read("NEXT_PUBLIC_SUPABASE_URL")),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  // Somente servidor. Ignora o RLS — usada apenas em código de servidor
  // confiável (ex.: webhooks, operações transacionais sensíveis).
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),

  // URL pública do site (usada em redirects de e-mail de autenticação).
  siteUrl: normalizeSiteUrl(read("NEXT_PUBLIC_SITE_URL")),

  // --- Finora IA (assistente financeiro) ---------------------------------
  // Provedor de IA do servidor. Padrão: Anthropic (Claude). Trocar de provedor
  // é só mudar FINORA_AI_PROVIDER + a chave correspondente.
  aiProvider: (read("FINORA_AI_PROVIDER") ?? "anthropic").toLowerCase(),
  aiApiKey: read("FINORA_AI_API_KEY"),
  aiModel: read("FINORA_AI_MODEL"),

  // --- Cobrança (Cakto) --------------------------------------------------
  // A cobrança só liga quando TODAS estas estiverem presentes (ver
  // isBillingConfigured). Mantém o checkout/webhook desativados por padrão.
  billingEnabled: read("FINORA_BILLING_ENABLED") === "true",
  // Link público do checkout da Cakto (ex.: https://pay.cakto.com.br/xxxxx).
  caktoCheckoutUrl: read("CAKTO_CHECKOUT_URL"),
  // Segredo do webhook (Painel da Cakto > Webhooks). Server-only.
  caktoWebhookSecret: read("CAKTO_WEBHOOK_SECRET"),
  // Preço exibido (em centavos). Padrão: R$ 29,90.
  premiumPriceCents: Number(read("FINORA_PREMIUM_PRICE_CENTS") ?? "2990"),
} as const;

function normalizeSiteUrl(raw: string | undefined): string {
  return normalizeOrigin(raw) ?? "http://localhost:3000";
}

function normalizeOrigin(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(candidate).origin;
  } catch {
    return undefined;
  }
}

/** True quando auth + banco do Supabase estão utilizáveis. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** True apenas no servidor, quando a service-role key também está presente. */
export function hasServiceRole(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

/** True quando a Finora IA tem uma chave de provedor configurada. */
export function isAiConfigured(): boolean {
  return Boolean(env.aiApiKey);
}

/**
 * Cobrança só está "ativa" quando explicitamente habilitada E com o link de
 * checkout, o segredo do webhook e a service-role key presentes. Qualquer peça
 * faltando mantém o checkout/webhook desligados — o padrão seguro.
 */
export function isBillingConfigured(): boolean {
  return Boolean(
    env.billingEnabled &&
      env.caktoCheckoutUrl &&
      env.caktoWebhookSecret &&
      hasServiceRole(),
  );
}

/** Link de checkout da Cakto com um identificador do usuário no callback. */
export function caktoCheckoutFor(userId: string): string | null {
  if (!env.caktoCheckoutUrl) return null;
  try {
    const url = new URL(env.caktoCheckoutUrl);
    // `callback` volta no webhook como data.callback — usamos para casar o
    // pagamento com o usuário (além do e-mail do comprador).
    url.searchParams.set("callback", userId);
    return url.toString();
  } catch {
    return env.caktoCheckoutUrl;
  }
}
