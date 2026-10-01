import { dayTitle, KIND_ROLE, type CalEvent, type CalKind } from './monthEvents';

const KINDS: CalKind[] = ['event', 'special', 'education'];

/**
 * A naptár jelmagyarázata: minden fajta csíkkal + névvel. Ha van onHiddenChange, a tételek kapcsolók (szűrő):
 * aria-pressed = látszik-e – a bekapcsolt állapotot a pipa és a szöveg is mondja.
 */
export function MonthLegend({ names, hidden, onHiddenChange }: { names: Record<CalKind, string>; hidden: ReadonlySet<CalKind>; onHiddenChange?: (h: CalKind[]) => void }) {
  if (!onHiddenChange) {
    return (
      <ul className="bc-mcal-legend" aria-label="Jelmagyarázat">
        {KINDS.map((k) => <li key={k}><span className={`bc-mcal-ev is-${KIND_ROLE[k]}`}>{names[k]}</span></li>)}
      </ul>
    );
  }
  const toggle = (k: CalKind) => onHiddenChange(hidden.has(k) ? [...hidden].filter((x) => x !== k) : [...hidden, k]);
  return (
    <div className="bc-mcal-legend" role="group" aria-label="Jelmagyarázat és szűrő – mit mutasson a naptár">
      {KINDS.map((k) => (
        <button key={k} type="button" className={`bc-tag bc-mcal-filter is-${KIND_ROLE[k]}`} aria-pressed={!hidden.has(k)} onClick={() => toggle(k)}>
          <span aria-hidden="true">{hidden.has(k) ? '○' : '✓'}</span>{names[k]}
        </button>
      ))}
    </div>
  );
}

/** A kiválasztott nap listája (telefonon a pöttyös hónap alatt; asztalon rejtve – ott az oldalpanel nyílik) */
export function MonthAgenda({ iso, events, names }: { iso: string; events: readonly CalEvent[]; names: Record<CalKind, string> }) {
  return (
    <section className="bc-mcal-agenda">
      <h3 className="bc-mcal-agenda-title">{dayTitle(iso)}</h3>
      {events.length ? (
        <ul>
          {events.map((e) => (
            <li key={e.id} className={`bc-mcal-ev is-${KIND_ROLE[e.kind]}`}>
              <span>{e.title}</span> <span className="bc-mcal-kind">{names[e.kind]}</span>
            </li>
          ))}
        </ul>
      ) : <p className="bc-mcal-note">Ezen a napon nincs tartalom.</p>}
    </section>
  );
}
