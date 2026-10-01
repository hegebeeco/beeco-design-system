import { type CalEvent, type CalKind } from './monthEvents';
/**
 * A naptár jelmagyarázata: minden fajta csíkkal + névvel. Ha van onHiddenChange, a tételek kapcsolók (szűrő):
 * aria-pressed = látszik-e – a bekapcsolt állapotot a pipa és a szöveg is mondja.
 */
export declare function MonthLegend({ names, hidden, onHiddenChange }: {
    names: Record<CalKind, string>;
    hidden: ReadonlySet<CalKind>;
    onHiddenChange?: (h: CalKind[]) => void;
}): import("react").JSX.Element;
/** A kiválasztott nap listája (telefonon a pöttyös hónap alatt; asztalon rejtve – ott az oldalpanel nyílik) */
export declare function MonthAgenda({ iso, events, names }: {
    iso: string;
    events: readonly CalEvent[];
    names: Record<CalKind, string>;
}): import("react").JSX.Element;
