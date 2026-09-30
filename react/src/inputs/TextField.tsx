import { forwardRef, type InputHTMLAttributes } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { useLengthCounter } from './useLengthCounter';
import { mergeRefs } from './mergeRefs';
import { FieldInput } from '../field/FieldInput';

export type TextFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  type?: 'text' | 'email' | 'url' | 'tel' | 'password';
};

/** Tartomány-szöveg a hossz-határokból, ha a hívó nem adott meg sajátot */
export function lengthRange(min?: number, max?: number) {
  if (min && max) return `${min}–${max} karakter`;
  if (max) return `legfeljebb ${max} karakter`;
  if (min) return `legalább ${min} karakter`;
  return undefined;
}

/**
 * TextField (atom + Field keret): címke, súgó, tartomány, élő számláló (pl. 213/255),
 * a max. hossznál a gépelés megáll, a túl hosszú beillesztést levágja és jelzi.
 * react-hook-form: <TextField {...register('nev')} label=… help=… maxLength={60} />
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, help, range, error, notice, required, disabled, className, type = 'text', minLength, maxLength, onInput, onPaste, ...rest }, ref) {
  const c = useLengthCounter<HTMLInputElement>(maxLength);
  return (
    <Field label={label} help={help} range={range ?? lengthRange(minLength, maxLength)} count={maxLength ? { value: c.len, max: maxLength } : undefined}
      error={error} notice={notice ?? c.notice} required={required} disabled={disabled} className={className}>
      <FieldInput>
        {(f) => (
          <input ref={mergeRefs(ref, c.ref)} id={f.id} aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined}
            className="bc-input" type={type} required={required} disabled={disabled} minLength={minLength} maxLength={maxLength}
            onInput={(e) => { c.onInput(e); onInput?.(e); }} onPaste={(e) => { c.onPaste(e); onPaste?.(e); }} {...rest} />
        )}
      </FieldInput>
    </Field>
  );
});

