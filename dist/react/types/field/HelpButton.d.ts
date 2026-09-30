import type { ReactNode } from 'react';
export type HelpButtonProps = {
    /** Mire vonatkozik (a képernyőolvasó ezt mondja: „Súgó: <label>”) */
    label: string;
    /** Mit és miért kell megadni – rövid, tegeződő szöveg, ha lehet példával */
    children: ReactNode;
};
/**
 * Súgó gomb (ⓘ) – kattintásra/koppintásra nyíló buborék (érintésen is működik, ezért nem tooltip).
 * Esc-re és kívül kattintásra zár, a fókusz visszakerül a gombra (Radix Popover).
 */
export declare function HelpButton({ label, children }: HelpButtonProps): import("react").JSX.Element;
