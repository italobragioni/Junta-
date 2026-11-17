/** Utilidades para "períodos" no formato 'YYYY-MM' (mês de competência). */

export interface YearMonth {
  year: number;
  month: number; // 1..12
}

export function parsePeriod(period: string): YearMonth {
  const [y, m] = period.split("-").map(Number);
  return { year: y, month: m };
}

export function formatPeriod({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Período (YYYY-MM) de uma data (string YYYY-MM-DD ou Date). */
export function periodOf(date: string | Date): string {
  if (typeof date === "string") return date.slice(0, 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Soma (ou subtrai) meses a um período, normalizando o ano. */
export function addMonthsToPeriod(period: string, delta: number): string {
  const { year, month } = parsePeriod(period);
  const zero = year * 12 + (month - 1) + delta;
  return formatPeriod({ year: Math.floor(zero / 12), month: (zero % 12) + 1 });
}

/** Diferença em meses (b - a). */
export function monthsBetweenPeriods(a: string, b: string): number {
  const pa = parsePeriod(a);
  const pb = parsePeriod(b);
  return (pb.year * 12 + pb.month) - (pa.year * 12 + pa.month);
}

/** Período do mês atual. */
export function currentPeriod(ref: Date = new Date()): string {
  return periodOf(ref);
}

/** Lista de N períodos terminando em `endPeriod` (inclui o final), do mais antigo ao mais novo. */
export function lastNPeriods(endPeriod: string, n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addMonthsToPeriod(endPeriod, -i));
  return out;
}

/** Primeiro e último dia (YYYY-MM-DD) de um período. */
export function periodRange(period: string): { start: string; end: string } {
  const { year, month } = parsePeriod(period);
  const start = `${period}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${period}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

/** Clampa um dia (1..31) ao número de dias do mês do período. */
export function clampDayToPeriod(period: string, day: number): string {
  const { year, month } = parsePeriod(period);
  const lastDay = new Date(year, month, 0).getDate();
  const d = Math.min(Math.max(1, day), lastDay);
  return `${period}-${String(d).padStart(2, "0")}`;
}
