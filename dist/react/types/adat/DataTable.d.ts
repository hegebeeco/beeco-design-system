import { type ReactNode } from 'react';
import { type ColumnDef, type PaginationState, type RowSelectionState, type SortingState } from '@tanstack/react-table';
export type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T, any>[];
    /** A táblázat neve (képernyőolvasó, görgethető terület neve); `captionVisible` → látható cím */
    caption: string;
    captionVisible?: boolean;
    getRowId: (row: T) => string;
    /** Sor emberi neve (jelölő és lenyitó felirata): „Kijelölés: Zöld Sarok” */
    rowLabel: (row: T) => string;
    /** Mit listázunk: „1–25 / 312 POI” */
    itemLabel?: string;
    status?: 'ready' | 'loading' | 'error' | 'forbidden';
    error?: string;
    onRetry?: () => void;
    /** Frissítés közben: a régi adat látszik, felül vékony töltésjel */
    refreshing?: boolean;
    /** Üres állapot (0 sor) – teendővel; szűrésre üresnél „Szűrők törlése” */
    empty?: ReactNode;
    sorting?: SortingState;
    onSortingChange?: (s: SortingState) => void;
    selectable?: boolean;
    selection?: RowSelectionState;
    onSelectionChange?: (s: RowSelectionState) => void;
    /** Kijelölés felső határa (POI: 200) – fölötte szól és nem jelöl */
    maxSelection?: number;
    /** Tömeges műveletek gombjai – a kijelölt sorok azonosítóit kapja */
    bulkActions?: (ids: string[], clear: () => void) => ReactNode;
    renderExpanded?: (row: T) => ReactNode;
    canExpand?: (row: T) => boolean;
    resizable?: boolean;
    pagination?: PaginationState;
    onPaginationChange?: (p: PaginationState) => void;
    pageSizes?: number[];
    /** Szerveroldali rendezés + lapozás: a szerver adja a sorokat és az összes darabszámot */
    serverRowCount?: number;
    density?: 'comfortable' | 'dense';
    onDensityChange?: (d: 'comfortable' | 'dense') => void;
    /** Sűrűség-kapcsoló a sávban (alap: igen) */
    densityToggle?: boolean;
    /** Kezdő sűrűség, ha nem vezérelt (Javaslat 19) – pl. admin-táblákon 'dense' */
    defaultDensity?: 'comfortable' | 'dense';
    /** Keret és árnyék nélkül – kártyába, panelbe ágyazva (Javaslat 19) */
    bare?: boolean;
    /** Telefonon: 'scroll' (alap, rögzített első oszlop) vagy 'cards' (soronként kártya) */
    mobile?: 'scroll' | 'cards';
    /** Extra elemek a táblázat fölötti sávban (jobbra) */
    toolbar?: ReactNode;
    /** A görgethető terület legnagyobb magassága (rögzített fejléc) – alap: 70vh */
    maxHeight?: string;
};
/** Mely oszlopok rejtőzzenek el (a „Részletek” lenyitóba kerülnek): kártyán a `card: 'detail'`, széles nézetben a prioritás szerint, amíg nem fér el */
export declare function rejtettOszlopok(oszlopok: ReadonlyArray<{
    id: string;
    size: number;
    priority?: 1 | 2 | 3;
    card?: string;
}>, szelesseg: number, kartya: boolean, segedSzam: number): string[];
export declare function DataTable<T>(p: DataTableProps<T>): import("react").JSX.Element;
