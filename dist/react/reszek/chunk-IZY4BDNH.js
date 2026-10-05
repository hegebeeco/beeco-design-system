/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-BVA4MWWR.js";

// react/src/adat/InfoCard.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var ures = (v) => v === null || v === void 0 || v === "" || Array.isArray(v) && v.length === 0;
function InfoCard({ title, rows, emptyText = "nincs megadva", footer, className }) {
  return /* @__PURE__ */ jsxs("section", { className: cx("bc-card bc-info", className), "aria-label": title, children: [
    title && /* @__PURE__ */ jsx("h3", { className: "bc-card-title", children: title }),
    /* @__PURE__ */ jsx("dl", { children: rows.map((r) => {
      const { label, value, wide } = Array.isArray(r) ? { label: r[0], value: r[1], wide: false } : r;
      return /* @__PURE__ */ jsxs("div", { className: wide ? "is-wide" : void 0, children: [
        /* @__PURE__ */ jsx("dt", { children: label }),
        /* @__PURE__ */ jsx("dd", { children: ures(value) ? /* @__PURE__ */ jsx("span", { className: "bc-muted", children: emptyText }) : value })
      ] }, label);
    }) }),
    footer && /* @__PURE__ */ jsx("div", { className: "bc-info-foot", children: footer })
  ] });
}
function InfoGrid({ children, className }) {
  return /* @__PURE__ */ jsx("div", { className: cx("bc-info-grid", className), children });
}

export {
  InfoCard,
  InfoGrid
};
