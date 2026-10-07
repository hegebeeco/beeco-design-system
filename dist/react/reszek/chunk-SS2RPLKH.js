/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  fmt,
  pageList
} from "./chunk-4B2TW2CC.js";
import {
  IconButton
} from "./chunk-ERIU5VPQ.js";
import {
  cx
} from "./chunk-PFNFGQD5.js";

// react/src/adat/Pagination.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Chevron = ({ dir, vegig }) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: dir === "l" ? vegig ? "M17 6l-6 6 6 6" : "M15 6l-6 6 6 6" : vegig ? "M7 6l6 6-6 6" : "M9 6l6 6-6 6" }),
  vegig && /* @__PURE__ */ jsx("path", { d: dir === "l" ? "M7 5v14" : "M17 5v14" })
] });
function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizes = [10, 25, 100], itemLabel = "elem", label = "Lapoz\xE1s", className }) {
  const sizeId = useId();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(page, pages - 1);
  const from = total ? p * pageSize + 1 : 0;
  const to = Math.min(total, (p + 1) * pageSize);
  return /* @__PURE__ */ jsxs("nav", { className: cx("bc-pager", "bc-pagination", className), "aria-label": label, children: [
    /* @__PURE__ */ jsx("p", { className: "bc-pager-info", "aria-live": "polite", children: total ? `${fmt(from)}\u2013${fmt(to)} / ${fmt(total)} ${itemLabel} \xB7 ${fmt(p + 1)}. oldal / ${fmt(pages)}` : `0 ${itemLabel}` }),
    pages > 1 && /* @__PURE__ */ jsxs("ul", { className: "bc-pager-pages", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(IconButton, { "aria-label": "Els\u0151 lap", disabled: p === 0, onClick: () => onPageChange(0), children: /* @__PURE__ */ jsx(Chevron, { dir: "l", vegig: true }) }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(IconButton, { "aria-label": "El\u0151z\u0151 lap", disabled: p === 0, onClick: () => onPageChange(p - 1), children: /* @__PURE__ */ jsx(Chevron, { dir: "l" }) }) }),
      pageList(p, pages).map((n, i) => n === null ? /* @__PURE__ */ jsx("li", { className: "bc-pager-gap", "aria-hidden": "true", children: "\u2026" }, `gap${i}`) : /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "bc-pager-num",
          "aria-current": n === p ? "page" : void 0,
          "aria-label": `${n + 1}. lap`,
          onClick: () => onPageChange(n),
          children: n + 1
        }
      ) }, n)),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(IconButton, { "aria-label": "K\xF6vetkez\u0151 lap", disabled: p >= pages - 1, onClick: () => onPageChange(p + 1), children: /* @__PURE__ */ jsx(Chevron, { dir: "r" }) }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(IconButton, { "aria-label": "Utols\xF3 lap", disabled: p >= pages - 1, onClick: () => onPageChange(pages - 1), children: /* @__PURE__ */ jsx(Chevron, { dir: "r", vegig: true }) }) })
    ] }),
    onPageSizeChange && /* @__PURE__ */ jsxs("div", { className: "bc-pager-size", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: sizeId, children: "Sor / oldal" }),
      /* @__PURE__ */ jsx("select", { id: sizeId, className: "bc-select", value: pageSize, onChange: (e) => onPageSizeChange(Number(e.target.value)), children: pageSizes.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) })
    ] })
  ] });
}

export {
  Pagination
};
