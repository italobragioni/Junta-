import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe, priceIdForPlan } from "@/lib/billing/stripe";

const bodySchema = z.object({
  plan: z.enum(["BASIC", "PRO"]),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }
  const plan = parsed.data.plan;

  const stripe = getStripe();
  const priceId = priceIdForPlan(plan);
  if (!stripe || !priceId) {
    // Payments not configured (e.g. development). The app keeps working.
    return NextResponse.json(
      {
        error:
          "Pagamentos ainda não estão configurados neste ambiente. Tente novamente mais tarde.",
      },
      { status: 503 },
    );
  }

  // Ensure a Stripe customer for this user, reusing one if present.
  const existing = await prisma.planSubscription.findUnique({
    where: { userId: user.id },
    select: { providerCustomerId: true },
  });

  let customerId = existing?.providerCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.planSubscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        provider: "stripe",
        providerCustomerId: customerId,
      },
      update: { provider: "stripe", providerCustomerId: customerId },
    });
  }

  const origin = new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: { metadata: { userId: user.id, plan } },
    metadata: { userId: user.id, plan },
    success_url: `${origin}/configuracoes/assinatura?checkout=success`,
    cancel_url: `${origin}/planos?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
