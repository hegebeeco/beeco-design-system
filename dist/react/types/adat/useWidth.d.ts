import { type RefObject } from 'react';
/**
 * Egy elem aktuális szélessége (ResizeObserver). Az első mérés rajzolás előtt történik (nincs villanás);
 * a grafikon ebből rajzol valódi pixelben, így a felirat sosem torzul, a szűrősáv ebből dönt soros ↔ panel között.
 */
export declare function useWidth(ref: RefObject<HTMLElement | null>, fallback?: number): number;
