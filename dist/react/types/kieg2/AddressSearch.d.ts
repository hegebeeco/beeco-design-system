import { type ReactNode } from 'react';
import type { AddressHit } from './geo';
export type AddressSearchProps = {
    /** A projekt keresője: lekérdezés → találatok. A DS nem hív semmilyen szolgáltatást magától. */
    search: (query: string, signal: AbortSignal) => Promise<ReadonlyArray<AddressHit>>;
    onPick: (hit: AddressHit) => void;
    label?: string;
    help?: ReactNode;
    /** Ennyi betűtől keres (alap: 3) */
    minChars?: number;
    /** Ennyi ms gépelési szünet után keres (alap: 300) */
    debounceMs?: number;
    disabled?: boolean;
};
/**
 * Címkereső a meglévő Combobox-szal (06b/13): gépelés → késleltetett, megszakítható keresés → lista → választás.
 * Töltés és hiba (Újrapróbálás) a Combobox saját állapotaival. A Combobox nem ad lekérdezés-eseményt,
 * ezért a burok a buborékoló input-eseményből olvassa a beírt szöveget.
 */
export declare function AddressSearch({ search, onPick, label, minChars, debounceMs, disabled, help }: AddressSearchProps): import("react").JSX.Element;
