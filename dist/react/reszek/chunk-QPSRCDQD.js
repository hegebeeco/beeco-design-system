/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  FieldInput
} from "./chunk-Z3BJSSQF.js";
import {
  Field
} from "./chunk-SVRCBHAN.js";
import {
  formatHu,
  numberRange,
  parseHu,
  sanitize
} from "./chunk-HMYHC7YL.js";

// react/src/inputs/NumberField.tsx
import { forwardRef, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var NumberField = forwardRef(function NumberField2({ label, help, range, error, notice, required, disabled, className, value, onChange, min, max, decimals = 0, unit, clamp = "blur", onBlur, ...rest }, ref) {
  const [text, setText] = useState(formatHu(value, decimals));
  const [note, setNote] = useState();
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(formatHu(value, decimals));
  }, [value, decimals, focused]);
  const fit = (n) => {
    if (n === null) return { n, msg: void 0 };
    if (min !== void 0 && n < min) return { n: min, msg: `A legkisebb \xE9rt\xE9kre \xE1ll\xEDtottam: ${formatHu(min, decimals)}${unit ? " " + unit : ""}.` };
    if (max !== void 0 && n > max) return { n: max, msg: `A legnagyobb \xE9rt\xE9kre \xE1ll\xEDtottam: ${formatHu(max, decimals)}${unit ? " " + unit : ""}.` };
    return { n, msg: void 0 };
  };
  const control = /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      id: f.id,
      "aria-describedby": f.describedBy,
      "aria-invalid": f.invalid || void 0,
      className: "bc-input",
      type: "text",
      inputMode: decimals > 0 ? "decimal" : "numeric",
      autoComplete: "off",
      required,
      disabled,
      value: text,
      onFocus: () => setFocused(true),
      onChange: (e) => {
        const clean = sanitize(e.target.value, decimals, min === void 0 || min < 0);
        let n = parseHu(clean);
        setNote(void 0);
        if (clamp === "input" && n !== null) {
          const r = fit(n);
          if (r.msg) {
            n = r.n;
            setNote(r.msg);
            setText(formatHu(n, decimals));
            onChange(n);
            return;
          }
        }
        setText(clean);
        onChange(n);
      },
      onBlur: (e) => {
        setFocused(false);
        const r = fit(parseHu(text));
        setText(formatHu(r.n, decimals));
        if (r.msg) setNote(r.msg);
        if (r.n !== value) onChange(r.n);
        onBlur?.(e);
      },
      ...rest
    }
  ) });
  return /* @__PURE__ */ jsx(
    Field,
    {
      label,
      help,
      range: range ?? numberRange(min, max, unit, decimals),
      error,
      notice: notice ?? note,
      required,
      disabled,
      className,
      children: unit ? /* @__PURE__ */ jsxs("div", { className: "bc-affix", children: [
        control,
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: unit })
      ] }) : control
    }
  );
});

export {
  NumberField
};
