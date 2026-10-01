import { formatHu } from '../inputs/number';

/** Egy pont a térképen (WGS84, fok) */
export type LatLng = { lat: number; lng: number };

/** A címkereső egy találata – a projekt keresője adja (pl. Nominatim, Google, saját API) */
export type AddressHit = { id: string; label: string; lat: number; lng: number };

/** Érvényes tartományok (WGS84) */
export const LAT_RANGE = { min: -90, max: 90 } as const;
export const LNG_RANGE = { min: -180, max: 180 } as const;

/**
 * Magyarország befoglaló téglalapja (kerekítve, kicsit bővebben a határnál).
 * Ezen kívül csak FIGYELMEZTETÜNK (nem hiba): lehet, hogy tényleg külföldi a hely.
 */
export const HU_BOUNDS = { south: 45.7, north: 48.6, west: 16.1, east: 22.9 } as const;
/** Budapest közepe – alapértelmezett térkép-középpont */
export const HU_CENTER: LatLng = { lat: 47.4979, lng: 19.0402 };

/** Pont–szakasz távolság fokban (a határ menti településeknél a vázlatos körvonal pontatlanságát tűri) */
function segDist(px: number, py: number, [ax, ay]: readonly [number, number], [bx, by]: readonly [number, number]) {
  const dx = bx - ax, dy = by - ay, k = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - k * dx, py - ay - k * dy);
}

/**
 * Magyarországon van-e (közelítőleg): a befoglaló téglalapon belül ÉS a vázlatos körvonalon belül vagy ~0,05°-on (≈ 4–5 km) belül.
 * Csak figyelmeztetéshez – Bécs, Pozsony, Szabadka már kívül, Sopron, Záhony még belül (a folyó túlpartja, pl. Komárno, belül maradhat).
 */
export function inHungary(p: LatLng) {
  if (p.lat < HU_BOUNDS.south || p.lat > HU_BOUNDS.north || p.lng < HU_BOUNDS.west || p.lng > HU_BOUNDS.east) return false;
  let inside = false;
  const o = HU_OUTLINE;
  for (let i = 0, j = o.length - 1; i < o.length; j = i++) {
    const [xi, yi] = o[i], [xj, yj] = o[j];
    if ((yi > p.lat) !== (yj > p.lat) && p.lng < ((xj - xi) * (p.lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside || o.some((a, i) => segDist(p.lng, p.lat, a, o[(i + 1) % o.length]) < 0.05);
}

/** Gyakori hiba: felcserélt szélesség és hosszúság (pl. 19,04 · 47,49) – ilyenkor a csere Magyarországra esik */
export const looksSwapped = (p: LatLng) => !inHungary(p) && inHungary({ lat: p.lng, lng: p.lat });

export const validLatLng = (p: LatLng) => Number.isFinite(p.lat) && Number.isFinite(p.lng)
  && p.lat >= LAT_RANGE.min && p.lat <= LAT_RANGE.max && p.lng >= LNG_RANGE.min && p.lng <= LNG_RANGE.max;

/** Két pont egyezik-e (a megadott tizedes pontossággal) */
export const sameLatLng = (a: LatLng | null, b: LatLng | null, decimals = 6) =>
  a === b || (!!a && !!b && a.lat.toFixed(decimals) === b.lat.toFixed(decimals) && a.lng.toFixed(decimals) === b.lng.toFixed(decimals));

/** Magyar alak: „47,4979 · 19,0402” (tizedesvessző, mert a felület magyar) */
export const formatLatLng = (p: LatLng, decimals = 4) => `${formatHu(p.lat, decimals)} · ${formatHu(p.lng, decimals)}`;

/** Kerekítés a mezők pontosságára (6 tizedes ≈ 11 cm – bőven elég egy bejárathoz) */
export const roundLatLng = (p: LatLng, decimals = 6): LatLng => ({ lat: Number(p.lat.toFixed(decimals)), lng: Number(p.lng.toFixed(decimals)) });

/**
 * Magyarország VÁZLATOS körvonala (lng, lat) – csak a tartalék mini-térképhez, tájékozódásra.
 * Nem pontos határ; mérni, dönteni ne ebből kell.
 */
export const HU_OUTLINE: ReadonlyArray<[number, number]> = [
  [17.16, 48.01], [17.7, 47.76], [18.7, 47.88], [18.84, 48.05], [19.47, 48.09], [19.9, 48.17], [20.29, 48.26], [20.66, 48.56],
  [21.45, 48.58], [22.1, 48.41], [22.2, 48.42], [22.32, 48.32], [22.9, 47.96], [22.42, 47.74], [21.95, 47.37], [21.62, 46.95], [21.2, 46.4], [20.73, 46.18],
  [20.26, 46.11], [19.57, 46.17], [18.85, 45.91], [18.43, 45.74], [17.86, 45.8], [17.3, 46.0], [16.88, 46.38], [16.6, 46.48],
  [16.11, 46.86], [16.45, 47.0], [16.45, 47.4], [16.65, 47.6], [16.42, 47.66], [16.48, 47.75], [16.72, 47.74], [16.9, 47.72], [17.07, 47.85],
];

/** A mini-térkép vetülete: egyszerű négyzetes (equirectangular), a 47. szélességi körön torzításmentes arányokkal */
export const MINI = { w: 154, h: 100, west: 16, east: 23, north: 48.7, south: 45.6 } as const;
export function project(p: LatLng) {
  return { x: ((p.lng - MINI.west) / (MINI.east - MINI.west)) * MINI.w, y: ((MINI.north - p.lat) / (MINI.north - MINI.south)) * MINI.h };
}
