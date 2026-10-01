import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type ReactNode } from 'react';
import { Button, IconButton } from '../inputs/Button';
import { cx } from '../cx';
import { keepToasts } from './layer';
import { firstField, firstTabbable, useReturnFocus } from './focus';
import { LayerCloseContext, useCloseGuard, useLayerClose } from './guard';

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Az ablak címe (kötelező – a képernyőolvasó ezzel mutatja be) */
  title: ReactNode;
  /** Rövid leírás a cím alatt (a képernyőolvasó is felolvassa) */
  description?: ReactNode;
  /** sm 420 px · md 560 px (alap) · wide 880 px; telefonon teljes szélesség */
  size?: 'sm' | 'md' | 'wide';
  /** A gombsor (jobbra igazítva). A „Mégse”: <ModalCancel /> – ugyanazon az őrön megy át, mint az Esc. */
  footer?: ReactNode;
  /** Folyamatban (pl. mentés): Esc, ✕ és kívül kattintás nem zár */
  busy?: boolean;
  /** El nem mentett változás: bezárás előtt megkérdezi, elveted-e */
  dirty?: boolean;
  /** Nyitáskor ide kerül a fókusz (alap: a törzs első mezője/gombja, ha nincs: a ✕) */
  initialFocus?: () => HTMLElement | null;
  closeLabel?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Modal (organizmus, Javaslat 03 – 1): felugró ablak fejjel, görgethető törzzsel és álló gombsorral.
 * Radix Dialog: portál, fókuszcsapda, Esc, a háttér nem görög, a fókusz visszatér a nyitó elemre.
 * Mikor ablak? Egy kérdés, egy döntés, rövid űrlap. Elem megnézése a lista mellett → Drawer; hosszú űrlap → külön oldal.
 */
export function Modal({ open, onOpenChange, title, description, size = 'md', footer, busy, dirty, initialFocus, closeLabel = 'Bezárás', className, children }: ModalProps) {
  const guard = useCloseGuard({ onOpenChange, dirty, busy });
  const body = useRef<HTMLDivElement>(null);
  const focus = useReturnFocus();
  return (
    <Dialog.Root open={open} onOpenChange={guard.change}>
      <Dialog.Portal>
        <Dialog.Overlay className="bc-scrim">
          <Dialog.Content className={cx('bc-modal is-layer', size !== 'md' && `is-${size}`, className)}
            {...(description ? {} : { 'aria-describedby': undefined })}
            onOpenAutoFocus={(e) => {
              focus.remember();
              const target = initialFocus?.() ?? firstField(body.current) ?? firstTabbable(body.current?.nextElementSibling);
              if (target) { e.preventDefault(); target.focus(); }
            }}
            onCloseAutoFocus={focus.restore}
            onInteractOutside={keepToasts}>
            <LayerCloseContext.Provider value={guard.requestClose}>
              <div className="bc-modal-head">
                <div className="bc-layer-titles">
                  <Dialog.Title asChild><h2>{title}</h2></Dialog.Title>
                  {description && <Dialog.Description className="bc-layer-desc">{description}</Dialog.Description>}
                </div>
                <IconButton aria-label={closeLabel} disabled={busy} onClick={guard.requestClose}><CloseIcon /></IconButton>
              </div>
              <div className="bc-modal-body" ref={body}>{children}</div>
              {footer && <div className="bc-modal-foot">{footer}</div>}
              {guard.discardDialog}
            </LayerCloseContext.Provider>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** „Mégse” gomb ablakba és oldalpanelbe: a bezárás-őrön át zár (folyamatban tiltott, mentetlennél kérdez). */
export function ModalCancel({ children = 'Mégse', disabled }: { children?: ReactNode; disabled?: boolean }) {
  const close = useLayerClose();
  return <Button variant="secondary" disabled={disabled} onClick={close}>{children}</Button>;
}

export function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
