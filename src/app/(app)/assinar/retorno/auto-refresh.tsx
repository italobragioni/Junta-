"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * While the payment is still being confirmed, re-fetch the server component
 * every few seconds so the page flips to "Premium ativado" on its own as soon
 * as the provider webhook grants access — no manual reload. Stops once access
 * is granted or after a couple of minutes (webhooks usually land in seconds).
 */
export function AutoRefresh({ done }: { done: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => router.refresh(), 4000);
    const stop = setTimeout(() => clearInterval(interval), 120_000);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [done, router]);
  return null;
}
