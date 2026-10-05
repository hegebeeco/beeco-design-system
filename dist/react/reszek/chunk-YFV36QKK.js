/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  TabCount
} from "./chunk-MKWQR6CW.js";
import {
  useScrollFade
} from "./chunk-NB34FBOJ.js";

// react/src/reteg/NavTabs.tsx
import { Fragment } from "react";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
var defaultLink = ({ href, ...p }) => /* @__PURE__ */ jsx("a", { href, ...p });
function NavTabs({ items, label, renderLink = defaultLink }) {
  const cur = items.findIndex((i) => i.current);
  const wrap = useScrollFade('[aria-current="page"]', cur);
  return /* @__PURE__ */ jsx("nav", { "aria-label": label, children: /* @__PURE__ */ jsx("div", { className: "bc-tabs-wrap", ref: wrap, children: /* @__PURE__ */ jsx("div", { className: "bc-tabs", children: items.map((it) => /* @__PURE__ */ jsx(Fragment, { children: renderLink({
    href: it.href,
    className: "bc-tab",
    "aria-current": it.current ? "page" : void 0,
    children: /* @__PURE__ */ jsxs(Fragment2, { children: [
      /* @__PURE__ */ jsx("span", { className: "bc-tab-text", title: it.label.length > 28 ? it.label : void 0, children: it.label }),
      it.count !== void 0 && /* @__PURE__ */ jsx(TabCount, { n: it.count })
    ] })
  }) }, it.href)) }) }) });
}

export {
  defaultLink,
  NavTabs
};
