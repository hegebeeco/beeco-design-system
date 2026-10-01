export declare function firstTabbable(root: Element | null | undefined): HTMLElement | null;
/** Kezdő fókusz egy ablakban: az első kitölthető mező (nem a súgó ⓘ), ha nincs, az első elérhető elem. */
export declare function firstField(root: Element | null | undefined): HTMLElement | null;
/**
 * Fókusz vissza oda, ahonnan a réteget megnyitották – akkor is, ha a nyitó gomb nem Radix-trigger
 * (vezérelt ablak). Ha menüpontból nyílt (a menü közben bezárult), a menü nyitógombjára tér vissza.
 */
export declare function useReturnFocus(): {
    remember(): void;
    restore(e: Event): void;
};
