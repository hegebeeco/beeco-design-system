import { type ReactNode } from 'react';
export type FilterOption = {
    value: string;
    label: string;
};
export type FilterDef = {
    id: string;
    /** Látható címke: „Kupon” */
    label: string;
    options: ReadonlyArray<FilterOption>;
    /** Többes választás (keresős legördülő, címkékkel) */
    multiple?: boolean;
    /** Súgó (ⓘ) – a szűrősávban nem kötelező (jóváhagyva 2026-10-01) */
    help?: ReactNode;
    /** Az „összes” opció szövege egyes szűrőnél – alap: „mindegy” */
    anyLabel?: string;
    /** Függő szűrő: ha a szülő változik vagy törlődik, ez is törlődik (pl. kategória → alkategória) */
    parent?: string;
    loading?: boolean;
    loadError?: string;
    onRetry?: () => void;
};
export type FilterValue = string | string[] | null | undefined;
/** Egy szűrő: egyes → natív választó („mindegy” opcióval), többes → keresős legördülő (01 Combobox). */
export declare function FilterControl({ def, value, onChange }: {
    def: FilterDef;
    value: FilterValue;
    onChange: (v: FilterValue) => void;
}): import("react").JSX.Element;
/** Aktív szűrő címkéje: „Kupon: van ×” · többesnél „Címke: bio +3 ×” – egy koppintással törölhető */
export declare function FilterChip({ text, onRemove }: {
    text: string;
    onRemove: () => void;
}): import("react").JSX.Element;
/** A szűrő értékének rövid szövege a címkéhez; null, ha nem aktív */
export declare function chipText(def: FilterDef, value: FilterValue): string | null;
