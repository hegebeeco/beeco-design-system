import type { ReactNode } from 'react';
import { cx } from '../cx';

/** FormSection (organizmus): cím + rövid leírás + mezőrács egy kártyán; hosszú űrlap tagolására. */
export function FormSection({ title, description, children, className }: { title: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx('bc-card', className)} aria-label={title}>
      <h2 className="bc-card-title">{title}</h2>
      {description && <p className="bc-muted" style={{ marginTop: 'calc(-1 * var(--bc-sp-2))' }}>{description}</p>}
      <div className="bc-form-grid">{children}</div>
    </section>
  );
}

/** FormActions (molekula): a jobb oldalon a fő művelet, előtte a mégse; telefonon egymás alatt, teljes szélességben. */
export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('bc-form-actions', className)}>{children}</div>;
}
