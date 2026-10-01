import { useState } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { Combobox, type ComboOption } from './Combobox';
import { createError, norm } from './normalize';

export type TagPickerProps = FieldProps & {
  options: ReadonlyArray<ComboOption>;
  value: string[];
  onChange: (v: string[]) => void;
  /** Legfeljebb ennyi címke választható */
  max?: number;
  /** Új címke létrehozása; visszaadja az értékét */
  onCreate?: (label: string) => string | Promise<string>;
  /** Eddig felhő, fölötte keresős legördülő (Javaslat 01 – 4A) */
  cloudLimit?: number;
};

/** TagPicker (molekula, 4A): ≤ 20 címkénél kattintható felhő, fölötte a Combobox többes módja – egy API. */
export function TagPicker({ options, value, onChange, max, onCreate, cloudLimit = 20, ...field }: TagPickerProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [err, setErr] = useState<string>();
  if (options.length > cloudLimit) return <Combobox {...field} multiple options={options} value={value} onChange={onChange} max={max} onCreate={onCreate} />;

  const full = max !== undefined && value.length >= max;
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : full ? value : [...value, v]);
  const save = async () => {
    const t = draft.trim();
    if (!t) { setErr('Adj nevet az új címkének.'); return; }
    if (options.some((o) => norm(o.label) === norm(t))) { setErr(`„${t}” már létezik – válaszd ki a listából.`); return; }
    let v: string;
    try { v = await onCreate!(t); } catch (e) { setErr(createError(e)); return; } // megszakítás vagy hiba: a beírt név megmarad
    onChange([...value, v]); setDraft(''); setAdding(false); setErr(undefined);
  };

  return (
    <Field {...field} labelFor={false} range={field.range ?? (max !== undefined ? `legfeljebb ${max} címke` : undefined)}
      count={max !== undefined ? { value: value.length, max } : undefined} error={field.error ?? err}>
      <div className="bc-tagcloud" role="group" aria-label={field.label}>
        {options.length === 0 && !onCreate && <span className="bc-muted">Még nincs címke.</span>}
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button key={o.value} type="button" className="bc-tag" aria-pressed={on} disabled={field.disabled || o.disabled || (full && !on)} onClick={() => toggle(o.value)}>
              {o.label}
            </button>
          );
        })}
        {onCreate && !adding && <button type="button" className="bc-tag is-add" disabled={field.disabled || full} onClick={() => setAdding(true)}>+ Új címke</button>}
        {adding && (
          <span className="bc-row" style={{ gap: 'var(--bc-sp-1)' }}>
            <input className="bc-input" style={{ width: 180, margin: 0 }} aria-label="Új címke neve" maxLength={40} autoFocus value={draft}
              onChange={(e) => { setDraft(e.target.value); setErr(undefined); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void save(); } if (e.key === 'Escape') setAdding(false); }} />
            <button type="button" className="bc-btn is-sm" onClick={() => void save()}>Hozzáadás</button>
            <button type="button" className="bc-btn is-sm is-ghost" onClick={() => { setAdding(false); setErr(undefined); }}>Mégse</button>
          </span>
        )}
      </div>
    </Field>
  );
}
