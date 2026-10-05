import { type ReactNode } from 'react';
/** A PreviewCard gyűjti, melyik szöveg vágódik le (név → hány sor fér el, levágva-e) */
export type CutReport = (key: string, label: string, lines: number, cut: boolean) => void;
export declare const CutContext: import("react").Context<CutReport>;
export type ClampProps = {
    /** Azonosító és emberi név a jelzéshez: „title” / „A cím” */
    k: string;
    label: string;
    /** Hány sor fér el az appban (1 = egysoros, „…”-tal) */
    lines: number;
    as?: 'p' | 'h3' | 'span';
    /** Ha üres: ez a halvány helykitöltő látszik („Cím helye”) */
    placeholder: string;
    className?: string;
    /** Javaslat 20: értesítés a levágásról (PreviewCard nélkül is, pl. saját kártyán) */
    onCut?: (cut: boolean) => void;
    children?: ReactNode;
};
/**
 * Clamp (atom, Javaslat 20-tól nyilvános): annyi sor, amennyi az appban elfér („…”-tal); a levágást MÉRI (nem karakterszámból
 * becsüli), és jelenti a PreviewCard-nak (vagy az onCut-nak) – szélesség-változáskor (ResizeObserver) és szövegváltáskor újramér.
 * Üresen a halvány helykitöltő látszik. A levágott szöveg szaggatott jelölést kap.
 */
export declare function Clamp({ k, label, lines, as: Tag, placeholder, className, onCut, children }: ClampProps): import("react").JSX.Element;
