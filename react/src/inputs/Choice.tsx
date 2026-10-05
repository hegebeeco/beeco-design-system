import { forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';

type ChoiceBase = { label: string; help: ReactNode; error?: string; className?: string };

/** Checkbox (atom): natív jelölő a beeco színeivel, címke + súgó; react-hook-form register-rel is. */
export const Checkbox = forwardRef<HTMLInputElement, ChoiceBase & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(function Checkbox(
  { label, help, error, className, ...rest }, ref) {
  const id = useId();
  return (
    <div className={cx('bc-field', className)}>
      <div className="bc-label-row">
        <label className="bc-check" htmlFor={id}>
          <input ref={ref} id={id} type="checkbox" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
          {label}
        </label>
        <HelpButton label={label}>{help}</HelpButton>
      </div>
      {error && <p className="bc-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
});

/**
 * CheckboxInput (atom, 2026-10-01): a márkázott jelölőnégyzet címke és súgó nélkül – ahol a környezet adja a nevet
 * (táblázat-sor, galéria-csempe, „mind kijelölése”). Kötelező: aria-label, vagy egy <label> körülötte. `indeterminate`: részleges („–”).
 */
export const CheckboxInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { indeterminate?: boolean }>(function CheckboxInput(
  { className, indeterminate, ...rest }, ref) {
  const sajat = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (sajat.current) sajat.current.indeterminate = Boolean(indeterminate); }, [indeterminate]);
  return <input ref={(el) => { sajat.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }} type="checkbox" className={cx('bc-checkbox', className)} {...rest} />;
});

export type RadioGroupProps = ChoiceBase & {
  name: string;
  options: ReadonlyArray<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

/** RadioGroup (molekula): fieldset + legend + súgó; natív rádiógombok (nyilakkal léptethető). */
export function RadioGroup({ label, help, error, className, name, options, value, onChange, required, disabled }: RadioGroupProps) {
  const id = useId();
  return (
    <fieldset className={cx('bc-field', 'bc-fieldset', className)}
      aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error ? true : undefined} disabled={disabled}>
      {/* A legend a fieldset ELSŐ gyermeke kell legyen – így lesz a csoportnak hozzáférhető neve */}
      <legend className="bc-label-row">
        <span className="bc-label">{label}{required && <span className="is-req" aria-hidden="true">*</span>}</span>
        <HelpButton label={label}>{help}</HelpButton>
      </legend>
      <div className="bc-row">
        {options.map((o) => (
          <label key={o.value} className="bc-check">
            <input type="radio" name={name} value={o.value} disabled={o.disabled} required={required}
              checked={value === undefined ? undefined : value === o.value} onChange={() => onChange?.(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
      {error && <p className="bc-error" id={`${id}-err`} role="alert">{error}</p>}
    </fieldset>
  );
}

export type SwitchProps = ChoiceBase & { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean };

/** Switch (atom): azonnal érvényes be/ki kapcsoló (role="switch"); címke + súgó. */
export function Switch({ label, help, error, className, checked, onChange, disabled }: SwitchProps) {
  const id = useId();
  return (
    <div className={cx('bc-field', className)}>
      <div className="bc-label-row" style={{ gap: 'var(--bc-sp-2)' }}>
        <button id={id} type="button" role="switch" aria-checked={checked} className="bc-switch" disabled={disabled}
          aria-labelledby={`${id}-l`} onClick={() => onChange(!checked)} />
        <span className="bc-label" id={`${id}-l`}>{label}</span>
        <HelpButton label={label}>{help}</HelpButton>
      </div>
      {error && <p className="bc-error" role="alert">{error}</p>}
    </div>
  );
}

export type SwitchInputProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'role' | 'aria-checked' | 'children'> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Kötelező (ha nincs aria-labelledby): a képernyőolvasó neve a sor nevével, pl. „Látható az appban: Méhes Kávézó” */
  'aria-label'?: string;
  /** md = a mező-kapcsoló mérete (alap) · sm = tömör, táblázatsorba: kisebb sín, az érintési felület 44 px marad, a sort nem nyújtja */
  size?: 'md' | 'sm';
  /** Látható állapot-szöveg a kapcsoló mellett (nem csak színnel jelez), pl. „Látható” / „Rejtett” */
  onText?: string;
  offText?: string;
  /** Mentés folyamatban (pl. a sorban): addig nem nyomható */
  busy?: boolean;
};

/**
 * SwitchInput (atom, Javaslat 20): a márkázott kapcsoló címke-sor és súgó nélkül – ahol a környezet adja a nevet és a súgót
 * (táblázat-sor: a súgó az oszlopfejlécben). Azonnal érvényes be/ki (role="switch"); a mentést és a visszavonást
 * (notify.undo) a hívó végzi. Kötelező: aria-label (vagy aria-labelledby).
 */
export const SwitchInput = forwardRef<HTMLButtonElement, SwitchInputProps>(function SwitchInput(
  { checked, onChange, size = 'md', onText, offText, busy, disabled, className, onClick, ...rest }, ref) {
  const btn = (
    <button ref={ref} type="button" role="switch" aria-checked={checked} className={cx('bc-switch', size === 'sm' && 'is-sm', !(onText || offText) && className)}
      disabled={disabled || busy} aria-busy={busy || undefined}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onChange(!checked); }} {...rest} />
  );
  if (!onText && !offText) return btn;
  return (
    <span className={cx('bc-switch-inline', size === 'sm' && 'is-sm', className)}>
      {btn}
      {/* az állapotot a kapcsoló (aria-checked) már mondja – a szöveg a látó felhasználónak szól */}
      <span className="bc-switch-state" aria-hidden="true">{checked ? onText : offText}</span>
    </span>
  );
});
