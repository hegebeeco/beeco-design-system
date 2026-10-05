/* beeco design system 1.44.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  defaultLink
} from "./chunk-ZUIHNJF5.js";

// react/src/reteg/SectionSwitch.tsx
import { Fragment } from "react";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
function SectionSwitch({ items, label, renderLink = defaultLink, className }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": label, className: ["bc-secsw-wrap", className].filter(Boolean).join(" "), children: /* @__PURE__ */ jsx("div", { className: "bc-secsw", style: { ["--bc-secsw-n"]: items.length }, children: items.map((it) => /* @__PURE__ */ jsx(Fragment, { children: renderLink({
    href: it.href,
    className: "bc-secsw-item",
    "aria-current": it.current ? "page" : void 0,
    children: /* @__PURE__ */ jsxs(Fragment2, { children: [
      it.icon && /* @__PURE__ */ jsx("span", { className: "bc-secsw-ic", "aria-hidden": "true", children: it.icon }),
      /* @__PURE__ */ jsx("span", { children: it.label })
    ] })
  }) }, it.href)) }) });
}

export {
  SectionSwitch
};
