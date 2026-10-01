import type { ReactNode } from 'react';
/** Egy mező változása: előtte → utána (üres/hiányzó érték: null) */
export type ActivityChange = {
    field: string;
    before?: ReactNode;
    after?: ReactNode;
};
export type ActivityItem = {
    id: string;
    /** Mikor – ISO (UTC) vagy Date; a felület helyi időben mutatja */
    at: string | Date;
    /** Ki: „Kovács Anna”, „Rendszer” */
    who: string;
    /** Mit tett, igével: „módosította”, „létrehozta”, „jóváhagyta” */
    action: string;
    /** Min: „a Zöld Sarok Bolt adatlapját” */
    target?: ReactNode;
    /** Mezőszintű különbség – lenyitható */
    changes?: ActivityChange[];
    /** A pötty színe (a szöveg mondja a jelentést, a szín csak kiegészít) */
    tone?: 'success' | 'danger' | 'warning' | 'info';
};
export type DayGroup = {
    key: string;
    label: string;
    items: ActivityItem[];
};
/** Helyi naptári nap kulcsa: 2026-10-01 */
export declare const dayKey: (d: Date) => string;
/** „Ma”, „Tegnap”, különben „2026. szeptember 28., vasárnap” */
export declare function dayLabel(d: Date, now?: Date): string;
/** „14:05” – ismeretlen időnél „–” */
export declare const timeLabel: (d: string | Date) => string;
/** A <time dateTime> értéke (UTC ISO), ismeretlen időnél undefined */
export declare const isoOf: (d: string | Date) => string | undefined;
/** Napok szerint csoportosít, legújabb elöl (egyenlő időnél a megadott sorrend marad) */
export declare function groupByDay(items: ActivityItem[], now?: Date): DayGroup[];
