/** Achievement catalog. Awarded server-side from verified events. */

export interface AchievementDef {
  code: string;
  title: string;
  description: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    code: "primeira_licao",
    title: "Primeira lição",
    description: "Você concluiu sua primeira lição no Civio.",
  },
  {
    code: "tres_dias",
    title: "Três dias seguidos",
    description: "Você estudou três dias seguidos. Consistência!",
  },
  {
    code: "sete_dias",
    title: "Sete dias seguidos",
    description: "Uma semana inteira de aprendizado diário.",
  },
  {
    code: "primeira_trilha",
    title: "Primeira trilha concluída",
    description: "Você concluiu todas as lições publicadas de uma trilha.",
  },
];

export const ACHIEVEMENT_BY_CODE = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.code, a]),
);
