/** Nyitvatartás – adat és ellenőrzés. Ma napi EGY sáv, éjfél utáni zárás nélkül (az admin adatmodellje: start, end, is_closed). */
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export const WEEK: ReadonlyArray<{ key: Weekday; label: string }> = [
  { key: 'Mon', label: 'Hétfő' }, { key: 'Tue', label: 'Kedd' }, { key: 'Wed', label: 'Szerda' }, { key: 'Thu', label: 'Csütörtök' },
  { key: 'Fri', label: 'Péntek' }, { key: 'Sat', label: 'Szombat' }, { key: 'Sun', label: 'Vasárnap' },
];
export type DayHours = { open: boolean; from: string | null; to: string | null };
export type OpeningHours = Record<Weekday, DayHours>;

/**
 * Beírt időből „HH:mm”: „8” → 08:00, „830” / „0830” / „8.30” → 08:30, „6pm” → 18:00, „24” → 24:00 (éjfélig).
 * Érvénytelen (pl. „25:00”, „8:75”) → null.
 */
export function parseTime(text: string): string | null {
  const t = text.trim().toLowerCase().replace(/\s+/g, '');
  if (!t) return null;
  const m = t.match(/^(\d{1,2})(?:[:.,h]?(\d{2}))?(am|pm|de|du)?$/);
  if (!m) return null;
  let h = Number(m[1]); const mi = Number(m[2] ?? 0);
  const ap = m[3];
  if (ap) { if (h < 1 || h > 12) return null; if (ap === 'pm' || ap === 'du') h = (h % 12) + 12; else h = h % 12; }
  if (mi > 59 || h > 24 || (h === 24 && mi > 0)) return null;
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
}

/** Soronkénti hibák (a következő lépéssel); üres objektum = rendben */
export function validateHours(v: OpeningHours): Partial<Record<Weekday, string>> {
  const err: Partial<Record<Weekday, string>> = {};
  for (const { key, label } of WEEK) {
    const d = v[key];
    if (!d.open) continue;
    if (!d.from || !d.to) { err[key] = `${label}: add meg a nyitást és a zárást is, vagy kapcsold „Zárva”-ra.`; continue; }
    if (d.to <= d.from) {
      err[key] = d.to === d.from
        ? `${label}: a nyitás és a zárás ugyanaz (${d.from}). Egész napos nyitvatartáshoz írd: 00:00–24:00.`
        : `${label}: a zárás (${d.to}) a nyitás (${d.from}) előtt van. Éjfél utáni zárást most nem tudunk tárolni – legkésőbb 24:00 lehet.`;
    }
  }
  return err;
}

/** Üres hét: minden nap zárva, idő nélkül */
export const emptyWeek = (): OpeningHours =>
  Object.fromEntries(WEEK.map(({ key }) => [key, { open: false, from: null, to: null }])) as unknown as OpeningHours;
