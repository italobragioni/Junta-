"use client";

import * as React from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Quanto gastei esse mês?",
  "Onde estou gastando mais?",
  "Quanto consigo guardar?",
  "Quanto falta para minha meta?",
];

export function Assistant() {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function ask(q: string) {
    if (!q.trim() || loading) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAnswer(
        res.ok ? data.answer : data.error ?? "Não foi possível responder agora.",
      );
    } catch {
      setAnswer("Não foi possível responder agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <MessageCircle className="h-5 w-5 text-brand-600" />
        <CardTitle>Assistente financeiro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex gap-2"
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pergunte sobre suas finanças..."
          />
          <Button type="submit" size="icon" disabled={loading} aria-label="Enviar">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuestion(s);
                ask(s);
              }}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
            >
              {s}
            </button>
          ))}
        </div>

        {answer && (
          <div className="whitespace-pre-line rounded-xl bg-muted/60 p-4 text-sm">
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
