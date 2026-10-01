/** Egy pont a térképen (WGS84, fok) */
export type LatLng = {
    lat: number;
    lng: number;
};
/** A címkereső egy találata – a projekt keresője adja (pl. Nominatim, Google, saját API) */
export type AddressHit = {
    id: string;
    label: string;
    lat: number;
    lng: number;
};
/** Érvényes tartományok (WGS84) */
export declare const LAT_RANGE: {
    readonly min: -90;
    readonly max: 90;
};
export declare const LNG_RANGE: {
    readonly min: -180;
    readonly max: 180;
};
/**
 * Magyarország befoglaló téglalapja (kerekítve, kicsit bővebben a határnál).
 * Ezen kívül csak FIGYELMEZTETÜNK (nem hiba): lehet, hogy tényleg külföldi a hely.
 */
export declare const HU_BOUNDS: {
    readonly south: 45.7;
    readonly north: 48.6;
    readonly west: 16.1;
    readonly east: 22.9;
};
/** Budapest közepe – alapértelmezett térkép-középpont */
export declare const HU_CENTER: LatLng;
/**
 * Magyarországon van-e (közelítőleg): a befoglaló téglalapon belül ÉS a vázlatos körvonalon belül vagy ~0,05°-on (≈ 4–5 km) belül.
 * Csak figyelmeztetéshez – Bécs, Pozsony, Szabadka már kívül, Sopron, Záhony még belül (a folyó túlpartja, pl. Komárno, belül maradhat).
 */
export declare function inHungary(p: LatLng): boolean;
/** Gyakori hiba: felcserélt szélesség és hosszúság (pl. 19,04 · 47,49) – ilyenkor a csere Magyarországra esik */
export declare const looksSwapped: (p: LatLng) => boolean;
export declare const validLatLng: (p: LatLng) => boolean;
/** Két pont egyezik-e (a megadott tizedes pontossággal) */
export declare const sameLatLng: (a: LatLng | null, b: LatLng | null, decimals?: number) => boolean;
/** Magyar alak: „47,4979 · 19,0402” (tizedesvessző, mert a felület magyar) */
export declare const formatLatLng: (p: LatLng, decimals?: number) => string;
/** Kerekítés a mezők pontosságára (6 tizedes ≈ 11 cm – bőven elég egy bejárathoz) */
export declare const roundLatLng: (p: LatLng, decimals?: number) => LatLng;
/**
 * Magyarország VÁZLATOS körvonala (lng, lat) – csak a tartalék mini-térképhez, tájékozódásra.
 * Nem pontos határ; mérni, dönteni ne ebből kell.
 */
export declare const HU_OUTLINE: ReadonlyArray<[number, number]>;
/** A mini-térkép vetülete: egyszerű négyzetes (equirectangular), a 47. szélességi körön torzításmentes arányokkal */
export declare const MINI: {
    readonly w: 154;
    readonly h: 100;
    readonly west: 16;
    readonly east: 23;
    readonly north: 48.7;
    readonly south: 45.6;
};
export declare function project(p: LatLng): {
    x: number;
    y: number;
};
