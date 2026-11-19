export type SubscriptionStatus = "free" | "active" | "past_due" | "canceled";

export interface Subscription {
  user_id: string;
  status: SubscriptionStatus;
  plan: string; // 'free' | 'premium'
  cakto_order_id: string | null;
  cakto_subscription_id: string | null;
  cakto_customer_email: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * True quando o usuário tem acesso Premium AGORA. Inclui carência: uma
 * assinatura cancelada ou atrasada ainda dá acesso até o fim do período pago.
 */
export function isPremium(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (sub.plan !== "premium") return false;
  if (sub.status === "active") return true;
  if (sub.status === "canceled" || sub.status === "past_due") {
    return Boolean(sub.current_period_end && new Date(sub.current_period_end) > new Date());
  }
  return false;
}
