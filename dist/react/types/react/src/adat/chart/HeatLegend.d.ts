export type HeatLegendProps = {
    /** Mit színez: „Aktív felhasználók” */
    label: string;
    unit: string;
    /** Határok növekvő sorrendben (legfeljebb 4 szám → 5 fokozat): [20, 40, 60, 80] → 1–20 · 21–40 · 41–60 · 61–80 · 81+ */
    thresholds: number[];
    /** Az első fokozat alja (alap: 1) */
    min?: number;
    decimals?: number;
    className?: string;
};
/**
 * HeatLegend (molekula): a DS egyirányú adatskálája (--bc-data-seq-1…5; színtévesztő-barát módban seq-cb) határszámokkal.
 * A térképi hőtérkép nyers színátmenetét váltja ki. Lista, így a képernyőolvasó is felolvassa a fokozatokat.
 */
export declare function HeatLegend({ label, unit, thresholds, min, decimals, className }: HeatLegendProps): import("react").JSX.Element;
