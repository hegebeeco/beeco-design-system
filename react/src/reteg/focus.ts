import { useRef } from 'react';

/** Első billentyűzettel elérhető elem egy konténerben (tiltott és rejtett kimarad). */
const TABBABLE = 'input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
export function firstTabbable(root: Element | null | undefined) {
  return root ? [...root.querySelectorAll<HTMLElement>(TABBABLE)].find((el) => el.offsetParent !== null || el.getClientRects().length > 0) ?? null : null;
}

/** Kezdő fókusz egy ablakban: az első kitölthető mező (nem a súgó ⓘ), ha nincs, az első elérhető elem. */
export function firstField(root: Element | null | undefined) {
  const fields = root ? [...root.querySelectorAll<HTMLElement>('input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled])')] : [];
  return fields.find((el) => el.getClientRects().length > 0) ?? firstTabbable(root);
}

/**
 * Fókusz vissza oda, ahonnan a réteget megnyitották – akkor is, ha a nyitó gomb nem Radix-trigger
 * (vezérelt ablak). Ha menüpontból nyílt (a menü közben bezárult), a menü nyitógombjára tér vissza.
 */
export function useReturnFocus() {
  const opener = useRef<HTMLElement | null>(null);
  return {
    remember() {
      let el = document.activeElement as HTMLElement | null;
      const menu = el?.closest('[role=menu]');
      if (menu?.id) el = document.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`) ?? el;
      if (el && el !== document.body) opener.current = el;
    },
    restore(e: Event) {
      const el = opener.current;
      if (el && el.isConnected) { e.preventDefault(); el.focus(); }
    },
  };
}
