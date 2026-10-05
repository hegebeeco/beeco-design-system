import type { ReactNode } from 'react';
import { addDays, fromIso, MONTHS, WEEKDAYS_LONG } from '../pickers/date';

/** A naptár beépített tartalomfajtái – a szín SZEREPBŐL jön: esemény = info, speciális nap = warning, oktatás = success */
export type CalKind = 'event' | 'special' | 'education';
export const KIND_ROLE: Record<CalKind, 'info' | 'warning' | 'success'> = { event: 'info', special: 'warning', education: 'success' };
export const KIND_LABEL: Record<CalKind, string> = { event: 'Esemény', special: 'Speciális nap', education: 'Oktatás' };
const ORDER: CalKind[] = ['special', 'event', 'education'];
/** A beépített fajták a jelmagyarázat sorrendjében */
export const CAL_KINDS: readonly CalKind[] = ['event', 'special', 'education'];

/** Javaslat 20: egy fajta színe – csak szerep (méz nincs: az a kijelölésé) */
export type CalTone = 'info' | 'warning' | 'success' | 'danger' | 'neutral';
/**
 * Javaslat 20 – a projekt saját tartalomfajtája (pl. „Kupon-időzítés”): címke + szerepszín + piktogram. A fajtát a bal csík,
 * a szín, a piktogram ÉS a jelmagyarázat felirata is mondja – nem csak a szín. A beépített fajták is felülírhatók vele.
 */
export type CalKindDef = { label: string; tone?: CalTone; icon?: ReactNode };

export type CalEvent<K extends string = CalKind> = {
  id: string;
  title: string;
  kind: K;
  /** Kezdő nap 'YYYY-MM-DD' (helyi nap) */
  date: string;
  /** Utolsó nap, ha több napos (a hónap határán át is) */
  end?: string;
  /** Évente ismétlődő (pl. világnap) – bármelyik évben ugyanazon a napon */
  yearly?: boolean;
};

const isBuiltin = (k: string): k is CalKind => (CAL_KINDS as readonly string[]).includes(k);

/** A fajta szerepszíne: a projekt definíciója, különben a beépített szerep, különben semleges */
export function kindTone<K extends string>(k: K, defs?: Partial<Record<K, CalKindDef>>): CalTone {
  return defs?.[k]?.tone ?? (isBuiltin(k) ? KIND_ROLE[k] : 'neutral');
}

/** A fajta neve: labels → a projekt definíciója → beépített név → maga a kulcs */
export function kindLabel<K extends string>(k: K, labels?: Partial<Record<K, string>>, defs?: Partial<Record<K, CalKindDef>>): string {
  return labels?.[k] ?? defs?.[k]?.label ?? (isBuiltin(k) ? KIND_LABEL[k] : k);
}

/** Nap → a napra eső tartalmak, fajta szerint rendezve (speciális nap elöl, a saját fajták a `order` sorrendjében a végén) */
export function eventsByDay<K extends string = CalKind>(events: readonly CalEvent<K>[], days: readonly string[], hidden: ReadonlySet<K>, order?: readonly K[]) {
  const map = new Map<string, CalEvent<K>[]>(days.map((d) => [d, []]));
  const first = days[0], last = days[days.length - 1];
  for (const e of events) {
    if (hidden.has(e.kind)) continue;
    if (e.yearly) {
      // Az ismétlődő napot a látott évekre vetítjük (a rács két évet is érinthet)
      for (const y of new Set([first.slice(0, 4), last.slice(0, 4)])) map.get(`${y}${e.date.slice(4)}`)?.push(e);
      continue;
    }
    const end = e.end && e.end > e.date ? e.end : e.date;
    for (let d = e.date < first ? first : e.date; d <= end && d <= last; d = addDays(d, 1)) map.get(d)?.push(e);
  }
  const rank = (k: K) => { const b = ORDER.indexOf(k as CalKind); if (b >= 0) return b; const o = order?.indexOf(k) ?? -1; return ORDER.length + (o >= 0 ? o : 999); };
  for (const list of map.values()) list.sort((a, b) => rank(a.kind) - rank(b.kind) || a.title.localeCompare(b.title, 'hu'));
  return map;
}

/** „október 1., szerda” */
export const dayTitle = (iso: string) => { const d = fromIso(iso); return `${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}`; };
