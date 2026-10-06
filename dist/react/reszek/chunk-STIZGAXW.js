/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  HBarChart
} from "./chunk-3VD3F3IY.js";
import {
  findOutlier,
  outlierNote
} from "./chunk-SRE3TXI6.js";
import {
  Frame
} from "./chunk-45ARMBQA.js";
import {
  sc
} from "./chunk-YBQ3UMLC.js";
import {
  fmt
} from "./chunk-TJH2MMU2.js";

// react/src/adat/chart/BarChart.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function BarChart(p) {
  if (p.orientation === "horizontal") return /* @__PURE__ */ jsx(HBarChart, { ...p });
  const { data, height = 240, clipOutlier = true } = p;
  const s = data.series[0] ?? { values: [], label: "" };
  const nums = s.values.filter((v) => typeof v === "number");
  const o = clipOutlier ? findOutlier(s.values) : null;
  const max = o ? o.cap : Math.max(0, ...nums);
  const label = p.label ?? `${s.label} (${data.unit})`;
  return /* @__PURE__ */ jsx(Frame, { data, min: Math.min(0, ...nums), max, height, minBand: 20, label, note: o ? outlierNote(data, o) : void 0, children: ({ band, cx, y, plot, narrow, decimals }) => {
    const bw = Math.min(48, Math.max(4, band * 0.68));
    const showVals = p.valueLabels ?? (data.categories.length <= 16 && !narrow);
    const tips = data.categories.length <= 40;
    return s.values.map((v, i) => {
      if (v === null || v === void 0) return null;
      const x = cx(i) - bw / 2;
      const d = data.decimals ?? decimals;
      if (v === 0) return /* @__PURE__ */ jsx("line", { className: `bc-mark-zero ${sc(0)}`, x1: x, x2: x + bw, y1: y(0), y2: y(0), children: /* @__PURE__ */ jsx("title", { children: `${data.categories[i]}: 0 ${data.unit}` }) }, i);
      const cut = o?.index === i;
      const top = cut ? plot.t : y(Math.max(0, v)), bottom = y(Math.min(0, v));
      return /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("rect", { className: `bc-mark ${sc(0)}`, x, y: top, width: bw, height: Math.max(1, bottom - top), children: tips && /* @__PURE__ */ jsx("title", { children: `${data.categories[i]}: ${fmt(v, d)} ${data.unit}` }) }),
        cut && /* @__PURE__ */ jsx("path", { className: "bc-break", d: `M${x - 3} ${plot.t + 12}l${bw / 2 + 3} -6l${bw / 2 + 3} 6` }),
        (showVals || cut) && /* @__PURE__ */ jsx("text", { className: "bc-val", x: cx(i), y: v < 0 ? bottom + 14 : top - 6, textAnchor: "middle", children: cut ? `\u2191 ${fmt(v, d)}` : fmt(v, d) })
      ] }, i);
    });
  } });
}

export {
  BarChart
};
