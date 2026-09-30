import { type InputHTMLAttributes } from 'react';
export type SearchBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
    /** Mit keres – a képernyőolvasónak (a keresőmezőnek nincs látható címkéje: engedélyezett kivétel, docs/komponensek.md 3/A) */
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    /** Késleltetés (ms) a gépelés után, mielőtt az onSearch lefut – lista-szűrésnél ne kérdezzen minden billentyűre */
    debounce?: number;
    onSearch?: (value: string) => void;
};
/** SearchBox (molekula): nagyító + törlés gomb; Esc törli; késleltetett keresés. */
export declare const SearchBox: import("react").ForwardRefExoticComponent<Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
    /** Mit keres – a képernyőolvasónak (a keresőmezőnek nincs látható címkéje: engedélyezett kivétel, docs/komponensek.md 3/A) */
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    /** Késleltetés (ms) a gépelés után, mielőtt az onSearch lefut – lista-szűrésnél ne kérdezzen minden billentyűre */
    debounce?: number;
    onSearch?: (value: string) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
