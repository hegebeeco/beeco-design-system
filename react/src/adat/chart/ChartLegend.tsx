import { Swatch } from './marks';
import { hasGap, paletteClass, type ChartData } from './types';

/**
 * Jelmagyarázat a grafikon fölött (4a A): minden szín ÉS alak jelentése, plusz a csíkos sáv (rejtett / hiányzó ≠ 0).
 * `onToggle` → a sorozatok kapcsológombok (aria-pressed): ki-be kapcsolják a vonalat; a kikapcsolt áthúzva, a színe a helyén marad.
 */
export function ChartLegend({ data, kind, onToggle }: { data: ChartData; kind: 'bar' | 'line'; onToggle?: (key: string) => void }) {
  const gap = hasGap(data);
  if (data.series.length < 2 && !gap && kind === 'bar') return null;
  const pal = paletteClass(data);
  return (
    <ul className={pal ? `bc-legend ${pal}` : 'bc-legend'} aria-label={onToggle ? 'Jelmagyarázat – a sorozatok ki-be kapcsolhatók' : 'Jelmagyarázat'}>
      {data.series.map((s, i) => (
        <li key={s.key}>
          {onToggle ? (
            <button type="button" className={s.hidden ? 'bc-legend-btn is-off' : 'bc-legend-btn'} aria-pressed={!s.hidden} onClick={() => onToggle(s.key)}>
              <Swatch i={i} kind={kind} />
              {s.label}
            </button>
          ) : (
            <><Swatch i={i} kind={kind} />{s.label}</>
          )}
        </li>
      ))}
      {gap && <li><Swatch i={0} kind="gap" />{data.gapLabel ?? 'nincs adat'} – nem nulla</li>}
    </ul>
  );
}
