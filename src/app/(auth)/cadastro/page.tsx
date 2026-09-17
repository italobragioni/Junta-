import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Crie sua conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comece gratuitamente e descubra para onde vai seu dinheiro.
        </p>
        <div className="mt-6">
          <SignUpForm />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ao criar a conta você concorda com nossos{" "}
          <Link href="/termos" className="underline">
            Termos
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
