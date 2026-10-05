/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg/sliderCore.ts
var decimalsOf = (n) => (String(n).split(".")[1] ?? "").length;
function snap(v, s) {
  const k = Math.round((v - s.min) / s.step);
  const x = s.min + k * s.step;
  const d = Math.max(decimalsOf(s.step), decimalsOf(s.min));
  return Math.min(s.max, Math.max(s.min, Number(x.toFixed(d))));
}
function keyValue(key, v, s) {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return snap(v + s.step, s);
    case "ArrowLeft":
    case "ArrowDown":
      return snap(v - s.step, s);
    case "PageUp":
      return snap(v + s.bigStep, s);
    case "PageDown":
      return snap(v - s.bigStep, s);
    case "Home":
      return s.min;
    case "End":
      return s.max;
    default:
      return null;
  }
}
function valueAt(clientX, rect, s) {
  const k = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  return snap(s.min + Math.min(1, Math.max(0, k)) * (s.max - s.min), s);
}
var pctOf = (v, s) => s.max > s.min ? (v - s.min) / (s.max - s.min) * 100 : 0;
var defaultBig = (min, max, step) => Math.max(step, Math.round((max - min) / 10 / step) * step);

export {
  snap,
  keyValue,
  valueAt,
  pctOf,
  defaultBig
};
