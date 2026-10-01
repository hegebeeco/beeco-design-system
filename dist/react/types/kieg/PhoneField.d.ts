import { type InputHTMLAttributes } from 'react';
import { type FieldProps } from '../field/Field';
import { type PhoneInfo, type PhoneKind } from './phone';
export type PhoneFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'> & {
    /** E.164 („+36301234567”) vagy üres szöveg */
    value: string;
    /** Minden változáskor: E.164 + a szám adatai (mobil/vezetékes, teljes-e, érvényes-e) */
    onChange: (value: string, info: PhoneInfo) => void;
    /** Milyen szám kell: bármely (alap), csak mobil vagy csak vezetékes */
    kind?: 'barmely' | Exclude<PhoneKind, 'ismeretlen'>;
};
/**
 * PhoneField (molekula, Javaslat 06a/1): rögzített +36 előtag, gépelés közbeni magyar tagolás (30 123 4567),
 * betű nem írható be (jelzi), beillesztésnél felismeri a +36 / 06 / 0036 előtagot, a túl hosszút levágja és szól.
 * Kilépéskor ellenőriz: ismeretlen előhívó, hiányzó számjegyek, mobil/vezetékes elvárás.
 */
export declare const PhoneField: import("react").ForwardRefExoticComponent<FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> & {
    /** E.164 („+36301234567”) vagy üres szöveg */
    value: string;
    /** Minden változáskor: E.164 + a szám adatai (mobil/vezetékes, teljes-e, érvényes-e) */
    onChange: (value: string, info: PhoneInfo) => void;
    /** Milyen szám kell: bármely (alap), csak mobil vagy csak vezetékes */
    kind?: "barmely" | Exclude<PhoneKind, "ismeretlen">;
} & import("react").RefAttributes<HTMLInputElement>>;
