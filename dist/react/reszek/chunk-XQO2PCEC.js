/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  FieldInput
} from "./chunk-R3M3HYHK.js";
import {
  Field
} from "./chunk-M4KE4BK6.js";

// react/src/inputs/SelectField.tsx
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SelectField = forwardRef(function SelectField2({ label, help, range, error, notice, required, disabled, className, options, placeholder, ...rest }, ref) {
  return /* @__PURE__ */ jsx(
    Field,
    {
      label,
      help,
      range: range ?? (options.length ? `${options.length} lehet\u0151s\xE9g` : void 0),
      error,
      notice,
      required,
      disabled,
      className,
      children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs(
        "select",
        {
          ref,
          id: f.id,
          "aria-describedby": f.describedBy,
          "aria-invalid": f.invalid || void 0,
          className: "bc-select",
          required,
          disabled: disabled || options.length === 0,
          ...rest,
          children: [
            placeholder !== void 0 && /* @__PURE__ */ jsx("option", { value: "", children: options.length || disabled ? placeholder : "Nincs v\xE1laszthat\xF3 elem" }),
            options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value))
          ]
        }
      ) })
    }
  );
});

export {
  SelectField
};
