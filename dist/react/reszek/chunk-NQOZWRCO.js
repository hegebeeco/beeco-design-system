/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  formatHu
} from "./chunk-PJRTRYZN.js";

// react/src/media/map.ts
var esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function markerHtml({ label, kind = "neutral", selected = false, title }) {
  const name = title ? esc(title) : esc(label);
  return `<span class="bc-map-pin is-${kind}${selected ? " is-selected" : ""}" role="img" aria-label="${name}${selected ? " (kijel\xF6lve)" : ""}" title="${name}"><span aria-hidden="true">${esc(label.slice(0, 2))}</span></span>`;
}
var MARKER_ICON = { className: "bc-map-icon", iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -38] };
var MARKER_ICON_SELECTED = { className: "bc-map-icon", iconSize: [40, 50], iconAnchor: [20, 50], popupAnchor: [0, -48] };
var clusterTier = (count) => count < 10 ? "s" : count < 100 ? "m" : "l";
var TIER_PX = { s: 36, m: 44, l: 52 };
function clusterHtml(count) {
  const t = clusterTier(count);
  const n = count >= 1e4 ? `${formatHu(Math.floor(count / 1e3), 0)}e+` : formatHu(count, 0);
  return `<span class="bc-map-cluster is-${t}" role="img" aria-label="${formatHu(count, 0)} hely \u2013 nagy\xEDts r\xE1 a sz\xE9tnyit\xE1shoz"><span aria-hidden="true">${n}</span></span>`;
}
var clusterIcon = (count) => {
  const px = TIER_PX[clusterTier(count)];
  return { className: "bc-map-icon", iconSize: [px, px] };
};
function heatGradient(el = document.documentElement, colorblind = false) {
  const cs = getComputedStyle(el);
  const out = {};
  for (let i = 1; i <= 5; i++) out[i / 5] = cs.getPropertyValue(`--bc-data-seq-${colorblind ? "cb-" : ""}${i}`).trim();
  return out;
}

export {
  markerHtml,
  MARKER_ICON,
  MARKER_ICON_SELECTED,
  clusterTier,
  clusterHtml,
  clusterIcon,
  heatGradient
};
