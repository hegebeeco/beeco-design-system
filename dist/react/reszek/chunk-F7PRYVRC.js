/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-4C25CCAY.js";

// react/src/form/FormSection.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function FormSection({ title, description, children, className }) {
  return /* @__PURE__ */ jsxs("section", { className: cx("bc-card", className), "aria-label": title, children: [
    /* @__PURE__ */ jsx("h2", { className: "bc-card-title", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "bc-muted", style: { marginTop: "calc(-1 * var(--bc-sp-2))" }, children: description }),
    /* @__PURE__ */ jsx("div", { className: "bc-form-grid", children })
  ] });
}
function FormActions({ children, className }) {
  return /* @__PURE__ */ jsx("div", { className: cx("bc-form-actions", className), children });
}

export {
  FormSection,
  FormActions
};
