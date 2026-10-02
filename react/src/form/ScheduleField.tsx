import { useEffect, useId, useState } from 'react';
import { DatePicker } from '../pickers/DatePicker';
import { todayIso } from '../pickers/date';
import { SegmentedControl } from '../inputs/SegmentedControl';

/** Időzítés: kezdés (nap + idő) és elhagyható vég. null nap = „azonnal” (kezdésnél) / „nincs vége” (végnél). */
export type ScheduleValue = { date: string | null; time: string | null; endDate?: string | null; endTime?: string | null };

const helyi = (date: string | null | undefined, time: string | null | undefined) => (date ? new Date(`${date}T${time || '00:00'}:00`) : null);

/**
 * Az időzítés ellenőrzése (a mező és a projekt validációja ugyanezt mondja): múltbeli kezdés, a kezdés előtti vagy már elmúlt vég.
 * Visszaad: { start?, end? } – magyar mondat, a következő lépéssel.
 */
export function scheduleIssues(v: ScheduleValue, now: Date = new Date()): { start?: string; end?: string } {
  const kezd = helyi(v.date, v.time), veg = helyi(v.endDate, v.endTime);
  const r: { start?: string; end?: string } = {};
  if (kezd && kezd.getTime() <= now.getTime()) r.start = 'Ez az időpont már elmúlt. Adj meg jövőbeli időpontot, vagy válaszd az „Azonnal”-t.';
  const viszonyitas = kezd ?? now;
  if (veg && veg.getTime() <= viszonyitas.getTime()) r.end = kezd ? 'A vége a kezdés előtt (vagy vele egy időben) van. Adj meg későbbi időpontot.' : 'A vége már elmúlt. Adj meg jövőbeli időpontot, vagy hagyd üresen.';
  return r;
}

export type ScheduleFieldProps = {
  value: ScheduleValue;
  onChange: (v: ScheduleValue) => void;
  /** A kezdés címkéje (pl. „Megjelenés”) */
  label?: string;
  help?: string;
  /** Vég (lejárat) is – elhagyható mező */
  withEnd?: boolean;
  endLabel?: string;
  endHelp?: string;
  /** Feliratok: „Azonnal” / „Időzítve” */
  nowLabel?: string;
  laterLabel?: string;
  /** Külső hibák (pl. a szerverről); ha nincs, a mező a scheduleIssues szerint maga jelez, de csak megadott időpontnál */
  error?: string;
  endError?: string;
  /** Ne jelezzen magától (ha a projekt az EditPage hibaösszesítőjén át mutatja) */
  silent?: boolean;
};

/**
 * ScheduleField (molekula, Javaslat 13/4): „Azonnal / Időzítve” + nap és idő, elhagyható véggel (lejárat).
 * DatePicker + SegmentedControl-ból; a múltbeli kezdést és a kezdés előtti véget a mezőnél jelzi (scheduleIssues).
 * Az „Azonnal” a napot és az időt törli (a projekt üres kezdésként menti).
 */
export function ScheduleField({ value, onChange, label = 'Kezdés', help, withEnd, endLabel = 'Vége', endHelp, nowLabel = 'Azonnal', laterLabel = 'Időzítve', error, endError, silent }: ScheduleFieldProps) {
  const id = useId();
  const [mod, setMod] = useState<'now' | 'later'>(value.date ? 'later' : 'now');
  // Kívülről betöltött (pl. szerkesztett) időpont → időzített mód
  useEffect(() => { if (value.date) setMod('later'); }, [value.date]);
  const hibak = silent ? {} : scheduleIssues(value);

  return (
    <div className="bc-schedule" role="group" aria-labelledby={`${id}-l`}>
      <p className="bc-label bc-schedule-label" id={`${id}-l`}>{label}</p>
      <SegmentedControl label={label} value={mod} items={[{ value: 'now', label: nowLabel }, { value: 'later', label: laterLabel }]}
        onChange={(m) => { setMod(m); if (m === 'now') onChange({ ...value, date: null, time: null }); }} />
      {mod === 'later' && (
        <DatePicker label={`${label} napja`} help={help ?? 'Jövőbeli nap és időpont.'} required min={todayIso()} value={value.date}
          onChange={(d) => onChange({ ...value, date: d })} time={{ value: value.time, onChange: (t) => onChange({ ...value, time: t }), label: 'Időpont' }}
          error={error ?? (value.date ? hibak.start : undefined)} />
      )}
      {withEnd && (
        <DatePicker label={endLabel} help={endHelp ?? 'Elhagyható. Ezután már nem látszik.'} min={value.date ?? todayIso()} value={value.endDate ?? null}
          onChange={(d) => onChange({ ...value, endDate: d })} time={{ value: value.endTime ?? null, onChange: (t) => onChange({ ...value, endTime: t }), label: 'Időpont' }}
          error={endError ?? (value.endDate ? hibak.end : undefined)} />
      )}
    </div>
  );
}
