/** Dátum-segédek. Az érték mindig HELYI naptári nap 'YYYY-MM-DD' szövegként – nincs időzóna-csúszás. */
export declare const MONTHS: string[];
export declare const WEEKDAYS: string[];
export declare const WEEKDAYS_LONG: string[];
export declare const toIso: (d: Date) => string;
export declare const fromIso: (s: string) => Date;
export declare const todayIso: () => string;
/** Magyar kiírás: 2026. 10. 01. */
export declare const formatHuDate: (iso: string | null) => string;
/** Beírt szövegből dátum: „2026. 10. 01.”, „2026.10.1”, „2026-10-01”, „20261001”. Érvénytelen (pl. 2026.02.30) → null. */
export declare function parseHuDate(text: string): string | null;
/** A hónap naptárrácsa: 6 hét × 7 nap, hétfővel kezdve */
export declare function monthGrid(year: number, month: number): Date[];
export declare const addDays: (iso: string, n: number) => string;
export declare const addMonths: (iso: string, n: number) => string;
export declare const inRange: (iso: string, min?: string, max?: string) => boolean;
/** Helyi nap + óra:perc → UTC ISO a szervernek (az óraátállítást a böngésző kezeli) */
export declare const localToUtcIso: (date: string, time?: string) => string;
/** Szerver UTC ISO → helyi nap és idő a mezőnek */
export declare const utcToLocal: (iso: string) => {
    date: string;
    time: string;
};
