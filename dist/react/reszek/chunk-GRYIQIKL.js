/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  formatHu
} from "./chunk-PJRTRYZN.js";
import {
  norm
} from "./chunk-LCFIUOPW.js";

// react/src/adat/format.ts
function fmt(n, decimals = 0) {
  if (n === null || n === void 0 || Number.isNaN(n)) return "\u2013";
  return formatHu(n, decimals).replace("-", "\u2212").replace(/ /g, "\xA0");
}
var fmtSigned = (n, decimals = 0) => (n > 0 ? "+" : "") + fmt(n, decimals);
function matchText(haystack, query) {
  const q = norm(query.trim());
  return !q || norm(haystack).includes(q);
}
function niceTicks(min, max, count = 5) {
  let lo = Math.min(0, min), hi = Math.max(0, max);
  if (hi === lo) hi = lo + 1;
  const raw = (hi - lo) / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.abs(v) < step / 1e6 ? 0 : +v.toFixed(10));
  const decimals = step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
  return { lo, hi, step, ticks, decimals };
}
var linear = (d0, d1, r0, r1) => (v) => r0 + (v - d0) / (d1 - d0 || 1) * (r1 - r0);
var labelEvery = (count, width, minPx) => Math.max(1, Math.ceil(count * minPx / Math.max(1, width)));
var clip = (s, max) => s.length > max ? s.slice(0, Math.max(1, max - 1)).trimEnd() + "\u2026" : s;
function pageList(page, total, siblings = 1) {
  if (total <= 5 + siblings * 2) return Array.from({ length: total }, (_, i) => i);
  const from = Math.max(1, page - siblings), to = Math.min(total - 2, page + siblings);
  const out = [0];
  if (from > 1) out.push(null);
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 2) out.push(null);
  out.push(total - 1);
  return out;
}

export {
  fmt,
  fmtSigned,
  matchText,
  niceTicks,
  linear,
  labelEvery,
  clip,
  pageList
};
