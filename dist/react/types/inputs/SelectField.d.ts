import { type SelectHTMLAttributes } from 'react';
import { type FieldProps } from '../field/Field';
export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type SelectFieldProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<SelectOption>;
    /** Üres első opció szövege (pl. „Válassz…”); ha nincs megadva, nincs üres opció. Tiltott mezőn ez látszik akkor is, ha nincs opció
     *  (pl. „Előbb a kategóriát válaszd ki”); nem tiltott, opció nélküli mezőn „Nincs választható elem”. */
    placeholder?: string;
};
/** SelectField (atom + Field): natív legördülő rövid (≤ ~15 elemű) listához; hosszabbhoz a Combobox. */
export declare const SelectField: import("react").ForwardRefExoticComponent<FieldProps & SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<SelectOption>;
    /** Üres első opció szövege (pl. „Válassz…”); ha nincs megadva, nincs üres opció. Tiltott mezőn ez látszik akkor is, ha nincs opció
     *  (pl. „Előbb a kategóriát válaszd ki”); nem tiltott, opció nélküli mezőn „Nincs választható elem”. */
    placeholder?: string;
} & import("react").RefAttributes<HTMLSelectElement>>;
