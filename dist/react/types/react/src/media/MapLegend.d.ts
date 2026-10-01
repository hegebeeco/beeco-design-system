import type { ReactNode } from 'react';
import type { MarkerKind } from './map';
export type LegendItem = {
    label: string;
    kind: MarkerKind;
    letter: string;
};
export type MapLegendProps = {
    items: readonly LegendItem[];
    title?: string;
    /** Telefonon lenyitható (details) – alap: igen */
    collapsible?: boolean;
    className?: string;
};
/** MapLegend (molekula): a jelölők jelentése – szín ÉS betű együtt. Keskeny képernyőn lenyitható. */
export declare function MapLegend({ items, title, collapsible, className }: MapLegendProps): import("react").JSX.Element;
export type HeatScaleProps = {
    /** Mit mutat, egyszerű nyelven: „Megnyitások száma” */
    title: string;
    /** Egység és időszak: „db / nap, 2026. 09.” */
    unit: string;
    /** Honnan jön az adat, hogyan számoljuk (ⓘ) */
    help: ReactNode;
    /** A két vég felirata: [„kevés”, „sok”] vagy számok forrásból */
    ends?: [string, string];
    /** Az öt fokozat felirata (pl. „0–10”) – ha megvan, táblázatként is olvasható */
    steps?: readonly string[];
    /** „Hogyan olvasd?” – 2–4 mondat: mit jelent a sötét, mire figyelj, mi NEM következik belőle */
    howToRead?: ReactNode;
    /** Színtévesztő-barát (kék) sorozat */
    colorblind?: boolean;
    className?: string;
};
/** HeatScale (molekula, 3/B): a hőtérkép skálája a data-seq tokenekből – cím, egység, súgó, két vég, „Hogyan olvasd?”, fokozatok táblázata. */
export declare function HeatScale({ title, unit, help, ends, steps, howToRead, colorblind, className }: HeatScaleProps): import("react").JSX.Element;
