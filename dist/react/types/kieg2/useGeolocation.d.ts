import type { LatLng } from './geo';
/** A „Jelenlegi helyem” állapotai: alap · keres · megvan · nem engedted · nem elérhető · túl lassú */
export type GeoState = {
    status: 'idle';
} | {
    status: 'locating';
} | {
    status: 'found';
    at: LatLng;
    accuracy: number;
} | {
    status: 'denied' | 'unavailable' | 'timeout';
    message: string;
};
/** Pontosság szövegesen: „±35 m”, „±1,2 km” */
export declare const accuracyText: (m: number) => string;
/**
 * A böngésző helymeghatározása egy gombnyomásra (soha nem magától – engedélyt csak kérésre kérünk).
 * timeoutMs után „timeout” állapot; a komponens eltűnésekor a késői válasz nem ír állapotot.
 */
export declare function useGeolocation(timeoutMs?: number): {
    state: GeoState;
    locate: (onFound?: (p: LatLng) => void) => void;
    reset: () => void;
};
