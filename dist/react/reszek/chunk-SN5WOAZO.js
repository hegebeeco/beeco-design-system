/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useLengthCounter
} from "./chunk-MX7GTSLY.js";
import {
  mergeRefs
} from "./chunk-5EEWJR3M.js";
import {
  Field
} from "./chunk-K4WGO4RX.js";
import {
  FieldInput
} from "./chunk-5M3UQKCL.js";

// react/src/inputs/TextField.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
function lengthRange(min, max) {
  if (min && max) return `${min}\u2013${max} karakter`;
  if (max) return `legfeljebb ${max} karakter`;
  if (min) return `legal\xE1bb ${min} karakter`;
  return void 0;
}
var TextField = forwardRef(function TextField2({ label, help, range, error, notice, required, disabled, className, type = "text", minLength, maxLength, onInput, onPaste, ...rest }, ref) {
  const c = useLengthCounter(maxLength);
  return /* @__PURE__ */ jsx(
    Field,
    {
      label,
      help,
      range: range ?? lengthRange(minLength, maxLength),
      count: maxLength ? { value: c.len, max: maxLength } : void 0,
      error,
      notice: notice ?? c.notice,
      required,
      disabled,
      className,
      children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsx(
        "input",
        {
          ref: mergeRefs(ref, c.ref),
          id: f.id,
          "aria-describedby": f.describedBy,
          "aria-invalid": f.invalid || void 0,
          className: "bc-input",
          type,
          required,
          disabled,
          minLength,
          maxLength,
          onInput: (e) => {
            c.onInput(e);
            onInput?.(e);
          },
          onPaste: (e) => {
            c.onPaste(e);
            onPaste?.(e);
          },
          ...rest
        }
      ) })
    }
  );
});

export {
  lengthRange,
  TextField
};
