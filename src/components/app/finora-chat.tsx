"use client";

import * as React from "react";
import { Sparkles, Send, User } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Onde estou gastando mais?",
  "Quanto gastei com alimentação este mês?",
  "Quanto posso gastar até o fim do mês?",
  "Quanto economizei nos últimos meses?",
  "Posso fazer uma compra de R$ 500?",
  "Como posso organizar melhor meu dinheiro?",
];

export function FinoraChat({ aiConfigured }: { aiConfigured: boolean }) {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer ?? data.error ?? "Não consegui responder agora." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Erro de conexão. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-12rem)] max-w-3xl flex-col lg:h-[calc(100dvh-10rem)]">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-white">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Finora IA</h1>
          <p className="text-xs text-muted-foreground">
            {aiConfigured ? "Seu assistente financeiro pessoal" : "Modo básico (sem IA externa) — respostas a partir dos seus dados"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <LogoMark className="h-14 w-14" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Pergunte em português sobre o seu dinheiro. Eu analiso os seus dados reais — e nunca invento números.
            </p>
            <div className="mt-5 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-brand hover:bg-brand/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", m.role === "user" ? "bg-muted text-muted-foreground" : "brand-gradient text-white")}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </span>
                <div className={cn("max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", m.role === "user" ? "bg-brand text-brand-foreground" : "bg-muted text-foreground")}>
                  {renderMarkdownLite(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient text-white"><Sparkles className="h-4 w-4" /></span>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                  <Dot /> <Dot delay="0.2s" /> <Dot delay="0.4s" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-3 flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre o seu dinheiro…"
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Enviar">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: delay }} />;
}

/** Renderiza **negrito** simples sem lib de markdown. */
function renderMarkdownLite(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
  );
}
