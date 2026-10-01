import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState, type ReactNode } from 'react';
import { Button } from '../inputs/Button';
import { IcOk, IcTrash } from '../inputs/ikonok';
import { cx } from '../cx';
import { keepToasts } from './layer';
import { useReturnFocus } from './focus';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Kérdés, a tárggyal: „Törlöd a kupon-sablont?” */
  title: string;
  /** A következmény: mi történik még (mi törlődik vele, kiket érint). */
  children?: ReactNode;
  /** A gomb felirata az ige („Törlés”, „Közzététel”) – soha nem „Igen/OK”. */
  confirmLabel: string;
  /** A megerősítő gomb piktogramja – alap: veszélyesnél törlés, egyébként pipa */
  confirmIcon?: ReactNode;
  cancelLabel?: string;
  /** Veszélyes (visszafordíthatatlan) művelet: piros gomb */
  danger?: boolean;
  /**
   * A művelet. Ha ígéretet ad vissza: közben a gomb pörög, a Mégse és az Esc nem zár;
   * siker → bezár; hiba → az ablakban marad, és kiírja a hibát (újrapróbálható).
   */
  onConfirm: () => void | Promise<void>;
  /** Pl. TypeToConfirm: amíg nem egyezik, a gomb tiltott */
  confirmDisabled?: boolean;
  /** Hibaszöveg a dobott hibából (alap: az Error üzenete + „Próbáld újra.”) */
  errorText?: (error: unknown) => string;
  /** Hova kerüljön a fókusz nyitáskor (alap: a Mégse gombra – véletlen Enter nem töröl) */
  initialFocus?: 'cancel' | (() => HTMLElement | null);
  /** Kiegészítő tartalom a következmény alatt (pl. begépelős mező) */
  extra?: ReactNode;
  /** sm 420 px (alap) · md 560 px (pl. hosszú gombfelirat, begépelős mező) */
  size?: 'sm' | 'md';
  className?: string;
};

const defaultError = (e: unknown) => `Nem sikerült${e instanceof Error && e.message ? `: ${e.message}` : ''}. Próbáld újra.`;

/**
 * ConfirmDialog (organizmus, Javaslat 03 – 1A): megerősítés csak visszafordíthatatlan vagy másokat érintő műveletnél.
 * Minta: WAI-ARIA alertdialog – kívül kattintás nem zár, Esc igen (ha nem folyamatban), a fókusz a Mégse gombon indul.
 */
export function ConfirmDialog({
  open, onOpenChange, title, children, confirmLabel, confirmIcon, cancelLabel = 'Mégse', danger, onConfirm,
  confirmDisabled, errorText = defaultError, initialFocus = 'cancel', extra, size = 'sm', className,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const focus = useReturnFocus();

  const change = (next: boolean) => {
    if (busy && !next) return;
    if (!next) setError(null);
    onOpenChange(next);
  };
  const run = async () => {
    if (busy || confirmDisabled) return; // dupla kattintás ellen
    setError(null);
    try {
      const r = onConfirm();
      if (r instanceof Promise) { setBusy(true); await r; }
      setBusy(false);
      onOpenChange(false);
    } catch (e) {
      setBusy(false);
      setError(errorText(e));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={change}>
      <Dialog.Portal>
        <Dialog.Overlay className="bc-scrim">
          <Dialog.Content role="alertdialog" {...(children ? {} : { 'aria-describedby': undefined })}
            className={cx('bc-modal is-layer', size === 'sm' && 'is-sm', className)}
            onOpenAutoFocus={(e) => {
              focus.remember();
              e.preventDefault();
              const target = initialFocus === 'cancel' ? cancelRef.current : initialFocus();
              (target ?? cancelRef.current)?.focus();
            }}
            onCloseAutoFocus={focus.restore}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={keepToasts}
            onEscapeKeyDown={(e) => { if (busy) e.preventDefault(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.target instanceof HTMLInputElement) { e.preventDefault(); void run(); } }}>
            <div className="bc-modal-head">
              <Dialog.Title asChild><h2>{title}</h2></Dialog.Title>
            </div>
            <div className="bc-modal-body">
              {children && <Dialog.Description asChild>{typeof children === 'string' ? <p>{children}</p> : <div>{children}</div>}</Dialog.Description>}
              {extra}
              {error && <div className="bc-alert is-danger" role="alert"><p>{error}</p></div>}
            </div>
            <div className="bc-modal-foot">
              <Button ref={cancelRef} variant="secondary" disabled={busy} onClick={() => change(false)}>{cancelLabel}</Button>
              <Button variant={danger ? 'danger' : 'primary'} busy={busy} disabled={confirmDisabled} icon={confirmIcon ?? (danger ? <IcTrash /> : <IcOk />)} onClick={() => void run()}>{confirmLabel}</Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
