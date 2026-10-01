import type { ChartData } from './types';
/**
 * Egy óriási kiugró érték (a legnagyobb > 4 × a második) a többit ellapítaná. Ilyenkor a tengely a második legnagyobbhoz igazodik,
 * a kiugró oszlop levágva, töréssel és a pontos számmal látszik, és a grafikon alatt szöveg is szól (az adattáblában pontos).
 */
export declare function findOutlier(values: Array<number | null>): {
    index: number;
    value: number;
    cap: number;
} | null;
export declare const outlierNote: (d: ChartData, o: {
    index: number;
    value: number;
}) => string;
