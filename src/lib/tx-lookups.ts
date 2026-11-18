import type { Category, Account, CreditCard } from "@/lib/db/types";

/**
 * Mapas de consulta (id → entidade) usados para exibir lançamentos.
 *
 * Fica em um módulo NEUTRO (sem "use client") porque é chamado tanto no
 * servidor (páginas) quanto no cliente (componentes). Funções utilitárias
 * definidas em arquivos "use client" não podem ser invocadas pelo servidor.
 */
export interface TxLookups {
  categories: Map<string, Category>;
  accounts: Map<string, Account>;
  cards: Map<string, CreditCard>;
}

export function buildLookups(
  categories: Category[],
  accounts: Account[],
  cards: CreditCard[],
): TxLookups {
  return {
    categories: new Map(categories.map((c) => [c.id, c])),
    accounts: new Map(accounts.map((a) => [a.id, a])),
    cards: new Map(cards.map((c) => [c.id, c])),
  };
}
