import { clip, fmt } from '../format';
import { CH, Frame } from './Frame';
import { Marker, sc } from './marks';
import { visibleValues, type ChartData } from './types';

export type LineChartProps = {
  /** 1–4 sorozat ajánlott (több fölött a közvetlen címke elmarad, csak a felső jelmagyarázat) */
  data: ChartData;
  height?: number;
  /** Közvetlen címke a vonal végén (4a A) – alap: ≤ 4 sorozatnál. Csak akkor jelenik meg (true-nál is), ha görgetés nélkül kifér; különben a felső jelmagyarázat elég */
  endLabels?: boolean;
  label?: string;
};

/** Folytonos darabok: a null megszakítja a vonalat (a hiányzó érték nem nulla – a keret sávot rajzol a helyére) */
function segments(values: Array<number | null>) {
  const out: number[][] = [];
  let cur: number[] = [];
  values.forEach((v, i) => { if (typeof v === 'number') cur.push(i); else if (cur.length) { out.push(cur); cur = []; } });
  if (cur.length) out.push(cur);
  return out;
}
const lastIndex = (v: Array<number | null>) => { for (let i = v.length - 1; i >= 0; i--) if (typeof v[i] === 'number') return i; return -1; };
const LABEL_MAX = 16;

/**
 * LineChart (molekula): trend időben, több sorozat. Minden sorozat más pont-alakot kap (● ■ ▲ ◆), a vonal line színű kontúrt,
 * a vonal végén közvetlen címke (ütközés nélkül), hiányzó érték = szakadás + csíkos sáv (nem leeső vonal). Egy pont is látszik.
 */
export function LineChart({ data, height = 260, endLabels, label }: LineChartProps) {
  const vals = visibleValues(data);
  const shown = data.series.filter((s) => !s.hidden);
  // A címke-hely és a ≤ 4 szabály az ÖSSZES sorozatból – így egy sorozat ki-be kapcsolásakor nem ugrik el a rajz
  const wantEnd = (narrow: boolean) => (endLabels ?? data.series.length <= 4) && !narrow && shown.length > 0;
  const labW = Math.min(LABEL_MAX, Math.max(...data.series.map((s) => s.label.length), 1)) * CH + 16;
  const many = data.categories.length > 40;
  return (
    <Frame data={data} min={Math.min(0, ...vals)} max={Math.max(0, ...vals)} height={height} minBand={many ? 6 : 16}
      // A végcímke csak akkor kap helyet, ha nem tolja görgethetővé a rajzot – különben levágva, a látható részen kívül lenne
      padRight={(narrow, spare) => (wantEnd(narrow) && spare >= labW ? labW : 16)} label={label ?? `${shown.map((s) => s.label).join(', ')} (${data.unit})`}>
      {({ cx, y, narrow, plot, decimals, padR }) => {
        const d = data.decimals ?? decimals;
        // Vonalvégi címkék: y szerint rendezve széttolva, hogy ne takarják egymást
        const showEnd = wantEnd(narrow) && padR >= labW;
        const ends = data.series.map((s, i) => ({ i, at: s.hidden ? -1 : lastIndex(s.values) })).filter((e) => e.at >= 0)
          .map((e) => ({ ...e, y: y(data.series[e.i].values[e.at] as number) })).sort((a, b) => a.y - b.y);
        for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 14);
        return (
          <>
            {data.series.map((s, i) => !s.hidden && segments(s.values).map((seg, k) => {
              const dPath = seg.map((j, n) => `${n ? 'L' : 'M'}${cx(j)} ${y(s.values[j] as number)}`).join('');
              return (
                <g key={`${s.key}${k}`}>
                  <path className="bc-line-under" d={dPath} />
                  <path className={`bc-line ${sc(i)}`} d={dPath} />
                </g>
              );
            }))}
            {data.series.map((s, i) => !s.hidden && s.values.map((v, j) => {
              if (typeof v !== 'number') return null;
              const alone = typeof s.values[j - 1] !== 'number' && typeof s.values[j + 1] !== 'number';
              if (many && !alone && j !== lastIndex(s.values)) return null;
              return <g key={`${s.key}m${j}`}><Marker x={cx(j)} y={y(v)} i={i} r={alone ? 6 : 4.5} /><title>{`${s.label}, ${data.categories[j]}: ${fmt(v, d)} ${data.unit}`}</title></g>;
            }))}
            {showEnd && ends.map((e) => (
              <text key={`e${e.i}`} className="bc-end-label" x={Math.min(cx(e.at) + 10, plot.l + plot.w + 8)} y={e.y} dy="0.32em">
                {clip(data.series[e.i].label, LABEL_MAX)}
              </text>
            ))}
          </>
        );
      }}
    </Frame>
  );
}
