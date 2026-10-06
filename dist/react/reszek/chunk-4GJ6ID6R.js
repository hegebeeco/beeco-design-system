/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  HelpButton
} from "./chunk-NX4AZ7H3.js";
import {
  cx
} from "./chunk-4HTA5F62.js";

// react/src/inputs/Choice.tsx
import { forwardRef, useEffect, useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Checkbox = forwardRef(function Checkbox2({ label, help, error, className, ...rest }, ref) {
  const id = useId();
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsxs("label", { className: "bc-check", htmlFor: id, children: [
        /* @__PURE__ */ jsx("input", { ref, id, type: "checkbox", "aria-invalid": error ? true : void 0, "aria-describedby": error ? `${id}-err` : void 0, ...rest }),
        label
      ] }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error })
  ] });
});
var CheckboxInput = forwardRef(function CheckboxInput2({ className, indeterminate, ...rest }, ref) {
  const sajat = useRef(null);
  useEffect(() => {
    if (sajat.current) sajat.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return /* @__PURE__ */ jsx("input", { ref: (el) => {
    sajat.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, type: "checkbox", className: cx("bc-checkbox", className), ...rest });
});
function RadioGroup({ label, help, error, className, name, options, value, onChange, required, disabled }) {
  const id = useId();
  return /* @__PURE__ */ jsxs(
    "fieldset",
    {
      className: cx("bc-field", "bc-fieldset", className),
      "aria-describedby": error ? `${id}-err` : void 0,
      "aria-invalid": error ? true : void 0,
      disabled,
      children: [
        /* @__PURE__ */ jsxs("legend", { className: "bc-label-row", children: [
          /* @__PURE__ */ jsxs("span", { className: "bc-label", children: [
            label,
            required && /* @__PURE__ */ jsx("span", { className: "is-req", "aria-hidden": "true", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(HelpButton, { label, children: help })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bc-row", children: options.map((o) => /* @__PURE__ */ jsxs("label", { className: "bc-check", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name,
              value: o.value,
              disabled: o.disabled,
              required,
              checked: value === void 0 ? void 0 : value === o.value,
              onChange: () => onChange?.(o.value)
            }
          ),
          o.label
        ] }, o.value)) }),
        error && /* @__PURE__ */ jsx("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error })
      ]
    }
  );
}
function Switch({ label, help, error, className, checked, onChange, disabled }) {
  const id = useId();
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-label-row", style: { gap: "var(--bc-sp-2)" }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          id,
          type: "button",
          role: "switch",
          "aria-checked": checked,
          className: "bc-switch",
          disabled,
          "aria-labelledby": `${id}-l`,
          onClick: () => onChange(!checked)
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "bc-label", id: `${id}-l`, children: label }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "bc-error", role: "alert", children: error })
  ] });
}
var SwitchInput = forwardRef(function SwitchInput2({ checked, onChange, size = "md", onText, offText, busy, disabled, className, onClick, ...rest }, ref) {
  const btn = /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      type: "button",
      role: "switch",
      "aria-checked": checked,
      className: cx("bc-switch", size === "sm" && "is-sm", !(onText || offText) && className),
      disabled: disabled || busy,
      "aria-busy": busy || void 0,
      onClick: (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onChange(!checked);
      },
      ...rest
    }
  );
  if (!onText && !offText) return btn;
  return /* @__PURE__ */ jsxs("span", { className: cx("bc-switch-inline", size === "sm" && "is-sm", className), children: [
    btn,
    /* @__PURE__ */ jsx("span", { className: "bc-switch-state", "aria-hidden": "true", children: checked ? onText : offText })
  ] });
});

export {
  Checkbox,
  CheckboxInput,
  RadioGroup,
  Switch,
  SwitchInput
};
