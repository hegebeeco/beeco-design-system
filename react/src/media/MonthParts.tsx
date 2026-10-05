import type { ReactNode } from 'react';
import { dayTitle, type CalEvent } from './monthEvents';

/** Egy fajta megjelenése a naptárban: név, szerepszín, piktogram (a MonthCalendar számolja ki) */
export type KindView = { label: string; tone: string; icon?: ReactNode };

const Ic = ({ icon }: { icon?: ReactNode }) => (icon ? <span className="bc-mcal-ic" aria-hidden="true">{icon}</span> : null);

/**
 * A naptár jelmagyarázata: minden fajta csíkkal + névvel (+ piktogrammal). Ha van onHiddenChange, a tételek kapcsolók (szűrő):
 * aria-pressed = látszik-e – a bekapcsolt állapotot a pipa és a szöveg is mondja.
 */
export function MonthLegend<K extends string>({ kinds, view, hidden, onHiddenChange }: { kinds: readonly K[]; view: (k: K) => KindView; hidden: ReadonlySet<K>; onHiddenChange?: (h: K[]) => void }) {
  if (!onHiddenChange) {
    return (
      <ul className="bc-mcal-legend" aria-label="Jelmagyarázat">
        {kinds.map((k) => { const v = view(k); return <li key={k}><span className={`bc-mcal-ev is-${v.tone}`}><Ic icon={v.icon} />{v.label}</span></li>; })}
      </ul>
    );
  }
  const toggle = (k: K) => onHiddenChange(hidden.has(k) ? [...hidden].filter((x) => x !== k) : [...hidden, k]);
  return (
    <div className="bc-mcal-legend" role="group" aria-label="Jelmagyarázat és szűrő – mit mutasson a naptár">
      {kinds.map((k) => {
        const v = view(k);
        return (
          <button key={k} type="button" className={`bc-tag bc-mcal-filter is-${v.tone}`} aria-pressed={!hidden.has(k)} onClick={() => toggle(k)}>
            <span aria-hidden="true">{hidden.has(k) ? '○' : '✓'}</span><Ic icon={v.icon} />{v.label}
          </button>
        );
      })}
    </div>
  );
}

/** A kiválasztott nap listája (telefonon a pöttyös hónap alatt; asztalon rejtve – ott az oldalpanel nyílik) */
export function MonthAgenda<K extends string>({ iso, events, view }: { iso: string; events: readonly CalEvent<K>[]; view: (k: K) => KindView }) {
  return (
    <section className="bc-mcal-agenda">
      <h3 className="bc-mcal-agenda-title">{dayTitle(iso)}</h3>
      {events.length ? (
        <ul>
          {events.map((e) => {
            const v = view(e.kind);
            return (
              <li key={e.id} className={`bc-mcal-ev is-${v.tone}`}>
                <span><Ic icon={v.icon} />{e.title}</span> <span className="bc-mcal-kind">{v.label}</span>
              </li>
            );
          })}
        </ul>
      ) : <p className="bc-mcal-note">Ezen a napon nincs tartalom.</p>}
    </section>
  );
}
