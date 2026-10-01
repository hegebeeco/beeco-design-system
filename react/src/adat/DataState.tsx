import type { ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { EmptyState } from './EmptyState';

export type DataStatus = 'ready' | 'loading' | 'empty' | 'error' | 'forbidden';

export type DataStateProps = {
  status: DataStatus;
  /** Mit töltünk („a partnereket”) – a töltés- és hibaszövegbe kerül */
  what?: string;
  /** Hibaüzenet – alapból: „Nem sikerült betölteni …” */
  error?: string;
  onRetry?: () => void;
  /** Az újrapróbálás folyamatban (a gomb nem nyomható kétszer) */
  retrying?: boolean;
  /** Üres állapot (EmptyState) – alapból „Még nincs adat” */
  empty?: ReactNode;
  /** Töltés közben ez látszik (pl. csontváz) – alapból pörgő + szöveg */
  skeleton?: ReactNode;
  children?: ReactNode;
};

/**
 * DataState (molekula): töltés / üres / hiba (újrapróbálás) / nincs jogosultság / kész – egy kapcsoló.
 * A hiba `role="alert"`, a töltés `role="status"` – a képernyőolvasó is hallja.
 */
export function DataState({ status, what = 'az adatokat', error, onRetry, retrying, empty, skeleton, children }: DataStateProps) {
  if (status === 'ready') return <>{children}</>;
  if (status === 'loading')
    return skeleton ? <div role="status" aria-label={`Betöltöm ${what}…`}>{skeleton}</div> : (
      <div className="bc-state" role="status"><span className="bc-spinner" aria-hidden="true" /> Betöltöm {what}…</div>
    );
  if (status === 'empty') return <>{empty ?? <EmptyState compact title="Még nincs adat">Ha lesz, itt látod.</EmptyState>}</>;
  if (status === 'forbidden')
    return <div className="bc-alert is-warning bc-state-box"><p><strong>Ehhez nincs jogosultságod.</strong> Ha szükséged van rá, kérj hozzáférést egy admintól.</p></div>;
  return (
    <div className="bc-alert is-danger bc-state-box" role="alert">
      <p><strong>{error ?? `Nem sikerült betölteni ${what}.`}</strong> Ellenőrizd a kapcsolatot, és próbáld újra.</p>
      {onRetry && <Button variant="secondary" size="sm" busy={retrying} onClick={onRetry}>Újrapróbálás</Button>}
    </div>
  );
}

/** SkeletonRows (atom): csontváz-sorok a táblázat törzsében – a fejléc marad, a sorok helyén `rows` szürke sáv. */
export function SkeletonRows({ rows = 5, cols }: { rows?: number; cols: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} className="bc-skel-row" aria-hidden="true">
          {Array.from({ length: cols }, (_, c) => <td key={c}><span className="bc-skeleton" style={{ width: `${55 + ((r * 7 + c * 13) % 40)}%` }} /></td>)}
        </tr>
      ))}
    </>
  );
}

export type DataNoteProps = { title?: string; children: ReactNode; tone?: 'info' | 'warning'; className?: string };

/** DataNote (molekula): oldalszintű adat-megjegyzés (mit számol az oldal, mi hiányzik) – `bc-alert is-info`. */
export function DataNote({ title, children, tone = 'info', className }: DataNoteProps) {
  return (
    <aside className={cx('bc-alert', `is-${tone}`, 'bc-note', className)} aria-label={title ?? 'Megjegyzés az adatokhoz'}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>
      <div>{title && <strong>{title}</strong>}<div className="bc-note-body">{children}</div></div>
    </aside>
  );
}
