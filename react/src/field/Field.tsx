import { useId, type ReactNode } from 'react';
import { cx } from '../cx';
import { FieldContext } from './FieldContext';
import { HelpButton } from './HelpButton';

/** Minden beviteli mező közös keret-props-a (docs/komponensek.md 3/A). */
export type FieldProps = {
  /** Látható címke – kötelező */
  label: string;
  /** Súgó: mit és miért kell megadni – kötelező (a ⓘ gomb mögé kerül) */
  help: ReactNode;
  /** Érvényes tartomány szövegesen, pl. „3–60 karakter”, „0–100 %” */
  range?: string;
  /** Aktuális állapot, pl. { value: 213, max: 255 } → „213/255” */
  count?: { value: number; max: number; unit?: string };
  /** Hibaüzenet (a következő lépéssel) – ha van, a mező aria-invalid */
  error?: string;
  /** Tájékoztató jelzés, pl. „A végét levágtam: 255 karakter a határ.” */
  notice?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

type Props = FieldProps & { children: ReactNode; labelFor?: boolean };

/**
 * Field (molekula): címke + súgó · mező · tartomány + számláló · hiba/jelzés.
 * A benne lévő mező a FieldContext-ből kapja az id-t és az aria-describedby-t.
 */
export function Field({ label, help, range, count, error, notice, required = false, disabled = false, className, children, labelFor = true }: Props) {
  const id = useId();
  const metaId = `${id}-meta`, errId = `${id}-err`, noteId = `${id}-note`;
  const hasMeta = Boolean(range || count);
  const describedBy = [hasMeta && metaId, error && errId, notice && noteId].filter(Boolean).join(' ') || undefined;
  const ratio = count ? count.value / Math.max(1, count.max) : 0;
  const LabelTag = labelFor ? 'label' : 'span';

  return (
    <div className={cx('bc-field', className)}>
      <div className="bc-label-row">
        <LabelTag className="bc-label" {...(labelFor ? { htmlFor: id } : { id: `${id}-label` })}>
          {label}
          {required && <span className="is-req" aria-hidden="true">*</span>}
          {required && <span className="bc-sr"> (kötelező)</span>}
        </LabelTag>
        <HelpButton label={label}>{help}</HelpButton>
      </div>
      <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required, disabled }}>{children}</FieldContext.Provider>
      {hasMeta && (
        <div className="bc-meta" id={metaId}>
          {range && <span>{range}</span>}
          {count && (
            <span className={cx('bc-count', ratio >= 1 ? 'is-full' : ratio >= 0.9 && 'is-near')}>
              {count.value}/{count.max}
              {count.unit ? ` ${count.unit}` : ''}
              {ratio >= 1 && <span className="bc-sr"> – elérted a határt</span>}
            </span>
          )}
        </div>
      )}
      {error && <p className="bc-error" id={errId} role="alert">{error}</p>}
      {notice && !error && <p className="bc-notice" id={noteId} role="status">{notice}</p>}
    </div>
  );
}
