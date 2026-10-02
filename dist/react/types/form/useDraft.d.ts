/**
 * Piszkozat (Javaslat 13/7): a félbehagyott űrlap az eszközön (localStorage) megmarad – lefagyás, véletlen bezárás,
 * lejárt belépés után felajánljuk a visszaállítást. Csak ezen az eszközön, a böngészőben; jelszót, tokent ne tegyél bele.
 * Sikeres mentés után törlődik (az EditPage `draft` beállítása ezt magától intézi).
 */
export type DraftOptions<T> = {
    /** Egyedi kulcs: űrlap + rekord, pl. „uzenet:uj” vagy „esemeny:126”. null = kikapcsolva */
    key: string | null;
    /** Az űrlap mostani értékei (JSON-ként menthető) */
    values: T;
    /** Csak módosított űrlapot mentünk */
    dirty: boolean;
    /** Visszaállításkor ezt hívjuk (pl. react-hook-form reset(values, { keepDefaultValues: true })) */
    onRestore: (values: T) => void;
    /** Ennél régebbi piszkozatot nem ajánlunk fel (alap: 7 nap) */
    maxAgeDays?: number;
    /** Mentés késleltetése gépelés közben (alap: 800 ms) */
    debounceMs?: number;
};
type Stored<T> = {
    v: 1;
    savedAt: number;
    values: T;
};
export declare function useDraft<T>({ key, values, dirty, onRestore, maxAgeDays, debounceMs }: DraftOptions<T>): {
    draft: Stored<T> | null;
    restore: () => void;
    discard: () => void;
    clear: () => void;
};
/** „Van egy be nem fejezett változat” sáv – Visszaállítás / Elvetés */
export declare function DraftNotice({ savedAt, onRestore, onDiscard }: {
    savedAt: number;
    onRestore: () => void;
    onDiscard: () => void;
}): import("react").JSX.Element;
export {};
