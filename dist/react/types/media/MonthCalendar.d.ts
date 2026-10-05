import { type ReactElement } from 'react';
import { type CalEvent, type CalKind, type CalKindDef } from './monthEvents';
export type MonthCalendarProps<K extends string = CalKind> = {
    events: readonly CalEvent<K>[];
    /** Kezdő hónap: bármelyik nap 'YYYY-MM-DD' (alap: ma) */
    initialDate?: string;
    /** Hónapváltáskor (a projekt ekkor tölti be a hónap tartalmát): az első nap 'YYYY-MM-01' */
    onMonthChange?: (firstDay: string) => void;
    /** Napra koppintás / Enter – asztalon itt nyílhat az oldalpanel */
    onSelectDay?: (iso: string, events: CalEvent<K>[]) => void;
    /** Egy cellában legfeljebb ennyi cím, a többi „+N további” */
    maxPerDay?: number;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    /** Rejtett fajták (a jelmagyarázat szűrőként működik, ha van onHiddenChange) */
    hidden?: readonly K[];
    onHiddenChange?: (hidden: K[]) => void;
    labels?: Partial<Record<K, string>>;
    /**
     * Mely fajták szerepeljenek a jelmagyarázatban, ebben a sorrendben (alap: a három beépített + a kindDefs saját fajtái) –
     * pl. ahol csak esemény és egy másik fajta van (1.25)
     */
    kinds?: readonly K[];
    /**
     * Javaslat 20 – bővíthető fajták: a projekt saját fajtája (pl. 'kupon': { label: 'Kupon-időzítés', tone: 'neutral', icon: <… /> })
     * címkével, szerepszínnel és piktogrammal; a beépítettek is felülírhatók (pl. piktogram). Szerepszín: info, warning, success,
     * danger, neutral – a jelentést a piktogram és a felirat is viszi, nem csak a szín.
     */
    kindDefs?: Partial<Record<K, CalKindDef>>;
};
/**
 * MonthCalendar (organizmus, Javaslat 04 – 7A): havi rács hétfővel; a fajtát bal csík + szerepszín + jelmagyarázat mondja (nem csak a szín).
 * Javaslat 20: a projekt saját fajtákat adhat (kindDefs: címke, szerepszín, piktogram).
 * Billentyűzet: nyilak = nap/hét, PageUp/Down = hónap, Home/End = hét eleje/vége, Enter = a nap megnyitása.
 * Keskeny helyen (560 px alatt) pöttyös hónap + a kiválasztott nap listája.
 */
export declare function MonthCalendar<K extends string>(props: MonthCalendarProps<K> & {
    kindDefs: Partial<Record<K, CalKindDef>>;
}): ReactElement;
export declare function MonthCalendar(props: MonthCalendarProps): ReactElement;
