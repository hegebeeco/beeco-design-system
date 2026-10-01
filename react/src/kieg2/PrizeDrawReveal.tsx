import { useEffect, useRef, useState } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { BeeMoment } from '../meh/BeeMoment';
import { celebrate, HexLoader, useReducedMotion } from '../meh/motion';
import { cryptoIndex, drawTime, REVEAL_STEPS, tickerNames, wait, type DrawParticipant, type DrawRecord } from './draw';
import { DrawSpinner, WinnerCard } from './DrawStage';
import { RerollForm } from './RerollForm';

export type PrizeDrawRevealProps = {
  /** A nyeremény neve, pl. „2 db mozijegy” */
  prize: string;
  participants: ReadonlyArray<DrawParticipant>;
  /**
   * A projekt sorsolója (éleshez kötelező: szerveroldali, naplózott). Megkapja a húzható résztvevőket, visszaadja a nyertest.
   * Ha nincs megadva, a DS a böngésző kriptográfiai véletlenjével húz, és jól láthatóan „teszt-sorsolás”-nak jelöli.
   */
  draw?: (pool: ReadonlyArray<DrawParticipant>) => DrawParticipant | Promise<DrawParticipant>;
  /** Minden húzás után (első és újra) – mentsd a jegyzőkönyvbe */
  onDrawn?: (record: DrawRecord) => void;
  /** Újrasorsolás kérésekor, a húzás ELŐTT – az indokot naplózd */
  onReroll?: (r: { previous: DrawParticipant; reason: string }) => void;
  /** Újrasorsolásnál a korábbi nyertesek kimaradnak (alap: igen) */
  excludePrevious?: boolean;
  /** Az újrasorsolás indokának legkisebb hossza (alap: 5 karakter) */
  minReasonLength?: number;
  /** A résztvevők még töltődnek */
  loading?: boolean;
  className?: string;
};

type Phase = 'ready' | 'spinning' | 'won' | 'reason' | 'error';

/**
 * PrizeDrawReveal (organizmus, Javaslat 06b/14): résztvevők száma → „Sorsolás” → rövid felfedés (≤ 2,5 s, csökkentett mozgásnál
 * azonnal) → nyertes Bajnok méhvel és hatszög-konfettivel → „Újrasorsolás” csak indokkal. A DS nem sorsol üzleti adatot,
 * ha a projekt ad sorsolót; nélküle teszt-sorsolás.
 */
