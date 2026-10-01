/** Csúszka – tiszta számolás (lépés, határ, billentyű, mutató-pozíció). */
export type SliderSpec = {
    min: number;
    max: number;
    step: number;
    bigStep: number;
};
export declare function snap(v: number, s: SliderSpec): number;
/** A billentyű új értéke, vagy null, ha nem csúszka-billentyű. Nyilak: lépés · PageUp/Down: nagy lépés · Home/End: határ */
export declare function keyValue(key: string, v: number, s: SliderSpec): number | null;
/** Mutató x-koordinátájából érték (a sáv téglalapjához mérve) */
export declare function valueAt(clientX: number, rect: {
    left: number;
    width: number;
}, s: SliderSpec): number;
export declare const pctOf: (v: number, s: SliderSpec) => number;
/** Alapértelmezett nagy lépés: a tartomány tizede, a lépéshez igazítva (legalább egy lépés) */
export declare const defaultBig: (min: number, max: number, step: number) => number;
