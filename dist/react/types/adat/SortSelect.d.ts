import type { Table } from '@tanstack/react-table';
/**
 * Rendezés-választó a kártyanézethez (mobile="cards"): ott nincs fejléc, ezért a rendezés egy natív választóból jön.
 * Nézetvezérlő, nem adatbevitel – ezért nincs súgója (mint a SegmentedControl-nak). Csak keskeny tárolóban látszik (CSS).
 * Ha egyetlen oszlop sem rendezhető, nem jelenik meg (különben egyetlen „Nincs rendezés” opció állna benne – Javaslat 15).
 */
export declare function SortSelect<T>({ table }: {
    table: Table<T>;
}): import("react").JSX.Element | null;
