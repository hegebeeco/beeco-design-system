/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  findOutlier,
  outlierNote
} from "./chunk-STABJXQT.js";
import {
  CH
} from "./chunk-H22WSUTJ.js";
import {
  paletteClass
} from "./chunk-LABSVBLX.js";
import {
  sc
} from "./chunk-QRBXHE7P.js";
import {
  useWidth
} from "./chunk-DVTIXTNI.js";
import {
  clip,
  fmt,
  linear,
  niceTicks
} from "./chunk-53F4KYRN.js";

// react/src/adat/chart/HBarChart.tsx
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ROW = 32;
function HBarChart({ data, clipOutlier = true, valueLabels = true, label }) {
  const box = useRef(null);
  const width = useWidth(box);
  const s = data.series[0] ?? { values: [], label: "" };
  const nums = s.values.filter((v) => typeof v === "number");
  const o = clipOutlier ? findOutlier(s.values) : null;
  const { lo, hi, ticks, decimals } = niceTicks(Math.min(0, ...nums), o ? o.cap : Math.max(0, ...nums), width < 420 ? 3 : 5);
  const d = data.decimals ?? decimals;
  const maxChars = Math.max(...data.categories.map((c) => c.length), 1);
  const labW = Math.min(Math.round(width * 0.4), maxChars * CH + 12);
  const fit = Math.max(4, Math.floor((labW - 12) / CH));
  const valW = Math.max(...nums.map((v) => fmt(v, d).length), 1) * CH + 10;
  const t = 28, b = 44, l = labW, r = valueLabels ? valW : 16;
  const h = t + b + data.categories.length * ROW;
  const pw = Math.max(20, width - l - r);
  const x = linear(lo, hi, l, l + pw);
  return /* @__PURE__ */ jsxs("div", { className: paletteClass(data) ? `bc-chart ${paletteClass(data)}` : "bc-chart", ref: box, children: [
    width > 0 && /* @__PURE__ */ jsxs("svg", { width, height: h, viewBox: `0 0 ${width} ${h}`, role: "img", "aria-label": `${label ?? `${s.label} (${data.unit})`}. A pontos sz\xE1mok az adatt\xE1bl\xE1ban.`, children: [
      /* @__PURE__ */ jsx("text", { className: "bc-ax-title", x: 4, y: 14, children: data.xLabel }),
      ticks.map((v) => /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("line", { className: "bc-grid", x1: x(v), x2: x(v), y1: t, y2: h - b }),
        /* @__PURE__ */ jsx("text", { className: "bc-ax-t", x: x(v), y: h - b + 18, textAnchor: "middle", children: fmt(v, decimals) })
      ] }, v)),
      /* @__PURE__ */ jsx("text", { className: "bc-ax-title", x: l + pw / 2, y: h - 6, textAnchor: "middle", children: data.yLabel ?? data.unit }),
      data.categories.map((c, i) => {
        const v = s.values[i], yy = t + i * ROW, bh = ROW - 10;
        const cut = o?.index === i;
        return /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsxs("text", { className: "bc-ax-t is-cat", x: l - 8, y: yy + ROW / 2, dy: "0.32em", textAnchor: "end", children: [
            c.length > fit ? /* @__PURE__ */ jsx("title", { children: c }) : null,
            clip(c, fit)
          ] }),
          v === null || v === void 0 ? /* @__PURE__ */ jsx("text", { className: "bc-ax-t is-gap", x: x(0) + 6, y: yy + ROW / 2, dy: "0.32em", children: data.gapLabel ?? "nincs adat" }) : v === 0 ? /* @__PURE__ */ jsx("line", { className: `bc-mark-zero ${sc(0)}`, x1: x(0), x2: x(0), y1: yy + 5, y2: yy + 5 + bh }) : /* @__PURE__ */ jsx("rect", { className: `bc-mark ${sc(0)}`, x: x(Math.min(0, v)), y: yy + 5, height: bh, width: Math.max(1, (cut ? l + pw : x(Math.max(0, v))) - x(Math.min(0, v))), children: /* @__PURE__ */ jsx("title", { children: `${c}: ${fmt(v, d)} ${data.unit}` }) }),
          cut && /* @__PURE__ */ jsx("path", { className: "bc-break", d: `M${l + pw - 14} ${yy + 2}l6 ${bh / 2 + 3}l-6 ${bh / 2 + 3}` }),
          valueLabels && typeof v === "number" && /* @__PURE__ */ jsx("text", { className: "bc-val", x: v < 0 ? x(v) - 4 : cut ? l + pw + 4 : x(v) + 4, y: yy + ROW / 2, dy: "0.32em", textAnchor: v < 0 ? "end" : "start", children: fmt(v, d) })
        ] }, i);
      }),
      /* @__PURE__ */ jsx("line", { className: lo < 0 ? "bc-zero is-strong" : "bc-zero", x1: x(0), x2: x(0), y1: t, y2: h - b })
    ] }),
    o && /* @__PURE__ */ jsx("p", { className: "bc-chart-note", children: outlierNote(data, o) })
  ] });
}

export {
  HBarChart
};
