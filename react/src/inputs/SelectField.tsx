import { forwardRef, type SelectHTMLAttributes } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectFieldProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement> & {
  options: ReadonlyArray<SelectOption>;
  /** Üres első opció szövege (pl. „Válassz…”); ha nincs megadva, nincs üres opció. Tiltott mezőn ez látszik akkor is, ha nincs opció
   *  (pl. „Előbb a kategóriát válaszd ki”); nem tiltott, opció nélküli mezőn „Nincs választható elem”. */
  placeholder?: string;
};

/** SelectField (atom + Field): natív legördülő rövid (≤ ~15 elemű) listához; hosszabbhoz a Combobox. */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, help, range, error, notice, required, disabled, className, options, placeholder, ...rest }, ref) {
  return (
    <Field label={label} help={help} range={range ?? (options.length ? `${options.length} lehetőség` : undefined)} error={error} notice={notice}
      required={required} disabled={disabled} className={className}>
      <FieldInput>
        {(f) => (
          <select ref={ref} id={f.id} aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined}
            className="bc-select" required={required} disabled={disabled || options.length === 0} {...rest}>
            {placeholder !== undefined && <option value="">{options.length || disabled ? placeholder : 'Nincs választható elem'}</option>}
            {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
          </select>
        )}
      </FieldInput>
    </Field>
  );
});
