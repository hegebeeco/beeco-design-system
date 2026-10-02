import { type ReactNode } from 'react';
import { type ChartData } from './types';
export declare const CH = 7;
export type Plot = {
    l: number;
    t: number;
    w: number;
    h: number;
};
export type FrameCtx = {
    plot: Plot;
    band: number;
    /** Az i. kategória közepe */
    cx: (i: number) => number;
    /** Érték → y képpont */
    y: (v: number) => number;
    lo: number;
    hi: number;
    decimals: number;
    narrow: boolean;
    /** A jobb oldali margó, amit a padRight végül kapott (a grafikon ebből látja, kifér-e a végcímke) */
    padR: number;
};
type Props = {
    data: ChartData;
    /** Az érték-tengely tartománya (a hívó számolja: halmozásnál az összeg, kiugrónál a levágott) */
    min: number;
    max: number;
    height?: number;
    /** Legkisebb sáv egy kategóriának – ha nem fér el, a grafikon oldalra görgethető (telefon, 365 nap) */
    minBand?: number;
    /** Jobb oldali hely (vonalvégi címkék) */
    /** Jobb margó; `spare` = mennyi hely marad jobbra görgetés nélkül (a minimális sávszélesség mellett) */
    padRight?: (narrow: boolean, spare: number) => number;
    label: string;
    children: (c: FrameCtx) => ReactNode;
    /** Rajz alatti megjegyzés (pl. kiugró érték) */
    note?: ReactNode;
};
/**
 * Álló grafikonok közös váza (oszlop, vonal, csoportosított, halmozott): valódi pixelben rajzol (ResizeObserver),
 * y-rács magyar számokkal, 0-vonal kiemelve, x-feliratok ritkítva és rövidítve, tengelynevek, hiányzó sáv (nem nulla).
 */
export declare function Frame({ data, min, max, height, minBand, padRight, label, children, note }: Props): import("react").JSX.Element;
export {};
