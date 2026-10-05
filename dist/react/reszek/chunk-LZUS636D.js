/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  OPS
} from "./chunk-CD3OUZAR.js";
import {
  CloseIcon
} from "./chunk-OSQ3VUVK.js";
import {
  NumberField
} from "./chunk-O4HQ2RG6.js";
import {
  SelectField
} from "./chunk-N3SK2ZOY.js";
import {
  TextField
} from "./chunk-BESCJQZ2.js";
import {
  IconButton
} from "./chunk-72KPVFLL.js";

// react/src/kieg/AudienceRule.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function AudienceRuleRow({ rule, n, fields, onChange, onRemove, onBlur, error, disabled }) {
  const f = fields.find((x) => x.key === rule.field);
  const ops = f ? OPS[f.type] : [];
  const valueLabel = f ? `${f.label} \u2013 \xE9rt\xE9k` : "\xC9rt\xE9k";
  return /* @__PURE__ */ jsxs("li", { className: "bc-aud-rule", "data-rule": rule.id, "data-invalid": error ? true : void 0, onBlur, "aria-label": `${n}. felt\xE9tel`, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-aud-grid", children: [
      /* @__PURE__ */ jsx(
        SelectField,
        {
          label: "Mire sz\u0171r",
          help: "Melyik felhaszn\xE1l\xF3i adat alapj\xE1n v\xE1logatunk. Csak olyan adat v\xE1laszthat\xF3, amit az app val\xF3ban t\xE1rol.",
          placeholder: "V\xE1lassz\u2026",
          value: rule.field,
          disabled,
          options: fields.map((x) => ({ value: x.key, label: x.label })),
          onChange: (e) => {
            const nf = fields.find((x) => x.key === e.target.value);
            onChange({ ...rule, field: e.target.value, op: nf ? OPS[nf.type][0].value : "eq", value: null });
          }
        }
      ),
      /* @__PURE__ */ jsx(
        SelectField,
        {
          label: "Felt\xE9tel",
          help: "Hogyan vess\xFCk \xF6ssze a felhaszn\xE1l\xF3 adat\xE1t az \xE9rt\xE9kkel: egyezzen, legyen legal\xE1bb, legfeljebb, vagy tartalmazza.",
          value: f ? rule.op : "",
          disabled: disabled || !f,
          placeholder: f ? void 0 : "El\u0151bb a mez\u0151t",
          options: ops.map((o) => ({ value: o.value, label: o.label })),
          onChange: (e) => onChange({ ...rule, op: e.target.value })
        }
      ),
      !f || f.type === "select" ? /* @__PURE__ */ jsx(
        SelectField,
        {
          label: valueLabel,
          help: f?.help ?? "El\u0151bb v\xE1laszd ki, mire sz\u0171rj\xF6n a felt\xE9tel.",
          placeholder: "V\xE1lassz\u2026",
          disabled: disabled || !f,
          value: typeof rule.value === "string" ? rule.value : "",
          options: f?.options ?? [],
          onChange: (e) => onChange({ ...rule, value: e.target.value || null })
        }
      ) : f.type === "number" ? /* @__PURE__ */ jsx(
        NumberField,
        {
          label: valueLabel,
          help: f.help,
          min: f.min,
          max: f.max,
          unit: f.unit,
          decimals: f.decimals,
          disabled,
          value: typeof rule.value === "number" ? rule.value : null,
          onChange: (v) => onChange({ ...rule, value: v })
        }
      ) : /* @__PURE__ */ jsx(
        TextField,
        {
          label: valueLabel,
          help: f.help,
          maxLength: f.maxLength ?? 60,
          disabled,
          value: typeof rule.value === "string" ? rule.value : "",
          onChange: (e) => onChange({ ...rule, value: e.target.value })
        }
      ),
      !disabled && /* @__PURE__ */ jsx(IconButton, { className: "bc-aud-remove", "aria-label": `${n}. felt\xE9tel t\xF6rl\xE9se`, danger: true, onClick: onRemove, children: /* @__PURE__ */ jsx(CloseIcon, {}) })
    ] }),
    error && /* @__PURE__ */ jsxs("p", { className: "bc-error", role: "alert", children: [
      n,
      ". felt\xE9tel: ",
      error
    ] })
  ] });
}

export {
  AudienceRuleRow
};
