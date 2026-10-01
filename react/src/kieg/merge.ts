import type { ReactNode } from 'react';

/** Összefésülés – tiszta logika: egyezés, üresség, kijelzés, eredmény. */
export type MergeRecord = {
  id: string;
  /** Rövid név a választásnál: „A · #1204” */
  label: string;
  /** Pl. létrehozás dátuma, kitöltöttség */
  meta?: ReactNode;
  values: Record<string, unknown>;
};
export type MergeFieldDef = {
  key: string;
  label: string;
  /** Nem lehet üres az eredményben (pl. név) */
  required?: boolean;
  /** Saját kijelzés (pl. dátum, koordináta) */
  format?: (v: unknown) => ReactNode;
};

/** Üres: null, undefined, csak szóköz, üres lista */
export const isBlank = (v: unknown) => v === null || v === undefined || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);

const norm = (v: unknown): unknown => (isBlank(v) ? null : typeof v === 'string' ? v.trim() : Array.isArray(v) ? v.map(norm) : v);
/** Két érték egyezik-e (szóköz a szélén és üres/hiányzó nem számít eltérésnek) */
export const sameValue = (a: unknown, b: unknown) => JSON.stringify(norm(a)) === JSON.stringify(norm(b));

/** Alap kijelzés: lista vesszővel, igen/nem, tizedes vessző */
export function showValue(v: unknown): string {
  if (isBlank(v)) return '';
  if (Array.isArray(v)) return v.map(showValue).join(', ');
  if (typeof v === 'boolean') return v ? 'igen' : 'nem';
  if (typeof v === 'number') return String(v).replace('.', ',');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/** Mely mezők térnek el a rekordok között */
export const differing = (records: MergeRecord[], fields: MergeFieldDef[]) =>
  fields.filter((f) => records.some((r) => !sameValue(r.values[f.key], records[0].values[f.key])));

/**
 * Javaslat: ha csak egy rekordban van kitöltve, azt; ha több kitöltött érték eltér, nem dönt helyetted.
 * A már meghozott döntéseket nem írja felül.
 */
export function suggest(records: MergeRecord[], fields: MergeFieldDef[], choices: Record<string, string>) {
  const out = { ...choices };
  for (const f of differing(records, fields)) {
    if (out[f.key]) continue;
    const filled = records.filter((r) => !isBlank(r.values[f.key]));
    if (filled.length === 1) out[f.key] = filled[0].id;
  }
  return out;
}

/** Az eredmény: egyező mezőnél a közös érték, eltérőnél a választott rekordé (undefined = még nincs döntés) */
export function mergedValues(records: MergeRecord[], fields: MergeFieldDef[], choices: Record<string, string>) {
  const diff = new Set(differing(records, fields).map((f) => f.key));
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (!diff.has(f.key)) { out[f.key] = records[0].values[f.key]; continue; }
    const r = records.find((x) => x.id === choices[f.key]);
    out[f.key] = r ? r.values[f.key] : undefined;
  }
  return out;
}
