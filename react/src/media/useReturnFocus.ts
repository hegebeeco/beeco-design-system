import { useLayoutEffect, useRef } from 'react';

/**
 * Trigger nélkül nyitott Radix Dialognál a Radix a (nem létező) triggerre adná vissza a fókuszt – elveszne.
 * Ez megjegyzi, mi volt fókuszban nyitáskor, és záráskor oda viszi vissza (ha az elem közben eltűnt: a tartalék elemre).
 */
export function useReturnFocus(open: boolean, fallback?: () => Element | null | undefined) {
  const prev = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => { if (open) prev.current = document.activeElement as HTMLElement | null; }, [open]);
  return (e: Event) => {
    e.preventDefault();
    const el = prev.current?.isConnected && !prev.current.closest('[role=menu]') ? prev.current : fallback?.();
    (el as HTMLElement | null | undefined)?.focus();
  };
}
