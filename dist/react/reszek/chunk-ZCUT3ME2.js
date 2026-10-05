/* beeco design system 1.44.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  mergeRefs
} from "./chunk-O2E34EOS.js";

// react/src/inputs/SearchBox.tsx
import { forwardRef, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SearchBox = forwardRef(function SearchBox2({ label, value, onChange, debounce = 250, onSearch, placeholder, className, ...rest }, ref) {
  const [inner, setInner] = useState(value ?? "");
  const v = value ?? inner;
  const timer = useRef(void 0);
  const local = useRef(null);
  const set = (next) => {
    if (value === void 0) setInner(next);
    onChange?.(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(next.trim()), debounce);
  };
  return /* @__PURE__ */ jsxs("div", { className: ["bc-search", className].filter(Boolean).join(" "), role: "search", "aria-label": label, children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
      /* @__PURE__ */ jsx("path", { d: "M20 20l-4-4" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: mergeRefs(ref, local),
        type: "search",
        className: "bc-input",
        "aria-label": label,
        placeholder: placeholder ?? label,
        value: v,
        onChange: (e) => set(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape" && v) {
            e.preventDefault();
            set("");
          }
        },
        ...rest
      }
    ),
    v && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", "aria-label": "Keres\xE9s t\xF6rl\xE9se", onClick: () => {
      set("");
      local.current?.focus();
    }, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
  ] });
});

export {
  SearchBox
};
