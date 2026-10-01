import { addDays, fromIso, MONTHS, WEEKDAYS_LONG } from '../pickers/date';

/** A naptár tartalomfajtái – a szín SZEREPBŐL jön: esemény = info, speciális nap = warning, oktatás = success */
export type CalKind = 'event' | 'special' | 'education';
export const KIND_ROLE: Record<CalKind, 'info' | 'warning' | 'success'> = { event: 'info', special: 'warning', education: 'success' };
export const KIND_LABEL: Record<CalKind, string> = { event: 'Esemény', special: 'Speciális nap', education: 'Oktatás' };
const ORDER: CalKind[] = ['special', 'event', 'education'];

export type CalEvent = {
  id: string;
  title: string;
  kind: CalKind;
  /** Kezdő nap 'YYYY-MM-DD' (helyi nap) */
  date: string;
  /** Utolsó nap, ha több napos (a hónap határán át is) */
  end?: string;
  /** Évente ismétlődő (pl. világnap) – bármelyik évben ugyanazon a napon */
  yearly?: boolean;
};

/** Nap → a napra eső tartalmak, fajta szerint rendezve (speciális nap elöl) */
export function eventsByDay(events: readonly CalEvent[], days: readonly string[], hidden: ReadonlySet<CalKind>) {
  const map = new Map<string, CalEvent[]>(days.map((d) => [d, []]));
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
  for (const list of map.values()) list.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.title.localeCompare(b.title, 'hu'));
  return map;
}

/** „október 1., szerda” */
export const dayTitle = (iso: string) => { const d = fromIso(iso); return `${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}`; };
