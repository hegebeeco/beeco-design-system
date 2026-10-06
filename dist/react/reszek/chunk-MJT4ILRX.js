/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-PG2ADDWU.js";

// react/src/inputs/SegmentedControl.tsx
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SegmentedControl({ label, value, onChange, items, wrap = false, className }) {
  const root = useRef(null);
  const onKey = (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const enabled = items.filter((i) => !i.disabled);
    const at = enabled.findIndex((i) => i.value === value);
    const next = enabled[(at + dir + enabled.length) % enabled.length];
    onChange(next.value);
    root.current?.querySelector(`[data-value="${next.value}"]`)?.focus();
  };
  return /* @__PURE__ */ jsx("div", { ref: root, role: "radiogroup", "aria-label": label, className: cx("bc-seg", wrap && "is-wrap", className), onKeyDown: onKey, children: items.map((it) => {
    const on = it.value === value;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": on,
        "data-state": on ? "on" : "off",
        "data-value": it.value,
        tabIndex: on ? 0 : -1,
        disabled: it.disabled,
        className: "bc-seg-item",
        onClick: () => onChange(it.value),
        children: [
          it.icon && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: it.icon }),
          it.label
        ]
      },
      it.value
    );
  }) });
}

export {
  SegmentedControl
};
