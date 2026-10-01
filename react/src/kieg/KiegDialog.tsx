import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../cx';

export type KiegDialogProps = {
  open: boolean;
  /** Esc vagy a biztonságos gomb: marad minden, ahogy volt */
  onCancel: () => void;
  title: string;
  children?: ReactNode;
  /** A gombsor; a biztonságos gombon legyen data-autofocus (oda kerül a fókusz – véletlen Enter nem dob el semmit) */
  actions: ReactNode;
  className?: string;
};

/**
 * Megerősítő ablak natív <dialog>-gal (bc-modal): a böngésző adja a fókuszcsapdát és az Esc-et, a háttér inert.
 * A 06a-csomag belső eleme (a 03-as réteg-csomagtól független). Bezáráskor a fókusz oda tér vissza, ahonnan jött.
 * Kívül kattintás nem zár (alertdialog-minta).
 */
export function KiegDialog({ open, onCancel, title, children, actions, className }: KiegDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const back = useRef<HTMLElement | null>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      back.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
      d.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else if (!open && d.open) {
      d.close();
      back.current?.focus();
    }
  }, [open]);
  // Ha a komponens nyitva tűnik el, a fókusz akkor is visszakerül
  useEffect(() => () => { if (ref.current?.open) back.current?.focus(); }, []);

  return (
    <dialog ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-describedby={children ? `${id}-d` : undefined}
      className={cx('bc-modal bc-kdialog', className)} onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      {open && (
        <>
          <div className="bc-modal-head"><h2 id={`${id}-t`}>{title}</h2></div>
          {children && <div className="bc-modal-body" id={`${id}-d`}>{children}</div>}
          <div className="bc-modal-foot">{actions}</div>
        </>
      )}
    </dialog>
  );
}
