import "server-only";

import { requireAdminSupabase } from "@/lib/supabase/admin";
import { effectivePlan, type SubscriptionState } from "@/lib/plans/access";
import type { Plan } from "@/lib/content/types";

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: "learner" | "admin";
  plan: Plan;
  accessUntil: string | null;
  revoked: boolean;
  createdAt: string;
}

/**
 * List all registered users with their effective plan. Combines Supabase Auth
 * (emails) with the profiles and subscriptions tables. Service-role only;
 * callers must already be verified admins.
 */
export async function listAdminUsers(): Promise<AdminUser[]> {
  const db = requireAdminSupabase();

  // 1. All auth users (paginated; cap to keep it simple for now).
  const authUsers: { id: string; email: string; createdAt: string }[] = [];
  const perPage = 200;
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage });
    if (error) break;
    const batch = data?.users ?? [];
    for (const u of batch) {
      authUsers.push({
        id: u.id,
        email: u.email ?? "(sem e-mail)",
        createdAt: u.created_at ?? "",
      });
    }
    if (batch.length < perPage) break;
  }

  const ids = authUsers.map((u) => u.id);
  if (ids.length === 0) return [];

  // 2. Profiles and subscriptions in bulk.
  const [{ data: profiles }, { data: subs }] = await Promise.all([
    db.from("profiles").select("id, display_name, role").in("id", ids),
    db.from("subscriptions").select("user_id, access_until, revoked").in("user_id", ids),
  ]);

  const profileById = new Map(
    (profiles ?? []).map((p) => [p.id as string, p]),
  );
  const subById = new Map((subs ?? []).map((s) => [s.user_id as string, s]));

  return authUsers
    .map((u) => {
      const p = profileById.get(u.id);
      const s = subById.get(u.id);
      const subscription: SubscriptionState = {
        accessUntil: (s?.access_until as string) ?? null,
        revoked: Boolean(s?.revoked),
      };
      return {
        id: u.id,
        email: u.email,
        displayName: (p?.display_name as string) ?? "",
        role: ((p?.role as string) ?? "learner") as "learner" | "admin",
        plan: effectivePlan(subscription),
        accessUntil: subscription.accessUntil,
        revoked: subscription.revoked,
        createdAt: u.createdAt,
      };
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
}
