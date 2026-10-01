import { useEffect, useRef, useState } from 'react';
import { cx } from '../cx';
import { Button, IconButton } from '../inputs/Button';
import { CheckIcon, CopyIcon } from './icons';

export type CopyButtonProps = {
  /** Amit a vágólapra teszünk */
  value: string;
  /** Mit másol (a képernyőolvasó és a felirat ezt mondja): „kuponkód”, „partner-azonosító”, „link” */
  what: string;
  /** button = „Másolás” felirattal (alap) · icon = 44×44 ikongomb (táblázatsorban) */
  variant?: 'button' | 'icon';
  /** Az érték is látsszon a gomb előtt (pl. kuponkód kódbetűvel) */
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Vágólapra írás: modern API, ha nem megy (nem biztonságos oldal, régi WebView), a régi execCommand-módszer */
export async function copyText(text: string): Promise<boolean> {
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; } } catch { /* tovább a tartalékra */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch { return false; }
}

/**
 * CopyButton (atom, Javaslat 06a/2): másol + „Másolva” pipa (05: mentve-pipa) + képernyőolvasó-bejelentés.
 * Ha a böngésző nem enged másolni: kijelölt, csak olvasható mező jelenik meg az értékkel – kézzel másolható.
 */
export function CopyButton({ value, what, variant = 'button', showValue, disabled, className }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const [msg, setMsg] = useState('');
  const fallback = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { if (state === 'failed') fallback.current?.select(); }, [state]);

  const run = async () => {
    window.clearTimeout(timer.current);
    if (await copyText(value)) {
      setState('done'); setMsg(`Kimásoltam: ${what}.`);
      timer.current = window.setTimeout(() => setState('idle'), 1500);
    } else {
      setState('failed'); setMsg(`Nem sikerült a másolás (${what}) – jelöld ki, és másold kézzel.`);
    }
  };
  const done = state === 'done';
  const icon = done ? <span className="bc-anim-tick bc-copy-tick"><CheckIcon /></span> : <CopyIcon />;

  return (
    <span className={cx('bc-copy', className)} data-state={state}>
      {showValue && <code className="bc-copy-value">{value}</code>}
      {variant === 'icon'
        ? <IconButton aria-label={done ? `Másolva: ${what}` : `Másolás: ${what}`} onClick={run} disabled={disabled}>{icon}</IconButton>
        : <Button variant="secondary" size="sm" icon={icon} onClick={run} disabled={disabled} aria-label={`${done ? 'Másolva' : 'Másolás'}: ${what}`}>{done ? 'Másolva' : 'Másolás'}</Button>}
      <span className="bc-sr" role="status">{msg}</span>
      {state === 'failed' && (
        <span className="bc-copy-fallback">
          <input ref={fallback} className="bc-input" readOnly value={value} aria-label={`${what} – jelöld ki és másold`} onFocus={(e) => e.currentTarget.select()} />
          <span className="bc-error">Nem sikerült a másolás. Jelöld ki, és másold: Ctrl+C (Macen ⌘C), telefonon hosszan nyomva.</span>
        </span>
      )}
    </span>
  );
}
