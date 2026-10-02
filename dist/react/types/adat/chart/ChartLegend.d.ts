import { type ChartData } from './types';
/**
 * Jelmagyarázat a grafikon fölött (4a A): minden szín ÉS alak jelentése, plusz a csíkos sáv (rejtett / hiányzó ≠ 0).
 * `onToggle` → a sorozatok kapcsológombok (aria-pressed): ki-be kapcsolják a vonalat; a kikapcsolt áthúzva, a színe a helyén marad.
 */
export declare function ChartLegend({ data, kind, onToggle }: {
    data: ChartData;
    kind: 'bar' | 'line';
    onToggle?: (key: string) => void;
}): import("react").JSX.Element | null;
