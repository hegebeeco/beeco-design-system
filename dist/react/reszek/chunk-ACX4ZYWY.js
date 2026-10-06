/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Frame
} from "./chunk-YTPTCQKN.js";
import {
  allValues
} from "./chunk-MTL4MSUK.js";
import {
  sc
} from "./chunk-TJUOB7ZX.js";
import {
  fmt
} from "./chunk-E6NOQYCW.js";

// react/src/adat/chart/ColumnCharts.tsx
import { jsx } from "react/jsx-runtime";
var name = (d, l) => l ?? `${d.series.map((s) => s.label).join(", ")} (${d.unit})`;
var tip = (d, si, i, v, dec) => `${d.series[si].label}, ${d.categories[i]}: ${fmt(v, dec)} ${d.unit}`;
function GroupedBarChart({ data, height = 240, label }) {
  const vals = allValues(data);
  const k = Math.max(1, data.series.length);
  return /* @__PURE__ */ jsx(Frame, { data, min: Math.min(0, ...vals), max: Math.max(0, ...vals), height, minBand: k * 10 + 10, label: name(data, label), children: ({ band, cx, y, decimals }) => {
    const gw = Math.min(k * 28, band * 0.8), bw = gw / k, dec = data.decimals ?? decimals;
    return data.categories.map((_, i) => data.series.map((s, si) => {
      const v = s.values[i];
      if (typeof v !== "number") return null;
      const x = cx(i) - gw / 2 + si * bw;
      if (v === 0) return /* @__PURE__ */ jsx("line", { className: `bc-mark-zero ${sc(si)}`, x1: x, x2: x + bw, y1: y(0), y2: y(0) }, `${i}-${si}`);
      const top = y(Math.max(0, v)), bottom = y(Math.min(0, v));
      return /* @__PURE__ */ jsx("rect", { className: `bc-mark ${sc(si)}`, x, y: top, width: Math.max(1, bw), height: Math.max(1, bottom - top), children: /* @__PURE__ */ jsx("title", { children: tip(data, si, i, v, dec) }) }, `${i}-${si}`);
    }));
  } });
}
function StackedBarChart({ data, height = 240, label }) {
  const sums = data.categories.map((_, i) => data.series.reduce((a, s) => a + Math.max(0, s.values[i] ?? 0), 0));
  const neg = data.series.some((s) => s.values.some((v) => typeof v === "number" && v < 0));
  return /* @__PURE__ */ jsx(
    Frame,
    {
      data,
      min: 0,
      max: Math.max(0, ...sums),
      height,
      minBand: 20,
      label: name(data, label),
      note: neg ? "Halmozott oszlopon negat\xEDv r\xE9sz nem \xE1br\xE1zolhat\xF3 \u2013 azokat kihagytam, az adatt\xE1bl\xE1ban megvannak." : void 0,
      children: ({ band, cx, y, decimals }) => {
        const bw = Math.min(48, Math.max(4, band * 0.68)), dec = data.decimals ?? decimals;
        return data.categories.map((_, i) => {
          if (data.series.some((s) => s.values[i] === null || s.values[i] === void 0)) return null;
          let acc = 0;
          return data.series.map((s, si) => {
            const v = s.values[i];
            if (v <= 0) return null;
            const y0 = y(acc), y1 = y(acc + v);
            acc += v;
            return /* @__PURE__ */ jsx("rect", { className: `bc-mark ${sc(si)}`, x: cx(i) - bw / 2, y: y1, width: bw, height: Math.max(1, y0 - y1), children: /* @__PURE__ */ jsx("title", { children: tip(data, si, i, v, dec) }) }, `${i}-${si}`);
          });
        });
      }
    }
  );
}

export {
  GroupedBarChart,
  StackedBarChart
};
