/** Célcsoport-szabályok – tiszta logika (típusok, feltételek, ellenőrzés, összefoglaló mondat). */
export type AudienceFieldType = 'select' | 'number' | 'text';
export type AudienceField = {
  key: string;
  /** „Város”, „Életkor” */
  label: string;
  type: AudienceFieldType;
  /** Mit jelent ez a mező, honnan jön az adat (a súgóba kerül) */
  help: string;
  options?: ReadonlyArray<{ value: string; label: string }>;
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
  maxLength?: number;
};
export type AudienceOp = 'eq' | 'neq' | 'gte' | 'lte' | 'contains';
export type AudienceRule = { id: string; field: string; op: AudienceOp; value: string | number | null };
export type Audience = { join: 'and' | 'or'; rules: AudienceRule[] };

export const OPS: Record<AudienceFieldType, ReadonlyArray<{ value: AudienceOp; label: string }>> = {
  select: [{ value: 'eq', label: 'ez' }, { value: 'neq', label: 'nem ez' }],
  number: [{ value: 'gte', label: 'legalább' }, { value: 'lte', label: 'legfeljebb' }, { value: 'eq', label: 'pontosan' }],
  text: [{ value: 'contains', label: 'tartalmazza' }, { value: 'eq', label: 'pontosan ez' }],
};

let seq = 0;
/** Új, üres feltétel (egyedi azonosítóval) */
export const newRule = (): AudienceRule => ({ id: `feltetel-${Date.now().toString(36)}-${++seq}`, field: '', op: 'eq', value: null });

/** Mi a baj a feltétellel (a hiba megmondja a teendőt); undefined = rendben */
export function ruleProblem(r: AudienceRule, fields: ReadonlyArray<AudienceField>): string | undefined {
  if (!r.field) return 'Válaszd ki, mire szűrjön ez a feltétel.';
  const f = fields.find((x) => x.key === r.field);
  if (!f) return 'Ez a mező már nem választható – válassz másikat, vagy töröld a feltételt.';
  if (r.value === null || (typeof r.value === 'string' && !r.value.trim())) return 'Adj meg értéket – enélkül ez a feltétel nem szűr.';
  if (f.type === 'select' && !f.options?.some((o) => o.value === r.value)) return 'A választott érték már nem létezik – válassz újat.';
  return undefined;
}

export function audienceProblems(a: Audience, fields: ReadonlyArray<AudienceField>) {
  const out: Record<string, string> = {};
  for (const r of a.rules) { const p = ruleProblem(r, fields); if (p) out[r.id] = p; }
  return out;
}

/** Egy mondatban: „Város: Budapest ÉS Életkor legalább 18 év” – a hibás feltételek kimaradnak */
export function describeAudience(a: Audience, fields: ReadonlyArray<AudienceField>) {
  const parts = a.rules.filter((r) => !ruleProblem(r, fields)).map((r) => {
    const f = fields.find((x) => x.key === r.field)!;
    const op = OPS[f.type].find((o) => o.value === r.op)?.label ?? '';
    const v = f.type === 'select' ? f.options?.find((o) => o.value === r.value)?.label : String(r.value).replace('.', ',');
    if (f.type === 'select') return `${f.label}: ${r.op === 'neq' ? 'nem ' : ''}${v}`;
    return `${f.label} ${op} ${v}${f.unit ? ` ${f.unit}` : ''}`;
  });
  if (!parts.length) return 'mindenki (nincs érvényes feltétel)';
  return parts.join(a.join === 'and' ? ' ÉS ' : ' VAGY ');
}
