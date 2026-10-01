import { type ChartData } from './types';
export type MultiBarProps = {
    data: ChartData;
    height?: number;
    label?: string;
};
/** GroupedBarChart (molekula): két-három szám kategóriánként egymás mellett (pl. létrejött / megoldott hibajegy). Hiányzó = sáv. */
export declare function GroupedBarChart({ data, height, label }: MultiBarProps): import("react").JSX.Element;
/**
 * StackedBarChart (molekula): egész és részei időben (legfeljebb 3–4 rész), csak nem negatív értékkel – negatív részt 0-nak nem rajzol,
 * hanem kihagyja és szól. Ha egy rész hiányzik, a kategória csíkos sáv (az összeg nem ismert).
 */
export declare function StackedBarChart({ data, height, label }: MultiBarProps): import("react").JSX.Element;
