import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { BeeMoment } from '../meh/BeeMoment';
import { ProgressBar } from '../meh/motion';
import { UndoIcon } from './icons';
import { ReviewReject } from './ReviewReject';

export type ReviewDecision = { type: 'approve' | 'reject' | 'skip'; reason?: string };

export type ReviewQueueProps<T> = {
  items: ReadonlyArray<T>;
  getId: (item: T) => string;
  /** Az elem címe (fejléc és bejelentés): „Zöld Sarok Bolt” */
  getTitle: (item: T) => string;
  /** Az elem nagyban – a hívó rajzolja (adatok, kép, hiba-okok) */
  render: (item: T) => ReactNode;
  /** A döntés mentése; ígéretnél a gombok várnak, hiba esetén az elem marad és újrapróbálható */
  onDecide: (item: T, decision: ReviewDecision) => void | Promise<void>;
  /** Visszavonás (az utolsó döntés) – ha nincs, nincs visszavonás gomb */
  onUndo?: (item: T, decision: ReviewDecision) => void | Promise<void>;
  /** Gyakori elutasítási okok */
  reasons?: ReadonlyArray<string>;
  label?: string;
  className?: string;
};

const NAME = { approve: 'Jóváhagyva', reject: 'Elutasítva', skip: 'Kihagyva' } as const;
const TONE = { approve: 'is-success', reject: 'is-danger', skip: 'is-muted' } as const;
const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * ReviewQueue (organizmus, Javaslat 06a/12): egy elem nagyban, jóváhagy (J) / elutasít indokkal (E) / kihagy (K),
 * haladás „12/40”, visszavonás. A billentyűk akkor élnek, ha a fókusz a sorban van (vagy sehol, és ez az első sor),
 * nem mezőbe gépelsz, és nincs nyitott ablak.
 */
export function ReviewQueue<T>({ items, getId, getTitle, render, onDecide, onUndo, reasons, label = 'Ellenőrzési sor', className }: ReviewQueueProps<T>) {
  const [at, setAt] = useState(0);
  const [log, setLog] = useState<Array<{ index: number; d: ReviewDecision }>>([]);
  const [rejecting, setRejecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>();
  const [say, setSay] = useState('');
  const head = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLElement>(null);
  const rejectBtn = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const item = items[at];
  const total = items.length;

  const decide = async (d: ReviewDecision) => {
    if (busy || !item) return;
    setErr(undefined);
    try {
      const r = onDecide(item, d);
      if (r instanceof Promise) { setBusy(true); await r; }
      setBusy(false); setRejecting(false);
      setLog((l) => [...l, { index: at, d }]);
      const next = items[at + 1];
      setSay(`${NAME[d.type]}: ${getTitle(item)}. ${next ? `Következő: ${getTitle(next)} (${at + 2}/${total}).` : 'A sor végére értél.'}`);
      setAt(at + 1); focusHead.current = true;
    } catch (e) {
      setBusy(false);
      setErr(`Nem sikerült menteni a döntést${e instanceof Error && e.message ? `: ${e.message}` : ''}. Próbáld újra.`);
    }
  };
  const undo = async () => {
    const last = log[log.length - 1];
    if (!last || busy || !onUndo) return;
    try {
      const r = onUndo(items[last.index], last.d);
      if (r instanceof Promise) { setBusy(true); await r; }
      setBusy(false); setLog(log.slice(0, -1)); setAt(last.index); setRejecting(false);
      setSay(`Visszavonva: ${getTitle(items[last.index])}.`); focusHead.current = true;
    } catch { setBusy(false); setErr('Nem sikerült visszavonni. Próbáld újra.'); }
  };

  // Döntés után a fókusz a következő elem címére ugrik (a képernyőolvasó onnan olvas tovább)
  const focusHead = useRef(false);
  useEffect(() => { if (focusHead.current) { focusHead.current = false; head.current?.focus(); } });
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || typing(e.target) || rejecting || busy || !item || document.querySelector('dialog[open]')) return;
      // Csak ennek a sornak szól, ha benne van a fókusz – vagy ha sehol sincs, és ez az oldal első sora
      const a = document.activeElement, r = root.current;
      if (!r || !(r.contains(a) || ((!a || a === document.body) && document.querySelector('.bc-review') === r))) return;
      const k = e.key.toLowerCase();
      if (k === 'j') { e.preventDefault(); void decide({ type: 'approve' }); }
      else if (k === 'e') { e.preventDefault(); setRejecting(true); }
      else if (k === 'k') { e.preventDefault(); void decide({ type: 'skip' }); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  });

  const count = (t: ReviewDecision['type']) => log.filter((x) => x.d.type === t).length;
  const last = log[log.length - 1];

  return (
    <section ref={root} className={cx('bc-review', className)} aria-label={label}>
      <div className="bc-review-top">
        <span className="bc-num bc-review-pos" aria-label={`${Math.min(at + 1, total)}. tétel, összesen ${total}`}>{Math.min(at + 1, total)}/{total}</span>
        <ProgressBar value={total ? at / total : 1} label="Haladás a sorban" />
        <span className="bc-review-tally">{count('approve')} jóváhagyva · {count('reject')} elutasítva · {count('skip')} kihagyva</span>
      </div>
      <p className="bc-sr" role="status">{say}</p>

      {last && (
        <div className="bc-review-last" key={log.length}>
          <span className={cx('bc-badge bc-anim-stamp', TONE[last.d.type])}>{NAME[last.d.type]}</span>
          <span className="bc-review-last-title">{getTitle(items[last.index])}{last.d.reason ? ` – ${last.d.reason}` : ''}</span>
          {onUndo && <Button variant="ghost" size="sm" icon={<UndoIcon />} disabled={busy} onClick={() => void undo()}>Visszavonás</Button>}
        </div>
      )}

      {item ? (
        <article className="bc-card bc-review-item" aria-labelledby={titleId} key={getId(item)}>
          <h2 id={titleId} ref={head} tabIndex={-1} className="bc-review-title">{getTitle(item)}</h2>
          {render(item)}
        </article>
      ) : total === 0 ? (
        <BeeMoment pillanat="ures" sima="Nincs ellenőrizendő tétel ebben a sorban." />
      ) : (
        <BeeMoment pillanat="merfoldko" valtozat={0} live="status"
          sima={`Minden tételt átnéztél: ${count('approve')} jóváhagyva, ${count('reject')} elutasítva, ${count('skip')} kihagyva.`} />
      )}

      {err && <div className="bc-alert is-danger" role="alert"><p>{err}</p></div>}

      {item && (
        <div className="bc-review-bar">
          {rejecting
            ? <ReviewReject reasons={reasons} busy={busy} onSubmit={(reason) => void decide({ type: 'reject', reason })}
                onCancel={() => { setRejecting(false); requestAnimationFrame(() => rejectBtn.current?.focus()); }} />
            : (
              <div className="bc-row bc-review-actions">
                <Button busy={busy} onClick={() => void decide({ type: 'approve' })} aria-keyshortcuts="J">Jóváhagyás <kbd className="bc-kbd">J</kbd></Button>
                <Button ref={rejectBtn} variant="danger" disabled={busy} onClick={() => setRejecting(true)} aria-keyshortcuts="E">Elutasítás <kbd className="bc-kbd">E</kbd></Button>
                <Button variant="secondary" disabled={busy} onClick={() => void decide({ type: 'skip' })} aria-keyshortcuts="K">Kihagyás <kbd className="bc-kbd">K</kbd></Button>
              </div>
            )}
        </div>
      )}
    </section>
  );
}
