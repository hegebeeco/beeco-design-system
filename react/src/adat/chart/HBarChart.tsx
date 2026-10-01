import { useRef } from 'react';
import { clip, fmt, linear, niceTicks } from '../format';
import { useWidth } from '../useWidth';
import { CH } from './Frame';
import { sc } from './marks';
import { findOutlier, outlierNote } from './outlier';
import type { BarChartProps } from './BarChart';

const ROW = 32;

/** Vízszintes sáv (rangsor, hosszú kategórianév): a név balra, rövidítve „…”-val (teljes név rámutatásra és az adattáblában), érték a sáv végén. */
export function HBarChart({ data, clipOutlier = true, valueLabels = true, label }: BarChartProps) {
  const box = useRef<HTMLDivElement>(null);
  const width = useWidth(box);
  const s = data.series[0] ?? { values: [], label: '' };
  const nums = s.values.filter((v): v is number => typeof v === 'number');
  const o = clipOutlier ? findOutlier(s.values) : null;
  const { lo, hi, ticks, decimals } = niceTicks(Math.min(0, ...nums), o ? o.cap : Math.max(0, ...nums), width < 420 ? 3 : 5);
  const d = data.decimals ?? decimals;
  const maxChars = Math.max(...data.categories.map((c) => c.length), 1);
  const labW = Math.min(Math.round(width * 0.4), maxChars * CH + 12);
  const fit = Math.max(4, Math.floor((labW - 12) / CH));
  const valW = Math.max(...nums.map((v) => fmt(v, d).length), 1) * CH + 10;
  const t = 28, b = 44, l = labW, r = valueLabels ? valW : 16;
  const h = t + b + data.categories.length * ROW;
  const pw = Math.max(20, width - l - r);
  const x = linear(lo, hi, l, l + pw);

  return (
    <div className="bc-chart" ref={box}>
      {width > 0 && (
        <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} role="img" aria-label={`${label ?? `${s.label} (${data.unit})`}. A pontos számok az adattáblában.`}>
          <text className="bc-ax-title" x={4} y={14}>{data.xLabel}</text>
          {ticks.map((v) => (
            <g key={v}>
              <line className="bc-grid" x1={x(v)} x2={x(v)} y1={t} y2={h - b} />
              <text className="bc-ax-t" x={x(v)} y={h - b + 18} textAnchor="middle">{fmt(v, decimals)}</text>
            </g>
          ))}
          <text className="bc-ax-title" x={l + pw / 2} y={h - 6} textAnchor="middle">{data.yLabel ?? data.unit}</text>
          {data.categories.map((c, i) => {
            const v = s.values[i], yy = t + i * ROW, bh = ROW - 10;
            const cut = o?.index === i;
            return (
              <g key={i}>
                <text className="bc-ax-t is-cat" x={l - 8} y={yy + ROW / 2} dy="0.32em" textAnchor="end">{c.length > fit ? <title>{c}</title> : null}{clip(c, fit)}</text>
                {v === null || v === undefined ? (
                  <text className="bc-ax-t is-gap" x={x(0) + 6} y={yy + ROW / 2} dy="0.32em">{data.gapLabel ?? 'nincs adat'}</text>
                ) : v === 0 ? (
                  <line className={`bc-mark-zero ${sc(0)}`} x1={x(0)} x2={x(0)} y1={yy + 5} y2={yy + 5 + bh} />
                ) : (
                  <rect className={`bc-mark ${sc(0)}`} x={x(Math.min(0, v))} y={yy + 5} height={bh} width={Math.max(1, (cut ? l + pw : x(Math.max(0, v))) - x(Math.min(0, v)))}>
                    <title>{`${c}: ${fmt(v, d)} ${data.unit}`}</title>
                  </rect>
                )}
                {cut && <path className="bc-break" d={`M${l + pw - 14} ${yy + 2}l6 ${bh / 2 + 3}l-6 ${bh / 2 + 3}`} />}
                {valueLabels && typeof v === 'number' && (
                  <text className="bc-val" x={v < 0 ? x(v) - 4 : cut ? l + pw + 4 : x(v) + 4} y={yy + ROW / 2} dy="0.32em" textAnchor={v < 0 ? 'end' : 'start'}>{fmt(v, d)}</text>
                )}
              </g>
            );
          })}
          <line className={lo < 0 ? 'bc-zero is-strong' : 'bc-zero'} x1={x(0)} x2={x(0)} y1={t} y2={h - b} />
        </svg>
      )}
      {o && <p className="bc-chart-note">{outlierNote(data, o)}</p>}
    </div>
  );
}
