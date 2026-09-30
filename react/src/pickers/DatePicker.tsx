import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { Calendar } from './Calendar';
import { formatHuDate, inRange, parseHuDate } from './date';

export type DatePickerProps = FieldProps & {
  /** 'YYYY-MM-DD' (helyi nap) vagy null */
  value: string | null;
  onChange: (iso: string | null) => void;
  min?: string;
  max?: string;
  /** Időpont is (HH:mm) – külön mező a nap mellett */
  time?: { value: string | null; onChange: (hhmm: string | null) => void; label?: string };
};

const CalIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;

/** Tartomány szövege a határokból: „2026. 10. 01. után”, „2026. 10. 01. – 2026. 12. 31.” */
export const dateRangeText = (min?: string, max?: string) =>
  min && max ? `${formatHuDate(min)} – ${formatHuDate(max)}` : min ? `legkorábban ${formatHuDate(min)}` : max ? `legkésőbb ${formatHuDate(max)}` : 'formátum: éééé. hh. nn.';

/** „HH:mm” szűrő: csak számjegy és kettőspont; kilépéskor 00:00–23:59 közé igazít */
function fixTime(t: string): string | null {
  const m = t.replace(/[^\d:]/g, '').match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!m) return null;
  const h = Math.min(23, Number(m[1])), mi = Math.min(59, Number(m[2] || 0));
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
}

/** DatePicker (molekula, Javaslat 01 – 2A): gépelhető mező + lenyíló naptár (+ időpont). Tartományon kívüli nap nem választható. */
export function DatePicker({ value, onChange, min, max, time, range, notice, ...field }: DatePickerProps) {
  const [text, setText] = useState(formatHuDate(value));
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string>();
  const [typedErr, setTypedErr] = useState<string>();
  const [tText, setTText] = useState(time?.value ?? '');
  useEffect(() => setText(formatHuDate(value)), [value]);
  useEffect(() => setTText(time?.value ?? ''), [time?.value]);

  const accept = (iso: string | null) => {
    setTypedErr(undefined); setNote(undefined);
    if (iso && min && iso < min) { iso = min; setNote(`A legkorábbi választható napra állítottam: ${formatHuDate(min)}.`); }
    if (iso && max && iso > max) { iso = max; setNote(`A legkésőbbi választható napra állítottam: ${formatHuDate(max)}.`); }
    setText(formatHuDate(iso)); onChange(iso);
  };

  return (
    <Field {...field} range={range ?? dateRangeText(min, max)} notice={notice ?? note} error={field.error ?? typedErr}>
      <FieldInput>
        {(f) => (
          <div className="bc-date">
            <Popover.Root open={open} onOpenChange={setOpen}>
              <div className="bc-date-input">
                <input id={f.id} className="bc-input" inputMode="numeric" autoComplete="off" placeholder="éééé. hh. nn." value={text}
                  aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined} disabled={field.disabled} required={field.required}
                  onChange={(e) => setText(e.target.value.replace(/[^\d.\-/\s]/g, '').slice(0, 13))}
                  onBlur={() => { if (!text.trim()) { accept(null); return; } const iso = parseHuDate(text); if (iso) accept(iso); else setTypedErr('Ezt nem értem dátumnak – írd így: 2026. 10. 01., vagy válassz a naptárból.'); }}
                  onKeyDown={(e) => { if (e.key === 'ArrowDown' && e.altKey) setOpen(true); }} />
                <Popover.Trigger asChild>
                  <button type="button" className="bc-icon-btn" aria-label={`Naptár megnyitása: ${field.label}`} disabled={field.disabled}><CalIcon /></button>
                </Popover.Trigger>
              </div>
              <Popover.Portal>
                <Popover.Content className="bc-pop" style={{ padding: 0 }} align="end" sideOffset={6} collisionPadding={16}>
                  <Calendar selected={{ start: value }} min={min} max={max} onPick={(iso) => { if (inRange(iso, min, max)) { accept(iso); setOpen(false); } }} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            {time && (
              <input className="bc-input bc-time" inputMode="numeric" placeholder="óó:pp" aria-label={time.label ?? `${field.label} – időpont (óra:perc)`} value={tText}
                disabled={field.disabled} maxLength={5} onChange={(e) => setTText(e.target.value.replace(/[^\d:]/g, ''))}
                onBlur={() => { const t = tText.trim() ? fixTime(tText) : null; setTText(t ?? ''); time.onChange(t); }} />
            )}
          </div>
        )}
      </FieldInput>
    </Field>
  );
}
