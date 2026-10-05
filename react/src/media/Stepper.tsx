import { cx } from '../cx';
import { IcCheck, IcClose } from './icons';

export type StepState = 'todo' | 'current' | 'done' | 'error';
export type Step = {
  id: string;
  label: string;
  state: StepState;
  /** Javaslat 20: választható-e (onSelect mellett). Alap: a kész és a hibás lépés – a mostani soha. */
  reachable?: boolean;
};

export type StepperProps = {
  /** Mit mutat (képernyőolvasónak), pl. „Videófeltöltés lépései” */
  label: string;
  steps: readonly Step[];
  /**
   * Javaslat 20 – kattintható lépésjelző: a bejárt (reachable) lépés gomb, erre a lépésre vált. A látható pirula mérete nem
   * változik, az érintési felület 44 px. Nélküle a jelző csak mutat (mint eddig).
   */
  onSelect?: (index: number, step: Step) => void;
  className?: string;
};

const STATE_TEXT: Record<StepState, string> = { todo: 'még hátravan', current: 'folyamatban', done: 'kész', error: 'hiba' };

/**
 * Stepper (molekula): lépésjelző – fájl → feltöltés → feldolgozás → kész.
 * Az állapotot a jel (szám / pipa / ×) ÉS a képernyőolvasó-szöveg is mondja, nem csak a szín.
 * onSelect-tel kattintható (Javaslat 20): a bejárt lépés gomb, a mostani aria-current="step".
 */
export function Stepper({ label, steps, onSelect, className }: StepperProps) {
  return (
    <ol className={cx('bc-steps', className)} aria-label={label}>
      {steps.map((s, i) => {
        const body = (
          <>
            <b aria-hidden="true">{s.state === 'done' ? <IcCheck /> : s.state === 'error' ? <IcClose /> : i + 1}</b>
            <span>{s.label}</span>
            <span className="bc-sr"> – {STATE_TEXT[s.state]}</span>
          </>
        );
        const pick = onSelect && s.state !== 'current' && (s.reachable ?? (s.state === 'done' || s.state === 'error'));
        return (
          <li key={s.id} className={`is-${s.state}`} aria-current={s.state === 'current' ? 'step' : undefined}>
            {pick ? <button type="button" className="bc-steps-btn" onClick={() => onSelect(i, s)}>{body}</button> : body}
          </li>
        );
      })}
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
