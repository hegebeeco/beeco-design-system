import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { useLengthCounter } from './useLengthCounter';
import { mergeRefs } from './mergeRefs';
import { lengthRange } from './TextField';

export type TextAreaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** TextArea (atom + Field): mint a TextField, többsoros; élő számláló, levágás-jelzés. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, help, range, error, notice, required, disabled, className, minLength, maxLength, rows = 4, onInput, onPaste, ...rest }, ref) {
  const c = useLengthCounter<HTMLTextAreaElement>(maxLength);
  return (
    <Field label={label} help={help} range={range ?? lengthRange(minLength, maxLength)} count={maxLength ? { value: c.len, max: maxLength } : undefined}
      error={error} notice={notice ?? c.notice} required={required} disabled={disabled} className={className}>
      <FieldInput>
        {(f) => (
          <textarea ref={mergeRefs(ref, c.ref)} id={f.id} aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined}
            className="bc-textarea" rows={rows} required={required} disabled={disabled} minLength={minLength} maxLength={maxLength}
            onInput={(e) => { c.onInput(e); onInput?.(e); }} onPaste={(e) => { c.onPaste(e); onPaste?.(e); }} {...rest} />
        )}
      </FieldInput>
    </Field>
  );
});
