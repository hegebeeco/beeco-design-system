import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { cx } from '../cx';
import { Button, IconButton } from '../inputs/Button';
import { addDays, addMonths, fromIso, MONTHS, monthGrid, toIso, todayIso, WEEKDAYS, WEEKDAYS_LONG } from '../pickers/date';
import { IcLeft, IcRight } from './icons';
import { MonthAgenda, MonthLegend, type KindView } from './MonthParts';
import { CAL_KINDS, dayTitle, eventsByDay, kindLabel, kindTone, type CalEvent, type CalKind, type CalKindDef } from './monthEvents';

export type MonthCalendarProps<K extends string = CalKind> = {
  events: readonly CalEvent<K>[];
  /** Kezdő hónap: bármelyik nap 'YYYY-MM-DD' (alap: ma) */
  initialDate?: string;
  /** Hónapváltáskor (a projekt ekkor tölti be a hónap tartalmát): az első nap 'YYYY-MM-01' */
  onMonthChange?: (firstDay: string) => void;
  /** Napra koppintás / Enter – asztalon itt nyílhat az oldalpanel */
  onSelectDay?: (iso: string, events: CalEvent<K>[]) => void;
  /** Egy cellában legfeljebb ennyi cím, a többi „+N további” */
  maxPerDay?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  /** Rejtett fajták (a jelmagyarázat szűrőként működik, ha van onHiddenChange) */
  hidden?: readonly K[];
  onHiddenChange?: (hidden: K[]) => void;
  labels?: Partial<Record<K, string>>;
  /**
   * Mely fajták szerepeljenek a jelmagyarázatban, ebben a sorrendben (alap: a három beépített + a kindDefs saját fajtái) –
   * pl. ahol csak esemény és egy másik fajta van (1.25)
   */
  kinds?: readonly K[];
  /**
   * Javaslat 20 – bővíthető fajták: a projekt saját fajtája (pl. 'kupon': { label: 'Kupon-időzítés', tone: 'neutral', icon: <… /> })
   * címkével, szerepszínnel és piktogrammal; a beépítettek is felülírhatók (pl. piktogram). Szerepszín: info, warning, success,
   * danger, neutral – a jelentést a piktogram és a felirat is viszi, nem csak a szín.
   */
  kindDefs?: Partial<Record<K, CalKindDef>>;
};

/**
 * MonthCalendar (organizmus, Javaslat 04 – 7A): havi rács hétfővel; a fajtát bal csík + szerepszín + jelmagyarázat mondja (nem csak a szín).
 * Javaslat 20: a projekt saját fajtákat adhat (kindDefs: címke, szerepszín, piktogram).
 * Billentyűzet: nyilak = nap/hét, PageUp/Down = hónap, Home/End = hét eleje/vége, Enter = a nap megnyitása.
 * Keskeny helyen (560 px alatt) pöttyös hónap + a kiválasztott nap listája.
 */