export function PrizeDrawReveal({ prize, participants, draw, onDrawn, onReroll, excludePrevious = true, minReasonLength = 5, loading, className }: PrizeDrawRevealProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('ready');
  const [step, setStep] = useState(-1);
  const [names, setNames] = useState<string[]>([]);
  const [log, setLog] = useState<DrawRecord[]>([]);
  const [error, setError] = useState<string>();
  const [animated, setAnimated] = useState(false);
  const alive = useRef(true);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => { alive.current = false; }, []);

  const last = log[log.length - 1];
  const used = new Set(excludePrevious ? log.map((r) => r.winner.id) : []);
  const pool = participants.filter((p) => !used.has(p.id));
  const test = !draw;

  // A nyertes megjelenésekor: fókusz a nevére (képernyőolvasó is hallja) + egyszeri konfetti
  useEffect(() => {
    if (phase !== 'won') return;
    heading.current?.focus();
    if (animated) celebrate(heading.current);
  }, [phase, animated, log.length]);

  const run = async (from: ReadonlyArray<DrawParticipant>, reason?: string) => {
    if (!from.length) return;
    setError(undefined); setPhase('spinning');
    const instant = reduce || from.length === 1;
    const result = Promise.resolve().then(() => (draw ? draw(from) : from[cryptoIndex(from.length)]));
    result.catch(() => undefined); // a hibát lent kezeljük; így nincs „kezeletlen” figyelmeztetés a felfedés alatt
    if (!instant) {
      setNames(tickerNames(from, REVEAL_STEPS.length));
      for (let i = 0; i < REVEAL_STEPS.length; i++) { if (!alive.current) return; setStep(i); await wait(REVEAL_STEPS[i]); }
      setStep(REVEAL_STEPS.length); // ha a sorsoló még dolgozik: „Még sorsolunk…”
    }
    let w: DrawParticipant;
    try { w = await result; } catch {
      if (alive.current) { setPhase('error'); setError('Nem sikerült a sorsolás – senki nem nyert, a résztvevők nem változtak. Próbáld újra.'); }
      return;
    }
    if (!alive.current) return;
    if (!from.some((p) => p.id === w.id)) { setPhase('error'); setError('A sorsoló olyan nyertest adott, aki nincs a húzható résztvevők között – nem fogadtam el. Szólj a fejlesztőnek.'); return; }
    const rec: DrawRecord = { winner: w, at: new Date(), attempt: log.length + 1, reason, test, poolSize: from.length };
    setLog((l) => [...l, rec]); setAnimated(!instant); setStep(-1); setPhase('won');
    onDrawn?.(rec);
  };

  const n = participants.length;
  return (
    <section className={cx('bc-draw', className)} aria-label={`Sorsolás: ${prize}`}>
      <header className="bc-draw-head">
        <div>
          <p className="bc-draw-prize-label">Nyeremény</p>
          <h2 className="bc-draw-title">{prize}</h2>
        </div>
        <p className="bc-draw-count" data-count={n}>{loading ? <HexLoader label="Töltöm a résztvevőket" /> : <><b>{formatHu(n, 0)}</b> résztvevő</>}</p>
      </header>
      {test && <p className="bc-alert is-warning bc-draw-testnote" role="note"><span><b>Teszt-sorsolás:</b> nincs bekötve a sorsoló, ezért a böngésző véletlenje húz. Éles nyertest így ne hirdess.</span></p>}

      {!loading && n === 0 && <BeeMoment inline szerep="piheno" poen="Még nem zümmög itt senki." sima="Még nincs résztvevő – ha valaki jelentkezik, itt sorsolhatsz." />}
      {!loading && n === 1 && phase === 'ready' && <p className="bc-notice bc-draw-one" role="note">Egy résztvevő van, ezért a sorsolás biztosan őt adja (felfedés nélkül).</p>}

      {phase === 'spinning' && <DrawSpinner step={step} name={names[Math.min(Math.max(step, 0), names.length - 1)] ?? ''} waiting={step >= REVEAL_STEPS.length} />}
      {(phase === 'won' || phase === 'reason') && last && <WinnerCard ref={heading} winner={last.winner} prize={prize} test={last.test} attempt={last.attempt} animate={animated} />}
      {phase === 'error' && <p className="bc-alert is-danger" role="alert"><span>{error}</span></p>}
      <p className="bc-sr" role="status">{phase === 'spinning' ? 'Sorsolás folyamatban…' : phase === 'won' && last ? `A nyertes: ${last.winner.name}` : ''}</p>

      {phase === 'reason' && last && (
        <RerollForm previous={last.winner.name} minLength={minReasonLength} onCancel={() => setPhase('won')}
          onConfirm={(reason) => { onReroll?.({ previous: last.winner, reason }); void run(pool, reason); }} />
      )}
      {phase !== 'reason' && (
        <div className="bc-draw-actions">
          {(phase === 'ready' || phase === 'spinning' || (phase === 'error' && !last)) && (
            <Button size="lg" busy={phase === 'spinning'} disabled={loading || n === 0} onClick={() => void run(pool)}>{phase === 'error' ? 'Újrapróbálás' : 'Sorsolás'}</Button>
          )}
          {(phase === 'won' || (phase === 'error' && last)) && (
            <Button variant="secondary" disabled={pool.length === 0} onClick={() => setPhase('reason')}>Újrasorsolás</Button>
          )}
          {phase === 'won' && pool.length === 0 && <p className="bc-draw-hint">Nincs több húzható résztvevő – újrasorsolni nem lehet.</p>}
          {n === 0 && !loading && <p className="bc-draw-hint">A „Sorsolás” az első résztvevővel válik elérhetővé.</p>}
        </div>
      )}

      {log.length > 0 && (
        <details className="bc-draw-log" open={log.length > 1}>
          <summary>Jegyzőkönyv ({log.length} húzás)</summary>
          <ol>
            {log.map((r) => (
              <li key={r.attempt}><b>{r.winner.name}</b> – {drawTime(r.at)}, {formatHu(r.poolSize, 0)} résztvevőből{r.test ? ' (teszt-sorsolás)' : ''}{r.reason && <> · újrasorsolás oka: „{r.reason}”</>}</li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}
