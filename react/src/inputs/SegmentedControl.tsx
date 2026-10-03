import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../cx';

export type SegmentedControlProps<T extends string> = {
  /** Mit vált (képernyőolvasónak), pl. „Nézet” */
  label: string;
  value: T;
  onChange: (value: T) => void;
  items: ReadonlyArray<{ value: T; label: string; icon?: ReactNode; disabled?: boolean }>;
  /** sok elemnél: több sorba tördelődik (teljes szélesség), nem rejtetten görget – Javaslat 16 */
  wrap?: boolean;
  className?: string;
};

/**
 * SegmentedControl (molekula, Javaslat 01 – 3A): nézetváltó gombsor, méz kijelölés.
 * Rádiócsoport-viselkedés: egy Tab-megálló, a nyilak a következő engedélyezett elemre lépnek ÉS váltanak (a tiltottat átugorják).
 * Nem adatbevitel (nézetet vált), ezért nincs súgó gombja. Mindig van kijelölt elem.
 */
export function SegmentedControl<T extends string>({ label, value, onChange, items, wrap = false, className }: SegmentedControlProps<T>) {
  const root = useRef<HTMLDivElement>(null);
  const onKey = (e: KeyboardEvent) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const enabled = items.filter((i) => !i.disabled);
    const at = enabled.findIndex((i) => i.value === value);
    const next = enabled[(at + dir + enabled.length) % enabled.length];
    onChange(next.value);
    root.current?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  };
  return (
    <div ref={root} role="radiogroup" aria-label={label} className={cx('bc-seg', wrap && 'is-wrap', className)} onKeyDown={onKey}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button key={it.value} type="button" role="radio" aria-checked={on} data-state={on ? 'on' : 'off'} data-value={it.value}
            tabIndex={on ? 0 : -1} disabled={it.disabled} className="bc-seg-item" onClick={() => onChange(it.value)}>
            {it.icon && <span aria-hidden="true">{it.icon}</span>}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
