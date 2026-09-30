/** Dátum-segédek. Az érték mindig HELYI naptári nap 'YYYY-MM-DD' szövegként – nincs időzóna-csúszás. */
export const MONTHS = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
export const WEEKDAYS = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
export const WEEKDAYS_LONG = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat', 'vasárnap'];

const pad = (n: number) => String(n).padStart(2, '0');
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const todayIso = () => toIso(new Date());

/** Magyar kiírás: 2026. 10. 01. */
export const formatHuDate = (iso: string | null) => (iso ? iso.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1. $2. $3.') : '');

/** Beírt szövegből dátum: „2026. 10. 01.”, „2026.10.1”, „2026-10-01”, „20261001”. Érvénytelen (pl. 2026.02.30) → null. */
export function parseHuDate(text: string): string | null {
  const t = text.trim();
  const m = t.match(/^(\d{4})[.\-/\s]*(\d{1,2})[.\-/\s]*(\d{1,2})\.?$/) || t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d ? toIso(dt) : null;
}

/** A hónap naptárrácsa: 6 hét × 7 nap, hétfővel kezdve */
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // hétfő = 0
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}

export const addDays = (iso: string, n: number) => { const d = fromIso(iso); d.setDate(d.getDate() + n); return toIso(d); };
export const addMonths = (iso: string, n: number) => {
  const d = fromIso(iso); const day = d.getDate();
  d.setDate(1); d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last)); return toIso(d);
};
export const inRange = (iso: string, min?: string, max?: string) => (!min || iso >= min) && (!max || iso <= max);

/** Helyi nap + óra:perc → UTC ISO a szervernek (az óraátállítást a böngésző kezeli) */
export const localToUtcIso = (date: string, time = '00:00') => { const [h, mi] = time.split(':').map(Number); const d = fromIso(date); d.setHours(h, mi, 0, 0); return d.toISOString(); };
/** Szerver UTC ISO → helyi nap és idő a mezőnek */
export const utcToLocal = (iso: string) => { const d = new Date(iso); return { date: toIso(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }; };
