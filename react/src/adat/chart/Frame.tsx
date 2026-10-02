import { useId, useRef, type ReactNode } from 'react';
import { clip, fmt, labelEvery, linear, niceTicks } from '../format';
import { useWidth } from '../useWidth';
import { GapPattern } from './marks';
import { isGap, paletteClass, type ChartData } from './types';

export const CH = 7; // egy felirat-karakter becsült szélessége (fs-xs), px
export type Plot = { l: number; t: number; w: number; h: number };
export type FrameCtx = {
  plot: Plot;
  band: number;
  /** Az i. kategória közepe */
  cx: (i: number) => number;
  /** Érték → y képpont */
  y: (v: number) => number;
  lo: number; hi: number; decimals: number;
  narrow: boolean;
  /** A jobb oldali margó, amit a padRight végül kapott (a grafikon ebből látja, kifér-e a végcímke) */
  padR: number;
};

type Props = {
  data: ChartData;
  /** Az érték-tengely tartománya (a hívó számolja: halmozásnál az összeg, kiugrónál a levágott) */
  min: number; max: number;
  height?: number;
  /** Legkisebb sáv egy kategóriának – ha nem fér el, a grafikon oldalra görgethető (telefon, 365 nap) */
  minBand?: number;
  /** Jobb oldali hely (vonalvégi címkék) */
  /** Jobb margó; `spare` = mennyi hely marad jobbra görgetés nélkül (a minimális sávszélesség mellett) */
  padRight?: (narrow: boolean, spare: number) => number;
  label: string;
  children: (c: FrameCtx) => ReactNode;
  /** Rajz alatti megjegyzés (pl. kiugró érték) */
  note?: ReactNode;
};

/**
 * Álló grafikonok közös váza (oszlop, vonal, csoportosított, halmozott): valódi pixelben rajzol (ResizeObserver),
 * y-rács magyar számokkal, 0-vonal kiemelve, x-feliratok ritkítva és rövidítve, tengelynevek, hiányzó sáv (nem nulla).
 */
export function Frame({ data, min, max, height = 240, minBand = 24, padRight, label, children, note }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const width = useWidth(box);
  const pid = `bcgap${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const n = Math.max(1, data.categories.length);
  const { lo, hi, ticks, decimals } = niceTicks(min, max, height < 160 ? 3 : 5);
  const tickW = Math.max(...ticks.map((t) => fmt(t, decimals).length)) * CH + 12;
  const narrow = width < 420;
  const l = Math.max(36, tickW), t = 24, b = 48;
  const r = padRight?.(narrow, width - l - n * minBand) ?? 12;
  const svgW = Math.max(width, l + r + n * minBand);
  const plot: Plot = { l, t, w: Math.max(10, svgW - l - r), h: height - t - b };
  const band = plot.w / n;
  const cx = (i: number) => plot.l + band * (i + 0.5);
  const y = linear(lo, hi, plot.t + plot.h, plot.t);
  const maxChars = Math.max(...data.categories.map((c) => c.length), 1);
  const every = labelEvery(n, plot.w, Math.min(maxChars * CH + 10, 96));
  const fit = Math.max(3, Math.floor((band * every - 6) / CH));
  const scroll = width > 0 && svgW > width + 1;

  return (
    <div className={paletteClass(data) ? `bc-chart ${paletteClass(data)}` : 'bc-chart'} ref={box}>
      <div className="bc-chart-scroll" {...(scroll ? { tabIndex: 0, role: 'group', 'aria-label': `${label} – oldalra görgethető` } : {})}>
        {width > 0 && (
          <svg width={svgW} height={height} viewBox={`0 0 ${svgW} ${height}`} role="img" aria-label={`${label}. A pontos számok az adattáblában.`}>
            <GapPattern id={pid} />
            {/* hiányzó / rejtett kategória: csíkos sáv a teljes magasságban */}
            {data.categories.map((_, i) => isGap(data, i) && (
              <rect key={`g${i}`} className="bc-gap" x={cx(i) - band / 2} y={plot.t} width={band} height={plot.h} fill={`url(#${pid})`} />
            ))}
            {ticks.map((v) => (
              <g key={v}>
                <line className="bc-grid" x1={plot.l} x2={plot.l + plot.w} y1={y(v)} y2={y(v)} />
                <text className="bc-ax-t" x={plot.l - 8} y={y(v)} dy="0.32em" textAnchor="end">{fmt(v, decimals)}</text>
              </g>
            ))}
            <text className="bc-ax-title" x={4} y={12}>{data.yLabel ?? data.unit}</text>
            {data.categories.map((c, i) => i % every === 0 && (
              <text key={`x${i}`} className="bc-ax-t" x={cx(i)} y={plot.t + plot.h + 18} textAnchor="middle">
                {c.length > fit ? <title>{c}</title> : null}{clip(c, fit)}
              </text>
            ))}
            <text className="bc-ax-title" x={plot.l + plot.w / 2} y={height - 6} textAnchor="middle">{data.xLabel}</text>
            {children({ plot, band, cx, y, lo, hi, decimals, narrow, padR: r })}
            <line className={lo < 0 ? 'bc-zero is-strong' : 'bc-zero'} x1={plot.l} x2={plot.l + plot.w} y1={y(0)} y2={y(0)} />
          </svg>
        )}
      </div>
      {note && <p className="bc-chart-note">{note}</p>}
    </div>
  );
}
