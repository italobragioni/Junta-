import type { Source } from "./types";

/**
 * Shared, reusable sources. Structural/legal questions anchor on the
 * Constitution (planalto, canonical URL). Institutional portals use their
 * official root domains. Interpretive items use a clearly flagged pending
 * marker. All new categories ship as DRAFTS, so the owner verifies and
 * attaches precise deep links / references before publishing.
 */

const CONSULTED = "2026-10-09";
const CF_URL = "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm";

/** Build a Constitution source for a given set of articles. */
export function cf(id: string, articles: string): Source {
  return {
    id: `cf-${id}`,
    title: "Constituição da República Federativa do Brasil de 1988 (texto oficial)",
    url: CF_URL,
    consultedAt: CONSULTED,
    excerpt: articles,
    nature: "fato_institucional",
  };
}

/** Official institutional portal source. */
export function portal(
  id: string,
  title: string,
  url: string,
  excerpt: string,
): Source {
  return { id, title, url, consultedAt: CONSULTED, excerpt, nature: "fato_institucional" };
}

/** Pending interpretive source — replace with an academic reference in review. */
export function pending(id: string, topic: string): Source {
  return {
    id: `pend-${id}`,
    title: `Referência a definir em revisão — ${topic}`,
    url: CF_URL,
    consultedAt: CONSULTED,
    excerpt: `RASCUNHO: conceito interpretativo sobre ${topic}. Substituir por referência adequada (acadêmica ou oficial) antes de publicar; a URL atual é apenas um marcador provisório.`,
    nature: "conceito_interpretativo",
  };
}

// Common institutional portals (official root domains).
export const CAMARA = portal(
  "camara",
  "Câmara dos Deputados — portal oficial",
  "https://www.camara.leg.br",
  "Estrutura e funcionamento da Câmara dos Deputados e do processo legislativo. RASCUNHO: citar a página específica ao publicar.",
);
export const SENADO = portal(
  "senado",
  "Senado Federal — portal oficial",
  "https://www12.senado.leg.br",
  "Estrutura e funcionamento do Senado Federal e do Congresso Nacional. RASCUNHO: citar a página específica ao publicar.",
);
export const TSE = portal(
  "tse",
  "Tribunal Superior Eleitoral — portal oficial",
  "https://www.tse.jus.br",
  "Organização da Justiça Eleitoral, eleições e voto. RASCUNHO: citar a página específica ao publicar.",
);
export const TCU = portal(
  "tcu",
  "Tribunal de Contas da União — portal oficial",
  "https://www.tcu.gov.br",
  "Controle externo e fiscalização de contas públicas. RASCUNHO: citar a página específica ao publicar.",
);
export const IBGE = portal(
  "ibge-geral",
  "IBGE — portal oficial",
  "https://www.ibge.gov.br",
  "Indicadores sociais e econômicos. RASCUNHO: citar a página e o período do dado ao publicar.",
);
export const BCB = portal(
  "bcb-geral",
  "Banco Central do Brasil — portal oficial",
  "https://www.bcb.gov.br",
  "Política monetária, inflação e índices. RASCUNHO: citar a página e o indicador ao publicar.",
);
export const GOVBR = portal(
  "govbr",
  "Portal gov.br — serviços e informações do governo federal",
  "https://www.gov.br",
  "Serviços públicos e informações oficiais do governo federal. RASCUNHO: citar a página específica ao publicar.",
);
