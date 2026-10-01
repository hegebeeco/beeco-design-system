import { fmt } from '../format';
import { Frame } from './Frame';
import { sc } from './marks';
import { allValues, type ChartData } from './types';

export type MultiBarProps = { data: ChartData; height?: number; label?: string };
const name = (d: ChartData, l?: string) => l ?? `${d.series.map((s) => s.label).join(', ')} (${d.unit})`;
const tip = (d: ChartData, si: number, i: number, v: number, dec: number) => `${d.series[si].label}, ${d.categories[i]}: ${fmt(v, dec)} ${d.unit}`;

/** GroupedBarChart (molekula): két-három szám kategóriánként egymás mellett (pl. létrejött / megoldott hibajegy). Hiányzó = sáv. */
export function GroupedBarChart({ data, height = 240, label }: MultiBarProps) {
  const vals = allValues(data);
  const k = Math.max(1, data.series.length);
  return (
    <Frame data={data} min={Math.min(0, ...vals)} max={Math.max(0, ...vals)} height={height} minBand={k * 10 + 10} label={name(data, label)}>
      {({ band, cx, y, decimals }) => {
        const gw = Math.min(k * 28, band * 0.8), bw = gw / k, dec = data.decimals ?? decimals;
        return data.categories.map((_, i) => data.series.map((s, si) => {
          const v = s.values[i];
          if (typeof v !== 'number') return null;
          const x = cx(i) - gw / 2 + si * bw;
          if (v === 0) return <line key={`${i}-${si}`} className={`bc-mark-zero ${sc(si)}`} x1={x} x2={x + bw} y1={y(0)} y2={y(0)} />;
          const top = y(Math.max(0, v)), bottom = y(Math.min(0, v));
          return <rect key={`${i}-${si}`} className={`bc-mark ${sc(si)}`} x={x} y={top} width={Math.max(1, bw)} height={Math.max(1, bottom - top)}><title>{tip(data, si, i, v, dec)}</title></rect>;
        }));
      }}
    </Frame>
  );
}

/**
 * StackedBarChart (molekula): egész és részei időben (legfeljebb 3–4 rész), csak nem negatív értékkel – negatív részt 0-nak nem rajzol,
 * hanem kihagyja és szól. Ha egy rész hiányzik, a kategória csíkos sáv (az összeg nem ismert).
 */
export function StackedBarChart({ data, height = 240, label }: MultiBarProps) {
  const sums = data.categories.map((_, i) => data.series.reduce((a, s) => a + Math.max(0, s.values[i] ?? 0), 0));
  const neg = data.series.some((s) => s.values.some((v) => typeof v === 'number' && v < 0));
  return (
    <Frame data={data} min={0} max={Math.max(0, ...sums)} height={height} minBand={20} label={name(data, label)}
      note={neg ? 'Halmozott oszlopon negatív rész nem ábrázolható – azokat kihagytam, az adattáblában megvannak.' : undefined}>
      {({ band, cx, y, decimals }) => {
        const bw = Math.min(48, Math.max(4, band * 0.68)), dec = data.decimals ?? decimals;
        return data.categories.map((_, i) => {
          if (data.series.some((s) => s.values[i] === null || s.values[i] === undefined)) return null;
          let acc = 0;
          return data.series.map((s, si) => {
            const v = s.values[i] as number;
            if (v <= 0) return null;
            const y0 = y(acc), y1 = y(acc + v);
            acc += v;
            return <rect key={`${i}-${si}`} className={`bc-mark ${sc(si)}`} x={cx(i) - bw / 2} y={y1} width={bw} height={Math.max(1, y0 - y1)}><title>{tip(data, si, i, v, dec)}</title></rect>;
          });
        });
      }}
    </Frame>
  );
}
