import { type TextareaHTMLAttributes } from 'react';
import { type FieldProps } from '../field/Field';
export type TextAreaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
/** TextArea (atom + Field): mint a TextField, többsoros; élő számláló, levágás-jelzés. */
export declare const TextArea: import("react").ForwardRefExoticComponent<FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement> & import("react").RefAttributes<HTMLTextAreaElement>>;
