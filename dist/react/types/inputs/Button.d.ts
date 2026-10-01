import { type ButtonHTMLAttributes, type ReactNode } from 'react';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** primary = méz fő gomb (képernyőnként egy) · secondary · ghost · danger */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    /** Folyamatban: a felirat helyén pörgő, a gomb nem nyomható (dupla beküldés ellen) */
    busy?: boolean;
    /** Kész: rövid „mentve-pipa” (Javaslat 05) – a hívó ~1,5 mp után visszaállítja */
    done?: boolean;
    icon?: ReactNode;
};
/** Button (atom) – a DS .bc-btn React-változata. Alapból type="button" (nem küld be véletlenül űrlapot). */
export declare const Button: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
    /** primary = méz fő gomb (képernyőnként egy) · secondary · ghost · danger */
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    block?: boolean;
    /** Folyamatban: a felirat helyén pörgő, a gomb nem nyomható (dupla beküldés ellen) */
    busy?: boolean;
    /** Kész: rövid „mentve-pipa” (Javaslat 05) – a hívó ~1,5 mp után visszaállítja */
    done?: boolean;
    icon?: ReactNode;
} & import("react").RefAttributes<HTMLButtonElement>>;
export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Kötelező: a képernyőolvasó ezt mondja (az ikon önmagában nem beszél) */
    'aria-label': string;
    danger?: boolean;
    children: ReactNode;
};
/** IconButton (atom) – 44×44 px, kötelező aria-label. */
export declare const IconButton: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Kötelező: a képernyőolvasó ezt mondja (az ikon önmagában nem beszél) */
    'aria-label': string;
    danger?: boolean;
    children: ReactNode;
} & import("react").RefAttributes<HTMLButtonElement>>;
