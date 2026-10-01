import * as Popover from '@radix-ui/react-popover';
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../cx';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { createError, highlight, norm } from './normalize';

export type ComboOption = { value: string; label: string; disabled?: boolean };
type Common = FieldProps & {
  options: ReadonlyArray<ComboOption>;
  placeholder?: string;
  /** Új elem létrehozása a beírt szövegből (címkézés); visszaadja az új elem értékét */
  onCreate?: (label: string) => string | Promise<string>;
  loading?: boolean;
  /** A lista nem töltött be – „Újrapróbálás” */
  loadError?: string;
  onRetry?: () => void;
  /** Ennyi címke látszik a mezőben, a többi „+N” (1A) */
  maxChips?: number;
  /** false: a lista már a szerver találata, helyben nem szűrünk újra (szerveroldali keresés) */
  filter?: boolean;
  /** A beírt keresőszöveg minden változáskor (szerveroldali kereséshez) */
  onQueryChange?: (q: string) => void;
  /** Ennyi karakter alatt nem keres: „Írj még legalább N betűt.” (nem „Nincs találat”) */
  minChars?: number;
};
export type ComboboxProps =
  | (Common & { multiple?: false; value: string | null; onChange: (v: string | null) => void; max?: never })
  | (Common & { multiple: true; value: string[]; onChange: (v: string[]) => void; max?: number });

const RENDER_LIMIT = 100; // 1000+ opciónál sem lassul: egyszerre legfeljebb ennyi sor

