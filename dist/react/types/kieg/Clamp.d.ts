import { type ReactNode } from 'react';
/** A PreviewCard gyűjti, melyik szöveg vágódik le (név → hány sor fér el, levágva-e) */
export type CutReport = (key: string, label: string, lines: number, cut: boolean) => void;
export declare const CutContext: import("react").Context<CutReport>;
type Props = {
    /** Azonosító és emberi név a jelzéshez: „title” / „A cím” */
    k: string;
    label: string;
    /** Hány sor fér el az appban (1 = egysoros, „…”-tal) */
    lines: number;
    as?: 'p' | 'h3' | 'span';
    /** Ha üres: ez a halvány helykitöltő látszik („Cím helye”) */
    placeholder: string;
    className?: string;
    children?: ReactNode;
};
/**
 * Clamp: annyi sor, amennyi az appban elfér; a levágást MÉRI (nem karakterszámból becsüli),
 * és jelenti a PreviewCard-nak – szélesség-változáskor (ResizeObserver) és szövegváltáskor újramér.
 */
export declare function Clamp({ k, label, lines, as: Tag, placeholder, className, children }: Props): import("react").JSX.Element;
export {};
