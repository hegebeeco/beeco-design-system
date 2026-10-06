/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Combobox
} from "./chunk-7HDENUFJ.js";
import {
  HelpButton
} from "./chunk-NR2TJ35U.js";
import {
  Button
} from "./chunk-EYUU5TDK.js";

// react/src/adat/FilterControls.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var MULTI_HELP = "T\xF6bb is v\xE1laszthat\xF3. Ha egyet sem v\xE1lasztasz, mindegyik l\xE1tszik.";
function FilterControl({ def, value, onChange }) {
  const id = useId();
  if (def.multiple)
    return /* @__PURE__ */ jsx(
      Combobox,
      {
        className: "bc-filter is-multi",
        label: def.label,
        help: def.help ?? MULTI_HELP,
        options: def.options,
        multiple: true,
        value: Array.isArray(value) ? value : [],
        onChange: (v) => onChange(v.length ? v : null),
        loading: def.loading,
        loadError: def.loadError,
        onRetry: def.onRetry,
        maxChips: 2,
        placeholder: "mindegy"
      }
    );
  return /* @__PURE__ */ jsxs("div", { className: "bc-filter", children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsx("label", { className: "bc-label", htmlFor: id, children: def.label }),
      def.help && /* @__PURE__ */ jsx(HelpButton, { label: def.label, children: def.help })
    ] }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id,
        className: "bc-select",
        value: typeof value === "string" ? value : "",
        disabled: def.loading || Boolean(def.loadError),
        "aria-describedby": def.loadError ? `${id}-err` : void 0,
        onChange: (e) => onChange(e.target.value || null),
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: def.loading ? "Bet\xF6lt\xE9s\u2026" : def.anyLabel ?? "mindegy" }),
          def.options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
        ]
      }
    ),
    def.loadError && /* @__PURE__ */ jsxs("div", { className: "bc-filter-err", children: [
      /* @__PURE__ */ jsx("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: def.loadError }),
      def.onRetry && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: def.onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
    ] })
  ] });
}
function FilterChip({ text, onRemove }) {
  return /* @__PURE__ */ jsxs("li", { className: "bc-chip bc-fb-chip", children: [
    /* @__PURE__ */ jsx("span", { title: text, children: text }),
    /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Sz\u0171r\u0151 t\xF6rl\xE9se: ${text}`, onClick: onRemove, children: "\xD7" })
  ] });
}
function chipText(def, value) {
  const vals = Array.isArray(value) ? value : value ? [value] : [];
  if (!vals.length) return null;
  const first = def.options.find((o) => o.value === vals[0])?.label ?? vals[0];
  return `${def.label}: ${first}${vals.length > 1 ? ` +${vals.length - 1}` : ""}`;
}

export {
  FilterControl,
  FilterChip,
  chipText
};
