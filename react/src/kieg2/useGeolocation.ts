import { useCallback, useEffect, useRef, useState } from 'react';
import { formatHu } from '../inputs/number';
import type { LatLng } from './geo';

/** A „Jelenlegi helyem” állapotai: alap · keres · megvan · nem engedted · nem elérhető · túl lassú */
export type GeoState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'found'; at: LatLng; accuracy: number }
  | { status: 'denied' | 'unavailable' | 'timeout'; message: string };

/** A hibaüzenetek mindig megmondják a következő lépést (docs/komponensek.md 3.3) */
const MSG = {
  denied: 'Nem engedted a helymeghatározást. A böngésző címsorában (lakat ikon) engedélyezheted, vagy keresd meg a címet.',
  unavailable: 'Most nem találom a helyed (nincs GPS vagy hálózat). Próbáld újra, vagy add meg a címet.',
  unsupported: 'Ez a böngésző nem tud helyet meghatározni. Keresd meg a címet, vagy írd be a koordinátákat.',
  timeout: 'Túl sokáig tartott a helymeghatározás. Próbáld újra szabad ég alatt, vagy add meg a címet.',
} as const;

/** Pontosság szövegesen: „±35 m”, „±1,2 km” */
export const accuracyText = (m: number) => (m < 1000 ? `±${formatHu(Math.round(m), 0)} m` : `±${formatHu(m / 1000, 1)} km`);

/**
 * A böngésző helymeghatározása egy gombnyomásra (soha nem magától – engedélyt csak kérésre kérünk).
 * timeoutMs után „timeout” állapot; a komponens eltűnésekor a késői válasz nem ír állapotot.
 */
export function useGeolocation(timeoutMs = 10_000) {
  const [state, setState] = useState<GeoState>({ status: 'idle' });
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const locate = useCallback((onFound?: (p: LatLng) => void) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { setState({ status: 'unavailable', message: MSG.unsupported }); return; }
    setState({ status: 'locating' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!alive.current) return;
        const at = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setState({ status: 'found', at, accuracy: pos.coords.accuracy });
        onFound?.(at);
      },
      (err) => {
        if (!alive.current) return;
        if (err.code === err.PERMISSION_DENIED) setState({ status: 'denied', message: MSG.denied });
        else if (err.code === err.TIMEOUT) setState({ status: 'timeout', message: MSG.timeout });
        else setState({ status: 'unavailable', message: MSG.unavailable });
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  }, [timeoutMs]);

  const reset = useCallback(() => setState({ status: 'idle' }), []);
  return { state, locate, reset };
}
