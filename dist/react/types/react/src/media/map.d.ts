/**
 * Térkép-segédek Leaflethez – a DS NEM függ a Leaflettől: HTML-szöveget ad az L.divIcon-nak, a kinézet a bc-media.css-ben.
 *   L.marker(p, { icon: L.divIcon({ html: markerHtml({ label: 'P', kind: 'info', title: 'Zöld Sarok' }), ...MARKER_ICON }) })
 *   L.markerClusterGroup({ iconCreateFunction: (c) => L.divIcon({ html: clusterHtml(c.getChildCount()), ...clusterIcon(c.getChildCount()) }) })
 * A térkép burka: <div class="bc-map"> – ez öltözteti a vezérlőket (44 px), a buborékot és a jelmagyarázatot.
 */
/** Jelölő-fajták: a szín a szerep-tokenből jön, a betű/ikon ugyanazt mondja (színtévesztőnek is) */
export type MarkerKind = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type MarkerOptions = {
    /** 1–2 betű vagy egy rövid jel a tűben (pl. „P” = partner) */
    label: string;
    kind?: MarkerKind;
    selected?: boolean;
    /** A hely neve (képernyőolvasónak és a rámutatásnak) */
    title?: string;
};
/** Tű alakú jelölő HTML-je (kijelölve mézes és nagyobb) */
export declare function markerHtml({ label, kind, selected, title }: MarkerOptions): string;
/** Az L.divIcon méret-beállításai a tűhöz: a csúcs mutat a pontra */
export declare const MARKER_ICON: {
    className: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
};
export declare const MARKER_ICON_SELECTED: {
    className: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
};
/** Csoport-méretfokozat: < 10 · < 100 · 100+ */
export declare const clusterTier: (count: number) => "s" | "l" | "m";
/** Számozott csoport-buborék HTML-je (fehér kör, fekete keret, Lalezar szám; 1 000+ tagolva) */
export declare function clusterHtml(count: number): string;
export declare const clusterIcon: (count: number) => {
    className: string;
    iconSize: [number, number];
};
/**
 * A hőtérkép színei a tokenekből (leaflet.heat `gradient`): { 0.2: '#…', … 1: '#…' }.
 * Színtévesztő-barát módban (colorblind) a kék sorozat. A hívó a térkép elemét adja (a sötét/világos téma onnan öröklődik).
 */
export declare function heatGradient(el?: Element, colorblind?: boolean): Record<number, string>;
