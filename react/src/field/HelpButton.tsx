import * as Popover from '@radix-ui/react-popover';
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { IcInfo } from '../inputs/ikonok';

export type HelpButtonProps = {
  /** Mire vonatkozik (a képernyőolvasó ezt mondja: „Súgó: <label>”) */
  label: string;
  /** Mit és miért kell megadni – rövid, tegeződő szöveg, ha lehet példával */
  children: ReactNode;
  /** A gomb teljes neve a képernyőolvasónak (kétnyelvű appban i18n-ből). Alap: „Súgó: <label>” */
  srLabel?: string;
};

const NYIT_MS = 250; // rámutatás után ennyi idővel nyílik (átsuhanó egérre ne villogjon)
const ZAR_MS = 200; // a gombról a buborékra át lehessen vinni az egeret

/**
 * Súgó gomb (ⓘ) – Kristóf, 2026-10-01: háttér és körvonal nélküli piktogram.
 * Egérrel rámutatásra nyílik (a buborékon tartva nyitva marad), kattintásra/koppintásra és billentyűvel (Enter/Szóköz) is –
 * kattintás után rögzítve marad, amíg Esc, kívül kattintás vagy újabb kattintás nem zárja. A fókusz visszakerül a gombra (Radix Popover).
 */
export function HelpButton({ label, children, srLabel }: HelpButtonProps) {
  const [open, setOpen] = useState(false);
  const [rogzitett, setRogzitett] = useState(false);
  const idozito = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(idozito.current), []);
  const eger = (e: PointerEvent) => e.pointerType === 'mouse';
  const be = (e: PointerEvent) => { if (!eger(e)) return; window.clearTimeout(idozito.current); idozito.current = window.setTimeout(() => setOpen(true), open ? 0 : NYIT_MS); };
  const ki = (e: PointerEvent) => { if (!eger(e) || rogzitett) return; window.clearTimeout(idozito.current); idozito.current = window.setTimeout(() => setOpen(false), ZAR_MS); };
  const kattint = (e: MouseEvent) => {
    window.clearTimeout(idozito.current);
    // Rámutatásra már nyitva: a kattintás nem zárja be, hanem rögzíti
    if (open && !rogzitett) { e.preventDefault(); setRogzitett(true); return; }
    setRogzitett(!open);
  };

  return (
    <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setRogzitett(false); }}>
      <Popover.Trigger className="bc-help-btn" aria-label={srLabel ?? `Súgó: ${label}`} type="button" onPointerEnter={be} onPointerLeave={ki} onClick={kattint}>
        <IcInfo />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bc-pop" side="top" align="start" sideOffset={6} collisionPadding={16} onPointerEnter={be} onPointerLeave={ki}
          onOpenAutoFocus={(e) => { if (!rogzitett) e.preventDefault(); /* rámutatásra ne vegye el a fókuszt */ }}>
          <strong className="bc-pop-title">{label}</strong>
          {typeof children === 'string' ? <p>{children}</p> : children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
