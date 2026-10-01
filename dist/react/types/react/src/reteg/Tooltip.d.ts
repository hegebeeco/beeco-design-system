import { type ButtonHTMLAttributes, type ReactNode } from 'react';
export type TooltipIconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
    /** A gomb neve: ez az aria-label ÉS a felirat (pl. „Szerkesztés”) – soha nem hordoz egyedi információt */
    label: string;
    /** Az ikon (svg) */
    children: ReactNode;
    danger?: boolean;
    side?: 'top' | 'bottom' | 'left' | 'right';
};
/**
 * Tooltip (atom, Javaslat 03 – 4): CSAK ikongomb feliratára. Egérrel 500 ms rámutatás után, billentyűzettel fókuszra jelenik meg;
 * érintésen nem (ott a gomb neve a képernyőolvasónak szól). Magyarázatra, példára a súgó (ⓘ, HelpButton) való.
 */
export declare const TooltipIconButton: import("react").ForwardRefExoticComponent<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
    /** A gomb neve: ez az aria-label ÉS a felirat (pl. „Szerkesztés”) – soha nem hordoz egyedi információt */
    label: string;
    /** Az ikon (svg) */
    children: ReactNode;
    danger?: boolean;
    side?: "top" | "bottom" | "left" | "right";
} & import("react").RefAttributes<HTMLButtonElement>>;
