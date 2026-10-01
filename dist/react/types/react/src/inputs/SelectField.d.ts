import { type SelectHTMLAttributes } from 'react';
import { type FieldProps } from '../field/Field';
export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type SelectFieldProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<SelectOption>;
    /** Üres első opció szövege (pl. „Válassz…”); ha nincs megadva, nincs üres opció */
    placeholder?: string;
};
/** SelectField (atom + Field): natív legördülő rövid (≤ ~15 elemű) listához; hosszabbhoz a Combobox. */
export declare const SelectField: import("react").ForwardRefExoticComponent<FieldProps & SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<SelectOption>;
    /** Üres első opció szövege (pl. „Válassz…”); ha nincs megadva, nincs üres opció */
    placeholder?: string;
} & import("react").RefAttributes<HTMLSelectElement>>;
