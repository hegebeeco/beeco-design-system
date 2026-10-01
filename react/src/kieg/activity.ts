import type { ReactNode } from 'react';

/** Egy mező változása: előtte → utána (üres/hiányzó érték: null) */
export type ActivityChange = { field: string; before?: ReactNode; after?: ReactNode };

export type ActivityItem = {
  id: string;
  /** Mikor – ISO (UTC) vagy Date; a felület helyi időben mutatja */
  at: string | Date;
  /** Ki: „Kovács Anna”, „Rendszer” */
  who: string;
  /** Mit tett, igével: „módosította”, „létrehozta”, „jóváhagyta” */
  action: string;
  /** Min: „a Zöld Sarok Bolt adatlapját” */
  target?: ReactNode;
  /** Mezőszintű különbség – lenyitható */
  changes?: ActivityChange[];
  /** A pötty színe (a szöveg mondja a jelentést, a szín csak kiegészít) */
  tone?: 'success' | 'danger' | 'warning' | 'info';
};

export type DayGroup = { key: string; label: string; items: ActivityItem[] };

const pad = (n: number) => String(n).padStart(2, '0');
const toDate = (d: string | Date) => (d instanceof Date ? d : new Date(d));
/** Helyi naptári nap kulcsa: 2026-10-01 */
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const dayFmt = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
const timeFmt = new Intl.DateTimeFormat('hu-HU', { hour: '2-digit', minute: '2-digit' });

/** „Ma”, „Tegnap”, különben „2026. szeptember 28., vasárnap” */
export function dayLabel(d: Date, now = new Date()) {
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (dayKey(d) === dayKey(now)) return 'Ma';
  if (dayKey(d) === dayKey(y)) return 'Tegnap';
  return dayFmt.format(d);
}
/** „14:05” – ismeretlen időnél „–” */
export const timeLabel = (d: string | Date) => { const x = toDate(d); return Number.isNaN(x.getTime()) ? '–' : timeFmt.format(x); };
/** A <time dateTime> értéke (UTC ISO), ismeretlen időnél undefined */
export const isoOf = (d: string | Date) => { const x = toDate(d); return Number.isNaN(x.getTime()) ? undefined : x.toISOString(); };

/** Napok szerint csoportosít, legújabb elöl (egyenlő időnél a megadott sorrend marad) */
export function groupByDay(items: ActivityItem[], now = new Date()): DayGroup[] {
  const sorted = items.map((it, i) => ({ it, i, t: toDate(it.at).getTime() || -Infinity })).sort((a, b) => b.t - a.t || a.i - b.i);
  const groups: DayGroup[] = [];
  for (const { it } of sorted) {
    const d = toDate(it.at);
    const key = Number.isNaN(d.getTime()) ? 'ismeretlen' : dayKey(d);
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) { g = { key, label: key === 'ismeretlen' ? 'Ismeretlen időpont' : dayLabel(d, now), items: [] }; groups.push(g); }
    g.items.push(it);
  }
  return groups;
}
