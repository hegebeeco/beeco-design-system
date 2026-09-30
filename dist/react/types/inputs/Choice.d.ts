import { type InputHTMLAttributes, type ReactNode } from 'react';
type ChoiceBase = {
    label: string;
    help: ReactNode;
    error?: string;
    className?: string;
};
/** Checkbox (atom): natív jelölő a beeco színeivel, címke + súgó; react-hook-form register-rel is. */
export declare const Checkbox: import("react").ForwardRefExoticComponent<ChoiceBase & Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & import("react").RefAttributes<HTMLInputElement>>;
export type RadioGroupProps = ChoiceBase & {
    name: string;
    options: ReadonlyArray<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
};
/** RadioGroup (molekula): fieldset + legend + súgó; natív rádiógombok (nyilakkal léptethető). */
export declare function RadioGroup({ label, help, error, className, name, options, value, onChange, required, disabled }: RadioGroupProps): import("react").JSX.Element;
export type SwitchProps = ChoiceBase & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
};
/** Switch (atom): azonnal érvényes be/ki kapcsoló (role="switch"); címke + súgó. */
export declare function Switch({ label, help, error, className, checked, onChange, disabled }: SwitchProps): import("react").JSX.Element;
export {};
