import type { FactChecker } from "./types";

/**
 * Professional Brazilian fact-checking agencies. The checker always ends by
 * sending the person to these human-run services — the responsible place for
 * a real verdict. Kept as a static, curated list (never provided by the AI).
 */
export const FACT_CHECKERS: FactChecker[] = [
  { name: "Agência Lupa", url: "https://lupa.uol.com.br/" },
  { name: "Aos Fatos", url: "https://www.aosfatos.org/" },
  { name: "Comprova", url: "https://checamos.afp.com/comprova" },
  { name: "Fato ou Fake (G1)", url: "https://g1.globo.com/fato-ou-fake/" },
  { name: "Boatos.org", url: "https://www.boatos.org/" },
  { name: "e-Farsas", url: "https://www.e-farsas.com/" },
];
