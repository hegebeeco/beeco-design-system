import { type ChartData } from './types';
export type LineChartProps = {
    /** 1–4 sorozat ajánlott (több fölött a közvetlen címke elmarad, csak a felső jelmagyarázat) */
    data: ChartData;
    height?: number;
    /** Közvetlen címke a vonal végén (4a A) – alap: ≤ 4 sorozatnál, ha van hely */
    endLabels?: boolean;
    label?: string;
};
/**
 * LineChart (molekula): trend időben, több sorozat. Minden sorozat más pont-alakot kap (● ■ ▲ ◆), a vonal line színű kontúrt,
 * a vonal végén közvetlen címke (ütközés nélkül), hiányzó érték = szakadás + csíkos sáv (nem leeső vonal). Egy pont is látszik.
 */
export declare function LineChart({ data, height, endLabels, label }: LineChartProps): import("react").JSX.Element;
