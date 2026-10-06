/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  lengthRange
} from "./chunk-5C3QEPMX.js";
import {
  useLengthCounter
} from "./chunk-AASIDWHO.js";
import {
  mergeRefs
} from "./chunk-H6PLTBTX.js";
import {
  FieldInput
} from "./chunk-ROTFH5JR.js";
import {
  Field
} from "./chunk-GRXHCTSC.js";

// react/src/inputs/TextArea.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var TextArea = forwardRef(function TextArea2({ label, help, range, error, notice, required, disabled, className, minLength, maxLength, rows = 4, onInput, onPaste, ...rest }, ref) {
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
        "textarea",
        {
          ref: mergeRefs(ref, c.ref),
          id: f.id,
          "aria-describedby": f.describedBy,
          "aria-invalid": f.invalid || void 0,
          className: "bc-textarea",
          rows,
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
  TextArea
};
