import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">Bem-vindo de volta.</p>
      {sp.erro === "link" && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          O link usado é inválido ou expirou. Tente novamente.
        </p>
      )}
      <div className="mt-6">
        <LoginForm next={sp.next} />
      </div>
      <div className="mt-6 flex flex-col gap-2 text-center text-sm text-muted-foreground">
        <Link href="/recuperar-senha" className="font-semibold text-brand-700 underline">
          Esqueci minha senha
        </Link>
        <span>
          Não tem conta?{" "}
          <Link href="/criar-conta" className="font-semibold text-brand-700 underline">
            Criar conta
          </Link>
        </span>
      </div>
    </div>
  );
}
