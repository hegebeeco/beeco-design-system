import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import type { Header } from '@tanstack/react-table';
import { cx } from '../cx';
import { Button, IconButton } from '../inputs/Button';
import { fmt } from './format';

/** SortHeader (atom): rendezés-gomb a fejlécben; az állapotot a <th aria-sort> mondja, a nyíl csak rajz. Enter/Szóköz: ▲ → ▼ → nincs. */
export function SortHeader({ label, sorted, onToggle }: { label: ReactNode; sorted: false | 'asc' | 'desc'; onToggle: () => void }) {
  const next = sorted === 'asc' ? 'csökkenő sorrend' : sorted === 'desc' ? 'rendezés kikapcsolása' : 'növekvő sorrend';
  return (
    <button type="button" className="bc-sort bc-dt-sort" onClick={onToggle} title={`Rendezés: ${next}`}>
      {label}
      <svg className={cx('bc-dt-sorticon', sorted && `is-${sorted}`)} viewBox="0 0 12 16" aria-hidden="true"><path className="is-up" d="M6 1l4 5H2z" /><path className="is-down" d="M6 15l4-5H2z" /></svg>
    </button>
  );
}

/** SelectCell (atom): sor- vagy fejléc-jelölő, 44 px-es kattintható terület; a fejlécnél részleges állapot (–) is. */
export function SelectCell({ checked, indeterminate, disabled, label, onChange }: { checked: boolean; indeterminate?: boolean; disabled?: boolean; label: string; onChange: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = Boolean(indeterminate); }, [indeterminate]);
  return (
    <label className="bc-dt-check">
      <input ref={ref} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} aria-label={label} />
    </label>
  );
}

/** ExpandToggle (atom): sor lenyitása – aria-expanded + aria-controls a részletek sorára. */
export function ExpandToggle({ expanded, controls, label, onToggle }: { expanded: boolean; controls: string; label: string; onToggle: () => void }) {
  return (
    <IconButton className="bc-dt-expand" aria-label={`Részletek: ${label}`} aria-expanded={expanded} aria-controls={expanded ? controls : undefined} onClick={onToggle}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
    </IconButton>
  );
}

const STEP = 16;
/** ColumnResizer (atom): oszlopszélesség húzással (egér, érintés) ÉS billentyűzettel (← → 16 px, Home = alapméret). */
export function ColumnResizer<T>({ header, label }: { header: Header<T, unknown>; label: string }) {
  const col = header.column;
  const size = col.getSize();
  const min = col.columnDef.minSize ?? 64, max = col.columnDef.maxSize ?? 800;
  const set = (v: number) => header.getContext().table.setColumnSizing((old) => ({ ...old, [col.id]: Math.max(min, Math.min(max, v)) }));
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); set(size + (e.key === 'ArrowRight' ? STEP : -STEP)); }
    if (e.key === 'Home') { e.preventDefault(); col.resetSize(); }
  };
  return (
    <div role="separator" aria-orientation="vertical" aria-label={`${label} oszlop szélessége`} aria-valuenow={Math.round(size)} aria-valuemin={min} aria-valuemax={Math.min(max, 2000)}
      tabIndex={0} className={cx('bc-dt-resizer', col.getIsResizing() && 'is-resizing')} onKeyDown={onKey}
      onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()} onDoubleClick={() => col.resetSize()} />
  );
}

export type BulkBarProps = { count: number; max?: number; itemLabel: string; notice?: string; onClear: () => void; children?: ReactNode };

/** BulkBar (molekula): kijelöléskor a táblázat fölött (1b A), görgetéskor odatapad. Darabszám + „Kijelölés törlése” + a projekt műveletei. */
export function BulkBar({ count, max, itemLabel, notice, onClear, children }: BulkBarProps) {
  return (
    <div className="bc-dt-bulk" role="region" aria-label="Tömeges műveletek">
      <p className="bc-dt-bulk-count"><strong>{fmt(count)} kijelölt</strong> {itemLabel}{max ? <span className="bc-muted"> ({fmt(count)}/{fmt(max)})</span> : null}</p>
      {notice && <p className="bc-notice">{notice}</p>}
      <div className="bc-dt-bulk-actions">
        <Button variant="ghost" size="sm" onClick={onClear}>Kijelölés törlése</Button>
        {children}
      </div>
    </div>
  );
}
