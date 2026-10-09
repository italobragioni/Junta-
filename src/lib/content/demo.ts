import type { Lesson } from "./types";
import { trailA } from "./trails/trail-a";

/**
 * The public demonstration lesson (no signup). It reuses the published,
 * source-verified lesson A1.
 *
 * The demo is an ISOLATED taste: it stores nothing, grants no XP and never
 * touches the production database. Because there is no account and no reward
 * to protect, the demo grades in the browser. The real, authenticated lesson
 * engine always grades on the server against keys the client never sees.
 */
export const DEMO_LESSON: Lesson = trailA.lessons[0];

export const DEMO_NOTICE =
  "Demonstração: esta é uma amostra do Civio. Nada é salvo e você não ganha XP. Crie uma conta para registrar seu progresso.";
