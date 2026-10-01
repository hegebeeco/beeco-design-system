export type ThemeLabels = {
    /** A háromállású kapcsoló neve (képernyőolvasó) */
    group: string;
    light: string;
    dark: string;
    auto: string;
    /** Az ikongomb neve és felirata, ha most világos látszik */
    toDark: string;
    /** … ha most sötét látszik */
    toLight: string;
};
/** Alapfeliratok magyarul; kétnyelvű appban a `labels` írja felül (pl. i18n-ből) */
export declare const THEME_LABELS_HU: ThemeLabels;
export declare const IcSun: () => import("react").JSX.Element;
export declare const IcMoon: () => import("react").JSX.Element;
export declare const IcAuto: () => import("react").JSX.Element;
export type ThemeToggleProps = {
    /** 'icon' (alap): kompakt hely (oldalsáv alja, eszközsáv) – csak piktogram, súgó-buborékkal (6/A).
     *  'segmented': beállítás-oldal – Világos · Sötét · Rendszer szerint. */
    variant?: 'icon' | 'segmented';
    labels?: Partial<ThemeLabels>;
    className?: string;
};
/** Téma-váltó (atom/molekula, Javaslat 09) – ThemeProvider alatt */
export declare function ThemeToggle({ variant, labels, className }: ThemeToggleProps): import("react").JSX.Element;
