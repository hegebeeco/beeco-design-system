import type { ReactNode } from 'react';
import { cx } from '../cx';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'accent';

const S = { viewBox: '0 0 24 24', width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
/** Hangnemenként saját forma – a jelentés nem csak színen múlik (színtévesztő, nyomtatás, szürkeárnyalat) */
const IKON: Record<StatusTone, ReactNode> = {
  success: <svg {...S}><path d="M5 12.5l4.5 4.5L19 7" /></svg>,
  warning: <svg {...S}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>,
  danger: <svg {...S}><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17.2v.3" /></svg>,
  info: <svg {...S}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.8v.3" /></svg>,
  muted: <svg {...S}><circle cx="12" cy="12" r="3.5" /></svg>,
  accent: <svg {...S}><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" /></svg>,
};

export type StatusBadgeProps = {
  tone: StatusTone;
  /** A felirat – mindig szöveg is (pl. „Időzített”, „Megoldva”) */
  children: ReactNode;
  /** Saját piktogram a hangnem alapértelmezése helyett; null = nincs piktogram (pl. nagyon szűk helyen – kerüld) */
  icon?: ReactNode | null;
  /** Súgó (title) – pl. mikor jár le */
  title?: string;
  className?: string;
};

/**
 * StatusBadge (atom, Javaslat 13/5): állapotjelvény hangnem + piktogram + felirat. A `bc-badge is-<hangnem>` színeit használja,
 * de a piktogram miatt szín nélkül is olvasható. Egy állapotszótárt (állapot → hangnem + felirat) érdemes a projektben egy helyen tartani:
 * `const ALLAPOT = { ACTIVE: ['success', 'Aktív'], … } as const` → `<StatusBadge tone={ALLAPOT[s][0]}>{ALLAPOT[s][1]}</StatusBadge>`.
 */
export function StatusBadge({ tone, children, icon, title, className }: StatusBadgeProps) {
  const ikon = icon === undefined ? IKON[tone] : icon;
  return (
    <span className={cx('bc-badge bc-status', `is-${tone}`, className)} title={title}>
      {ikon}
      <span>{children}</span>
    </span>
  );
}
