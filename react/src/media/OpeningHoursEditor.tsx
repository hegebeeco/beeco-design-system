import { useEffect, useId, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';
import { Button } from '../inputs/Button';
import { parseTime, validateHours, WEEK, type DayHours, type OpeningHours, type Weekday } from './openingHours';

export type OpeningHoursEditorProps = {
  label?: string;
  /** Súgó (ⓘ): mire kell, hol látszik az appban – kötelező */
  help: ReactNode;
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

/** Egy időmező: gépelhető („8”, „830”, „6pm”), kilépéskor „HH:mm”; érthetetlen szövegre szól. */
function TimeInput({ value, onCommit, label, invalid, describedBy, disabled, readOnly }: { value: string | null; onCommit: (t: string | null, bad: boolean) => void; label: string; invalid: boolean; describedBy?: string; disabled?: boolean; readOnly?: boolean }) {
  const [text, setText] = useState(value ?? '');
  useEffect(() => setText(value ?? ''), [value]);
  return (
    <input className="bc-input bc-hours-time" value={text} placeholder="óó:pp" aria-label={label} aria-invalid={invalid || undefined} aria-describedby={describedBy}
      maxLength={7} disabled={disabled} readOnly={readOnly} autoComplete="off" onChange={(e) => setText(e.target.value.replace(/[^\d:.,apmdeu ]/gi, ''))}
      onBlur={() => { const t = parseTime(text); if (t) setText(t); onCommit(t, Boolean(text.trim()) && !t); }} />
  );
}

/**
 * OpeningHoursEditor (organizmus, Javaslat 04 – 8A): soronként egy nap – kapcsoló (nyitva/zárva), nyitás–zárás, „Hétfő másolása a hétköznapokra”.
 * Ellenőrzés: a zárás a nyitás után legyen (legkésőbb 24:00); hiba a sor alatt, a következő lépéssel. Ma napi egy sáv, éjfél utáni zárás nélkül.
 */
export function OpeningHoursEditor({ label = 'Nyitvatartás', help, value, onChange, disabled, readOnly }: OpeningHoursEditorProps) {
  const id = useId();
  const [bad, setBad] = useState<Partial<Record<Weekday, string>>>({});
  const [note, setNote] = useState<string>();
  const errors = { ...validateHours(value), ...bad };
  const locked = disabled || readOnly;
  const set = (k: Weekday, p: Partial<DayHours>) => { setNote(undefined); onChange({ ...value, [k]: { ...value[k], ...p } }); };
  const commit = (k: Weekday, field: 'from' | 'to', t: string | null, wrong: boolean) => {
    setBad((b) => { const n = { ...b }; if (wrong) n[k] = `${WEEK.find((d) => d.key === k)!.label}: ezt nem értem időnek – írd így: 08:30 (vagy 8, 830).`; else delete n[k]; return n; });
    if (!wrong) set(k, { [field]: t });
  };
  const copyMon = () => {
    const m = value.Mon;
    onChange({ ...value, Tue: { ...m }, Wed: { ...m }, Thu: { ...m }, Fri: { ...m } });
    setNote(`Átmásoltam a keddtől péntekig tartó napokra: ${m.open ? `${m.from ?? '–'}–${m.to ?? '–'}` : 'zárva'}.`);
  };

  return (
    <div role="group" className={cx('bc-field bc-hours', disabled && 'is-disabled')} aria-labelledby={`${id}-l`} aria-describedby={`${id}-meta`}>
      <div className="bc-label-row">
        <span className="bc-label" id={`${id}-l`}>{label}</span>
        <HelpButton label={label}>{help}</HelpButton>
      </div>
      <div className="bc-hours-list">
        {WEEK.map(({ key, label: day }) => {
          const d = value[key];
          const err = errors[key];
          const errId = `${id}-${key}-err`;
          return (
            <div key={key} className={cx('bc-hours-row', err && 'is-invalid')} data-day={key}>
              <span className="bc-hours-day" id={`${id}-${key}`}>{day}</span>
              <button type="button" role="switch" className="bc-switch" aria-checked={d.open} disabled={locked}
                aria-label={`${day}: nyitva`} onClick={() => set(key, d.open ? { open: false } : { open: true, from: d.from ?? '08:00', to: d.to ?? '18:00' })} />
              {d.open ? (
                <span className="bc-hours-times" role="group" aria-labelledby={`${id}-${key}`}>
                  <TimeInput value={d.from} label={`${day}: nyitás`} invalid={Boolean(err)} describedBy={err ? errId : undefined} disabled={disabled} readOnly={readOnly} onCommit={(t, w) => commit(key, 'from', t, w)} />
                  <span aria-hidden="true">–</span>
                  <TimeInput value={d.to} label={`${day}: zárás`} invalid={Boolean(err)} describedBy={err ? errId : undefined} disabled={disabled} readOnly={readOnly} onCommit={(t, w) => commit(key, 'to', t, w)} />
                </span>
              ) : <span className="bc-hours-closed">Zárva</span>}
              {err && <p className="bc-error" id={errId} role="alert">{err}</p>}
            </div>
          );
        })}
      </div>
      <div className="bc-meta" id={`${id}-meta`}>
        <span>naponta egy sáv · 00:00–24:00 · a zárás a nyitás után</span>
        <span className="bc-count">{WEEK.filter((d) => value[d.key].open).length}/7 nap nyitva</span>
      </div>
      {!locked && <div className="bc-row"><Button variant="secondary" size="sm" onClick={copyMon}>Hétfő másolása a hétköznapokra</Button></div>}
      {note && <p className="bc-notice" role="status">{note}</p>}
    </div>
  );
}
