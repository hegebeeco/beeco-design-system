import { type CalEvent, type CalKind } from './monthEvents';
export type MonthCalendarProps = {
    events: readonly CalEvent[];
    /** Kezdő hónap: bármelyik nap 'YYYY-MM-DD' (alap: ma) */
    initialDate?: string;
    /** Hónapváltáskor (a projekt ekkor tölti be a hónap tartalmát): az első nap 'YYYY-MM-01' */
    onMonthChange?: (firstDay: string) => void;
    /** Napra koppintás / Enter – asztalon itt nyílhat az oldalpanel */
    onSelectDay?: (iso: string, events: CalEvent[]) => void;
    /** Egy cellában legfeljebb ennyi cím, a többi „+N további” */
    maxPerDay?: number;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    /** Rejtett fajták (a jelmagyarázat szűrőként működik, ha van onHiddenChange) */
    hidden?: readonly CalKind[];
    onHiddenChange?: (hidden: CalKind[]) => void;
    labels?: Partial<Record<CalKind, string>>;
};
/**
 * MonthCalendar (organizmus, Javaslat 04 – 7A): havi rács hétfővel; a fajtát bal csík + szerepszín + jelmagyarázat mondja (nem csak a szín).
 * Billentyűzet: nyilak = nap/hét, PageUp/Down = hónap, Home/End = hét eleje/vége, Enter = a nap megnyitása.
 * Keskeny helyen (560 px alatt) pöttyös hónap + a kiválasztott nap listája.
 */
export declare function MonthCalendar({ events, initialDate, onMonthChange, onSelectDay, maxPerDay, loading, error, onRetry, hidden, onHiddenChange, labels }: MonthCalendarProps): import("react").JSX.Element;
