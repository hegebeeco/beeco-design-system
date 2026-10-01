import { useSyncExternalStore } from 'react';

/**
 * Közös réteg-segédek.
 * - A modális réteg (ablak, fiók) a „kívül kattintást” bezárásnak veszi. Az értesítés (Toaster) viszont
 *   a réteg fölött él, és a „Visszavonás” gombja nem zárhatja be az ablakot – ezért onnan jövő kattintást átengedünk.
 */
type OutsideEvent = { target: EventTarget | null; preventDefault: () => void };
export function keepToasts(e: OutsideEvent) {
  if (e.target instanceof Element && e.target.closest('.bc-toaster')) e.preventDefault();
}

/** Média-lekérdezés figyelése (pl. '(max-width: 900px)') – szerveroldalon és az első rajzoláskor false. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
