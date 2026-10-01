import { type InputHTMLAttributes } from 'react';
import { type FieldProps } from '../field/Field';
export type NumberFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max'> & {
    value: number | null;
    onChange: (value: number | null) => void;
    min?: number;
    max?: number;
    /** Tizedesjegyek száma (0 = egész szám) */
    decimals?: number;
    /** Mértékegység a mező mellett és a tartományban: Ft, %, db, km … */
    unit?: string;
    /** Mikor igazítson a határra: 'blur' (alap – kilépéskor) vagy 'input' (gépelés közben) */
    clamp?: 'blur' | 'input';
};
/**
 * NumberField (molekula, Javaslat 01 – 5A): gépelős számmező magyar formátummal.
 * Betű, második tizedesjel, fölösleges mínusz nem írható be; a tartományon kívüli érték a határra áll + jelzés.
 * react-hook-form-mal Controller-rel: <Controller name="x" render={({ field }) => <NumberField {...field} … />} />
 */
export declare const NumberField: import("react").ForwardRefExoticComponent<FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "max" | "min"> & {
    value: number | null;
    onChange: (value: number | null) => void;
    min?: number;
    max?: number;
    /** Tizedesjegyek száma (0 = egész szám) */
    decimals?: number;
    /** Mértékegység a mező mellett és a tartományban: Ft, %, db, km … */
    unit?: string;
    /** Mikor igazítson a határra: 'blur' (alap – kilépéskor) vagy 'input' (gépelés közben) */
    clamp?: "blur" | "input";
} & import("react").RefAttributes<HTMLInputElement>>;
