import { type ReactNode } from 'react';
export type HelpButtonProps = {
    /** Mire vonatkozik (a képernyőolvasó ezt mondja: „Súgó: <label>”) */
    label: string;
    /** Mit és miért kell megadni – rövid, tegeződő szöveg, ha lehet példával */
    children: ReactNode;
};
/**
 * Súgó gomb (ⓘ) – Kristóf, 2026-10-01: háttér és körvonal nélküli piktogram.
 * Egérrel rámutatásra nyílik (a buborékon tartva nyitva marad), kattintásra/koppintásra és billentyűvel (Enter/Szóköz) is –
 * kattintás után rögzítve marad, amíg Esc, kívül kattintás vagy újabb kattintás nem zárja. A fókusz visszakerül a gombra (Radix Popover).
 */
export declare function HelpButton({ label, children }: HelpButtonProps): import("react").JSX.Element;
