import { useCallback, useSyncExternalStore } from 'react';

// A saját history-lépéseinkről is szólunk a feliratkozóknak (a pushState nem vált ki popstate-et)
const EVT = 'bc-query-change';
const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb);
  window.addEventListener(EVT, cb);
  return () => { window.removeEventListener('popstate', cb); window.removeEventListener(EVT, cb); };
};

/**
 * Egy URL-paraméter állapotként (router nélkül is), pl. az oldalpanel saját URL-je: ?reszlet=123.
 * Beállítás → új history-bejegyzés (a böngésző Vissza gombja bezárja a panelt); null → visszalép / törli.
 * React Routerrel inkább a useSearchParams-t használd – az API ugyanilyen alakú.
 */
export function useQueryParam(name: string): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get(name), () => null);
  const set = useCallback((next: string | null) => {
    const url = new URL(window.location.href);
    if (next === null) url.searchParams.delete(name); else url.searchParams.set(name, next);
    if (url.href === window.location.href) return;
    const st = window.history.state as { bcQ?: string } | null;
    // Bezáráskor: ha mi nyitottuk (a mi bejegyzésünk), visszalépünk – így a Vissza gomb nem nyitja újra
    if (next === null && st?.bcQ === name) { window.history.back(); return; }
    if (next === null) window.history.replaceState(st, '', url);
    else window.history.pushState({ ...(st ?? {}), bcQ: name }, '', url);
    window.dispatchEvent(new Event(EVT));
  }, [name]);
  return [value, set];
}
