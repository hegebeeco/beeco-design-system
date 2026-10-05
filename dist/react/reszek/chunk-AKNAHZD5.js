/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  defaultLink
} from "./chunk-RHBBANMV.js";
import {
  cx
} from "./chunk-BVA4MWWR.js";

// react/src/reteg/Breadcrumbs.tsx
import { useState } from "react";
import { jsx } from "react/jsx-runtime";
function Breadcrumbs({ items, renderLink = defaultLink, maxVisible = 4, label = "Hol vagy" }) {
  const [expanded, setExpanded] = useState(false);
  const n = items.length;
  const collapse = !expanded && n > maxVisible;
  const shown = collapse ? [0, -1, n - 2, n - 1] : items.map((_, i) => i);
  return /* @__PURE__ */ jsx("nav", { className: "bc-crumbs", "aria-label": label, children: /* @__PURE__ */ jsx("ol", { children: shown.map((i) => {
    if (i === -1) {
      return /* @__PURE__ */ jsx("li", { className: "bc-crumb", children: /* @__PURE__ */ jsx("button", { type: "button", className: "bc-crumb-more", "aria-label": `Tov\xE1bbi ${n - 3} szint mutat\xE1sa`, onClick: () => setExpanded(true), children: "\u2026" }) }, "more");
    }
    const c = items[i];
    const last = i === n - 1;
    return /* @__PURE__ */ jsx("li", { className: cx("bc-crumb", i === n - 2 && "is-parent", last && "is-current"), children: last ? /* @__PURE__ */ jsx("span", { "aria-current": "page", title: c.label, children: c.label }) : c.href ? renderLink({ href: c.href, children: /* @__PURE__ */ jsx("span", { title: c.label, children: c.label }) }) : /* @__PURE__ */ jsx("span", { title: c.label, children: c.label }) }, i);
  }) }) });
}

export {
  Breadcrumbs
};
