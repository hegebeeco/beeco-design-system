import type { ReactNode } from 'react';
import { type CalEvent } from './monthEvents';
/** Egy fajta megjelenése a naptárban: név, szerepszín, piktogram (a MonthCalendar számolja ki) */
export type KindView = {
    label: string;
    tone: string;
    icon?: ReactNode;
};
/**
 * A naptár jelmagyarázata: minden fajta csíkkal + névvel (+ piktogrammal). Ha van onHiddenChange, a tételek kapcsolók (szűrő):
 * aria-pressed = látszik-e – a bekapcsolt állapotot a pipa és a szöveg is mondja.
 */
export declare function MonthLegend<K extends string>({ kinds, view, hidden, onHiddenChange }: {
    kinds: readonly K[];
    view: (k: K) => KindView;
    hidden: ReadonlySet<K>;
    onHiddenChange?: (h: K[]) => void;
}): import("react").JSX.Element;
/** A kiválasztott nap listája (telefonon a pöttyös hónap alatt; asztalon rejtve – ott az oldalpanel nyílik) */
export declare function MonthAgenda<K extends string>({ iso, events, view }: {
    iso: string;
    events: readonly CalEvent<K>[];
    view: (k: K) => KindView;
}): import("react").JSX.Element;
