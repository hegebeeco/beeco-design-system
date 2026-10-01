import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
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
