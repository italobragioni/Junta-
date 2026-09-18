import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionFromCookie } from "@/lib/session";
import type { PlanId } from "@/lib/plans";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  onboardedAt: Date | null;
  plan: PlanId;
}

/**
 * Returns the authenticated user or null. Cached per-request so multiple
 * server components can call it without extra DB hits.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSessionFromCookie();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, onboardedAt: true, plan: true },
  });

  if (!user) return null;
  return { ...user, plan: user.plan as PlanId };
});

/**
 * Guarantees an authenticated user. Redirects to /login otherwise.
 * Every private page/action should funnel through this so data access is
 * always scoped to a verified user id.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Like requireUser but also enforces that onboarding is complete.
 * Redirects unfinished users to /onboarding.
 */
export async function requireOnboardedUser(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.onboardedAt) redirect("/onboarding");
  return user;
}
