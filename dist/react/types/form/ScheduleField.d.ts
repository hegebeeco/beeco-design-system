/** Időzítés: kezdés (nap + idő) és elhagyható vég. null nap = „azonnal” (kezdésnél) / „nincs vége” (végnél). */
export type ScheduleValue = {
    date: string | null;
    time: string | null;
    endDate?: string | null;
    endTime?: string | null;
};
/**
 * Az időzítés ellenőrzése (a mező és a projekt validációja ugyanezt mondja): múltbeli kezdés, a kezdés előtti vagy már elmúlt vég.
 * Visszaad: { start?, end? } – magyar mondat, a következő lépéssel.
 */
export declare function scheduleIssues(v: ScheduleValue, now?: Date): {
    start?: string;
    end?: string;
};
export type ScheduleFieldProps = {
    value: ScheduleValue;
    onChange: (v: ScheduleValue) => void;
    /** A kezdés címkéje (pl. „Megjelenés”) */
    label?: string;
    help?: string;
    /** Vég (lejárat) is – elhagyható mező */
    withEnd?: boolean;
    endLabel?: string;
    endHelp?: string;
    /** Feliratok: „Azonnal” / „Időzítve” */
    nowLabel?: string;
    laterLabel?: string;
    /** Külső hibák (pl. a szerverről); ha nincs, a mező a scheduleIssues szerint maga jelez, de csak megadott időpontnál */
    error?: string;
    endError?: string;
    /** Ne jelezzen magától (ha a projekt az EditPage hibaösszesítőjén át mutatja) */
    silent?: boolean;
};
/**
 * ScheduleField (molekula, Javaslat 13/4): „Azonnal / Időzítve” + nap és idő, elhagyható véggel (lejárat).
 * DatePicker + SegmentedControl-ból; a múltbeli kezdést és a kezdés előtti véget a mezőnél jelzi (scheduleIssues).
 * Az „Azonnal” a napot és az időt törli (a projekt üres kezdésként menti).
 */
export declare function ScheduleField({ value, onChange, label, help, withEnd, endLabel, endHelp, nowLabel, laterLabel, error, endError, silent }: ScheduleFieldProps): import("react").JSX.Element;
