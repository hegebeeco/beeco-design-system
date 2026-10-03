import { type ReactNode } from 'react';
import { type FilterDef, type FilterValue } from './FilterControls';
export type FilterValues = Record<string, FilterValue>;
export type FilterBarProps = {
    /** Kereső (a SearchBox késleltetve hívja az onChange-et – a lista nem villog gépelés közben) */
    search?: {
        label: string;
        value: string;
        onChange: (v: string) => void;
        placeholder?: string;
    };
    filters: FilterDef[];
    values: FilterValues;
    onChange: (values: FilterValues) => void;
    /** Találatok száma; null = most számolunk */
    resultCount?: number | null;
    itemLabel?: string;
    /** További vezérlők (pl. időszak-választó) a szűrők mellett */
    extra?: ReactNode;
    /** Ez alatt a szélesség alatt „Szűrők (N)” gomb + panel (2B) */
    narrowBelow?: number;
    className?: string;
};
/**
 * FilterBar (organizmus, Javaslat 02 – 2B): kereső + szűrők + aktív-szűrő címkék + „Szűrők törlése” + találatszám.
 * Széles helyen soros; keskenyen „Szűrők (N)” gomb és panel, alján a találatszámmal. A régi linkből jött érvénytelen értéket kihagyja és szól.
 * Javaslat 15: a `secondary` szűrők széles helyen a „További szűrők (N)” lenyitóba kerülnek; aktív szűrő nélkül a találatszám
 * a kereső sorában áll (nem nyit külön sort) – a szűrők és a lista közti üres sáv megszűnik.
 */
export declare function FilterBar({ search, filters, values, onChange, resultCount, itemLabel, extra, narrowBelow, className }: FilterBarProps): import("react").JSX.Element;
