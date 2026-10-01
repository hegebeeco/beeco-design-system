/** 2 202 009 bájt → „2,1” (MB, egy tizedes; 0,1 MB alatt két tizedes, hogy ne legyen „0”) */
export declare const mbText: (bytes: number) => string;
/** Élő állapot „2,1/5 MB” – kis fájlnál kB-ban („12/68 kB”), hogy ne „0/0 MB” legyen */
export declare const sizePair: (loaded: number, total: number) => string;
/** Ismert fájltípusok: MIME → rövid név + a fájl eleji „bűvös bájtok” ellenőrzője */
type Sig = {
    name: string;
    test: (b: Uint8Array) => boolean;
};
export declare const FILE_TYPES: Record<string, Sig>;
/** A fájl valódi típusa az első bájtjai alapján (null = ismeretlen / nem engedett) */
export declare function sniffType(file: File, accept: readonly string[]): Promise<string | null>;
/** Engedett típusok szövegesen: „JPG, PNG, WebP” */
export declare const typeNames: (accept: readonly string[]) => string;
export type Rejection = {
    file: string;
    reason: string;
    next: string;
};
export type CheckOptions = {
    accept: readonly string[];
    maxSizeMB: number;
    /** Még ennyi fér (a darabszám-határból); Infinity = nincs határ */
    room?: number;
    /** A darabszám-határ (az üzenethez) */
    max?: number;
    /** Már fent lévő vagy épp töltődő fájlok kulcsai (ugyanaz a fájl kétszer) */
    known?: ReadonlySet<string>;
    /** Mit tegyen, ha a típus rossz – a projekt pontosíthatja */
    typeHint?: string;
    /** Mit tegyen, ha túl nagy */
    sizeHint?: string;
    /** Egység a darab-üzenethez: „kép”, „videó”, „fájl” */
    unit?: string;
};
/** Egyszerű kulcs az azonos fájl felismeréséhez (név + méret) */
export declare const fileKey: (f: File) => string;
/**
 * Fájlok ellenőrzése feltöltés ELŐTT: a hibás el sem indul, és mindegyikhez ok + teendő tartozik.
 * Sorrend: üres → típus (tartalom szerint) → méret → ugyanaz kétszer → darabszám (az első N indul, a többiről üzenet).
 */
export declare function checkFiles(files: readonly File[], o: CheckOptions): Promise<{
    ok: File[];
    rejected: Rejection[];
}>;
/** Feltöltő függvény, amit a projekt ad (a DS-ben nincs hálózati kód). Haladást jelez, megszakítható. */
export type UploadFn<R> = (file: File, ctx: {
    onProgress: (loaded: number) => void;
    signal: AbortSignal;
}) => Promise<R>;
/** Megszakítás felismerése (AbortController → DOMException 'AbortError') */
export declare const isAbort: (e: unknown) => boolean;
/** Hibaüzenet a projekt hibájából – ha nem ad szöveget, általános teendővel */
export declare const errorText: (e: unknown) => string;
export {};
