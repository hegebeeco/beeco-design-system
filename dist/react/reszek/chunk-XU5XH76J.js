/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  FieldContext
} from "./chunk-M5NUMA6C.js";
import {
  HelpButton
} from "./chunk-EAVMCSD2.js";
import {
  cx
} from "./chunk-PG2ADDWU.js";

// react/src/field/Field.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Field({ label, help, range, count, error, notice, required = false, disabled = false, className, children, labelFor = true }) {
  const id = useId();
  const metaId = `${id}-meta`, errId = `${id}-err`, noteId = `${id}-note`;
  const hasMeta = Boolean(range || count);
  const describedBy = [hasMeta && metaId, error && errId, notice && noteId].filter(Boolean).join(" ") || void 0;
  const ratio = count ? count.value / Math.max(1, count.max) : 0;
  const LabelTag = labelFor ? "label" : "span";
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsxs(LabelTag, { className: "bc-label", ...labelFor ? { htmlFor: id } : { id: `${id}-label` }, children: [
        label,
        required && /* @__PURE__ */ jsx("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
        required && /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " (k\xF6telez\u0151)" })
      ] }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsx(FieldContext.Provider, { value: { id, describedBy, invalid: Boolean(error), required, disabled }, children }),
    hasMeta && /* @__PURE__ */ jsxs("div", { className: "bc-meta", id: metaId, children: [
      range && /* @__PURE__ */ jsx("span", { children: range }),
      count && /* @__PURE__ */ jsxs("span", { className: cx("bc-count", ratio >= 1 ? "is-full" : ratio >= 0.9 && "is-near"), children: [
        count.value,
        "/",
        count.max,
        count.unit ? ` ${count.unit}` : "",
        ratio >= 1 && /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " \u2013 el\xE9rted a hat\xE1rt" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "bc-error", id: errId, role: "alert", children: error }),
    notice && !error && /* @__PURE__ */ jsx("p", { className: "bc-notice", id: noteId, role: "status", children: notice })
  ] });
}

export {
  Field
};
