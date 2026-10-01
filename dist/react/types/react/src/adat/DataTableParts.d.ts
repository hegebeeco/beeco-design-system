import { type ReactNode } from 'react';
import type { Header } from '@tanstack/react-table';
/** SortHeader (atom): rendezés-gomb a fejlécben; az állapotot a <th aria-sort> mondja, a nyíl csak rajz. Enter/Szóköz: ▲ → ▼ → nincs. */
export declare function SortHeader({ label, sorted, onToggle }: {
    label: ReactNode;
    sorted: false | 'asc' | 'desc';
    onToggle: () => void;
}): import("react").JSX.Element;
/** SelectCell (atom): sor- vagy fejléc-jelölő, 44 px-es kattintható terület; a fejlécnél részleges állapot (–) is. */
export declare function SelectCell({ checked, indeterminate, disabled, label, onChange }: {
    checked: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    label: string;
    onChange: () => void;
}): import("react").JSX.Element;
/** ExpandToggle (atom): sor lenyitása – aria-expanded + aria-controls a részletek sorára. */
export declare function ExpandToggle({ expanded, controls, label, onToggle }: {
    expanded: boolean;
    controls: string;
    label: string;
    onToggle: () => void;
}): import("react").JSX.Element;
/** ColumnResizer (atom): oszlopszélesség húzással (egér, érintés) ÉS billentyűzettel (← → 16 px, Home = alapméret). */
export declare function ColumnResizer<T>({ header, label }: {
    header: Header<T, unknown>;
    label: string;
}): import("react").JSX.Element;
export type BulkBarProps = {
    count: number;
    max?: number;
    itemLabel: string;
    notice?: string;
    onClear: () => void;
    children?: ReactNode;
};
/** BulkBar (molekula): kijelöléskor a táblázat fölött (1b A), görgetéskor odatapad. Darabszám + „Kijelölés törlése” + a projekt műveletei. */
export declare function BulkBar({ count, max, itemLabel, notice, onClear, children }: BulkBarProps): import("react").JSX.Element;
