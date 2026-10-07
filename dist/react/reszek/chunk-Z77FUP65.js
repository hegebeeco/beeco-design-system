/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  defaultLink
} from "./chunk-2TPYLK2Y.js";
import {
  SegmentedControl
} from "./chunk-6UTOY3WE.js";
import {
  DataState
} from "./chunk-FDP27ZEF.js";
import {
  EmptyState
} from "./chunk-NILXBJHT.js";
import {
  cx
} from "./chunk-42HXLUBI.js";

// react/src/media/MapPanel.tsx
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MapPanel({ label, legend, note, toolbar, status = "ready", what = "a t\xE9rk\xE9pet", error, onRetry, empty, list, listLabel = "Lista", view, onViewChange, height = "min(420px, 60vh)", renderLink = defaultLink, className, children }) {
  const [sajat, setSajat] = useState("map");
  const nezet = view ?? sajat;
  const valt = (v) => {
    setSajat(v);
    onViewChange?.(v);
  };
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-map-panel", className), children: [
    (list || toolbar) && /* @__PURE__ */ jsxs("div", { className: "bc-row bc-map-panel-bar", children: [
      list && /* @__PURE__ */ jsx(SegmentedControl, { label: "N\xE9zet", value: nezet, onChange: valt, items: [{ value: "map", label: "T\xE9rk\xE9p" }, { value: "list", label: `${listLabel} (${list.length})` }] }),
      toolbar
    ] }),
    /* @__PURE__ */ jsx(DataState, { status, what, error, onRetry, children: empty ? /* @__PURE__ */ jsx(EmptyState, { title: empty.title, children: empty.text }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      legend && nezet === "map" && /* @__PURE__ */ jsx("div", { className: "bc-map-panel-legend", children: legend }),
      nezet === "map" || !list ? /* @__PURE__ */ jsx("div", { className: "bc-map bc-map-panel-map", role: "region", "aria-label": label, style: { minHeight: height }, children }) : /* @__PURE__ */ jsx("ul", { className: "bc-divided bc-map-panel-list", "aria-label": `${label} \u2013 lista`, children: list.map((it) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs("span", { className: "bc-map-panel-item", children: [
          it.href ? renderLink({ href: it.href, children: /* @__PURE__ */ jsx("strong", { children: it.title }) }) : /* @__PURE__ */ jsx("strong", { children: it.title }),
          it.badge
        ] }),
        it.detail && /* @__PURE__ */ jsx("span", { className: "bc-muted", children: it.detail })
      ] }, it.id)) }),
      note && /* @__PURE__ */ jsx("p", { className: "bc-muted bc-map-panel-note", children: note })
    ] }) })
  ] });
}

export {
  MapPanel
};
