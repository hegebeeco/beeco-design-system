/* beeco design system 1.44.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-DXS6AO6A.js";

// react/src/adat/EmptyState.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function EmptyState({ title, children, action, illustration, compact, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-empty", compact && "is-compact", className), children: [
    illustration && /* @__PURE__ */ jsx("div", { className: "bc-empty-art", "aria-hidden": "true", children: illustration }),
    /* @__PURE__ */ jsx("strong", { children: title }),
    children && /* @__PURE__ */ jsx("p", { className: "bc-empty-text", children }),
    action && /* @__PURE__ */ jsx("div", { className: "bc-row", children: action })
  ] });
}

export {
  EmptyState
};
