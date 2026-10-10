import "server-only";

import { env } from "@/lib/env";

/** One web result from the search backend. */
export interface SearchHit {
  title: string;
  url: string;
  content: string;
}

/** True when a no-billing web-search backend (Tavily) is configured. */
export function hasWebSearch(): boolean {
  return Boolean(env.tavilyApiKey);
}

/**
 * Search the web via Tavily (free tier, no credit card). Returns the top
 * results with short snippets. Throws on failure so the caller can fall back.
 */
export async function tavilySearch(query: string): Promise<SearchHit[]> {
  const key = env.tavilyApiKey;
  if (!key) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: query.slice(0, 400),
        search_depth: "basic",
        max_results: 6,
        include_answer: false,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Busca respondeu ${res.status}: ${body.slice(0, 160)}`);
    }
    const data = (await res.json()) as {
      results?: { title?: string; url?: string; content?: string }[];
    };
    return (data.results ?? [])
      .filter((r) => r.url)
      .map((r) => ({
        title: r.title || r.url!,
        url: r.url!,
        content: r.content || "",
      }));
  } finally {
    clearTimeout(timer);
  }
}
