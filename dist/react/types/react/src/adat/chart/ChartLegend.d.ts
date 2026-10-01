import { type ChartData } from './types';
/** Jelmagyarázat a grafikon fölött (4a A): minden szín ÉS alak jelentése, plusz a csíkos sáv (rejtett / hiányzó ≠ 0). */
export declare function ChartLegend({ data, kind }: {
    data: ChartData;
    kind: 'bar' | 'line';
}): import("react").JSX.Element | null;
