import { NextResponse } from "next/server";
import { authContext, getSubscription } from "@/lib/db/queries";
import { isAdminEmail } from "@/lib/env";
import { isPremium } from "@/lib/billing/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Retorna se o usuário atual tem acesso Premium agora (usado para auto-detecção). */
export async function GET() {
  const ctx = await authContext();
  if (!ctx) return NextResponse.json({ premium: false, authenticated: false });

  if (isAdminEmail(ctx.email)) {
    return NextResponse.json({ premium: true, authenticated: true });
  }

  const sub = await getSubscription();
  return NextResponse.json({ premium: isPremium(sub), authenticated: true });
}
