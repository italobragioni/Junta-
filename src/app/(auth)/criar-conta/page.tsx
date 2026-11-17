import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold tracking-tight">Crie sua conta grátis</h1>
      <p className="mt-1.5 text-muted-foreground">
        Leva menos de um minuto para começar a organizar seu dinheiro.
      </p>
      <div className="mt-6">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
