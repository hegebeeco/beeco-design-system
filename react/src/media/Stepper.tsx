import { cx } from '../cx';
import { IcCheck, IcClose } from './icons';

export type StepState = 'todo' | 'current' | 'done' | 'error';
export type Step = { id: string; label: string; state: StepState };

export type StepperProps = {
  /** Mit mutat (képernyőolvasónak), pl. „Videófeltöltés lépései” */
  label: string;
  steps: readonly Step[];
  className?: string;
};

const STATE_TEXT: Record<StepState, string> = { todo: 'még hátravan', current: 'folyamatban', done: 'kész', error: 'hiba' };

/**
 * Stepper (molekula): lépésjelző – fájl → feltöltés → feldolgozás → kész.
 * Az állapotot a jel (szám / pipa / ×) ÉS a képernyőolvasó-szöveg is mondja, nem csak a szín.
 */
export function Stepper({ label, steps, className }: StepperProps) {
  return (
    <ol className={cx('bc-steps', className)} aria-label={label}>
      {steps.map((s, i) => (
        <li key={s.id} className={`is-${s.state}`} aria-current={s.state === 'current' ? 'step' : undefined}>
          <b aria-hidden="true">{s.state === 'done' ? <IcCheck /> : s.state === 'error' ? <IcClose /> : i + 1}</b>
          <span>{s.label}</span>
          <span className="bc-sr"> – {STATE_TEXT[s.state]}</span>
        </li>
      ))}
    </ol>
  );
}

/** Lépések állapota egy aktuális lépés-indexből (+ opcionális hiba azon a lépésen) */
export function stepsFrom(labels: readonly { id: string; label: string }[], current: number, failed = false): Step[] {
  return labels.map((l, i) => ({ ...l, state: i < current ? 'done' : i === current ? (failed ? 'error' : 'current') : 'todo' }));
}

export type ProgressProps = { value: number; max: number; label: string; valueText?: string; className?: string };

/** Haladásjelző sáv (role="progressbar"); a szöveges állapotot (pl. „2,1/5 MB”) a hívó írja mellé. */
export function Progress({ value, max, label, valueText, className }: ProgressProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <span className={cx('bc-upbar', className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-valuetext={valueText ?? `${pct}%`}>
      <i style={{ width: `${pct}%` }} />
    </span>
  );
}
