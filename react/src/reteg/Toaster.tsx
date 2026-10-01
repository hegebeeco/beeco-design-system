import { useState, useSyncExternalStore, type FocusEvent } from 'react';
import { cx } from '../cx';
import { dismiss, getToasts, pauseToasts, subscribe, type Toast, type ToastKind } from './notify';

const MAX_VISIBLE = 3;
const LONG = 140; // ennél hosszabb szöveg 3 sor után levágva, „Részletek”
const CLASS: Record<ToastKind, string> = { success: 'is-success', error: 'is-danger', info: 'is-info', warning: 'is-warning' };
// A jelentés nem csak színnel: ikon + képernyőolvasónak szó
const WORD: Record<ToastKind, string> = { success: 'Kész', error: 'Hiba', info: 'Tájékoztatás', warning: 'Figyelem' };
const ICON: Record<ToastKind, string> = {
  success: 'M5 12.5l4.5 4.5L19 7.5',
  error: 'M12 7v6M12 16.5v.5',
  info: 'M12 11v6M12 7.5v.5',
  warning: 'M12 8v5M12 16.5v.5',
};

export type ToasterProps = {
  /** A régió neve a képernyőolvasónak */
  label?: string;
};

/**
 * Toaster (molekula, Javaslat 03 – 8A): egyszer az alkalmazás gyökerében. Hívás: notify.success('Kupon mentve.', { action }).
 * Asztalon jobb fent, telefonon (≤ 600 px) lent középen. Siker/info/figyelmeztetés 5 mp, hiba marad (bezárás gombbal).
 * Rámutatásra és fókuszra megáll. Képernyőolvasó: hiba role="alert" (assertive), a többi role="status" (polite).
 * Mezőhiba (pl. túl nagy kép) NEM ide való – a mező alá.
 */
export function Toaster({ label = 'Értesítések' }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, getToasts, getToasts);
  // Legfeljebb 3 látszik: előbb a hibák (azok nem tűnnek el maguktól), a maradék helyen a legújabbak
  const live = list.filter((t) => !t.leaving);
  const errs = live.filter((t) => t.kind === 'error').slice(-MAX_VISIBLE);
  const rest = live.filter((t) => t.kind !== 'error').slice(-(MAX_VISIBLE - errs.length) || live.length);
  const shown = new Set([...errs, ...(errs.length < MAX_VISIBLE ? rest : [])]);
  const visible = list.filter((t) => t.leaving || shown.has(t));
  const hidden = live.length - shown.size;
  const blur = (e: FocusEvent<HTMLElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pauseToasts(false); };
  return (
    <section className="bc-toaster" aria-label={label}
      onMouseEnter={() => pauseToasts(true)} onMouseLeave={() => pauseToasts(false)} onFocus={() => pauseToasts(true)} onBlur={blur}>
      {/* Az élő régiók mindig a DOM-ban vannak (különben a képernyőolvasó nem veszi észre az első üzenetet) */}
      <div className="bc-toast-list" role="alert" aria-live="assertive">
        {visible.filter((t) => t.kind === 'error').map((t) => <ToastView key={t.id} t={t} />)}
      </div>
      <div className="bc-toast-list" role="status" aria-live="polite">
        {visible.filter((t) => t.kind !== 'error').map((t) => <ToastView key={t.id} t={t} />)}
      </div>
      {hidden > 0 && (
        <div className="bc-toast-more">
          <span>+{hidden} további értesítés</span>
          <button type="button" className="bc-toast-link" onClick={() => dismiss()}>Mind bezárása</button>
        </div>
      )}
    </section>
  );
}

function ToastView({ t }: { t: Toast }) {
  const [open, setOpen] = useState(false);
  const long = t.message.length > LONG;
  return (
    <div className={cx('bc-toast', CLASS[t.kind])} data-leaving={t.leaving || undefined}>
      <svg className="bc-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" strokeWidth="2" /><path d={ICON[t.kind]} />
      </svg>
      <div className="bc-toast-body">
        <p className={cx(long && !open && 'is-clamped')}>
          <span className="bc-sr">{WORD[t.kind]}: </span>{t.message}
          {t.count > 1 && <span className="bc-toast-count" aria-label={`${t.count}-szor`}> ×{t.count}</span>}
        </p>
        {(long || t.action) && (
          <div className="bc-toast-actions">
            {t.action && (
              <button type="button" className="bc-toast-action" onClick={() => { t.action?.onClick(); dismiss(t.id); }}>{t.action.label}</button>
            )}
            {long && <button type="button" className="bc-toast-link" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Kevesebb' : 'Részletek'}</button>}
          </div>
        )}
      </div>
      <button type="button" className="bc-toast-close" aria-label="Értesítés bezárása" onClick={() => dismiss(t.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
      </button>
    </div>
  );
}
