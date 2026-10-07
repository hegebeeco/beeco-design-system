/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  isGap,
  paletteClass
} from "./chunk-VKCPPSCK.js";
import {
  GapPattern
} from "./chunk-TE4UBFJP.js";
import {
  useWidth
} from "./chunk-ALIIXQ26.js";
import {
  clip,
  fmt,
  labelEvery,
  linear,
  niceTicks
} from "./chunk-ADA2ZXKE.js";

// react/src/adat/chart/Frame.tsx
import { useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CH = 7;
function Frame({ data, min, max, height = 240, minBand = 24, padRight, label, children, note }) {
  const box = useRef(null);
  const width = useWidth(box);
  const pid = `bcgap${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const n = Math.max(1, data.categories.length);
  const { lo, hi, ticks, decimals } = niceTicks(min, max, height < 160 ? 3 : 5);
  const tickW = Math.max(...ticks.map((t2) => fmt(t2, decimals).length)) * CH + 12;
  const narrow = width < 420;
  const l = Math.max(36, tickW), t = 24, b = 48;
  const r = padRight?.(narrow, width - l - n * minBand) ?? 12;
  const svgW = Math.max(width, l + r + n * minBand);
  const plot = { l, t, w: Math.max(10, svgW - l - r), h: height - t - b };
  const band = plot.w / n;
  const cx = (i) => plot.l + band * (i + 0.5);
  const y = linear(lo, hi, plot.t + plot.h, plot.t);
  const maxChars = Math.max(...data.categories.map((c) => c.length), 1);
  const every = labelEvery(n, plot.w, Math.min(maxChars * CH + 10, 96));
  const fit = Math.max(3, Math.floor((band * every - 6) / CH));
  const scroll = width > 0 && svgW > width + 1;
  return /* @__PURE__ */ jsxs("div", { className: paletteClass(data) ? `bc-chart ${paletteClass(data)}` : "bc-chart", ref: box, children: [
    /* @__PURE__ */ jsx("div", { className: "bc-chart-scroll", ...scroll ? { tabIndex: 0, role: "group", "aria-label": `${label} \u2013 oldalra g\xF6rgethet\u0151` } : {}, children: width > 0 && /* @__PURE__ */ jsxs("svg", { width: svgW, height, viewBox: `0 0 ${svgW} ${height}`, role: "img", "aria-label": `${label}. A pontos sz\xE1mok az adatt\xE1bl\xE1ban.`, children: [
      /* @__PURE__ */ jsx(GapPattern, { id: pid }),
      data.categories.map((_, i) => isGap(data, i) && /* @__PURE__ */ jsx("rect", { className: "bc-gap", x: cx(i) - band / 2, y: plot.t, width: band, height: plot.h, fill: `url(#${pid})` }, `g${i}`)),
      ticks.map((v) => /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("line", { className: "bc-grid", x1: plot.l, x2: plot.l + plot.w, y1: y(v), y2: y(v) }),
        /* @__PURE__ */ jsx("text", { className: "bc-ax-t", x: plot.l - 8, y: y(v), dy: "0.32em", textAnchor: "end", children: fmt(v, decimals) })
      ] }, v)),
      /* @__PURE__ */ jsx("text", { className: "bc-ax-title", x: 4, y: 12, children: data.yLabel ?? data.unit }),
      data.categories.map((c, i) => i % every === 0 && /* @__PURE__ */ jsxs("text", { className: "bc-ax-t", x: cx(i), y: plot.t + plot.h + 18, textAnchor: "middle", children: [
        c.length > fit ? /* @__PURE__ */ jsx("title", { children: c }) : null,
        clip(c, fit)
      ] }, `x${i}`)),
      /* @__PURE__ */ jsx("text", { className: "bc-ax-title", x: plot.l + plot.w / 2, y: height - 6, textAnchor: "middle", children: data.xLabel }),
      children({ plot, band, cx, y, lo, hi, decimals, narrow, padR: r }),
      /* @__PURE__ */ jsx("line", { className: lo < 0 ? "bc-zero is-strong" : "bc-zero", x1: plot.l, x2: plot.l + plot.w, y1: y(0), y2: y(0) })
    ] }) }),
    note && /* @__PURE__ */ jsx("p", { className: "bc-chart-note", children: note })
  ] });
}

export {
  CH,
  Frame
};
