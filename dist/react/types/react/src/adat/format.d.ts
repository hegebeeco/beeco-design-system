/** Magyar számformátum (1 234,5) – null/NaN → „–”. A tizedesek száma legfeljebb `decimals`, a felesleges 0 elmarad. */
export declare function fmt(n: number | null | undefined, decimals?: number): string;
/** Előjeles szám (+12, −3,5) – a változás-kijelzéshez */
export declare const fmtSigned: (n: number, decimals?: number) => string;
/** Ékezet- és kisbetű-független szöveg-egyezés („kave” → „Kávézó”) – szűrőkhöz, keresőhöz. Csak szóköz = nincs szűrés. */
export declare function matchText(haystack: string, query: string): boolean;
/**
 * „Szép” tengelybeosztás: 1 / 2 / 5 × 10^k lépés, a 0 mindig benne (oszlopnál a tengely 0-tól indul).
 * Minden érték 0 vagy nincs adat → 0–1 skála (nem osztunk nullával).
 */
export declare function niceTicks(min: number, max: number, count?: number): {
    lo: number;
    hi: number;
    step: number;
    ticks: number[];
    decimals: number;
};
/** Lineáris leképezés [d0, d1] → [r0, r1] */
export declare const linear: (d0: number, d1: number, r0: number, r1: number) => (v: number) => number;
/** Minden hányadik tengelyfeliratot írjuk ki, hogy ne érjenek össze (30 / 90 / 365 nap) */
export declare const labelEvery: (count: number, width: number, minPx: number) => number;
/** Hosszú címke rövidítése „…”-val (a teljes szöveg <title>-ben és az adattáblában marad) */
export declare const clip: (s: string, max: number) => string;
/** Lapozó számai: 1 … 4 5 6 … 13 – a „…” helyén null */
export declare function pageList(page: number, total: number, siblings?: number): Array<number | null>;
