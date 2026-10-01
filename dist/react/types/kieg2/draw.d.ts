/** Egy résztvevő. A nevet a projekt adja, már a megjelenítendő (pl. részben takart) alakban: „Kiss A.”, „a***@gmail.com”. */
export type DrawParticipant = {
    id: string;
    name: string;
    detail?: string;
};
/** Egy sorsolás jegyzőkönyvi sora */
export type DrawRecord = {
    winner: DrawParticipant;
    at: Date;
    /** Hányadik húzás (1 = első, 2+ = újrasorsolás) */
    attempt: number;
    /** Újrasorsolás oka (az elsőnél nincs) */
    reason?: string;
    /** A DS saját véletlenjével húzott (nem a projekt sorsolója) – csak tesztre */
    test: boolean;
    /** Hány résztvevő közül húzott */
    poolSize: number;
};
/**
 * A felfedés ütemezése (ms): lassuló „méhsejt-töltés”, lépésenként ≤ 600 ms, összesen ≤ 2,5 s a pecséttel együtt
 * (Javaslat 05: ünnepi pillanat ≤ 600 ms és egyszer). Csökkentett mozgásnál nincs lépés: azonnal a nyertes.
 */
export declare const REVEAL_STEPS: ReadonlyArray<number>;
/** A nyertes-pecsét hossza (bc-anim-stamp) */
export declare const STAMP_MS = 400;
export declare const REVEAL_TOTAL_MS: number;
/**
 * TESZT-sorsolás: egyenletes véletlen index a böngésző kriptográfiai véletlenjével (crypto.getRandomValues),
 * elutasításos mintavétellel, hogy egyik résztvevő se legyen esélyesebb (modulo-torzítás nélkül).
 * Éles sorsoláshoz a projekt saját, naplózott (szerveroldali) sorsolója kell – a DS ezt csak tartaléknak adja.
 */
export declare function cryptoIndex(n: number): number;
/** A futó szalagon látszó nevek (csak látvány, NEM a sorsolás): determinisztikus lépésköz, hogy ne ismétlődjön egymás után */
export declare function tickerNames(pool: ReadonlyArray<DrawParticipant>, count: number): string[];
/** Idő magyarul a jegyzőkönyvbe: „14:05:09” */
export declare const drawTime: (d: Date) => string;
export declare const wait: (ms: number) => Promise<void>;
