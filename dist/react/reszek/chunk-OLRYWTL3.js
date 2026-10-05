/* beeco design system 1.42.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  IcCheck,
  IcClose
} from "./chunk-T3UH3VCX.js";
import {
  cx
} from "./chunk-ULBUX4AD.js";

// react/src/media/Stepper.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var STATE_TEXT = { todo: "m\xE9g h\xE1travan", current: "folyamatban", done: "k\xE9sz", error: "hiba" };
function Stepper({ label, steps, onSelect, className }) {
  return /* @__PURE__ */ jsx("ol", { className: cx("bc-steps", className), "aria-label": label, children: steps.map((s, i) => {
    const body = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: s.state === "done" ? /* @__PURE__ */ jsx(IcCheck, {}) : s.state === "error" ? /* @__PURE__ */ jsx(IcClose, {}) : i + 1 }),
      /* @__PURE__ */ jsx("span", { children: s.label }),
      /* @__PURE__ */ jsxs("span", { className: "bc-sr", children: [
        " \u2013 ",
        STATE_TEXT[s.state]
      ] })
    ] });
    const pick = onSelect && s.state !== "current" && (s.reachable ?? (s.state === "done" || s.state === "error"));
    return /* @__PURE__ */ jsx("li", { className: `is-${s.state}`, "aria-current": s.state === "current" ? "step" : void 0, children: pick ? /* @__PURE__ */ jsx("button", { type: "button", className: "bc-steps-btn", onClick: () => onSelect(i, s), children: body }) : body }, s.id);
  }) });
}
function stepsFrom(labels, current, failed = false) {
  return labels.map((l, i) => ({ ...l, state: i < current ? "done" : i === current ? failed ? "error" : "current" : "todo" }));
}
function Progress({ value, max, label, valueText, className }) {
  const pct = max > 0 ? Math.min(100, Math.round(value / max * 100)) : 0;
  return /* @__PURE__ */ jsx("span", { className: cx("bc-upbar", className), role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": pct, "aria-valuetext": valueText ?? `${pct}%`, children: /* @__PURE__ */ jsx("i", { style: { width: `${pct}%` } }) });
}

export {
  Stepper,
  stepsFrom,
  Progress
};
