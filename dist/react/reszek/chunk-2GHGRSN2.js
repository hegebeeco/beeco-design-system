/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  fmt
} from "./chunk-Q43BAPJH.js";
import {
  cx
} from "./chunk-FXE4ZZPK.js";

// react/src/adat/chart/HeatLegend.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function HeatLegend({ label, unit, thresholds, min = 1, decimals = 0, className }) {
  const t = thresholds.slice(0, 4);
  const step = decimals ? 10 ** -decimals : 1;
  const bins = [...t.map((hi, i) => `${fmt(i ? t[i - 1] + step : min, decimals)}\u2013${fmt(hi, decimals)}`), `${fmt((t[t.length - 1] ?? min) + step, decimals)}+`];
  return /* @__PURE__ */ jsxs("figure", { className: cx("bc-heatkey", className), children: [
    /* @__PURE__ */ jsxs("figcaption", { className: "bc-heatkey-title", children: [
      label,
      " ",
      /* @__PURE__ */ jsxs("span", { className: "bc-muted", children: [
        "(",
        unit,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "bc-heatkey-bins", children: bins.map((b, i) => /* @__PURE__ */ jsxs("li", { className: `bc-q${i + 1 + (5 - bins.length)}`, children: [
      /* @__PURE__ */ jsx("span", { className: "bc-heatkey-sw", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("span", { children: b })
    ] }, b)) })
  ] });
}

export {
  HeatLegend
};
