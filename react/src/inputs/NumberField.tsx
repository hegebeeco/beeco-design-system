import { forwardRef, useEffect, useState, type InputHTMLAttributes } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { formatHu, numberRange, parseHu, sanitize } from './number';

export type NumberFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max'> & {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Tizedesjegyek száma (0 = egész szám) */
  decimals?: number;
  /** Mértékegység a mező mellett és a tartományban: Ft, %, db, km … */
  unit?: string;
  /** Mikor igazítson a határra: 'blur' (alap – kilépéskor) vagy 'input' (gépelés közben) */
  clamp?: 'blur' | 'input';
};

/**
 * NumberField (molekula, Javaslat 01 – 5A): gépelős számmező magyar formátummal.
 * Betű, második tizedesjel, fölösleges mínusz nem írható be; a tartományon kívüli érték a határra áll + jelzés.
 * react-hook-form-mal Controller-rel: <Controller name="x" render={({ field }) => <NumberField {...field} … />} />
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { label, help, range, error, notice, required, disabled, className, value, onChange, min, max, decimals = 0, unit, clamp = 'blur', onBlur, ...rest }, ref) {
  const [text, setText] = useState(formatHu(value, decimals));
  const [note, setNote] = useState<string>();
  const [focused, setFocused] = useState(false);

  // Kívülről jövő érték (pl. űrlap visszaállítása) – csak ha nem épp gépel
  useEffect(() => { if (!focused) setText(formatHu(value, decimals)); }, [value, decimals, focused]);

  const fit = (n: number | null) => {
    if (n === null) return { n, msg: undefined as string | undefined };
    if (min !== undefined && n < min) return { n: min, msg: `A legkisebb értékre állítottam: ${formatHu(min, decimals)}${unit ? ' ' + unit : ''}.` };
    if (max !== undefined && n > max) return { n: max, msg: `A legnagyobb értékre állítottam: ${formatHu(max, decimals)}${unit ? ' ' + unit : ''}.` };
    return { n, msg: undefined };
  };

  const control = (
    <FieldInput>
      {(f) => (
        <input ref={ref} id={f.id} aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined}
          className="bc-input" type="text" inputMode={decimals > 0 ? 'decimal' : 'numeric'} autoComplete="off"
          required={required} disabled={disabled} value={text}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            const clean = sanitize(e.target.value, decimals, min === undefined || min < 0);
            let n = parseHu(clean);
            setNote(undefined);
            if (clamp === 'input' && n !== null) { const r = fit(n); if (r.msg) { n = r.n; setNote(r.msg); setText(formatHu(n, decimals)); onChange(n); return; } }
            setText(clean);
            onChange(n);
          }}
          onBlur={(e) => {
            setFocused(false);
            const r = fit(parseHu(text));
            setText(formatHu(r.n, decimals));
            if (r.msg) setNote(r.msg);
            if (r.n !== value) onChange(r.n);
            onBlur?.(e);
          }} {...rest} />
      )}
    </FieldInput>
  );

  return (
    <Field label={label} help={help} range={range ?? numberRange(min, max, unit, decimals)} error={error} notice={notice ?? note}
      required={required} disabled={disabled} className={className}>
      {unit ? <div className="bc-affix">{control}<span aria-hidden="true">{unit}</span></div> : control}
    </Field>
  );
});
