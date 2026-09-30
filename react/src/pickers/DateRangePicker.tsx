import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { Calendar } from './Calendar';
import { formatHuDate, inRange } from './date';
import { dateRangeText } from './DatePicker';

export type DateRange = { start: string | null; end: string | null };
export type DateRangePickerProps = FieldProps & { value: DateRange; onChange: (r: DateRange) => void; min?: string; max?: string };

/** DateRangePicker (molekula, 2A időszak): első kattintás = kezdet, második = vég; fordított sorrendnél megcseréli és szól. */
export function DateRangePicker({ value, onChange, min, max, range, notice, ...field }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string>();
  const label = value.start ? `${formatHuDate(value.start)} – ${value.end ? formatHuDate(value.end) : '…'}` : 'Válassz időszakot';
  const pick = (iso: string) => {
    if (!inRange(iso, min, max)) return;
    setNote(undefined);
    if (!value.start || value.end) { onChange({ start: iso, end: null }); return; }
    if (iso < value.start) { onChange({ start: iso, end: value.start }); setNote('A vég a kezdet elé esett – felcseréltem.'); }
    else onChange({ start: value.start, end: iso });
    setOpen(false);
  };
  return (
    <Field {...field} range={range ?? dateRangeText(min, max)} notice={notice ?? note}>
      <FieldInput>
        {(f) => (
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <button id={f.id} type="button" className="bc-select" style={{ textAlign: 'left' }} aria-describedby={f.describedBy} disabled={field.disabled}>
                {label}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="bc-pop" style={{ padding: 0 }} align="start" sideOffset={6} collisionPadding={16}>
                <Calendar selected={value} min={min} max={max} onPick={pick} />
                <div className="bc-cal-foot" style={{ padding: '0 var(--bc-sp-3) var(--bc-sp-3)' }}>
                  <span className="bc-help">{value.start && !value.end ? 'Most válaszd a végét.' : 'Válaszd a kezdőnapot.'}</span>
                  <button type="button" className="bc-btn is-sm is-ghost" onClick={() => { onChange({ start: null, end: null }); setNote(undefined); }}>Törlés</button>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </FieldInput>
    </Field>
  );
}
