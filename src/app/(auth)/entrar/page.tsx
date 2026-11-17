import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
      <p className="mt-1.5 text-muted-foreground">Entre para acessar o seu painel.</p>
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/criar-conta" className="font-semibold text-brand hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
