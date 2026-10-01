import { type FieldProps } from '../field/Field';
type Common = FieldProps & {
    min: number;
    max: number;
    /** Lépésköz (alap 1) */
    step?: number;
    /** PageUp/PageDown lépése (alap: a tartomány tizede) */
    bigStep?: number;
    /** Mértékegység a kijelzésben és a tartományban: km, %, Ft */
    unit?: string;
    /** Saját kijelzés (alap: magyar szám + egység) */
    format?: (v: number) => string;
    /** Űrlapba küldéshez (rejtett mező) */
    name?: string;
};
export type SliderProps = Common & {
    value: number;
    onChange: (value: number) => void;
};
export type RangeSliderProps = Common & {
    value: [number, number];
    onChange: (value: [number, number]) => void;
    /** Legalább ennyi legyen a két fogantyú között (alap 0) */
    minGap?: number;
};
/**
 * Slider (atom + Field, Javaslat 06a/4): egy érték húzással, koppintással vagy billentyűvel
 * (nyilak: lépés · PageUp/PageDown: nagy lépés · Home/End: határ). Érintésen 44 px-es fogantyú.
 */
export declare function Slider({ value, onChange, ...rest }: SliderProps): import("react").JSX.Element;
/** RangeSlider: két fogantyú (alsó és felső határ) – nem keresztezhetik egymást; minGap tartja a távolságot. */
export declare function RangeSlider({ value, onChange, minGap, ...rest }: RangeSliderProps): import("react").JSX.Element;
export {};
