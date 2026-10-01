import { type InputHTMLAttributes } from 'react';
import { type FieldProps } from '../field/Field';
export type TextFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
    type?: 'text' | 'email' | 'url' | 'tel' | 'password';
};
/** Tartomány-szöveg a hossz-határokból, ha a hívó nem adott meg sajátot */
export declare function lengthRange(min?: number, max?: number): string | undefined;
/**
 * TextField (atom + Field keret): címke, súgó, tartomány, élő számláló (pl. 213/255),
 * a max. hossznál a gépelés megáll, a túl hosszú beillesztést levágja és jelzi.
 * react-hook-form: <TextField {...register('nev')} label=… help=… maxLength={60} />
 */
export declare const TextField: import("react").ForwardRefExoticComponent<FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
    type?: "text" | "email" | "url" | "tel" | "password";
} & import("react").RefAttributes<HTMLInputElement>>;
