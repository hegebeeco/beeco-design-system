/** Magyar számformátum: ezres tagolás szóközzel (keskeny szóköz nélkül, hogy gépelhető legyen), tizedes vessző. */
export declare function formatHu(n: number | null, decimals: number): string;
/** Beírt szövegből szám: vesszőt és pontot is tizedesjelnek vesz, a szóközt eldobja. Üres → null. */
export declare function parseHu(text: string): number | null;
/**
 * Gépelés közbeni szűrő: csak számjegy, EGY tizedesjel (ha decimals > 0) és elöl mínusz (ha min < 0).
 * A tiltott karaktert el sem fogadja – a mező „letiltja” a helytelen bevitelt.
 */
export declare function sanitize(text: string, decimals: number, allowNegative: boolean): string;
/** Tartomány szövegesen: „0–100 %”, „legalább 1 db”, „legfeljebb 5 000 Ft” */
export declare function numberRange(min?: number, max?: number, unit?: string, decimals?: number): string | undefined;
