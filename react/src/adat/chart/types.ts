/** Egy adatsor: minden kategóriához egy érték; null = hiányzó vagy rejtett (NEM nulla – sávval rajzoljuk) */
export type ChartSeries = { key: string; label: string; values: Array<number | null> };

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
};

export const isGap = (d: ChartData, i: number) => d.series.some((s) => s.values[i] === null || s.values[i] === undefined);
export const hasGap = (d: ChartData) => d.categories.some((_, i) => isGap(d, i));
export const allValues = (d: ChartData) => d.series.flatMap((s) => s.values.filter((v): v is number => typeof v === 'number'));
/** Üres: nincs kategória vagy egyetlen érték sincs */
export const isEmptyData = (d: ChartData) => !d.categories.length || !allValues(d).length;
