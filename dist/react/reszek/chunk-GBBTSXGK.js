/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useScrollFade
} from "./chunk-JCGOI4QZ.js";

// react/src/reteg/Tabs.tsx
import * as T from "@radix-ui/react-tabs";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function TabCount({ n }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("span", { className: "bc-sr", children: [
      " (",
      n,
      ")"
    ] }),
    /* @__PURE__ */ jsx("span", { className: "bc-tab-count", "aria-hidden": "true", children: n })
  ] });
}
function Tabs({ items, label, value, defaultValue, onValueChange }) {
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value ?? "");
  const current = value ?? inner;
  const wrap = useScrollFade('[aria-selected="true"]', current);
  return /* @__PURE__ */ jsxs(T.Root, { className: "bc-tabs-root", value: current, onValueChange: (v) => {
    setInner(v);
    onValueChange?.(v);
  }, children: [
    /* @__PURE__ */ jsx("div", { className: "bc-tabs-wrap", ref: wrap, children: /* @__PURE__ */ jsx(T.List, { className: "bc-tabs", "aria-label": label, children: items.map((it) => /* @__PURE__ */ jsxs(T.Trigger, { value: it.value, disabled: it.disabled, className: "bc-tab", title: it.label.length > 28 ? it.label : void 0, children: [
      /* @__PURE__ */ jsx("span", { className: "bc-tab-text", children: it.label }),
      it.count !== void 0 && /* @__PURE__ */ jsx(TabCount, { n: it.count })
    ] }, it.value)) }) }),
    items.map((it) => /* @__PURE__ */ jsx(T.Content, { value: it.value, className: "bc-tab-panel", children: it.content }, it.value))
  ] });
}

export {
  TabCount,
  Tabs
};
