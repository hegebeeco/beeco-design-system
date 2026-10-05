/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/adat/chart/marks.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var sc = (i) => `bc-s${i % 8 + 1}`;
var SHAPES = ["circle", "square", "triangle", "diamond"];
var shapeOf = (i) => SHAPES[i % SHAPES.length];
function Marker({ x, y, i, r = 5 }) {
  const cls = `bc-mark ${sc(i)}`;
  switch (shapeOf(i)) {
    case "square":
      return /* @__PURE__ */ jsx("rect", { className: cls, x: x - r, y: y - r, width: r * 2, height: r * 2 });
    case "triangle":
      return /* @__PURE__ */ jsx("path", { className: cls, d: `M${x} ${y - r * 1.2}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z` });
    case "diamond":
      return /* @__PURE__ */ jsx("path", { className: cls, d: `M${x} ${y - r * 1.3}L${x + r * 1.1} ${y}L${x} ${y + r * 1.3}L${x - r * 1.1} ${y}Z` });
    default:
      return /* @__PURE__ */ jsx("circle", { className: cls, cx: x, cy: y, r });
  }
}
function Swatch({ i, kind }) {
  return /* @__PURE__ */ jsxs("svg", { className: "bc-swatch", viewBox: "0 0 24 16", width: "24", height: "16", "aria-hidden": "true", children: [
    kind === "gap" && /* @__PURE__ */ jsx("rect", { className: "bc-gap-swatch", x: "1", y: "1", width: "22", height: "14", rx: "2" }),
    kind === "bar" && /* @__PURE__ */ jsx("rect", { className: `bc-mark ${sc(i)}`, x: "5", y: "1.5", width: "14", height: "13" }),
    kind === "line" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { className: "bc-line-under", d: "M1 8H23" }),
      /* @__PURE__ */ jsx("path", { className: `bc-line ${sc(i)}`, d: "M1 8H23" }),
      /* @__PURE__ */ jsx(Marker, { x: 12, y: 8, i, r: 4 })
    ] })
  ] });
}
function GapPattern({ id }) {
  return /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("pattern", { id, width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)", children: [
    /* @__PURE__ */ jsx("rect", { className: "bc-gap-bg", width: "8", height: "8" }),
    /* @__PURE__ */ jsx("path", { className: "bc-gap-line", d: "M0 0V8" })
  ] }) });
}

export {
  sc,
  shapeOf,
  Marker,
  Swatch,
  GapPattern
};
