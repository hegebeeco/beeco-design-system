/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  isBlank,
  showValue
} from "./chunk-65VEHGK7.js";
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/kieg/MergeField.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function MergeFieldChoice({ field, records, chosen, onChoose, error }) {
  const name = useId();
  const show = field.format ?? showValue;
  return /* @__PURE__ */ jsxs(
    "fieldset",
    {
      className: "bc-merge-field",
      "data-field": field.key,
      "data-decided": chosen ? true : void 0,
      "aria-invalid": error ? true : void 0,
      "aria-describedby": error ? `${name}-err` : void 0,
      children: [
        /* @__PURE__ */ jsxs("legend", { className: "bc-merge-legend", children: [
          field.label,
          field.required && /* @__PURE__ */ jsx("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
          /* @__PURE__ */ jsx("span", { className: "bc-badge is-warning", children: "elt\xE9r" }),
          !chosen && /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " \u2013 m\xE9g nem v\xE1lasztott\xE1l" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bc-merge-opts", children: records.map((r) => {
          const v = r.values[field.key];
          const blank = isBlank(v);
          return /* @__PURE__ */ jsxs("label", { className: cx("bc-merge-opt", chosen === r.id && "is-on", blank && "is-blank"), children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name, value: r.id, checked: chosen === r.id, onChange: () => onChoose(r.id) }),
            /* @__PURE__ */ jsx("span", { className: "bc-merge-src", children: r.label }),
            /* @__PURE__ */ jsx("span", { className: "bc-merge-val", children: blank ? "(\xFCres)" : show(v) })
          ] }, r.id);
        }) }),
        error && /* @__PURE__ */ jsx("p", { className: "bc-error", id: `${name}-err`, role: "alert", children: error })
      ]
    }
  );
}

export {
  MergeFieldChoice
};
