/** Az i-edik tengely szöge (radián): felülről indul, az óramutató járásával. */
export declare function tengelySzog(i: number, n: number): number;
export type RadarOpciok = {
    cx?: number;
    cy?: number;
    r?: number;
    max?: number;
};
/** Az i-edik tengelyen az `ertek` (0–max, a határra igazítva) pontja. Üres érték → a középpont. */
export declare function radarPont(i: number, n: number, ertek: number | null | undefined, { cx, cy, r, max }?: RadarOpciok): {
    x: number;
    y: number;
};
/** SVG `points` szöveg egy értéksorból; a hiányzó (null) érték kimarad (nem nulla – nem húzzuk a középpontba). */
export declare function radarPoligon(ertekek: ReadonlyArray<number | null | undefined>, opciok?: RadarOpciok): string;
/** A tengelycímke vízszintes igazítása a szög szerint. */
export declare function cimkeIgazitas(i: number, n: number): 'start' | 'middle' | 'end';
/**
 * Címke tördelése legfeljebb `max` karakteres sorokra, legfeljebb `sorok` sorban; a szóköz nélküli hosszú szót kötőjellel vágja,
 * a túl hosszú címke utolsó sora „…”-ra végződik (a teljes név az aria-labelben és a listában megvan).
 */
export declare function cimkeTordeles(szoveg: string, max: number, sorok?: number): string[];
