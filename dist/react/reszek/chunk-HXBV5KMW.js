/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  fmt
} from "./chunk-4B2TW2CC.js";

// react/src/adat/chart/ChartTable.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function ChartTable({ data, caption }) {
  const gap = data.gapLabel ?? "nincs adat";
  return /* @__PURE__ */ jsx("div", { className: "bc-table-wrap bc-chart-table", tabIndex: 0, role: "region", "aria-label": `${caption} \u2013 adatt\xE1bla`, children: /* @__PURE__ */ jsxs("table", { className: "bc-table is-dense", children: [
    /* @__PURE__ */ jsxs("caption", { className: "bc-sr", children: [
      caption,
      " \u2013 adatt\xE1bla"
    ] }),
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { scope: "col", children: data.xLabel }),
      data.series.map((s) => /* @__PURE__ */ jsxs("th", { scope: "col", className: "is-num", children: [
        s.label,
        " (",
        data.unit,
        ")"
      ] }, s.key))
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: data.categories.map((c, i) => /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { scope: "row", children: c }),
      data.series.map((s) => {
        const v = s.values[i];
        return /* @__PURE__ */ jsx("td", { className: "is-num", children: typeof v === "number" ? fmt(v, data.decimals ?? 2) : /* @__PURE__ */ jsx("span", { className: "bc-muted", children: gap }) }, s.key);
      })
    ] }, `${c}${i}`)) })
  ] }) });
}

export {
  ChartTable
};
