import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/billing/stripe";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Pagamentos não estão configurados neste ambiente." },
      { status: 503 },
    );
  }

  const sub = await prisma.planSubscription.findUnique({
    where: { userId: user.id },
    select: { providerCustomerId: true },
  });
  if (!sub?.providerCustomerId) {
    return NextResponse.json(
      { error: "Nenhuma assinatura encontrada para gerenciar." },
      { status: 400 },
    );
  }

  const origin = new URL(req.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.providerCustomerId,
    return_url: `${origin}/configuracoes/assinatura`,
  });

  return NextResponse.json({ url: session.url });
}
