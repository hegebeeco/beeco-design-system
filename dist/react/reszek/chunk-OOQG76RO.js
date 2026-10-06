/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  CH,
  Frame
} from "./chunk-SCJ2I24R.js";
import {
  visibleValues
} from "./chunk-EB7H5ZIL.js";
import {
  Marker,
  sc
} from "./chunk-DYOZJX5Z.js";
import {
  clip,
  fmt
} from "./chunk-PFWSOZ76.js";

// react/src/adat/chart/LineChart.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function segments(values) {
  const out = [];
  let cur = [];
  values.forEach((v, i) => {
    if (typeof v === "number") cur.push(i);
    else if (cur.length) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
}
var lastIndex = (v) => {
  for (let i = v.length - 1; i >= 0; i--) if (typeof v[i] === "number") return i;
  return -1;
};
var LABEL_MAX = 16;
function LineChart({ data, height = 260, endLabels, label }) {
  const vals = visibleValues(data);
  const shown = data.series.filter((s) => !s.hidden);
  const wantEnd = (narrow) => (endLabels ?? data.series.length <= 4) && !narrow && shown.length > 0;
  const labW = Math.min(LABEL_MAX, Math.max(...data.series.map((s) => s.label.length), 1)) * CH + 16;
  const many = data.categories.length > 40;
  return /* @__PURE__ */ jsx(
    Frame,
    {
      data,
      min: Math.min(0, ...vals),
      max: Math.max(0, ...vals),
      height,
      minBand: many ? 6 : 16,
      padRight: (narrow, spare) => wantEnd(narrow) && spare >= labW ? labW : 16,
      label: label ?? `${shown.map((s) => s.label).join(", ")} (${data.unit})`,
      children: ({ cx, y, narrow, plot, decimals, padR }) => {
        const d = data.decimals ?? decimals;
        const showEnd = wantEnd(narrow) && padR >= labW;
        const ends = data.series.map((s, i) => ({ i, at: s.hidden ? -1 : lastIndex(s.values) })).filter((e) => e.at >= 0).map((e) => ({ ...e, y: y(data.series[e.i].values[e.at]) })).sort((a, b) => a.y - b.y);
        for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 14);
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          data.series.map((s, i) => !s.hidden && segments(s.values).map((seg, k) => {
            const dPath = seg.map((j, n) => `${n ? "L" : "M"}${cx(j)} ${y(s.values[j])}`).join("");
            return /* @__PURE__ */ jsxs("g", { children: [
              /* @__PURE__ */ jsx("path", { className: "bc-line-under", d: dPath }),
              /* @__PURE__ */ jsx("path", { className: `bc-line ${sc(i)}`, d: dPath })
            ] }, `${s.key}${k}`);
          })),
          data.series.map((s, i) => !s.hidden && s.values.map((v, j) => {
            if (typeof v !== "number") return null;
            const alone = typeof s.values[j - 1] !== "number" && typeof s.values[j + 1] !== "number";
            if (many && !alone && j !== lastIndex(s.values)) return null;
            return /* @__PURE__ */ jsxs("g", { children: [
              /* @__PURE__ */ jsx(Marker, { x: cx(j), y: y(v), i, r: alone ? 6 : 4.5 }),
              /* @__PURE__ */ jsx("title", { children: `${s.label}, ${data.categories[j]}: ${fmt(v, d)} ${data.unit}` })
            ] }, `${s.key}m${j}`);
          })),
          showEnd && ends.map((e) => /* @__PURE__ */ jsx("text", { className: "bc-end-label", x: Math.min(cx(e.at) + 10, plot.l + plot.w + 8), y: e.y, dy: "0.32em", children: clip(data.series[e.i].label, LABEL_MAX) }, `e${e.i}`))
        ] });
      }
    }
  );
}

export {
  LineChart
};
