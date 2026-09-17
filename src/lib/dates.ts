/**
 * Date helpers. The product targets Brazil; we keep month boundaries simple
 * and consistent (based on the server's local interpretation of the stored
 * UTC dates). All range helpers are inclusive of start, exclusive of end.
 */

export interface MonthRange {
  start: Date;
  end: Date;
  month: number; // 1-12
  year: number;
}

export function monthRange(year: number, month1to12: number): MonthRange {
  const start = new Date(year, month1to12 - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month1to12, 1, 0, 0, 0, 0);
  return { start, end, month: month1to12, year };
}

export function currentMonthRange(now: Date = new Date()): MonthRange {
  return monthRange(now.getFullYear(), now.getMonth() + 1);
}

export function previousMonthRange(now: Date = new Date()): MonthRange {
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return monthRange(d.getFullYear(), d.getMonth() + 1);
}

/** Returns the N most recent complete-ish month ranges ending at `now`'s month. */
export function lastNMonths(n: number, now: Date = new Date()): MonthRange[] {
  const ranges: MonthRange[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    ranges.push(monthRange(d.getFullYear(), d.getMonth() + 1));
  }
  return ranges;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function monthName(month1to12: number): string {
  return MONTH_NAMES[(month1to12 - 1 + 12) % 12];
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Number of whole months between two dates, rounded up, min 0. */
export function monthsUntil(target: Date, from: Date = new Date()): number {
  const months =
    (target.getFullYear() - from.getFullYear()) * 12 +
    (target.getMonth() - from.getMonth());
  return Math.max(0, months);
}

/** Parse a yyyy-mm-dd (or ISO) string to a Date at local midnight. */
export function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format a Date as yyyy-mm-dd for <input type="date"> values. */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
