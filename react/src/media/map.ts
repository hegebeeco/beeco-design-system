import { formatHu } from '../inputs/number';

/**
 * Térkép-segédek Leaflethez – a DS NEM függ a Leaflettől: HTML-szöveget ad az L.divIcon-nak, a kinézet a bc-media.css-ben.
 *   L.marker(p, { icon: L.divIcon({ html: markerHtml({ label: 'P', kind: 'info', title: 'Zöld Sarok' }), ...MARKER_ICON }) })
 *   L.markerClusterGroup({ iconCreateFunction: (c) => L.divIcon({ html: clusterHtml(c.getChildCount()), ...clusterIcon(c.getChildCount()) }) })
 * A térkép burka: <div class="bc-map"> – ez öltözteti a vezérlőket (44 px), a buborékot és a jelmagyarázatot.
 */

/** Jelölő-fajták: a szín a szerep-tokenből jön, a betű/ikon ugyanazt mondja (színtévesztőnek is) */
export type MarkerKind = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export type MarkerOptions = {
  /** 1–2 betű vagy egy rövid jel a tűben (pl. „P” = partner) */
  label: string;
  kind?: MarkerKind;
  selected?: boolean;
  /** A hely neve (képernyőolvasónak és a rámutatásnak) */
  title?: string;
};

/** Tű alakú jelölő HTML-je (kijelölve mézes és nagyobb) */
export function markerHtml({ label, kind = 'neutral', selected = false, title }: MarkerOptions) {
  const name = title ? esc(title) : esc(label);
  return `<span class="bc-map-pin is-${kind}${selected ? ' is-selected' : ''}" role="img" aria-label="${name}${selected ? ' (kijelölve)' : ''}" title="${name}"><span aria-hidden="true">${esc(label.slice(0, 2))}</span></span>`;
}

/** Az L.divIcon méret-beállításai a tűhöz: a csúcs mutat a pontra */
export const MARKER_ICON = { className: 'bc-map-icon', iconSize: [32, 40] as [number, number], iconAnchor: [16, 40] as [number, number], popupAnchor: [0, -38] as [number, number] };
export const MARKER_ICON_SELECTED = { className: 'bc-map-icon', iconSize: [40, 50] as [number, number], iconAnchor: [20, 50] as [number, number], popupAnchor: [0, -48] as [number, number] };

/** Csoport-méretfokozat: < 10 · < 100 · 100+ */
export const clusterTier = (count: number) => (count < 10 ? 's' : count < 100 ? 'm' : 'l');
const TIER_PX = { s: 36, m: 44, l: 52 } as const;

/** Számozott csoport-buborék HTML-je (fehér kör, fekete keret, Lalezar szám; 1 000+ tagolva) */
export function clusterHtml(count: number) {
  const t = clusterTier(count);
  const n = count >= 10000 ? `${formatHu(Math.floor(count / 1000), 0)}e+` : formatHu(count, 0);
  return `<span class="bc-map-cluster is-${t}" role="img" aria-label="${formatHu(count, 0)} hely – nagyíts rá a szétnyitáshoz"><span aria-hidden="true">${n}</span></span>`;
}
export const clusterIcon = (count: number) => { const px = TIER_PX[clusterTier(count)]; return { className: 'bc-map-icon', iconSize: [px, px] as [number, number] }; };

/**
 * A hőtérkép színei a tokenekből (leaflet.heat `gradient`): { 0.2: '#…', … 1: '#…' }.
 * Színtévesztő-barát módban (colorblind) a kék sorozat. A hívó a térkép elemét adja (a sötét/világos téma onnan öröklődik).
 */
export function heatGradient(el: Element = document.documentElement, colorblind = false): Record<number, string> {
  const cs = getComputedStyle(el);
  const out: Record<number, string> = {};
  for (let i = 1; i <= 5; i++) out[i / 5] = cs.getPropertyValue(`--bc-data-seq-${colorblind ? 'cb-' : ''}${i}`).trim();
  return out;
}
