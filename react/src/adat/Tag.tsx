import type { ReactNode } from 'react';
import { cx } from '../cx';

export type TagProps = { children: ReactNode; icon?: ReactNode; title?: string; className?: string };

/**
 * Tag (atom, Javaslat 19): TULAJDONSÁG jelvénye (típus, kategória, címke, „Kiemelt”) – semleges, nem állapot.
 * Állapothoz (aktív, lejárt, hiba…) a StatusBadge való; így a szín mindig jelentést hordoz.
 */
export function Tag({ children, icon, title, className }: TagProps) {
  return <span className={cx('bc-badge is-tag', className)} title={title}>{icon}<span>{children}</span></span>;
}
