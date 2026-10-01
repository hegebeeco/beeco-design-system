import { type ReactNode } from 'react';
import { cx } from '../cx';

/** Egy sor: címke + érték. Üres érték (null, undefined, '') helyett halvány „nincs megadva” látszik – a hiány is információ. */
export type InfoRow = { label: string; value: ReactNode; wide?: boolean };

export type InfoCardProps = {
  /** A kártya címe (h3 – a DetailPage fülei alatt a 3. szint) */
  title?: string;
  rows: ReadonlyArray<InfoRow | [string, ReactNode]>;
  /** Az üres érték szövege */
  emptyText?: string;
  /** Kártya alja: pl. „Szerkesztés” link vagy megjegyzés */
  footer?: ReactNode;
  className?: string;
};

const ures = (v: ReactNode) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

/**
 * InfoCard (molekula): címke–érték adatlap egy kártyán (dl/dt/dd). Részletoldalak „Áttekintés” fülére.
 * A hosszú szöveg tördelődik, a sortörés megmarad; telefonon a címke az érték fölött van.
 */
export function InfoCard({ title, rows, emptyText = 'nincs megadva', footer, className }: InfoCardProps) {
  return (
    <section className={cx('bc-card bc-info', className)} aria-label={title}>
      {title && <h3 className="bc-card-title">{title}</h3>}
      <dl>
        {rows.map((r) => {
          const { label, value, wide } = Array.isArray(r) ? { label: r[0], value: r[1], wide: false } : r;
          return (
            <div key={label} className={wide ? 'is-wide' : undefined}>
              <dt>{label}</dt>
              <dd>{ures(value) ? <span className="bc-muted">{emptyText}</span> : value}</dd>
            </div>
          );
        })}
      </dl>
      {footer && <div className="bc-info-foot">{footer}</div>}
    </section>
  );
}

/** InfoGrid: InfoCard-ok rácsa – a tartalom szélességéhez tördel (min. 320 px oszlop) */
export function InfoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('bc-info-grid', className)}>{children}</div>;
}
