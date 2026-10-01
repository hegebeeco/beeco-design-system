import type { CellContext, ColumnDef } from '@tanstack/react-table';
/** Oszlop-kiegészítők (columnDef.meta): szám-oszlop jobbra igazítva, felirat a kártyanézethez és a rendezés-választóhoz */
export type DataColumnMeta = {
    num?: boolean;
    decimals?: number;
    label?: string;
    wrap?: boolean;
};
export declare const metaOf: (c: {
    columnDef: {
        meta?: unknown;
    };
}) => DataColumnMeta;
/** A projekt oszlopait úgy csomagolja, hogy a hiányzó érték mindig a lista végére kerüljön, iránytól függetlenül. */
export declare function wrapColumn<T>(c: ColumnDef<T, unknown>): ColumnDef<T, unknown>;
/** Alap cella: hiányzó → „–” (képernyőolvasónak „nincs adat”), szám → magyar formátum, hosszú szöveg → „…” + teljes szöveg rámutatásra */
export declare function DefaultCell<T>({ getValue, column }: CellContext<T, unknown>): import("react").JSX.Element;
/** Kijelölő oszlop (fejlécben: az oldal összes sora; részleges állapot –) */
export declare function selectColumn<T>(rowLabel: (r: T) => string): ColumnDef<T, unknown>;
/** Lenyitó oszlop */
export declare function expandColumn<T>(rowLabel: (r: T) => string, detailId: (id: string) => string): ColumnDef<T, unknown>;
/** A fejléc szövege (kártyanézet címkéje, rendezés-választó): meta.label, vagy a fejléc, ha szöveg */
export declare const headerText: <T>(c: {
    id: string;
    columnDef: ColumnDef<T, unknown>;
}) => string;
