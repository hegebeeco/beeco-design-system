import type { ReactNode } from 'react';
/** Összefésülés – tiszta logika: egyezés, üresség, kijelzés, eredmény. */
export type MergeRecord = {
    id: string;
    /** Rövid név a választásnál: „A · #1204” */
    label: string;
    /** Pl. létrehozás dátuma, kitöltöttség */
    meta?: ReactNode;
    values: Record<string, unknown>;
};
export type MergeFieldDef = {
    key: string;
    label: string;
    /** Nem lehet üres az eredményben (pl. név) */
    required?: boolean;
    /** Saját kijelzés (pl. dátum, koordináta) */
    format?: (v: unknown) => ReactNode;
};
/** Üres: null, undefined, csak szóköz, üres lista */
export declare const isBlank: (v: unknown) => boolean;
/** Két érték egyezik-e (szóköz a szélén és üres/hiányzó nem számít eltérésnek) */
export declare const sameValue: (a: unknown, b: unknown) => boolean;
/** Alap kijelzés: lista vesszővel, igen/nem, tizedes vessző */
export declare function showValue(v: unknown): string;
/** Mely mezők térnek el a rekordok között */
export declare const differing: (records: MergeRecord[], fields: MergeFieldDef[]) => MergeFieldDef[];
/**
 * Javaslat: ha csak egy rekordban van kitöltve, azt; ha több kitöltött érték eltér, nem dönt helyetted.
 * A már meghozott döntéseket nem írja felül.
 */
export declare function suggest(records: MergeRecord[], fields: MergeFieldDef[], choices: Record<string, string>): {
    [x: string]: string;
};
/** Az eredmény: egyező mezőnél a közös érték, eltérőnél a választott rekordé (undefined = még nincs döntés) */
export declare function mergedValues(records: MergeRecord[], fields: MergeFieldDef[], choices: Record<string, string>): Record<string, unknown>;
