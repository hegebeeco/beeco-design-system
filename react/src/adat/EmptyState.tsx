import type { ReactNode } from 'react';
import { cx } from '../cx';

export type EmptyStateProps = {
  /** Egy rövid mondat: mi a helyzet („Nincs találat”) */
  title: string;
  /** Egy mondat magyarázat: miért üres, mi a következő lépés */
  children?: ReactNode;
  /** Egy teendő (pl. „Szűrők törlése” gomb) – üres állapot teendő nélkül nem jó (docs/komponensek.md 3.4) */
  action?: ReactNode;
  /** Kép helye (pl. méhecske) – a képet a projekt adja; a DS-csomag most nem tesz bele képet */
  illustration?: ReactNode;
  /** Kisebb változat (táblázatsorban, grafikon helyén) */
  compact?: boolean;
  className?: string;
};

/** EmptyState (molekula): kép-hely + egy mondat + magyarázat + egy teendő. A `bc-empty` elemre épül. */
export function EmptyState({ title, children, action, illustration, compact, className }: EmptyStateProps) {
  return (
    <div className={cx('bc-empty', compact && 'is-compact', className)}>
      {illustration && <div className="bc-empty-art" aria-hidden="true">{illustration}</div>}
      <strong>{title}</strong>
      {children && <p className="bc-empty-text">{children}</p>}
      {action && <div className="bc-row">{action}</div>}
    </div>
  );
}
