import { fmt } from '../format';
import type { ChartData } from './types';

/** A grafikon adattáblája (3/B): ugyanazok a számok táblázatban – képernyőolvasónak és ellenőrzésnek. Hiányzó: a gapLabel, nem 0. */
export function ChartTable({ data, caption }: { data: ChartData; caption: string }) {
  const gap = data.gapLabel ?? 'nincs adat';
  return (
    <div className="bc-table-wrap bc-chart-table" tabIndex={0} role="region" aria-label={`${caption} – adattábla`}>
      <table className="bc-table is-dense">
        <caption className="bc-sr">{caption} – adattábla</caption>
        <thead>
          <tr>
            <th scope="col">{data.xLabel}</th>
            {data.series.map((s) => <th key={s.key} scope="col" className="is-num">{s.label} ({data.unit})</th>)}
          </tr>
        </thead>
        <tbody>
          {data.categories.map((c, i) => (
            <tr key={`${c}${i}`}>
              <th scope="row">{c}</th>
              {data.series.map((s) => {
                const v = s.values[i];
                return <td key={s.key} className="is-num">{typeof v === 'number' ? fmt(v, data.decimals ?? 2) : <span className="bc-muted">{gap}</span>}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
