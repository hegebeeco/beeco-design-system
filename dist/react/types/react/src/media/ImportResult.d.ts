export type ImportIssue = {
    /** Az Excel sorszáma (ahogy az Excelben látszik, a fejléccel együtt számolva) */
    row: number;
    /** Oszlop neve vagy betűje, ha ismert */
    column?: string;
    /** Mi a baj – ha a backend nem adja meg, üres */
    reason?: string;
    /** Mit tegyél */
    next?: string;
    level: 'error' | 'warning';
};
export type ImportSummary = {
    total: number;
    imported: number;
    issues: readonly ImportIssue[];
};
export type ImportResultProps = {
    result: ImportSummary;
    /** A letöltött lista fájlneve */
    fileName?: string;
    /** Egyszerre ennyi sor látszik (a többi a letöltött/másolt listában) */
    limit?: number;
};
/** A lista táblázatként (Excelbe illeszthető / letölthető) */
export declare const issuesToCsv: (issues: readonly ImportIssue[], sep?: string) => string;
/**
 * ImportResult (organizmus, Javaslat 04 – 5B): az import eredménye – összesítő + a hibás sorok listája
 * (sor, oszlop, ok, teendő), másolható és letölthető. A szint szöveggel is ott van, nem csak színnel.
 */
export declare function ImportResult({ result, fileName, limit }: ImportResultProps): import("react").JSX.Element;
