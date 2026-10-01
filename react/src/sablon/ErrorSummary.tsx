import { forwardRef, useEffect, useId, useRef, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';

/** Egy mezőhiba: a mező name-je (ezzel találjuk meg), a címkéje (a listában) és a hiba a következő lépéssel. */
export type FormError = { name: string; message: string; label?: string };

type Props = { errors: FormError[]; general?: string; form: RefObject<HTMLFormElement | null> };

/** A mező megkeresése name (vagy id) alapján az űrlapban. */
export function findField(form: HTMLFormElement | null, name: string): HTMLElement | null {
  if (!form) return null;
  const byName = form.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]`);
  return byName ?? form.querySelector<HTMLElement>(`#${CSS.escape(name)}`);
}

/**
 * Hibaösszesítő (GOV.UK-minta): sikertelen beküldéskor az űrlap tetején, ide kerül a fókusz.
 * Minden hiba link: a mezőre ugrik és oda teszi a fókuszt (görgetés középre – a ragadós fejléc nem takarja).
 */
export const ErrorSummary = forwardRef<HTMLDivElement, Props>(function ErrorSummary({ errors, general, form }, ref) {
  const id = useId();
  const n = errors.length;
  const jump = (e: ReactMouseEvent, name: string) => {
    const el = findField(form.current, name);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ block: 'center' });
    el.focus({ preventScroll: true });
  };
  return (
    <div ref={ref} className="bc-alert is-danger bc-sablon-summary" tabIndex={-1} aria-labelledby={`${id}-t`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 7v6M12 16.5v.5" /></svg>
      <div>
        <h2 id={`${id}-t`} className="bc-sablon-summary-title">
          {n ? `Nem mentettem – ${n === 1 ? 'egy mezőt' : `${n} mezőt`} javíts ki:` : 'Nem sikerült menteni.'}
        </h2>
        {general && <p>{general}</p>}
        {n > 0 && (
          <ul className="bc-sablon-summary-list">
            {errors.map((er) => (
              <li key={er.name}><a href={`#${er.name}`} onClick={(e) => jump(e, er.name)}>{er.label ? `${er.label}: ` : ''}{er.message}</a></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

/**
 * Linkre kattintás elkapása, amíg van mentetlen változás (a kieg UnsavedChangesGuard mintája, de a hívó saját confirm-jével –
 * így a „Mégse” gomb és a linkek ugyanazt az egy őrt használják, és elvetés után a böngésző sem kérdez rá még egyszer).
 */
export function useLinkGuard(dirty: boolean, confirm: (proceed: () => void) => void) {
  const bypass = useRef(false);
  useEffect(() => {
    if (!dirty) return;
    const h = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement) || a.closest('dialog, [role=dialog], [role=alertdialog], [data-unsaved-ignore]')) return;
      const href = a.getAttribute('href') ?? '';
      if ((a.target && a.target !== '_self') || a.hasAttribute('download') || href.startsWith('#') || href.startsWith('javascript:')) return;
      e.preventDefault(); e.stopPropagation();
      confirm(() => { bypass.current = true; a.click(); bypass.current = false; });
    };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, [dirty, confirm]);
}
