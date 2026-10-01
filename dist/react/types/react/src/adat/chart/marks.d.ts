/** Grafikon-jelek: sorozat-színosztály, pont-alakok (■ ● ▲ ◆), jelmagyarázat-minta, sáv-mintázat. Szín csak --bc-data-* tokenből (bc-adat.css). */
/** Sorozat színosztálya: s1 … s8 (a színtévesztő-barát módban más sorrend – bc-adat.css) */
export declare const sc: (i: number) => string;
export type Shape = 'circle' | 'square' | 'triangle' | 'diamond';
export declare const shapeOf: (i: number) => Shape;
/** Pont-jel: a sorozat alakja is más, nem csak a színe; kontúr a line színnel */
export declare function Marker({ x, y, i, r }: {
    x: number;
    y: number;
    i: number;
    r?: number;
}): import("react").JSX.Element;
/** Jelmagyarázat-minta (16×16): oszlop = négyzet, vonal = vonal + pont-alak, sáv = csíkos (rejtett / hiányzó) */
export declare function Swatch({ i, kind }: {
    i: number;
    kind: 'bar' | 'line' | 'gap';
}): import("react").JSX.Element;
/** Csíkos minta a hiányzó / rejtett sávhoz (nem nulla!) – id egyedi grafikononként */
export declare function GapPattern({ id }: {
    id: string;
}): import("react").JSX.Element;
