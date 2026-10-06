/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  dismiss,
  getToasts,
  pauseToasts,
  subscribe
} from "./chunk-GHIS3MU2.js";
import {
  cx
} from "./chunk-4HTA5F62.js";

// react/src/reteg/Toaster.tsx
import { useState, useSyncExternalStore } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var MAX_VISIBLE = 3;
var LONG = 140;
var CLASS = { success: "is-success", error: "is-danger", info: "is-info", warning: "is-warning" };
var WORD = { success: "K\xE9sz", error: "Hiba", info: "T\xE1j\xE9koztat\xE1s", warning: "Figyelem" };
var ICON = {
  success: "M5 12.5l4.5 4.5L19 7.5",
  error: "M12 7v6M12 16.5v.5",
  info: "M12 11v6M12 7.5v.5",
  warning: "M12 8v5M12 16.5v.5"
};
function Toaster({ label = "\xC9rtes\xEDt\xE9sek" }) {
  const list = useSyncExternalStore(subscribe, getToasts, getToasts);
  const live = list.filter((t) => !t.leaving);
  const errs = live.filter((t) => t.kind === "error").slice(-MAX_VISIBLE);
  const rest = live.filter((t) => t.kind !== "error").slice(-(MAX_VISIBLE - errs.length) || live.length);
  const shown = /* @__PURE__ */ new Set([...errs, ...errs.length < MAX_VISIBLE ? rest : []]);
  const visible = list.filter((t) => t.leaving || shown.has(t));
  const hidden = live.length - shown.size;
  const blur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) pauseToasts(false);
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "bc-toaster",
      "aria-label": label,
      onMouseEnter: () => pauseToasts(true),
      onMouseLeave: () => pauseToasts(false),
      onFocus: () => pauseToasts(true),
      onBlur: blur,
      children: [
        /* @__PURE__ */ jsx("div", { className: "bc-toast-list", role: "alert", "aria-live": "assertive", children: visible.filter((t) => t.kind === "error").map((t) => /* @__PURE__ */ jsx(ToastView, { t }, t.id)) }),
        /* @__PURE__ */ jsx("div", { className: "bc-toast-list", role: "status", "aria-live": "polite", children: visible.filter((t) => t.kind !== "error").map((t) => /* @__PURE__ */ jsx(ToastView, { t }, t.id)) }),
        hidden > 0 && /* @__PURE__ */ jsxs("div", { className: "bc-toast-more", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "+",
            hidden,
            " tov\xE1bbi \xE9rtes\xEDt\xE9s"
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "bc-toast-link", onClick: () => dismiss(), children: "Mind bez\xE1r\xE1sa" })
        ] })
      ]
    }
  );
}
function ToastView({ t }) {
  const [open, setOpen] = useState(false);
  const long = t.message.length > LONG;
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-toast", CLASS[t.kind]), "data-leaving": t.leaving || void 0, children: [
    /* @__PURE__ */ jsxs("svg", { className: "bc-toast-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("path", { d: ICON[t.kind] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-toast-body", children: [
      /* @__PURE__ */ jsxs("p", { className: cx(long && !open && "is-clamped"), children: [
        /* @__PURE__ */ jsxs("span", { className: "bc-sr", children: [
          WORD[t.kind],
          ": "
        ] }),
        t.message,
        t.count > 1 && /* @__PURE__ */ jsxs("span", { className: "bc-toast-count", "aria-label": `${t.count}-szor`, children: [
          " \xD7",
          t.count
        ] })
      ] }),
      (long || t.action) && /* @__PURE__ */ jsxs("div", { className: "bc-toast-actions", children: [
        t.action && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-toast-action", onClick: () => {
          t.action?.onClick();
          dismiss(t.id);
        }, children: t.action.label }),
        long && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-toast-link", "aria-expanded": open, onClick: () => setOpen(!open), children: open ? "Kevesebb" : "R\xE9szletek" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "button", className: "bc-toast-close", "aria-label": "\xC9rtes\xEDt\xE9s bez\xE1r\xE1sa", onClick: () => dismiss(t.id), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M7 7l10 10M17 7L7 17" }) }) })
  ] });
}

export {
  Toaster
};
