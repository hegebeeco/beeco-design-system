/** Nyitvatartás – adat és ellenőrzés. Ma napi EGY sáv, éjfél utáni zárás nélkül (az admin adatmodellje: start, end, is_closed). */
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export declare const WEEK: ReadonlyArray<{
    key: Weekday;
    label: string;
}>;
export type DayHours = {
    open: boolean;
    from: string | null;
    to: string | null;
};
export type OpeningHours = Record<Weekday, DayHours>;
/**
 * Beírt időből „HH:mm”: „8” → 08:00, „830” / „0830” / „8.30” → 08:30, „6pm” → 18:00, „24” → 24:00 (éjfélig).
 * Érvénytelen (pl. „25:00”, „8:75”) → null.
 */
export declare function parseTime(text: string): string | null;
/** Soronkénti hibák (a következő lépéssel); üres objektum = rendben */
export declare function validateHours(v: OpeningHours): Partial<Record<Weekday, string>>;
/** Üres hét: minden nap zárva, idő nélkül */
export declare const emptyWeek: () => OpeningHours;
