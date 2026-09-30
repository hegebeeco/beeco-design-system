import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../cx';
import { addDays, addMonths, fromIso, inRange, MONTHS, monthGrid, toIso, todayIso, WEEKDAYS, WEEKDAYS_LONG } from './date';

export type CalendarProps = {
  /** Kijelölt nap(ok): egy nap, vagy időszak két vége */
  selected: { start: string | null; end?: string | null };
  onPick: (iso: string) => void;
  min?: string;
  max?: string;
};

/** Havi naptár (rács, role="grid"): nyilak = nap/hét, PageUp/Down = hónap, Home/End = hét eleje/vége, Enter = választ. */
export function Calendar({ selected, onPick, min, max }: CalendarProps) {
  const [focus, setFocus] = useState(selected.start ?? (inRange(todayIso(), min, max) ? todayIso() : min ?? max ?? todayIso()));
  const grid = useRef<HTMLTableElement>(null);
  const f = fromIso(focus);
  const days = monthGrid(f.getFullYear(), f.getMonth());
  const today = todayIso();

  // A billentyűzettel mozgatott nap kapja a fókuszt
  useEffect(() => { grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${focus}"]`)?.focus({ preventScroll: true }); }, [focus]);

  const move = (e: KeyboardEvent) => {
    const map: Record<string, () => string> = {
      ArrowLeft: () => addDays(focus, -1), ArrowRight: () => addDays(focus, 1), ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1), PageDown: () => addMonths(focus, 1),
      Home: () => addDays(focus, -((f.getDay() + 6) % 7)), End: () => addDays(focus, 6 - ((f.getDay() + 6) % 7)),
    };
    if (map[e.key]) { e.preventDefault(); setFocus(map[e.key]()); }
  };
  const isSel = (iso: string) => iso === selected.start || iso === selected.end;
  const inSel = (iso: string) => Boolean(selected.start && selected.end && iso > selected.start && iso < selected.end);

  return (
    <div className="bc-cal">
      <div className="bc-cal-head">
        <button type="button" className="bc-icon-btn" aria-label="Előző hónap" onClick={() => setFocus(addMonths(focus, -1))}>‹</button>
        <strong aria-live="polite">{f.getFullYear()}. {MONTHS[f.getMonth()]}</strong>
        <button type="button" className="bc-icon-btn" aria-label="Következő hónap" onClick={() => setFocus(addMonths(focus, 1))}>›</button>
      </div>
      <table className="bc-cal-grid" role="grid" ref={grid} onKeyDown={move} aria-label={`${f.getFullYear()}. ${MONTHS[f.getMonth()]}`}>
        <thead><tr>{WEEKDAYS.map((w, i) => <th key={w} scope="col" abbr={WEEKDAYS_LONG[i]}>{w}</th>)}</tr></thead>
        <tbody>
          {Array.from({ length: 6 }, (_, w) => (
            <tr key={w}>
              {days.slice(w * 7, w * 7 + 7).map((d) => {
                const iso = toIso(d);
                const off = !inRange(iso, min, max);
                return (
                  <td key={iso}>
                    <button type="button" data-iso={iso} tabIndex={iso === focus ? 0 : -1} disabled={off} aria-selected={isSel(iso)}
                      aria-label={`${d.getFullYear()}. ${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}${off ? ', nem választható' : ''}`}
                      className={cx('bc-day', d.getMonth() !== f.getMonth() && 'is-outside', iso === today && 'is-today', inSel(iso) && 'is-in-range')}
                      onClick={() => onPick(iso)}>
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
