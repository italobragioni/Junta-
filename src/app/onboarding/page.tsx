import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Logo } from "@/components/brand/logo";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Vamos começar" };

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.onboardedAt) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-brand-50/60 to-background">
      <header className="container-app flex h-16 items-center">
        <Logo />
      </header>
      <main className="container-app flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Olá, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="mt-2 text-muted-foreground">
              Vamos configurar rapidinho para descobrir quanto você consegue
              juntar.
            </p>
          </div>
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}
