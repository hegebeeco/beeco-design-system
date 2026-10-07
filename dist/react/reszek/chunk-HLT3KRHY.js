/* beeco design system 1.50.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  HelpButton
} from "./chunk-XAUW6NUN.js";
import {
  cx
} from "./chunk-5NOEXS6K.js";

// react/src/media/MapLegend.tsx
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var wide = () => typeof window !== "undefined" && window.matchMedia("(min-width: 600px)").matches;
function MapLegend({ items, title = "Jelmagyar\xE1zat", collapsible = true, defaultOpen, className }) {
  const [open] = useState(() => defaultOpen ?? wide());
  const list = /* @__PURE__ */ jsx("ul", { className: "bc-map-legend-list", children: items.map((i) => /* @__PURE__ */ jsxs("li", { children: [
    /* @__PURE__ */ jsx("span", { className: `bc-map-swatch is-${i.kind}`, "aria-hidden": "true", children: i.letter }),
    i.label
  ] }, i.label)) });
  if (!collapsible) return /* @__PURE__ */ jsxs("div", { className: cx("bc-map-legend", className), role: "group", "aria-label": title, children: [
    /* @__PURE__ */ jsx("strong", { children: title }),
    list
  ] });
  return /* @__PURE__ */ jsxs("details", { className: cx("bc-map-legend", className), open, children: [
    /* @__PURE__ */ jsx("summary", { children: title }),
    list
  ] });
}
function HeatScale({ title, unit, help, ends = ["kev\xE9s", "sok"], steps, howToRead, colorblind, className }) {
  return /* @__PURE__ */ jsxs("figure", { className: cx("bc-heat", colorblind && "is-cb", className), "aria-label": `${title}, ${unit}`, children: [
    /* @__PURE__ */ jsxs("figcaption", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-label", children: title }),
      /* @__PURE__ */ jsx(HelpButton, { label: title, children: help })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "bc-heat-unit", children: unit }),
    /* @__PURE__ */ jsx("div", { className: "bc-heat-bar", "aria-hidden": "true", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("i", {}, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "bc-heat-ends", children: [
      /* @__PURE__ */ jsx("span", { children: ends[0] }),
      /* @__PURE__ */ jsx("span", { children: ends[1] })
    ] }),
    steps && /* @__PURE__ */ jsxs("table", { className: "bc-heat-steps", children: [
      /* @__PURE__ */ jsxs("caption", { className: "bc-sr", children: [
        title,
        " \u2013 fokozatok (",
        unit,
        ")"
      ] }),
      /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsx("tr", { children: steps.map((s, i) => /* @__PURE__ */ jsxs("td", { children: [
        /* @__PURE__ */ jsx("i", { className: `bc-heat-sw is-${i + 1}`, "aria-hidden": "true" }),
        s
      ] }, i)) }) })
    ] }),
    howToRead && /* @__PURE__ */ jsxs("details", { className: "bc-heat-how", children: [
      /* @__PURE__ */ jsx("summary", { children: "Hogyan olvasd?" }),
      /* @__PURE__ */ jsx("div", { children: howToRead })
    ] })
  ] });
}

export {
  MapLegend,
  HeatScale
};
