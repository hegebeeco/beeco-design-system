import { useId, useMemo, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { DataState, type DataStatus } from '../adat/DataState';
import { EmptyState } from '../adat/EmptyState';
import { ChevronIcon } from './icons';
import { groupByDay, isoOf, timeLabel, type ActivityChange, type ActivityItem } from './activity';

export type TimelineProps = {
  items: ActivityItem[];
  /** Töltés / hiba / jogosultság – a DataState kapcsolja (alap: ready) */
  status?: Exclude<DataStatus, 'empty'>;
  onRetry?: () => void;
  /** Kezdetben ennyi bejegyzés látszik; a „Még …” gomb ennyivel bővít (alap 10) */
  pageSize?: number;
  /** Szerveroldali folytatás: ha van, a „Még …” ezt hívja (a hívó fűzi az items végére) */
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  /** Mihez képest „Ma”/„Tegnap” (teszteléshez) */
  now?: Date;
  /** Üres állapot – alapból „Még nincs bejegyzés” */
  empty?: ReactNode;
  /** A lista neve képernyőolvasónak: „Partner-aktivitás” */
  label?: string;
  className?: string;
};

const Empty = () => <span className="bc-tl-empty">(üres)</span>;
const isEmpty = (v: ReactNode) => v === null || v === undefined || v === '';

function Changes({ changes }: { changes: ActivityChange[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="bc-tl-changes">
      <button type="button" className="bc-tl-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <ChevronIcon open={open} />
        {changes.length} mező változott
      </button>
      {open && (
        <dl id={id} className="bc-tl-diff bc-anim-rise">
          {changes.map((c, i) => (
            <div key={i} className="bc-tl-diff-row">
              <dt>{c.field}</dt>
              <dd>
                <del><span className="bc-sr">előtte: </span>{isEmpty(c.before) ? <Empty /> : c.before}</del>
                <span aria-hidden="true" className="bc-tl-arrow">→</span>
                <ins><span className="bc-sr">, utána: </span>{isEmpty(c.after) ? <Empty /> : c.after}</ins>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/**
 * Timeline / ActivityLog (organizmus, Javaslat 06a/8): ki · mit · mikor, napok szerint („Ma”, „Tegnap”, dátum),
 * mezőszintű különbség (előtte → utána) lenyitva, „Még …” bővítés (helyi vagy szerveroldali).
 */
export function Timeline({ items, status = 'ready', onRetry, pageSize = 10, onLoadMore, hasMore, loadingMore, now, empty, label = 'Előzmények', className }: TimelineProps) {
  const [shown, setShown] = useState(pageSize);
  const visible = onLoadMore ? items : items.slice(0, shown);
  const groups = useMemo(() => groupByDay(visible, now), [visible, now]);
  const rest = onLoadMore ? 0 : items.length - visible.length;
  const more = onLoadMore ? hasMore : rest > 0;

  return (
    <DataState status={status === 'ready' && items.length === 0 ? 'empty' : status} what="az előzményeket" onRetry={onRetry}
      empty={empty ?? <EmptyState compact title="Még nincs bejegyzés">Ha valaki módosít valamit, itt látod: ki, mit és mikor.</EmptyState>}>
      <div className={cx('bc-tl', className)} role="region" aria-label={label}>
        {groups.map((g) => (
          <div key={g.key} className="bc-tl-day">
            <h3 className="bc-tl-day-h">{g.label}</h3>
            <ol className="bc-tl-list">
              {g.items.map((it) => (
                <li key={it.id} className="bc-tl-item" data-tone={it.tone}>
                  <time className="bc-tl-time" dateTime={isoOf(it.at)}>{timeLabel(it.at)}</time>
                  <p className="bc-tl-text"><strong>{it.who}</strong> {it.action}{it.target ? <> {it.target}</> : null}</p>
                  {it.changes && it.changes.length > 0 && <Changes changes={it.changes} />}
                </li>
              ))}
            </ol>
          </div>
        ))}
        {(more || items.length > pageSize) && (
          <div className="bc-tl-more">
            <span className="bc-tl-count" role="status">{visible.length}{onLoadMore ? '' : `/${items.length}`} bejegyzés látszik</span>
            {more && (
              <Button variant="secondary" size="sm" busy={loadingMore} onClick={() => (onLoadMore ? onLoadMore() : setShown((s) => s + pageSize))}>
                {onLoadMore ? 'Még több bejegyzés' : `Még ${Math.min(pageSize, rest)} bejegyzés`}
              </Button>
            )}
          </div>
        )}
      </div>
    </DataState>
  );
}
