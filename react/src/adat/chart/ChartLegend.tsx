import { Swatch } from './marks';
import { hasGap, type ChartData } from './types';

/** Jelmagyarázat a grafikon fölött (4a A): minden szín ÉS alak jelentése, plusz a csíkos sáv (rejtett / hiányzó ≠ 0). */
export function ChartLegend({ data, kind }: { data: ChartData; kind: 'bar' | 'line' }) {
  const gap = hasGap(data);
  if (data.series.length < 2 && !gap && kind === 'bar') return null;
  return (
    <ul className="bc-legend" aria-label="Jelmagyarázat">
      {data.series.map((s, i) => <li key={s.key}><Swatch i={i} kind={kind} />{s.label}</li>)}
      {gap && <li><Swatch i={0} kind="gap" />{data.gapLabel ?? 'nincs adat'} – nem nulla</li>}
    </ul>
  );
}
