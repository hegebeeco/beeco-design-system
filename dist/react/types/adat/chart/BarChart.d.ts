import type { ChartData } from './types';
export type BarChartProps = {
    /** Az első adatsort rajzolja (több sorozathoz: GroupedBarChart / StackedBarChart) */
    data: ChartData;
    /** vertical = időbeli darabszám (nap, hét) · horizontal = rangsor, hosszú nevek, részarány */
    orientation?: 'vertical' | 'horizontal';
    height?: number;
    /** Érték-feliratok az oszlopokon – alap: ha kevés (≤ 16) a kategória és van hely */
    valueLabels?: boolean;
    /** Kiugró érték levágása (alap: igen) */
    clipOutlier?: boolean;
    /** A rajz neve képernyőolvasónak – alap: a sorozat neve és az egység */
    label?: string;
};
/** BarChart (molekula): oszlop vagy vízszintes sáv, 0-tól induló tengellyel, kontúrral, negatív értékkel, kiugró- és hiány-kezeléssel. */
export declare function BarChart(p: BarChartProps): import("react").JSX.Element;
