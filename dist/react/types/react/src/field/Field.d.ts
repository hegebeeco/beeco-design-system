import { type ReactNode } from 'react';
/** Minden beviteli mező közös keret-props-a (docs/komponensek.md 3/A). */
export type FieldProps = {
    /** Látható címke – kötelező */
    label: string;
    /** Súgó: mit és miért kell megadni – kötelező (a ⓘ gomb mögé kerül) */
    help: ReactNode;
    /** Érvényes tartomány szövegesen, pl. „3–60 karakter”, „0–100 %” */
    range?: string;
    /** Aktuális állapot, pl. { value: 213, max: 255 } → „213/255” */
    count?: {
        value: number;
        max: number;
        unit?: string;
    };
    /** Hibaüzenet (a következő lépéssel) – ha van, a mező aria-invalid */
    error?: string;
    /** Tájékoztató jelzés, pl. „A végét levágtam: 255 karakter a határ.” */
    notice?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
};
type Props = FieldProps & {
    children: ReactNode;
    labelFor?: boolean;
};
/**
 * Field (molekula): címke + súgó · mező · tartomány + számláló · hiba/jelzés.
 * A benne lévő mező a FieldContext-ből kapja az id-t és az aria-describedby-t.
 */
export declare function Field({ label, help, range, count, error, notice, required, disabled, className, children, labelFor }: Props): import("react").JSX.Element;
export {};