/** Combobox (molekula, Javaslat 01 – 1A): keresős legördülő, egyes/többes, új elem létrehozással, címkék a mezőben. */
export function Combobox(props: ComboboxProps) {
  const { options, placeholder, onCreate, loading, loadError, onRetry, maxChips = 3, filter = true, onQueryChange, minChars = 0, disabled, ...field } = props;
  const multi = props.multiple === true;
  const selected: string[] = multi ? props.value : props.value ? [props.value] : [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const full = multi && props.max !== undefined && selected.length >= props.max;

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return q && filter ? options.filter((o) => norm(o.label).includes(q)) : options;
  }, [options, query, filter]);
  const shown = filtered.slice(0, RENDER_LIMIT);
  const q = query.trim();
  const canCreate = Boolean(onCreate) && q.length > 0 && !full && !options.some((o) => norm(o.label) === norm(q));
  const rows = shown.length + (canCreate ? 1 : 0);

  const commit = (v: string[]) => (multi ? (props.onChange as (x: string[]) => void)(v) : (props.onChange as (x: string | null) => void)(v[0] ?? null));
  const toggle = (value: string) => {
    if (!multi) { commit([value]); setOpen(false); setQuery(''); return; }
    if (selected.includes(value)) commit(selected.filter((s) => s !== value));
    else if (!full) commit([...selected, value]);
    setQuery('');
  };
  const [createErr, setCreateErr] = useState<string>();
  // onCreate elutasítása: megszakításnál (AbortError) csendben marad, más hibánál a mező alatt szól
  const create = async () => { if (!onCreate) return; try { const v = await onCreate(q); setCreateErr(undefined); toggle(v); } catch (e) { setCreateErr(createError(e)); } };
  const pick = (i: number) => {
    if (i < shown.length) { const o = shown[i]; if (!o.disabled && !(full && !selected.includes(o.value))) toggle(o.value); }
    else if (canCreate) void create();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setActive((a) => (rows ? (a + (e.key === 'ArrowDown' ? 1 : rows - 1)) % rows : 0));
    } else if (e.key === 'Enter' && open) { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } else if (query) setQuery(''); }
    else if (e.key === 'Backspace' && !query && multi && selected.length) commit(selected.slice(0, -1));
  };

  const chips = multi ? (showAll ? selected : selected.slice(0, maxChips)) : [];
  const singleLabel = !multi && selected[0] ? byValue.get(selected[0])?.label ?? selected[0] : '';
  const count = multi && props.max !== undefined ? { value: selected.length, max: props.max } : undefined;
  const range = field.range ?? (multi && props.max !== undefined ? `legfeljebb ${props.max} elem` : undefined);

  return (
    <Field {...field} error={field.error ?? createErr} range={range} count={count} disabled={disabled}>
      <FieldInput>
        {(f) => (
          <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
            <Popover.Anchor asChild>
              <div className={cx('bc-combo', f.invalid && 'is-invalid', disabled && 'is-disabled')} onClick={() => !disabled && input.current?.focus()}>
                {chips.map((v) => (
                  <span key={v} className="bc-chip">
                    <span>{byValue.get(v)?.label ?? v}</span>
                    {!disabled && <button type="button" aria-label={`${byValue.get(v)?.label ?? v} eltávolítása`} onClick={(e) => { e.stopPropagation(); commit(selected.filter((s) => s !== v)); }}>×</button>}
                  </span>
                ))}
                {multi && !showAll && selected.length > maxChips && (
                  <button type="button" className="bc-chip is-more" aria-label={`Még ${selected.length - maxChips} kiválasztott elem megjelenítése`} onClick={(e) => { e.stopPropagation(); setShowAll(true); }}>+{selected.length - maxChips}</button>
                )}
                <input ref={input} id={f.id} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
                  aria-activedescendant={open && rows ? `${listId}-${active}` : undefined} aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined}
                  disabled={disabled} autoComplete="off"
                  placeholder={loading ? 'Töltöm a listát…' : loadError ? 'A lista nem töltött be – nyisd le az újrapróbáláshoz' : selected.length && multi ? '' : placeholder}
                  value={open || multi ? query : singleLabel}
                  onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); onQueryChange?.(e.target.value); }}
                  onFocus={() => setQuery('')} onKeyDown={onKey} />
                {loading && <span className="bc-spinner" role="status" aria-label="Töltöm a listát" style={{ width: 18, height: 18, borderWidth: 2 }} />}
                <button type="button" className="bc-combo-toggle" tabIndex={-1} aria-hidden="true" aria-expanded={open} disabled={disabled} onClick={(e) => { e.stopPropagation(); setOpen(!open); input.current?.focus(); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                </button>
              </div>
            </Popover.Anchor>
            <Popover.Portal>
              <Popover.Content className="bc-listbox" align="start" sideOffset={4} collisionPadding={16}
                onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => { if (e.target instanceof Node && input.current?.parentElement?.contains(e.target)) e.preventDefault(); }}>
                <div role="listbox" id={listId} aria-multiselectable={multi || undefined} aria-label={field.label}>
                  {loading && <div className="bc-list-note" role="status">Töltöm a listát…</div>}
                  {loadError && <div className="bc-list-note" role="alert">{loadError} {onRetry && <button type="button" className="bc-btn is-sm is-secondary" onClick={onRetry}>Újrapróbálás</button>}</div>}
                  {!loading && !loadError && shown.map((o, i) => {
                    const isSel = selected.includes(o.value);
                    const blocked = o.disabled || (full && !isSel);
                    return (
                      <div key={o.value} id={`${listId}-${i}`} role="option" aria-selected={isSel} aria-disabled={blocked || undefined}
                        data-active={i === active} className="bc-option" onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActive(i)} onClick={() => pick(i)}>
                        {multi && <span className="bc-ck" aria-hidden="true">{isSel ? '✓' : ''}</span>}
                        <span>{highlight(o.label, query)}</span>
                      </div>
                    );
                  })}
                  {canCreate && (
                    <div id={`${listId}-${shown.length}`} role="option" aria-selected={false} data-active={active === shown.length} className="bc-option is-create"
                      onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActive(shown.length)} onClick={() => void create()}>
                      + Új: „{q}”
                    </div>
                  )}
                  {!loading && !loadError && q.length < minChars && <div className="bc-list-note">Írj még legalább {minChars - q.length} betűt.</div>}
                  {!loading && !loadError && !rows && q.length >= minChars && <div className="bc-list-note">Nincs találat{q ? ` erre: „${q}”` : ''}.</div>}
                  {filtered.length > RENDER_LIMIT && <div className="bc-list-note">Még {filtered.length - RENDER_LIMIT} találat – szűkítsd a keresést.</div>}
                  {full && <div className="bc-list-note">Elérted a legfeljebb {props.max} elemet – előbb vegyél ki egyet.</div>}
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </FieldInput>
    </Field>
  );
}
