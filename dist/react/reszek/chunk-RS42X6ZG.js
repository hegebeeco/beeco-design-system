/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  formatHu
} from "./chunk-PJRTRYZN.js";

// react/src/kieg2/geo.ts
var LAT_RANGE = { min: -90, max: 90 };
var LNG_RANGE = { min: -180, max: 180 };
var HU_BOUNDS = { south: 45.7, north: 48.6, west: 16.1, east: 22.9 };
var HU_CENTER = { lat: 47.4979, lng: 19.0402 };
function segDist(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay, k = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - k * dx, py - ay - k * dy);
}
function inHungary(p) {
  if (p.lat < HU_BOUNDS.south || p.lat > HU_BOUNDS.north || p.lng < HU_BOUNDS.west || p.lng > HU_BOUNDS.east) return false;
  let inside = false;
  const o = HU_OUTLINE;
  for (let i = 0, j = o.length - 1; i < o.length; j = i++) {
    const [xi, yi] = o[i], [xj, yj] = o[j];
    if (yi > p.lat !== yj > p.lat && p.lng < (xj - xi) * (p.lat - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside || o.some((a, i) => segDist(p.lng, p.lat, a, o[(i + 1) % o.length]) < 0.05);
}
var looksSwapped = (p) => !inHungary(p) && inHungary({ lat: p.lng, lng: p.lat });
var validLatLng = (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.lat >= LAT_RANGE.min && p.lat <= LAT_RANGE.max && p.lng >= LNG_RANGE.min && p.lng <= LNG_RANGE.max;
var sameLatLng = (a, b, decimals = 6) => a === b || !!a && !!b && a.lat.toFixed(decimals) === b.lat.toFixed(decimals) && a.lng.toFixed(decimals) === b.lng.toFixed(decimals);
var formatLatLng = (p, decimals = 4) => `${formatHu(p.lat, decimals)} \xB7 ${formatHu(p.lng, decimals)}`;
var roundLatLng = (p, decimals = 6) => ({ lat: Number(p.lat.toFixed(decimals)), lng: Number(p.lng.toFixed(decimals)) });
var HU_OUTLINE = [
  [17.16, 48.01],
  [17.7, 47.76],
  [18.7, 47.88],
  [18.84, 48.05],
  [19.47, 48.09],
  [19.9, 48.17],
  [20.29, 48.26],
  [20.66, 48.56],
  [21.45, 48.58],
  [22.1, 48.41],
  [22.2, 48.42],
  [22.32, 48.32],
  [22.9, 47.96],
  [22.42, 47.74],
  [21.95, 47.37],
  [21.62, 46.95],
  [21.2, 46.4],
  [20.73, 46.18],
  [20.26, 46.11],
  [19.57, 46.17],
  [18.85, 45.91],
  [18.43, 45.74],
  [17.86, 45.8],
  [17.3, 46],
  [16.88, 46.38],
  [16.6, 46.48],
  [16.11, 46.86],
  [16.45, 47],
  [16.45, 47.4],
  [16.65, 47.6],
  [16.42, 47.66],
  [16.48, 47.75],
  [16.72, 47.74],
  [16.9, 47.72],
  [17.07, 47.85]
];
var MINI = { w: 154, h: 100, west: 16, east: 23, north: 48.7, south: 45.6 };
function project(p) {
  return { x: (p.lng - MINI.west) / (MINI.east - MINI.west) * MINI.w, y: (MINI.north - p.lat) / (MINI.north - MINI.south) * MINI.h };
}

export {
  LAT_RANGE,
  LNG_RANGE,
  HU_BOUNDS,
  HU_CENTER,
  inHungary,
  looksSwapped,
  validLatLng,
  sameLatLng,
  formatLatLng,
  roundLatLng,
  HU_OUTLINE,
  MINI,
  project
};
