import { type FieldProps } from '../field/Field';
export type ComboOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
type Common = FieldProps & {
    options: ReadonlyArray<ComboOption>;
    placeholder?: string;
    /** Új elem létrehozása a beírt szövegből (címkézés); visszaadja az új elem értékét */
    onCreate?: (label: string) => string | Promise<string>;
    loading?: boolean;
    /** A lista nem töltött be – „Újrapróbálás” */
    loadError?: string;
    onRetry?: () => void;
    /** Ennyi címke látszik a mezőben, a többi „+N” (1A) */
    maxChips?: number;
};
export type ComboboxProps = (Common & {
    multiple?: false;
    value: string | null;
    onChange: (v: string | null) => void;
    max?: never;
}) | (Common & {
    multiple: true;
    value: string[];
    onChange: (v: string[]) => void;
    max?: number;
});
/** Combobox (molekula, Javaslat 01 – 1A): keresős legördülő, egyes/többes, új elem létrehozással, címkék a mezőben. */
export declare function Combobox(props: ComboboxProps): import("react").JSX.Element;
export {};
