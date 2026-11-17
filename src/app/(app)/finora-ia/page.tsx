import type { Metadata } from "next";
import { isAiConfigured } from "@/lib/env";
import { FinoraChat } from "@/components/app/finora-chat";

export const metadata: Metadata = { title: "Finora IA" };
export const dynamic = "force-dynamic";

export default function FinoraAiPage() {
  return <FinoraChat aiConfigured={isAiConfigured()} />;
}