export function MonthCalendar<K extends string>(props: MonthCalendarProps<K> & { kindDefs: Partial<Record<K, CalKindDef>> }): ReactElement;
export function MonthCalendar(props: MonthCalendarProps): ReactElement;
export function MonthCalendar<K extends string = CalKind>({ events, initialDate, onMonthChange, onSelectDay, maxPerDay = 3, loading, error, onRetry, hidden = [], onHiddenChange, labels, kinds, kindDefs }: MonthCalendarProps<K>) {
  const [focus, setFocus] = useState(initialDate ?? todayIso());
  const [selected, setSelected] = useState(focus);
  const grid = useRef<HTMLTableElement>(null);
  const moved = useRef(false);
  const f = fromIso(focus);
  const monthKey = `${f.getFullYear()}-${f.getMonth()}`;
  const days = useMemo(() => monthGrid(f.getFullYear(), f.getMonth()).map(toIso), [monthKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const hid = useMemo(() => new Set<K>(hidden), [hidden]);
  const kindList = useMemo(() => kinds ?? ([...CAL_KINDS, ...Object.keys(kindDefs ?? {}).filter((k) => !(CAL_KINDS as readonly string[]).includes(k))] as K[]),
    [kinds, kindDefs]);
  const byDay = useMemo(() => eventsByDay(events, days, hid, kindList), [events, days, hid, kindList]);
  const view = (k: K): KindView => ({ label: kindLabel(k, labels, kindDefs), tone: kindTone(k, kindDefs), icon: kindDefs?.[k]?.icon });
  const today = todayIso();
  const title = `${f.getFullYear()}. ${MONTHS[f.getMonth()]}`;
  const monthCount = days.filter((d) => fromIso(d).getMonth() === f.getMonth()).reduce((n, d) => n + (byDay.get(d)?.length ?? 0), 0);

  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } onMonthChange?.(`${focus.slice(0, 7)}-01`); }, [monthKey]); // eslint-disable-line react-hooks/exhaustive-deps
  // Billentyűzettel mozgatott nap kapja a fókuszt (egérnél nem ugrik)
  useEffect(() => { if (moved.current) { grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${focus}"]`)?.focus({ preventScroll: true }); moved.current = false; } }, [focus]);

  const go = (iso: string, kb = false) => { moved.current = kb; setFocus(iso); };
  const pick = (iso: string) => { setFocus(iso); setSelected(iso); onSelectDay?.(iso, byDay.get(iso) ?? []); };
  const onKey = (e: KeyboardEvent) => {
    const dow = (f.getDay() + 6) % 7;
    const map: Record<string, () => string> = {
      ArrowLeft: () => addDays(focus, -1), ArrowRight: () => addDays(focus, 1), ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1), PageDown: () => addMonths(focus, 1), Home: () => addDays(focus, -dow), End: () => addDays(focus, 6 - dow),
    };
    if (map[e.key]) { e.preventDefault(); go(map[e.key](), true); }
  };

  return (
    <div className="bc-mcal" aria-busy={loading || undefined}>
      <div className="bc-mcal-head">
        <IconButton aria-label="Előző hónap" onClick={() => go(addMonths(focus, -1))}><IcLeft /></IconButton>
        <h2 className="bc-mcal-title" aria-live="polite">{title}</h2>
        <IconButton aria-label="Következő hónap" onClick={() => go(addMonths(focus, 1))}><IcRight /></IconButton>
        <Button variant="secondary" size="sm" onClick={() => { go(today); setSelected(today); }} disabled={focus.slice(0, 7) === today.slice(0, 7)}>Ma</Button>
      </div>
      <MonthLegend kinds={kindList} view={view} hidden={hid} onHiddenChange={onHiddenChange} />
      {loading && <p className="bc-mcal-note" role="status"><span className="bc-spinner" aria-hidden="true" /> Töltöm a hónap tartalmát…</p>}
      {error && <div className="bc-alert is-danger" role="alert"><p>{error}</p>{onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Újrapróbálás</Button>}</div>}
      {!error && !loading && monthCount === 0 && (
        <p className="bc-mcal-note" role="status">{kindList.every((k) => hid.has(k)) ? 'Minden tartalomfajta ki van kapcsolva – kapcsolj be egyet a jelmagyarázatban.' : `${title}: ebben a hónapban még nincs tartalom.`}</p>
      )}
      <div className="bc-mcal-scroll">
        <table className="bc-mcal-grid" role="grid" ref={grid} onKeyDown={onKey} aria-label={`${title} – tartalmi naptár`}>
          <thead><tr>{WEEKDAYS.map((w, i) => <th key={w} scope="col" abbr={WEEKDAYS_LONG[i]}>{w}</th>)}</tr></thead>
          <tbody>
            {Array.from({ length: 6 }, (_, w) => (
              <tr key={w}>
                {days.slice(w * 7, w * 7 + 7).map((iso) => {
                  const list = byDay.get(iso) ?? [];
                  const out = fromIso(iso).getMonth() !== f.getMonth();
                  const more = list.length - maxPerDay;
                  const summary = list.length ? `, ${list.length} tartalom: ${list.map((e) => `${e.title} (${view(e.kind).label})`).join('; ')}` : ', nincs tartalom';
                  return (
                    <td key={iso} role="gridcell" aria-selected={iso === selected}>
                      <button type="button" data-iso={iso} tabIndex={iso === focus ? 0 : -1} onClick={() => pick(iso)}
                        className={cx('bc-mcal-day', out && 'is-outside', iso === today && 'is-today', iso === selected && 'is-selected')}
                        aria-label={`${iso === today ? 'Ma, ' : ''}${dayTitle(iso)}${summary}`}>
                        <b aria-hidden="true">{fromIso(iso).getDate()}</b>
                        <span className="bc-mcal-evs" aria-hidden="true">
                          {list.slice(0, more > 0 ? maxPerDay - 1 : maxPerDay).map((e) => { const v = view(e.kind); return <span key={e.id} className={`bc-mcal-ev is-${v.tone}`}>{v.icon && <span className="bc-mcal-ic">{v.icon}</span>}{e.title}</span>; })}
                          {more > 0 && <span className="bc-mcal-more">+{more + 1} további</span>}
                        </span>
                        <span className="bc-mcal-dots" aria-hidden="true">{[...new Set(list.map((e) => e.kind))].map((k) => <i key={k} className={`is-${kindTone(k, kindDefs)}`} />)}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MonthAgenda iso={selected} events={byDay.get(selected) ?? eventsByDay(events, [selected], hid, kindList).get(selected) ?? []} view={view} />
    </div>
  );
}
