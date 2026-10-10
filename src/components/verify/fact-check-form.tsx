"use client";

import * as React from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { checkNewsAction, type CheckNewsResult } from "@/app/(app)/verificar/actions";
import type { RiskLevel, VerifyResult } from "@/lib/verify/types";

const RISK: Record<
  RiskLevel,
  { label: string; icon: typeof ShieldCheck; box: string; chip: string }
> = {
  baixo: {
    label: "Risco baixo",
    icon: ShieldCheck,
    box: "border-emerald-200 bg-emerald-50",
    chip: "bg-emerald-600 text-white",
  },
  atencao: {
    label: "Atenção",
    icon: AlertTriangle,
    box: "border-amber-200 bg-amber-50",
    chip: "bg-amber-500 text-white",
  },
  alto: {
    label: "Alto risco",
    icon: AlertOctagon,
    box: "border-red-200 bg-red-50",
    chip: "bg-red-600 text-white",
  },
};

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/** Downscale + re-encode an image file to a compact JPEG data URL. */
async function fileToDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
    reader.readAsDataURL(file);
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Imagem inválida."));
      el.src = dataUrl;
    });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } catch {
    return dataUrl; // fall back to the original if canvas fails
  }
}

export function FactCheckForm({
  initialRemaining,
  limit,
}: {
  initialRemaining: number;
  limit: number;
}) {
  const [text, setText] = React.useState("");
  const [imageDataUrl, setImageDataUrl] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<VerifyResult | null>(null);
  const [remaining, setRemaining] = React.useState(initialRemaining);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (file.size > 12 * 1024 * 1024) {
      setError("Imagem muito grande. Escolha uma menor que 12 MB.");
      return;
    }
    try {
      setImageDataUrl(await fileToDataUrl(file));
    } catch {
      setError("Não foi possível processar essa imagem.");
    }
  }

  function clearImage() {
    setImageDataUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setResult(null);

    if (!text.trim() && !imageDataUrl) {
      setError("Cole um texto/link ou envie uma imagem.");
      return;
    }

    setPending(true);
    try {
      const res: CheckNewsResult = await checkNewsAction({
        text: text.trim() || undefined,
        imageDataUrl: imageDataUrl ?? undefined,
      });
      if (res.ok) {
        setResult(res.result);
        setRemaining(res.usage.remaining);
      } else {
        setError(res.error);
        if (res.usage) setRemaining(res.usage.remaining);
      }
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="news-text" className="mb-1.5 block text-sm font-semibold">
            Cole a notícia ou o link
          </label>
          <textarea
            id="news-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Cole aqui a mensagem, a manchete ou o link que você recebeu…"
            className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold">
            Ou envie um print / foto{" "}
            <span className="font-normal text-muted-foreground">(opcional)</span>
          </span>
          {imageDataUrl ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageDataUrl}
                alt="Imagem selecionada"
                className="max-h-48 rounded-xl border border-border object-contain"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remover imagem"
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-muted/40 px-4 text-sm font-semibold text-muted-foreground hover:bg-muted"
            >
              <ImageIcon className="h-5 w-5" aria-hidden /> Escolher imagem
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Analisando…
            </>
          ) : (
            <>
              <SearchCheck className="h-5 w-5" aria-hidden /> Verificar
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {remaining} de {limit} verificações restantes hoje
        </p>
      </form>

      {result && <ResultView result={result} />}
    </div>
  );
}

function ResultView({ result }: { result: VerifyResult }) {
  const risk = RISK[result.riskLevel];
  const RiskIcon = risk.icon;
  return (
    <section aria-label="Resultado da verificação" className="flex flex-col gap-4">
      <div className={cn("rounded-2xl border p-5", risk.box)}>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold",
            risk.chip,
          )}
        >
          <RiskIcon className="h-4 w-4" aria-hidden /> {risk.label}
        </span>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{result.summary}</p>
      </div>

      {result.signals.length > 0 && (
        <Block title="Sinais de alerta" tone="warn">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.signals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Block>
      )}

      {result.positives.length > 0 && (
        <Block title="Pontos a favor" tone="ok">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.positives.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Block>
      )}

      {result.claims.length > 0 && (
        <Block title="Afirmações para checar">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.claims.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Block>
      )}

      {result.checkSteps.length > 0 && (
        <Block title="Como confirmar por conta própria">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {result.checkSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </Block>
      )}

      <Block title="Agências de checagem">
        <div className="flex flex-wrap gap-2">
          {result.checkers.map((c) => (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-muted"
            >
              {c.name}
            </a>
          ))}
        </div>
      </Block>

      <p className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {result.disclaimer}
      </p>
    </section>
  );
}

function Block({
  title,
  tone,
  children,
}: {
  title: string;
  tone?: "warn" | "ok";
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3
          className={cn(
            "mb-2 text-sm font-bold",
            tone === "warn" && "text-red-700",
            tone === "ok" && "text-emerald-700",
          )}
        >
          {title}
        </h3>
        {children}
      </CardContent>
    </Card>
  );
}
