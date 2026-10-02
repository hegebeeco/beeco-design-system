/** Egy adatsor: minden kategóriához egy érték; null = hiányzó vagy rejtett (NEM nulla – sávval rajzoljuk) */
export type ChartSeries = {
    key: string;
    label: string;
    values: Array<number | null>;
    /** Kikapcsolt sorozat (ChartCard seriesToggle állítja; csak a LineChart veszi figyelembe): nem rajzoljuk, de a színe/alakja a helyén marad – az adattáblában ott van */
    hidden?: boolean;
};
/** Adatpaletta: kategória (alap, egymástól független sorozatok) vagy állapot (1 = jó … 5 = rossz, sorrendje jelentés – Javaslat 12) */
export type ChartPalette = 'kategoria' | 'allapot';
/**
 * A grafikon adatai – ugyanebből készül a rajz, a jelmagyarázat és az adattábla (3/B), így nem térhetnek el.
 * Szám csak valós adatból vagy forrással (a beeco adatszabálya).
 */
export type ChartData = {
    /** A kategóriák (x-tengely): napok, hetek, nevek */
    categories: string[];
    series: ChartSeries[];
    /** Mértékegység: „db”, „kg CO₂e”, „%” */
    unit: string;
    /** A kategória-tengely neve: „hét”, „nap”, „partner” */
    xLabel: string;
    /** Az érték-tengely neve – alap: a mértékegység */
    yLabel?: string;
    decimals?: number;
    /** Mit jelent a hiányzó érték: „rejtett hét (< 5 érintett)” – alap: „nincs adat” */
    gapLabel?: string;
    /** Adatpaletta – 'allapot': a sorozatok sorban a --bc-data-allapot-1…5 színeket kapják (legfeljebb 5 sorozat) */
    palette?: ChartPalette;
};
/** Hiányzó érték az i. kategóriában – csak a látható sorozatokból (egy kikapcsolt sorozat hiánya nem rajzol „nincs adat” sávot) */
export declare const isGap: (d: ChartData, i: number) => boolean;
export declare const hasGap: (d: ChartData) => boolean;
export declare const allValues: (d: ChartData) => number[];
/** A látható (nem kikapcsolt) sorozatok értékei – ebből készül a tengely */
export declare const visibleValues: (d: ChartData) => number[];
/** A paletta osztálya (kártya, grafikon, jelmagyarázat egyformán kapja, hogy a színek egyezzenek) */
export declare const paletteClass: (d: ChartData) => "bc-pal-allapot" | undefined;
/** Üres: nincs kategória vagy egyetlen érték sincs */
export declare const isEmptyData: (d: ChartData) => boolean;
