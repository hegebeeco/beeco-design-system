import type { CellContext, ColumnDef } from '@tanstack/react-table';
/** Oszlop-kiegészítők (columnDef.meta): szám-oszlop jobbra igazítva, felirat a kártyanézethez és a rendezés-választóhoz */
export type DataColumnMeta = {
    num?: boolean;
    decimals?: number;
    label?: string;
    wrap?: boolean;
    /** Fontosság (Javaslat 15, 3.1): szűk helyen előbb a 3-as, majd a 2-es oszlop kerül a sor „Részletek” lenyitójába. 1 / nincs = mindig látszik. */
    priority?: 1 | 2 | 3;
    /** Jobbra rögzített oszlop (pl. sorműveletek): széles táblán is mindig látszik, a DOM-sorrendben a sor végén marad */
    pinEnd?: boolean;
    /** Szerep a telefonos kártyán (Javaslat 15, 3.2): title = fejléc, badge = a cím mellett, main = fő adat, detail = a „Részletek” lenyitóban */
    card?: 'title' | 'badge' | 'main' | 'detail';
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
