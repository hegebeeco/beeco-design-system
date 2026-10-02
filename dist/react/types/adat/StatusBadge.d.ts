import type { ReactNode } from 'react';
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'accent';
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
export declare function StatusBadge({ tone, children, icon, title, className }: StatusBadgeProps): import("react").JSX.Element;
