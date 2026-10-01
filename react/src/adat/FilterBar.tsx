import * as Popover from '@radix-ui/react-popover';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { SearchBox } from '../inputs/SearchBox';
import { chipText, FilterChip, FilterControl, type FilterDef, type FilterValue } from './FilterControls';
import { fmt } from './format';
import { useWidth } from './useWidth';

export type FilterValues = Record<string, FilterValue>;
export type FilterBarProps = {
  /** Kereső (a SearchBox késleltetve hívja az onChange-et – a lista nem villog gépelés közben) */
  search?: { label: string; value: string; onChange: (v: string) => void; placeholder?: string };
  filters: FilterDef[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  /** Találatok száma; null = most számolunk */
  resultCount?: number | null;
  itemLabel?: string;
  /** További vezérlők (pl. időszak-választó) a szűrők mellett */
  extra?: ReactNode;
  /** Ez alatt a szélesség alatt „Szűrők (N)” gomb + panel (2B) */
  narrowBelow?: number;
  className?: string;
};

const vals = (v: FilterValue) => (Array.isArray(v) ? v : v ? [v] : []);

/**
 * FilterBar (organizmus, Javaslat 02 – 2B): kereső + szűrők + aktív-szűrő címkék + „Szűrők törlése” + találatszám.
 * Széles helyen soros; keskenyen „Szűrők (N)” gomb és panel, alján a találatszámmal. A régi linkből jött érvénytelen értéket kihagyja és szól.
 */
export function FilterBar({ search, filters, values, onChange, resultCount, itemLabel = 'találat', extra, narrowBelow = 640, className }: FilterBarProps) {
  const root = useRef<HTMLDivElement>(null);
  const width = useWidth(root, typeof window === 'undefined' ? 1024 : window.innerWidth);
  const narrow = width > 0 && width < narrowBelow;
  const [q, setQ] = useState(search?.value ?? '');
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string>();
  const searchInput = useRef<HTMLInputElement>(null);
  // A SearchBox role="search" tartománya névtelen; több szűrősáv egy oldalon → nevet adunk neki (amíg a SearchBox maga nem teszi)
  useEffect(() => { searchInput.current?.closest('[role=search]')?.setAttribute('aria-label', search?.label ?? 'Keresés'); }, [search?.label]);
  useEffect(() => { if (search && search.value !== q.trim()) setQ(search.value); }, [search?.value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Érvénytelen érték (pl. régi link): kihagyjuk és jelezzük
  useEffect(() => {
    const bad: string[] = [];
    const next: FilterValues = { ...values };
    for (const f of filters) {
      if (f.loading || f.loadError || !f.options.length) continue;
      const ok = vals(values[f.id]).filter((v) => f.options.some((o) => o.value === v));
      if (ok.length !== vals(values[f.id]).length) { bad.push(f.label); next[f.id] = f.multiple ? (ok.length ? ok : null) : ok[0] ?? null; }
    }
    if (bad.length) { setNotice(`A linkben lévő ${bad.join(', ')} szűrőérték már nem létezik – kihagytam.`); onChange(next); }
  }, [values, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (id: string, v: FilterValue) => {
    const next: FilterValues = { ...values, [id]: v };
    const drop = (pid: string) => filters.filter((f) => f.parent === pid).forEach((f) => { next[f.id] = null; drop(f.id); });
    drop(id);
    setNotice(undefined);
    onChange(next);
  };
  const active = filters.map((f) => ({ f, text: chipText(f, values[f.id]) })).filter((a) => a.text);
  const any = active.length > 0 || Boolean(q.trim());
  const clearAll = () => {
    const next: FilterValues = {};
    filters.forEach((f) => { next[f.id] = null; });
    onChange(next); setQ(''); search?.onChange(''); setNotice(undefined);
  };
  const count = resultCount === undefined ? null : (
    <p className="bc-fb-count" role="status" aria-live="polite">{resultCount === null ? 'Számolás…' : `${fmt(resultCount)} ${itemLabel}`}</p>
  );
  const controls = filters.map((f) => <FilterControl key={f.id} def={f} value={values[f.id]} onChange={(v) => set(f.id, v)} />);

  return (
    <div ref={root} className={cx('bc-fb', narrow && 'is-narrow', className)}>
      <div className="bc-fb-row">
        {search && (
          <SearchBox ref={searchInput} className="bc-fb-search" label={search.label} placeholder={search.placeholder} value={q} onChange={setQ} onSearch={(v) => search.onChange(v)} />
        )}
        {narrow ? (
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <Button variant="secondary" className="bc-fb-toggle" aria-haspopup="dialog">
                Szűrők{active.length > 0 && <span className="bc-badge is-accent">{active.length}<span className="bc-sr"> aktív</span></span>}
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="bc-pop bc-fb-panel" role="dialog" aria-label="Szűrők" side="bottom" align="end" sideOffset={8} collisionPadding={16}>
                <div className="bc-fb-panel-body">{controls}{extra}</div>
                <div className="bc-fb-panel-foot">
                  {any && <Button variant="ghost" size="sm" onClick={clearAll}>Szűrők törlése</Button>}
                  <Button size="sm" onClick={() => setOpen(false)}>{resultCount == null ? 'Kész' : `${fmt(resultCount)} ${itemLabel} mutatása`}</Button>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ) : (<>{controls}{extra}</>)}
      </div>
      {notice && <p className="bc-notice" role="status">{notice}</p>}
      {(any || count) && (
        <div className="bc-fb-active">
          {any && (
            <ul className="bc-fb-chips" aria-label="Aktív szűrők">
              {q.trim() && <FilterChip text={`Keresés: ${q.trim()}`} onRemove={() => { setQ(''); search?.onChange(''); }} />}
              {active.map(({ f, text }) => <FilterChip key={f.id} text={text as string} onRemove={() => set(f.id, null)} />)}
            </ul>
          )}
          {any && <Button variant="ghost" size="sm" onClick={clearAll}>Szűrők törlése</Button>}
          {count}
        </div>
      )}
    </div>
  );
}
