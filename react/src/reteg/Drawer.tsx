import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type ReactNode } from 'react';
import { IconButton } from '../inputs/Button';
import { cx } from '../cx';
import { keepToasts } from './layer';
import { firstTabbable, useReturnFocus } from './focus';
import { LayerCloseContext, useCloseGuard } from './guard';
import { CloseIcon } from './Modal';

export type DrawerProps = {
  /** Vezérelt: a nyitott állapot jöhet az URL-ből is (useQueryParam('reszlet')) – így a Vissza gomb bezárja */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** md 480 px (alap) · wide 640 px; 600 px alatt teljes képernyős lap */
  size?: 'md' | 'wide';
  /** Alsó gombsor, pl. „Teljes oldal” link + Mentés */
  footer?: ReactNode;
  busy?: boolean;
  /** El nem mentett változás: bezárás (Esc, ✕, kívül kattintás, Mégse) előtt megkérdezi */
  dirty?: boolean;
  initialFocus?: () => HTMLElement | null;
  closeLabel?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Drawer / oldalpanel (organizmus, Javaslat 03 – 3A): egy elem részletei és rövid szerkesztése a lista mellett.
 * Jobbról csúszik be (400 ms ease-drawer, csökkentett mozgásnál azonnal), a lista a helyén marad.
 * Hosszú űrlap → külön oldal (a panel alján „Teljes oldal”). Radix Dialog: fókuszcsapda, Esc, portál, görgetés-zár.
 */
export function Drawer({ open, onOpenChange, title, description, size = 'md', footer, busy, dirty, initialFocus, closeLabel = 'Panel bezárása', className, children }: DrawerProps) {
  const guard = useCloseGuard({ onOpenChange, dirty, busy });
  const focus = useReturnFocus();
  const head = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={guard.change}>
      <Dialog.Portal>
        <Dialog.Overlay className="bc-scrim is-drawer" />
        <Dialog.Content className={cx('bc-drawer', size === 'wide' && 'is-wide', className)}
          {...(description ? {} : { 'aria-describedby': undefined })}
          onOpenAutoFocus={(e) => {
            focus.remember();
            // A panel olvasásra nyílik: alapból a ✕ kapja a fókuszt (nem ugrik a billentyűzet egy mezőbe telefonon)
            const target = initialFocus?.() ?? firstTabbable(head.current);
            if (target) { e.preventDefault(); target.focus(); }
          }}
          onCloseAutoFocus={focus.restore}
          onInteractOutside={keepToasts}>
          <LayerCloseContext.Provider value={guard.requestClose}>
            <div className="bc-drawer-head" ref={head}>
              <div className="bc-layer-titles">
                <Dialog.Title asChild><h2>{title}</h2></Dialog.Title>
                {description && <Dialog.Description className="bc-layer-desc">{description}</Dialog.Description>}
              </div>
              <IconButton aria-label={closeLabel} disabled={busy} onClick={guard.requestClose}><CloseIcon /></IconButton>
            </div>
            <div className="bc-drawer-body">{children}</div>
            {footer && <div className="bc-drawer-foot">{footer}</div>}
            {guard.discardDialog}
          </LayerCloseContext.Provider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
