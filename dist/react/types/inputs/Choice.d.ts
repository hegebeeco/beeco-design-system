import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
type ChoiceBase = {
    label: string;
    help: ReactNode;
    error?: string;
    className?: string;
};
/** Checkbox (atom): natív jelölő a beeco színeivel, címke + súgó; react-hook-form register-rel is. */
export declare const Checkbox: import("react").ForwardRefExoticComponent<ChoiceBase & Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & import("react").RefAttributes<HTMLInputElement>>;
/**
 * CheckboxInput (atom, 2026-10-01): a márkázott jelölőnégyzet címke és súgó nélkül – ahol a környezet adja a nevet
 * (táblázat-sor, galéria-csempe, „mind kijelölése”). Kötelező: aria-label, vagy egy <label> körülötte. `indeterminate`: részleges („–”).
 */
export declare const CheckboxInput: import("react").ForwardRefExoticComponent<Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    indeterminate?: boolean;
} & import("react").RefAttributes<HTMLInputElement>>;
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
export type SwitchInputProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'role' | 'aria-checked' | 'children'> & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Kötelező (ha nincs aria-labelledby): a képernyőolvasó neve a sor nevével, pl. „Látható az appban: Méhes Kávézó” */
    'aria-label'?: string;
    /** md = a mező-kapcsoló mérete (alap) · sm = tömör, táblázatsorba: kisebb sín, az érintési felület 44 px marad, a sort nem nyújtja */
    size?: 'md' | 'sm';
    /** Látható állapot-szöveg a kapcsoló mellett (nem csak színnel jelez), pl. „Látható” / „Rejtett” */
    onText?: string;
    offText?: string;
    /** Mentés folyamatban (pl. a sorban): addig nem nyomható */
    busy?: boolean;
};
/**
 * SwitchInput (atom, Javaslat 20): a márkázott kapcsoló címke-sor és súgó nélkül – ahol a környezet adja a nevet és a súgót
 * (táblázat-sor: a súgó az oszlopfejlécben). Azonnal érvényes be/ki (role="switch"); a mentést és a visszavonást
 * (notify.undo) a hívó végzi. Kötelező: aria-label (vagy aria-labelledby).
 */
export declare const SwitchInput: import("react").ForwardRefExoticComponent<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type" | "role" | "aria-checked" | "onChange"> & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Kötelező (ha nincs aria-labelledby): a képernyőolvasó neve a sor nevével, pl. „Látható az appban: Méhes Kávézó” */
    'aria-label'?: string;
    /** md = a mező-kapcsoló mérete (alap) · sm = tömör, táblázatsorba: kisebb sín, az érintési felület 44 px marad, a sort nem nyújtja */
    size?: "md" | "sm";
    /** Látható állapot-szöveg a kapcsoló mellett (nem csak színnel jelez), pl. „Látható” / „Rejtett” */
    onText?: string;
    offText?: string;
    /** Mentés folyamatban (pl. a sorban): addig nem nyomható */
    busy?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
export {};
