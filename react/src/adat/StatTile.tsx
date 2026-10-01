import type { ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';
import { Button } from '../inputs/Button';
import { fmt, fmtSigned } from './format';
import { Sparkline } from './chart/Sparkline';

export type StatDelta = {
  /** A változás (előjelesen): +12 vagy −3,5 */
  value: number;
  /** '%' vagy mértékegység („db”) – a % csak akkor, ha az előző érték nem 0 */
  unit?: string;
  decimals?: number;
  /** Mihez képest: „az előző 30 naphoz” */
  compare: string;
  /** Előző érték 0 volt → a % nem értelmezhető: „+37 (előtte 0)” */
  fromZero?: boolean;
};

export type StatTileProps = {
  label: string;
  /** Mit számol, honnan (ⓘ) – kötelező */
  help: ReactNode;
  /** Az érték; null = nincs adat („—”) */
  value: number | null;
  unit?: string;
  decimals?: number;
  /** Időszak: „2026. 07–09.” */
  period?: string;
  /** Változás; 'new' = nincs előző időszak („új”) */
  delta?: StatDelta | 'new';
  /** Melyik irány a jó: up (több = jó), down (több = rossz, pl. hibajegy, CO₂), none (semleges) – Javaslat 02 3A */
  good?: 'up' | 'down' | 'none';
  /** Elemszám: hány érintettből számoltuk; 1–4 között az érték rejtve (adatvédelmi küszöb) */
  n?: number;
  nLabel?: string;
  /** A rejtés küszöbe (alap: 5 – ennél kevesebb érintett rejtve) */
  minN?: number;
  /** Becsült érték: „~” jel + „becslés” (a beeco adatszabálya) */
  estimate?: boolean;
  /** Forrás és lekérdezés ideje */
  source?: ReactNode;
  /** Irány-vonal (sparkline) – csak a szám mellett, soha egyedül */
  trend?: Array<number | null>;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
};

/**
 * StatTile / KPI (molekula, Javaslat 02 – 3A): érték + egység, változás a jelentés szerint színezve (nyíl + előjel + szöveg, nem csak szín),
 * időszak, súgó ⓘ, elemszám, forrás, rejtett érték (1–4 érintett), „—” ha nincs adat, csontváz töltéskor.
 */
export function StatTile(p: StatTileProps) {
  const { label, help, value, unit, decimals = 0, period, delta, good = 'up', n, nLabel = 'érintett', minN = 5, estimate, source, trend } = p;
  const hidden = n !== undefined && n > 0 && n < minN;
  let body: ReactNode;
  if (p.loading) body = <span className="bc-skeleton bc-stat-skel" role="status" aria-label={`${label}: betöltés…`} />;
  else if (p.error) body = (
    <div className="bc-stat-err" role="alert"><span>{p.error}</span>{p.onRetry && <Button variant="ghost" size="sm" onClick={p.onRetry}>Újrapróbálás</Button>}</div>
  );
  else if (hidden) body = <p className="bc-stat-value is-hidden">rejtve<span className="bc-stat-sub">kevesebb mint {minN} {nLabel} – adatvédelmi küszöb</span></p>;
  else if (value === null) body = <p className="bc-stat-value is-missing"><span aria-hidden="true">—</span><span className="bc-sr">nincs adat</span></p>;
  else body = (
    <p className="bc-stat-value">
      {estimate && <span title="becslés">~</span>}{fmt(value, decimals)}
      {unit && <span className="bc-stat-unit"> {unit}</span>}
      {estimate && <span className="bc-stat-sub">becslés</span>}
    </p>
  );
  return (
    <div className={cx('bc-stat', 'bc-kpi', p.className)}>
      <div className="bc-label-row bc-kpi-head">
        <span className="bc-stat-label">{label}</span>
        <HelpButton label={label}>{help}</HelpButton>
      </div>
      <div className="bc-kpi-main">
        {body}
        {trend && !hidden && !p.loading && !p.error && <Sparkline values={trend} className="bc-kpi-spark" />}
      </div>
      {!hidden && !p.loading && !p.error && value !== null && delta && <Delta d={delta} good={good} />}
      {(period || (n !== undefined && !hidden)) && (
        <p className="bc-kpi-meta">{period}{period && n !== undefined && !hidden ? ' · ' : ''}{n !== undefined && !hidden ? `elemszám: ${fmt(n)} ${nLabel}` : ''}</p>
      )}
      {source && <p className="bc-kpi-source">Forrás: {source}</p>}
    </div>
  );
}

function Delta({ d, good }: { d: StatDelta | 'new'; good: 'up' | 'down' | 'none' }) {
  if (d === 'new') return <p className="bc-stat-delta bc-kpi-delta is-neutral">új – nincs előző időszak</p>;
  const dir = d.value > 0 ? 'up' : d.value < 0 ? 'down' : 'flat';
  const tone = good === 'none' || dir === 'flat' ? 'neutral' : dir === good ? 'good' : 'bad';
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '=';
  const unit = d.fromZero ? '' : d.unit === '%' ? '%' : d.unit ? ` ${d.unit}` : '';
  const meaning = tone === 'good' ? 'jó irány' : tone === 'bad' ? 'rossz irány' : '';
  return (
    <p className={cx('bc-stat-delta', 'bc-kpi-delta', `is-${tone}`)}>
      <span aria-hidden="true">{arrow} </span>{fmtSigned(d.value, d.decimals ?? 0)}{unit}{d.fromZero ? ' (előtte 0)' : ''} {d.compare}
      {meaning && <span className="bc-kpi-meaning"> · {meaning}</span>}
    </p>
  );
}
