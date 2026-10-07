/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  hasGap,
  paletteClass
} from "./chunk-SSRQIQMR.js";
import {
  Swatch
} from "./chunk-4TBP4DV3.js";

// react/src/adat/chart/ChartLegend.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ChartLegend({ data, kind, onToggle }) {
  const gap = hasGap(data);
  if (data.series.length < 2 && !gap && kind === "bar") return null;
  const pal = paletteClass(data);
  return /* @__PURE__ */ jsxs("ul", { className: pal ? `bc-legend ${pal}` : "bc-legend", "aria-label": onToggle ? "Jelmagyar\xE1zat \u2013 a sorozatok ki-be kapcsolhat\xF3k" : "Jelmagyar\xE1zat", children: [
    data.series.map((s, i) => /* @__PURE__ */ jsx("li", { children: onToggle ? /* @__PURE__ */ jsxs("button", { type: "button", className: s.hidden ? "bc-legend-btn is-off" : "bc-legend-btn", "aria-pressed": !s.hidden, onClick: () => onToggle(s.key), children: [
      /* @__PURE__ */ jsx(Swatch, { i, kind }),
      s.label
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Swatch, { i, kind }),
      s.label
    ] }) }, s.key)),
    gap && /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx(Swatch, { i: 0, kind: "gap" }),
      data.gapLabel ?? "nincs adat",
      " \u2013 nem nulla"
    ] })
  ] });
}

export {
  ChartLegend
};
