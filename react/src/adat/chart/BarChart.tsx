import { fmt } from '../format';
import { Frame } from './Frame';
import { HBarChart } from './HBarChart';
import { findOutlier, outlierNote } from './outlier';
import { sc } from './marks';
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
export function BarChart(p: BarChartProps) {
  if (p.orientation === 'horizontal') return <HBarChart {...p} />;
  const { data, height = 240, clipOutlier = true } = p;
  const s = data.series[0] ?? { values: [], label: '' };
  const nums = s.values.filter((v): v is number => typeof v === 'number');
  const o = clipOutlier ? findOutlier(s.values) : null;
  const max = o ? o.cap : Math.max(0, ...nums);
  const label = p.label ?? `${s.label} (${data.unit})`;
  return (
    <Frame data={data} min={Math.min(0, ...nums)} max={max} height={height} minBand={20} label={label} note={o ? outlierNote(data, o) : undefined}>
      {({ band, cx, y, plot, narrow, decimals }) => {
        const bw = Math.min(48, Math.max(4, band * 0.68));
        const showVals = p.valueLabels ?? (data.categories.length <= 16 && !narrow);
        const tips = data.categories.length <= 40; // sok kategóriánál nincs egyenkénti buborék (gyors betöltés) – a számok az adattáblában
        return s.values.map((v, i) => {
          if (v === null || v === undefined) return null;
          const x = cx(i) - bw / 2;
          const d = data.decimals ?? decimals;
          if (v === 0) return <line key={i} className={`bc-mark-zero ${sc(0)}`} x1={x} x2={x + bw} y1={y(0)} y2={y(0)}><title>{`${data.categories[i]}: 0 ${data.unit}`}</title></line>;
          const cut = o?.index === i;
          const top = cut ? plot.t : y(Math.max(0, v)), bottom = y(Math.min(0, v));
          return (
            <g key={i}>
              <rect className={`bc-mark ${sc(0)}`} x={x} y={top} width={bw} height={Math.max(1, bottom - top)}>{tips && <title>{`${data.categories[i]}: ${fmt(v, d)} ${data.unit}`}</title>}</rect>
              {cut && <path className="bc-break" d={`M${x - 3} ${plot.t + 12}l${bw / 2 + 3} -6l${bw / 2 + 3} 6`} />}
              {(showVals || cut) && (
                <text className="bc-val" x={cx(i)} y={v < 0 ? bottom + 14 : top - 6} textAnchor="middle">{cut ? `↑ ${fmt(v, d)}` : fmt(v, d)}</text>
              )}
            </g>
          );
        });
      }}
    </Frame>
  );
}
