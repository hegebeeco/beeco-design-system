import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, type ReactNode } from 'react';
import { IconButton } from '../inputs/Button';
import { cx } from '../cx';
import { firstTabbable, useReturnFocus } from './focus';
import { keepToasts } from './layer';
import { CloseIcon } from './Modal';

export type StageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A színpad címe (h2 – a képernyőolvasó ezzel mutatja be) */
  title: ReactNode;
  /**
   * Bezárható-e most. Ha false (pl. sorsolás, animáció közben): az Esc és a ✕ nem zár, a ✕ tiltott.
   * A felhasználó nem akadhat bent: a projekt a folyamat végén állítsa vissza true-ra.
   */
  closable?: boolean;
  /** Élő bejelentés a képernyőolvasónak (role=status, udvarias): pl. „Sorsolás folyamatban…”, majd „1. nyertes: …” */
  announce?: string;
  /** Teljes képernyő (Fullscreen API) nyitáskor – ha a böngésző engedi; bezáráskor csak a saját kérését engedi el */
  fullscreen?: boolean;
  closeLabel?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * StageDialog (organizmus, Javaslat 13/3): teljes képernyős bemutató-réteg (pl. sorsolás kivetítőn, eredményhirdetés).
 * Radix Dialog: fókuszcsapda, Esc, a háttér nem görög, a fókusz visszatér a nyitó elemre. A ✕ jobb felül, 44 px.
 * Folyamat közben a `closable={false}` zárja le; az `announce` élő régióban mondja a képernyőolvasónak, mi történik.
 * Mozgás a projekté – csökkentett mozgásnál a színpad maga nem animál.
 */
export function StageDialog({ open, onOpenChange, title, closable = true, announce = '', fullscreen = false, closeLabel = 'Bezárás', className, children }: StageDialogProps) {
  const focus = useReturnFocus();
  const close = useRef<HTMLButtonElement>(null);
  const sajat = useRef(false);
  const tartalom = useRef<HTMLDivElement>(null);

  // Ha a fókuszban lévő gomb a folyamat közben eltűnik vagy tiltott lesz, a fókusz a színpadon marad (nem esik a <body>-ra)
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const a = document.activeElement as HTMLElement | null;
      if (tartalom.current && (!a || a === document.body || !tartalom.current.contains(a) || (a as HTMLButtonElement).disabled)) tartalom.current.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, closable, announce]);

  // Teljes képernyő: csak a saját kérésünket engedjük el (ha a felhasználó már kilépett, nem lépünk ki helyette)
  useEffect(() => {
    if (!open || !fullscreen) return;
    const el = document.documentElement;
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      el.requestFullscreen?.().then(() => { sajat.current = true; }).catch(() => { /* teljes képernyő nélkül is megy */ });
    }
    return () => {
      if (sajat.current && document.fullscreenElement === el) void document.exitFullscreen?.().catch(() => undefined);
      sajat.current = false;
    };
  }, [open, fullscreen]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (o || closable) onOpenChange(o); }}>
      <Dialog.Portal>
        <Dialog.Content ref={tartalom} tabIndex={-1} className={cx('bc-stage', className)} aria-describedby={undefined}
          onOpenAutoFocus={(e) => { focus.remember(); e.preventDefault(); (close.current && !close.current.disabled ? close.current : firstTabbable(e.currentTarget as HTMLElement))?.focus(); }}
          onCloseAutoFocus={focus.restore}
          onEscapeKeyDown={(e) => { if (!closable) e.preventDefault(); }}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={keepToasts}>
          <IconButton ref={close} className="bc-stage-close" aria-label={closeLabel} disabled={!closable} onClick={() => { if (closable) onOpenChange(false); }}>
            <CloseIcon />
          </IconButton>
          <div className="bc-stage-body">
            <Dialog.Title asChild><h2 className="bc-stage-title">{title}</h2></Dialog.Title>
            {children}
          </div>
          <p className="bc-sr" role="status" aria-live="polite">{announce}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
