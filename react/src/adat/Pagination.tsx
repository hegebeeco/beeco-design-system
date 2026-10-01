import { useId } from 'react';
import { cx } from '../cx';
import { IconButton } from '../inputs/Button';
import { fmt, pageList } from './format';

export type PaginationProps = {
  /** Aktuális lap, 0-tól */
  page: number;
  pageSize: number;
  /** Az összes elem száma (szerveroldali lapozásnál a szervertől) */
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Választható oldalméretek – jóváhagyva: 10 / 25 / 100 */
  pageSizes?: number[];
  /** Mit számolunk: „1–25 / 312 partner” */
  itemLabel?: string;
  /** A lapozó neve (több lapozó egy oldalon: legyen egyedi) */
  label?: string;
  className?: string;
};

// vegig: az első/utolsó lap jele (nyíl + függőleges vonal: |‹ és ›|)
const Chevron = ({ dir, vegig }: { dir: 'l' | 'r'; vegig?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d={dir === 'l' ? (vegig ? 'M17 6l-6 6 6 6' : 'M15 6l-6 6 6 6') : (vegig ? 'M7 6l6 6-6 6' : 'M9 6l6 6-6 6')} />
    {vegig && <path d={dir === 'l' ? 'M7 5v14' : 'M17 5v14'} />}
  </svg>
);

/**
 * Pagination (molekula): „1–25 / 312 POI” · ‹ 1 2 … 13 › · oldalméret 10 / 25 / 100.
 * Az aktuális lap `aria-current="page"`; az első/utolsó lapnál a nyíl tiltott.
 */
export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizes = [10, 25, 100], itemLabel = 'elem', label = 'Lapozás', className }: PaginationProps) {
  const sizeId = useId();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(page, pages - 1);
  const from = total ? p * pageSize + 1 : 0;
  const to = Math.min(total, (p + 1) * pageSize);
  return (
    <nav className={cx('bc-pager', 'bc-pagination', className)} aria-label={label}>
      <p className="bc-pager-info" aria-live="polite">{total ? `${fmt(from)}–${fmt(to)} / ${fmt(total)} ${itemLabel} · ${fmt(p + 1)}. oldal / ${fmt(pages)}` : `0 ${itemLabel}`}</p>
      {pages > 1 && (
        <ul className="bc-pager-pages">
          <li><IconButton aria-label="Első lap" disabled={p === 0} onClick={() => onPageChange(0)}><Chevron dir="l" vegig /></IconButton></li>
          <li><IconButton aria-label="Előző lap" disabled={p === 0} onClick={() => onPageChange(p - 1)}><Chevron dir="l" /></IconButton></li>
          {pageList(p, pages).map((n, i) =>
            n === null ? <li key={`gap${i}`} className="bc-pager-gap" aria-hidden="true">…</li> : (
              <li key={n}>
                <button type="button" className="bc-pager-num" aria-current={n === p ? 'page' : undefined} aria-label={`${n + 1}. lap`}
                  onClick={() => onPageChange(n)}>{n + 1}</button>
              </li>
            ))}
          <li><IconButton aria-label="Következő lap" disabled={p >= pages - 1} onClick={() => onPageChange(p + 1)}><Chevron dir="r" /></IconButton></li>
          <li><IconButton aria-label="Utolsó lap" disabled={p >= pages - 1} onClick={() => onPageChange(pages - 1)}><Chevron dir="r" vegig /></IconButton></li>
        </ul>
      )}
      {onPageSizeChange && (
        <div className="bc-pager-size">
          <label htmlFor={sizeId}>Sor / oldal</label>
          <select id={sizeId} className="bc-select" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {pageSizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
    </nav>
  );
}
