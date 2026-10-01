/**
 * Közös réteg-segédek.
 * - A modális réteg (ablak, fiók) a „kívül kattintást” bezárásnak veszi. Az értesítés (Toaster) viszont
 *   a réteg fölött él, és a „Visszavonás” gombja nem zárhatja be az ablakot – ezért onnan jövő kattintást átengedünk.
 */
type OutsideEvent = {
    target: EventTarget | null;
    preventDefault: () => void;
};
export declare function keepToasts(e: OutsideEvent): void;
/** Média-lekérdezés figyelése (pl. '(max-width: 900px)') – szerveroldalon és az első rajzoláskor false. */
export declare function useMedia(query: string): boolean;
export {};
