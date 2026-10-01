import { useId } from 'react';
import { cx } from '../cx';
import { isBlank, showValue, type MergeFieldDef, type MergeRecord } from './merge';

type Props = {
  field: MergeFieldDef;
  records: MergeRecord[];
  chosen?: string;
  onChoose: (recordId: string) => void;
  /** Kötelező mező üres értékét választották */
  error?: string;
};

/** Egy eltérő mező: rádiócsoport, rekordonként egy kártya-opció (a nyilak a rádiók között léptetnek). */
export function MergeFieldChoice({ field, records, chosen, onChoose, error }: Props) {
  const name = useId();
  const show = field.format ?? showValue;
  return (
    <fieldset className="bc-merge-field" data-field={field.key} data-decided={chosen ? true : undefined}
      aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="bc-merge-legend">
        {field.label}
        {field.required && <span className="is-req" aria-hidden="true">*</span>}
        <span className="bc-badge is-warning">eltér</span>
        {!chosen && <span className="bc-sr"> – még nem választottál</span>}
      </legend>
      <div className="bc-merge-opts">
        {records.map((r) => {
          const v = r.values[field.key];
          const blank = isBlank(v);
          return (
            <label key={r.id} className={cx('bc-merge-opt', chosen === r.id && 'is-on', blank && 'is-blank')}>
              <input type="radio" name={name} value={r.id} checked={chosen === r.id} onChange={() => onChoose(r.id)} />
              <span className="bc-merge-src">{r.label}</span>
              <span className="bc-merge-val">{blank ? '(üres)' : show(v)}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="bc-error" id={`${name}-err`} role="alert">{error}</p>}
    </fieldset>
  );
}
