import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Criar sua conta</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Comece grátis. Leva menos de um minuto.
      </p>
      <div className="mt-6">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-brand-700 underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
