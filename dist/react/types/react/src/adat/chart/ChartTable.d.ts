import type { ChartData } from './types';
/** A grafikon adattáblája (3/B): ugyanazok a számok táblázatban – képernyőolvasónak és ellenőrzésnek. Hiányzó: a gapLabel, nem 0. */
export declare function ChartTable({ data, caption }: {
    data: ChartData;
    caption: string;
}): import("react").JSX.Element;
