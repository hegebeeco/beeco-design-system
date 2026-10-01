import { cx as cls } from '../../cx';
import { linear } from '../format';

export type SparklineProps = {
  values: Array<number | null>;
  /** Ha önállóan áll (nem StatTile-ban), a képernyőolvasónak – alapból díszítés (a szám mellette áll) */
  label?: string;
  className?: string;
};

/** Sparkline (atom): irány tengely nélkül, a StatTile száma mellett – soha egyedül. Hiány = szakadás; az utolsó pont kiemelve. */
export function Sparkline({ values, label, className }: SparklineProps) {
  const W = 96, H = 32, P = 4;
  const nums = values.filter((v): v is number => typeof v === 'number');
  if (!nums.length) return null;
  const lo = Math.min(...nums), hi = Math.max(...nums);
  const x = linear(0, Math.max(1, values.length - 1), P, W - P);
  const y = linear(lo, hi === lo ? lo + 1 : hi, H - P, P);
  let d = '', pen = false, last = -1;
  values.forEach((v, i) => {
    if (typeof v !== 'number') { pen = false; return; }
    d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`; pen = true; last = i;
  });
  return (
    <svg className={cls('bc-spark', className)} viewBox={`0 0 ${W} ${H}`} width={W} height={H} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <path className="bc-line-under" d={d} />
      <path className="bc-line bc-s1" d={d} />
      <circle className="bc-mark bc-s1" cx={x(last)} cy={y(values[last] as number)} r={3.5} />
    </svg>
  );
}
