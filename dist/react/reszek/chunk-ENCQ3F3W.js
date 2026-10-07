/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-PFNFGQD5.js";

// react/src/adat/StatusBadge.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var S = { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var IKON = {
  success: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M5 12.5l4.5 4.5L19 7" }) }),
  warning: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "8.5" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7.5V12l3 2" })
  ] }),
  danger: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 4l9 16H3z" }),
    /* @__PURE__ */ jsx("path", { d: "M12 10v4M12 17.2v.3" })
  ] }),
  info: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "8.5" }),
    /* @__PURE__ */ jsx("path", { d: "M12 11v5M12 7.8v.3" })
  ] }),
  muted: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3.5" }) }),
  accent: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" }) })
};
function StatusBadge({ tone, children, icon, title, className }) {
  const ikon = icon === void 0 ? IKON[tone] : icon;
  return /* @__PURE__ */ jsxs("span", { className: cx("bc-badge bc-status", `is-${tone}`, className), title, children: [
    ikon,
    /* @__PURE__ */ jsx("span", { children })
  ] });
}

export {
  StatusBadge
};
