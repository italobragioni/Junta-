import type { Metadata } from "next";
import { isAiConfigured } from "@/lib/env";
import { FinoraChat } from "@/components/app/finora-chat";

export const metadata: Metadata = { title: "Finora IA" };
export const dynamic = "force-dynamic";

// O acesso ao app inteiro já é controlado pelo paywall no layout da área
// logada; aqui é só renderizar o chat.
export default function FinoraAiPage() {
  return <FinoraChat aiConfigured={isAiConfigured()} />;
}
