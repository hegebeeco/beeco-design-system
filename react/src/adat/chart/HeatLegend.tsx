import { cx } from '../../cx';
import { fmt } from '../format';

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
export function HeatLegend({ label, unit, thresholds, min = 1, decimals = 0, className }: HeatLegendProps) {
  const t = thresholds.slice(0, 4);
  const step = decimals ? 10 ** -decimals : 1;
  const bins = [...t.map((hi, i) => `${fmt(i ? t[i - 1] + step : min, decimals)}–${fmt(hi, decimals)}`), `${fmt((t[t.length - 1] ?? min) + step, decimals)}+`];
  return (
    <figure className={cx('bc-heatkey', className)}>
      <figcaption className="bc-heatkey-title">{label} <span className="bc-muted">({unit})</span></figcaption>
      <ul className="bc-heatkey-bins">
        {bins.map((b, i) => (
          <li key={b} className={`bc-q${i + 1 + (5 - bins.length)}`}><span className="bc-heatkey-sw" aria-hidden="true" /><span>{b}</span></li>
        ))}
      </ul>
    </figure>
  );
}
