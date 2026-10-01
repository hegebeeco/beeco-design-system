/* beeco design system 1.20.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/field/Field.tsx
import { useId } from "react";

// react/src/cx.ts
var cx = (...parts) => parts.filter(Boolean).join(" ");

// react/src/field/FieldContext.tsx
import { createContext, useContext } from "react";
var FieldContext = createContext(null);
var useFieldContext = () => useContext(FieldContext);

// react/src/field/HelpButton.tsx
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useRef, useState } from "react";

// react/src/inputs/ikonok.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var S = { viewBox: "0 0 24 24", width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var IcSave = () => /* @__PURE__ */ jsxs("svg", { ...S, children: [
  /* @__PURE__ */ jsx("path", { d: "M5 4h11l3 3v13H5z" }),
  /* @__PURE__ */ jsx("path", { d: "M8 4v5h7V4M8 20v-6h8v6" })
] });
var IcTrash = () => /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" }) });
var IcNew = () => /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) });
var IcInfo = () => /* @__PURE__ */ jsxs("svg", { ...S, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ jsx("path", { d: "M12 11v6M12 7.5v.5" })
] });
var IcEdit = () => /* @__PURE__ */ jsxs("svg", { ...S, children: [
  /* @__PURE__ */ jsx("path", { d: "M4 20h4L19 9l-4-4L4 16z" }),
  /* @__PURE__ */ jsx("path", { d: "M13 7l4 4" })
] });
var IcOpen = () => /* @__PURE__ */ jsxs("svg", { ...S, children: [
  /* @__PURE__ */ jsx("path", { d: "M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
] });
var IcX = () => /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
var IcOk = () => /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M5 12.5l4.5 4.5L19 7" }) });

// react/src/field/HelpButton.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var NYIT_MS = 250;
var ZAR_MS = 200;
function HelpButton({ label, children }) {
  const [open, setOpen] = useState(false);
  const [rogzitett, setRogzitett] = useState(false);
  const idozito = useRef(void 0);
  useEffect(() => () => window.clearTimeout(idozito.current), []);
  const eger = (e) => e.pointerType === "mouse";
  const be = (e) => {
    if (!eger(e)) return;
    window.clearTimeout(idozito.current);
    idozito.current = window.setTimeout(() => setOpen(true), open ? 0 : NYIT_MS);
  };
  const ki = (e) => {
    if (!eger(e) || rogzitett) return;
    window.clearTimeout(idozito.current);
    idozito.current = window.setTimeout(() => setOpen(false), ZAR_MS);
  };
  const kattint = (e) => {
    window.clearTimeout(idozito.current);
    if (open && !rogzitett) {
      e.preventDefault();
      setRogzitett(true);
      return;
    }
    setRogzitett(!open);
  };
  return /* @__PURE__ */ jsxs2(Popover.Root, { open, onOpenChange: (o) => {
    setOpen(o);
    if (!o) setRogzitett(false);
  }, children: [
    /* @__PURE__ */ jsx2(Popover.Trigger, { className: "bc-help-btn", "aria-label": `S\xFAg\xF3: ${label}`, type: "button", onPointerEnter: be, onPointerLeave: ki, onClick: kattint, children: /* @__PURE__ */ jsx2(IcInfo, {}) }),
    /* @__PURE__ */ jsx2(Popover.Portal, { children: /* @__PURE__ */ jsxs2(
      Popover.Content,
      {
        className: "bc-pop",
        side: "top",
        align: "start",
        sideOffset: 6,
        collisionPadding: 16,
        onPointerEnter: be,
        onPointerLeave: ki,
        onOpenAutoFocus: (e) => {
          if (!rogzitett) e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsx2("strong", { className: "bc-pop-title", children: label }),
          typeof children === "string" ? /* @__PURE__ */ jsx2("p", { children }) : children
        ]
      }
    ) })
  ] });
}

// react/src/field/Field.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function Field({ label, help, range, count, error, notice, required = false, disabled = false, className, children, labelFor = true }) {
  const id = useId();
  const metaId = `${id}-meta`, errId = `${id}-err`, noteId = `${id}-note`;
  const hasMeta = Boolean(range || count);
  const describedBy = [hasMeta && metaId, error && errId, notice && noteId].filter(Boolean).join(" ") || void 0;
  const ratio = count ? count.value / Math.max(1, count.max) : 0;
  const LabelTag = labelFor ? "label" : "span";
  return /* @__PURE__ */ jsxs3("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs3("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsxs3(LabelTag, { className: "bc-label", ...labelFor ? { htmlFor: id } : { id: `${id}-label` }, children: [
        label,
        required && /* @__PURE__ */ jsx3("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
        required && /* @__PURE__ */ jsx3("span", { className: "bc-sr", children: " (k\xF6telez\u0151)" })
      ] }),
      /* @__PURE__ */ jsx3(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsx3(FieldContext.Provider, { value: { id, describedBy, invalid: Boolean(error), required, disabled }, children }),
    hasMeta && /* @__PURE__ */ jsxs3("div", { className: "bc-meta", id: metaId, children: [
      range && /* @__PURE__ */ jsx3("span", { children: range }),
      count && /* @__PURE__ */ jsxs3("span", { className: cx("bc-count", ratio >= 1 ? "is-full" : ratio >= 0.9 && "is-near"), children: [
        count.value,
        "/",
        count.max,
        count.unit ? ` ${count.unit}` : "",
        ratio >= 1 && /* @__PURE__ */ jsx3("span", { className: "bc-sr", children: " \u2013 el\xE9rted a hat\xE1rt" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx3("p", { className: "bc-error", id: errId, role: "alert", children: error }),
    notice && !error && /* @__PURE__ */ jsx3("p", { className: "bc-notice", id: noteId, role: "status", children: notice })
  ] });
}

// react/src/inputs/Button.tsx
import { forwardRef } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var Button = forwardRef(function Button2({ variant = "primary", size = "md", block, busy, done, icon, className, children, type = "button", disabled, ...rest }, ref) {
  return /* @__PURE__ */ jsxs4(
    "button",
    {
      ref,
      type,
      disabled,
      "aria-busy": busy || void 0,
      "aria-disabled": busy || void 0,
      onClickCapture: busy ? (e) => e.preventDefault() : void 0,
      className: cx("bc-btn", variant !== "primary" && `is-${variant}`, size !== "md" && `is-${size}`, block && "is-block", className),
      ...rest,
      children: [
        done ? /* @__PURE__ */ jsx4("span", { className: "bc-anim-tick", "aria-hidden": "true", children: /* @__PURE__ */ jsx4(IcOk, {}) }) : icon,
        children,
        done && /* @__PURE__ */ jsx4("span", { className: "bc-sr", role: "status", children: "K\xE9sz" })
      ]
    }
  );
});
var IconButton = forwardRef(function IconButton2({ danger, className, type = "button", children, ...rest }, ref) {
  return /* @__PURE__ */ jsx4("button", { ref, type, className: cx("bc-icon-btn", danger && "is-danger", className), ...rest, children });
});

// react/src/inputs/TextField.tsx
import { forwardRef as forwardRef2 } from "react";

// react/src/inputs/useLengthCounter.ts
import { useCallback, useLayoutEffect, useRef as useRef2, useState as useState2 } from "react";
function useLengthCounter(maxLength) {
  const ref = useRef2(null);
  const [len, setLen] = useState2(0);
  const [notice, setNotice] = useState2();
  useLayoutEffect(() => {
    if (ref.current) setLen(ref.current.value.length);
  });
  const pasted = useRef2(false);
  const onInput = useCallback((e) => {
    setLen(e.currentTarget.value.length);
    if (pasted.current) {
      pasted.current = false;
      return;
    }
    setNotice(void 0);
  }, []);
  const onPaste = useCallback((e) => {
    if (!maxLength) return;
    const el = e.currentTarget;
    const text = e.clipboardData.getData("text");
    const selected = (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    const room = maxLength - (el.value.length - selected);
    if (text.length > room) {
      pasted.current = true;
      setNotice(`A beillesztett sz\xF6veg v\xE9g\xE9t lev\xE1gtam: legfeljebb ${maxLength} karakter lehet.`);
    }
  }, [maxLength]);
  return { ref, len, notice, onInput, onPaste };
}

// react/src/inputs/mergeRefs.ts
function mergeRefs(...refs) {
  return (el) => {
    for (const r of refs) {
      if (typeof r === "function") r(el);
      else if (r) r.current = el;
    }
  };
}

// react/src/field/FieldInput.tsx
function FieldInput({ children }) {
  const f = useFieldContext();
  if (!f) throw new Error("A mez\u0151nek Field-en bel\xFCl kell lennie (docs/komponensek.md 3/A)");
  return children(f);
}

// react/src/inputs/TextField.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function lengthRange(min, max) {
  if (min && max) return `${min}\u2013${max} karakter`;
  if (max) return `legfeljebb ${max} karakter`;
  if (min) return `legal\xE1bb ${min} karakter`;
  return void 0;
}
var TextField = forwardRef2(function TextField2({ label, help, range, error, notice, required, disabled, className, type = "text", minLength, maxLength, onInput, onPaste, ...rest }, ref) {
  const c = useLengthCounter(maxLength);
  return /* @__PURE__ */ jsx5(
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
      children: /* @__PURE__ */ jsx5(FieldInput, { children: (f) => /* @__PURE__ */ jsx5(
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

// react/src/inputs/TextArea.tsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var TextArea = forwardRef3(function TextArea2({ label, help, range, error, notice, required, disabled, className, minLength, maxLength, rows = 4, onInput, onPaste, ...rest }, ref) {
  const c = useLengthCounter(maxLength);
  return /* @__PURE__ */ jsx6(
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
      children: /* @__PURE__ */ jsx6(FieldInput, { children: (f) => /* @__PURE__ */ jsx6(
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

// react/src/inputs/NumberField.tsx
import { forwardRef as forwardRef4, useEffect as useEffect2, useState as useState3 } from "react";

// react/src/inputs/number.ts
function formatHu(n, decimals) {
  if (n === null || Number.isNaN(n)) return "";
  const fixed = decimals > 0 ? n.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "") : String(Math.round(n));
  const [int, frac] = fixed.split(".");
  const neg = int.startsWith("-");
  const digits = neg ? int.slice(1) : int;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "-" : "") + grouped + (frac ? "," + frac : "");
}
function parseHu(text) {
  const t = text.replace(/\s/g, "").replace(",", ".");
  if (t === "" || t === "-" || t === "." || t === "-.") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
function sanitize(text, decimals, allowNegative) {
  let out = "";
  let sep = false;
  for (const ch of text) {
    if (/\d/.test(ch)) out += ch;
    else if (ch === " ") out += ch;
    else if ((ch === "," || ch === ".") && decimals > 0 && !sep) {
      out += ",";
      sep = true;
    } else if (ch === "-" && allowNegative && out.trim() === "") out += ch;
  }
  if (decimals > 0 && sep) {
    const [a, b = ""] = out.split(",");
    out = a + "," + b.slice(0, decimals);
  }
  return out;
}
function numberRange(min, max, unit, decimals = 0) {
  const u = unit ? ` ${unit}` : "";
  const f = (n) => formatHu(n, decimals);
  if (min !== void 0 && max !== void 0) return `${f(min)}\u2013${f(max)}${u}`;
  if (max !== void 0) return `legfeljebb ${f(max)}${u}`;
  if (min !== void 0) return `legal\xE1bb ${f(min)}${u}`;
  return void 0;
}

// react/src/inputs/NumberField.tsx
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var NumberField = forwardRef4(function NumberField2({ label, help, range, error, notice, required, disabled, className, value, onChange, min, max, decimals = 0, unit, clamp = "blur", onBlur, ...rest }, ref) {
  const [text, setText] = useState3(formatHu(value, decimals));
  const [note, setNote] = useState3();
  const [focused, setFocused] = useState3(false);
  useEffect2(() => {
    if (!focused) setText(formatHu(value, decimals));
  }, [value, decimals, focused]);
  const fit = (n) => {
    if (n === null) return { n, msg: void 0 };
    if (min !== void 0 && n < min) return { n: min, msg: `A legkisebb \xE9rt\xE9kre \xE1ll\xEDtottam: ${formatHu(min, decimals)}${unit ? " " + unit : ""}.` };
    if (max !== void 0 && n > max) return { n: max, msg: `A legnagyobb \xE9rt\xE9kre \xE1ll\xEDtottam: ${formatHu(max, decimals)}${unit ? " " + unit : ""}.` };
    return { n, msg: void 0 };
  };
  const control = /* @__PURE__ */ jsx7(FieldInput, { children: (f) => /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
      children: unit ? /* @__PURE__ */ jsxs5("div", { className: "bc-affix", children: [
        control,
        /* @__PURE__ */ jsx7("span", { "aria-hidden": "true", children: unit })
      ] }) : control
    }
  );
});

// react/src/inputs/SelectField.tsx
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var SelectField = forwardRef5(function SelectField2({ label, help, range, error, notice, required, disabled, className, options, placeholder, ...rest }, ref) {
  return /* @__PURE__ */ jsx8(
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
      children: /* @__PURE__ */ jsx8(FieldInput, { children: (f) => /* @__PURE__ */ jsxs6(
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
            placeholder !== void 0 && /* @__PURE__ */ jsx8("option", { value: "", children: options.length ? placeholder : "Nincs v\xE1laszthat\xF3 elem" }),
            options.map((o) => /* @__PURE__ */ jsx8("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value))
          ]
        }
      ) })
    }
  );
});

// react/src/inputs/Choice.tsx
import { forwardRef as forwardRef6, useEffect as useEffect3, useId as useId2, useRef as useRef3 } from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var Checkbox = forwardRef6(function Checkbox2({ label, help, error, className, ...rest }, ref) {
  const id = useId2();
  return /* @__PURE__ */ jsxs7("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs7("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsxs7("label", { className: "bc-check", htmlFor: id, children: [
        /* @__PURE__ */ jsx9("input", { ref, id, type: "checkbox", "aria-invalid": error ? true : void 0, "aria-describedby": error ? `${id}-err` : void 0, ...rest }),
        label
      ] }),
      /* @__PURE__ */ jsx9(HelpButton, { label, children: help })
    ] }),
    error && /* @__PURE__ */ jsx9("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error })
  ] });
});
var CheckboxInput = forwardRef6(function CheckboxInput2({ className, indeterminate, ...rest }, ref) {
  const sajat = useRef3(null);
  useEffect3(() => {
    if (sajat.current) sajat.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return /* @__PURE__ */ jsx9("input", { ref: (el) => {
    sajat.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, type: "checkbox", className: cx("bc-checkbox", className), ...rest });
});
function RadioGroup({ label, help, error, className, name: name2, options, value, onChange, required, disabled }) {
  const id = useId2();
  return /* @__PURE__ */ jsxs7(
    "fieldset",
    {
      className: cx("bc-field", "bc-fieldset", className),
      "aria-describedby": error ? `${id}-err` : void 0,
      "aria-invalid": error ? true : void 0,
      disabled,
      children: [
        /* @__PURE__ */ jsxs7("legend", { className: "bc-label-row", children: [
          /* @__PURE__ */ jsxs7("span", { className: "bc-label", children: [
            label,
            required && /* @__PURE__ */ jsx9("span", { className: "is-req", "aria-hidden": "true", children: "*" })
          ] }),
          /* @__PURE__ */ jsx9(HelpButton, { label, children: help })
        ] }),
        /* @__PURE__ */ jsx9("div", { className: "bc-row", children: options.map((o) => /* @__PURE__ */ jsxs7("label", { className: "bc-check", children: [
          /* @__PURE__ */ jsx9(
            "input",
            {
              type: "radio",
              name: name2,
              value: o.value,
              disabled: o.disabled,
              required,
              checked: value === void 0 ? void 0 : value === o.value,
              onChange: () => onChange?.(o.value)
            }
          ),
          o.label
        ] }, o.value)) }),
        error && /* @__PURE__ */ jsx9("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error })
      ]
    }
  );
}
function Switch({ label, help, error, className, checked, onChange, disabled }) {
  const id = useId2();
  return /* @__PURE__ */ jsxs7("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs7("div", { className: "bc-label-row", style: { gap: "var(--bc-sp-2)" }, children: [
      /* @__PURE__ */ jsx9(
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
      /* @__PURE__ */ jsx9("span", { className: "bc-label", id: `${id}-l`, children: label }),
      /* @__PURE__ */ jsx9(HelpButton, { label, children: help })
    ] }),
    error && /* @__PURE__ */ jsx9("p", { className: "bc-error", role: "alert", children: error })
  ] });
}

// react/src/inputs/SearchBox.tsx
import { forwardRef as forwardRef7, useRef as useRef4, useState as useState4 } from "react";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var SearchBox = forwardRef7(function SearchBox2({ label, value, onChange, debounce = 250, onSearch, placeholder, className, ...rest }, ref) {
  const [inner, setInner] = useState4(value ?? "");
  const v = value ?? inner;
  const timer = useRef4(void 0);
  const local = useRef4(null);
  const set = (next) => {
    if (value === void 0) setInner(next);
    onChange?.(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(next.trim()), debounce);
  };
  return /* @__PURE__ */ jsxs8("div", { className: ["bc-search", className].filter(Boolean).join(" "), role: "search", "aria-label": label, children: [
    /* @__PURE__ */ jsxs8("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx10("circle", { cx: "11", cy: "11", r: "7" }),
      /* @__PURE__ */ jsx10("path", { d: "M20 20l-4-4" })
    ] }),
    /* @__PURE__ */ jsx10(
      "input",
      {
        ref: mergeRefs(ref, local),
        type: "search",
        className: "bc-input",
        "aria-label": label,
        placeholder: placeholder ?? label,
        value: v,
        onChange: (e) => set(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape" && v) {
            e.preventDefault();
            set("");
          }
        },
        ...rest
      }
    ),
    v && /* @__PURE__ */ jsx10("button", { type: "button", className: "bc-icon-btn", "aria-label": "Keres\xE9s t\xF6rl\xE9se", onClick: () => {
      set("");
      local.current?.focus();
    }, children: /* @__PURE__ */ jsx10("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx10("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
  ] });
});

// react/src/inputs/SegmentedControl.tsx
import { useRef as useRef5 } from "react";
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
function SegmentedControl({ label, value, onChange, items, className }) {
  const root = useRef5(null);
  const onKey = (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const enabled = items.filter((i) => !i.disabled);
    const at2 = enabled.findIndex((i) => i.value === value);
    const next = enabled[(at2 + dir + enabled.length) % enabled.length];
    onChange(next.value);
    root.current?.querySelector(`[data-value="${next.value}"]`)?.focus();
  };
  return /* @__PURE__ */ jsx11("div", { ref: root, role: "radiogroup", "aria-label": label, className: cx("bc-seg", className), onKeyDown: onKey, children: items.map((it) => {
    const on = it.value === value;
    return /* @__PURE__ */ jsxs9(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": on,
        "data-state": on ? "on" : "off",
        "data-value": it.value,
        tabIndex: on ? 0 : -1,
        disabled: it.disabled,
        className: "bc-seg-item",
        onClick: () => onChange(it.value),
        children: [
          it.icon && /* @__PURE__ */ jsx11("span", { "aria-hidden": "true", children: it.icon }),
          it.label
        ]
      },
      it.value
    );
  }) });
}

// react/src/pickers/Combobox.tsx
import * as Popover2 from "@radix-ui/react-popover";
import { useId as useId3, useMemo, useRef as useRef6, useState as useState5 } from "react";

// react/src/pickers/normalize.ts
import { createElement, Fragment } from "react";
var norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function highlight(label, query) {
  const q = norm(query.trim());
  if (!q) return label;
  const i = norm(label).indexOf(q);
  if (i < 0) return label;
  return createElement(Fragment, null, label.slice(0, i), createElement("mark", null, label.slice(i, i + q.length)), label.slice(i + q.length));
}
var createError = (e) => e instanceof Error && e.name === "AbortError" ? void 0 : e instanceof Error && e.message ? e.message : "Nem siker\xFClt l\xE9trehozni. Pr\xF3b\xE1ld \xFAjra.";

// react/src/pickers/Combobox.tsx
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
var RENDER_LIMIT = 100;
function Combobox(props) {
  const { options, placeholder, onCreate, loading, loadError, onRetry, maxChips = 3, filter = true, onQueryChange, minChars = 0, disabled, ...field } = props;
  const multi = props.multiple === true;
  const selected = multi ? props.value : props.value ? [props.value] : [];
  const [open, setOpen] = useState5(false);
  const [query, setQuery] = useState5("");
  const [active, setActive] = useState5(0);
  const [showAll, setShowAll] = useState5(false);
  const input = useRef6(null);
  const listId = useId3();
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const full = multi && props.max !== void 0 && selected.length >= props.max;
  const filtered = useMemo(() => {
    const q2 = norm(query.trim());
    return q2 && filter ? options.filter((o) => norm(o.label).includes(q2)) : options;
  }, [options, query, filter]);
  const shown = filtered.slice(0, RENDER_LIMIT);
  const q = query.trim();
  const canCreate = Boolean(onCreate) && q.length > 0 && !full && !options.some((o) => norm(o.label) === norm(q));
  const rows = shown.length + (canCreate ? 1 : 0);
  const commit = (v) => multi ? props.onChange(v) : props.onChange(v[0] ?? null);
  const toggle = (value) => {
    if (!multi) {
      commit([value]);
      setOpen(false);
      setQuery("");
      return;
    }
    if (selected.includes(value)) commit(selected.filter((s) => s !== value));
    else if (!full) commit([...selected, value]);
    setQuery("");
  };
  const [createErr, setCreateErr] = useState5();
  const create = async () => {
    if (!onCreate) return;
    try {
      const v = await onCreate(q);
      setCreateErr(void 0);
      toggle(v);
    } catch (e) {
      setCreateErr(createError(e));
    }
  };
  const pick = (i) => {
    if (i < shown.length) {
      const o = shown[i];
      if (!o.disabled && !(full && !selected.includes(o.value))) toggle(o.value);
    } else if (canCreate) void create();
  };
  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((a) => rows ? (a + (e.key === "ArrowDown" ? 1 : rows - 1)) % rows : 0);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      } else if (query) setQuery("");
    } else if (e.key === "Backspace" && !query && multi && selected.length) commit(selected.slice(0, -1));
  };
  const chips = multi ? showAll ? selected : selected.slice(0, maxChips) : [];
  const singleLabel = !multi && selected[0] ? byValue.get(selected[0])?.label ?? selected[0] : "";
  const count = multi && props.max !== void 0 ? { value: selected.length, max: props.max } : void 0;
  const range = field.range ?? (multi && props.max !== void 0 ? `legfeljebb ${props.max} elem` : void 0);
  return /* @__PURE__ */ jsx12(Field, { ...field, error: field.error ?? createErr, range, count, disabled, children: /* @__PURE__ */ jsx12(FieldInput, { children: (f) => /* @__PURE__ */ jsxs10(Popover2.Root, { open: open && !disabled, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx12(Popover2.Anchor, { asChild: true, children: /* @__PURE__ */ jsxs10("div", { className: cx("bc-combo", f.invalid && "is-invalid", disabled && "is-disabled"), onClick: () => !disabled && input.current?.focus(), children: [
      chips.map((v) => /* @__PURE__ */ jsxs10("span", { className: "bc-chip", children: [
        /* @__PURE__ */ jsx12("span", { children: byValue.get(v)?.label ?? v }),
        !disabled && /* @__PURE__ */ jsx12("button", { type: "button", "aria-label": `${byValue.get(v)?.label ?? v} elt\xE1vol\xEDt\xE1sa`, onClick: (e) => {
          e.stopPropagation();
          commit(selected.filter((s) => s !== v));
        }, children: "\xD7" })
      ] }, v)),
      multi && !showAll && selected.length > maxChips && /* @__PURE__ */ jsxs10("button", { type: "button", className: "bc-chip is-more", "aria-label": `M\xE9g ${selected.length - maxChips} kiv\xE1lasztott elem megjelen\xEDt\xE9se`, onClick: (e) => {
        e.stopPropagation();
        setShowAll(true);
      }, children: [
        "+",
        selected.length - maxChips
      ] }),
      /* @__PURE__ */ jsx12(
        "input",
        {
          ref: input,
          id: f.id,
          role: "combobox",
          "aria-expanded": open,
          "aria-controls": listId,
          "aria-autocomplete": "list",
          "aria-activedescendant": open && rows ? `${listId}-${active}` : void 0,
          "aria-describedby": f.describedBy,
          "aria-invalid": f.invalid || void 0,
          disabled,
          autoComplete: "off",
          placeholder: loading ? "T\xF6lt\xF6m a list\xE1t\u2026" : loadError ? "A lista nem t\xF6lt\xF6tt be \u2013 nyisd le az \xFAjrapr\xF3b\xE1l\xE1shoz" : selected.length && multi ? "" : placeholder,
          value: open || multi ? query : singleLabel,
          onChange: (e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            onQueryChange?.(e.target.value);
          },
          onFocus: () => setQuery(""),
          onKeyDown: onKey
        }
      ),
      loading && /* @__PURE__ */ jsx12("span", { className: "bc-spinner", role: "status", "aria-label": "T\xF6lt\xF6m a list\xE1t", style: { width: 18, height: 18, borderWidth: 2 } }),
      /* @__PURE__ */ jsx12("button", { type: "button", className: "bc-combo-toggle", tabIndex: -1, "aria-hidden": "true", "aria-expanded": open, disabled, onClick: (e) => {
        e.stopPropagation();
        setOpen(!open);
        input.current?.focus();
      }, children: /* @__PURE__ */ jsx12("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx12("path", { d: "M6 9l6 6 6-6" }) }) })
    ] }) }),
    /* @__PURE__ */ jsx12(Popover2.Portal, { children: /* @__PURE__ */ jsx12(
      Popover2.Content,
      {
        className: "bc-listbox",
        align: "start",
        sideOffset: 4,
        collisionPadding: 16,
        onOpenAutoFocus: (e) => e.preventDefault(),
        onInteractOutside: (e) => {
          if (e.target instanceof Node && input.current?.parentElement?.contains(e.target)) e.preventDefault();
        },
        children: /* @__PURE__ */ jsxs10("div", { role: "listbox", id: listId, "aria-multiselectable": multi || void 0, "aria-label": field.label, children: [
          loading && /* @__PURE__ */ jsx12("div", { className: "bc-list-note", role: "status", children: "T\xF6lt\xF6m a list\xE1t\u2026" }),
          loadError && /* @__PURE__ */ jsxs10("div", { className: "bc-list-note", role: "alert", children: [
            loadError,
            " ",
            onRetry && /* @__PURE__ */ jsx12("button", { type: "button", className: "bc-btn is-sm is-secondary", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
          ] }),
          !loading && !loadError && shown.map((o, i) => {
            const isSel = selected.includes(o.value);
            const blocked = o.disabled || full && !isSel;
            return /* @__PURE__ */ jsxs10(
              "div",
              {
                id: `${listId}-${i}`,
                role: "option",
                "aria-selected": isSel,
                "aria-disabled": blocked || void 0,
                "data-active": i === active,
                className: "bc-option",
                onMouseDown: (e) => e.preventDefault(),
                onMouseEnter: () => setActive(i),
                onClick: () => pick(i),
                children: [
                  multi && /* @__PURE__ */ jsx12("span", { className: "bc-ck", "aria-hidden": "true", children: isSel ? "\u2713" : "" }),
                  /* @__PURE__ */ jsx12("span", { children: highlight(o.label, query) })
                ]
              },
              o.value
            );
          }),
          canCreate && /* @__PURE__ */ jsxs10(
            "div",
            {
              id: `${listId}-${shown.length}`,
              role: "option",
              "aria-selected": false,
              "data-active": active === shown.length,
              className: "bc-option is-create",
              onMouseDown: (e) => e.preventDefault(),
              onMouseEnter: () => setActive(shown.length),
              onClick: () => void create(),
              children: [
                "+ \xDAj: \u201E",
                q,
                "\u201D"
              ]
            }
          ),
          !loading && !loadError && q.length < minChars && /* @__PURE__ */ jsxs10("div", { className: "bc-list-note", children: [
            "\xCDrj m\xE9g legal\xE1bb ",
            minChars - q.length,
            " bet\u0171t."
          ] }),
          !loading && !loadError && !rows && q.length >= minChars && /* @__PURE__ */ jsxs10("div", { className: "bc-list-note", children: [
            "Nincs tal\xE1lat",
            q ? ` erre: \u201E${q}\u201D` : "",
            "."
          ] }),
          filtered.length > RENDER_LIMIT && /* @__PURE__ */ jsxs10("div", { className: "bc-list-note", children: [
            "M\xE9g ",
            filtered.length - RENDER_LIMIT,
            " tal\xE1lat \u2013 sz\u0171k\xEDtsd a keres\xE9st."
          ] }),
          full && /* @__PURE__ */ jsxs10("div", { className: "bc-list-note", children: [
            "El\xE9rted a legfeljebb ",
            props.max,
            " elemet \u2013 el\u0151bb vegy\xE9l ki egyet."
          ] })
        ] })
      }
    ) })
  ] }) }) });
}

// react/src/pickers/TagPicker.tsx
import { useState as useState6 } from "react";
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
function TagPicker({ options, value, onChange, max, onCreate, cloudLimit = 20, ...field }) {
  const [adding, setAdding] = useState6(false);
  const [draft, setDraft] = useState6("");
  const [err, setErr] = useState6();
  if (options.length > cloudLimit) return /* @__PURE__ */ jsx13(Combobox, { ...field, multiple: true, options, value, onChange, max, onCreate });
  const full = max !== void 0 && value.length >= max;
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : full ? value : [...value, v]);
  const save2 = async () => {
    const t = draft.trim();
    if (!t) {
      setErr("Adj nevet az \xFAj c\xEDmk\xE9nek.");
      return;
    }
    if (options.some((o) => norm(o.label) === norm(t))) {
      setErr(`\u201E${t}\u201D m\xE1r l\xE9tezik \u2013 v\xE1laszd ki a list\xE1b\xF3l.`);
      return;
    }
    let v;
    try {
      v = await onCreate(t);
    } catch (e) {
      setErr(createError(e));
      return;
    }
    onChange([...value, v]);
    setDraft("");
    setAdding(false);
    setErr(void 0);
  };
  return /* @__PURE__ */ jsx13(
    Field,
    {
      ...field,
      labelFor: false,
      range: field.range ?? (max !== void 0 ? `legfeljebb ${max} c\xEDmke` : void 0),
      count: max !== void 0 ? { value: value.length, max } : void 0,
      error: field.error ?? err,
      children: /* @__PURE__ */ jsxs11("div", { className: "bc-tagcloud", role: "group", "aria-label": field.label, children: [
        options.length === 0 && !onCreate && /* @__PURE__ */ jsx13("span", { className: "bc-muted", children: "M\xE9g nincs c\xEDmke." }),
        options.map((o) => {
          const on = value.includes(o.value);
          return /* @__PURE__ */ jsx13("button", { type: "button", className: "bc-tag", "aria-pressed": on, disabled: field.disabled || o.disabled || full && !on, onClick: () => toggle(o.value), children: o.label }, o.value);
        }),
        onCreate && !adding && /* @__PURE__ */ jsx13("button", { type: "button", className: "bc-tag is-add", disabled: field.disabled || full, onClick: () => setAdding(true), children: "+ \xDAj c\xEDmke" }),
        adding && /* @__PURE__ */ jsxs11("span", { className: "bc-row", style: { gap: "var(--bc-sp-1)" }, children: [
          /* @__PURE__ */ jsx13(
            "input",
            {
              className: "bc-input",
              style: { width: 180, margin: 0 },
              "aria-label": "\xDAj c\xEDmke neve",
              maxLength: 40,
              autoFocus: true,
              value: draft,
              onChange: (e) => {
                setDraft(e.target.value);
                setErr(void 0);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void save2();
                }
                if (e.key === "Escape") setAdding(false);
              }
            }
          ),
          /* @__PURE__ */ jsx13("button", { type: "button", className: "bc-btn is-sm", onClick: () => void save2(), children: "Hozz\xE1ad\xE1s" }),
          /* @__PURE__ */ jsx13("button", { type: "button", className: "bc-btn is-sm is-ghost", onClick: () => {
            setAdding(false);
            setErr(void 0);
          }, children: "M\xE9gse" })
        ] })
      ] })
    }
  );
}

// react/src/pickers/DatePicker.tsx
import * as Popover3 from "@radix-ui/react-popover";
import { useEffect as useEffect5, useState as useState8 } from "react";

// react/src/pickers/Calendar.tsx
import { useEffect as useEffect4, useRef as useRef7, useState as useState7 } from "react";

// react/src/pickers/date.ts
var MONTHS = ["janu\xE1r", "febru\xE1r", "m\xE1rcius", "\xE1prilis", "m\xE1jus", "j\xFAnius", "j\xFAlius", "augusztus", "szeptember", "okt\xF3ber", "november", "december"];
var WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
var WEEKDAYS_LONG = ["h\xE9tf\u0151", "kedd", "szerda", "cs\xFCt\xF6rt\xF6k", "p\xE9ntek", "szombat", "vas\xE1rnap"];
var pad = (n) => String(n).padStart(2, "0");
var toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
var fromIso = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
var todayIso = () => toIso(/* @__PURE__ */ new Date());
var formatHuDate = (iso) => iso ? iso.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1. $2. $3.") : "";
function parseHuDate(text) {
  const t = text.trim();
  const m = t.match(/^(\d{4})[.\-/\s]*(\d{1,2})[.\-/\s]*(\d{1,2})\.?$/) || t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d ? toIso(dt) : null;
}
function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}
var addDays = (iso, n) => {
  const d = fromIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
};
var addMonths = (iso, n) => {
  const d = fromIso(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toIso(d);
};
var inRange = (iso, min, max) => (!min || iso >= min) && (!max || iso <= max);
var localToUtcIso = (date, time = "00:00") => {
  const [h, mi] = time.split(":").map(Number);
  const d = fromIso(date);
  d.setHours(h, mi, 0, 0);
  return d.toISOString();
};
var utcToLocal = (iso) => {
  const d = new Date(iso);
  return { date: toIso(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
};

// react/src/pickers/Calendar.tsx
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
function Calendar({ selected, onPick, min, max }) {
  const [focus, setFocus] = useState7(selected.start ?? (inRange(todayIso(), min, max) ? todayIso() : min ?? max ?? todayIso()));
  const grid = useRef7(null);
  const f = fromIso(focus);
  const days = monthGrid(f.getFullYear(), f.getMonth());
  const today = todayIso();
  useEffect4(() => {
    grid.current?.querySelector(`[data-iso="${focus}"]`)?.focus({ preventScroll: true });
  }, [focus]);
  const move = (e) => {
    const map = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
      Home: () => addDays(focus, -((f.getDay() + 6) % 7)),
      End: () => addDays(focus, 6 - (f.getDay() + 6) % 7)
    };
    if (map[e.key]) {
      e.preventDefault();
      setFocus(map[e.key]());
    }
  };
  const isSel = (iso) => iso === selected.start || iso === selected.end;
  const inSel = (iso) => Boolean(selected.start && selected.end && iso > selected.start && iso < selected.end);
  return /* @__PURE__ */ jsxs12("div", { className: "bc-cal", children: [
    /* @__PURE__ */ jsxs12("div", { className: "bc-cal-head", children: [
      /* @__PURE__ */ jsx14("button", { type: "button", className: "bc-icon-btn", "aria-label": "El\u0151z\u0151 h\xF3nap", onClick: () => setFocus(addMonths(focus, -1)), children: "\u2039" }),
      /* @__PURE__ */ jsxs12("strong", { "aria-live": "polite", children: [
        f.getFullYear(),
        ". ",
        MONTHS[f.getMonth()]
      ] }),
      /* @__PURE__ */ jsx14("button", { type: "button", className: "bc-icon-btn", "aria-label": "K\xF6vetkez\u0151 h\xF3nap", onClick: () => setFocus(addMonths(focus, 1)), children: "\u203A" })
    ] }),
    /* @__PURE__ */ jsxs12("table", { className: "bc-cal-grid", role: "grid", ref: grid, onKeyDown: move, "aria-label": `${f.getFullYear()}. ${MONTHS[f.getMonth()]}`, children: [
      /* @__PURE__ */ jsx14("thead", { children: /* @__PURE__ */ jsx14("tr", { children: WEEKDAYS.map((w, i) => /* @__PURE__ */ jsx14("th", { scope: "col", abbr: WEEKDAYS_LONG[i], children: w }, w)) }) }),
      /* @__PURE__ */ jsx14("tbody", { children: Array.from({ length: 6 }, (_, w) => /* @__PURE__ */ jsx14("tr", { children: days.slice(w * 7, w * 7 + 7).map((d) => {
        const iso = toIso(d);
        const off = !inRange(iso, min, max);
        return /* @__PURE__ */ jsx14("td", { children: /* @__PURE__ */ jsx14(
          "button",
          {
            type: "button",
            "data-iso": iso,
            tabIndex: iso === focus ? 0 : -1,
            disabled: off,
            "aria-selected": isSel(iso),
            "aria-label": `${d.getFullYear()}. ${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}${off ? ", nem v\xE1laszthat\xF3" : ""}`,
            className: cx("bc-day", d.getMonth() !== f.getMonth() && "is-outside", iso === today && "is-today", inSel(iso) && "is-in-range"),
            onClick: () => onPick(iso),
            children: d.getDate()
          }
        ) }, iso);
      }) }, w)) })
    ] })
  ] });
}

// react/src/pickers/DatePicker.tsx
import { jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
var CalIcon = () => /* @__PURE__ */ jsxs13("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx15("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ jsx15("path", { d: "M3 10h18M8 3v4M16 3v4" })
] });
var dateRangeText = (min, max) => min && max ? `${formatHuDate(min)} \u2013 ${formatHuDate(max)}` : min ? `legkor\xE1bban ${formatHuDate(min)}` : max ? `legk\xE9s\u0151bb ${formatHuDate(max)}` : "form\xE1tum: \xE9\xE9\xE9\xE9. hh. nn.";
function fixTime(t) {
  const m = t.replace(/[^\d:]/g, "").match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!m) return null;
  const h = Math.min(23, Number(m[1])), mi = Math.min(59, Number(m[2] || 0));
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}
function DatePicker({ value, onChange, min, max, time, range, notice, ...field }) {
  const [text, setText] = useState8(formatHuDate(value));
  const [open, setOpen] = useState8(false);
  const [note, setNote] = useState8();
  const [typedErr, setTypedErr] = useState8();
  const [tText, setTText] = useState8(time?.value ?? "");
  useEffect5(() => setText(formatHuDate(value)), [value]);
  useEffect5(() => setTText(time?.value ?? ""), [time?.value]);
  const accept = (iso) => {
    setTypedErr(void 0);
    setNote(void 0);
    if (iso && min && iso < min) {
      iso = min;
      setNote(`A legkor\xE1bbi v\xE1laszthat\xF3 napra \xE1ll\xEDtottam: ${formatHuDate(min)}.`);
    }
    if (iso && max && iso > max) {
      iso = max;
      setNote(`A legk\xE9s\u0151bbi v\xE1laszthat\xF3 napra \xE1ll\xEDtottam: ${formatHuDate(max)}.`);
    }
    setText(formatHuDate(iso));
    onChange(iso);
  };
  return /* @__PURE__ */ jsx15(Field, { ...field, range: range ?? dateRangeText(min, max), notice: notice ?? note, error: field.error ?? typedErr, children: /* @__PURE__ */ jsx15(FieldInput, { children: (f) => /* @__PURE__ */ jsxs13("div", { className: "bc-date", children: [
    /* @__PURE__ */ jsxs13(Popover3.Root, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxs13("div", { className: "bc-date-input", children: [
        /* @__PURE__ */ jsx15(
          "input",
          {
            id: f.id,
            className: "bc-input",
            inputMode: "numeric",
            autoComplete: "off",
            placeholder: "\xE9\xE9\xE9\xE9. hh. nn.",
            value: text,
            "aria-describedby": f.describedBy,
            "aria-invalid": f.invalid || void 0,
            disabled: field.disabled,
            required: field.required,
            onChange: (e) => setText(e.target.value.replace(/[^\d.\-/\s]/g, "").slice(0, 13)),
            onBlur: () => {
              if (!text.trim()) {
                accept(null);
                return;
              }
              const iso = parseHuDate(text);
              if (iso) accept(iso);
              else setTypedErr("Ezt nem \xE9rtem d\xE1tumnak \u2013 \xEDrd \xEDgy: 2026. 10. 01., vagy v\xE1lassz a napt\xE1rb\xF3l.");
            },
            onKeyDown: (e) => {
              if (e.key === "ArrowDown" && e.altKey) setOpen(true);
            }
          }
        ),
        /* @__PURE__ */ jsx15(Popover3.Trigger, { asChild: true, children: /* @__PURE__ */ jsx15("button", { type: "button", className: "bc-icon-btn", "aria-label": `Napt\xE1r megnyit\xE1sa: ${field.label}`, disabled: field.disabled, children: /* @__PURE__ */ jsx15(CalIcon, {}) }) })
      ] }),
      /* @__PURE__ */ jsx15(Popover3.Portal, { children: /* @__PURE__ */ jsx15(Popover3.Content, { className: "bc-pop", style: { padding: 0 }, align: "end", sideOffset: 6, collisionPadding: 16, children: /* @__PURE__ */ jsx15(Calendar, { selected: { start: value }, min, max, onPick: (iso) => {
        if (inRange(iso, min, max)) {
          accept(iso);
          setOpen(false);
        }
      } }) }) })
    ] }),
    time && /* @__PURE__ */ jsx15(
      "input",
      {
        className: "bc-input bc-time",
        inputMode: "numeric",
        placeholder: "\xF3\xF3:pp",
        "aria-label": time.label ?? `${field.label} \u2013 id\u0151pont (\xF3ra:perc)`,
        value: tText,
        disabled: field.disabled,
        maxLength: 5,
        onChange: (e) => setTText(e.target.value.replace(/[^\d:]/g, "")),
        onBlur: () => {
          const t = tText.trim() ? fixTime(tText) : null;
          setTText(t ?? "");
          time.onChange(t);
        }
      }
    )
  ] }) }) });
}

// react/src/pickers/DateRangePicker.tsx
import * as Popover4 from "@radix-ui/react-popover";
import { useState as useState9 } from "react";
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
function DateRangePicker({ value, onChange, min, max, range, notice, ...field }) {
  const [open, setOpen] = useState9(false);
  const [note, setNote] = useState9();
  const label = value.start ? `${formatHuDate(value.start)} \u2013 ${value.end ? formatHuDate(value.end) : "\u2026"}` : "V\xE1lassz id\u0151szakot";
  const pick = (iso) => {
    if (!inRange(iso, min, max)) return;
    setNote(void 0);
    if (!value.start || value.end) {
      onChange({ start: iso, end: null });
      return;
    }
    if (iso < value.start) {
      onChange({ start: iso, end: value.start });
      setNote("A v\xE9g a kezdet el\xE9 esett \u2013 felcser\xE9ltem.");
    } else onChange({ start: value.start, end: iso });
    setOpen(false);
  };
  return /* @__PURE__ */ jsx16(Field, { ...field, range: range ?? dateRangeText(min, max), notice: notice ?? note, children: /* @__PURE__ */ jsx16(FieldInput, { children: (f) => /* @__PURE__ */ jsxs14(Popover4.Root, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx16(Popover4.Trigger, { asChild: true, children: /* @__PURE__ */ jsx16("button", { id: f.id, type: "button", className: "bc-select", style: { textAlign: "left" }, "aria-describedby": f.describedBy, disabled: field.disabled, children: label }) }),
    /* @__PURE__ */ jsx16(Popover4.Portal, { children: /* @__PURE__ */ jsxs14(Popover4.Content, { className: "bc-pop", style: { padding: 0 }, align: "start", sideOffset: 6, collisionPadding: 16, children: [
      /* @__PURE__ */ jsx16(Calendar, { selected: value, min, max, onPick: pick }),
      /* @__PURE__ */ jsxs14("div", { className: "bc-cal-foot", style: { padding: "0 var(--bc-sp-3) var(--bc-sp-3)" }, children: [
        /* @__PURE__ */ jsx16("span", { className: "bc-help", children: value.start && !value.end ? "Most v\xE1laszd a v\xE9g\xE9t." : "V\xE1laszd a kezd\u0151napot." }),
        /* @__PURE__ */ jsx16("button", { type: "button", className: "bc-btn is-sm is-ghost", onClick: () => {
          onChange({ start: null, end: null });
          setNote(void 0);
        }, children: "T\xF6rl\xE9s" })
      ] })
    ] }) })
  ] }) }) });
}

// react/src/form/FormSection.tsx
import { jsx as jsx17, jsxs as jsxs15 } from "react/jsx-runtime";
function FormSection({ title, description, children, className }) {
  return /* @__PURE__ */ jsxs15("section", { className: cx("bc-card", className), "aria-label": title, children: [
    /* @__PURE__ */ jsx17("h2", { className: "bc-card-title", children: title }),
    description && /* @__PURE__ */ jsx17("p", { className: "bc-muted", style: { marginTop: "calc(-1 * var(--bc-sp-2))" }, children: description }),
    /* @__PURE__ */ jsx17("div", { className: "bc-form-grid", children })
  ] });
}
function FormActions({ children, className }) {
  return /* @__PURE__ */ jsx17("div", { className: cx("bc-form-actions", className), children });
}

// react/src/adat/DataTable.tsx
import { Fragment as Fragment4, useId as useId6, useMemo as useMemo2, useState as useState11 } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

// react/src/adat/EmptyState.tsx
import { jsx as jsx18, jsxs as jsxs16 } from "react/jsx-runtime";
function EmptyState({ title, children, action, illustration, compact, className }) {
  return /* @__PURE__ */ jsxs16("div", { className: cx("bc-empty", compact && "is-compact", className), children: [
    illustration && /* @__PURE__ */ jsx18("div", { className: "bc-empty-art", "aria-hidden": "true", children: illustration }),
    /* @__PURE__ */ jsx18("strong", { children: title }),
    children && /* @__PURE__ */ jsx18("p", { className: "bc-empty-text", children }),
    action && /* @__PURE__ */ jsx18("div", { className: "bc-row", children: action })
  ] });
}

// react/src/adat/DataState.tsx
import { Fragment as Fragment2, jsx as jsx19, jsxs as jsxs17 } from "react/jsx-runtime";
function DataState({ status, what = "az adatokat", error, onRetry, retrying, empty, skeleton, children }) {
  if (status === "ready") return /* @__PURE__ */ jsx19(Fragment2, { children });
  if (status === "loading")
    return skeleton ? /* @__PURE__ */ jsx19("div", { role: "status", "aria-label": `Bet\xF6lt\xF6m ${what}\u2026`, children: skeleton }) : /* @__PURE__ */ jsxs17("div", { className: "bc-state", role: "status", children: [
      /* @__PURE__ */ jsx19("span", { className: "bc-spinner", "aria-hidden": "true" }),
      " Bet\xF6lt\xF6m ",
      what,
      "\u2026"
    ] });
  if (status === "empty") return /* @__PURE__ */ jsx19(Fragment2, { children: empty ?? /* @__PURE__ */ jsx19(EmptyState, { compact: true, title: "M\xE9g nincs adat", children: "Ha lesz, itt l\xE1tod." }) });
  if (status === "forbidden")
    return /* @__PURE__ */ jsx19("div", { className: "bc-alert is-warning bc-state-box", children: /* @__PURE__ */ jsxs17("p", { children: [
      /* @__PURE__ */ jsx19("strong", { children: "Ehhez nincs jogosults\xE1god." }),
      " Ha sz\xFCks\xE9ged van r\xE1, k\xE9rj hozz\xE1f\xE9r\xE9st egy admint\xF3l."
    ] }) });
  return /* @__PURE__ */ jsxs17("div", { className: "bc-alert is-danger bc-state-box", role: "alert", children: [
    /* @__PURE__ */ jsxs17("p", { children: [
      /* @__PURE__ */ jsx19("strong", { children: error ?? `Nem siker\xFClt bet\xF6lteni ${what}.` }),
      " Ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra."
    ] }),
    onRetry && /* @__PURE__ */ jsx19(Button, { variant: "secondary", size: "sm", busy: retrying, onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
  ] });
}
function SkeletonRows({ rows = 5, cols }) {
  return /* @__PURE__ */ jsx19(Fragment2, { children: Array.from({ length: rows }, (_, r) => /* @__PURE__ */ jsx19("tr", { className: "bc-skel-row", "aria-hidden": "true", children: Array.from({ length: cols }, (_2, c) => /* @__PURE__ */ jsx19("td", { children: /* @__PURE__ */ jsx19("span", { className: "bc-skeleton", style: { width: `${55 + (r * 7 + c * 13) % 40}%` } }) }, c)) }, r)) });
}
function DataNote({ title, children, tone = "info", className }) {
  return /* @__PURE__ */ jsxs17("aside", { className: cx("bc-alert", `is-${tone}`, "bc-note", className), "aria-label": title ?? "Megjegyz\xE9s az adatokhoz", children: [
    /* @__PURE__ */ jsxs17("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx19("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ jsx19("path", { d: "M12 11v6M12 7.5v.5" })
    ] }),
    /* @__PURE__ */ jsxs17("div", { children: [
      title && /* @__PURE__ */ jsx19("strong", { children: title }),
      /* @__PURE__ */ jsx19("div", { className: "bc-note-body", children })
    ] })
  ] });
}

// react/src/adat/DataTableParts.tsx
import { useEffect as useEffect6, useRef as useRef8 } from "react";

// react/src/adat/format.ts
function fmt(n, decimals = 0) {
  if (n === null || n === void 0 || Number.isNaN(n)) return "\u2013";
  return formatHu(n, decimals).replace("-", "\u2212").replace(/ /g, "\xA0");
}
var fmtSigned = (n, decimals = 0) => (n > 0 ? "+" : "") + fmt(n, decimals);
function matchText(haystack, query) {
  const q = norm(query.trim());
  return !q || norm(haystack).includes(q);
}
function niceTicks(min, max, count = 5) {
  let lo = Math.min(0, min), hi = Math.max(0, max);
  if (hi === lo) hi = lo + 1;
  const raw = (hi - lo) / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.abs(v) < step / 1e6 ? 0 : +v.toFixed(10));
  const decimals = step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
  return { lo, hi, step, ticks, decimals };
}
var linear = (d0, d1, r0, r1) => (v) => r0 + (v - d0) / (d1 - d0 || 1) * (r1 - r0);
var labelEvery = (count, width, minPx) => Math.max(1, Math.ceil(count * minPx / Math.max(1, width)));
var clip = (s, max) => s.length > max ? s.slice(0, Math.max(1, max - 1)).trimEnd() + "\u2026" : s;
function pageList(page, total, siblings = 1) {
  if (total <= 5 + siblings * 2) return Array.from({ length: total }, (_, i) => i);
  const from = Math.max(1, page - siblings), to = Math.min(total - 2, page + siblings);
  const out = [0];
  if (from > 1) out.push(null);
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 2) out.push(null);
  out.push(total - 1);
  return out;
}

// react/src/adat/DataTableParts.tsx
import { jsx as jsx20, jsxs as jsxs18 } from "react/jsx-runtime";
function SortHeader({ label, sorted, onToggle }) {
  const next = sorted === "asc" ? "cs\xF6kken\u0151 sorrend" : sorted === "desc" ? "rendez\xE9s kikapcsol\xE1sa" : "n\xF6vekv\u0151 sorrend";
  return /* @__PURE__ */ jsxs18("button", { type: "button", className: "bc-sort bc-dt-sort", onClick: onToggle, title: `Rendez\xE9s: ${next}`, children: [
    label,
    /* @__PURE__ */ jsxs18("svg", { className: cx("bc-dt-sorticon", sorted && `is-${sorted}`), viewBox: "0 0 12 16", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx20("path", { className: "is-up", d: "M6 1l4 5H2z" }),
      /* @__PURE__ */ jsx20("path", { className: "is-down", d: "M6 15l4-5H2z" })
    ] })
  ] });
}
function SelectCell({ checked, indeterminate, disabled, label, onChange }) {
  const ref = useRef8(null);
  useEffect6(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return /* @__PURE__ */ jsx20("label", { className: "bc-dt-check", children: /* @__PURE__ */ jsx20("input", { ref, type: "checkbox", checked, disabled, onChange, "aria-label": label }) });
}
function ExpandToggle({ expanded, controls, label, onToggle }) {
  return /* @__PURE__ */ jsx20(IconButton, { className: "bc-dt-expand", "aria-label": `R\xE9szletek: ${label}`, "aria-expanded": expanded, "aria-controls": expanded ? controls : void 0, onClick: onToggle, children: /* @__PURE__ */ jsx20("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx20("path", { d: "M9 6l6 6-6 6" }) }) });
}
var STEP = 16;
function ColumnResizer({ header, label }) {
  const col = header.column;
  const size = col.getSize();
  const min = col.columnDef.minSize ?? 64, max = col.columnDef.maxSize ?? 800;
  const set = (v) => header.getContext().table.setColumnSizing((old) => ({ ...old, [col.id]: Math.max(min, Math.min(max, v)) }));
  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      set(size + (e.key === "ArrowRight" ? STEP : -STEP));
    }
    if (e.key === "Home") {
      e.preventDefault();
      col.resetSize();
    }
  };
  return /* @__PURE__ */ jsx20(
    "div",
    {
      role: "separator",
      "aria-orientation": "vertical",
      "aria-label": `${label} oszlop sz\xE9less\xE9ge`,
      "aria-valuenow": Math.round(size),
      "aria-valuemin": min,
      "aria-valuemax": Math.min(max, 2e3),
      tabIndex: 0,
      className: cx("bc-dt-resizer", col.getIsResizing() && "is-resizing"),
      onKeyDown: onKey,
      onMouseDown: header.getResizeHandler(),
      onTouchStart: header.getResizeHandler(),
      onDoubleClick: () => col.resetSize()
    }
  );
}
function BulkBar({ count, max, itemLabel, notice, onClear, children }) {
  return /* @__PURE__ */ jsxs18("div", { className: "bc-dt-bulk", role: "region", "aria-label": "T\xF6meges m\u0171veletek", children: [
    /* @__PURE__ */ jsxs18("p", { className: "bc-dt-bulk-count", children: [
      /* @__PURE__ */ jsxs18("strong", { children: [
        fmt(count),
        " kijel\xF6lt"
      ] }),
      " ",
      itemLabel,
      max ? /* @__PURE__ */ jsxs18("span", { className: "bc-muted", children: [
        " (",
        fmt(count),
        "/",
        fmt(max),
        ")"
      ] }) : null
    ] }),
    notice && /* @__PURE__ */ jsx20("p", { className: "bc-notice", children: notice }),
    /* @__PURE__ */ jsxs18("div", { className: "bc-dt-bulk-actions", children: [
      /* @__PURE__ */ jsx20(Button, { variant: "ghost", size: "sm", onClick: onClear, children: "Kijel\xF6l\xE9s t\xF6rl\xE9se" }),
      children
    ] })
  ] });
}

// react/src/adat/dataTableColumns.tsx
import { Fragment as Fragment3, jsx as jsx21, jsxs as jsxs19 } from "react/jsx-runtime";
var metaOf = (c) => c.columnDef.meta ?? {};
var miss = (v) => v === null || v === "" ? void 0 : v;
var path = (row, key) => key.split(".").reduce((o, k) => o == null ? void 0 : o[k], row);
function wrapColumn(c) {
  const a = c;
  if (typeof a.accessorKey === "string") {
    const key = a.accessorKey;
    const { accessorKey: _drop, ...rest } = a;
    return { ...rest, id: a.id ?? key, accessorFn: (r) => miss(path(r, key)) };
  }
  if (a.accessorFn) {
    const fn = a.accessorFn;
    return { ...a, accessorFn: (r, i) => miss(fn(r, i)) };
  }
  return c;
}
function DefaultCell({ getValue, column }) {
  const v = getValue();
  if (v === void 0) return /* @__PURE__ */ jsxs19("span", { className: "bc-dt-missing", children: [
    /* @__PURE__ */ jsx21("span", { "aria-hidden": "true", children: "\u2013" }),
    /* @__PURE__ */ jsx21("span", { className: "bc-sr", children: "nincs adat" })
  ] });
  if (typeof v === "number") return /* @__PURE__ */ jsx21(Fragment3, { children: fmt(v, metaOf(column).decimals ?? 0) });
  const s = String(v);
  return /* @__PURE__ */ jsx21("span", { className: "bc-dt-text", title: s.length > 40 ? s : void 0, children: s });
}
function selectColumn(rowLabel) {
  return {
    id: "_sel",
    size: 44,
    enableSorting: false,
    enableResizing: false,
    meta: { label: "Kijel\xF6l\xE9s" },
    header: ({ table }) => /* @__PURE__ */ jsx21(
      SelectCell,
      {
        label: "Az oldal \xF6sszes sor\xE1nak kijel\xF6l\xE9se",
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onChange: () => table.toggleAllPageRowsSelected()
      }
    ),
    cell: ({ row }) => /* @__PURE__ */ jsx21(SelectCell, { label: `Kijel\xF6l\xE9s: ${rowLabel(row.original)}`, checked: row.getIsSelected(), disabled: !row.getCanSelect(), onChange: () => row.toggleSelected() })
  };
}
function expandColumn(rowLabel, detailId) {
  return {
    id: "_exp",
    size: 44,
    enableSorting: false,
    enableResizing: false,
    meta: { label: "R\xE9szletek" },
    header: () => /* @__PURE__ */ jsx21("span", { className: "bc-sr", children: "R\xE9szletek" }),
    cell: ({ row }) => row.getCanExpand() ? /* @__PURE__ */ jsx21(ExpandToggle, { expanded: row.getIsExpanded(), controls: detailId(row.id), label: rowLabel(row.original), onToggle: () => row.toggleExpanded() }) : null
  };
}
var headerText = (c) => metaOf(c).label ?? (typeof c.columnDef.header === "string" ? c.columnDef.header : c.id);

// react/src/adat/Pagination.tsx
import { useId as useId4 } from "react";
import { jsx as jsx22, jsxs as jsxs20 } from "react/jsx-runtime";
var Chevron = ({ dir, vegig }) => /* @__PURE__ */ jsxs20("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx22("path", { d: dir === "l" ? vegig ? "M17 6l-6 6 6 6" : "M15 6l-6 6 6 6" : vegig ? "M7 6l6 6-6 6" : "M9 6l6 6-6 6" }),
  vegig && /* @__PURE__ */ jsx22("path", { d: dir === "l" ? "M7 5v14" : "M17 5v14" })
] });
function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizes = [10, 25, 100], itemLabel = "elem", label = "Lapoz\xE1s", className }) {
  const sizeId = useId4();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(page, pages - 1);
  const from = total ? p * pageSize + 1 : 0;
  const to = Math.min(total, (p + 1) * pageSize);
  return /* @__PURE__ */ jsxs20("nav", { className: cx("bc-pager", "bc-pagination", className), "aria-label": label, children: [
    /* @__PURE__ */ jsx22("p", { className: "bc-pager-info", "aria-live": "polite", children: total ? `${fmt(from)}\u2013${fmt(to)} / ${fmt(total)} ${itemLabel} \xB7 ${fmt(p + 1)}. oldal / ${fmt(pages)}` : `0 ${itemLabel}` }),
    pages > 1 && /* @__PURE__ */ jsxs20("ul", { className: "bc-pager-pages", children: [
      /* @__PURE__ */ jsx22("li", { children: /* @__PURE__ */ jsx22(IconButton, { "aria-label": "Els\u0151 lap", disabled: p === 0, onClick: () => onPageChange(0), children: /* @__PURE__ */ jsx22(Chevron, { dir: "l", vegig: true }) }) }),
      /* @__PURE__ */ jsx22("li", { children: /* @__PURE__ */ jsx22(IconButton, { "aria-label": "El\u0151z\u0151 lap", disabled: p === 0, onClick: () => onPageChange(p - 1), children: /* @__PURE__ */ jsx22(Chevron, { dir: "l" }) }) }),
      pageList(p, pages).map((n, i) => n === null ? /* @__PURE__ */ jsx22("li", { className: "bc-pager-gap", "aria-hidden": "true", children: "\u2026" }, `gap${i}`) : /* @__PURE__ */ jsx22("li", { children: /* @__PURE__ */ jsx22(
        "button",
        {
          type: "button",
          className: "bc-pager-num",
          "aria-current": n === p ? "page" : void 0,
          "aria-label": `${n + 1}. lap`,
          onClick: () => onPageChange(n),
          children: n + 1
        }
      ) }, n)),
      /* @__PURE__ */ jsx22("li", { children: /* @__PURE__ */ jsx22(IconButton, { "aria-label": "K\xF6vetkez\u0151 lap", disabled: p >= pages - 1, onClick: () => onPageChange(p + 1), children: /* @__PURE__ */ jsx22(Chevron, { dir: "r" }) }) }),
      /* @__PURE__ */ jsx22("li", { children: /* @__PURE__ */ jsx22(IconButton, { "aria-label": "Utols\xF3 lap", disabled: p >= pages - 1, onClick: () => onPageChange(pages - 1), children: /* @__PURE__ */ jsx22(Chevron, { dir: "r", vegig: true }) }) })
    ] }),
    onPageSizeChange && /* @__PURE__ */ jsxs20("div", { className: "bc-pager-size", children: [
      /* @__PURE__ */ jsx22("label", { htmlFor: sizeId, children: "Sor / oldal" }),
      /* @__PURE__ */ jsx22("select", { id: sizeId, className: "bc-select", value: pageSize, onChange: (e) => onPageSizeChange(Number(e.target.value)), children: pageSizes.map((s) => /* @__PURE__ */ jsx22("option", { value: s, children: s }, s)) })
    ] })
  ] });
}

// react/src/adat/SortSelect.tsx
import { useId as useId5 } from "react";
import { jsx as jsx23, jsxs as jsxs21 } from "react/jsx-runtime";
function SortSelect({ table }) {
  const id = useId5();
  const cols = table.getAllLeafColumns().filter((c) => c.getCanSort());
  const s = table.getState().sorting[0];
  const value = s ? `${s.id}:${s.desc ? "desc" : "asc"}` : "";
  return /* @__PURE__ */ jsxs21("div", { className: "bc-dt-sortsel", children: [
    /* @__PURE__ */ jsx23("label", { className: "bc-label", htmlFor: id, children: "Rendez\xE9s" }),
    /* @__PURE__ */ jsxs21(
      "select",
      {
        id,
        className: "bc-select",
        value,
        onChange: (e) => {
          const [cid, dir] = e.target.value.split(":");
          table.setSorting(cid ? [{ id: cid, desc: dir === "desc" }] : []);
        },
        children: [
          /* @__PURE__ */ jsx23("option", { value: "", children: "Nincs rendez\xE9s" }),
          cols.flatMap((c) => [
            /* @__PURE__ */ jsxs21("option", { value: `${c.id}:asc`, children: [
              headerText(c),
              " \u2013 n\xF6vekv\u0151"
            ] }, `${c.id}a`),
            /* @__PURE__ */ jsxs21("option", { value: `${c.id}:desc`, children: [
              headerText(c),
              " \u2013 cs\xF6kken\u0151"
            ] }, `${c.id}d`)
          ])
        ]
      }
    )
  ] });
}

// react/src/adat/useCtl.ts
import { useState as useState10 } from "react";
function useCtl(value, onChange, initial) {
  const [inner, setInner] = useState10(initial);
  const cur = value ?? inner;
  const set = (u) => {
    const next = typeof u === "function" ? u(cur) : u;
    if (value === void 0) setInner(next);
    onChange?.(next);
  };
  return [cur, set];
}

// react/src/adat/DataTable.tsx
import { jsx as jsx24, jsxs as jsxs22 } from "react/jsx-runtime";
function DataTable(p) {
  const { data, caption, getRowId, rowLabel, itemLabel = "sor", status = "ready", selectable, maxSelection, renderExpanded, resizable, mobile = "scroll" } = p;
  const uid = useId6().replace(/[^a-zA-Z0-9-]/g, "");
  const detailId = (id) => `${uid}-d-${id}`;
  const [sorting, setSorting] = useCtl(p.sorting, p.onSortingChange, []);
  const [selection, setSelection] = useCtl(p.selection, p.onSelectionChange, {});
  const [pagination, setPagination] = useCtl(p.pagination, p.onPaginationChange, { pageIndex: 0, pageSize: (p.pageSizes ?? [10, 25, 100])[1] ?? 25 });
  const [density, setDensity] = useCtl(p.density, p.onDensityChange, "comfortable");
  const [expanded, setExpanded] = useState11({});
  const [notice, setNotice] = useState11();
  const server = p.serverRowCount !== void 0;
  const columns = useMemo2(() => [
    ...selectable ? [selectColumn(rowLabel)] : [],
    ...renderExpanded ? [expandColumn(rowLabel, detailId)] : [],
    ...p.columns.map(wrapColumn)
  ], [p.columns, selectable, renderExpanded]);
  const table = useReactTable({
    data,
    columns,
    getRowId,
    columnResizeMode: "onChange",
    enableColumnResizing: Boolean(resizable),
    defaultColumn: { cell: DefaultCell, sortUndefined: "last", size: 160, minSize: 64 },
    state: { sorting, rowSelection: selection, pagination, expanded },
    onSortingChange: (u) => {
      setSorting(u);
      setPagination((o) => ({ ...o, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: (u) => {
      const next = typeof u === "function" ? u(selection) : u;
      const n = Object.values(next).filter(Boolean).length;
      if (maxSelection && n > maxSelection) {
        setNotice(`${maxSelection}/${maxSelection} \u2013 t\xF6bb nem jel\xF6lhet\u0151 ki.`);
        return;
      }
      setNotice(void 0);
      setSelection(next);
    },
    enableRowSelection: Boolean(selectable),
    getRowCanExpand: (r) => Boolean(renderExpanded) && (p.canExpand?.(r.original) ?? true),
    getCoreRowModel: getCoreRowModel(),
    ...server ? { manualSorting: true, manualPagination: true, rowCount: p.serverRowCount } : { getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() },
    autoResetPageIndex: false
  });
  const total = server ? p.serverRowCount ?? 0 : table.getPrePaginationRowModel().rows.length;
  const selIds = Object.keys(selection).filter((k) => selection[k]);
  const leafs = table.getVisibleLeafColumns();
  const pinCount = leafs.findIndex((c) => !c.id.startsWith("_")) + 1;
  const pinStyle = (i) => i < pinCount ? { left: `calc(var(--bc-tap) * ${i})` } : void 0;
  const clear = () => {
    setSelection({});
    setNotice(void 0);
  };
  const rows = table.getRowModel().rows;
  const body = status !== "ready" || !data.length;
  return /* @__PURE__ */ jsxs22("div", { className: cx("bc-dt", density === "dense" && "is-dense", mobile === "cards" && "is-cards"), children: [
    /* @__PURE__ */ jsx24("p", { className: "bc-sr", "aria-live": "polite", children: selIds.length ? `${selIds.length} kijel\xF6lt ${itemLabel}` : "" }),
    (selectable || p.densityToggle !== false || p.toolbar || p.captionVisible || mobile === "cards") && /* @__PURE__ */ jsx24("div", { className: "bc-dt-bar", children: selIds.length ? /* @__PURE__ */ jsx24(BulkBar, { count: selIds.length, max: maxSelection, itemLabel, notice, onClear: clear, children: p.bulkActions?.(selIds, clear) }) : /* @__PURE__ */ jsxs22("div", { className: "bc-dt-tools", children: [
      p.captionVisible && /* @__PURE__ */ jsx24("h3", { className: "bc-dt-title", "aria-hidden": "true", children: caption }),
      mobile === "cards" && /* @__PURE__ */ jsx24(SortSelect, { table }),
      p.densityToggle !== false && /* @__PURE__ */ jsx24(SegmentedControl, { label: "S\u0171r\u0171s\xE9g", value: density, onChange: setDensity, items: [{ value: "comfortable", label: "K\xE9nyelmes" }, { value: "dense", label: "S\u0171r\u0171" }] }),
      p.toolbar
    ] }) }),
    p.refreshing && /* @__PURE__ */ jsx24("div", { className: "bc-dt-progress", role: "status", "aria-label": "Friss\xEDtem a list\xE1t\u2026" }),
    /* @__PURE__ */ jsx24(
      "div",
      {
        className: "bc-table-wrap bc-dt-wrap",
        tabIndex: 0,
        role: "region",
        "aria-label": `${caption} \u2013 g\xF6rgethet\u0151 t\xE1bl\xE1zat`,
        style: p.maxHeight ? { "--_dt-max": p.maxHeight } : void 0,
        children: /* @__PURE__ */ jsxs22("table", { className: cx("bc-table", density === "dense" && "is-dense", resizable && "is-fixed"), style: resizable ? { width: table.getTotalSize(), minWidth: "100%" } : void 0, children: [
          /* @__PURE__ */ jsx24("caption", { className: "bc-sr", children: caption }),
          /* @__PURE__ */ jsx24("thead", { children: table.getHeaderGroups().map((g) => /* @__PURE__ */ jsx24("tr", { children: g.headers.map((h, i) => {
            const c = h.column, s = c.getIsSorted();
            return /* @__PURE__ */ jsxs22(
              "th",
              {
                scope: "col",
                className: cx(metaOf(c).num && "is-num", i < pinCount && "is-pin", c.id.startsWith("_") && "is-util"),
                style: { width: h.getSize(), ...pinStyle(i) },
                "aria-sort": c.getCanSort() ? s === "asc" ? "ascending" : s === "desc" ? "descending" : "none" : void 0,
                children: [
                  c.getCanSort() ? /* @__PURE__ */ jsx24(SortHeader, { label: flexRender(c.columnDef.header, h.getContext()), sorted: s, onToggle: () => c.toggleSorting(void 0, false) }) : flexRender(c.columnDef.header, h.getContext()),
                  resizable && c.getCanResize() && /* @__PURE__ */ jsx24(ColumnResizer, { header: h, label: headerText(c) })
                ]
              },
              h.id
            );
          }) }, g.id)) }),
          /* @__PURE__ */ jsx24("tbody", { children: status === "loading" ? /* @__PURE__ */ jsx24(SkeletonRows, { cols: leafs.length }) : body ? /* @__PURE__ */ jsx24("tr", { className: "bc-dt-state", children: /* @__PURE__ */ jsx24("td", { colSpan: leafs.length, children: /* @__PURE__ */ jsx24(
            DataState,
            {
              status: status === "ready" ? "empty" : status,
              what: `a list\xE1t (${itemLabel})`,
              error: p.error,
              onRetry: p.onRetry,
              empty: p.empty ?? /* @__PURE__ */ jsx24(EmptyState, { compact: true, title: "M\xE9g nincs itt semmi", children: "Ha lesz, ebben a list\xE1ban l\xE1tod." })
            }
          ) }) }) : rows.map((r) => /* @__PURE__ */ jsxs22(Fragment4, { children: [
            /* @__PURE__ */ jsx24("tr", { "data-selected": r.getIsSelected() || void 0, "data-expanded": r.getIsExpanded() || void 0, children: r.getVisibleCells().map((cell, i) => /* @__PURE__ */ jsx24(
              "td",
              {
                "data-label": headerText(cell.column),
                style: pinStyle(i),
                className: cx(metaOf(cell.column).num && "is-num", i < pinCount && "is-pin", cell.column.id.startsWith("_") && "is-util", metaOf(cell.column).wrap && "is-wrap"),
                children: flexRender(cell.column.columnDef.cell, cell.getContext())
              },
              cell.id
            )) }),
            r.getIsExpanded() && renderExpanded && /* @__PURE__ */ jsx24("tr", { className: "bc-dt-detail", id: detailId(r.id), children: /* @__PURE__ */ jsx24("td", { colSpan: leafs.length, children: /* @__PURE__ */ jsx24("div", { className: "bc-dt-detail-body", children: renderExpanded(r.original) }) }) })
          ] }, r.id)) })
        ] })
      }
    ),
    status === "ready" && total > 0 && /* @__PURE__ */ jsx24(
      Pagination,
      {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        total,
        itemLabel,
        pageSizes: p.pageSizes,
        label: `Lapoz\xE1s \u2013 ${caption}`,
        onPageChange: (i) => setPagination((o) => ({ ...o, pageIndex: i })),
        onPageSizeChange: (s) => setPagination({ pageIndex: 0, pageSize: s })
      }
    )
  ] });
}

// react/src/adat/FilterBar.tsx
import * as Popover5 from "@radix-ui/react-popover";
import { useEffect as useEffect7, useRef as useRef9, useState as useState13 } from "react";

// react/src/adat/FilterControls.tsx
import { useId as useId7 } from "react";
import { jsx as jsx25, jsxs as jsxs23 } from "react/jsx-runtime";
var MULTI_HELP = "T\xF6bb is v\xE1laszthat\xF3. Ha egyet sem v\xE1lasztasz, mindegyik l\xE1tszik.";
function FilterControl({ def, value, onChange }) {
  const id = useId7();
  if (def.multiple)
    return /* @__PURE__ */ jsx25(
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
  return /* @__PURE__ */ jsxs23("div", { className: "bc-filter", children: [
    /* @__PURE__ */ jsxs23("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsx25("label", { className: "bc-label", htmlFor: id, children: def.label }),
      def.help && /* @__PURE__ */ jsx25(HelpButton, { label: def.label, children: def.help })
    ] }),
    /* @__PURE__ */ jsxs23(
      "select",
      {
        id,
        className: "bc-select",
        value: typeof value === "string" ? value : "",
        disabled: def.loading || Boolean(def.loadError),
        "aria-describedby": def.loadError ? `${id}-err` : void 0,
        onChange: (e) => onChange(e.target.value || null),
        children: [
          /* @__PURE__ */ jsx25("option", { value: "", children: def.loading ? "Bet\xF6lt\xE9s\u2026" : def.anyLabel ?? "mindegy" }),
          def.options.map((o) => /* @__PURE__ */ jsx25("option", { value: o.value, children: o.label }, o.value))
        ]
      }
    ),
    def.loadError && /* @__PURE__ */ jsxs23("div", { className: "bc-filter-err", children: [
      /* @__PURE__ */ jsx25("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: def.loadError }),
      def.onRetry && /* @__PURE__ */ jsx25(Button, { variant: "ghost", size: "sm", onClick: def.onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
    ] })
  ] });
}
function FilterChip({ text, onRemove }) {
  return /* @__PURE__ */ jsxs23("li", { className: "bc-chip bc-fb-chip", children: [
    /* @__PURE__ */ jsx25("span", { title: text, children: text }),
    /* @__PURE__ */ jsx25("button", { type: "button", "aria-label": `Sz\u0171r\u0151 t\xF6rl\xE9se: ${text}`, onClick: onRemove, children: "\xD7" })
  ] });
}
function chipText(def, value) {
  const vals2 = Array.isArray(value) ? value : value ? [value] : [];
  if (!vals2.length) return null;
  const first = def.options.find((o) => o.value === vals2[0])?.label ?? vals2[0];
  return `${def.label}: ${first}${vals2.length > 1 ? ` +${vals2.length - 1}` : ""}`;
}

// react/src/adat/useWidth.ts
import { useLayoutEffect as useLayoutEffect2, useState as useState12 } from "react";
function useWidth(ref, fallback = 0) {
  const [w, setW] = useState12(fallback);
  useLayoutEffect2(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

// react/src/adat/FilterBar.tsx
import { Fragment as Fragment5, jsx as jsx26, jsxs as jsxs24 } from "react/jsx-runtime";
var vals = (v) => Array.isArray(v) ? v : v ? [v] : [];
function FilterBar({ search, filters, values, onChange, resultCount, itemLabel = "tal\xE1lat", extra, narrowBelow = 640, className }) {
  const root = useRef9(null);
  const width = useWidth(root, typeof window === "undefined" ? 1024 : window.innerWidth);
  const narrow = width > 0 && width < narrowBelow;
  const [q, setQ] = useState13(search?.value ?? "");
  const [open, setOpen] = useState13(false);
  const [notice, setNotice] = useState13();
  const searchInput = useRef9(null);
  useEffect7(() => {
    searchInput.current?.closest("[role=search]")?.setAttribute("aria-label", search?.label ?? "Keres\xE9s");
  }, [search?.label]);
  useEffect7(() => {
    if (search && search.value !== q.trim()) setQ(search.value);
  }, [search?.value]);
  useEffect7(() => {
    const bad2 = [];
    const next = { ...values };
    for (const f of filters) {
      if (f.loading || f.loadError || !f.options.length) continue;
      const ok = vals(values[f.id]).filter((v) => f.options.some((o) => o.value === v));
      if (ok.length !== vals(values[f.id]).length) {
        bad2.push(f.label);
        next[f.id] = f.multiple ? ok.length ? ok : null : ok[0] ?? null;
      }
    }
    if (bad2.length) {
      setNotice(`A linkben l\xE9v\u0151 ${bad2.join(", ")} sz\u0171r\u0151\xE9rt\xE9k m\xE1r nem l\xE9tezik \u2013 kihagytam.`);
      onChange(next);
    }
  }, [values, filters]);
  const set = (id, v) => {
    const next = { ...values, [id]: v };
    const drop = (pid) => filters.filter((f) => f.parent === pid).forEach((f) => {
      next[f.id] = null;
      drop(f.id);
    });
    drop(id);
    setNotice(void 0);
    onChange(next);
  };
  const active = filters.map((f) => ({ f, text: chipText(f, values[f.id]) })).filter((a) => a.text);
  const any = active.length > 0 || Boolean(q.trim());
  const clearAll = () => {
    const next = {};
    filters.forEach((f) => {
      next[f.id] = null;
    });
    onChange(next);
    setQ("");
    search?.onChange("");
    setNotice(void 0);
  };
  const count = resultCount === void 0 ? null : /* @__PURE__ */ jsx26("p", { className: "bc-fb-count", role: "status", "aria-live": "polite", children: resultCount === null ? "Sz\xE1mol\xE1s\u2026" : `${fmt(resultCount)} ${itemLabel}` });
  const controls = filters.map((f) => /* @__PURE__ */ jsx26(FilterControl, { def: f, value: values[f.id], onChange: (v) => set(f.id, v) }, f.id));
  return /* @__PURE__ */ jsxs24("div", { ref: root, className: cx("bc-fb", narrow && "is-narrow", className), children: [
    /* @__PURE__ */ jsxs24("div", { className: "bc-fb-row", children: [
      search && /* @__PURE__ */ jsx26(SearchBox, { ref: searchInput, className: "bc-fb-search", label: search.label, placeholder: search.placeholder, value: q, onChange: setQ, onSearch: (v) => search.onChange(v) }),
      narrow ? /* @__PURE__ */ jsxs24(Popover5.Root, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx26(Popover5.Trigger, { asChild: true, children: /* @__PURE__ */ jsxs24(Button, { variant: "secondary", className: "bc-fb-toggle", "aria-haspopup": "dialog", children: [
          "Sz\u0171r\u0151k",
          active.length > 0 && /* @__PURE__ */ jsxs24("span", { className: "bc-badge is-accent", children: [
            active.length,
            /* @__PURE__ */ jsx26("span", { className: "bc-sr", children: " akt\xEDv" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx26(Popover5.Portal, { children: /* @__PURE__ */ jsxs24(Popover5.Content, { className: "bc-pop bc-fb-panel", role: "dialog", "aria-label": "Sz\u0171r\u0151k", side: "bottom", align: "end", sideOffset: 8, collisionPadding: 16, children: [
          /* @__PURE__ */ jsxs24("div", { className: "bc-fb-panel-body", children: [
            controls,
            extra
          ] }),
          /* @__PURE__ */ jsxs24("div", { className: "bc-fb-panel-foot", children: [
            any && /* @__PURE__ */ jsx26(Button, { variant: "ghost", size: "sm", onClick: clearAll, children: "Sz\u0171r\u0151k t\xF6rl\xE9se" }),
            /* @__PURE__ */ jsx26(Button, { size: "sm", onClick: () => setOpen(false), children: resultCount == null ? "K\xE9sz" : `${fmt(resultCount)} ${itemLabel} mutat\xE1sa` })
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs24(Fragment5, { children: [
        controls,
        extra
      ] })
    ] }),
    notice && /* @__PURE__ */ jsx26("p", { className: "bc-notice", role: "status", children: notice }),
    (any || count) && /* @__PURE__ */ jsxs24("div", { className: "bc-fb-active", children: [
      any && /* @__PURE__ */ jsxs24("ul", { className: "bc-fb-chips", "aria-label": "Akt\xEDv sz\u0171r\u0151k", children: [
        q.trim() && /* @__PURE__ */ jsx26(FilterChip, { text: `Keres\xE9s: ${q.trim()}`, onRemove: () => {
          setQ("");
          search?.onChange("");
        } }),
        active.map(({ f, text }) => /* @__PURE__ */ jsx26(FilterChip, { text, onRemove: () => set(f.id, null) }, f.id))
      ] }),
      any && /* @__PURE__ */ jsx26(Button, { variant: "ghost", size: "sm", onClick: clearAll, children: "Sz\u0171r\u0151k t\xF6rl\xE9se" }),
      count
    ] })
  ] });
}

// react/src/adat/chart/Sparkline.tsx
import { jsx as jsx27, jsxs as jsxs25 } from "react/jsx-runtime";
function Sparkline({ values, label, className }) {
  const W = 96, H = 32, P2 = 4;
  const nums = values.filter((v) => typeof v === "number");
  if (!nums.length) return null;
  const lo = Math.min(...nums), hi = Math.max(...nums);
  const x = linear(0, Math.max(1, values.length - 1), P2, W - P2);
  const y = linear(lo, hi === lo ? lo + 1 : hi, H - P2, P2);
  let d = "", pen = false, last = -1;
  values.forEach((v, i) => {
    if (typeof v !== "number") {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
    pen = true;
    last = i;
  });
  return /* @__PURE__ */ jsxs25("svg", { className: cx("bc-spark", className), viewBox: `0 0 ${W} ${H}`, width: W, height: H, ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }, children: [
    /* @__PURE__ */ jsx27("path", { className: "bc-line-under", d }),
    /* @__PURE__ */ jsx27("path", { className: "bc-line bc-s1", d }),
    /* @__PURE__ */ jsx27("circle", { className: "bc-mark bc-s1", cx: x(last), cy: y(values[last]), r: 3.5 })
  ] });
}

// react/src/adat/StatTile.tsx
import { jsx as jsx28, jsxs as jsxs26 } from "react/jsx-runtime";
function StatTile(p) {
  const { label, help, value, unit, decimals = 0, period, delta, good = "up", n, nLabel = "\xE9rintett", minN = 5, estimate, source, trend } = p;
  const hidden = n !== void 0 && n > 0 && n < minN;
  let body;
  if (p.loading) body = /* @__PURE__ */ jsx28("span", { className: "bc-skeleton bc-stat-skel", role: "status", "aria-label": `${label}: bet\xF6lt\xE9s\u2026` });
  else if (p.error) body = /* @__PURE__ */ jsxs26("div", { className: "bc-stat-err", role: "alert", children: [
    /* @__PURE__ */ jsx28("span", { children: p.error }),
    p.onRetry && /* @__PURE__ */ jsx28(Button, { variant: "ghost", size: "sm", onClick: p.onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
  ] });
  else if (hidden) body = /* @__PURE__ */ jsxs26("p", { className: "bc-stat-value is-hidden", children: [
    "rejtve",
    /* @__PURE__ */ jsxs26("span", { className: "bc-stat-sub", children: [
      "kevesebb mint ",
      minN,
      " ",
      nLabel,
      " \u2013 adatv\xE9delmi k\xFCsz\xF6b"
    ] })
  ] });
  else if (value === null) body = /* @__PURE__ */ jsxs26("p", { className: "bc-stat-value is-missing", children: [
    /* @__PURE__ */ jsx28("span", { "aria-hidden": "true", children: "\u2014" }),
    /* @__PURE__ */ jsx28("span", { className: "bc-sr", children: "nincs adat" })
  ] });
  else body = /* @__PURE__ */ jsxs26("p", { className: "bc-stat-value", children: [
    estimate && /* @__PURE__ */ jsx28("span", { title: "becsl\xE9s", children: "~" }),
    fmt(value, decimals),
    unit && /* @__PURE__ */ jsxs26("span", { className: "bc-stat-unit", children: [
      " ",
      unit
    ] }),
    estimate && /* @__PURE__ */ jsx28("span", { className: "bc-stat-sub", children: "becsl\xE9s" })
  ] });
  return /* @__PURE__ */ jsxs26("div", { className: cx("bc-stat", "bc-kpi", p.className), children: [
    /* @__PURE__ */ jsxs26("div", { className: "bc-label-row bc-kpi-head", children: [
      /* @__PURE__ */ jsx28("span", { className: "bc-stat-label", children: label }),
      /* @__PURE__ */ jsx28(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsxs26("div", { className: "bc-kpi-main", children: [
      body,
      trend && !hidden && !p.loading && !p.error && /* @__PURE__ */ jsx28(Sparkline, { values: trend, className: "bc-kpi-spark" })
    ] }),
    !hidden && !p.loading && !p.error && value !== null && delta && /* @__PURE__ */ jsx28(Delta, { d: delta, good }),
    (period || n !== void 0 && !hidden) && /* @__PURE__ */ jsxs26("p", { className: "bc-kpi-meta", children: [
      period,
      period && n !== void 0 && !hidden ? " \xB7 " : "",
      n !== void 0 && !hidden ? `elemsz\xE1m: ${fmt(n)} ${nLabel}` : ""
    ] }),
    source && /* @__PURE__ */ jsxs26("p", { className: "bc-kpi-source", children: [
      "Forr\xE1s: ",
      source
    ] })
  ] });
}
function Delta({ d, good }) {
  if (d === "new") return /* @__PURE__ */ jsx28("p", { className: "bc-stat-delta bc-kpi-delta is-neutral", children: "\xFAj \u2013 nincs el\u0151z\u0151 id\u0151szak" });
  const dir = d.value > 0 ? "up" : d.value < 0 ? "down" : "flat";
  const tone = good === "none" || dir === "flat" ? "neutral" : dir === good ? "good" : "bad";
  const arrow = dir === "up" ? "\u25B2" : dir === "down" ? "\u25BC" : "=";
  const unit = d.fromZero ? "" : d.unit === "%" ? "%" : d.unit ? ` ${d.unit}` : "";
  const meaning = tone === "good" ? "j\xF3 ir\xE1ny" : tone === "bad" ? "rossz ir\xE1ny" : "";
  return /* @__PURE__ */ jsxs26("p", { className: cx("bc-stat-delta", "bc-kpi-delta", `is-${tone}`), children: [
    /* @__PURE__ */ jsxs26("span", { "aria-hidden": "true", children: [
      arrow,
      " "
    ] }),
    fmtSigned(d.value, d.decimals ?? 0),
    unit,
    d.fromZero ? " (el\u0151tte 0)" : "",
    " ",
    d.compare,
    meaning && /* @__PURE__ */ jsxs26("span", { className: "bc-kpi-meaning", children: [
      " \xB7 ",
      meaning
    ] })
  ] });
}

// react/src/adat/chart/ChartCard.tsx
import { isValidElement, useId as useId9, useState as useState14 } from "react";

// react/src/adat/chart/marks.tsx
import { Fragment as Fragment6, jsx as jsx29, jsxs as jsxs27 } from "react/jsx-runtime";
var sc = (i) => `bc-s${i % 8 + 1}`;
var SHAPES = ["circle", "square", "triangle", "diamond"];
var shapeOf = (i) => SHAPES[i % SHAPES.length];
function Marker({ x, y, i, r = 5 }) {
  const cls = `bc-mark ${sc(i)}`;
  switch (shapeOf(i)) {
    case "square":
      return /* @__PURE__ */ jsx29("rect", { className: cls, x: x - r, y: y - r, width: r * 2, height: r * 2 });
    case "triangle":
      return /* @__PURE__ */ jsx29("path", { className: cls, d: `M${x} ${y - r * 1.2}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z` });
    case "diamond":
      return /* @__PURE__ */ jsx29("path", { className: cls, d: `M${x} ${y - r * 1.3}L${x + r * 1.1} ${y}L${x} ${y + r * 1.3}L${x - r * 1.1} ${y}Z` });
    default:
      return /* @__PURE__ */ jsx29("circle", { className: cls, cx: x, cy: y, r });
  }
}
function Swatch({ i, kind }) {
  return /* @__PURE__ */ jsxs27("svg", { className: "bc-swatch", viewBox: "0 0 24 16", width: "24", height: "16", "aria-hidden": "true", children: [
    kind === "gap" && /* @__PURE__ */ jsx29("rect", { className: "bc-gap-swatch", x: "1", y: "1", width: "22", height: "14", rx: "2" }),
    kind === "bar" && /* @__PURE__ */ jsx29("rect", { className: `bc-mark ${sc(i)}`, x: "5", y: "1.5", width: "14", height: "13" }),
    kind === "line" && /* @__PURE__ */ jsxs27(Fragment6, { children: [
      /* @__PURE__ */ jsx29("path", { className: "bc-line-under", d: "M1 8H23" }),
      /* @__PURE__ */ jsx29("path", { className: `bc-line ${sc(i)}`, d: "M1 8H23" }),
      /* @__PURE__ */ jsx29(Marker, { x: 12, y: 8, i, r: 4 })
    ] })
  ] });
}
function GapPattern({ id }) {
  return /* @__PURE__ */ jsx29("defs", { children: /* @__PURE__ */ jsxs27("pattern", { id, width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)", children: [
    /* @__PURE__ */ jsx29("rect", { className: "bc-gap-bg", width: "8", height: "8" }),
    /* @__PURE__ */ jsx29("path", { className: "bc-gap-line", d: "M0 0V8" })
  ] }) });
}

// react/src/adat/chart/types.ts
var isGap = (d, i) => d.series.some((s) => s.values[i] === null || s.values[i] === void 0);
var hasGap = (d) => d.categories.some((_, i) => isGap(d, i));
var allValues = (d) => d.series.flatMap((s) => s.values.filter((v) => typeof v === "number"));
var isEmptyData = (d) => !d.categories.length || !allValues(d).length;

// react/src/adat/chart/ChartLegend.tsx
import { jsx as jsx30, jsxs as jsxs28 } from "react/jsx-runtime";
function ChartLegend({ data, kind }) {
  const gap = hasGap(data);
  if (data.series.length < 2 && !gap && kind === "bar") return null;
  return /* @__PURE__ */ jsxs28("ul", { className: "bc-legend", "aria-label": "Jelmagyar\xE1zat", children: [
    data.series.map((s, i) => /* @__PURE__ */ jsxs28("li", { children: [
      /* @__PURE__ */ jsx30(Swatch, { i, kind }),
      s.label
    ] }, s.key)),
    gap && /* @__PURE__ */ jsxs28("li", { children: [
      /* @__PURE__ */ jsx30(Swatch, { i: 0, kind: "gap" }),
      data.gapLabel ?? "nincs adat",
      " \u2013 nem nulla"
    ] })
  ] });
}

// react/src/adat/chart/ChartTable.tsx
import { jsx as jsx31, jsxs as jsxs29 } from "react/jsx-runtime";
function ChartTable({ data, caption }) {
  const gap = data.gapLabel ?? "nincs adat";
  return /* @__PURE__ */ jsx31("div", { className: "bc-table-wrap bc-chart-table", tabIndex: 0, role: "region", "aria-label": `${caption} \u2013 adatt\xE1bla`, children: /* @__PURE__ */ jsxs29("table", { className: "bc-table is-dense", children: [
    /* @__PURE__ */ jsxs29("caption", { className: "bc-sr", children: [
      caption,
      " \u2013 adatt\xE1bla"
    ] }),
    /* @__PURE__ */ jsx31("thead", { children: /* @__PURE__ */ jsxs29("tr", { children: [
      /* @__PURE__ */ jsx31("th", { scope: "col", children: data.xLabel }),
      data.series.map((s) => /* @__PURE__ */ jsxs29("th", { scope: "col", className: "is-num", children: [
        s.label,
        " (",
        data.unit,
        ")"
      ] }, s.key))
    ] }) }),
    /* @__PURE__ */ jsx31("tbody", { children: data.categories.map((c, i) => /* @__PURE__ */ jsxs29("tr", { children: [
      /* @__PURE__ */ jsx31("th", { scope: "row", children: c }),
      data.series.map((s) => {
        const v = s.values[i];
        return /* @__PURE__ */ jsx31("td", { className: "is-num", children: typeof v === "number" ? fmt(v, data.decimals ?? 2) : /* @__PURE__ */ jsx31("span", { className: "bc-muted", children: gap }) }, s.key);
      })
    ] }, `${c}${i}`)) })
  ] }) });
}

// react/src/adat/chart/Frame.tsx
import { useId as useId8, useRef as useRef10 } from "react";
import { jsx as jsx32, jsxs as jsxs30 } from "react/jsx-runtime";
var CH = 7;
function Frame({ data, min, max, height = 240, minBand = 24, padRight, label, children, note }) {
  const box = useRef10(null);
  const width = useWidth(box);
  const pid = `bcgap${useId8().replace(/[^a-zA-Z0-9]/g, "")}`;
  const n = Math.max(1, data.categories.length);
  const { lo, hi, ticks, decimals } = niceTicks(min, max, height < 160 ? 3 : 5);
  const tickW = Math.max(...ticks.map((t2) => fmt(t2, decimals).length)) * CH + 12;
  const narrow = width < 420;
  const l = Math.max(36, tickW), r = padRight?.(narrow) ?? 12, t = 24, b = 48;
  const svgW = Math.max(width, l + r + n * minBand);
  const plot = { l, t, w: Math.max(10, svgW - l - r), h: height - t - b };
  const band = plot.w / n;
  const cx2 = (i) => plot.l + band * (i + 0.5);
  const y = linear(lo, hi, plot.t + plot.h, plot.t);
  const maxChars = Math.max(...data.categories.map((c) => c.length), 1);
  const every = labelEvery(n, plot.w, Math.min(maxChars * CH + 10, 96));
  const fit = Math.max(3, Math.floor((band * every - 6) / CH));
  const scroll = width > 0 && svgW > width + 1;
  return /* @__PURE__ */ jsxs30("div", { className: "bc-chart", ref: box, children: [
    /* @__PURE__ */ jsx32("div", { className: "bc-chart-scroll", ...scroll ? { tabIndex: 0, role: "group", "aria-label": `${label} \u2013 oldalra g\xF6rgethet\u0151` } : {}, children: width > 0 && /* @__PURE__ */ jsxs30("svg", { width: svgW, height, viewBox: `0 0 ${svgW} ${height}`, role: "img", "aria-label": `${label}. A pontos sz\xE1mok az adatt\xE1bl\xE1ban.`, children: [
      /* @__PURE__ */ jsx32(GapPattern, { id: pid }),
      data.categories.map((_, i) => isGap(data, i) && /* @__PURE__ */ jsx32("rect", { className: "bc-gap", x: cx2(i) - band / 2, y: plot.t, width: band, height: plot.h, fill: `url(#${pid})` }, `g${i}`)),
      ticks.map((v) => /* @__PURE__ */ jsxs30("g", { children: [
        /* @__PURE__ */ jsx32("line", { className: "bc-grid", x1: plot.l, x2: plot.l + plot.w, y1: y(v), y2: y(v) }),
        /* @__PURE__ */ jsx32("text", { className: "bc-ax-t", x: plot.l - 8, y: y(v), dy: "0.32em", textAnchor: "end", children: fmt(v, decimals) })
      ] }, v)),
      /* @__PURE__ */ jsx32("text", { className: "bc-ax-title", x: 4, y: 12, children: data.yLabel ?? data.unit }),
      data.categories.map((c, i) => i % every === 0 && /* @__PURE__ */ jsxs30("text", { className: "bc-ax-t", x: cx2(i), y: plot.t + plot.h + 18, textAnchor: "middle", children: [
        c.length > fit ? /* @__PURE__ */ jsx32("title", { children: c }) : null,
        clip(c, fit)
      ] }, `x${i}`)),
      /* @__PURE__ */ jsx32("text", { className: "bc-ax-title", x: plot.l + plot.w / 2, y: height - 6, textAnchor: "middle", children: data.xLabel }),
      children({ plot, band, cx: cx2, y, lo, hi, decimals, narrow }),
      /* @__PURE__ */ jsx32("line", { className: lo < 0 ? "bc-zero is-strong" : "bc-zero", x1: plot.l, x2: plot.l + plot.w, y1: y(0), y2: y(0) })
    ] }) }),
    note && /* @__PURE__ */ jsx32("p", { className: "bc-chart-note", children: note })
  ] });
}

// react/src/adat/chart/LineChart.tsx
import { Fragment as Fragment7, jsx as jsx33, jsxs as jsxs31 } from "react/jsx-runtime";
function segments(values) {
  const out = [];
  let cur = [];
  values.forEach((v, i) => {
    if (typeof v === "number") cur.push(i);
    else if (cur.length) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
}
var lastIndex = (v) => {
  for (let i = v.length - 1; i >= 0; i--) if (typeof v[i] === "number") return i;
  return -1;
};
var LABEL_MAX = 16;
function LineChart({ data, height = 260, endLabels, label }) {
  const vals2 = allValues(data);
  const showEnd = (narrow) => (endLabels ?? data.series.length <= 4) && !narrow;
  const labW = Math.min(LABEL_MAX, Math.max(...data.series.map((s) => s.label.length), 1)) * CH + 16;
  const many = data.categories.length > 40;
  return /* @__PURE__ */ jsx33(
    Frame,
    {
      data,
      min: Math.min(0, ...vals2),
      max: Math.max(0, ...vals2),
      height,
      minBand: many ? 6 : 16,
      padRight: (narrow) => showEnd(narrow) ? labW : 16,
      label: label ?? `${data.series.map((s) => s.label).join(", ")} (${data.unit})`,
      children: ({ cx: cx2, y, narrow, plot, decimals }) => {
        const d = data.decimals ?? decimals;
        const ends = data.series.map((s, i) => ({ i, at: lastIndex(s.values) })).filter((e) => e.at >= 0).map((e) => ({ ...e, y: y(data.series[e.i].values[e.at]) })).sort((a, b) => a.y - b.y);
        for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 14);
        return /* @__PURE__ */ jsxs31(Fragment7, { children: [
          data.series.map((s, i) => segments(s.values).map((seg, k) => {
            const dPath = seg.map((j, n) => `${n ? "L" : "M"}${cx2(j)} ${y(s.values[j])}`).join("");
            return /* @__PURE__ */ jsxs31("g", { children: [
              /* @__PURE__ */ jsx33("path", { className: "bc-line-under", d: dPath }),
              /* @__PURE__ */ jsx33("path", { className: `bc-line ${sc(i)}`, d: dPath })
            ] }, `${s.key}${k}`);
          })),
          data.series.map((s, i) => s.values.map((v, j) => {
            if (typeof v !== "number") return null;
            const alone = typeof s.values[j - 1] !== "number" && typeof s.values[j + 1] !== "number";
            if (many && !alone && j !== lastIndex(s.values)) return null;
            return /* @__PURE__ */ jsxs31("g", { children: [
              /* @__PURE__ */ jsx33(Marker, { x: cx2(j), y: y(v), i, r: alone ? 6 : 4.5 }),
              /* @__PURE__ */ jsx33("title", { children: `${s.label}, ${data.categories[j]}: ${fmt(v, d)} ${data.unit}` })
            ] }, `${s.key}m${j}`);
          })),
          showEnd(narrow) && ends.map((e) => /* @__PURE__ */ jsx33("text", { className: "bc-end-label", x: Math.min(cx2(e.at) + 10, plot.l + plot.w + 8), y: e.y, dy: "0.32em", children: clip(data.series[e.i].label, LABEL_MAX) }, `e${e.i}`))
        ] });
      }
    }
  );
}

// react/src/adat/chart/ChartCard.tsx
import { jsx as jsx34, jsxs as jsxs32 } from "react/jsx-runtime";
var KEY = (k) => `bc-howto:${k}`;
var readOpen = (k) => {
  if (!k) return true;
  try {
    return localStorage.getItem(KEY(k)) !== "closed";
  } catch {
    return true;
  }
};
function ChartCard(p) {
  const { title, unit, period, help, howToRead, source, data, children, status = "ready", headingLevel = 3 } = p;
  const id = useId9();
  const [howOpen, setHowOpen] = useState14(() => readOpen(p.rememberKey));
  const [tableOpen, setTableOpen] = useState14(false);
  const H = `h${headingLevel}`;
  const empty = status === "ready" && isEmptyData(data);
  const kind = isValidElement(children) && children.type === LineChart ? "line" : "bar";
  const onHow = (open) => {
    setHowOpen(open);
    if (p.rememberKey) try {
      localStorage.setItem(KEY(p.rememberKey), open ? "open" : "closed");
    } catch {
    }
  };
  return /* @__PURE__ */ jsxs32("figure", { className: cx("bc-card", "bc-chart-card", p.className), "aria-labelledby": `${id}-t`, "data-cb": p.cb ? "true" : void 0, children: [
    /* @__PURE__ */ jsx34("header", { className: "bc-chart-head", children: /* @__PURE__ */ jsxs32("div", { className: "bc-chart-titles", children: [
      /* @__PURE__ */ jsxs32("div", { className: "bc-label-row", children: [
        /* @__PURE__ */ jsx34(H, { className: "bc-chart-title", id: `${id}-t`, children: title }),
        /* @__PURE__ */ jsx34(HelpButton, { label: title, children: help })
      ] }),
      /* @__PURE__ */ jsxs32("p", { className: "bc-chart-sub", children: [
        unit,
        " \xB7 ",
        period,
        p.sample && /* @__PURE__ */ jsx34("span", { className: "bc-badge is-muted", children: "mintaadat" })
      ] })
    ] }) }),
    status === "ready" && !empty && /* @__PURE__ */ jsx34(ChartLegend, { data, kind }),
    /* @__PURE__ */ jsx34("div", { className: "bc-chart-body", children: empty ? /* @__PURE__ */ jsx34(EmptyState, { compact: true, title: "Ebben az id\u0151szakban nincs adat", action: p.emptyAction, children: "V\xE1lassz hosszabb vagy m\xE1sik id\u0151szakot." }) : /* @__PURE__ */ jsx34(DataState, { status, what: "a grafikont", error: p.error, onRetry: p.onRetry, skeleton: /* @__PURE__ */ jsx34("span", { className: "bc-skeleton bc-chart-skel" }), children }) }),
    /* @__PURE__ */ jsxs32("details", { className: "bc-disclosure", open: howOpen, onToggle: (e) => onHow(e.currentTarget.open), children: [
      /* @__PURE__ */ jsx34("summary", { children: "Hogyan olvasd?" }),
      /* @__PURE__ */ jsx34("div", { className: "bc-disclosure-body", children: howToRead })
    ] }),
    status === "ready" && !empty && /* @__PURE__ */ jsxs32("details", { className: "bc-disclosure", onToggle: (e) => setTableOpen(e.currentTarget.open), children: [
      /* @__PURE__ */ jsxs32("summary", { children: [
        "Adatt\xE1bla (",
        data.categories.length,
        " sor)"
      ] }),
      /* @__PURE__ */ jsx34("div", { className: "bc-disclosure-body", children: tableOpen && /* @__PURE__ */ jsx34(ChartTable, { data, caption: title }) })
    ] }),
    /* @__PURE__ */ jsxs32("footer", { className: "bc-chart-source", children: [
      "Forr\xE1s: ",
      source
    ] })
  ] });
}

// react/src/adat/chart/HBarChart.tsx
import { useRef as useRef11 } from "react";

// react/src/adat/chart/outlier.ts
function findOutlier(values) {
  const nums = values.map((v, i) => ({ v, i })).filter((x) => typeof x.v === "number" && x.v > 0).sort((a, b) => b.v - a.v);
  if (nums.length < 4 || nums[1].v <= 0 || nums[0].v <= 4 * nums[1].v) return null;
  return { index: nums[0].i, value: nums[0].v, cap: nums[1].v * 1.25 };
}
var outlierNote = (d, o) => `A(z) \u201E${d.categories[o.index]}\u201D \xE9rt\xE9ke (${fmt(o.value, d.decimals ?? 0)} ${d.unit}) kil\xF3g a sk\xE1l\xE1b\xF3l \u2013 lev\xE1gva rajzoltam, hogy a t\xF6bbi is l\xE1tsszon. A pontos sz\xE1m az adatt\xE1bl\xE1ban van.`;

// react/src/adat/chart/HBarChart.tsx
import { jsx as jsx35, jsxs as jsxs33 } from "react/jsx-runtime";
var ROW = 32;
function HBarChart({ data, clipOutlier = true, valueLabels = true, label }) {
  const box = useRef11(null);
  const width = useWidth(box);
  const s = data.series[0] ?? { values: [], label: "" };
  const nums = s.values.filter((v) => typeof v === "number");
  const o = clipOutlier ? findOutlier(s.values) : null;
  const { lo, hi, ticks, decimals } = niceTicks(Math.min(0, ...nums), o ? o.cap : Math.max(0, ...nums), width < 420 ? 3 : 5);
  const d = data.decimals ?? decimals;
  const maxChars = Math.max(...data.categories.map((c) => c.length), 1);
  const labW = Math.min(Math.round(width * 0.4), maxChars * CH + 12);
  const fit = Math.max(4, Math.floor((labW - 12) / CH));
  const valW = Math.max(...nums.map((v) => fmt(v, d).length), 1) * CH + 10;
  const t = 28, b = 44, l = labW, r = valueLabels ? valW : 16;
  const h = t + b + data.categories.length * ROW;
  const pw = Math.max(20, width - l - r);
  const x = linear(lo, hi, l, l + pw);
  return /* @__PURE__ */ jsxs33("div", { className: "bc-chart", ref: box, children: [
    width > 0 && /* @__PURE__ */ jsxs33("svg", { width, height: h, viewBox: `0 0 ${width} ${h}`, role: "img", "aria-label": `${label ?? `${s.label} (${data.unit})`}. A pontos sz\xE1mok az adatt\xE1bl\xE1ban.`, children: [
      /* @__PURE__ */ jsx35("text", { className: "bc-ax-title", x: 4, y: 14, children: data.xLabel }),
      ticks.map((v) => /* @__PURE__ */ jsxs33("g", { children: [
        /* @__PURE__ */ jsx35("line", { className: "bc-grid", x1: x(v), x2: x(v), y1: t, y2: h - b }),
        /* @__PURE__ */ jsx35("text", { className: "bc-ax-t", x: x(v), y: h - b + 18, textAnchor: "middle", children: fmt(v, decimals) })
      ] }, v)),
      /* @__PURE__ */ jsx35("text", { className: "bc-ax-title", x: l + pw / 2, y: h - 6, textAnchor: "middle", children: data.yLabel ?? data.unit }),
      data.categories.map((c, i) => {
        const v = s.values[i], yy = t + i * ROW, bh = ROW - 10;
        const cut = o?.index === i;
        return /* @__PURE__ */ jsxs33("g", { children: [
          /* @__PURE__ */ jsxs33("text", { className: "bc-ax-t is-cat", x: l - 8, y: yy + ROW / 2, dy: "0.32em", textAnchor: "end", children: [
            c.length > fit ? /* @__PURE__ */ jsx35("title", { children: c }) : null,
            clip(c, fit)
          ] }),
          v === null || v === void 0 ? /* @__PURE__ */ jsx35("text", { className: "bc-ax-t is-gap", x: x(0) + 6, y: yy + ROW / 2, dy: "0.32em", children: data.gapLabel ?? "nincs adat" }) : v === 0 ? /* @__PURE__ */ jsx35("line", { className: `bc-mark-zero ${sc(0)}`, x1: x(0), x2: x(0), y1: yy + 5, y2: yy + 5 + bh }) : /* @__PURE__ */ jsx35("rect", { className: `bc-mark ${sc(0)}`, x: x(Math.min(0, v)), y: yy + 5, height: bh, width: Math.max(1, (cut ? l + pw : x(Math.max(0, v))) - x(Math.min(0, v))), children: /* @__PURE__ */ jsx35("title", { children: `${c}: ${fmt(v, d)} ${data.unit}` }) }),
          cut && /* @__PURE__ */ jsx35("path", { className: "bc-break", d: `M${l + pw - 14} ${yy + 2}l6 ${bh / 2 + 3}l-6 ${bh / 2 + 3}` }),
          valueLabels && typeof v === "number" && /* @__PURE__ */ jsx35("text", { className: "bc-val", x: v < 0 ? x(v) - 4 : cut ? l + pw + 4 : x(v) + 4, y: yy + ROW / 2, dy: "0.32em", textAnchor: v < 0 ? "end" : "start", children: fmt(v, d) })
        ] }, i);
      }),
      /* @__PURE__ */ jsx35("line", { className: lo < 0 ? "bc-zero is-strong" : "bc-zero", x1: x(0), x2: x(0), y1: t, y2: h - b })
    ] }),
    o && /* @__PURE__ */ jsx35("p", { className: "bc-chart-note", children: outlierNote(data, o) })
  ] });
}

// react/src/adat/chart/BarChart.tsx
import { jsx as jsx36, jsxs as jsxs34 } from "react/jsx-runtime";
function BarChart(p) {
  if (p.orientation === "horizontal") return /* @__PURE__ */ jsx36(HBarChart, { ...p });
  const { data, height = 240, clipOutlier = true } = p;
  const s = data.series[0] ?? { values: [], label: "" };
  const nums = s.values.filter((v) => typeof v === "number");
  const o = clipOutlier ? findOutlier(s.values) : null;
  const max = o ? o.cap : Math.max(0, ...nums);
  const label = p.label ?? `${s.label} (${data.unit})`;
  return /* @__PURE__ */ jsx36(Frame, { data, min: Math.min(0, ...nums), max, height, minBand: 20, label, note: o ? outlierNote(data, o) : void 0, children: ({ band, cx: cx2, y, plot, narrow, decimals }) => {
    const bw = Math.min(48, Math.max(4, band * 0.68));
    const showVals = p.valueLabels ?? (data.categories.length <= 16 && !narrow);
    const tips = data.categories.length <= 40;
    return s.values.map((v, i) => {
      if (v === null || v === void 0) return null;
      const x = cx2(i) - bw / 2;
      const d = data.decimals ?? decimals;
      if (v === 0) return /* @__PURE__ */ jsx36("line", { className: `bc-mark-zero ${sc(0)}`, x1: x, x2: x + bw, y1: y(0), y2: y(0), children: /* @__PURE__ */ jsx36("title", { children: `${data.categories[i]}: 0 ${data.unit}` }) }, i);
      const cut = o?.index === i;
      const top = cut ? plot.t : y(Math.max(0, v)), bottom = y(Math.min(0, v));
      return /* @__PURE__ */ jsxs34("g", { children: [
        /* @__PURE__ */ jsx36("rect", { className: `bc-mark ${sc(0)}`, x, y: top, width: bw, height: Math.max(1, bottom - top), children: tips && /* @__PURE__ */ jsx36("title", { children: `${data.categories[i]}: ${fmt(v, d)} ${data.unit}` }) }),
        cut && /* @__PURE__ */ jsx36("path", { className: "bc-break", d: `M${x - 3} ${plot.t + 12}l${bw / 2 + 3} -6l${bw / 2 + 3} 6` }),
        (showVals || cut) && /* @__PURE__ */ jsx36("text", { className: "bc-val", x: cx2(i), y: v < 0 ? bottom + 14 : top - 6, textAnchor: "middle", children: cut ? `\u2191 ${fmt(v, d)}` : fmt(v, d) })
      ] }, i);
    });
  } });
}

// react/src/adat/chart/ColumnCharts.tsx
import { jsx as jsx37 } from "react/jsx-runtime";
var name = (d, l) => l ?? `${d.series.map((s) => s.label).join(", ")} (${d.unit})`;
var tip = (d, si, i, v, dec) => `${d.series[si].label}, ${d.categories[i]}: ${fmt(v, dec)} ${d.unit}`;
function GroupedBarChart({ data, height = 240, label }) {
  const vals2 = allValues(data);
  const k = Math.max(1, data.series.length);
  return /* @__PURE__ */ jsx37(Frame, { data, min: Math.min(0, ...vals2), max: Math.max(0, ...vals2), height, minBand: k * 10 + 10, label: name(data, label), children: ({ band, cx: cx2, y, decimals }) => {
    const gw = Math.min(k * 28, band * 0.8), bw = gw / k, dec = data.decimals ?? decimals;
    return data.categories.map((_, i) => data.series.map((s, si) => {
      const v = s.values[i];
      if (typeof v !== "number") return null;
      const x = cx2(i) - gw / 2 + si * bw;
      if (v === 0) return /* @__PURE__ */ jsx37("line", { className: `bc-mark-zero ${sc(si)}`, x1: x, x2: x + bw, y1: y(0), y2: y(0) }, `${i}-${si}`);
      const top = y(Math.max(0, v)), bottom = y(Math.min(0, v));
      return /* @__PURE__ */ jsx37("rect", { className: `bc-mark ${sc(si)}`, x, y: top, width: Math.max(1, bw), height: Math.max(1, bottom - top), children: /* @__PURE__ */ jsx37("title", { children: tip(data, si, i, v, dec) }) }, `${i}-${si}`);
    }));
  } });
}
function StackedBarChart({ data, height = 240, label }) {
  const sums = data.categories.map((_, i) => data.series.reduce((a, s) => a + Math.max(0, s.values[i] ?? 0), 0));
  const neg = data.series.some((s) => s.values.some((v) => typeof v === "number" && v < 0));
  return /* @__PURE__ */ jsx37(
    Frame,
    {
      data,
      min: 0,
      max: Math.max(0, ...sums),
      height,
      minBand: 20,
      label: name(data, label),
      note: neg ? "Halmozott oszlopon negat\xEDv r\xE9sz nem \xE1br\xE1zolhat\xF3 \u2013 azokat kihagytam, az adatt\xE1bl\xE1ban megvannak." : void 0,
      children: ({ band, cx: cx2, y, decimals }) => {
        const bw = Math.min(48, Math.max(4, band * 0.68)), dec = data.decimals ?? decimals;
        return data.categories.map((_, i) => {
          if (data.series.some((s) => s.values[i] === null || s.values[i] === void 0)) return null;
          let acc = 0;
          return data.series.map((s, si) => {
            const v = s.values[i];
            if (v <= 0) return null;
            const y0 = y(acc), y1 = y(acc + v);
            acc += v;
            return /* @__PURE__ */ jsx37("rect", { className: `bc-mark ${sc(si)}`, x: cx2(i) - bw / 2, y: y1, width: bw, height: Math.max(1, y0 - y1), children: /* @__PURE__ */ jsx37("title", { children: tip(data, si, i, v, dec) }) }, `${i}-${si}`);
          });
        });
      }
    }
  );
}

// react/src/adat/chart/HeatLegend.tsx
import { jsx as jsx38, jsxs as jsxs35 } from "react/jsx-runtime";
function HeatLegend({ label, unit, thresholds, min = 1, decimals = 0, className }) {
  const t = thresholds.slice(0, 4);
  const step = decimals ? 10 ** -decimals : 1;
  const bins = [...t.map((hi, i) => `${fmt(i ? t[i - 1] + step : min, decimals)}\u2013${fmt(hi, decimals)}`), `${fmt((t[t.length - 1] ?? min) + step, decimals)}+`];
  return /* @__PURE__ */ jsxs35("figure", { className: cx("bc-heatkey", className), children: [
    /* @__PURE__ */ jsxs35("figcaption", { className: "bc-heatkey-title", children: [
      label,
      " ",
      /* @__PURE__ */ jsxs35("span", { className: "bc-muted", children: [
        "(",
        unit,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsx38("ul", { className: "bc-heatkey-bins", children: bins.map((b, i) => /* @__PURE__ */ jsxs35("li", { className: `bc-q${i + 1 + (5 - bins.length)}`, children: [
      /* @__PURE__ */ jsx38("span", { className: "bc-heatkey-sw", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx38("span", { children: b })
    ] }, b)) })
  ] });
}

// react/src/adat/index.ts
import { createColumnHelper } from "@tanstack/react-table";

// react/src/reteg/Modal.tsx
import * as Dialog2 from "@radix-ui/react-dialog";
import { useRef as useRef14 } from "react";

// react/src/reteg/layer.ts
import { useSyncExternalStore } from "react";
function keepToasts(e) {
  if (e.target instanceof Element && e.target.closest(".bc-toaster")) e.preventDefault();
}
function useMedia(query) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

// react/src/reteg/focus.ts
import { useRef as useRef12 } from "react";
var TABBABLE = 'input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
function firstTabbable(root) {
  return root ? [...root.querySelectorAll(TABBABLE)].find((el) => el.offsetParent !== null || el.getClientRects().length > 0) ?? null : null;
}
function firstField(root) {
  const fields = root ? [...root.querySelectorAll("input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled])")] : [];
  return fields.find((el) => el.getClientRects().length > 0) ?? firstTabbable(root);
}
function useReturnFocus() {
  const opener = useRef12(null);
  return {
    remember() {
      let el = document.activeElement;
      const menu = el?.closest("[role=menu]");
      if (menu?.id) el = document.querySelector(`[aria-controls="${menu.id}"]`) ?? el;
      if (el && el !== document.body) opener.current = el;
    },
    restore(e) {
      const el = opener.current;
      if (el && el.isConnected) {
        e.preventDefault();
        el.focus();
      }
    }
  };
}

// react/src/reteg/guard.tsx
import { createContext as createContext2, useContext as useContext2, useState as useState16 } from "react";

// react/src/reteg/ConfirmDialog.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useRef as useRef13, useState as useState15 } from "react";
import { jsx as jsx39, jsxs as jsxs36 } from "react/jsx-runtime";
var defaultError = (e) => `Nem siker\xFClt${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra.`;
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel,
  confirmIcon,
  cancelLabel = "M\xE9gse",
  danger,
  onConfirm,
  confirmDisabled,
  errorText: errorText2 = defaultError,
  initialFocus = "cancel",
  extra,
  size = "sm",
  className
}) {
  const [busy, setBusy] = useState15(false);
  const [error, setError] = useState15(null);
  const cancelRef = useRef13(null);
  const focus = useReturnFocus();
  const change = (next) => {
    if (busy && !next) return;
    if (!next) setError(null);
    onOpenChange(next);
  };
  const run = async () => {
    if (busy || confirmDisabled) return;
    setError(null);
    try {
      const r = onConfirm();
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      onOpenChange(false);
    } catch (e) {
      setBusy(false);
      setError(errorText2(e));
    }
  };
  return /* @__PURE__ */ jsx39(Dialog.Root, { open, onOpenChange: change, children: /* @__PURE__ */ jsx39(Dialog.Portal, { children: /* @__PURE__ */ jsx39(Dialog.Overlay, { className: "bc-scrim", children: /* @__PURE__ */ jsxs36(
    Dialog.Content,
    {
      role: "alertdialog",
      ...children ? {} : { "aria-describedby": void 0 },
      className: cx("bc-modal is-layer", size === "sm" && "is-sm", className),
      onOpenAutoFocus: (e) => {
        focus.remember();
        e.preventDefault();
        const target = initialFocus === "cancel" ? cancelRef.current : initialFocus();
        (target ?? cancelRef.current)?.focus();
      },
      onCloseAutoFocus: focus.restore,
      onPointerDownOutside: (e) => e.preventDefault(),
      onInteractOutside: keepToasts,
      onEscapeKeyDown: (e) => {
        if (busy) e.preventDefault();
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
          void run();
        }
      },
      children: [
        /* @__PURE__ */ jsx39("div", { className: "bc-modal-head", children: /* @__PURE__ */ jsx39(Dialog.Title, { asChild: true, children: /* @__PURE__ */ jsx39("h2", { children: title }) }) }),
        /* @__PURE__ */ jsxs36("div", { className: "bc-modal-body", children: [
          children && /* @__PURE__ */ jsx39(Dialog.Description, { asChild: true, children: typeof children === "string" ? /* @__PURE__ */ jsx39("p", { children }) : /* @__PURE__ */ jsx39("div", { children }) }),
          extra,
          error && /* @__PURE__ */ jsx39("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx39("p", { children: error }) })
        ] }),
        /* @__PURE__ */ jsxs36("div", { className: "bc-modal-foot", children: [
          /* @__PURE__ */ jsx39(Button, { ref: cancelRef, variant: "secondary", disabled: busy, onClick: () => change(false), children: cancelLabel }),
          /* @__PURE__ */ jsx39(Button, { variant: danger ? "danger" : "primary", busy, disabled: confirmDisabled, icon: confirmIcon ?? (danger ? /* @__PURE__ */ jsx39(IcTrash, {}) : /* @__PURE__ */ jsx39(IcOk, {})), onClick: () => void run(), children: confirmLabel })
        ] })
      ]
    }
  ) }) }) });
}

// react/src/reteg/guard.tsx
import { jsx as jsx40 } from "react/jsx-runtime";
var LayerCloseContext = createContext2(() => void 0);
var useLayerClose = () => useContext2(LayerCloseContext);
function useCloseGuard({ onOpenChange, dirty, busy }) {
  const [asking, setAsking] = useState16(false);
  const change = (next) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    if (busy) return;
    if (dirty) {
      setAsking(true);
      return;
    }
    onOpenChange(false);
  };
  const discardDialog = /* @__PURE__ */ jsx40(
    ConfirmDialog,
    {
      open: asking,
      onOpenChange: setAsking,
      title: "Elveted a m\xF3dos\xEDt\xE1sokat?",
      danger: true,
      confirmLabel: "Elvet\xE9s",
      cancelLabel: "Folytatom a szerkeszt\xE9st",
      onConfirm: () => onOpenChange(false),
      children: "A mentetlen m\xF3dos\xEDt\xE1said elvesznek. Ha meg akarod tartani \u0151ket, folytasd a szerkeszt\xE9st, \xE9s mentsd el."
    }
  );
  return { change, requestClose: () => change(false), discardDialog };
}

// react/src/reteg/Modal.tsx
import { jsx as jsx41, jsxs as jsxs37 } from "react/jsx-runtime";
function Modal({ open, onOpenChange, title, description, size = "md", footer, busy, dirty, initialFocus, closeLabel = "Bez\xE1r\xE1s", className, children }) {
  const guard = useCloseGuard({ onOpenChange, dirty, busy });
  const body = useRef14(null);
  const focus = useReturnFocus();
  return /* @__PURE__ */ jsx41(Dialog2.Root, { open, onOpenChange: guard.change, children: /* @__PURE__ */ jsx41(Dialog2.Portal, { children: /* @__PURE__ */ jsx41(Dialog2.Overlay, { className: "bc-scrim", children: /* @__PURE__ */ jsx41(
    Dialog2.Content,
    {
      className: cx("bc-modal is-layer", size !== "md" && `is-${size}`, className),
      ...description ? {} : { "aria-describedby": void 0 },
      onOpenAutoFocus: (e) => {
        focus.remember();
        const target = initialFocus?.() ?? firstField(body.current) ?? firstTabbable(body.current?.nextElementSibling);
        if (target) {
          e.preventDefault();
          target.focus();
        }
      },
      onCloseAutoFocus: focus.restore,
      onInteractOutside: keepToasts,
      children: /* @__PURE__ */ jsxs37(LayerCloseContext.Provider, { value: guard.requestClose, children: [
        /* @__PURE__ */ jsxs37("div", { className: "bc-modal-head", children: [
          /* @__PURE__ */ jsxs37("div", { className: "bc-layer-titles", children: [
            /* @__PURE__ */ jsx41(Dialog2.Title, { asChild: true, children: /* @__PURE__ */ jsx41("h2", { children: title }) }),
            description && /* @__PURE__ */ jsx41(Dialog2.Description, { className: "bc-layer-desc", children: description })
          ] }),
          /* @__PURE__ */ jsx41(IconButton, { "aria-label": closeLabel, disabled: busy, onClick: guard.requestClose, children: /* @__PURE__ */ jsx41(CloseIcon, {}) })
        ] }),
        /* @__PURE__ */ jsx41("div", { className: "bc-modal-body", ref: body, children }),
        footer && /* @__PURE__ */ jsx41("div", { className: "bc-modal-foot", children: footer }),
        guard.discardDialog
      ] })
    }
  ) }) }) });
}
function ModalCancel({ children = "M\xE9gse", disabled }) {
  const close = useLayerClose();
  return /* @__PURE__ */ jsx41(Button, { variant: "secondary", disabled, onClick: close, children });
}
function CloseIcon() {
  return /* @__PURE__ */ jsx41("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx41("path", { d: "M6 6l12 12M18 6L6 18" }) });
}

// react/src/reteg/TypeToConfirm.tsx
import { useRef as useRef15, useState as useState17 } from "react";
import { jsx as jsx42, jsxs as jsxs38 } from "react/jsx-runtime";
var same = (a, b, isCount) => isCount ? a.replace(/\s/g, "") === b : norm(a.trim().replace(/\s+/g, " ")) === norm(b.trim().replace(/\s+/g, " "));
function TypeToConfirm({ count, name: name2, prompt, impactLoading, impactError, onRetry, open, onOpenChange, ...rest }) {
  const [typed, setTyped] = useState17("");
  const input = useRef15(null);
  const isCount = count !== void 0;
  const expected = isCount ? String(count) : name2 ?? "";
  const match = expected !== "" && same(typed, expected, isCount);
  const label = prompt ?? (isCount ? "\xCDrd be a t\xF6rlend\u0151 elemek sz\xE1m\xE1t" : "\xCDrd be a nev\xE9t");
  return /* @__PURE__ */ jsx42(
    ConfirmDialog,
    {
      size: "md",
      ...rest,
      open,
      danger: true,
      onOpenChange: (o) => {
        if (!o) setTyped("");
        onOpenChange(o);
      },
      confirmDisabled: !match || impactLoading || Boolean(impactError),
      initialFocus: () => input.current,
      extra: /* @__PURE__ */ jsxs38("div", { className: "bc-stack", children: [
        impactLoading && /* @__PURE__ */ jsxs38("p", { className: "bc-muted", role: "status", children: [
          /* @__PURE__ */ jsx42("span", { className: "bc-spinner", "aria-hidden": "true" }),
          " \xD6sszeszedem, mi t\xF6rl\u0151dik m\xE9g vele\u2026"
        ] }),
        impactError && /* @__PURE__ */ jsxs38("div", { className: "bc-alert is-danger", role: "alert", children: [
          /* @__PURE__ */ jsxs38("p", { children: [
            impactError,
            " Am\xEDg nem l\xE1tod, mi t\xF6rl\u0151dik vele, nem t\xF6r\xF6lhetsz."
          ] }),
          onRetry && /* @__PURE__ */ jsx42(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
        ] }),
        /* @__PURE__ */ jsx42(
          TextField,
          {
            ref: input,
            label,
            inputMode: isCount ? "numeric" : "text",
            autoComplete: "off",
            spellCheck: false,
            help: "\xCDgy ellen\u0151rizz\xFCk, hogy t\xE9nyleg ezt akarod. A v\xE9gleges t\xF6rl\xE9s nem vonhat\xF3 vissza.",
            range: `Ezt \xEDrd be: ${expected}`,
            value: typed,
            onChange: (e) => setTyped(e.target.value),
            notice: match ? "Egyezik \u2013 most m\xE1r t\xF6r\xF6lhetsz." : void 0
          }
        )
      ] })
    }
  );
}

// react/src/reteg/Drawer.tsx
import * as Dialog3 from "@radix-ui/react-dialog";
import { useRef as useRef16 } from "react";
import { jsx as jsx43, jsxs as jsxs39 } from "react/jsx-runtime";
function Drawer({ open, onOpenChange, title, description, size = "md", footer, busy, dirty, initialFocus, closeLabel = "Panel bez\xE1r\xE1sa", className, children }) {
  const guard = useCloseGuard({ onOpenChange, dirty, busy });
  const focus = useReturnFocus();
  const head = useRef16(null);
  return /* @__PURE__ */ jsx43(Dialog3.Root, { open, onOpenChange: guard.change, children: /* @__PURE__ */ jsxs39(Dialog3.Portal, { children: [
    /* @__PURE__ */ jsx43(Dialog3.Overlay, { className: "bc-scrim is-drawer" }),
    /* @__PURE__ */ jsx43(
      Dialog3.Content,
      {
        className: cx("bc-drawer", size === "wide" && "is-wide", className),
        ...description ? {} : { "aria-describedby": void 0 },
        onOpenAutoFocus: (e) => {
          focus.remember();
          const target = initialFocus?.() ?? firstTabbable(head.current);
          if (target) {
            e.preventDefault();
            target.focus();
          }
        },
        onCloseAutoFocus: focus.restore,
        onInteractOutside: keepToasts,
        children: /* @__PURE__ */ jsxs39(LayerCloseContext.Provider, { value: guard.requestClose, children: [
          /* @__PURE__ */ jsxs39("div", { className: "bc-drawer-head", ref: head, children: [
            /* @__PURE__ */ jsxs39("div", { className: "bc-layer-titles", children: [
              /* @__PURE__ */ jsx43(Dialog3.Title, { asChild: true, children: /* @__PURE__ */ jsx43("h2", { children: title }) }),
              description && /* @__PURE__ */ jsx43(Dialog3.Description, { className: "bc-layer-desc", children: description })
            ] }),
            /* @__PURE__ */ jsx43(IconButton, { "aria-label": closeLabel, disabled: busy, onClick: guard.requestClose, children: /* @__PURE__ */ jsx43(CloseIcon, {}) })
          ] }),
          /* @__PURE__ */ jsx43("div", { className: "bc-drawer-body", children }),
          footer && /* @__PURE__ */ jsx43("div", { className: "bc-drawer-foot", children: footer }),
          guard.discardDialog
        ] })
      }
    )
  ] }) });
}

// react/src/reteg/useQueryParam.ts
import { useCallback as useCallback2, useSyncExternalStore as useSyncExternalStore2 } from "react";
var EVT = "bc-query-change";
var subscribe = (cb) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVT, cb);
  };
};
function useQueryParam(name2) {
  const value = useSyncExternalStore2(subscribe, () => new URLSearchParams(window.location.search).get(name2), () => null);
  const set = useCallback2((next) => {
    const url = new URL(window.location.href);
    if (next === null) url.searchParams.delete(name2);
    else url.searchParams.set(name2, next);
    if (url.href === window.location.href) return;
    const st = window.history.state;
    if (next === null && st?.bcQ === name2) {
      window.history.back();
      return;
    }
    if (next === null) window.history.replaceState(st, "", url);
    else window.history.pushState({ ...st ?? {}, bcQ: name2 }, "", url);
    window.dispatchEvent(new Event(EVT));
  }, [name2]);
  return [value, set];
}

// react/src/reteg/Tooltip.tsx
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef as forwardRef8, useRef as useRef17, useState as useState18 } from "react";
import { jsx as jsx44, jsxs as jsxs40 } from "react/jsx-runtime";
var lastTab = 0;
if (typeof document !== "undefined") document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") lastTab = Date.now();
}, true);
var TooltipIconButton = forwardRef8(function TooltipIconButton2({ label, children, side = "top", onBlur, onClick, onKeyDown, onPointerDown, ...rest }, ref) {
  const [open, setOpen] = useState18(false);
  const pointer = useRef17(false);
  const hover = useRef17(void 0);
  return /* @__PURE__ */ jsx44(TooltipPrimitive.Provider, { delayDuration: 500, skipDelayDuration: 300, children: /* @__PURE__ */ jsxs40(TooltipPrimitive.Root, { open, onOpenChange: (o) => {
    if (!o) setOpen(false);
  }, children: [
    /* @__PURE__ */ jsx44(TooltipPrimitive.Trigger, { asChild: true, "aria-describedby": void 0, children: /* @__PURE__ */ jsx44(
      IconButton,
      {
        ref,
        "aria-label": label,
        ...rest,
        onPointerDown: (e) => {
          pointer.current = true;
          clearTimeout(hover.current);
          setOpen(false);
          onPointerDown?.(e);
        },
        onPointerEnter: (e) => {
          if (e.pointerType === "mouse") {
            clearTimeout(hover.current);
            hover.current = setTimeout(() => setOpen(true), 500);
          }
        },
        onPointerLeave: () => {
          pointer.current = false;
          clearTimeout(hover.current);
          setOpen(false);
        },
        onFocus: () => {
          if (!pointer.current && Date.now() - lastTab < 300) setOpen(true);
        },
        onBlur: (e) => {
          setOpen(false);
          pointer.current = false;
          onBlur?.(e);
        },
        onClick: (e) => {
          setOpen(false);
          onClick?.(e);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Escape") setOpen(false);
          onKeyDown?.(e);
        },
        children
      }
    ) }),
    /* @__PURE__ */ jsx44(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx44(TooltipPrimitive.Content, { className: "bc-tooltip", side, sideOffset: 6, collisionPadding: 8, "aria-hidden": "true", children: label }) })
  ] }) });
});

// react/src/reteg/DropdownMenu.tsx
import * as DM from "@radix-ui/react-dropdown-menu";
import { Fragment as Fragment8, jsx as jsx45, jsxs as jsxs41 } from "react/jsx-runtime";
function DropdownMenu({ trigger, items, label, align = "end", header }) {
  return /* @__PURE__ */ jsxs41(DM.Root, { children: [
    /* @__PURE__ */ jsx45(DM.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsx45(DM.Portal, { children: /* @__PURE__ */ jsxs41(DM.Content, { className: "bc-menu", align, sideOffset: 6, collisionPadding: 16, loop: true, "aria-label": label, children: [
      header && /* @__PURE__ */ jsx45("div", { className: "bc-menu-header", children: header }),
      /* @__PURE__ */ jsx45(Entries, { items })
    ] }) })
  ] });
}
function Entries({ items }) {
  return /* @__PURE__ */ jsx45(Fragment8, { children: items.map((it, i) => {
    if (it === "separator") return /* @__PURE__ */ jsx45(DM.Separator, { className: "bc-menu-sep" }, `s${i}`);
    if ("group" in it) return /* @__PURE__ */ jsx45(DM.Label, { className: "bc-menu-label", children: it.group }, `g${i}`);
    if (it.items) {
      return /* @__PURE__ */ jsxs41(DM.Sub, { children: [
        /* @__PURE__ */ jsxs41(DM.SubTrigger, { className: "bc-menu-item", disabled: it.disabled, children: [
          it.icon && /* @__PURE__ */ jsx45("span", { className: "bc-menu-icon", "aria-hidden": "true", children: it.icon }),
          /* @__PURE__ */ jsx45("span", { className: "bc-menu-text", children: it.label }),
          /* @__PURE__ */ jsx45("span", { className: "bc-menu-right", "aria-hidden": "true", children: "\u203A" })
        ] }),
        /* @__PURE__ */ jsx45(DM.Portal, { children: /* @__PURE__ */ jsx45(DM.SubContent, { className: "bc-menu", sideOffset: 4, collisionPadding: 16, loop: true, children: /* @__PURE__ */ jsx45(Entries, { items: it.items }) }) })
      ] }, it.label);
    }
    return /* @__PURE__ */ jsxs41(DM.Item, { className: cx("bc-menu-item", it.danger && "is-danger"), disabled: it.disabled, onSelect: it.onSelect, children: [
      it.icon && /* @__PURE__ */ jsx45("span", { className: "bc-menu-icon", "aria-hidden": "true", children: it.icon }),
      /* @__PURE__ */ jsxs41("span", { className: "bc-menu-text", children: [
        it.label,
        it.disabled && it.disabledReason && /* @__PURE__ */ jsx45("small", { className: "bc-menu-reason", children: it.disabledReason })
      ] }),
      it.shortcut && /* @__PURE__ */ jsx45("kbd", { className: "bc-menu-right", children: it.shortcut })
    ] }, it.label);
  }) });
}

// react/src/reteg/RowActions.tsx
import { jsx as jsx46, jsxs as jsxs42 } from "react/jsx-runtime";
function RowActions({ actions, rowLabel }) {
  const inline = (a) => /* @__PURE__ */ jsx46(
    TooltipIconButton,
    {
      label: a.label,
      danger: a.danger,
      disabled: a.disabled,
      title: a.disabled ? a.disabledReason : void 0,
      onClick: a.onSelect,
      children: a.icon
    },
    a.label
  );
  if (actions.length <= 2) return /* @__PURE__ */ jsx46("div", { className: "bc-row-actions", children: actions.map(inline) });
  const main = actions.find((a) => a.primary) ?? actions.find((a) => !a.danger) ?? actions[0];
  const rest = actions.filter((a) => a !== main);
  const safe = rest.filter((a) => !a.danger), risky = rest.filter((a) => a.danger);
  const entry = (a) => ({ label: a.label, icon: a.icon, onSelect: a.onSelect, danger: a.danger, disabled: a.disabled, disabledReason: a.disabledReason });
  const items = [...safe.map(entry), ...safe.length && risky.length ? ["separator"] : [], ...risky.map(entry)];
  return /* @__PURE__ */ jsxs42("div", { className: "bc-row-actions", children: [
    inline(main),
    /* @__PURE__ */ jsx46(
      DropdownMenu,
      {
        items,
        label: `M\u0171veletek: ${rowLabel}`,
        trigger: /* @__PURE__ */ jsx46(IconButton, { "aria-label": `Tov\xE1bbi m\u0171veletek: ${rowLabel}`, children: /* @__PURE__ */ jsx46(MoreIcon, {}) })
      }
    )
  ] });
}
function MoreIcon() {
  return /* @__PURE__ */ jsxs42("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx46("circle", { cx: "5", cy: "12", r: "2" }),
    /* @__PURE__ */ jsx46("circle", { cx: "12", cy: "12", r: "2" }),
    /* @__PURE__ */ jsx46("circle", { cx: "19", cy: "12", r: "2" })
  ] });
}

// react/src/reteg/Tabs.tsx
import * as T from "@radix-ui/react-tabs";
import { useState as useState19 } from "react";

// react/src/reteg/useScrollFade.ts
import { useEffect as useEffect8, useRef as useRef18 } from "react";
function useScrollFade(selected, dep) {
  const ref = useRef18(null);
  useEffect8(() => {
    const wrap = ref.current;
    const row = wrap?.firstElementChild;
    if (!wrap || !row) return;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      wrap.toggleAttribute("data-fade-start", row.scrollLeft > 2);
      wrap.toggleAttribute("data-fade-end", max - row.scrollLeft > 2);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);
  useEffect8(() => {
    const reveal = () => {
      const row = ref.current?.firstElementChild;
      const el = row?.querySelector(selected);
      if (!row || !el) return;
      const l = el.offsetLeft - row.offsetLeft, r = l + el.offsetWidth;
      if (l < row.scrollLeft || el.offsetWidth > row.clientWidth) row.scrollLeft = l - 16;
      else if (r > row.scrollLeft + row.clientWidth) row.scrollLeft = r - row.clientWidth + 16;
    };
    reveal();
    let live = true;
    void document.fonts?.ready.then(() => {
      if (live) reveal();
    });
    return () => {
      live = false;
    };
  }, [dep, selected]);
  return ref;
}

// react/src/reteg/Tabs.tsx
import { Fragment as Fragment9, jsx as jsx47, jsxs as jsxs43 } from "react/jsx-runtime";
function TabCount({ n }) {
  return /* @__PURE__ */ jsxs43(Fragment9, { children: [
    /* @__PURE__ */ jsxs43("span", { className: "bc-sr", children: [
      " (",
      n,
      ")"
    ] }),
    /* @__PURE__ */ jsx47("span", { className: "bc-tab-count", "aria-hidden": "true", children: n })
  ] });
}
function Tabs({ items, label, value, defaultValue, onValueChange }) {
  const [inner, setInner] = useState19(defaultValue ?? items.find((i) => !i.disabled)?.value ?? "");
  const current = value ?? inner;
  const wrap = useScrollFade('[aria-selected="true"]', current);
  return /* @__PURE__ */ jsxs43(T.Root, { className: "bc-tabs-root", value: current, onValueChange: (v) => {
    setInner(v);
    onValueChange?.(v);
  }, children: [
    /* @__PURE__ */ jsx47("div", { className: "bc-tabs-wrap", ref: wrap, children: /* @__PURE__ */ jsx47(T.List, { className: "bc-tabs", "aria-label": label, children: items.map((it) => /* @__PURE__ */ jsxs43(T.Trigger, { value: it.value, disabled: it.disabled, className: "bc-tab", title: it.label.length > 28 ? it.label : void 0, children: [
      /* @__PURE__ */ jsx47("span", { className: "bc-tab-text", children: it.label }),
      it.count !== void 0 && /* @__PURE__ */ jsx47(TabCount, { n: it.count })
    ] }, it.value)) }) }),
    items.map((it) => /* @__PURE__ */ jsx47(T.Content, { value: it.value, className: "bc-tab-panel", children: it.content }, it.value))
  ] });
}

// react/src/reteg/NavTabs.tsx
import { Fragment as Fragment10 } from "react";
import { Fragment as Fragment11, jsx as jsx48, jsxs as jsxs44 } from "react/jsx-runtime";
var defaultLink = ({ href, ...p }) => /* @__PURE__ */ jsx48("a", { href, ...p });
function NavTabs({ items, label, renderLink = defaultLink }) {
  const cur = items.findIndex((i) => i.current);
  const wrap = useScrollFade('[aria-current="page"]', cur);
  return /* @__PURE__ */ jsx48("nav", { "aria-label": label, children: /* @__PURE__ */ jsx48("div", { className: "bc-tabs-wrap", ref: wrap, children: /* @__PURE__ */ jsx48("div", { className: "bc-tabs", children: items.map((it) => /* @__PURE__ */ jsx48(Fragment10, { children: renderLink({
    href: it.href,
    className: "bc-tab",
    "aria-current": it.current ? "page" : void 0,
    children: /* @__PURE__ */ jsxs44(Fragment11, { children: [
      /* @__PURE__ */ jsx48("span", { className: "bc-tab-text", title: it.label.length > 28 ? it.label : void 0, children: it.label }),
      it.count !== void 0 && /* @__PURE__ */ jsx48(TabCount, { n: it.count })
    ] })
  }) }, it.href)) }) }) });
}

// react/src/reteg/Accordion.tsx
import * as A from "@radix-ui/react-accordion";
import { jsx as jsx49, jsxs as jsxs45 } from "react/jsx-runtime";
function Accordion(props) {
  const { items, headingLevel = 3 } = props;
  const H = `h${headingLevel}`;
  const list2 = items.map((it) => /* @__PURE__ */ jsxs45(A.Item, { value: it.value, disabled: it.disabled, className: "bc-acc-item", children: [
    /* @__PURE__ */ jsx49(A.Header, { asChild: true, children: /* @__PURE__ */ jsx49(H, { className: "bc-acc-h", children: /* @__PURE__ */ jsxs45(A.Trigger, { className: "bc-acc-trigger", children: [
      /* @__PURE__ */ jsx49("span", { children: it.title }),
      /* @__PURE__ */ jsx49("svg", { className: "bc-acc-chev", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", "aria-hidden": "true", children: /* @__PURE__ */ jsx49("path", { d: "M6 9l6 6 6-6" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx49(A.Content, { className: "bc-acc-content", children: /* @__PURE__ */ jsx49("div", { className: "bc-acc-inner", children: it.content }) })
  ] }, it.value));
  if (props.type === "multiple") {
    return /* @__PURE__ */ jsx49(A.Root, { type: "multiple", className: "bc-acc", defaultValue: props.defaultValue, value: props.value, onValueChange: props.onValueChange, children: list2 });
  }
  return /* @__PURE__ */ jsx49(A.Root, { type: "single", collapsible: true, className: "bc-acc", defaultValue: props.defaultValue, value: props.value, onValueChange: props.onValueChange, children: list2 });
}

// react/src/reteg/Breadcrumbs.tsx
import { useState as useState20 } from "react";
import { jsx as jsx50 } from "react/jsx-runtime";
function Breadcrumbs({ items, renderLink = defaultLink, maxVisible = 4, label = "Hol vagy" }) {
  const [expanded, setExpanded] = useState20(false);
  const n = items.length;
  const collapse = !expanded && n > maxVisible;
  const shown = collapse ? [0, -1, n - 2, n - 1] : items.map((_, i) => i);
  return /* @__PURE__ */ jsx50("nav", { className: "bc-crumbs", "aria-label": label, children: /* @__PURE__ */ jsx50("ol", { children: shown.map((i) => {
    if (i === -1) {
      return /* @__PURE__ */ jsx50("li", { className: "bc-crumb", children: /* @__PURE__ */ jsx50("button", { type: "button", className: "bc-crumb-more", "aria-label": `Tov\xE1bbi ${n - 3} szint mutat\xE1sa`, onClick: () => setExpanded(true), children: "\u2026" }) }, "more");
    }
    const c = items[i];
    const last = i === n - 1;
    return /* @__PURE__ */ jsx50("li", { className: cx("bc-crumb", i === n - 2 && "is-parent", last && "is-current"), children: last ? /* @__PURE__ */ jsx50("span", { "aria-current": "page", title: c.label, children: c.label }) : c.href ? renderLink({ href: c.href, children: /* @__PURE__ */ jsx50("span", { title: c.label, children: c.label }) }) : /* @__PURE__ */ jsx50("span", { title: c.label, children: c.label }) }, i);
  }) }) });
}

// react/src/reteg/PageHeader.tsx
import { useEffect as useEffect9 } from "react";
import { jsx as jsx51, jsxs as jsxs46 } from "react/jsx-runtime";
function PageHeader({ title, description, breadcrumbs, actions, loading, renderLink, breadcrumbsLabel }) {
  return /* @__PURE__ */ jsxs46("header", { className: "bc-page-header bc-page-head", children: [
    /* @__PURE__ */ jsxs46("div", { className: "bc-page-head-text", children: [
      breadcrumbs && breadcrumbs.length > 0 && /* @__PURE__ */ jsx51(Breadcrumbs, { items: breadcrumbs, renderLink, label: breadcrumbsLabel }),
      loading ? /* @__PURE__ */ jsxs46("h1", { "aria-busy": "true", children: [
        /* @__PURE__ */ jsx51("span", { className: "bc-skeleton bc-title-skeleton" }),
        /* @__PURE__ */ jsx51("span", { className: "bc-sr", children: "T\xF6lt\xF6m\u2026" })
      ] }) : /* @__PURE__ */ jsx51("h1", { children: title }),
      description && /* @__PURE__ */ jsx51("p", { children: description })
    ] }),
    actions && /* @__PURE__ */ jsx51("div", { className: "bc-row", children: actions })
  ] });
}
function usePageTitle(title, suffix = "beeco admin") {
  useEffect9(() => {
    const prev = document.title;
    document.title = title ? `${title} \u2013 ${suffix}` : suffix;
    return () => {
      document.title = prev;
    };
  }, [title, suffix]);
}

// react/src/reteg/Toaster.tsx
import { useState as useState21, useSyncExternalStore as useSyncExternalStore3 } from "react";

// react/src/reteg/notify.ts
var DEFAULT_MS = 5e3;
var LEAVE_MS = 150;
var list = [];
var seq = 0;
var paused = false;
var listeners = /* @__PURE__ */ new Set();
var timers = /* @__PURE__ */ new Map();
var emit = () => listeners.forEach((l) => l());
var subscribe2 = (l) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
var getToasts = () => list;
function arm(id) {
  const t = timers.get(id);
  if (!t || paused) return;
  t.start = Date.now();
  t.h = setTimeout(() => dismiss(id), t.left);
}
function setTimer(id, ms) {
  const old = timers.get(id);
  if (old?.h) clearTimeout(old.h);
  if (!Number.isFinite(ms)) {
    timers.delete(id);
    return;
  }
  timers.set(id, { left: ms, start: Date.now() });
  arm(id);
}
function push(kind, message, opts = {}) {
  const ms = opts.duration ?? (kind === "error" ? Infinity : DEFAULT_MS);
  const same2 = list.find((t) => t.kind === kind && t.message === message && !t.leaving);
  if (same2) {
    list = list.map((t) => t === same2 ? { ...t, count: t.count + 1, action: opts.action ?? t.action } : t);
    setTimer(same2.id, ms);
    emit();
    return same2.id;
  }
  const id = `bc-toast-${++seq}`;
  list = [...list, { id, kind, message, action: opts.action, count: 1 }];
  setTimer(id, ms);
  emit();
  return id;
}
function dismiss(id) {
  const ids = id ? [id] : list.map((t) => t.id);
  ids.forEach((i) => {
    const t = timers.get(i);
    if (t?.h) clearTimeout(t.h);
    timers.delete(i);
  });
  list = list.map((t) => ids.includes(t.id) ? { ...t, leaving: true } : t);
  emit();
  setTimeout(() => {
    list = list.filter((t) => !ids.includes(t.id));
    emit();
  }, LEAVE_MS);
}
function pauseToasts(on) {
  if (on === paused) return;
  paused = on;
  timers.forEach((t, id) => {
    if (on) {
      if (t.h) clearTimeout(t.h);
      t.h = void 0;
      t.left = Math.max(0, t.left - (Date.now() - t.start));
    } else arm(id);
  });
}
var notify = {
  success: (message, opts) => push("success", message, opts),
  error: (message, opts) => push("error", message, opts),
  info: (message, opts) => push("info", message, opts),
  warning: (message, opts) => push("warning", message, opts),
  dismiss
};

// react/src/reteg/Toaster.tsx
import { jsx as jsx52, jsxs as jsxs47 } from "react/jsx-runtime";
var MAX_VISIBLE = 3;
var LONG = 140;
var CLASS = { success: "is-success", error: "is-danger", info: "is-info", warning: "is-warning" };
var WORD = { success: "K\xE9sz", error: "Hiba", info: "T\xE1j\xE9koztat\xE1s", warning: "Figyelem" };
var ICON = {
  success: "M5 12.5l4.5 4.5L19 7.5",
  error: "M12 7v6M12 16.5v.5",
  info: "M12 11v6M12 7.5v.5",
  warning: "M12 8v5M12 16.5v.5"
};
function Toaster({ label = "\xC9rtes\xEDt\xE9sek" }) {
  const list2 = useSyncExternalStore3(subscribe2, getToasts, getToasts);
  const live = list2.filter((t) => !t.leaving);
  const errs = live.filter((t) => t.kind === "error").slice(-MAX_VISIBLE);
  const rest = live.filter((t) => t.kind !== "error").slice(-(MAX_VISIBLE - errs.length) || live.length);
  const shown = /* @__PURE__ */ new Set([...errs, ...errs.length < MAX_VISIBLE ? rest : []]);
  const visible = list2.filter((t) => t.leaving || shown.has(t));
  const hidden = live.length - shown.size;
  const blur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) pauseToasts(false);
  };
  return /* @__PURE__ */ jsxs47(
    "section",
    {
      className: "bc-toaster",
      "aria-label": label,
      onMouseEnter: () => pauseToasts(true),
      onMouseLeave: () => pauseToasts(false),
      onFocus: () => pauseToasts(true),
      onBlur: blur,
      children: [
        /* @__PURE__ */ jsx52("div", { className: "bc-toast-list", role: "alert", "aria-live": "assertive", children: visible.filter((t) => t.kind === "error").map((t) => /* @__PURE__ */ jsx52(ToastView, { t }, t.id)) }),
        /* @__PURE__ */ jsx52("div", { className: "bc-toast-list", role: "status", "aria-live": "polite", children: visible.filter((t) => t.kind !== "error").map((t) => /* @__PURE__ */ jsx52(ToastView, { t }, t.id)) }),
        hidden > 0 && /* @__PURE__ */ jsxs47("div", { className: "bc-toast-more", children: [
          /* @__PURE__ */ jsxs47("span", { children: [
            "+",
            hidden,
            " tov\xE1bbi \xE9rtes\xEDt\xE9s"
          ] }),
          /* @__PURE__ */ jsx52("button", { type: "button", className: "bc-toast-link", onClick: () => dismiss(), children: "Mind bez\xE1r\xE1sa" })
        ] })
      ]
    }
  );
}
function ToastView({ t }) {
  const [open, setOpen] = useState21(false);
  const long = t.message.length > LONG;
  return /* @__PURE__ */ jsxs47("div", { className: cx("bc-toast", CLASS[t.kind]), "data-leaving": t.leaving || void 0, children: [
    /* @__PURE__ */ jsxs47("svg", { className: "bc-toast-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx52("circle", { cx: "12", cy: "12", r: "10", strokeWidth: "2" }),
      /* @__PURE__ */ jsx52("path", { d: ICON[t.kind] })
    ] }),
    /* @__PURE__ */ jsxs47("div", { className: "bc-toast-body", children: [
      /* @__PURE__ */ jsxs47("p", { className: cx(long && !open && "is-clamped"), children: [
        /* @__PURE__ */ jsxs47("span", { className: "bc-sr", children: [
          WORD[t.kind],
          ": "
        ] }),
        t.message,
        t.count > 1 && /* @__PURE__ */ jsxs47("span", { className: "bc-toast-count", "aria-label": `${t.count}-szor`, children: [
          " \xD7",
          t.count
        ] })
      ] }),
      (long || t.action) && /* @__PURE__ */ jsxs47("div", { className: "bc-toast-actions", children: [
        t.action && /* @__PURE__ */ jsx52("button", { type: "button", className: "bc-toast-action", onClick: () => {
          t.action?.onClick();
          dismiss(t.id);
        }, children: t.action.label }),
        long && /* @__PURE__ */ jsx52("button", { type: "button", className: "bc-toast-link", "aria-expanded": open, onClick: () => setOpen(!open), children: open ? "Kevesebb" : "R\xE9szletek" })
      ] })
    ] }),
    /* @__PURE__ */ jsx52("button", { type: "button", className: "bc-toast-close", "aria-label": "\xC9rtes\xEDt\xE9s bez\xE1r\xE1sa", onClick: () => dismiss(t.id), children: /* @__PURE__ */ jsx52("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx52("path", { d: "M7 7l10 10M17 7L7 17" }) }) })
  ] });
}

// react/src/reteg/AppShell.tsx
import * as Dialog4 from "@radix-ui/react-dialog";
import { Fragment as Fragment12, useState as useState22 } from "react";
import { Fragment as Fragment13, jsx as jsx53, jsxs as jsxs48 } from "react/jsx-runtime";
var NARROW = "(max-width: 900px)";
var KEY2 = (k) => `bc-shell:${k}`;
var readCollapsed = (k) => {
  try {
    return localStorage.getItem(KEY2(k)) === "1";
  } catch {
    return false;
  }
};
var Chevron2 = ({ left }) => /* @__PURE__ */ jsxs48("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx53("path", { d: left ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6" }),
  /* @__PURE__ */ jsx53("path", { d: left ? "M20 4v16" : "M4 4v16" })
] });
function AppShell({
  brand,
  brandCompact,
  nav,
  topbar,
  account,
  collapsible = false,
  collapseKey = "nav",
  renderLink = defaultLink,
  skipLabel = "Ugr\xE1s a tartalomra",
  navLabel = "F\u0151 navig\xE1ci\xF3",
  children
}) {
  const narrow = useMedia(NARROW);
  const [open, setOpen] = useState22(false);
  const [collapsedPref, setCollapsedPref] = useState22(() => collapsible && readCollapsed(collapseKey));
  const collapsed = collapsible && !narrow && collapsedPref;
  const focus = useReturnFocus();
  const toggle = () => {
    const v = !collapsedPref;
    setCollapsedPref(v);
    try {
      localStorage.setItem(KEY2(collapseKey), v ? "1" : "0");
    } catch {
    }
  };
  const links = (onPick) => nav.map((g, gi) => /* @__PURE__ */ jsxs48(Fragment12, { children: [
    g.label && /* @__PURE__ */ jsx53("p", { className: "bc-nav-group", id: `bc-nav-g${gi}`, children: g.label }),
    /* @__PURE__ */ jsx53("ul", { className: "bc-nav-list", "aria-labelledby": g.label ? `bc-nav-g${gi}` : void 0, children: g.items.map((it) => /* @__PURE__ */ jsx53("li", { title: collapsed ? it.label : void 0, children: renderLink({
      href: it.href,
      className: "bc-nav-link",
      "aria-current": it.current ? "page" : void 0,
      onClick: onPick,
      children: /* @__PURE__ */ jsxs48(Fragment13, { children: [
        it.icon && /* @__PURE__ */ jsx53("span", { className: "bc-nav-icon", "aria-hidden": "true", children: it.icon }),
        /* @__PURE__ */ jsx53("span", { className: "bc-nav-text", children: it.label })
      ] })
    }) }, it.href)) })
  ] }, gi));
  const hasHeader = narrow || Boolean(topbar);
  return /* @__PURE__ */ jsxs48("div", { className: cx("bc-shell", collapsed && "is-collapsed", !hasHeader && "no-topbar"), children: [
    /* @__PURE__ */ jsx53("a", { className: "bc-skip", href: "#bc-content", children: skipLabel }),
    !narrow && /* @__PURE__ */ jsxs48("nav", { className: "bc-sidebar", "aria-label": navLabel, children: [
      /* @__PURE__ */ jsxs48("div", { className: "bc-sidebar-head", children: [
        collapsed && brandCompact ? brandCompact : brand,
        collapsible && /* @__PURE__ */ jsx53(IconButton, { className: "bc-sidebar-toggle", "aria-label": collapsed ? "Men\xFC kinyit\xE1sa" : "Men\xFC becsuk\xE1sa", "aria-expanded": !collapsed, onClick: toggle, children: /* @__PURE__ */ jsx53(Chevron2, { left: !collapsed }) })
      ] }),
      /* @__PURE__ */ jsx53("div", { className: "bc-sidebar-links", children: links() }),
      account && /* @__PURE__ */ jsx53("div", { className: "bc-sidebar-foot", children: account })
    ] }),
    narrow && /* @__PURE__ */ jsx53(Dialog4.Root, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs48(Dialog4.Portal, { children: [
      /* @__PURE__ */ jsx53(Dialog4.Overlay, { className: "bc-scrim is-nav" }),
      /* @__PURE__ */ jsxs48(
        Dialog4.Content,
        {
          className: "bc-sidebar is-open",
          "aria-describedby": void 0,
          onOpenAutoFocus: focus.remember,
          onCloseAutoFocus: focus.restore,
          children: [
            /* @__PURE__ */ jsxs48("div", { className: "bc-nav-head", children: [
              /* @__PURE__ */ jsx53(Dialog4.Title, { className: "bc-sr", children: "Men\xFC" }),
              /* @__PURE__ */ jsx53(IconButton, { "aria-label": "Men\xFC bez\xE1r\xE1sa", onClick: () => setOpen(false), children: /* @__PURE__ */ jsx53(CloseIcon, {}) })
            ] }),
            /* @__PURE__ */ jsxs48("nav", { "aria-label": navLabel, className: "bc-sidebar-links", children: [
              brand,
              links(() => setOpen(false))
            ] }),
            account && /* @__PURE__ */ jsx53("div", { className: "bc-sidebar-foot", children: account })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs48("div", { className: "bc-main", children: [
      hasHeader && /* @__PURE__ */ jsxs48("header", { className: cx("bc-topbar", "bc-topbar-thin"), children: [
        narrow && /* @__PURE__ */ jsx53(IconButton, { "aria-label": "Men\xFC megnyit\xE1sa", "aria-expanded": open, "aria-haspopup": "dialog", onClick: () => setOpen(true), children: /* @__PURE__ */ jsx53("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx53("path", { d: "M4 7h16M4 12h16M4 17h16" }) }) }),
        narrow && !topbar && /* @__PURE__ */ jsx53("div", { className: "bc-topbar-brand", children: brandCompact ?? brand }),
        /* @__PURE__ */ jsx53("div", { className: "bc-topbar-end", children: topbar })
      ] }),
      /* @__PURE__ */ jsx53("main", { className: "bc-content", id: "bc-content", tabIndex: -1, children })
    ] })
  ] });
}

// react/src/media/ImageUploader.tsx
import { useId as useId10, useRef as useRef23, useState as useState28 } from "react";

// react/src/media/files.ts
var MB = 1024 * 1024;
var mbText = (bytes) => formatHu(bytes / MB, bytes > 0 && bytes < 0.1 * MB ? 2 : 1) || "0";
var sizePair = (loaded, total) => {
  const l = Math.min(loaded, total);
  if (total < 0.1 * MB) return `${formatHu(l / 1024, 0)}/${formatHu(Math.max(1, total / 1024), 0)} kB`;
  return `${mbText(l)}/${mbText(total)} MB`;
};
var at = (b, off, s) => [...s].every((ch, i) => b[off + i] === ch.charCodeAt(0));
var FILE_TYPES = {
  "image/jpeg": { name: "JPG", test: (b) => b[0] === 255 && b[1] === 216 && b[2] === 255 },
  "image/png": { name: "PNG", test: (b) => b[0] === 137 && at(b, 1, "PNG") },
  "image/webp": { name: "WebP", test: (b) => at(b, 0, "RIFF") && at(b, 8, "WEBP") },
  "image/gif": { name: "GIF", test: (b) => at(b, 0, "GIF8") },
  "video/mp4": { name: "MP4", test: (b) => at(b, 4, "ftyp") && !at(b, 8, "qt") },
  // .xlsx = ZIP-konténer, .xls = régi OLE-konténer
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { name: "XLSX", test: (b) => b[0] === 80 && b[1] === 75 && b[2] === 3 && b[3] === 4 },
  "application/vnd.ms-excel": { name: "XLS", test: (b) => b[0] === 208 && b[1] === 207 && b[2] === 17 && b[3] === 224 }
};
async function sniffType(file, accept) {
  const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return accept.find((mime) => FILE_TYPES[mime]?.test(buf)) ?? null;
}
var typeNames = (accept) => accept.map((m) => FILE_TYPES[m]?.name ?? m).join(", ");
var extOf = (name2) => name2.includes(".") ? name2.split(".").pop().toUpperCase() : "";
var fileKey = (f) => `${f.name}|${f.size}`;
async function checkFiles(files, o) {
  const ok = [];
  const rejected = [];
  const unit = o.unit ?? "f\xE1jl";
  const seen = new Set(o.known);
  let room = o.room ?? Infinity;
  const over = [];
  for (const f of files) {
    if (f.size === 0) {
      rejected.push({ file: f.name, reason: "\xFCres f\xE1jl (0 b\xE1jt)", next: "V\xE1laszd ki \xFAjra az eredetit \u2013 lehet, hogy a ment\xE9s nem siker\xFClt." });
      continue;
    }
    const type = await sniffType(f, o.accept);
    if (!type) {
      const ext = extOf(f.name);
      rejected.push({ file: f.name, reason: `${ext ? `ezt a form\xE1tumot (${ext})` : "ezt a f\xE1jlt"} nem tudjuk fogadni \u2013 csak ${typeNames(o.accept)} lehet`, next: o.typeHint ?? `Mentsd el ${typeNames(o.accept).split(", ")[0]}-k\xE9nt, \xE9s t\xF6ltsd fel \xFAjra.` });
      continue;
    }
    if (f.size > o.maxSizeMB * MB) {
      rejected.push({ file: f.name, reason: `${mbText(f.size)} MB, a hat\xE1r ${formatHu(o.maxSizeMB, 1)} MB`, next: o.sizeHint ?? "Kicsiny\xEDtsd le, \xE9s pr\xF3b\xE1ld \xFAjra." });
      continue;
    }
    const k = fileKey(f);
    if (seen.has(k)) {
      rejected.push({ file: f.name, reason: "ezt a f\xE1jlt m\xE1r kiv\xE1lasztottad", next: "Ha m\xE1sikat sz\xE1nt\xE1l, v\xE1laszd ki azt." });
      continue;
    }
    if (room <= 0) {
      over.push(f.name);
      continue;
    }
    seen.add(k);
    room--;
    ok.push(f);
  }
  if (over.length) rejected.push({ file: over.length === 1 ? over[0] : `${over.length} ${unit}`, reason: `nem f\xE9rt be \u2013 legfeljebb ${o.max ?? ""} ${unit} lehet`, next: `T\xF6r\xF6lj egyet, ha \xFAjat tenn\xE9l fel.` });
  return { ok, rejected };
}
var isAbort = (e) => e instanceof DOMException && e.name === "AbortError";
var errorText = (e) => e instanceof Error && e.message ? e.message : "Nem siker\xFClt felt\xF6lteni \u2013 ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra.";

// react/src/media/CropDialog.tsx
import { useEffect as useEffect10, useState as useState24 } from "react";

// react/src/media/ImageCropper.tsx
import { useState as useState23 } from "react";
import Cropper from "react-easy-crop";
import { jsx as jsx54, jsxs as jsxs49 } from "react/jsx-runtime";
var DEFAULT_ASPECTS = [{ label: "16:9", value: 16 / 9 }, { label: "1:1", value: 1 }];
function ImageCropper({ src, aspects = DEFAULT_ASPECTS, minZoom = 1, maxZoom = 8, onCrop, minOutputWidth, zoomHelp, aspectHelp }) {
  const [crop, setCrop] = useState23({ x: 0, y: 0 });
  const [zoom, setZoom] = useState23(minZoom);
  const [aspect, setAspect] = useState23(aspects[0]);
  const [small, setSmall] = useState23(null);
  const clampZoom = (z) => Math.min(maxZoom, Math.max(minZoom, Math.round(z * 10) / 10));
  const zoomText = `${formatHu(zoom, 1)}\xD7`;
  const onKey = (e) => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      setZoom((z) => clampZoom(z + 0.2));
    }
    if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      setZoom((z) => clampZoom(z - 0.2));
    }
  };
  const reset = () => {
    setZoom(minZoom);
    setCrop({ x: 0, y: 0 });
  };
  return /* @__PURE__ */ jsxs49("div", { className: "bc-cropper", onKeyDown: onKey, children: [
    aspects.length > 1 && /* @__PURE__ */ jsxs49("div", { className: "bc-cropper-row", children: [
      /* @__PURE__ */ jsx54("span", { className: "bc-label", id: "bc-crop-aspect", children: "K\xE9par\xE1ny" }),
      /* @__PURE__ */ jsx54(
        SegmentedControl,
        {
          label: "K\xE9par\xE1ny",
          value: aspect.label,
          onChange: (l) => setAspect(aspects.find((a) => a.label === l) ?? aspects[0]),
          items: aspects.map((a) => ({ value: a.label, label: a.label }))
        }
      ),
      aspectHelp && /* @__PURE__ */ jsx54("span", { className: "bc-help", children: aspectHelp })
    ] }),
    /* @__PURE__ */ jsx54("div", { className: "bc-cropper-stage", children: /* @__PURE__ */ jsx54(
      Cropper,
      {
        image: src,
        crop,
        zoom,
        aspect: aspect.value,
        minZoom,
        maxZoom,
        zoomSpeed: 0.5,
        keyboardStep: 10,
        onCropChange: setCrop,
        onZoomChange: (z) => setZoom(clampZoom(z)),
        objectFit: "contain",
        showGrid: true,
        classes: { containerClassName: "bc-cropper-box", cropAreaClassName: "bc-cropper-area" },
        cropperProps: { "aria-label": `Kiv\xE1g\xE1s helye (${aspect.label}) \u2013 a nyilakkal mozgatod, a + \xE9s \u2212 gombbal nagy\xEDtasz`, role: "group" },
        onCropComplete: (_, px) => {
          setSmall(minOutputWidth && px.width < minOutputWidth ? Math.round(px.width) : null);
          onCrop(px, { zoom, aspect });
        }
      }
    ) }),
    /* @__PURE__ */ jsx54(
      Field,
      {
        label: "Nagy\xEDt\xE1s",
        help: zoomHelp ?? "H\xFAzd a cs\xFAszk\xE1t, vagy nyomd a + \xE9s \u2212 gombot, hogy a l\xE9nyeg kit\xF6ltse a keretet. Egyes k\xE9perny\u0151k\xF6n kisebben jelenik meg a k\xE9p, ez\xE9rt ne v\xE1gd t\xFAl szorosra.",
        range: `${formatHu(minZoom, 0)}\u2013${formatHu(maxZoom, 0)}\xD7`,
        notice: small ? `A kiv\xE1g\xE1s csak ${small} px sz\xE9les (legal\xE1bb ${minOutputWidth} px kell) \u2013 a k\xE9p hom\xE1lyos lehet. Nagy\xEDts kev\xE9sb\xE9, vagy v\xE1lassz nagyobb k\xE9pet.` : void 0,
        children: /* @__PURE__ */ jsx54(FieldInput, { children: (f) => /* @__PURE__ */ jsxs49("div", { className: "bc-cropper-zoom", children: [
          /* @__PURE__ */ jsx54(
            "input",
            {
              id: f.id,
              type: "range",
              className: "bc-range",
              min: minZoom,
              max: maxZoom,
              step: 0.1,
              value: zoom,
              "aria-describedby": f.describedBy,
              "aria-valuetext": zoomText,
              onChange: (e) => setZoom(clampZoom(Number(e.target.value)))
            }
          ),
          /* @__PURE__ */ jsx54("output", { htmlFor: f.id, className: "bc-cropper-out", "data-zoom": true, children: zoomText }),
          /* @__PURE__ */ jsx54(Button, { variant: "secondary", size: "sm", onClick: reset, disabled: zoom === minZoom && crop.x === 0 && crop.y === 0, children: "Alaphelyzet" })
        ] }) })
      }
    )
  ] });
}

// react/src/media/CropDialog.tsx
import { Fragment as Fragment14, jsx as jsx55, jsxs as jsxs50 } from "react/jsx-runtime";
var KIMENET = { "image/png": "image/png", "image/webp": "image/webp" };
async function cropToFile(file, src, area) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(area.width));
  c.height = Math.max(1, Math.round(area.height));
  c.getContext("2d").drawImage(img, area.x, area.y, area.width, area.height, 0, 0, c.width, c.height);
  const type = KIMENET[file.type] ?? "image/jpeg";
  const blob = await new Promise((ok) => c.toBlob(ok, type, 0.9));
  if (!blob) throw new Error("A kiv\xE1g\xE1s nem siker\xFClt \u2013 pr\xF3b\xE1ld \xFAjra, vagy v\xE1lassz m\xE1sik k\xE9pet.");
  return new File([blob], file.name, { type, lastModified: Date.now() });
}
function CropDialog({ file, crop, position, onDone, onSkip }) {
  const [src, setSrc] = useState24(null);
  const [area, setArea] = useState24(null);
  const [busy, setBusy] = useState24(false);
  const [err, setErr] = useState24();
  useEffect10(() => {
    if (!file) {
      setSrc(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setSrc(u);
    setArea(null);
    setErr(void 0);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  const kesz = async () => {
    if (!file || !src || !area) return;
    setBusy(true);
    try {
      onDone(await cropToFile(file, src, area));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "A kiv\xE1g\xE1s nem siker\xFClt.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs50(
    Modal,
    {
      open: file !== null,
      onOpenChange: (o) => {
        if (!o && file && !busy) onSkip(file);
      },
      size: "wide",
      busy,
      title: `K\xE9p kiv\xE1g\xE1sa (${crop.aspectLabel})${position ? ` \u2013 ${position}` : ""}`,
      description: /* @__PURE__ */ jsxs50(Fragment14, { children: [
        file?.name,
        crop.why ? ` \xB7 ${crop.why}` : ""
      ] }),
      footer: /* @__PURE__ */ jsxs50(Fragment14, { children: [
        /* @__PURE__ */ jsx55(Button, { variant: "secondary", onClick: () => file && onSkip(file), disabled: busy, children: "Ezt kihagyom" }),
        /* @__PURE__ */ jsx55(Button, { onClick: () => void kesz(), busy, disabled: !area, children: "Kiv\xE1g\xE1s \xE9s felt\xF6lt\xE9s" })
      ] }),
      children: [
        src && /* @__PURE__ */ jsx55(ImageCropper, { src, aspects: [{ label: crop.aspectLabel, value: crop.aspect }], minOutputWidth: crop.minOutputWidth, onCrop: (a) => setArea(a) }),
        err && /* @__PURE__ */ jsx55("p", { className: "bc-error", role: "alert", children: err })
      ]
    }
  );
}

// react/src/media/Gallery.tsx
import { useRef as useRef21, useState as useState26 } from "react";

// react/src/media/GalleryDialogs.tsx
import * as Dialog5 from "@radix-ui/react-dialog";
import { useEffect as useEffect11, useState as useState25 } from "react";

// react/src/media/useReturnFocus.ts
import { useLayoutEffect as useLayoutEffect3, useRef as useRef19 } from "react";
function useReturnFocus2(open, fallback) {
  const prev = useRef19(null);
  useLayoutEffect3(() => {
    if (open) prev.current = document.activeElement;
  }, [open]);
  return (e) => {
    e.preventDefault();
    const el = prev.current?.isConnected && !prev.current.closest("[role=menu]") ? prev.current : fallback?.();
    el?.focus();
  };
}

// react/src/media/GalleryDialogs.tsx
import { Fragment as Fragment15, jsx as jsx56, jsxs as jsxs51 } from "react/jsx-runtime";
function Small({ open, onClose, title, children, foot, fallback }) {
  const back = useReturnFocus2(open, fallback);
  return /* @__PURE__ */ jsx56(Dialog5.Root, { open, onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsx56(Dialog5.Portal, { children: /* @__PURE__ */ jsx56(Dialog5.Overlay, { className: "bc-scrim", children: /* @__PURE__ */ jsxs51(Dialog5.Content, { className: "bc-modal", "aria-describedby": void 0, onCloseAutoFocus: back, children: [
    /* @__PURE__ */ jsx56("div", { className: "bc-modal-head", children: /* @__PURE__ */ jsx56(Dialog5.Title, { children: title }) }),
    /* @__PURE__ */ jsx56("div", { className: "bc-modal-body", children }),
    /* @__PURE__ */ jsx56("div", { className: "bc-modal-foot", children: foot })
  ] }) }) }) });
}
var ALT_MAX = 150;
var ALT_HELP = "Mondd el egy mondatban, mi l\xE1tszik a k\xE9pen \u2013 ezt olvassa fel a k\xE9perny\u0151olvas\xF3, \xE9s ez jelenik meg, ha a k\xE9p nem t\xF6lt be. Pl. \u201EA k\xE1v\xE9z\xF3 terasza ny\xE1ron, vir\xE1gl\xE1d\xE1kkal\u201D. Ne a f\xE1jlnevet \xEDrd.";
function AltDialog({ img, help = ALT_HELP, onSave, onClose, fallback }) {
  const [text, setText] = useState25("");
  const [err, setErr] = useState25();
  useEffect11(() => {
    setText(img?.alt ?? "");
    setErr(void 0);
  }, [img]);
  const save2 = (e) => {
    e.preventDefault();
    const t = text.trim().replace(/\s+/g, " ");
    if (t.length < 3) {
      setErr(t ? `Legal\xE1bb 3 karakter kell \u2013 most ${t.length}.` : "A le\xEDr\xE1s k\xF6telez\u0151 \u2013 \xEDrd le egy mondatban, mi l\xE1tszik a k\xE9pen.");
      return;
    }
    onSave(t);
    onClose();
  };
  return /* @__PURE__ */ jsx56(
    Small,
    {
      open: !!img,
      onClose,
      title: "K\xE9ple\xEDr\xE1s (alt)",
      fallback,
      foot: /* @__PURE__ */ jsxs51(Fragment15, { children: [
        /* @__PURE__ */ jsx56(Button, { variant: "secondary", onClick: onClose, children: "M\xE9gse" }),
        /* @__PURE__ */ jsx56(Button, { type: "submit", form: "bc-alt-form", children: "Ment\xE9s" })
      ] }),
      children: /* @__PURE__ */ jsxs51("form", { id: "bc-alt-form", onSubmit: save2, noValidate: true, children: [
        img && /* @__PURE__ */ jsx56("img", { className: "bc-alt-thumb", src: img.src, alt: "" }),
        /* @__PURE__ */ jsx56(
          TextField,
          {
            label: "Mi l\xE1tszik a k\xE9pen?",
            help,
            required: true,
            minLength: 3,
            maxLength: ALT_MAX,
            value: text,
            onChange: (e) => {
              setText(e.target.value);
              setErr(void 0);
            },
            error: err,
            autoFocus: true
          }
        )
      ] })
    }
  );
}
function DeleteDialog({ img, onConfirm, onClose, fallback }) {
  return /* @__PURE__ */ jsxs51(
    Small,
    {
      open: !!img,
      onClose,
      title: "T\xF6rl\xF6d ezt a k\xE9pet?",
      fallback,
      foot: /* @__PURE__ */ jsxs51(Fragment15, { children: [
        /* @__PURE__ */ jsx56(Button, { variant: "secondary", onClick: onClose, autoFocus: true, children: "M\xE9gse" }),
        /* @__PURE__ */ jsx56(Button, { variant: "danger", onClick: () => {
          onConfirm();
          onClose();
        }, children: "T\xF6rl\xE9s" })
      ] }),
      children: [
        img && /* @__PURE__ */ jsx56("img", { className: "bc-alt-thumb", src: img.src, alt: "" }),
        /* @__PURE__ */ jsxs51("p", { children: [
          img?.alt ? `\u201E${img.alt}\u201D` : "A le\xEDr\xE1s n\xE9lk\xFCli k\xE9p",
          " leker\xFCl a gal\xE9ri\xE1b\xF3l. Ha kell, k\xE9s\u0151bb \xFAjra felt\xF6ltheted."
        ] })
      ]
    }
  );
}

// react/src/media/GalleryTile.tsx
import * as Menu from "@radix-ui/react-dropdown-menu";

// react/src/media/icons.tsx
import { jsx as jsx57, jsxs as jsxs52 } from "react/jsx-runtime";
var S2 = { viewBox: "0 0 24 24", width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var IcPlus = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M12 5v14M5 12h14" }) });
var IcClose = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M6 6l12 12M18 6L6 18" }) });
var IcDots = () => /* @__PURE__ */ jsxs52("svg", { ...S2, children: [
  /* @__PURE__ */ jsx57("circle", { cx: "5", cy: "12", r: "1.5" }),
  /* @__PURE__ */ jsx57("circle", { cx: "12", cy: "12", r: "1.5" }),
  /* @__PURE__ */ jsx57("circle", { cx: "19", cy: "12", r: "1.5" })
] });
var IcLeft = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M15 5l-7 7 7 7" }) });
var IcRight = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M9 5l7 7-7 7" }) });
var IcRetry = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" }) });
var IcWarn = () => /* @__PURE__ */ jsxs52("svg", { ...S2, children: [
  /* @__PURE__ */ jsx57("path", { d: "M12 4l9 16H3z" }),
  /* @__PURE__ */ jsx57("path", { d: "M12 10v4M12 17v.5" })
] });
var IcCheck = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M5 12.5l4.5 4.5L19 7" }) });
var IcCopy = () => /* @__PURE__ */ jsxs52("svg", { ...S2, children: [
  /* @__PURE__ */ jsx57("rect", { x: "8", y: "8", width: "12", height: "12", rx: "2" }),
  /* @__PURE__ */ jsx57("path", { d: "M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" })
] });
var IcDownload = () => /* @__PURE__ */ jsx57("svg", { ...S2, children: /* @__PURE__ */ jsx57("path", { d: "M12 4v11M7 10l5 5 5-5M5 20h14" }) });
var IcFile = () => /* @__PURE__ */ jsxs52("svg", { ...S2, children: [
  /* @__PURE__ */ jsx57("path", { d: "M6 3h8l4 4v14H6z" }),
  /* @__PURE__ */ jsx57("path", { d: "M14 3v4h4" })
] });

// react/src/media/GalleryTile.tsx
import { jsx as jsx58, jsxs as jsxs53 } from "react/jsx-runtime";
function GalleryTile({ img, index, count, ordering, editable, altEditable = true, dragging, dropTarget, onAction, onDragStart, onDragEnd, onDragOver, onDrop }) {
  const name2 = img.alt || (altEditable ? `${index + 1}. k\xE9p (nincs le\xEDr\xE1sa)` : `${index + 1}. k\xE9p`);
  const canMove = ordering && editable;
  return /* @__PURE__ */ jsxs53(
    "li",
    {
      "data-tile": img.id,
      className: cx("bc-tile", dragging && "is-dragging", dropTarget && "is-drop"),
      draggable: canMove,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDrop,
      children: [
        /* @__PURE__ */ jsx58("button", { type: "button", className: "bc-tile-open", onClick: () => onAction("open"), "aria-label": `Nagy\xEDt\xE1s: ${name2}${ordering && index === 0 ? " (bor\xEDt\xF3)" : ""}`, children: /* @__PURE__ */ jsx58("img", { src: img.src, alt: "", draggable: false, loading: "lazy", decoding: "async" }) }),
        ordering && index === 0 && /* @__PURE__ */ jsx58("span", { className: "bc-badge is-accent bc-tile-cover", children: "Bor\xEDt\xF3" }),
        !img.alt && altEditable && /* @__PURE__ */ jsxs53("span", { className: "bc-badge is-warning bc-tile-noalt", children: [
          /* @__PURE__ */ jsx58(IcWarn, {}),
          "Le\xEDr\xE1s kell"
        ] }),
        editable && /* @__PURE__ */ jsxs53(Menu.Root, { modal: false, children: [
          /* @__PURE__ */ jsx58(Menu.Trigger, { className: "bc-icon-btn bc-tile-menu", "aria-label": `M\u0171veletek: ${name2}`, children: /* @__PURE__ */ jsx58(IcDots, {}) }),
          /* @__PURE__ */ jsx58(Menu.Portal, { children: /* @__PURE__ */ jsxs53(Menu.Content, { className: "bc-gmenu", align: "end", sideOffset: 4, collisionPadding: 12, children: [
            /* @__PURE__ */ jsx58(Menu.Item, { className: "bc-gmenu-item", onSelect: () => onAction("open"), children: "Megnyit\xE1s" }),
            canMove && /* @__PURE__ */ jsx58(Menu.Item, { className: "bc-gmenu-item", disabled: index === 0, onSelect: () => onAction("cover"), children: "Legyen a bor\xEDt\xF3" }),
            canMove && /* @__PURE__ */ jsx58(Menu.Item, { className: "bc-gmenu-item", disabled: index === 0, onSelect: () => onAction("back"), children: "El\u0151re (balra)" }),
            canMove && /* @__PURE__ */ jsx58(Menu.Item, { className: "bc-gmenu-item", disabled: index === count - 1, onSelect: () => onAction("forward"), children: "H\xE1tra (jobbra)" }),
            altEditable && /* @__PURE__ */ jsx58(Menu.Item, { className: "bc-gmenu-item", onSelect: () => onAction("alt"), children: img.alt ? "Le\xEDr\xE1s (alt) szerkeszt\xE9se\u2026" : "Le\xEDr\xE1s (alt) megad\xE1sa\u2026" }),
            /* @__PURE__ */ jsx58(Menu.Separator, { className: "bc-gmenu-sep" }),
            /* @__PURE__ */ jsx58(Menu.Item, { className: "bc-gmenu-item is-danger", onSelect: () => onAction("delete"), children: "T\xF6rl\xE9s\u2026" })
          ] }) })
        ] })
      ]
    }
  );
}

// react/src/media/Lightbox.tsx
import * as Dialog6 from "@radix-ui/react-dialog";
import { useRef as useRef20 } from "react";
import { jsx as jsx59, jsxs as jsxs54 } from "react/jsx-runtime";
function Lightbox({ images, index, onIndexChange, returnFocus }) {
  const open = index !== null && images.length > 0;
  const i = Math.min(index ?? 0, Math.max(0, images.length - 1));
  const img = images[i];
  const go = (d) => onIndexChange((i + d + images.length) % images.length);
  const startX = useRef20(null);
  const back = useReturnFocus2(open, returnFocus);
  const onKey = (e) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };
  const onDown = (e) => {
    startX.current = e.clientX;
  };
  const onUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40 && images.length > 1) go(dx < 0 ? 1 : -1);
  };
  return /* @__PURE__ */ jsx59(Dialog6.Root, { open, onOpenChange: (o) => {
    if (!o) onIndexChange(null);
  }, children: /* @__PURE__ */ jsxs54(Dialog6.Portal, { children: [
    /* @__PURE__ */ jsx59(Dialog6.Overlay, { className: "bc-lightbox-scrim" }),
    /* @__PURE__ */ jsxs54(Dialog6.Content, { className: "bc-lightbox", onKeyDown: onKey, "aria-describedby": void 0, onCloseAutoFocus: back, children: [
      /* @__PURE__ */ jsxs54("div", { className: "bc-lightbox-top", children: [
        /* @__PURE__ */ jsxs54("span", { className: "bc-lightbox-pill", "aria-live": "polite", "data-lightbox-count": true, children: [
          i + 1,
          "/",
          images.length
        ] }),
        /* @__PURE__ */ jsxs54(Dialog6.Title, { className: "bc-sr", children: [
          "K\xE9p nagy\xEDtva: ",
          img?.alt || "nincs le\xEDr\xE1sa"
        ] }),
        /* @__PURE__ */ jsx59(Dialog6.Close, { className: "bc-icon-btn bc-lightbox-btn", "aria-label": "Bez\xE1r\xE1s (Esc)", children: /* @__PURE__ */ jsx59(IcClose, {}) })
      ] }),
      /* @__PURE__ */ jsxs54("div", { className: "bc-lightbox-mid", children: [
        images.length > 1 && /* @__PURE__ */ jsx59("button", { type: "button", className: "bc-icon-btn bc-lightbox-btn", "aria-label": "El\u0151z\u0151 k\xE9p (\u2190)", onClick: () => go(-1), children: /* @__PURE__ */ jsx59(IcLeft, {}) }),
        /* @__PURE__ */ jsx59("div", { className: "bc-lightbox-stage", onPointerDown: onDown, onPointerUp: onUp, onPointerCancel: () => {
          startX.current = null;
        }, children: img && /* @__PURE__ */ jsx59("img", { src: img.src, alt: img.alt, draggable: false }, img.id) }),
        images.length > 1 && /* @__PURE__ */ jsx59("button", { type: "button", className: "bc-icon-btn bc-lightbox-btn", "aria-label": "K\xF6vetkez\u0151 k\xE9p (\u2192)", onClick: () => go(1), children: /* @__PURE__ */ jsx59(IcRight, {}) })
      ] }),
      /* @__PURE__ */ jsx59("p", { className: "bc-lightbox-cap", children: img?.alt || /* @__PURE__ */ jsx59("em", { children: "Ennek a k\xE9pnek m\xE9g nincs le\xEDr\xE1sa." }) })
    ] })
  ] }) });
}

// react/src/media/Gallery.tsx
import { jsx as jsx60, jsxs as jsxs55 } from "react/jsx-runtime";
var MIME = "application/x-bc-gallery";
function Gallery({ images, onChange, ordering = true, confirmDelete, altHelp, altEditable = true, label = "K\xE9pek", children, className, onFileDrag }) {
  const [zoom, setZoom] = useState26(null);
  const [altFor, setAltFor] = useState26(null);
  const [delFor, setDelFor] = useState26(null);
  const [drag, setDrag] = useState26(null);
  const [said, setSaid] = useState26("");
  const editable = Boolean(onChange);
  const root = useRef21(null);
  const opener = useRef21(null);
  const trigger = () => opener.current && root.current?.querySelector(`[data-tile="${opener.current}"] .bc-tile-menu`) || root.current?.querySelector(".bc-tile-menu, .bc-tile-open, input");
  const move = (from, to) => {
    if (!onChange || from === to || to < 0 || to >= images.length) return;
    const next = [...images];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
    setSaid(`\xC1thelyezve: ${x.alt || "k\xE9p"} \u2013 ${to + 1}. hely a ${images.length}-b\u0151l${to === 0 ? ", ez most a bor\xEDt\xF3" : ""}.`);
  };
  const remove = async (img) => {
    if (confirmDelete && !await confirmDelete(img)) return;
    onChange?.(images.filter((x) => x.id !== img.id));
    setSaid(`T\xF6r\xF6lve: ${img.alt || "k\xE9p"}. ${images.length - 1} k\xE9p maradt.`);
  };
  const act = (i) => (a) => {
    const img = images[i];
    opener.current = img.id;
    if (a === "open") setZoom(i);
    else if (a === "cover") move(i, 0);
    else if (a === "back") move(i, i - 1);
    else if (a === "forward") move(i, i + 1);
    else if (a === "alt") setAltFor(img);
    else if (a === "delete") {
      if (confirmDelete) void remove(img);
      else setDelFor(img);
    }
  };
  const own = (e) => e.dataTransfer.types.includes(MIME);
  const tileDrag = (i) => ({
    onDragStart: (e) => {
      e.dataTransfer.setData(MIME, String(i));
      e.dataTransfer.effectAllowed = "move";
      setDrag({ from: i, over: null });
    },
    onDragEnd: () => setDrag(null),
    onDragOver: (e) => {
      if (!own(e) || !drag) return;
      e.preventDefault();
      e.stopPropagation();
      if (drag.over !== i) setDrag({ ...drag, over: i });
    },
    onDrop: (e) => {
      if (!own(e) || !drag) return;
      e.preventDefault();
      e.stopPropagation();
      move(drag.from, i);
      setDrag(null);
    }
  });
  return /* @__PURE__ */ jsxs55(
    "div",
    {
      ref: root,
      className: cx("bc-gallery", className),
      onDragOver: (e) => {
        if (!own(e)) onFileDrag?.over(e);
      },
      onDragLeave: (e) => onFileDrag?.leave(e),
      onDrop: (e) => {
        if (!own(e)) onFileDrag?.drop(e);
      },
      children: [
        /* @__PURE__ */ jsxs55("ul", { className: "bc-gallery-grid", "aria-label": `${label}: ${images.length} k\xE9p`, children: [
          images.map((img, i) => /* @__PURE__ */ jsx60(
            GalleryTile,
            {
              img,
              index: i,
              count: images.length,
              ordering,
              editable,
              altEditable,
              dragging: drag?.from === i,
              dropTarget: drag?.over === i && drag.from !== i,
              onAction: act(i),
              ...tileDrag(i)
            },
            img.id
          )),
          children
        ] }),
        images.length === 0 && !children && /* @__PURE__ */ jsx60("p", { className: "bc-gallery-empty", children: "M\xE9g nincs k\xE9p ebben a gal\xE9ri\xE1ban." }),
        /* @__PURE__ */ jsx60("p", { className: "bc-sr", role: "status", "aria-live": "polite", children: said }),
        /* @__PURE__ */ jsx60(Lightbox, { images, index: zoom, onIndexChange: setZoom, returnFocus: trigger }),
        /* @__PURE__ */ jsx60(
          AltDialog,
          {
            fallback: trigger,
            img: altFor,
            help: altHelp,
            onClose: () => setAltFor(null),
            onSave: (alt) => {
              if (altFor) {
                onChange?.(images.map((x) => x.id === altFor.id ? { ...x, alt } : x));
                setSaid("A le\xEDr\xE1st elmentettem.");
              }
            }
          }
        ),
        /* @__PURE__ */ jsx60(DeleteDialog, { fallback: trigger, img: delFor, onClose: () => setDelFor(null), onConfirm: () => {
          if (delFor) void remove(delFor);
        } })
      ]
    }
  );
}

// react/src/media/Stepper.tsx
import { jsx as jsx61, jsxs as jsxs56 } from "react/jsx-runtime";
var STATE_TEXT = { todo: "m\xE9g h\xE1travan", current: "folyamatban", done: "k\xE9sz", error: "hiba" };
function Stepper({ label, steps, className }) {
  return /* @__PURE__ */ jsx61("ol", { className: cx("bc-steps", className), "aria-label": label, children: steps.map((s, i) => /* @__PURE__ */ jsxs56("li", { className: `is-${s.state}`, "aria-current": s.state === "current" ? "step" : void 0, children: [
    /* @__PURE__ */ jsx61("b", { "aria-hidden": "true", children: s.state === "done" ? /* @__PURE__ */ jsx61(IcCheck, {}) : s.state === "error" ? /* @__PURE__ */ jsx61(IcClose, {}) : i + 1 }),
    /* @__PURE__ */ jsx61("span", { children: s.label }),
    /* @__PURE__ */ jsxs56("span", { className: "bc-sr", children: [
      " \u2013 ",
      STATE_TEXT[s.state]
    ] })
  ] }, s.id)) });
}
function stepsFrom(labels, current, failed = false) {
  return labels.map((l, i) => ({ ...l, state: i < current ? "done" : i === current ? failed ? "error" : "current" : "todo" }));
}
function Progress({ value, max, label, valueText, className }) {
  const pct = max > 0 ? Math.min(100, Math.round(value / max * 100)) : 0;
  return /* @__PURE__ */ jsx61("span", { className: cx("bc-upbar", className), role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": pct, "aria-valuetext": valueText ?? `${pct}%`, children: /* @__PURE__ */ jsx61("i", { style: { width: `${pct}%` } }) });
}

// react/src/media/UploadTile.tsx
import { Fragment as Fragment16, jsx as jsx62, jsxs as jsxs57 } from "react/jsx-runtime";
function UploadTile({ item, onCancel, onRetry }) {
  const { file, loaded, status } = item;
  const failed = status === "error";
  const sizeText = sizePair(loaded, file.size);
  return /* @__PURE__ */ jsxs57("li", { className: failed ? "bc-tile is-upload is-failed" : "bc-tile is-upload", "data-upload": file.name, children: [
    /* @__PURE__ */ jsx62("img", { src: item.preview, alt: "" }),
    /* @__PURE__ */ jsx62("div", { className: "bc-tile-status", children: failed ? /* @__PURE__ */ jsxs57(Fragment16, { children: [
      /* @__PURE__ */ jsxs57("span", { className: "bc-tile-err", children: [
        /* @__PURE__ */ jsx62(IcWarn, {}),
        "Nem siker\xFClt"
      ] }),
      /* @__PURE__ */ jsxs57("span", { className: "bc-tile-actions", children: [
        /* @__PURE__ */ jsx62("button", { type: "button", className: "bc-icon-btn", onClick: onRetry, "aria-label": `\xDAjrapr\xF3b\xE1l\xE1s: ${file.name}`, children: /* @__PURE__ */ jsx62(IcRetry, {}) }),
        /* @__PURE__ */ jsx62("button", { type: "button", className: "bc-icon-btn", onClick: onCancel, "aria-label": `Elt\xE1vol\xEDt\xE1s: ${file.name}`, children: /* @__PURE__ */ jsx62(IcClose, {}) })
      ] })
    ] }) : /* @__PURE__ */ jsxs57(Fragment16, { children: [
      /* @__PURE__ */ jsx62("span", { className: "bc-tile-size", children: sizeText }),
      /* @__PURE__ */ jsx62("button", { type: "button", className: "bc-icon-btn", onClick: onCancel, "aria-label": `Felt\xF6lt\xE9s megszak\xEDt\xE1sa: ${file.name}`, children: /* @__PURE__ */ jsx62(IcClose, {}) })
    ] }) }),
    !failed && /* @__PURE__ */ jsx62(Progress, { value: loaded, max: file.size, label: `${file.name} felt\xF6lt\xE9se`, valueText: sizeText }),
    failed && item.error && /* @__PURE__ */ jsx62("span", { className: "bc-sr", children: item.error })
  ] });
}

// react/src/media/useUploads.ts
import { useCallback as useCallback3, useEffect as useEffect12, useRef as useRef22, useState as useState27 } from "react";
var seq2 = 0;
function useUploads(upload, onDone, onCancel) {
  const [items, setItems] = useState27([]);
  const ctrls = useRef22(/* @__PURE__ */ new Map());
  const done = useRef22(onDone);
  done.current = onDone;
  const cancelCb = useRef22(onCancel);
  cancelCb.current = onCancel;
  const patch = (id, p) => setItems((xs) => xs.map((x) => x.id === id ? { ...x, ...p } : x));
  const drop = (id) => setItems((xs) => {
    const x = xs.find((i) => i.id === id);
    if (x) URL.revokeObjectURL(x.preview);
    return xs.filter((i) => i.id !== id);
  });
  const run = useCallback3((id, file) => {
    const ctrl = new AbortController();
    ctrls.current.set(id, ctrl);
    let raf = 0, last = 0;
    const onProgress = (loaded) => {
      last = loaded;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        patch(id, { loaded: last });
      });
    };
    upload(file, { onProgress, signal: ctrl.signal }).then(
      (r) => {
        cancelAnimationFrame(raf);
        ctrls.current.delete(id);
        drop(id);
        done.current(r, file);
      },
      (e) => {
        cancelAnimationFrame(raf);
        ctrls.current.delete(id);
        if (isAbort(e)) return;
        patch(id, { status: "error", error: errorText(e) });
      }
    );
  }, [upload]);
  const start = useCallback3((files) => {
    const next = files.map((file) => ({ id: `u${++seq2}`, file, preview: URL.createObjectURL(file), loaded: 0, status: "uploading" }));
    setItems((xs) => [...xs, ...next]);
    next.forEach((i) => run(i.id, i.file));
  }, [run]);
  const retry = useCallback3((id) => {
    setItems((xs) => xs.map((x) => x.id === id ? { ...x, status: "uploading", loaded: 0, error: void 0 } : x));
    const it = items.find((x) => x.id === id);
    if (it) run(id, it.file);
  }, [items, run]);
  const cancel = useCallback3((id) => {
    const it = items.find((x) => x.id === id);
    ctrls.current.get(id)?.abort();
    ctrls.current.delete(id);
    drop(id);
    if (it) cancelCb.current?.(it.file);
  }, [items]);
  useEffect12(() => () => ctrls.current.forEach((c) => c.abort()), []);
  const keys = new Set(items.map((i) => fileKey(i.file)));
  return { items, start, retry, cancel, keys, busy: items.some((i) => i.status === "uploading") };
}

// react/src/media/ImageUploader.tsx
import { jsx as jsx63, jsxs as jsxs58 } from "react/jsx-runtime";
function ImageUploader({
  label,
  help,
  images,
  onChange,
  upload,
  accept = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
  maxCount = 10,
  ordering,
  confirmDelete,
  altHelp,
  sizeHint = "Kicsiny\xEDtsd le, pl. 2000 px sz\xE9lesre, \xE9s pr\xF3b\xE1ld \xFAjra.",
  required,
  disabled,
  readOnly,
  error,
  crop,
  altEditable = true
}) {
  const [rejected, setRejected] = useState28([]);
  const [note, setNote] = useState28();
  const [over, setOver] = useState28(false);
  const input = useRef23(null);
  const rejId = useId10();
  const latest = useRef23(images);
  latest.current = images;
  const fromFile = useRef23(/* @__PURE__ */ new Map());
  const origKey = useRef23(/* @__PURE__ */ new WeakMap());
  const [queue, setQueue] = useState28({ files: [], total: 0 });
  const up = useUploads(
    upload,
    (img, file) => {
      fromFile.current.set(img.id, origKey.current.get(file) ?? fileKey(file));
      const next2 = [...latest.current, img];
      latest.current = next2;
      onChange(next2);
    },
    (f) => setNote(`Megszak\xEDtottad: ${f.name}. Ha m\xE9gis kell, v\xE1laszd ki \xFAjra.`)
  );
  const used = images.length + up.items.length + queue.files.length;
  const full = used >= maxCount;
  const locked = disabled || readOnly;
  const failed = up.items.filter((i) => i.status === "error");
  const noAlt = altEditable ? images.filter((i) => !i.alt).length : 0;
  const add = async (list2) => {
    if (!list2 || locked) return;
    setNote(void 0);
    const r = await checkFiles([...list2], {
      accept,
      maxSizeMB,
      room: maxCount - used,
      max: maxCount,
      known: /* @__PURE__ */ new Set([...up.keys, ...images.flatMap((i) => fromFile.current.get(i.id) ?? [])]),
      sizeHint,
      unit: "k\xE9p",
      typeHint: `Mentsd el ${typeNames(accept).split(", ")[0]}-k\xE9nt (pl. a telefonon: Megoszt\xE1s \u2192 Ment\xE9s k\xE9pk\xE9nt), \xE9s t\xF6ltsd fel \xFAjra.`
    });
    setRejected(r.rejected);
    if (!r.ok.length) return;
    if (crop) setQueue((q) => ({ files: [...q.files, ...r.ok], total: q.total + r.ok.length }));
    else up.start(r.ok);
  };
  const next = () => setQueue((q) => q.files.length <= 1 ? { files: [], total: 0 } : { ...q, files: q.files.slice(1) });
  const cropped = (f) => {
    const o = queue.files[0];
    if (o) origKey.current.set(f, fileKey(o));
    up.start([f]);
    next();
  };
  const skipped = (f) => {
    setNote(`Kihagytad: ${f.name}. Ha m\xE9gis kell, v\xE1laszd ki \xFAjra.`);
    next();
  };
  const fileDrag = {
    over: (e) => {
      if (locked || !e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = full ? "none" : "copy";
      setOver(true);
    },
    leave: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
    },
    drop: (e) => {
      if (locked) return;
      e.preventDefault();
      setOver(false);
      void add(e.dataTransfer.files);
    }
  };
  return /* @__PURE__ */ jsxs58("div", { className: cx("bc-upload", over && "is-over", locked && "is-locked"), children: [
    /* @__PURE__ */ jsx63(
      Field,
      {
        label,
        help,
        required,
        disabled,
        error,
        range: `${typeNames(accept)} \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB/k\xE9p \xB7 legfeljebb ${maxCount} k\xE9p`,
        count: { value: used, max: maxCount, unit: "k\xE9p" },
        children: /* @__PURE__ */ jsx63(FieldInput, { children: (f) => /* @__PURE__ */ jsxs58(Gallery, { images, onChange: readOnly || disabled ? void 0 : onChange, ordering, confirmDelete, altHelp, altEditable, label, onFileDrag: fileDrag, children: [
          up.items.map((it) => /* @__PURE__ */ jsx63(UploadTile, { item: it, onCancel: () => up.cancel(it.id), onRetry: () => up.retry(it.id) }, it.id)),
          !readOnly && /* @__PURE__ */ jsx63("li", { className: cx("bc-tile is-add", (full || disabled) && "is-disabled", used === 0 && "is-empty"), children: /* @__PURE__ */ jsxs58("label", { children: [
            /* @__PURE__ */ jsx63(
              "input",
              {
                ref: input,
                id: f.id,
                type: "file",
                className: "bc-upload-input",
                multiple: true,
                accept: accept.join(","),
                disabled: full || disabled,
                "aria-describedby": [f.describedBy, rejected.length || failed.length ? rejId : ""].filter(Boolean).join(" ") || void 0,
                "aria-invalid": f.invalid || rejected.length > 0 || void 0,
                required: required && images.length === 0,
                onChange: (e) => {
                  void add(e.currentTarget.files);
                  e.currentTarget.value = "";
                }
              }
            ),
            /* @__PURE__ */ jsx63(IcPlus, {}),
            /* @__PURE__ */ jsx63("span", { className: "bc-tile-add-t", children: full ? "Tele" : "K\xE9p" }),
            /* @__PURE__ */ jsx63("span", { className: "bc-tile-add-s", children: full ? `${maxCount}/${maxCount} \u2013 t\xF6r\xF6lj egyet, ha \xFAjat tenn\xE9l fel` : used === 0 ? "H\xFAzd ide a k\xE9peket, vagy koppints" : "h\xFAzd ide vagy v\xE1laszd ki" })
          ] }) })
        ] }) })
      }
    ),
    (rejected.length > 0 || failed.length > 0) && /* @__PURE__ */ jsxs58("div", { className: "bc-upload-errors", id: rejId, children: [
      /* @__PURE__ */ jsxs58("ul", { role: "alert", children: [
        rejected.map((r, i) => /* @__PURE__ */ jsxs58("li", { children: [
          /* @__PURE__ */ jsx63("b", { children: r.file }),
          " \u2013 ",
          r.reason,
          ". ",
          r.next
        ] }, `r${i}`)),
        failed.map((it) => /* @__PURE__ */ jsxs58("li", { children: [
          /* @__PURE__ */ jsx63("b", { children: it.file.name }),
          " \u2013 ",
          it.error,
          " A csemp\xE9n az \u201E\xDAjra\u201D gombbal folytathatod."
        ] }, it.id))
      ] }),
      rejected.length > 0 && /* @__PURE__ */ jsx63("button", { type: "button", className: "bc-icon-btn", "aria-label": "\xDCzenetek bez\xE1r\xE1sa", onClick: () => setRejected([]), children: /* @__PURE__ */ jsx63(IcClose, {}) })
    ] }),
    note && /* @__PURE__ */ jsx63("p", { className: "bc-notice", role: "status", children: note }),
    crop && /* @__PURE__ */ jsx63(
      CropDialog,
      {
        file: queue.files[0] ?? null,
        crop,
        position: queue.total > 1 ? `${queue.total - queue.files.length + 1}/${queue.total}` : void 0,
        onDone: cropped,
        onSkip: skipped
      }
    ),
    noAlt > 0 && !readOnly && /* @__PURE__ */ jsxs58("p", { className: "bc-upload-alt", role: "status", children: [
      noAlt,
      " k\xE9pnek m\xE9g nincs le\xEDr\xE1sa \u2013 a csempe \u22EF men\xFCj\xE9ben add meg (\u201ELe\xEDr\xE1s\u201D)."
    ] })
  ] });
}

// react/src/media/VideoUpload.tsx
import { useEffect as useEffect13, useId as useId11, useRef as useRef24, useState as useState29 } from "react";
import { Fragment as Fragment17, jsx as jsx64, jsxs as jsxs59 } from "react/jsx-runtime";
var STEPS = [{ id: "file", label: "F\xE1jl" }, { id: "up", label: "Felt\xF6lt\xE9s" }, { id: "proc", label: "Feldolgoz\xE1s" }, { id: "done", label: "K\xE9sz" }];
function VideoUpload({ label, help, upload, process, onDone, maxSizeMB = 25, disabled }) {
  const [phase, setPhase] = useState29("file");
  const [file, setFile] = useState29(null);
  const [loaded, setLoaded] = useState29(0);
  const [failed, setFailed] = useState29(null);
  const [rej, setRej] = useState29(null);
  const [eta, setEta] = useState29();
  const ctrl = useRef24(null);
  const rejId = useId11();
  useEffect13(() => {
    if (phase !== "up") return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [phase]);
  useEffect13(() => () => ctrl.current?.abort(), []);
  const runProcess = async (f) => {
    setPhase("proc");
    setFailed(null);
    try {
      await process?.();
      setPhase("done");
      onDone?.(f);
    } catch (e) {
      setFailed(`${errorText(e)} A vide\xF3 fent van, csak a feldolgoz\xE1st kell \xFAjrakezdeni.`);
    }
  };
  const runUpload = async (f) => {
    setPhase("up");
    setLoaded(0);
    setFailed(null);
    setEta(void 0);
    const c = new AbortController();
    ctrl.current = c;
    const t0 = performance.now();
    try {
      await upload(f, { signal: c.signal, onProgress: (n) => {
        setLoaded(n);
        const rate = n / Math.max(1, performance.now() - t0);
        if (n > 0 && rate > 0) setEta(`kb. ${Math.max(1, Math.round((f.size - n) / rate / 1e3))} mp van h\xE1tra`);
      } });
      await runProcess(f);
    } catch (e) {
      if (isAbort(e)) {
        setPhase("file");
        setFile(null);
        setRej({ file: f.name, reason: "a felt\xF6lt\xE9st megszak\xEDtottad", next: "Ha m\xE9gis kell, v\xE1laszd ki \xFAjra." });
        return;
      }
      setFailed(errorText(e));
    }
  };
  const pick = async (list2) => {
    if (!list2?.length) return;
    const r = await checkFiles([list2[0]], {
      accept: ["video/mp4"],
      maxSizeMB,
      unit: "vide\xF3",
      typeHint: "Alak\xEDtsd \xE1t MP4-re (pl. egy vide\xF3szerkeszt\u0151vel vagy a telefon exportj\xE1val), \xE9s t\xF6ltsd fel \xFAjra.",
      sizeHint: "R\xF6vid\xEDtsd vagy t\xF6m\xF6r\xEDtsd a vide\xF3t, \xE9s pr\xF3b\xE1ld \xFAjra."
    });
    setRej(r.rejected[0] ?? null);
    if (r.ok[0]) {
      setFile(r.ok[0]);
      void runUpload(r.ok[0]);
    }
  };
  const reset = () => {
    setPhase("file");
    setFile(null);
    setFailed(null);
    setRej(null);
    setLoaded(0);
  };
  const cur = { file: 0, up: 1, proc: 2, done: 3 }[phase];
  const sizeText = file ? sizePair(loaded, file.size) : "";
  return /* @__PURE__ */ jsxs59("div", { className: "bc-video", children: [
    /* @__PURE__ */ jsx64(Stepper, { label: "A vide\xF3felt\xF6lt\xE9s l\xE9p\xE9sei", steps: stepsFrom(STEPS, phase === "done" ? 4 : cur, Boolean(failed)) }),
    /* @__PURE__ */ jsx64(
      Field,
      {
        label,
        help,
        disabled,
        range: `MP4 \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB \xB7 1 vide\xF3`,
        count: { value: file && phase !== "file" ? 1 : 0, max: 1, unit: "vide\xF3" },
        children: /* @__PURE__ */ jsx64(FieldInput, { children: (f) => phase === "file" ? /* @__PURE__ */ jsxs59("label", { className: "bc-dropzone", onDragOver: (e) => {
          if (!disabled) e.preventDefault();
        }, onDrop: (e) => {
          e.preventDefault();
          if (!disabled) void pick(e.dataTransfer.files);
        }, children: [
          /* @__PURE__ */ jsx64(
            "input",
            {
              id: f.id,
              type: "file",
              accept: "video/mp4",
              className: "bc-upload-input",
              disabled,
              "aria-describedby": [f.describedBy, rej && rejId].filter(Boolean).join(" ") || void 0,
              "aria-invalid": rej ? true : void 0,
              onChange: (e) => {
                void pick(e.currentTarget.files);
                e.currentTarget.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsx64(IcFile, {}),
          /* @__PURE__ */ jsx64("strong", { children: "Vide\xF3 kiv\xE1laszt\xE1sa" }),
          /* @__PURE__ */ jsx64("span", { children: "vagy h\xFAzd ide a f\xE1jlt" })
        ] }) : /* @__PURE__ */ jsxs59("div", { className: "bc-filecard", "aria-busy": phase === "up" || phase === "proc", children: [
          /* @__PURE__ */ jsxs59("div", { className: "bc-filecard-row", children: [
            /* @__PURE__ */ jsx64("b", { children: file?.name }),
            /* @__PURE__ */ jsx64("span", { className: "bc-filecard-size", children: sizeText })
          ] }),
          phase === "up" && /* @__PURE__ */ jsx64(Progress, { value: loaded, max: file?.size ?? 1, label: `${file?.name} felt\xF6lt\xE9se`, valueText: sizeText }),
          /* @__PURE__ */ jsxs59("div", { className: "bc-filecard-row", role: "status", children: [
            /* @__PURE__ */ jsx64("span", { children: failed ? /* @__PURE__ */ jsx64("span", { className: "bc-error", children: failed }) : phase === "up" ? `${Math.round(loaded / (file?.size || 1) * 100)}%${eta ? ` \xB7 ${eta}` : ""}` : phase === "proc" ? /* @__PURE__ */ jsxs59(Fragment17, { children: [
              /* @__PURE__ */ jsx64("span", { className: "bc-spinner", "aria-hidden": "true" }),
              " Feldolgoz\xE1s\u2026 ez eltarthat p\xE1r percig."
            ] }) : "K\xE9sz \u2013 a vide\xF3 fent van." }),
            /* @__PURE__ */ jsxs59("span", { className: "bc-row", children: [
              phase === "up" && !failed && /* @__PURE__ */ jsx64(Button, { variant: "secondary", size: "sm", onClick: () => ctrl.current?.abort(), children: "Megszak\xEDt\xE1s" }),
              failed && /* @__PURE__ */ jsx64(Button, { variant: "secondary", size: "sm", onClick: () => file && (phase === "proc" ? void runProcess(file) : void runUpload(file)), children: "\xDAjrapr\xF3b\xE1l\xE1s" }),
              (failed || phase === "done") && /* @__PURE__ */ jsx64(Button, { variant: "ghost", size: "sm", onClick: reset, children: phase === "done" ? "M\xE1sik vide\xF3" : "M\xE9gse" })
            ] })
          ] })
        ] }) })
      }
    ),
    rej && /* @__PURE__ */ jsxs59("p", { className: "bc-error", id: rejId, role: "alert", children: [
      /* @__PURE__ */ jsx64("b", { children: rej.file }),
      " \u2013 ",
      rej.reason,
      ". ",
      rej.next
    ] })
  ] });
}

// react/src/media/FileImport.tsx
import { useId as useId12, useRef as useRef25, useState as useState31 } from "react";

// react/src/media/ImportResult.tsx
import { useState as useState30 } from "react";
import { Fragment as Fragment18, jsx as jsx65, jsxs as jsxs60 } from "react/jsx-runtime";
var LEVEL = { error: "Hiba", warning: "Figyelmeztet\xE9s" };
var NO_REASON = "Az okot a rendszer nem adta meg \u2013 nyisd meg a sort az Excelben, \xE9s n\xE9zd \xE1t.";
var csvCell = (s) => `"${s.replace(/"/g, '""')}"`;
var issuesToCsv = (issues, sep = ";") => [["Sor", "Oszlop", "Szint", "Mi a baj", "Mit tegy\xE9l"], ...issues.map((i) => [String(i.row), i.column ?? "", LEVEL[i.level], i.reason ?? NO_REASON, i.next ?? ""])].map((r) => r.map(csvCell).join(sep)).join("\r\n");
function ImportResult({ result, fileName = "import-hibalista.csv", limit = 200 }) {
  const [said, setSaid] = useState30("");
  const { total, imported, issues } = result;
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.length - errors;
  const shown = [...issues].sort((a, b) => a.row - b.row).slice(0, limit);
  const kind = total === 0 ? "is-warning" : imported === 0 ? "is-danger" : issues.length ? "is-warning" : "is-success";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(issuesToCsv(issues, "	"));
      setSaid("A list\xE1t a v\xE1g\xF3lapra m\xE1soltam \u2013 beillesztheted az Excelbe.");
    } catch {
      setSaid("Nem siker\xFClt m\xE1solni \u2013 t\xF6ltsd le ink\xE1bb a list\xE1t.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob(["\uFEFF" + issuesToCsv(issues)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    setSaid(`Let\xF6ltve: ${fileName}`);
  };
  return /* @__PURE__ */ jsxs60("section", { className: "bc-import-result", children: [
    /* @__PURE__ */ jsx65("div", { className: `bc-alert ${kind}`, role: imported === 0 && total > 0 ? "alert" : "status", children: /* @__PURE__ */ jsx65("p", { children: total === 0 ? /* @__PURE__ */ jsxs60(Fragment18, { children: [
      /* @__PURE__ */ jsx65("strong", { children: "A f\xE1jlban nincs adatsor." }),
      " Csak a fejl\xE9c van benne? T\xF6ltsd ki a sablont, \xE9s pr\xF3b\xE1ld \xFAjra."
    ] }) : /* @__PURE__ */ jsxs60(Fragment18, { children: [
      /* @__PURE__ */ jsxs60("strong", { children: [
        formatHu(total, 0),
        " sorb\xF3l ",
        formatHu(imported, 0),
        " beker\xFClt."
      ] }),
      " ",
      errors > 0 && /* @__PURE__ */ jsxs60(Fragment18, { children: [
        formatHu(errors, 0),
        " sor kimaradt (hiba). "
      ] }),
      warnings > 0 && /* @__PURE__ */ jsxs60(Fragment18, { children: [
        formatHu(warnings, 0),
        " sor figyelmeztet\xE9ssel ker\xFClt be. "
      ] }),
      issues.length === 0 && "Minden sor rendben volt."
    ] }) }) }),
    issues.length > 0 && /* @__PURE__ */ jsxs60(Fragment18, { children: [
      /* @__PURE__ */ jsx65("div", { className: "bc-table-wrap bc-import-list", tabIndex: 0, role: "region", "aria-label": `Hibalista: ${issues.length} sor, ${imported}/${total} beker\xFClt`, children: /* @__PURE__ */ jsxs60("table", { className: "bc-table is-dense", children: [
        /* @__PURE__ */ jsx65("thead", { children: /* @__PURE__ */ jsxs60("tr", { children: [
          /* @__PURE__ */ jsx65("th", { scope: "col", className: "is-num", children: "Sor" }),
          /* @__PURE__ */ jsx65("th", { scope: "col", children: "Oszlop" }),
          /* @__PURE__ */ jsx65("th", { scope: "col", children: "Mi a baj, mit tegy\xE9l" })
        ] }) }),
        /* @__PURE__ */ jsx65("tbody", { children: shown.map((i, n) => /* @__PURE__ */ jsxs60("tr", { className: `is-${i.level}`, children: [
          /* @__PURE__ */ jsxs60("td", { className: "is-num", children: [
            i.row,
            "."
          ] }),
          /* @__PURE__ */ jsx65("td", { children: i.column ?? "\u2013" }),
          /* @__PURE__ */ jsxs60("td", { children: [
            /* @__PURE__ */ jsx65("span", { className: `bc-badge ${i.level === "error" ? "is-danger" : "is-warning"}`, children: LEVEL[i.level] }),
            " ",
            i.reason ?? NO_REASON,
            i.next && /* @__PURE__ */ jsxs60(Fragment18, { children: [
              " ",
              /* @__PURE__ */ jsx65("b", { children: i.next })
            ] })
          ] })
        ] }, `${i.row}-${i.column}-${n}`)) })
      ] }) }),
      issues.length > shown.length && /* @__PURE__ */ jsxs60("p", { className: "bc-help", children: [
        "Az els\u0151 ",
        limit,
        " sort mutatom; a teljes lista (",
        formatHu(issues.length, 0),
        " sor) a let\xF6lt\xF6tt f\xE1jlban van."
      ] }),
      /* @__PURE__ */ jsxs60("div", { className: "bc-row", children: [
        /* @__PURE__ */ jsx65(Button, { variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx65(IcDownload, {}), onClick: download, children: "Hibalista let\xF6lt\xE9se" }),
        /* @__PURE__ */ jsx65(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx65(IcCopy, {}), onClick: () => void copy(), children: "M\xE1sol\xE1s" }),
        /* @__PURE__ */ jsx65("span", { className: "bc-notice", role: "status", children: said })
      ] })
    ] })
  ] });
}

// react/src/media/FileImport.tsx
import { jsx as jsx66, jsxs as jsxs61 } from "react/jsx-runtime";
var XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var XLS = "application/vnd.ms-excel";
function FileImport({ label, help, importFile, maxSizeMB = 10, allowXls = true, template, disabled }) {
  const [file, setFile] = useState31(null);
  const [loaded, setLoaded] = useState31(0);
  const [result, setResult] = useState31(null);
  const [rej, setRej] = useState31(null);
  const [failed, setFailed] = useState31(null);
  const ctrl = useRef25(null);
  const lastKey = useRef25(null);
  const [dup, setDup] = useState31(null);
  const rejId = useId12();
  const accept = allowXls ? [XLSX, XLS] : [XLSX];
  const busy = Boolean(file) && !result && !failed;
  const run = async (f) => {
    setFile(f);
    setLoaded(0);
    setResult(null);
    setFailed(null);
    setDup(null);
    lastKey.current = fileKey(f);
    const c = new AbortController();
    ctrl.current = c;
    try {
      setResult(await importFile(f, { signal: c.signal, onProgress: setLoaded }));
    } catch (e) {
      if (isAbort(e)) {
        setFile(null);
        setRej({ file: f.name, reason: "az importot megszak\xEDtottad", next: "Semmi nem ker\xFClt be. Ha kell, kezdd \xFAjra." });
        return;
      }
      setFailed(errorText(e));
    }
  };
  const pick = async (list2) => {
    if (!list2?.length) return;
    const r = await checkFiles([list2[0]], {
      accept,
      maxSizeMB,
      unit: "f\xE1jl",
      typeHint: "Nyisd meg az Excelben, \xE9s mentsd el \u201EExcel-munkaf\xFCzet (.xlsx)\u201D form\xE1tumban \u2013 a CSV \xE9s a Numbers nem j\xF3.",
      sizeHint: "Bontsd k\xE9t f\xE1jlra (pl. 5 000 soronk\xE9nt), \xE9s t\xF6ltsd fel egym\xE1s ut\xE1n."
    });
    setRej(r.rejected[0] ?? null);
    if (r.ok[0] && fileKey(r.ok[0]) === lastKey.current) {
      setFile(null);
      setResult(null);
      setDup(r.ok[0]);
      return;
    }
    if (r.ok[0]) void run(r.ok[0]);
  };
  const reset = () => {
    setFile(null);
    setResult(null);
    setFailed(null);
    setRej(null);
  };
  const sizeText = file ? sizePair(loaded, file.size) : "";
  return /* @__PURE__ */ jsxs61("div", { className: "bc-import", children: [
    /* @__PURE__ */ jsx66(
      Field,
      {
        label,
        help,
        disabled,
        range: `${allowXls ? ".xlsx vagy .xls" : ".xlsx"} \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB \xB7 1 f\xE1jl`,
        count: { value: file ? 1 : 0, max: 1, unit: "f\xE1jl" },
        children: /* @__PURE__ */ jsx66(FieldInput, { children: (f) => !file ? /* @__PURE__ */ jsxs61("label", { className: "bc-dropzone", onDragOver: (e) => {
          if (!disabled) e.preventDefault();
        }, onDrop: (e) => {
          e.preventDefault();
          if (!disabled) void pick(e.dataTransfer.files);
        }, children: [
          /* @__PURE__ */ jsx66(
            "input",
            {
              id: f.id,
              type: "file",
              className: "bc-upload-input",
              disabled,
              accept: `.xlsx${allowXls ? ",.xls" : ""},${accept.join(",")}`,
              "aria-describedby": [f.describedBy, rej && rejId].filter(Boolean).join(" ") || void 0,
              "aria-invalid": rej ? true : void 0,
              onChange: (e) => {
                void pick(e.currentTarget.files);
                e.currentTarget.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsx66(IcFile, {}),
          /* @__PURE__ */ jsx66("strong", { children: "Excel-f\xE1jl kiv\xE1laszt\xE1sa" }),
          /* @__PURE__ */ jsx66("span", { children: "vagy h\xFAzd ide" })
        ] }) : /* @__PURE__ */ jsxs61("div", { className: "bc-filecard", "aria-busy": busy, children: [
          /* @__PURE__ */ jsxs61("div", { className: "bc-filecard-row", children: [
            /* @__PURE__ */ jsx66("b", { children: file.name }),
            /* @__PURE__ */ jsx66("span", { className: "bc-filecard-size", children: sizeText })
          ] }),
          busy && /* @__PURE__ */ jsx66(Progress, { value: loaded, max: file.size, label: `${file.name} import\xE1l\xE1sa`, valueText: sizeText }),
          /* @__PURE__ */ jsxs61("div", { className: "bc-filecard-row", role: "status", children: [
            /* @__PURE__ */ jsx66("span", { children: failed ? /* @__PURE__ */ jsx66("span", { className: "bc-error", children: failed }) : busy ? loaded >= file.size ? "Feldolgoz\xE1s \u2013 a sorokat ellen\u0151rz\xF6m\u2026" : "Felt\xF6lt\xE9s\u2026" : "K\xE9sz." }),
            /* @__PURE__ */ jsxs61("span", { className: "bc-row", children: [
              busy && /* @__PURE__ */ jsx66(Button, { variant: "secondary", size: "sm", onClick: () => ctrl.current?.abort(), children: "Megszak\xEDt\xE1s" }),
              failed && /* @__PURE__ */ jsx66(Button, { variant: "secondary", size: "sm", onClick: () => void run(file), children: "\xDAjrapr\xF3b\xE1l\xE1s" }),
              !busy && /* @__PURE__ */ jsx66(Button, { variant: "ghost", size: "sm", onClick: reset, children: "M\xE1sik f\xE1jl" })
            ] })
          ] })
        ] }) })
      }
    ),
    dup && /* @__PURE__ */ jsx66("div", { className: "bc-alert is-warning", role: "alert", children: /* @__PURE__ */ jsxs61("div", { children: [
      /* @__PURE__ */ jsxs61("p", { children: [
        /* @__PURE__ */ jsxs61("strong", { children: [
          "Ezt a f\xE1jlt (",
          dup.name,
          ") az im\xE9nt m\xE1r import\xE1ltad."
        ] }),
        " Ha \xFAjra bek\xFCld\xF6d, a sorok k\xE9tszer ker\xFClhetnek be."
      ] }),
      /* @__PURE__ */ jsxs61("div", { className: "bc-row", children: [
        /* @__PURE__ */ jsx66(Button, { variant: "secondary", size: "sm", onClick: () => void run(dup), children: "M\xE9gis import\xE1lom" }),
        /* @__PURE__ */ jsx66(Button, { variant: "ghost", size: "sm", onClick: () => setDup(null), children: "M\xE9gse" })
      ] })
    ] }) }),
    rej && /* @__PURE__ */ jsxs61("p", { className: "bc-error", id: rejId, role: "alert", children: [
      /* @__PURE__ */ jsx66("b", { children: rej.file }),
      " \u2013 ",
      rej.reason,
      ". ",
      rej.next
    ] }),
    template && !file && /* @__PURE__ */ jsxs61("p", { className: "bc-help", children: [
      /* @__PURE__ */ jsx66("a", { href: template.href, download: true, children: template.label ?? "Sablon let\xF6lt\xE9se (.xlsx)" }),
      " \u2013 ebbe \xEDrd az adatokat, a fejl\xE9cet ne m\xF3dos\xEDtsd."
    ] }),
    result && /* @__PURE__ */ jsx66(ImportResult, { result, fileName: `${file?.name.replace(/\.[^.]+$/, "") ?? "import"}-hibalista.csv` })
  ] });
}

// react/src/media/map.ts
var esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function markerHtml({ label, kind = "neutral", selected = false, title }) {
  const name2 = title ? esc(title) : esc(label);
  return `<span class="bc-map-pin is-${kind}${selected ? " is-selected" : ""}" role="img" aria-label="${name2}${selected ? " (kijel\xF6lve)" : ""}" title="${name2}"><span aria-hidden="true">${esc(label.slice(0, 2))}</span></span>`;
}
var MARKER_ICON = { className: "bc-map-icon", iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -38] };
var MARKER_ICON_SELECTED = { className: "bc-map-icon", iconSize: [40, 50], iconAnchor: [20, 50], popupAnchor: [0, -48] };
var clusterTier = (count) => count < 10 ? "s" : count < 100 ? "m" : "l";
var TIER_PX = { s: 36, m: 44, l: 52 };
function clusterHtml(count) {
  const t = clusterTier(count);
  const n = count >= 1e4 ? `${formatHu(Math.floor(count / 1e3), 0)}e+` : formatHu(count, 0);
  return `<span class="bc-map-cluster is-${t}" role="img" aria-label="${formatHu(count, 0)} hely \u2013 nagy\xEDts r\xE1 a sz\xE9tnyit\xE1shoz"><span aria-hidden="true">${n}</span></span>`;
}
var clusterIcon = (count) => {
  const px = TIER_PX[clusterTier(count)];
  return { className: "bc-map-icon", iconSize: [px, px] };
};
function heatGradient(el = document.documentElement, colorblind = false) {
  const cs = getComputedStyle(el);
  const out = {};
  for (let i = 1; i <= 5; i++) out[i / 5] = cs.getPropertyValue(`--bc-data-seq-${colorblind ? "cb-" : ""}${i}`).trim();
  return out;
}

// react/src/media/MapLegend.tsx
import { useState as useState32 } from "react";
import { jsx as jsx67, jsxs as jsxs62 } from "react/jsx-runtime";
var wide = () => typeof window !== "undefined" && window.matchMedia("(min-width: 600px)").matches;
function MapLegend({ items, title = "Jelmagyar\xE1zat", collapsible = true, defaultOpen, className }) {
  const [open] = useState32(() => defaultOpen ?? wide());
  const list2 = /* @__PURE__ */ jsx67("ul", { className: "bc-map-legend-list", children: items.map((i) => /* @__PURE__ */ jsxs62("li", { children: [
    /* @__PURE__ */ jsx67("span", { className: `bc-map-swatch is-${i.kind}`, "aria-hidden": "true", children: i.letter }),
    i.label
  ] }, i.label)) });
  if (!collapsible) return /* @__PURE__ */ jsxs62("div", { className: cx("bc-map-legend", className), role: "group", "aria-label": title, children: [
    /* @__PURE__ */ jsx67("strong", { children: title }),
    list2
  ] });
  return /* @__PURE__ */ jsxs62("details", { className: cx("bc-map-legend", className), open, children: [
    /* @__PURE__ */ jsx67("summary", { children: title }),
    list2
  ] });
}
function HeatScale({ title, unit, help, ends = ["kev\xE9s", "sok"], steps, howToRead, colorblind, className }) {
  return /* @__PURE__ */ jsxs62("figure", { className: cx("bc-heat", colorblind && "is-cb", className), "aria-label": `${title}, ${unit}`, children: [
    /* @__PURE__ */ jsxs62("figcaption", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsx67("span", { className: "bc-label", children: title }),
      /* @__PURE__ */ jsx67(HelpButton, { label: title, children: help })
    ] }),
    /* @__PURE__ */ jsx67("p", { className: "bc-heat-unit", children: unit }),
    /* @__PURE__ */ jsx67("div", { className: "bc-heat-bar", "aria-hidden": "true", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx67("i", {}, i)) }),
    /* @__PURE__ */ jsxs62("div", { className: "bc-heat-ends", children: [
      /* @__PURE__ */ jsx67("span", { children: ends[0] }),
      /* @__PURE__ */ jsx67("span", { children: ends[1] })
    ] }),
    steps && /* @__PURE__ */ jsxs62("table", { className: "bc-heat-steps", children: [
      /* @__PURE__ */ jsxs62("caption", { className: "bc-sr", children: [
        title,
        " \u2013 fokozatok (",
        unit,
        ")"
      ] }),
      /* @__PURE__ */ jsx67("tbody", { children: /* @__PURE__ */ jsx67("tr", { children: steps.map((s, i) => /* @__PURE__ */ jsxs62("td", { children: [
        /* @__PURE__ */ jsx67("i", { className: `bc-heat-sw is-${i + 1}`, "aria-hidden": "true" }),
        s
      ] }, i)) }) })
    ] }),
    howToRead && /* @__PURE__ */ jsxs62("details", { className: "bc-heat-how", children: [
      /* @__PURE__ */ jsx67("summary", { children: "Hogyan olvasd?" }),
      /* @__PURE__ */ jsx67("div", { children: howToRead })
    ] })
  ] });
}

// react/src/media/MonthCalendar.tsx
import { useEffect as useEffect14, useMemo as useMemo3, useRef as useRef26, useState as useState33 } from "react";

// react/src/media/monthEvents.ts
var KIND_ROLE = { event: "info", special: "warning", education: "success" };
var KIND_LABEL = { event: "Esem\xE9ny", special: "Speci\xE1lis nap", education: "Oktat\xE1s" };
var ORDER = ["special", "event", "education"];
function eventsByDay(events, days, hidden) {
  const map = new Map(days.map((d) => [d, []]));
  const first = days[0], last = days[days.length - 1];
  for (const e of events) {
    if (hidden.has(e.kind)) continue;
    if (e.yearly) {
      for (const y of /* @__PURE__ */ new Set([first.slice(0, 4), last.slice(0, 4)])) map.get(`${y}${e.date.slice(4)}`)?.push(e);
      continue;
    }
    const end = e.end && e.end > e.date ? e.end : e.date;
    for (let d = e.date < first ? first : e.date; d <= end && d <= last; d = addDays(d, 1)) map.get(d)?.push(e);
  }
  for (const list2 of map.values()) list2.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.title.localeCompare(b.title, "hu"));
  return map;
}
var dayTitle = (iso) => {
  const d = fromIso(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}`;
};

// react/src/media/MonthParts.tsx
import { jsx as jsx68, jsxs as jsxs63 } from "react/jsx-runtime";
var KINDS = ["event", "special", "education"];
function MonthLegend({ names, hidden, onHiddenChange }) {
  if (!onHiddenChange) {
    return /* @__PURE__ */ jsx68("ul", { className: "bc-mcal-legend", "aria-label": "Jelmagyar\xE1zat", children: KINDS.map((k) => /* @__PURE__ */ jsx68("li", { children: /* @__PURE__ */ jsx68("span", { className: `bc-mcal-ev is-${KIND_ROLE[k]}`, children: names[k] }) }, k)) });
  }
  const toggle = (k) => onHiddenChange(hidden.has(k) ? [...hidden].filter((x) => x !== k) : [...hidden, k]);
  return /* @__PURE__ */ jsx68("div", { className: "bc-mcal-legend", role: "group", "aria-label": "Jelmagyar\xE1zat \xE9s sz\u0171r\u0151 \u2013 mit mutasson a napt\xE1r", children: KINDS.map((k) => /* @__PURE__ */ jsxs63("button", { type: "button", className: `bc-tag bc-mcal-filter is-${KIND_ROLE[k]}`, "aria-pressed": !hidden.has(k), onClick: () => toggle(k), children: [
    /* @__PURE__ */ jsx68("span", { "aria-hidden": "true", children: hidden.has(k) ? "\u25CB" : "\u2713" }),
    names[k]
  ] }, k)) });
}
function MonthAgenda({ iso, events, names }) {
  return /* @__PURE__ */ jsxs63("section", { className: "bc-mcal-agenda", children: [
    /* @__PURE__ */ jsx68("h3", { className: "bc-mcal-agenda-title", children: dayTitle(iso) }),
    events.length ? /* @__PURE__ */ jsx68("ul", { children: events.map((e) => /* @__PURE__ */ jsxs63("li", { className: `bc-mcal-ev is-${KIND_ROLE[e.kind]}`, children: [
      /* @__PURE__ */ jsx68("span", { children: e.title }),
      " ",
      /* @__PURE__ */ jsx68("span", { className: "bc-mcal-kind", children: names[e.kind] })
    ] }, e.id)) }) : /* @__PURE__ */ jsx68("p", { className: "bc-mcal-note", children: "Ezen a napon nincs tartalom." })
  ] });
}

// react/src/media/MonthCalendar.tsx
import { jsx as jsx69, jsxs as jsxs64 } from "react/jsx-runtime";
function MonthCalendar({ events, initialDate, onMonthChange, onSelectDay, maxPerDay = 3, loading, error, onRetry, hidden = [], onHiddenChange, labels }) {
  const [focus, setFocus] = useState33(initialDate ?? todayIso());
  const [selected, setSelected] = useState33(focus);
  const grid = useRef26(null);
  const moved = useRef26(false);
  const f = fromIso(focus);
  const monthKey = `${f.getFullYear()}-${f.getMonth()}`;
  const days = useMemo3(() => monthGrid(f.getFullYear(), f.getMonth()).map(toIso), [monthKey]);
  const hid = useMemo3(() => new Set(hidden), [hidden]);
  const byDay = useMemo3(() => eventsByDay(events, days, hid), [events, days, hid]);
  const names = { ...KIND_LABEL, ...labels };
  const today = todayIso();
  const title = `${f.getFullYear()}. ${MONTHS[f.getMonth()]}`;
  const monthCount = days.filter((d) => fromIso(d).getMonth() === f.getMonth()).reduce((n, d) => n + (byDay.get(d)?.length ?? 0), 0);
  const first = useRef26(true);
  useEffect14(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onMonthChange?.(`${focus.slice(0, 7)}-01`);
  }, [monthKey]);
  useEffect14(() => {
    if (moved.current) {
      grid.current?.querySelector(`[data-iso="${focus}"]`)?.focus({ preventScroll: true });
      moved.current = false;
    }
  }, [focus]);
  const go = (iso, kb = false) => {
    moved.current = kb;
    setFocus(iso);
  };
  const pick = (iso) => {
    setFocus(iso);
    setSelected(iso);
    onSelectDay?.(iso, byDay.get(iso) ?? []);
  };
  const onKey = (e) => {
    const dow = (f.getDay() + 6) % 7;
    const map = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
      Home: () => addDays(focus, -dow),
      End: () => addDays(focus, 6 - dow)
    };
    if (map[e.key]) {
      e.preventDefault();
      go(map[e.key](), true);
    }
  };
  return /* @__PURE__ */ jsxs64("div", { className: "bc-mcal", "aria-busy": loading || void 0, children: [
    /* @__PURE__ */ jsxs64("div", { className: "bc-mcal-head", children: [
      /* @__PURE__ */ jsx69(IconButton, { "aria-label": "El\u0151z\u0151 h\xF3nap", onClick: () => go(addMonths(focus, -1)), children: /* @__PURE__ */ jsx69(IcLeft, {}) }),
      /* @__PURE__ */ jsx69("h2", { className: "bc-mcal-title", "aria-live": "polite", children: title }),
      /* @__PURE__ */ jsx69(IconButton, { "aria-label": "K\xF6vetkez\u0151 h\xF3nap", onClick: () => go(addMonths(focus, 1)), children: /* @__PURE__ */ jsx69(IcRight, {}) }),
      /* @__PURE__ */ jsx69(Button, { variant: "secondary", size: "sm", onClick: () => {
        go(today);
        setSelected(today);
      }, disabled: focus.slice(0, 7) === today.slice(0, 7), children: "Ma" })
    ] }),
    /* @__PURE__ */ jsx69(MonthLegend, { names, hidden: hid, onHiddenChange }),
    loading && /* @__PURE__ */ jsxs64("p", { className: "bc-mcal-note", role: "status", children: [
      /* @__PURE__ */ jsx69("span", { className: "bc-spinner", "aria-hidden": "true" }),
      " T\xF6lt\xF6m a h\xF3nap tartalm\xE1t\u2026"
    ] }),
    error && /* @__PURE__ */ jsxs64("div", { className: "bc-alert is-danger", role: "alert", children: [
      /* @__PURE__ */ jsx69("p", { children: error }),
      onRetry && /* @__PURE__ */ jsx69(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
    ] }),
    !error && !loading && monthCount === 0 && /* @__PURE__ */ jsx69("p", { className: "bc-mcal-note", role: "status", children: hid.size >= 3 ? "Minden tartalomfajta ki van kapcsolva \u2013 kapcsolj be egyet a jelmagyar\xE1zatban." : `${title}: ebben a h\xF3napban m\xE9g nincs tartalom.` }),
    /* @__PURE__ */ jsx69("div", { className: "bc-mcal-scroll", children: /* @__PURE__ */ jsxs64("table", { className: "bc-mcal-grid", role: "grid", ref: grid, onKeyDown: onKey, "aria-label": `${title} \u2013 tartalmi napt\xE1r`, children: [
      /* @__PURE__ */ jsx69("thead", { children: /* @__PURE__ */ jsx69("tr", { children: WEEKDAYS.map((w, i) => /* @__PURE__ */ jsx69("th", { scope: "col", abbr: WEEKDAYS_LONG[i], children: w }, w)) }) }),
      /* @__PURE__ */ jsx69("tbody", { children: Array.from({ length: 6 }, (_, w) => /* @__PURE__ */ jsx69("tr", { children: days.slice(w * 7, w * 7 + 7).map((iso) => {
        const list2 = byDay.get(iso) ?? [];
        const out = fromIso(iso).getMonth() !== f.getMonth();
        const more = list2.length - maxPerDay;
        const summary = list2.length ? `, ${list2.length} tartalom: ${list2.map((e) => `${e.title} (${names[e.kind]})`).join("; ")}` : ", nincs tartalom";
        return /* @__PURE__ */ jsx69("td", { role: "gridcell", "aria-selected": iso === selected, children: /* @__PURE__ */ jsxs64(
          "button",
          {
            type: "button",
            "data-iso": iso,
            tabIndex: iso === focus ? 0 : -1,
            onClick: () => pick(iso),
            className: cx("bc-mcal-day", out && "is-outside", iso === today && "is-today", iso === selected && "is-selected"),
            "aria-label": `${iso === today ? "Ma, " : ""}${dayTitle(iso)}${summary}`,
            children: [
              /* @__PURE__ */ jsx69("b", { "aria-hidden": "true", children: fromIso(iso).getDate() }),
              /* @__PURE__ */ jsxs64("span", { className: "bc-mcal-evs", "aria-hidden": "true", children: [
                list2.slice(0, more > 0 ? maxPerDay - 1 : maxPerDay).map((e) => /* @__PURE__ */ jsx69("span", { className: `bc-mcal-ev is-${KIND_ROLE[e.kind]}`, children: e.title }, e.id)),
                more > 0 && /* @__PURE__ */ jsxs64("span", { className: "bc-mcal-more", children: [
                  "+",
                  more + 1,
                  " tov\xE1bbi"
                ] })
              ] }),
              /* @__PURE__ */ jsx69("span", { className: "bc-mcal-dots", "aria-hidden": "true", children: [...new Set(list2.map((e) => e.kind))].map((k) => /* @__PURE__ */ jsx69("i", { className: `is-${KIND_ROLE[k]}` }, k)) })
            ]
          }
        ) }, iso);
      }) }, w)) })
    ] }) }),
    /* @__PURE__ */ jsx69(MonthAgenda, { iso: selected, events: byDay.get(selected) ?? eventsByDay(events, [selected], hid).get(selected) ?? [], names })
  ] });
}

// react/src/media/OpeningHoursEditor.tsx
import { useEffect as useEffect15, useId as useId13, useState as useState34 } from "react";

// react/src/media/openingHours.ts
var WEEK = [
  { key: "Mon", label: "H\xE9tf\u0151" },
  { key: "Tue", label: "Kedd" },
  { key: "Wed", label: "Szerda" },
  { key: "Thu", label: "Cs\xFCt\xF6rt\xF6k" },
  { key: "Fri", label: "P\xE9ntek" },
  { key: "Sat", label: "Szombat" },
  { key: "Sun", label: "Vas\xE1rnap" }
];
function parseTime(text) {
  const t = text.trim().toLowerCase().replace(/\s+/g, "");
  if (!t) return null;
  const m = t.match(/^(\d{1,2})(?:[:.,h]?(\d{2}))?(am|pm|de|du)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const mi = Number(m[2] ?? 0);
  const ap = m[3];
  if (ap) {
    if (h < 1 || h > 12) return null;
    if (ap === "pm" || ap === "du") h = h % 12 + 12;
    else h = h % 12;
  }
  if (mi > 59 || h > 24 || h === 24 && mi > 0) return null;
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}
function validateHours(v) {
  const err = {};
  for (const { key, label } of WEEK) {
    const d = v[key];
    if (!d.open) continue;
    if (!d.from || !d.to) {
      err[key] = `${label}: add meg a nyit\xE1st \xE9s a z\xE1r\xE1st is, vagy kapcsold \u201EZ\xE1rva\u201D-ra.`;
      continue;
    }
    if (d.to <= d.from) {
      err[key] = d.to === d.from ? `${label}: a nyit\xE1s \xE9s a z\xE1r\xE1s ugyanaz (${d.from}). Eg\xE9sz napos nyitvatart\xE1shoz \xEDrd: 00:00\u201324:00.` : `${label}: a z\xE1r\xE1s (${d.to}) a nyit\xE1s (${d.from}) el\u0151tt van. \xC9jf\xE9l ut\xE1ni z\xE1r\xE1st most nem tudunk t\xE1rolni \u2013 legk\xE9s\u0151bb 24:00 lehet.`;
    }
  }
  return err;
}
var emptyWeek = () => Object.fromEntries(WEEK.map(({ key }) => [key, { open: false, from: null, to: null }]));

// react/src/media/OpeningHoursEditor.tsx
import { jsx as jsx70, jsxs as jsxs65 } from "react/jsx-runtime";
function TimeInput({ value, onCommit, label, invalid, describedBy, disabled, readOnly }) {
  const [text, setText] = useState34(value ?? "");
  useEffect15(() => setText(value ?? ""), [value]);
  return /* @__PURE__ */ jsx70(
    "input",
    {
      className: "bc-input bc-hours-time",
      value: text,
      placeholder: "\xF3\xF3:pp",
      "aria-label": label,
      "aria-invalid": invalid || void 0,
      "aria-describedby": describedBy,
      maxLength: 7,
      disabled,
      readOnly,
      autoComplete: "off",
      onChange: (e) => setText(e.target.value.replace(/[^\d:.,apmdeu ]/gi, "")),
      onBlur: () => {
        const t = parseTime(text);
        if (t) setText(t);
        onCommit(t, Boolean(text.trim()) && !t);
      }
    }
  );
}
function OpeningHoursEditor({ label = "Nyitvatart\xE1s", help, value, onChange, disabled, readOnly }) {
  const id = useId13();
  const [bad2, setBad] = useState34({});
  const [note, setNote] = useState34();
  const errors = { ...validateHours(value), ...bad2 };
  const locked = disabled || readOnly;
  const set = (k, p) => {
    setNote(void 0);
    onChange({ ...value, [k]: { ...value[k], ...p } });
  };
  const commit = (k, field, t, wrong) => {
    setBad((b) => {
      const n = { ...b };
      if (wrong) n[k] = `${WEEK.find((d) => d.key === k).label}: ezt nem \xE9rtem id\u0151nek \u2013 \xEDrd \xEDgy: 08:30 (vagy 8, 830).`;
      else delete n[k];
      return n;
    });
    if (!wrong) set(k, { [field]: t });
  };
  const copyMon = () => {
    const m = value.Mon;
    onChange({ ...value, Tue: { ...m }, Wed: { ...m }, Thu: { ...m }, Fri: { ...m } });
    setNote(`\xC1tm\xE1soltam a keddt\u0151l p\xE9ntekig tart\xF3 napokra: ${m.open ? `${m.from ?? "\u2013"}\u2013${m.to ?? "\u2013"}` : "z\xE1rva"}.`);
  };
  return /* @__PURE__ */ jsxs65("div", { role: "group", className: cx("bc-field bc-hours", disabled && "is-disabled"), "aria-labelledby": `${id}-l`, "aria-describedby": `${id}-meta`, children: [
    /* @__PURE__ */ jsxs65("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsx70("span", { className: "bc-label", id: `${id}-l`, children: label }),
      /* @__PURE__ */ jsx70(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsx70("div", { className: "bc-hours-list", children: WEEK.map(({ key, label: day }) => {
      const d = value[key];
      const err = errors[key];
      const errId = `${id}-${key}-err`;
      return /* @__PURE__ */ jsxs65("div", { className: cx("bc-hours-row", err && "is-invalid"), "data-day": key, children: [
        /* @__PURE__ */ jsx70("span", { className: "bc-hours-day", id: `${id}-${key}`, children: day }),
        /* @__PURE__ */ jsx70(
          "button",
          {
            type: "button",
            role: "switch",
            className: "bc-switch",
            "aria-checked": d.open,
            disabled: locked,
            "aria-label": `${day}: nyitva`,
            onClick: () => set(key, d.open ? { open: false } : { open: true, from: d.from ?? "08:00", to: d.to ?? "18:00" })
          }
        ),
        d.open ? /* @__PURE__ */ jsxs65("span", { className: "bc-hours-times", role: "group", "aria-labelledby": `${id}-${key}`, children: [
          /* @__PURE__ */ jsx70(TimeInput, { value: d.from, label: `${day}: nyit\xE1s`, invalid: Boolean(err), describedBy: err ? errId : void 0, disabled, readOnly, onCommit: (t, w) => commit(key, "from", t, w) }),
          /* @__PURE__ */ jsx70("span", { "aria-hidden": "true", children: "\u2013" }),
          /* @__PURE__ */ jsx70(TimeInput, { value: d.to, label: `${day}: z\xE1r\xE1s`, invalid: Boolean(err), describedBy: err ? errId : void 0, disabled, readOnly, onCommit: (t, w) => commit(key, "to", t, w) })
        ] }) : /* @__PURE__ */ jsx70("span", { className: "bc-hours-closed", children: "Z\xE1rva" }),
        err && /* @__PURE__ */ jsx70("p", { className: "bc-error", id: errId, role: "alert", children: err })
      ] }, key);
    }) }),
    /* @__PURE__ */ jsxs65("div", { className: "bc-meta", id: `${id}-meta`, children: [
      /* @__PURE__ */ jsx70("span", { children: "naponta egy s\xE1v \xB7 00:00\u201324:00 \xB7 a z\xE1r\xE1s a nyit\xE1s ut\xE1n" }),
      /* @__PURE__ */ jsxs65("span", { className: "bc-count", children: [
        WEEK.filter((d) => value[d.key].open).length,
        "/7 nap nyitva"
      ] })
    ] }),
    !locked && /* @__PURE__ */ jsx70("div", { className: "bc-row", children: /* @__PURE__ */ jsx70(Button, { variant: "secondary", size: "sm", onClick: copyMon, children: "H\xE9tf\u0151 m\xE1sol\xE1sa a h\xE9tk\xF6znapokra" }) }),
    note && /* @__PURE__ */ jsx70("p", { className: "bc-notice", role: "status", children: note })
  ] });
}

// react/src/media/Avatar.tsx
import { useEffect as useEffect16, useState as useState35 } from "react";
import { jsx as jsx71 } from "react/jsx-runtime";
var DIGRAPH = /^(dzs|cs|dz|gy|ly|ny|sz|ty|zs)/i;
var firstLetter = (w) => {
  const m = w.match(DIGRAPH);
  return m ? m[0][0].toUpperCase() + m[0].slice(1).toLowerCase() : w.charAt(0).toUpperCase();
};
function initials(name2) {
  const words = name2.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w));
  if (!words.length) return "?";
  if (words.length === 1) return firstLetter(words[0]);
  return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
}
function Avatar({ name: name2, src, size = 40, shape = "circle", decorative = false, className }) {
  const [broken, setBroken] = useState35(false);
  useEffect16(() => setBroken(false), [src]);
  const showImg = src && !broken;
  return /* @__PURE__ */ jsx71(
    "span",
    {
      className: cx("bc-avatar", `is-${size}`, shape === "square" && "is-square", className),
      role: showImg || decorative ? void 0 : "img",
      "aria-label": showImg || decorative ? void 0 : name2,
      "aria-hidden": decorative && !showImg ? true : void 0,
      children: showImg ? /* @__PURE__ */ jsx71("img", { src, alt: decorative ? "" : name2, onError: () => setBroken(true) }) : /* @__PURE__ */ jsx71("span", { "aria-hidden": "true", children: initials(name2) })
    }
  );
}

// react/src/meh/Bee.tsx
import { jsx as jsx72 } from "react/jsx-runtime";
function Bee({ szerep, size = "m", buzz = true, label, className }) {
  return /* @__PURE__ */ jsx72(
    "span",
    {
      "data-szerep": szerep,
      className: cx("bc-bee", size !== "m" && `is-${size}`, buzz && "is-buzz", className),
      ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }
    }
  );
}

// react/src/meh/hangnem.gen.ts
var hangnem_gen_default = {
  "szerepek": {
    "hazigazda": {
      "kep": "bee-happy",
      "erzelem": "bar\xE1ts\xE1gos",
      "mikor": "bel\xE9p\xE9s, els\u0151 haszn\xE1lat, \xFCdv\xF6zl\u0151 k\xE1rtya"
    },
    "kalauz": {
      "kep": "moods/help",
      "erzelem": "seg\xEDt\u0151k\xE9sz",
      "mikor": "s\xFAg\xF3, \u201EHogyan olvasd?\u201D, bevezet\u0151 t\xFAra"
    },
    "futar": {
      "kep": "bee-super",
      "erzelem": "lend\xFCletes",
      "mikor": "1 mp-n\xE9l hosszabb t\xF6lt\xE9s, felt\xF6lt\xE9s, import, export"
    },
    "szurkolo": {
      "kep": "bee-cheer",
      "erzelem": "lelkes",
      "mikor": "sikeres ment\xE9s, els\u0151 kupon, els\u0151 partner"
    },
    "bajnok": {
      "kep": "moods/rank",
      "erzelem": "b\xFCszke",
      "mikor": "m\xE9rf\xF6ldk\u0151, sorsol\xE1s nyertese \u2013 ritk\xE1n"
    },
    "piheno": {
      "kep": "moods/rest",
      "erzelem": "nyugodt",
      "mikor": "\xFCres lista, nincs teend\u0151, lej\xE1rt munkamenet"
    },
    "gondolkodo": {
      "kep": "moods/think",
      "erzelem": "k\xEDv\xE1ncsi, nem szid",
      "mikor": "nincs tal\xE1lat, hib\xE1s adat, sikertelen m\u0171velet, nincs h\xE1l\xF3zat"
    },
    "hirvivo": {
      "kep": "bee-phone",
      "erzelem": "figyelmes",
      "mikor": "\xE9rtes\xEDt\xE9sek, \xFCzenet-el\u0151n\xE9zet, e-mail-k\xFCld\xE9s"
    },
    "halas": {
      "kep": "moods/love",
      "erzelem": "meleg",
      "mikor": "j\xF3v\xE1hagy\xE1s, visszajelz\xE9s, partner aktiv\xE1l\xE1sa"
    },
    "kacsinto": {
      "kep": "roles/kacsint",
      "erzelem": "j\xE1t\xE9kos",
      "mikor": "visszavon\xE1s, 404, apr\xF3 meglepet\xE9s"
    },
    "szomoru": {
      "kep": "bee-sad",
      "erzelem": "bocs\xE1natk\xE9r\u0151",
      "mikor": "CSAK a mi hib\xE1nk (szerverhiba, le\xE1ll\xE1s) \u2013 soha a felhaszn\xE1l\xF3\xE9"
    },
    "tevekeny": {
      "kep": "moods/action",
      "erzelem": "tettre k\xE9sz",
      "mikor": "val\xF3di teend\u0151 a vil\xE1gban (pl. \u201En\xE9zd meg az appban\u201D)"
    }
  },
  "pillanatok": {
    "udvozles": {
      "meh": "hazigazda",
      "valtozatok": [
        {
          "poen": "\xDCdv a kapt\xE1rban!",
          "sima": "J\xF3, hogy itt vagy."
        },
        {
          "poen": "Z\xFCmm-z\xFCmm, szia!",
          "sima": "Kezdhetj\xFCk?"
        }
      ]
    },
    "mentve": {
      "meh": "szurkolo",
      "valtozatok": [
        {
          "poen": "Bekapt\xE1roztuk!",
          "sima": "Mentve."
        },
        {
          "poen": "Z\xFCmm, megvan!",
          "sima": "Elmentett\xFCk."
        },
        {
          "poen": "M\xE9zbe m\xE1rtva.",
          "sima": "A m\xF3dos\xEDt\xE1s elmentve."
        }
      ]
    },
    "merfoldko": {
      "meh": "bajnok",
      "valtozatok": [
        {
          "poen": "Ez igazi m\xE9htett!",
          "sima": "El\xE9rt\xE9l egy m\xE9rf\xF6ldk\xF6vet."
        },
        {
          "poen": "N\xE9pes a raj!",
          "sima": "Sz\xE9p sz\xE1m \u2013 gratul\xE1lunk."
        }
      ]
    },
    "ures": {
      "meh": "piheno",
      "valtozatok": [
        {
          "poen": "Itt m\xE9g nem z\xFCmm\xF6g semmi.",
          "sima": "M\xE9g nincs elem ebben a list\xE1ban."
        },
        {
          "poen": "Csend a kapt\xE1rban.",
          "sima": "M\xE9g \xFCres ez a lista."
        }
      ]
    },
    "nincs-talalat": {
      "meh": "gondolkodo",
      "valtozatok": [
        {
          "poen": "Z\xFCmm\u2026 erre nincs tal\xE1lat.",
          "sima": "Pr\xF3b\xE1ld r\xF6videbben, vagy \xE9kezet n\xE9lk\xFCl."
        },
        {
          "poen": "Ezt a vir\xE1got nem tal\xE1ljuk.",
          "sima": "Nincs a keres\xE9snek megfelel\u0151 elem."
        }
      ]
    },
    "toltes": {
      "meh": "futar",
      "valtozatok": [
        {
          "poen": "Gy\u0171jtj\xFCk a nekt\xE1rt\u2026",
          "sima": "T\xF6ltj\xFCk az adatokat."
        },
        {
          "poen": "Szorgos m\xE9hek dolgoznak rajta\u2026",
          "sima": "Mindj\xE1rt k\xE9sz."
        }
      ]
    },
    "toltes-hosszu": {
      "meh": "futar",
      "valtozatok": [
        {
          "poen": "Nagy a kapt\xE1r\u2026",
          "sima": "M\xE9g dolgozunk rajta \u2013 ez tov\xE1bb tart a szok\xE1sosn\xE1l."
        }
      ]
    },
    "visszavonhato": {
      "meh": "kacsinto",
      "valtozatok": [
        {
          "poen": "Kirep\xFClt.",
          "sima": "T\xF6r\xF6lve \u2013 ha meggondoltad, visszavonhatod."
        }
      ]
    },
    "szerverhiba": {
      "meh": "szomoru",
      "valtozatok": [
        {
          "poen": "Hopp\xE1, elrep\xFClt a kapcsolat.",
          "sima": "Ez a mi hib\xE1nk. Pr\xF3b\xE1ld \xFAjra egy perc m\xFAlva."
        }
      ]
    },
    "munkamenet-lejart": {
      "meh": "piheno",
      "valtozatok": [
        {
          "poen": "Elszund\xEDtott\xE1l?",
          "sima": "L\xE9pj be \xFAjra \u2013 ott folytatod, ahol abbahagytad."
        }
      ]
    },
    "offline": {
      "meh": "gondolkodo",
      "valtozatok": [
        {
          "poen": "Nincs t\xE9rer\u0151 a kapt\xE1rban.",
          "sima": "Amint visszaj\xF6n a kapcsolat, mentj\xFCk."
        }
      ]
    },
    "nem-talalhato": {
      "meh": "kacsinto",
      "valtozatok": [
        {
          "poen": "Ez az oldal kirep\xFClt.",
          "sima": "Nincs ilyen oldal \u2013 ir\xE1ny a kezd\u0151lap."
        }
      ]
    },
    "nincs-jogosultsag": {
      "meh": "gondolkodo",
      "valtozatok": [
        {
          "poen": "Ez a kapt\xE1r z\xE1rva.",
          "sima": "Ehhez az oldalhoz nincs jogosults\xE1god \u2013 k\xE9rd egy adminisztr\xE1tort\xF3l."
        }
      ]
    },
    "koszonjuk": {
      "meh": "halas",
      "valtozatok": [
        {
          "poen": "K\xF6szi, szorgos m\xE9hecske!",
          "sima": "Megkaptuk."
        }
      ]
    },
    "uzenet-elkuldve": {
      "meh": "hirvivo",
      "valtozatok": [
        {
          "poen": "Sz\xE1rnyra kapott az \xFCzenet!",
          "sima": "Elk\xFCldt\xFCk."
        }
      ]
    }
  }
};

// react/src/meh/say.ts
function say(pillanat, valtozat) {
  const p = hangnem_gen_default.pillanatok[pillanat];
  const vs = p.valtozatok;
  const n = vs.length;
  const i = valtozat ?? Math.floor(Date.now() / 864e5) % n;
  const v = vs[(i % n + n) % n];
  return { poen: v.poen, sima: v.sima, meh: p.meh };
}
var szerepek = hangnem_gen_default.szerepek;
var pillanatok = Object.keys(hangnem_gen_default.pillanatok);

// react/src/meh/BeeMoment.tsx
import { jsx as jsx73, jsxs as jsxs66 } from "react/jsx-runtime";
function BeeMoment({ pillanat, poen, sima, szerep, action, inline, valtozat, live, className }) {
  const m = pillanat ? say(pillanat, valtozat) : null;
  const title = poen ?? m?.poen;
  const text = sima ?? m?.sima;
  const who = szerep ?? m?.meh ?? "piheno";
  return /* @__PURE__ */ jsxs66("div", { className: cx("bc-moment", inline && "is-inline", className), role: live, "data-pillanat": pillanat, children: [
    /* @__PURE__ */ jsx73(Bee, { szerep: who, size: inline ? "s" : "m" }),
    title && /* @__PURE__ */ jsx73("p", { className: "bc-moment-title", children: title }),
    text && /* @__PURE__ */ jsx73("p", { className: "bc-moment-text", children: text }),
    action && /* @__PURE__ */ jsx73("div", { className: "bc-moment-action", children: action })
  ] });
}

// react/src/meh/motion.tsx
import { Children, cloneElement, isValidElement as isValidElement2, useEffect as useEffect17, useRef as useRef27, useState as useState36 } from "react";
import { jsx as jsx74, jsxs as jsxs67 } from "react/jsx-runtime";
function useReducedMotion() {
  const [r, setR] = useState36(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect17(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setR(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}
function useCountUp(value, ms = 600) {
  const reduce = useReducedMotion();
  const first = useRef27(true);
  const [anim, setAnim] = useState36(reduce ? null : 0);
  useEffect17(() => {
    if (reduce || !first.current) {
      setAnim(null);
      return;
    }
    first.current = false;
    const t0 = performance.now();
    let raf = 0;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setAnim(k < 1 ? value * (1 - Math.pow(1 - k, 3)) : null);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      setAnim(null);
    };
  }, [value, ms, reduce]);
  return anim ?? value;
}
function Stagger({ children, as: Tag = "div", className }) {
  return /* @__PURE__ */ jsx74(Tag, { className: cx("bc-stagger", className), children: Children.map(children, (c, i) => isValidElement2(c) ? cloneElement(c, { style: { ...c.props.style ?? {}, ["--i"]: i } }) : c) });
}
function celebrate(from) {
  if (typeof document === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = from?.getBoundingClientRect() ?? { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const box = document.createElement("div");
  box.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("i");
    p.className = "bc-hexpiece";
    const a = i / 14 * Math.PI * 2, d = 60 + i % 3 * 30;
    p.style.left = `${r.left + r.width / 2}px`;
    p.style.top = `${r.top + r.height / 2}px`;
    p.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    p.style.setProperty("--dy", `${Math.sin(a) * d - 30}px`);
    p.style.setProperty("--rot", `${(i % 2 ? 1 : -1) * 120}deg`);
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 700);
}
function shake(el) {
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.classList.remove("bc-anim-shake");
  void el.offsetWidth;
  el.classList.add("bc-anim-shake");
  setTimeout(() => el.classList.remove("bc-anim-shake"), 300);
}
function HexLoader({ label = "T\xF6lt\xF6m" }) {
  return /* @__PURE__ */ jsxs67("span", { className: "bc-hexload", role: "status", "aria-label": label, children: [
    /* @__PURE__ */ jsx74("i", {}),
    /* @__PURE__ */ jsx74("i", {}),
    /* @__PURE__ */ jsx74("i", {})
  ] });
}
function ProgressBar({ value, label, moving }) {
  const v = Math.max(0, Math.min(1, value));
  return /* @__PURE__ */ jsx74(
    "div",
    {
      className: cx("bc-progress", moving && v < 1 && "is-moving", v >= 1 && "is-done"),
      role: "progressbar",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(v * 100),
      style: { ["--v"]: v },
      children: /* @__PURE__ */ jsx74("span", {})
    }
  );
}

// react/src/meh/BeeSprite.tsx
import { useEffect as useEffect18, useState as useState37 } from "react";
import { jsx as jsx75 } from "react/jsx-runtime";
function BeeSprite({ szereplo, size = "m", replay, label, className }) {
  const [k, setK] = useState37(0);
  useEffect18(() => {
    if (replay !== void 0) setK((x) => x + 1);
  }, [replay]);
  return /* @__PURE__ */ jsx75(
    "span",
    {
      "data-szereplo": szereplo,
      className: cx("bc-sprite", size !== "m" && `is-${size}`, className),
      ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }
    },
    k
  );
}

// react/src/kieg/PhoneField.tsx
import { forwardRef as forwardRef9, useEffect as useEffect19, useLayoutEffect as useLayoutEffect4, useRef as useRef28, useState as useState38 } from "react";

// react/src/kieg/phone.ts
var MOBIL = ["20", "30", "31", "50", "70"];
var VIDEK = "22 23 24 25 26 27 28 29 32 33 34 35 36 37 42 44 45 46 47 48 49 52 53 54 55 56 57 59 62 63 66 68 69 72 73 74 75 76 77 78 79 82 83 84 85 87 88 89 92 93 94 95 96 99 80 90 91".split(" ");
var MAX_DIGITS = 9;
function phoneInfo(digits) {
  const d = digits.slice(0, MAX_DIGITS);
  let kind = "ismeretlen", need = MAX_DIGITS, area;
  if (d.startsWith("1")) {
    kind = "vezetekes";
    need = 8;
    area = "1";
  } else if (d.length >= 2) {
    area = d.slice(0, 2);
    if (MOBIL.includes(area)) kind = "mobil";
    else if (area === "21") kind = "vezetekes";
    else if (VIDEK.includes(area)) {
      kind = "vezetekes";
      need = 8;
    }
  }
  const complete = d.length === need;
  return { digits: d, kind, need, area, complete, valid: complete && kind !== "ismeretlen" };
}
function formatNational(digits) {
  const i = phoneInfo(digits);
  const d = i.digits;
  const groups = d.startsWith("1") ? [1, 3, 4] : i.need === 8 ? [2, 3, 3] : [2, 3, 4];
  const out = [];
  let at2 = 0;
  for (const g of groups) {
    if (at2 >= d.length) break;
    out.push(d.slice(at2, at2 + g));
    at2 += g;
  }
  return out.join(" ");
}
function parsePhone(text) {
  const t = text.trim();
  const letters = /\p{L}/u.test(t);
  let d = t.replace(/\D/g, "");
  const plus = t.startsWith("+");
  if (plus || d.startsWith("00")) {
    const cc = plus ? d : d.slice(2);
    if (!cc.startsWith("36")) return { digits: "", foreign: cc.length > 0, letters, cropped: false };
    d = cc.slice(2);
  } else if (d.startsWith("06")) d = d.slice(2);
  else if (d.startsWith("36") && d.length >= 10) d = d.slice(2);
  const need = phoneInfo(d).need;
  return { digits: d.slice(0, need), foreign: false, letters, cropped: d.length > need };
}
function typedDigits(raw) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0036")) d = d.slice(4);
  else if (d.startsWith("06")) d = d.slice(2);
  return { digits: d, letters: /\p{L}/u.test(raw) };
}
var toE164 = (digits) => digits ? `+36${digits}` : "";
function formatHuPhone(value) {
  if (!value) return "";
  const p = parsePhone(value);
  return p.foreign || !p.digits ? value : `+36 ${formatNational(p.digits)}`;
}
function phoneProblem(i, want = "barmely") {
  if (!i.digits) return void 0;
  if (i.digits.length >= 2 && i.kind === "ismeretlen") return `Ismeretlen el\u0151h\xEDv\xF3: ${i.area}. Mobil: 20, 30, 31, 50, 70 \xB7 Budapest: 1 \xB7 vid\xE9k: pl. 52.`;
  if (want === "mobil" && i.kind === "vezetekes") return "Ide mobilsz\xE1m kell: 20, 30, 31, 50 vagy 70 kezdet\u0171.";
  if (want === "vezetekes" && i.kind === "mobil") return "Ide vezet\xE9kes sz\xE1m kell, pl. 1 234 5678 vagy 52 123 456.";
  if (!i.complete) {
    const left = i.need - i.digits.length;
    const pelda = i.need === 8 ? i.area === "1" ? "1 234 5678" : "52 123 456" : "30 123 4567";
    return `M\xE9g ${left} sz\xE1mjegy hi\xE1nyzik \u2013 \xEDgy n\xE9z ki: ${pelda}.`;
  }
  return void 0;
}

// react/src/kieg/PhoneField.tsx
import { jsx as jsx76, jsxs as jsxs68 } from "react/jsx-runtime";
var RANGE = { barmely: "mobil: 9 sz\xE1mjegy \xB7 vezet\xE9kes: 8", mobil: "mobil: 20, 30, 31, 50, 70 + 7 sz\xE1mjegy", vezetekes: "vezet\xE9kes: 8 sz\xE1mjegy (Budapest: 1 + 7)" };
var KIND = { mobil: "mobilsz\xE1m", vezetekes: "vezet\xE9kes sz\xE1m", ismeretlen: "" };
var caretAfter = (text, n) => {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) if (/\d/.test(text[i]) && ++seen === n) return i + 1;
  return text.length;
};
var PhoneField = forwardRef9(function PhoneField2({ label, help, range, error, notice, required, disabled, className, value, onChange, kind = "barmely", onBlur, onFocus, ...rest }, ref) {
  const inner = useRef28(null);
  const [text, setText] = useState38(() => formatNational(parsePhone(value).digits));
  const [note, setNote] = useState38();
  const [touched, setTouched] = useState38(false);
  const focused = useRef28(false);
  const caret = useRef28(null);
  useEffect19(() => {
    if (!focused.current) setText(formatNational(parsePhone(value).digits));
  }, [value]);
  useLayoutEffect4(() => {
    const el = inner.current;
    if (el && caret.current !== null && document.activeElement === el) el.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [text]);
  const digits = typedDigits(text).digits;
  const info = phoneInfo(digits);
  const apply = (d, digitsBeforeCaret, msg) => {
    const i0 = phoneInfo(d);
    let m = msg;
    if (d.length > i0.need) {
      d = d.slice(0, i0.need);
      m = m ?? `Legfeljebb ${i0.need} sz\xE1mjegy lehet \u2013 a t\xF6bbit nem \xEDrtam be.`;
    }
    const i = phoneInfo(d);
    const t = formatNational(d);
    caret.current = caretAfter(t, Math.min(digitsBeforeCaret, d.length));
    setText(t);
    setNote(m);
    onChange(toE164(i.digits), i);
  };
  const onKeyDown = (e) => {
    const el = e.currentTarget, s = el.selectionStart ?? 0;
    if (s !== el.selectionEnd) return;
    const back = e.key === "Backspace" && el.value[s - 1] === " ";
    const fwd = e.key === "Delete" && el.value[s] === " ";
    if (!back && !fwd) return;
    e.preventDefault();
    const raw = back ? el.value.slice(0, s - 2) + el.value.slice(s - 1) : el.value.slice(0, s + 1) + el.value.slice(s + 2);
    const before = (back ? el.value.slice(0, s - 2) : el.value.slice(0, s)).replace(/\D/g, "").length;
    apply(raw.replace(/\D/g, ""), before);
  };
  const onPaste = (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    const clip2 = e.clipboardData.getData("text");
    const p = parsePhone(clip2);
    if (p.foreign) {
      setNote("Csak magyar (+36) sz\xE1m adhat\xF3 meg \u2013 a beilleszt\xE9st kihagytam.");
      return;
    }
    const s = el.selectionStart ?? el.value.length, en = el.selectionEnd ?? s;
    const whole = /^\s*(\+|00|06)/.test(clip2) || p.digits.length >= 8;
    const head = whole ? "" : el.value.slice(0, s).replace(/\D/g, "");
    const tail = whole ? "" : el.value.slice(en).replace(/\D/g, "");
    const d = head + p.digits + tail;
    const msg = p.cropped || d.length > phoneInfo(d).need ? `A beillesztett sz\xE1m v\xE9g\xE9t lev\xE1gtam: legfeljebb ${phoneInfo(d).need} sz\xE1mjegy lehet.` : p.letters ? "A beillesztett sz\xF6vegb\u0151l csak a sz\xE1mjegyeket tartottam meg." : void 0;
    apply(d, head.length + p.digits.length, msg);
  };
  const problem = touched ? required && !digits ? "Add meg a telefonsz\xE1mot \u2013 pl. 30 123 4567." : phoneProblem(info, kind) : void 0;
  const kindText = info.kind !== "ismeretlen" ? `${KIND[info.kind]} \xB7 ${info.need} sz\xE1mjegy` : RANGE[kind];
  return (
    // Az állapot (7/9) a tartomány-sorban: a teljes szám jó dolog, ezért nem kapja a számláló „határon” hibaszínét
    /* @__PURE__ */ jsx76(
      Field,
      {
        label,
        help,
        range: `${range ?? kindText} \xB7 ${digits.length}/${info.need}${info.valid ? " \u2713" : ""}`,
        error: error ?? problem,
        notice: notice ?? note,
        required,
        disabled,
        className,
        children: /* @__PURE__ */ jsx76(FieldInput, { children: (f) => /* @__PURE__ */ jsxs68("div", { className: "bc-phone", children: [
          /* @__PURE__ */ jsx76("span", { className: "bc-phone-cc", "aria-hidden": "true", children: "+36" }),
          /* @__PURE__ */ jsx76(
            "input",
            {
              ref: mergeRefs(ref, inner),
              id: f.id,
              "aria-describedby": f.describedBy,
              "aria-invalid": f.invalid || void 0,
              className: "bc-input",
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel-national",
              placeholder: "30 123 4567",
              required,
              disabled,
              value: text,
              "aria-label": `${label} (+36 ut\xE1n)`,
              onFocus: (e) => {
                focused.current = true;
                onFocus?.(e);
              },
              onBlur: (e) => {
                focused.current = false;
                setTouched(true);
                onBlur?.(e);
              },
              onKeyDown,
              onPaste,
              onChange: (e) => {
                const raw = e.target.value, at2 = e.target.selectionStart ?? raw.length;
                const t = typedDigits(raw);
                apply(t.digits, typedDigits(raw.slice(0, at2)).digits.length, t.letters ? "Csak sz\xE1mjegyet \xEDrhatsz be \u2013 a bet\u0171t kihagytam." : void 0);
              },
              ...rest
            }
          )
        ] }) })
      }
    )
  );
});

// react/src/kieg/CopyButton.tsx
import { useEffect as useEffect20, useRef as useRef29, useState as useState39 } from "react";

// react/src/kieg/icons.tsx
import { jsx as jsx77, jsxs as jsxs69 } from "react/jsx-runtime";
var P = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var CopyIcon = () => /* @__PURE__ */ jsxs69("svg", { ...P, children: [
  /* @__PURE__ */ jsx77("rect", { x: "9", y: "9", width: "11", height: "11", rx: "2" }),
  /* @__PURE__ */ jsx77("path", { d: "M5 15V6a2 2 0 0 1 2-2h8" })
] });
var CheckIcon = () => /* @__PURE__ */ jsx77("svg", { ...P, strokeWidth: 3, children: /* @__PURE__ */ jsx77("path", { d: "M5 12.5l4.5 4.5L19 7.5" }) });
var DownloadIcon = () => /* @__PURE__ */ jsx77("svg", { ...P, children: /* @__PURE__ */ jsx77("path", { d: "M12 4v11M7 10.5l5 5 5-5M5 20h14" }) });
var RetryIcon = () => /* @__PURE__ */ jsx77("svg", { ...P, children: /* @__PURE__ */ jsx77("path", { d: "M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" }) });
var CloseIcon2 = () => /* @__PURE__ */ jsx77("svg", { ...P, children: /* @__PURE__ */ jsx77("path", { d: "M6 6l12 12M18 6L6 18" }) });
var PlusIcon = () => /* @__PURE__ */ jsx77("svg", { ...P, children: /* @__PURE__ */ jsx77("path", { d: "M12 5v14M5 12h14" }) });
var ChevronIcon = ({ open }) => /* @__PURE__ */ jsx77("svg", { ...P, style: { transform: open ? "rotate(180deg)" : void 0 }, children: /* @__PURE__ */ jsx77("path", { d: "M6 9l6 6 6-6" }) });
var UndoIcon = () => /* @__PURE__ */ jsx77("svg", { ...P, children: /* @__PURE__ */ jsx77("path", { d: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" }) });

// react/src/kieg/CopyButton.tsx
import { jsx as jsx78, jsxs as jsxs70 } from "react/jsx-runtime";
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
function CopyButton({ value, what, variant = "button", showValue: showValue2, disabled, className }) {
  const [state, setState] = useState39("idle");
  const [msg, setMsg] = useState39("");
  const fallback = useRef29(null);
  const timer = useRef29(void 0);
  useEffect20(() => () => window.clearTimeout(timer.current), []);
  useEffect20(() => {
    if (state === "failed") fallback.current?.select();
  }, [state]);
  const run = async () => {
    window.clearTimeout(timer.current);
    if (await copyText(value)) {
      setState("done");
      setMsg(`Kim\xE1soltam: ${what}.`);
      timer.current = window.setTimeout(() => setState("idle"), 1500);
    } else {
      setState("failed");
      setMsg(`Nem siker\xFClt a m\xE1sol\xE1s (${what}) \u2013 jel\xF6ld ki, \xE9s m\xE1sold k\xE9zzel.`);
    }
  };
  const done = state === "done";
  const icon = done ? /* @__PURE__ */ jsx78("span", { className: "bc-anim-tick bc-copy-tick", children: /* @__PURE__ */ jsx78(CheckIcon, {}) }) : /* @__PURE__ */ jsx78(CopyIcon, {});
  return /* @__PURE__ */ jsxs70("span", { className: cx("bc-copy", className), "data-state": state, children: [
    showValue2 && /* @__PURE__ */ jsx78("code", { className: "bc-copy-value", children: value }),
    variant === "icon" ? /* @__PURE__ */ jsx78(IconButton, { "aria-label": done ? `M\xE1solva: ${what}` : `M\xE1sol\xE1s: ${what}`, onClick: run, disabled, children: icon }) : /* @__PURE__ */ jsx78(Button, { variant: "secondary", size: "sm", icon, onClick: run, disabled, "aria-label": `${done ? "M\xE1solva" : "M\xE1sol\xE1s"}: ${what}`, children: done ? "M\xE1solva" : "M\xE1sol\xE1s" }),
    /* @__PURE__ */ jsx78("span", { className: "bc-sr", role: "status", children: msg }),
    state === "failed" && /* @__PURE__ */ jsxs70("span", { className: "bc-copy-fallback", children: [
      /* @__PURE__ */ jsx78("input", { ref: fallback, className: "bc-input", readOnly: true, value, "aria-label": `${what} \u2013 jel\xF6ld ki \xE9s m\xE1sold`, onFocus: (e) => e.currentTarget.select() }),
      /* @__PURE__ */ jsx78("span", { className: "bc-error", children: "Nem siker\xFClt a m\xE1sol\xE1s. Jel\xF6ld ki, \xE9s m\xE1sold: Ctrl+C (Macen \u2318C), telefonon hosszan nyomva." })
    ] })
  ] });
}

// react/src/kieg/DownloadButton.tsx
import { useEffect as useEffect21, useRef as useRef30, useState as useState40 } from "react";
import { Fragment as Fragment19, jsx as jsx79, jsxs as jsxs71 } from "react/jsx-runtime";
function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${formatHu(n / 1024, 1)} KB`;
  return `${formatHu(n / 1024 / 1024, 1)} MB`;
}
function save(blob, name2) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name2;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function DownloadButton({ label, fileName, sizeHint, onDownload, variant = "secondary", disabled, className }) {
  const [state, setState] = useState40("idle");
  const [progress, setProgress] = useState40(null);
  const [size, setSize] = useState40(null);
  const [slow, setSlow] = useState40(false);
  const [stopped, setStopped] = useState40(false);
  const ctrl = useRef30(null);
  useEffect21(() => () => ctrl.current?.abort(), []);
  useEffect21(() => {
    if (state !== "busy") return;
    const t = window.setTimeout(() => setSlow(true), 1e4);
    return () => window.clearTimeout(t);
  }, [state]);
  const run = async () => {
    if (state === "busy") return;
    const c = new AbortController();
    ctrl.current = c;
    setState("busy");
    setProgress(null);
    setSlow(false);
    setStopped(false);
    try {
      const blob = await onDownload({ progress: (v) => !c.signal.aborted && setProgress(Math.max(0, Math.min(1, v))), signal: c.signal });
      if (c.signal.aborted) return;
      if (blob) {
        save(blob, fileName);
        setSize(blob.size);
      } else setSize(null);
      setState("done");
    } catch {
      if (!c.signal.aborted) setState("error");
    }
  };
  const cancel = () => {
    ctrl.current?.abort();
    setState("idle");
    setStopped(true);
  };
  const pct = progress === null ? null : Math.round(progress * 100);
  const text = state === "busy" ? "K\xE9sz\xFCl" : state === "done" ? "Let\xF6ltve" : state === "error" ? "\xDAjra" : label;
  const icon = state === "done" ? /* @__PURE__ */ jsx79("span", { className: "bc-anim-tick bc-copy-tick", children: /* @__PURE__ */ jsx79(CheckIcon, {}) }) : state === "error" ? /* @__PURE__ */ jsx79(RetryIcon, {}) : /* @__PURE__ */ jsx79(DownloadIcon, {});
  return /* @__PURE__ */ jsxs71("div", { className: cx("bc-download", className), "data-state": state, children: [
    /* @__PURE__ */ jsxs71("div", { className: "bc-row", children: [
      /* @__PURE__ */ jsx79(
        Button,
        {
          variant,
          icon,
          busy: state === "busy",
          disabled,
          onClick: run,
          "aria-label": `${text}: ${fileName}`,
          children: text
        }
      ),
      state === "busy" && /* @__PURE__ */ jsx79(Button, { variant: "ghost", size: "sm", onClick: cancel, children: "Megszak\xEDt\xE1s" })
    ] }),
    /* @__PURE__ */ jsxs71("div", { className: "bc-download-meta", role: "status", children: [
      state === "idle" && /* @__PURE__ */ jsxs71("span", { children: [
        fileName,
        sizeHint ? ` \xB7 ${sizeHint}` : "",
        stopped ? " \xB7 megszak\xEDtottad, b\xE1rmikor \xFAjrakezdheted" : ""
      ] }),
      state === "busy" && /* @__PURE__ */ jsxs71(Fragment19, { children: [
        pct === null ? /* @__PURE__ */ jsx79(HexLoader, { label: `K\xE9sz\xFCl: ${fileName}` }) : /* @__PURE__ */ jsx79(ProgressBar, { value: progress ?? 0, label: `K\xE9sz\xFCl: ${fileName}`, moving: true }),
        /* @__PURE__ */ jsxs71("span", { children: [
          "K\xE9sz\xFCl: ",
          fileName,
          pct === null ? "\u2026" : ` \xB7 ${pct}%`
        ] }),
        slow && /* @__PURE__ */ jsx79("span", { className: "bc-download-slow", children: say("toltes-hosszu").sima })
      ] }),
      state === "done" && /* @__PURE__ */ jsxs71("span", { children: [
        "Let\xF6ltve: ",
        fileName,
        size !== null ? ` \xB7 ${formatBytes(size)}` : ""
      ] }),
      state === "error" && /* @__PURE__ */ jsxs71("span", { className: "bc-error", role: "alert", children: [
        "Nem siker\xFClt elk\xE9sz\xEDteni a f\xE1jlt (",
        fileName,
        "). Ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra."
      ] })
    ] })
  ] });
}

// react/src/kieg/Slider.tsx
import { useRef as useRef31 } from "react";

// react/src/kieg/sliderCore.ts
var decimalsOf = (n) => (String(n).split(".")[1] ?? "").length;
function snap(v, s) {
  const k = Math.round((v - s.min) / s.step);
  const x = s.min + k * s.step;
  const d = Math.max(decimalsOf(s.step), decimalsOf(s.min));
  return Math.min(s.max, Math.max(s.min, Number(x.toFixed(d))));
}
function keyValue(key, v, s) {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return snap(v + s.step, s);
    case "ArrowLeft":
    case "ArrowDown":
      return snap(v - s.step, s);
    case "PageUp":
      return snap(v + s.bigStep, s);
    case "PageDown":
      return snap(v - s.bigStep, s);
    case "Home":
      return s.min;
    case "End":
      return s.max;
    default:
      return null;
  }
}
function valueAt(clientX, rect, s) {
  const k = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  return snap(s.min + Math.min(1, Math.max(0, k)) * (s.max - s.min), s);
}
var pctOf = (v, s) => s.max > s.min ? (v - s.min) / (s.max - s.min) * 100 : 0;
var defaultBig = (min, max, step) => Math.max(step, Math.round((max - min) / 10 / step) * step);

// react/src/kieg/Slider.tsx
import { jsx as jsx80, jsxs as jsxs72 } from "react/jsx-runtime";
var fmt2 = (unit, step) => (v) => `${formatHu(v, (String(step).split(".")[1] ?? "").length)}${unit ? ` ${unit}` : ""}`;
function Track({ values, onChange, spec, labels, format, disabled, minGap, describedBy, invalid }) {
  const track = useRef31(null);
  const drag = useRef31(null);
  const set = (i, raw) => {
    let x = snap(raw, spec);
    if (values.length === 2) x = i === 0 ? Math.min(x, values[1] - minGap) : Math.max(x, values[0] + minGap);
    if (x === values[i]) return;
    const next = [...values];
    next[i] = x;
    onChange(next);
  };
  const thumbs = () => track.current?.querySelectorAll("[role=slider]");
  const onDown = (e) => {
    if (disabled || e.button !== 0) return;
    const v = valueAt(e.clientX, e.currentTarget.getBoundingClientRect(), spec);
    const i = values.length === 1 ? 0 : Math.abs(v - values[0]) < Math.abs(v - values[1]) || v < values[0] ? 0 : 1;
    set(i, v);
    drag.current = i;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
    thumbs()?.[i]?.focus();
  };
  const onMove = (e) => {
    if (drag.current !== null) set(drag.current, valueAt(e.clientX, e.currentTarget.getBoundingClientRect(), spec));
  };
  const onKey = (i) => (e) => {
    const v = keyValue(e.key, values[i], spec);
    if (v === null || disabled) return;
    e.preventDefault();
    set(i, v);
  };
  const lo = values.length === 2 ? pctOf(values[0], spec) : 0;
  const hi = pctOf(values[values.length - 1], spec);
  return /* @__PURE__ */ jsxs72(
    "div",
    {
      ref: track,
      className: "bc-slider-track",
      "data-disabled": disabled || void 0,
      onPointerDown: onDown,
      onPointerMove: onMove,
      onPointerUp: () => {
        drag.current = null;
      },
      onPointerCancel: () => {
        drag.current = null;
      },
      children: [
        /* @__PURE__ */ jsx80("span", { className: "bc-slider-rail", "aria-hidden": "true", children: /* @__PURE__ */ jsx80("span", { className: "bc-slider-fill", style: { left: `${lo}%`, width: `${hi - lo}%` } }) }),
        values.map((v, i) => /* @__PURE__ */ jsx80(
          "span",
          {
            role: "slider",
            tabIndex: disabled ? -1 : 0,
            className: "bc-slider-thumb",
            style: { left: `${pctOf(v, spec)}%` },
            "aria-label": labels[i],
            "aria-valuemin": i === 1 ? values[0] + minGap : spec.min,
            "aria-valuemax": i === 0 && values.length === 2 ? values[1] - minGap : spec.max,
            "aria-valuenow": v,
            "aria-valuetext": format(v),
            "aria-disabled": disabled || void 0,
            "aria-describedby": describedBy,
            "aria-invalid": invalid || void 0,
            "aria-orientation": "horizontal",
            onKeyDown: onKey(i)
          },
          i
        ))
      ]
    }
  );
}
function Frame2(p) {
  const step = p.step ?? 1;
  const spec = { min: p.min, max: p.max, step, bigStep: p.bigStep ?? defaultBig(p.min, p.max, step) };
  const format = p.format ?? fmt2(p.unit, step);
  const shown = p.values.map(format).join(" \u2013 ");
  return /* @__PURE__ */ jsx80(
    Field,
    {
      label: p.label,
      help: p.help,
      range: p.range ?? `${format(p.min)} \u2013 ${format(p.max)} \xB7 l\xE9p\xE9s: ${format(step)}`,
      error: p.error,
      notice: p.notice,
      required: p.required,
      disabled: p.disabled,
      className: p.className,
      labelFor: false,
      children: /* @__PURE__ */ jsx80(FieldInput, { children: (f) => /* @__PURE__ */ jsxs72("div", { className: "bc-slider", children: [
        /* @__PURE__ */ jsx80("output", { className: "bc-slider-out", "aria-hidden": "true", children: shown }),
        /* @__PURE__ */ jsx80(
          Track,
          {
            values: p.values,
            onChange: p.onValues,
            spec,
            labels: p.thumbLabels(p.label),
            format,
            disabled: p.disabled,
            minGap: p.minGap ?? 0,
            describedBy: f.describedBy,
            invalid: f.invalid
          }
        ),
        p.name && /* @__PURE__ */ jsx80("input", { type: "hidden", name: p.name, value: p.values.join("\u2013"), "aria-labelledby": `${f.id}-label` })
      ] }) })
    }
  );
}
function Slider({ value, onChange, ...rest }) {
  return /* @__PURE__ */ jsx80(Frame2, { ...rest, values: [value], onValues: (v) => onChange(v[0]), thumbLabels: (l) => [l] });
}
function RangeSlider({ value, onChange, minGap, ...rest }) {
  return /* @__PURE__ */ jsx80(Frame2, { ...rest, values: value, minGap, onValues: (v) => onChange([v[0], v[1]]), thumbLabels: (l) => [`${l}: als\xF3 hat\xE1r`, `${l}: fels\u0151 hat\xE1r`] });
}

// react/src/kieg/UnsavedChanges.tsx
import { useCallback as useCallback4, useEffect as useEffect23, useRef as useRef33, useState as useState41 } from "react";

// react/src/kieg/KiegDialog.tsx
import { useEffect as useEffect22, useId as useId14, useRef as useRef32 } from "react";
import { Fragment as Fragment20, jsx as jsx81, jsxs as jsxs73 } from "react/jsx-runtime";
function KiegDialog({ open, onCancel, title, children, actions, className }) {
  const ref = useRef32(null);
  const back = useRef32(null);
  const id = useId14();
  useEffect22(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      back.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
      d.querySelector("[data-autofocus]")?.focus();
    } else if (!open && d.open) {
      d.close();
      back.current?.focus();
    }
  }, [open]);
  useEffect22(() => () => {
    if (ref.current?.open) back.current?.focus();
  }, []);
  return /* @__PURE__ */ jsx81(
    "dialog",
    {
      ref,
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": `${id}-t`,
      "aria-describedby": children ? `${id}-d` : void 0,
      className: cx("bc-modal bc-kdialog", className),
      onCancel: (e) => {
        e.preventDefault();
        onCancel();
      },
      children: open && /* @__PURE__ */ jsxs73(Fragment20, { children: [
        /* @__PURE__ */ jsx81("div", { className: "bc-modal-head", children: /* @__PURE__ */ jsx81("h2", { id: `${id}-t`, children: title }) }),
        children && /* @__PURE__ */ jsx81("div", { className: "bc-modal-body", id: `${id}-d`, children }),
        /* @__PURE__ */ jsx81("div", { className: "bc-modal-foot", children: actions })
      ] })
    }
  );
}

// react/src/kieg/UnsavedChanges.tsx
import { Fragment as Fragment21, jsx as jsx82, jsxs as jsxs74 } from "react/jsx-runtime";
function UnsavedChangesDialog({ open, onStay, onLeave, onSave, title = "Nem mentett v\xE1ltoz\xE1said vannak", children }) {
  const [busy, setBusy] = useState41(false);
  const [err, setErr] = useState41();
  useEffect23(() => {
    if (!open) {
      setBusy(false);
      setErr(void 0);
    }
  }, [open]);
  const save2 = async () => {
    if (!onSave || busy) return;
    setErr(void 0);
    try {
      const r = onSave();
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      onLeave();
    } catch (e) {
      setBusy(false);
      setErr(`Nem siker\xFClt menteni${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra, vagy maradj az oldalon.`);
    }
  };
  return /* @__PURE__ */ jsxs74(
    KiegDialog,
    {
      open,
      onCancel: () => {
        if (!busy) onStay();
      },
      title,
      actions: /* @__PURE__ */ jsxs74(Fragment21, { children: [
        /* @__PURE__ */ jsx82(Button, { variant: "secondary", "data-autofocus": true, disabled: busy, onClick: onStay, children: "Maradok" }),
        /* @__PURE__ */ jsx82(Button, { variant: onSave ? "secondary" : "danger", disabled: busy, onClick: onLeave, children: "Elvet\xE9s \xE9s tov\xE1bbl\xE9p\xE9s" }),
        onSave && /* @__PURE__ */ jsx82(Button, { busy, onClick: () => void save2(), children: "Ment\xE9s \xE9s tov\xE1bbl\xE9p\xE9s" })
      ] }),
      children: [
        children ?? /* @__PURE__ */ jsx82("p", { children: "Ha most tov\xE1bbl\xE9psz, a m\xF3dos\xEDt\xE1said elvesznek. Maradj, ha m\xE9g menteni szeretn\xE9d \u0151ket." }),
        err && /* @__PURE__ */ jsx82("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx82("p", { children: err }) })
      ]
    }
  );
}
function useUnsavedChanges(dirty, opts = {}) {
  const [pending, setPending] = useState41(null);
  const live = useRef33(dirty);
  const released = useRef33(false);
  useEffect23(() => {
    live.current = dirty;
    released.current = false;
  }, [dirty]);
  useEffect23(() => {
    if (!dirty) return;
    const h = (e) => {
      if (released.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  const confirm = useCallback4((proceed) => {
    if (!live.current || released.current) {
      proceed();
      return;
    }
    setPending(() => proceed);
  }, []);
  const leave = () => {
    const p = pending;
    released.current = true;
    setPending(null);
    p?.();
  };
  const dialog = /* @__PURE__ */ jsx82(UnsavedChangesDialog, { open: pending !== null, onStay: () => setPending(null), onLeave: leave, onSave: opts.onSave, title: opts.title, children: opts.text });
  return { confirm, dialog, asking: pending !== null };
}
function UnsavedChangesGuard({ dirty, interceptLinks = true, ...opts }) {
  const { confirm, dialog } = useUnsavedChanges(dirty, opts);
  const bypass = useRef33(false);
  useEffect23(() => {
    if (!dirty || !interceptLinks) return;
    const h = (e) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.closest("dialog, [data-unsaved-ignore]")) return;
      const href = a.getAttribute("href") ?? "";
      if (a.target && a.target !== "_self" || a.hasAttribute("download") || href.startsWith("#") || href.startsWith("javascript:")) return;
      e.preventDefault();
      e.stopPropagation();
      confirm(() => {
        bypass.current = true;
        a.click();
        bypass.current = false;
      });
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [dirty, interceptLinks, confirm]);
  return dialog;
}

// react/src/kieg/OfflineBanner.tsx
import { useEffect as useEffect24, useRef as useRef34, useState as useState42 } from "react";
import { Fragment as Fragment22, jsx as jsx83, jsxs as jsxs75 } from "react/jsx-runtime";
function useOnline() {
  const [on, setOn] = useState42(() => typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect24(() => {
    const up = () => setOn(true), down = () => setOn(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    setOn(navigator.onLine);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return on;
}
function OfflineBanner({ online, pending = 0, saveText, onRetry, bee = true, backMs = 2500, className }) {
  const browser = useOnline();
  const on = online ?? browser;
  const [back, setBack] = useState42(false);
  const was = useRef34(on);
  useEffect24(() => {
    if (on && !was.current) {
      setBack(true);
      const t = window.setTimeout(() => setBack(false), backMs);
      was.current = on;
      return () => window.clearTimeout(t);
    }
    if (!on) setBack(false);
    was.current = on;
  }, [on, backMs]);
  const sima = saveText ?? say("offline").sima;
  const waiting = pending > 0 ? `${pending} m\xF3dos\xEDt\xE1s v\xE1r ment\xE9sre.` : null;
  return /* @__PURE__ */ jsxs75("div", { className: cx("bc-offline", className), role: "status", "data-state": on ? back ? "back" : "online" : "offline", children: [
    !on && /* @__PURE__ */ jsxs75("div", { className: "bc-alert is-warning bc-offline-bar", children: [
      bee ? /* @__PURE__ */ jsx83(BeeMoment, { pillanat: "offline", inline: true, sima: /* @__PURE__ */ jsxs75(Fragment22, { children: [
        sima,
        " ",
        waiting
      ] }) }) : /* @__PURE__ */ jsxs75("p", { children: [
        /* @__PURE__ */ jsx83("strong", { children: "Nincs internetkapcsolat." }),
        " ",
        sima,
        " ",
        waiting
      ] }),
      onRetry && /* @__PURE__ */ jsx83(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
    ] }),
    on && back && /* @__PURE__ */ jsx83("div", { className: "bc-alert is-success bc-offline-bar bc-anim-rise", children: /* @__PURE__ */ jsxs75("p", { children: [
      /* @__PURE__ */ jsx83("strong", { children: "\xDAjra van kapcsolat." }),
      " ",
      pending > 0 ? "Mentj\xFCk a v\xE1rakoz\xF3 m\xF3dos\xEDt\xE1sokat." : "Minden a hely\xE9n."
    ] }) })
  ] });
}

// react/src/kieg/StatusPages.tsx
import { useId as useId15 } from "react";
import { jsx as jsx84, jsxs as jsxs76 } from "react/jsx-runtime";
var HEAD = {
  "szerverhiba": "Hiba t\xF6rt\xE9nt n\xE1lunk",
  "nem-talalhato": "404 \xB7 Nincs ilyen oldal",
  "nincs-jogosultsag": "403 \xB7 Nincs jogosults\xE1god",
  "munkamenet-lejart": "Lej\xE1rt a munkamenet",
  "offline": "Nincs internetkapcsolat"
};
function StatusPage({ kind, action, secondary, sima, extra, className }) {
  const id = useId15();
  return /* @__PURE__ */ jsxs76("section", { className: cx("bc-status-page", className), "aria-labelledby": id, "data-kind": kind, children: [
    /* @__PURE__ */ jsx84("h1", { id, className: "bc-status-h", children: HEAD[kind] }),
    /* @__PURE__ */ jsx84(
      BeeMoment,
      {
        pillanat: kind,
        valtozat: 0,
        sima,
        live: kind === "szerverhiba" ? "alert" : void 0,
        action: (action || secondary) && /* @__PURE__ */ jsxs76("div", { className: "bc-row bc-status-actions", children: [
          action,
          secondary
        ] })
      }
    ),
    extra && /* @__PURE__ */ jsx84("div", { className: "bc-status-extra", children: extra })
  ] });
}
var Home = ({ href, label = "Vissza a kezd\u0151lapra", primary }) => /* @__PURE__ */ jsx84("a", { className: cx("bc-btn", !primary && "is-secondary"), href, children: label });
function ErrorPage({ onRetry, retrying, homeHref = "/", errorId, action, className }) {
  return /* @__PURE__ */ jsx84(
    StatusPage,
    {
      kind: "szerverhiba",
      className,
      action: action ?? (onRetry ? /* @__PURE__ */ jsx84(Button, { busy: retrying, onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" }) : /* @__PURE__ */ jsx84(Home, { href: homeHref, primary: true })),
      secondary: onRetry && !action ? /* @__PURE__ */ jsx84(Home, { href: homeHref }) : void 0,
      extra: errorId && /* @__PURE__ */ jsxs76("p", { className: "bc-status-code", children: [
        "Hibak\xF3d: ",
        /* @__PURE__ */ jsx84(CopyButton, { value: errorId, what: "hibak\xF3d", showValue: true }),
        " \u2013 add meg, ha \xEDrsz nek\xFCnk."
      ] })
    }
  );
}
function NotFoundPage({ homeHref = "/", action, className }) {
  return /* @__PURE__ */ jsx84(
    StatusPage,
    {
      kind: "nem-talalhato",
      className,
      action: action ?? /* @__PURE__ */ jsx84(Home, { href: homeHref, primary: true, label: "Ir\xE1ny a kezd\u0151lap" }),
      secondary: /* @__PURE__ */ jsx84(Button, { variant: "secondary", onClick: () => history.back(), children: "Vissza az el\u0151z\u0151 oldalra" })
    }
  );
}
function ForbiddenPage({ homeHref = "/", onRequestAccess, requested, action, className }) {
  return /* @__PURE__ */ jsx84(
    StatusPage,
    {
      kind: "nincs-jogosultsag",
      className,
      action: action ?? /* @__PURE__ */ jsx84(Home, { href: homeHref, primary: !onRequestAccess }),
      secondary: onRequestAccess && /* @__PURE__ */ jsx84(Button, { disabled: requested, onClick: onRequestAccess, children: requested ? "K\xE9r\xE9s elk\xFCldve" : "Hozz\xE1f\xE9r\xE9s k\xE9r\xE9se" })
    }
  );
}
function SessionExpired({ onLogin, loginHref = "/login", action, className }) {
  return /* @__PURE__ */ jsx84(
    StatusPage,
    {
      kind: "munkamenet-lejart",
      className,
      action: action ?? (onLogin ? /* @__PURE__ */ jsx84(Button, { onClick: onLogin, children: "Bel\xE9p\xE9s \xFAjra" }) : /* @__PURE__ */ jsx84("a", { className: "bc-btn", href: loginHref, children: "Bel\xE9p\xE9s \xFAjra" }))
    }
  );
}
function OfflinePage({ onRetry, retrying, className }) {
  return /* @__PURE__ */ jsx84(StatusPage, { kind: "offline", className, action: onRetry && /* @__PURE__ */ jsx84(Button, { busy: retrying, onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" }) });
}

// react/src/kieg/Timeline.tsx
import { useId as useId16, useMemo as useMemo4, useState as useState43 } from "react";

// react/src/kieg/activity.ts
var pad2 = (n) => String(n).padStart(2, "0");
var toDate = (d) => d instanceof Date ? d : new Date(d);
var dayKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
var dayFmt = new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
var timeFmt = new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" });
function dayLabel(d, now = /* @__PURE__ */ new Date()) {
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (dayKey(d) === dayKey(now)) return "Ma";
  if (dayKey(d) === dayKey(y)) return "Tegnap";
  return dayFmt.format(d);
}
var timeLabel = (d) => {
  const x = toDate(d);
  return Number.isNaN(x.getTime()) ? "\u2013" : timeFmt.format(x);
};
var isoOf = (d) => {
  const x = toDate(d);
  return Number.isNaN(x.getTime()) ? void 0 : x.toISOString();
};
function groupByDay(items, now = /* @__PURE__ */ new Date()) {
  const sorted = items.map((it, i) => ({ it, i, t: toDate(it.at).getTime() || -Infinity })).sort((a, b) => b.t - a.t || a.i - b.i);
  const groups = [];
  for (const { it } of sorted) {
    const d = toDate(it.at);
    const key = Number.isNaN(d.getTime()) ? "ismeretlen" : dayKey(d);
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) {
      g = { key, label: key === "ismeretlen" ? "Ismeretlen id\u0151pont" : dayLabel(d, now), items: [] };
      groups.push(g);
    }
    g.items.push(it);
  }
  return groups;
}

// react/src/kieg/Timeline.tsx
import { Fragment as Fragment23, jsx as jsx85, jsxs as jsxs77 } from "react/jsx-runtime";
var Empty = () => /* @__PURE__ */ jsx85("span", { className: "bc-tl-empty", children: "(\xFCres)" });
var isEmpty = (v) => v === null || v === void 0 || v === "";
function Changes({ changes }) {
  const [open, setOpen] = useState43(false);
  const id = useId16();
  return /* @__PURE__ */ jsxs77("div", { className: "bc-tl-changes", children: [
    /* @__PURE__ */ jsxs77("button", { type: "button", className: "bc-tl-toggle", "aria-expanded": open, "aria-controls": id, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ jsx85(ChevronIcon, { open }),
      changes.length,
      " mez\u0151 v\xE1ltozott"
    ] }),
    open && /* @__PURE__ */ jsx85("dl", { id, className: "bc-tl-diff bc-anim-rise", children: changes.map((c, i) => /* @__PURE__ */ jsxs77("div", { className: "bc-tl-diff-row", children: [
      /* @__PURE__ */ jsx85("dt", { children: c.field }),
      /* @__PURE__ */ jsxs77("dd", { children: [
        /* @__PURE__ */ jsxs77("del", { children: [
          /* @__PURE__ */ jsx85("span", { className: "bc-sr", children: "el\u0151tte: " }),
          isEmpty(c.before) ? /* @__PURE__ */ jsx85(Empty, {}) : c.before
        ] }),
        /* @__PURE__ */ jsx85("span", { "aria-hidden": "true", className: "bc-tl-arrow", children: "\u2192" }),
        /* @__PURE__ */ jsxs77("ins", { children: [
          /* @__PURE__ */ jsx85("span", { className: "bc-sr", children: ", ut\xE1na: " }),
          isEmpty(c.after) ? /* @__PURE__ */ jsx85(Empty, {}) : c.after
        ] })
      ] })
    ] }, i)) })
  ] });
}
function Timeline({ items, status = "ready", onRetry, pageSize = 10, onLoadMore, hasMore, loadingMore, now, empty, label = "El\u0151zm\xE9nyek", className }) {
  const [shown, setShown] = useState43(pageSize);
  const visible = onLoadMore ? items : items.slice(0, shown);
  const groups = useMemo4(() => groupByDay(visible, now), [visible, now]);
  const rest = onLoadMore ? 0 : items.length - visible.length;
  const more = onLoadMore ? hasMore : rest > 0;
  return /* @__PURE__ */ jsx85(
    DataState,
    {
      status: status === "ready" && items.length === 0 ? "empty" : status,
      what: "az el\u0151zm\xE9nyeket",
      onRetry,
      empty: empty ?? /* @__PURE__ */ jsx85(EmptyState, { compact: true, title: "M\xE9g nincs bejegyz\xE9s", children: "Ha valaki m\xF3dos\xEDt valamit, itt l\xE1tod: ki, mit \xE9s mikor." }),
      children: /* @__PURE__ */ jsxs77("div", { className: cx("bc-tl", className), role: "region", "aria-label": label, children: [
        groups.map((g) => /* @__PURE__ */ jsxs77("div", { className: "bc-tl-day", children: [
          /* @__PURE__ */ jsx85("h3", { className: "bc-tl-day-h", children: g.label }),
          /* @__PURE__ */ jsx85("ol", { className: "bc-tl-list", children: g.items.map((it) => /* @__PURE__ */ jsxs77("li", { className: "bc-tl-item", "data-tone": it.tone, children: [
            /* @__PURE__ */ jsx85("time", { className: "bc-tl-time", dateTime: isoOf(it.at), children: timeLabel(it.at) }),
            /* @__PURE__ */ jsxs77("p", { className: "bc-tl-text", children: [
              /* @__PURE__ */ jsx85("strong", { children: it.who }),
              " ",
              it.action,
              it.target ? /* @__PURE__ */ jsxs77(Fragment23, { children: [
                " ",
                it.target
              ] }) : null
            ] }),
            it.changes && it.changes.length > 0 && /* @__PURE__ */ jsx85(Changes, { changes: it.changes })
          ] }, it.id)) })
        ] }, g.key)),
        (more || items.length > pageSize) && /* @__PURE__ */ jsxs77("div", { className: "bc-tl-more", children: [
          /* @__PURE__ */ jsxs77("span", { className: "bc-tl-count", role: "status", children: [
            visible.length,
            onLoadMore ? "" : `/${items.length}`,
            " bejegyz\xE9s l\xE1tszik"
          ] }),
          more && /* @__PURE__ */ jsx85(Button, { variant: "secondary", size: "sm", busy: loadingMore, onClick: () => onLoadMore ? onLoadMore() : setShown((s) => s + pageSize), children: onLoadMore ? "M\xE9g t\xF6bb bejegyz\xE9s" : `M\xE9g ${Math.min(pageSize, rest)} bejegyz\xE9s` })
        ] })
      ] })
    }
  );
}

// react/src/kieg/PreviewCard.tsx
import { useCallback as useCallback5, useState as useState44 } from "react";

// react/src/kieg/Clamp.tsx
import { createContext as createContext3, useContext as useContext3, useEffect as useEffect25, useLayoutEffect as useLayoutEffect5, useRef as useRef35 } from "react";
import { jsx as jsx86 } from "react/jsx-runtime";
var CutContext = createContext3(() => void 0);
function Clamp({ k, label, lines, as: Tag = "p", placeholder, className, children }) {
  const ref = useRef35(null);
  const report = useContext3(CutContext);
  const empty = children === void 0 || children === null || typeof children === "string" && !children.trim();
  useLayoutEffect5(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
      const cut = !empty && (lines === 1 ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight - el.clientHeight > lh / 2);
      el.toggleAttribute("data-cut", cut);
      report(k, label, lines, cut);
    };
    measure();
    let live = true;
    document.fonts?.ready.then(() => live && measure());
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      live = false;
      ro?.disconnect();
    };
  }, [children, lines, empty, k, label, report]);
  useEffect25(() => () => report(k, label, lines, false), [k, label, lines, report]);
  const style = { ["--lines"]: lines };
  return /* @__PURE__ */ jsx86(Tag, { ref, className: cx("bc-clamp", lines === 1 && "is-one", empty && "is-placeholder", className), style, "data-clamp": k, children: empty ? placeholder : children });
}

// react/src/kieg/PreviewCard.tsx
import { jsx as jsx87, jsxs as jsxs78 } from "react/jsx-runtime";
var Img = ({ src }) => src ? /* @__PURE__ */ jsx87("img", { className: "bc-pv-img", src, alt: "", loading: "lazy" }) : /* @__PURE__ */ jsx87("div", { className: "bc-pv-img is-empty", children: /* @__PURE__ */ jsx87("span", { children: "Nincs k\xE9p" }) });
function Partner(p) {
  return /* @__PURE__ */ jsxs78("article", { className: "bc-pv-card", children: [
    /* @__PURE__ */ jsx87(Img, { src: p.imageUrl }),
    /* @__PURE__ */ jsxs78("div", { className: "bc-pv-body", children: [
      /* @__PURE__ */ jsx87(Clamp, { k: "name", label: "A partner neve", lines: 1, as: "h3", placeholder: "Partner neve", className: "bc-pv-title", children: p.name }),
      p.category && /* @__PURE__ */ jsx87("span", { className: "bc-badge is-accent bc-pv-badge", children: p.category }),
      /* @__PURE__ */ jsx87(Clamp, { k: "address", label: "Az utcac\xEDm", lines: 1, placeholder: "C\xEDm helye", className: "bc-pv-meta", children: p.address }),
      /* @__PURE__ */ jsx87(Clamp, { k: "description", label: "A le\xEDr\xE1s", lines: 3, placeholder: "R\xF6vid le\xEDr\xE1s helye", className: "bc-pv-text", children: p.description })
    ] })
  ] });
}
function Coupon(p) {
  return /* @__PURE__ */ jsxs78("article", { className: "bc-pv-card", children: [
    /* @__PURE__ */ jsxs78("div", { className: "bc-pv-media", children: [
      /* @__PURE__ */ jsx87(Img, { src: p.imageUrl }),
      p.discount && /* @__PURE__ */ jsx87("span", { className: "bc-pv-discount", children: p.discount })
    ] }),
    /* @__PURE__ */ jsxs78("div", { className: "bc-pv-body", children: [
      /* @__PURE__ */ jsx87(Clamp, { k: "partner", label: "A partner neve", lines: 1, placeholder: "Partner neve", className: "bc-pv-meta", children: p.partnerName }),
      /* @__PURE__ */ jsx87(Clamp, { k: "title", label: "A kupon neve", lines: 2, as: "h3", placeholder: "Kupon neve", className: "bc-pv-title", children: p.title }),
      /* @__PURE__ */ jsx87(Clamp, { k: "description", label: "A felt\xE9telek", lines: 2, placeholder: "Felt\xE9telek helye", className: "bc-pv-text", children: p.description }),
      /* @__PURE__ */ jsx87("p", { className: "bc-pv-meta", children: p.validUntil ? `\xC9rv\xE9nyes: ${p.validUntil}` : "\xC9rv\xE9nyess\xE9g helye" })
    ] })
  ] });
}
function Notification(p) {
  return /* @__PURE__ */ jsxs78("article", { className: "bc-pv-card is-message", children: [
    p.imageUrl !== void 0 && /* @__PURE__ */ jsx87(Img, { src: p.imageUrl || void 0 }),
    /* @__PURE__ */ jsxs78("div", { className: "bc-pv-body", children: [
      /* @__PURE__ */ jsx87(Clamp, { k: "title", label: "A c\xEDm", lines: 2, as: "h3", placeholder: "Az \xE9rtes\xEDt\xE9s c\xEDme", className: "bc-pv-title", children: p.title }),
      /* @__PURE__ */ jsx87(Clamp, { k: "body", label: "Az \xFCzenet", lines: 4, placeholder: "Az \xFCzenet sz\xF6vege", className: "bc-pv-text", children: p.body }),
      p.buttonText !== void 0 && /* @__PURE__ */ jsx87("span", { className: "bc-btn is-sm is-block bc-pv-btn", children: /* @__PURE__ */ jsx87(Clamp, { k: "button", label: "A gomb felirata", lines: 1, as: "span", placeholder: "Gomb felirata", children: p.buttonText }) })
    ] })
  ] });
}
function PreviewCard({ caption = "\xCDgy l\xE1tszik az appban", className, ...data }) {
  const [cuts, setCuts] = useState44({});
  const report = useCallback5((key, label, lines, cut) => {
    setCuts((prev) => {
      if (Boolean(prev[key]) === cut) return prev;
      const next = { ...prev };
      if (cut) next[key] = { label, lines };
      else delete next[key];
      return next;
    });
  }, []);
  const list2 = Object.entries(cuts);
  let body;
  if (data.variant === "partner") body = /* @__PURE__ */ jsx87(Partner, { ...data });
  else if (data.variant === "kupon") body = /* @__PURE__ */ jsx87(Coupon, { ...data });
  else body = /* @__PURE__ */ jsx87(Notification, { ...data });
  return /* @__PURE__ */ jsxs78("figure", { className: cx("bc-preview", className), "data-variant": data.variant, children: [
    /* @__PURE__ */ jsxs78("div", { className: "bc-pv-phone", "aria-label": `${caption} (el\u0151n\xE9zet)`, role: "group", children: [
      /* @__PURE__ */ jsx87("div", { className: "bc-pv-notch", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx87("div", { className: "bc-pv-screen", children: /* @__PURE__ */ jsx87(CutContext.Provider, { value: report, children: body }) })
    ] }),
    /* @__PURE__ */ jsxs78("figcaption", { className: "bc-pv-caption", children: [
      /* @__PURE__ */ jsx87("span", { children: caption }),
      /* @__PURE__ */ jsx87("span", { className: "bc-pv-notes", role: "status", children: list2.length === 0 ? /* @__PURE__ */ jsx87("span", { className: "bc-badge is-success", children: "Minden sz\xF6veg kif\xE9r" }) : list2.map(([k, c]) => /* @__PURE__ */ jsxs78("span", { className: "bc-badge is-warning", "data-cut": k, children: [
        c.label,
        " lev\xE1g\xF3dik: ",
        c.lines === 1 ? "1 sor" : `${c.lines} sor`,
        " f\xE9r el"
      ] }, k)) })
    ] })
  ] });
}

// react/src/kieg/AudienceBuilder.tsx
import { Fragment as Fragment24, useEffect as useEffect26, useId as useId17, useRef as useRef36, useState as useState45 } from "react";

// react/src/kieg/audience.ts
var OPS = {
  select: [{ value: "eq", label: "ez" }, { value: "neq", label: "nem ez" }],
  number: [{ value: "gte", label: "legal\xE1bb" }, { value: "lte", label: "legfeljebb" }, { value: "eq", label: "pontosan" }],
  text: [{ value: "contains", label: "tartalmazza" }, { value: "eq", label: "pontosan ez" }]
};
var seq3 = 0;
var newRule = () => ({ id: `feltetel-${Date.now().toString(36)}-${++seq3}`, field: "", op: "eq", value: null });
function ruleProblem(r, fields) {
  if (!r.field) return "V\xE1laszd ki, mire sz\u0171rj\xF6n ez a felt\xE9tel.";
  const f = fields.find((x) => x.key === r.field);
  if (!f) return "Ez a mez\u0151 m\xE1r nem v\xE1laszthat\xF3 \u2013 v\xE1lassz m\xE1sikat, vagy t\xF6r\xF6ld a felt\xE9telt.";
  if (r.value === null || typeof r.value === "string" && !r.value.trim()) return "Adj meg \xE9rt\xE9ket \u2013 en\xE9lk\xFCl ez a felt\xE9tel nem sz\u0171r.";
  if (f.type === "select" && !f.options?.some((o) => o.value === r.value)) return "A v\xE1lasztott \xE9rt\xE9k m\xE1r nem l\xE9tezik \u2013 v\xE1lassz \xFAjat.";
  return void 0;
}
function audienceProblems(a, fields) {
  const out = {};
  for (const r of a.rules) {
    const p = ruleProblem(r, fields);
    if (p) out[r.id] = p;
  }
  return out;
}
function describeAudience(a, fields) {
  const parts = a.rules.filter((r) => !ruleProblem(r, fields)).map((r) => {
    const f = fields.find((x) => x.key === r.field);
    const op = OPS[f.type].find((o) => o.value === r.op)?.label ?? "";
    const v = f.type === "select" ? f.options?.find((o) => o.value === r.value)?.label : String(r.value).replace(".", ",");
    if (f.type === "select") return `${f.label}: ${r.op === "neq" ? "nem " : ""}${v}`;
    return `${f.label} ${op} ${v}${f.unit ? ` ${f.unit}` : ""}`;
  });
  if (!parts.length) return "mindenki (nincs \xE9rv\xE9nyes felt\xE9tel)";
  return parts.join(a.join === "and" ? " \xC9S " : " VAGY ");
}

// react/src/kieg/AudienceRule.tsx
import { jsx as jsx88, jsxs as jsxs79 } from "react/jsx-runtime";
function AudienceRuleRow({ rule, n, fields, onChange, onRemove, onBlur, error, disabled }) {
  const f = fields.find((x) => x.key === rule.field);
  const ops = f ? OPS[f.type] : [];
  const valueLabel = f ? `${f.label} \u2013 \xE9rt\xE9k` : "\xC9rt\xE9k";
  return /* @__PURE__ */ jsxs79("li", { className: "bc-aud-rule", "data-rule": rule.id, "data-invalid": error ? true : void 0, onBlur, "aria-label": `${n}. felt\xE9tel`, children: [
    /* @__PURE__ */ jsxs79("div", { className: "bc-aud-grid", children: [
      /* @__PURE__ */ jsx88(
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
      /* @__PURE__ */ jsx88(
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
      !f || f.type === "select" ? /* @__PURE__ */ jsx88(
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
      ) : f.type === "number" ? /* @__PURE__ */ jsx88(
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
      ) : /* @__PURE__ */ jsx88(
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
      !disabled && /* @__PURE__ */ jsx88(IconButton, { className: "bc-aud-remove", "aria-label": `${n}. felt\xE9tel t\xF6rl\xE9se`, danger: true, onClick: onRemove, children: /* @__PURE__ */ jsx88(CloseIcon2, {}) })
    ] }),
    error && /* @__PURE__ */ jsxs79("p", { className: "bc-error", role: "alert", children: [
      n,
      ". felt\xE9tel: ",
      error
    ] })
  ] });
}

// react/src/kieg/AudienceBuilder.tsx
import { jsx as jsx89, jsxs as jsxs80 } from "react/jsx-runtime";
function AudienceBuilder({
  fields,
  value,
  onChange,
  estimate,
  maxRules = 10,
  showErrors,
  label = "C\xE9lcsoport",
  help = "Kik kapj\xE1k meg az \xFCzenetet. Felt\xE9tel n\xE9lk\xFCl mindenki; minden felt\xE9tel sz\u0171k\xEDt (\xC9S) vagy b\u0151v\xEDt (VAGY). A l\xE9tsz\xE1m becsl\xE9s \u2013 a k\xFCld\xE9s pillanat\xE1ban elt\xE9rhet.",
  disabled,
  className
}) {
  const uid = useId17();
  const [touched, setTouched] = useState45(() => /* @__PURE__ */ new Set());
  const focusRule = useRef36(null);
  const addBtn = useRef36(null);
  const root = useRef36(null);
  const problems = audienceProblems(value, fields);
  const bad2 = Object.keys(problems).length;
  const full = value.rules.length >= maxRules;
  useEffect26(() => {
    if (!focusRule.current) return;
    root.current?.querySelector(`[data-rule="${focusRule.current}"] select`)?.focus();
    focusRule.current = null;
  });
  const add = () => {
    if (full) return;
    const r = newRule();
    focusRule.current = r.id;
    onChange({ ...value, rules: [...value.rules, r] });
  };
  const remove = (id) => {
    onChange({ ...value, rules: value.rules.filter((r) => r.id !== id) });
    addBtn.current?.focus();
  };
  return /* @__PURE__ */ jsxs80("fieldset", { ref: root, className: cx("bc-aud", className), disabled, "aria-labelledby": `${uid}-l`, children: [
    /* @__PURE__ */ jsxs80("legend", { className: "bc-label-row bc-aud-legend", children: [
      /* @__PURE__ */ jsx89("span", { className: "bc-label", id: `${uid}-l`, children: label }),
      /* @__PURE__ */ jsx89(HelpButton, { label, children: help })
    ] }),
    value.rules.length >= 2 && /* @__PURE__ */ jsxs80("div", { className: "bc-aud-join", children: [
      /* @__PURE__ */ jsxs80("span", { className: "bc-aud-join-label", children: [
        "Kik kapj\xE1k meg? ",
        /* @__PURE__ */ jsx89("span", { className: "bc-muted", children: "\xC9S: akikre minden felt\xE9tel igaz \xB7 VAGY: akikre legal\xE1bb egy." })
      ] }),
      /* @__PURE__ */ jsx89(
        SegmentedControl,
        {
          label: "A felt\xE9telek kapcsolata",
          value: value.join,
          onChange: (join) => onChange({ ...value, join }),
          items: [{ value: "and", label: "\xC9S" }, { value: "or", label: "VAGY" }]
        }
      )
    ] }),
    value.rules.length === 0 ? /* @__PURE__ */ jsx89("div", { className: "bc-alert is-info", children: /* @__PURE__ */ jsxs80("p", { children: [
      /* @__PURE__ */ jsx89("strong", { children: "Nincs felt\xE9tel:" }),
      " az \xFCzenetet mindenki megkapja. Sz\u0171k\xEDt\xE9shez adj hozz\xE1 felt\xE9telt."
    ] }) }) : /* @__PURE__ */ jsx89("ol", { className: "bc-aud-rules", children: value.rules.map((r, i) => /* @__PURE__ */ jsxs80(Fragment24, { children: [
      i > 0 && /* @__PURE__ */ jsx89("li", { className: "bc-aud-joiner", "aria-hidden": "true", children: /* @__PURE__ */ jsx89("span", { className: "bc-badge is-muted", children: value.join === "and" ? "\xC9S" : "VAGY" }) }),
      /* @__PURE__ */ jsx89(
        AudienceRuleRow,
        {
          rule: r,
          n: i + 1,
          fields,
          disabled,
          error: showErrors || touched.has(r.id) ? problems[r.id] : void 0,
          onBlur: () => setTouched((t) => t.has(r.id) ? t : new Set(t).add(r.id)),
          onChange: (nr) => onChange({ ...value, rules: value.rules.map((x) => x.id === r.id ? nr : x) }),
          onRemove: () => remove(r.id)
        }
      )
    ] }, r.id)) }),
    /* @__PURE__ */ jsxs80("div", { className: "bc-row bc-aud-add", children: [
      /* @__PURE__ */ jsx89(Button, { ref: addBtn, variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx89(PlusIcon, {}), onClick: add, disabled: full || disabled, children: "Felt\xE9tel hozz\xE1ad\xE1sa" }),
      /* @__PURE__ */ jsxs80("span", { className: cx("bc-count", full ? "is-full" : value.rules.length >= maxRules * 0.9 && "is-near"), children: [
        value.rules.length,
        "/",
        maxRules,
        " felt\xE9tel",
        full ? " \u2013 el\xE9rted a hat\xE1rt" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxs80("div", { className: "bc-aud-estimate", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsx89("span", { className: "bc-aud-estimate-label", children: "Becs\xFClt c\xEDmzettek" }),
      estimate?.loading ? /* @__PURE__ */ jsxs80("span", { className: "bc-row", children: [
        /* @__PURE__ */ jsx89(HexLoader, { label: "Sz\xE1moljuk a c\xEDmzetteket" }),
        " Sz\xE1moljuk\u2026"
      ] }) : estimate?.error ? /* @__PURE__ */ jsx89("span", { className: "bc-error", children: estimate.error }) : /* @__PURE__ */ jsx89("strong", { className: "bc-num bc-aud-count", children: estimate?.count == null ? "\u2013" : `${formatHu(estimate.count, 0)} f\u0151` }),
      /* @__PURE__ */ jsxs80("span", { className: "bc-aud-summary", children: [
        "Kik: ",
        describeAudience(value, fields)
      ] }),
      bad2 > 0 && /* @__PURE__ */ jsxs80("span", { className: "bc-aud-warn", children: [
        bad2,
        " hib\xE1s felt\xE9tel kimaradt a becsl\xE9sb\u0151l \u2013 jav\xEDtsd vagy t\xF6r\xF6ld."
      ] })
    ] })
  ] });
}

// react/src/kieg/CompareMerge.tsx
import { useId as useId19, useState as useState46 } from "react";

// react/src/kieg/MergeField.tsx
import { useId as useId18 } from "react";

// react/src/kieg/merge.ts
var isBlank = (v) => v === null || v === void 0 || typeof v === "string" && !v.trim() || Array.isArray(v) && v.length === 0;
var norm2 = (v) => isBlank(v) ? null : typeof v === "string" ? v.trim() : Array.isArray(v) ? v.map(norm2) : v;
var sameValue = (a, b) => JSON.stringify(norm2(a)) === JSON.stringify(norm2(b));
function showValue(v) {
  if (isBlank(v)) return "";
  if (Array.isArray(v)) return v.map(showValue).join(", ");
  if (typeof v === "boolean") return v ? "igen" : "nem";
  if (typeof v === "number") return String(v).replace(".", ",");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
var differing = (records, fields) => fields.filter((f) => records.some((r) => !sameValue(r.values[f.key], records[0].values[f.key])));
function suggest(records, fields, choices) {
  const out = { ...choices };
  for (const f of differing(records, fields)) {
    if (out[f.key]) continue;
    const filled = records.filter((r) => !isBlank(r.values[f.key]));
    if (filled.length === 1) out[f.key] = filled[0].id;
  }
  return out;
}
function mergedValues(records, fields, choices) {
  const diff = new Set(differing(records, fields).map((f) => f.key));
  const out = {};
  for (const f of fields) {
    if (!diff.has(f.key)) {
      out[f.key] = records[0].values[f.key];
      continue;
    }
    const r = records.find((x) => x.id === choices[f.key]);
    out[f.key] = r ? r.values[f.key] : void 0;
  }
  return out;
}

// react/src/kieg/MergeField.tsx
import { jsx as jsx90, jsxs as jsxs81 } from "react/jsx-runtime";
function MergeFieldChoice({ field, records, chosen, onChoose, error }) {
  const name2 = useId18();
  const show = field.format ?? showValue;
  return /* @__PURE__ */ jsxs81(
    "fieldset",
    {
      className: "bc-merge-field",
      "data-field": field.key,
      "data-decided": chosen ? true : void 0,
      "aria-invalid": error ? true : void 0,
      "aria-describedby": error ? `${name2}-err` : void 0,
      children: [
        /* @__PURE__ */ jsxs81("legend", { className: "bc-merge-legend", children: [
          field.label,
          field.required && /* @__PURE__ */ jsx90("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
          /* @__PURE__ */ jsx90("span", { className: "bc-badge is-warning", children: "elt\xE9r" }),
          !chosen && /* @__PURE__ */ jsx90("span", { className: "bc-sr", children: " \u2013 m\xE9g nem v\xE1lasztott\xE1l" })
        ] }),
        /* @__PURE__ */ jsx90("div", { className: "bc-merge-opts", children: records.map((r) => {
          const v = r.values[field.key];
          const blank = isBlank(v);
          return /* @__PURE__ */ jsxs81("label", { className: cx("bc-merge-opt", chosen === r.id && "is-on", blank && "is-blank"), children: [
            /* @__PURE__ */ jsx90("input", { type: "radio", name: name2, value: r.id, checked: chosen === r.id, onChange: () => onChoose(r.id) }),
            /* @__PURE__ */ jsx90("span", { className: "bc-merge-src", children: r.label }),
            /* @__PURE__ */ jsx90("span", { className: "bc-merge-val", children: blank ? "(\xFCres)" : show(v) })
          ] }, r.id);
        }) }),
        error && /* @__PURE__ */ jsx90("p", { className: "bc-error", id: `${name2}-err`, role: "alert", children: error })
      ]
    }
  );
}

// react/src/kieg/CompareMerge.tsx
import { Fragment as Fragment25, jsx as jsx91, jsxs as jsxs82 } from "react/jsx-runtime";
function CompareMerge({ records, fields, choices, onChoicesChange, survivor, onSurvivorChange, onMerge, consequence, className }) {
  const uid = useId19();
  const [showSame, setShowSame] = useState46(false);
  const [asking, setAsking] = useState46(false);
  const [busy, setBusy] = useState46(false);
  const [err, setErr] = useState46();
  const diff = differing(records, fields);
  const diffKeys = new Set(diff.map((f) => f.key));
  const same2 = fields.filter((f) => !diffKeys.has(f.key));
  const decided = diff.filter((f) => choices[f.key]).length;
  const result = mergedValues(records, fields, choices);
  const reqErr = (f) => f.required && choices[f.key] && isBlank(result[f.key]) ? `A(z) \u201E${f.label}\u201D nem lehet \xFCres \u2013 v\xE1lassz kit\xF6lt\xF6tt \xE9rt\xE9ket.` : void 0;
  const blocked = diff.some(reqErr);
  const needSurvivor = Boolean(onSurvivorChange) && !survivor;
  const ready = decided === diff.length && !blocked && !needSurvivor;
  const missing = [diff.length - decided > 0 && `${diff.length - decided} mez\u0151`, needSurvivor && "a megmarad\xF3 rekord", blocked && "egy k\xF6telez\u0151 mez\u0151 \xFCres"].filter(Boolean).join(", ");
  const run = async () => {
    if (busy) return;
    setErr(void 0);
    try {
      const r = onMerge(result, choices);
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      setAsking(false);
    } catch (e) {
      setBusy(false);
      setErr(`Nem siker\xFClt az \xF6sszef\xE9s\xFCl\xE9s${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra.`);
    }
  };
  const survivorLabel = records.find((r) => r.id === survivor)?.label;
  return /* @__PURE__ */ jsxs82("div", { className: cx("bc-merge", className), children: [
    /* @__PURE__ */ jsxs82("div", { className: "bc-merge-head", children: [
      /* @__PURE__ */ jsxs82("div", { className: "bc-merge-intro", children: [
        /* @__PURE__ */ jsxs82("p", { children: [
          /* @__PURE__ */ jsxs82("strong", { children: [
            diff.length,
            " mez\u0151 t\xE9r el"
          ] }),
          ", ",
          same2.length,
          " egyezik. Mez\u0151nk\xE9nt v\xE1laszd ki, melyik \xE9rt\xE9k maradjon."
        ] }),
        /* @__PURE__ */ jsx91(HelpButton, { label: "\xD6sszef\xE9s\xFCl\xE9s", children: "Az egyez\u0151 mez\u0151k maradnak, ahogy vannak. Az elt\xE9r\u0151kn\xE9l te d\xF6nt\xF6d el, melyik rekord \xE9rt\xE9ke ker\xFCl az eredm\xE9nybe. A \u201EJavaslat\u201D csak ott d\xF6nt, ahol egyetlen rekordban van kit\xF6ltve az adat." })
      ] }),
      /* @__PURE__ */ jsxs82("div", { className: "bc-row", children: [
        /* @__PURE__ */ jsx91(Button, { variant: "secondary", size: "sm", onClick: () => onChoicesChange(suggest(records, fields, choices)), children: "Javaslat: a kit\xF6lt\xF6tt \xE9rt\xE9kek" }),
        records.map((r) => /* @__PURE__ */ jsxs82(Button, { variant: "ghost", size: "sm", onClick: () => onChoicesChange(Object.fromEntries(diff.map((f) => [f.key, r.id]))), children: [
          "Mind innen: ",
          r.label
        ] }, r.id))
      ] }),
      /* @__PURE__ */ jsxs82("div", { className: "bc-merge-progress", children: [
        /* @__PURE__ */ jsx91(ProgressBar, { value: diff.length ? decided / diff.length : 1, label: "Eld\xF6nt\xF6tt mez\u0151k" }),
        /* @__PURE__ */ jsxs82("span", { className: "bc-count", role: "status", children: [
          decided,
          "/",
          diff.length,
          " elt\xE9r\u0151 mez\u0151 eld\xF6ntve"
        ] })
      ] })
    ] }),
    onSurvivorChange && /* @__PURE__ */ jsx91(
      RadioGroup,
      {
        label: "Melyik rekord maradjon meg?",
        name: `${uid}-survivor`,
        value: survivor,
        onChange: onSurvivorChange,
        help: "A megmarad\xF3 rekord azonos\xEDt\xF3ja, \xE9rt\xE9kel\xE9sei \xE9s kapcsolatai maradnak; a m\xE1sik t\xF6rl\u0151dik. A mez\u0151k \xE9rt\xE9k\xE9t lent v\xE1lasztod.",
        options: records.map((r) => ({ value: r.id, label: r.label }))
      }
    ),
    /* @__PURE__ */ jsxs82("div", { className: "bc-merge-fields", children: [
      diff.map((f) => /* @__PURE__ */ jsx91(
        MergeFieldChoice,
        {
          field: f,
          records,
          chosen: choices[f.key],
          error: reqErr(f),
          onChoose: (id) => onChoicesChange({ ...choices, [f.key]: id })
        },
        f.key
      )),
      diff.length === 0 && /* @__PURE__ */ jsx91("div", { className: "bc-alert is-info", children: /* @__PURE__ */ jsxs82("p", { children: [
        "Minden mez\u0151 egyezik",
        onSurvivorChange ? " \u2013 csak a megmarad\xF3 rekordot kell kiv\xE1lasztanod." : ": az \xF6sszef\xE9s\xFCl\xE9s csak a duplik\xE1tumot sz\xFCnteti meg."
      ] }) })
    ] }),
    same2.length > 0 && /* @__PURE__ */ jsxs82("div", { className: "bc-merge-same", children: [
      /* @__PURE__ */ jsx91(Button, { variant: "ghost", size: "sm", "aria-expanded": showSame, onClick: () => setShowSame(!showSame), children: showSame ? "Egyez\u0151 mez\u0151k elrejt\xE9se" : `Egyez\u0151 mez\u0151k mutat\xE1sa (${same2.length})` }),
      showSame && /* @__PURE__ */ jsx91("dl", { className: "bc-merge-result", children: same2.map((f) => /* @__PURE__ */ jsxs82("div", { children: [
        /* @__PURE__ */ jsx91("dt", { children: f.label }),
        /* @__PURE__ */ jsxs82("dd", { children: [
          isBlank(result[f.key]) ? "(\xFCres)" : (f.format ?? showValue)(result[f.key]),
          " ",
          /* @__PURE__ */ jsx91("span", { className: "bc-badge is-muted", children: "egyezik" })
        ] })
      ] }, f.key)) })
    ] }),
    diff.length > 0 && /* @__PURE__ */ jsxs82("div", { className: "bc-card bc-merge-preview", children: [
      /* @__PURE__ */ jsx91("h3", { className: "bc-card-title", children: "Az eredm\xE9ny" }),
      /* @__PURE__ */ jsx91("dl", { className: "bc-merge-result", children: diff.map((f) => /* @__PURE__ */ jsxs82("div", { "data-result": f.key, children: [
        /* @__PURE__ */ jsx91("dt", { children: f.label }),
        /* @__PURE__ */ jsx91("dd", { children: choices[f.key] ? isBlank(result[f.key]) ? "(\xFCres)" : (f.format ?? showValue)(result[f.key]) : /* @__PURE__ */ jsx91("em", { className: "bc-merge-todo", children: "m\xE9g nem v\xE1lasztott\xE1l" }) })
      ] }, f.key)) })
    ] }),
    /* @__PURE__ */ jsxs82("div", { className: "bc-form-actions bc-merge-actions", children: [
      !ready && /* @__PURE__ */ jsxs82("span", { className: "bc-merge-missing", children: [
        "Hi\xE1nyzik: ",
        missing,
        "."
      ] }),
      /* @__PURE__ */ jsx91(Button, { disabled: !ready, onClick: () => setAsking(true), children: "\xD6sszef\xE9s\xFCl\xE9s" })
    ] }),
    /* @__PURE__ */ jsxs82(
      KiegDialog,
      {
        open: asking,
        onCancel: () => {
          if (!busy) setAsking(false);
        },
        title: "\xD6sszef\xE9s\xFCl\xF6d a rekordokat?",
        actions: /* @__PURE__ */ jsxs82(Fragment25, { children: [
          /* @__PURE__ */ jsx91(Button, { variant: "secondary", "data-autofocus": true, disabled: busy, onClick: () => setAsking(false), children: "M\xE9gse" }),
          /* @__PURE__ */ jsx91(Button, { variant: "danger", busy, onClick: () => void run(), children: "V\xE9gleges \xF6sszef\xE9s\xFCl\xE9s" })
        ] }),
        children: [
          /* @__PURE__ */ jsx91("p", { children: consequence ?? `${survivorLabel ? `Megmarad: ${survivorLabel}. ` : ""}A t\xF6bbi rekord t\xF6rl\u0151dik, a v\xE1lasztott \xE9rt\xE9kek a megmarad\xF3ba ker\xFClnek. Ez nem vonhat\xF3 vissza.` }),
          err && /* @__PURE__ */ jsx91("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx91("p", { children: err }) })
        ]
      }
    )
  ] });
}

// react/src/kieg/ReviewQueue.tsx
import { useEffect as useEffect28, useId as useId21, useRef as useRef38, useState as useState48 } from "react";

// react/src/kieg/ReviewReject.tsx
import { useEffect as useEffect27, useId as useId20, useRef as useRef37, useState as useState47 } from "react";
import { jsx as jsx92, jsxs as jsxs83 } from "react/jsx-runtime";
var MIN = 10;
var MAX = 300;
function ReviewReject({ reasons = [], busy, onSubmit, onCancel }) {
  const uid = useId20();
  const [preset, setPreset] = useState47();
  const [text, setText] = useState47("");
  const [err, setErr] = useState47();
  const box = useRef37(null);
  useEffect27(() => {
    box.current?.querySelector("input[type=radio], textarea")?.focus();
  }, []);
  const submit = () => {
    if (busy) return;
    const t = text.trim();
    if (!preset && t.length < MIN) {
      setErr(reasons.length ? `V\xE1lassz okot, vagy \xEDrd le legal\xE1bb ${MIN} karakterben \u2013 a bek\xFCld\u0151 ebb\u0151l tudja, mit jav\xEDtson.` : `\xCDrd le legal\xE1bb ${MIN} karakterben, mi\xE9rt utas\xEDtod el \u2013 most ${t.length}.`);
      shake(box.current);
      return;
    }
    onSubmit(preset ? t ? `${preset}: ${t}` : preset : t);
  };
  return /* @__PURE__ */ jsxs83(
    "div",
    {
      ref: box,
      className: "bc-review-reject bc-anim-rise",
      role: "group",
      "aria-label": "Elutas\xEDt\xE1s indokkal",
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onCancel();
        }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          submit();
        }
      },
      children: [
        reasons.length > 0 && /* @__PURE__ */ jsx92(
          RadioGroup,
          {
            label: "Mi\xE9rt utas\xEDtod el?",
            name: `${uid}-ok`,
            value: preset ?? "",
            onChange: (v) => {
              setPreset(v);
              setErr(void 0);
            },
            help: "A v\xE1lasztott ok a bek\xFCld\u0151h\xF6z \xE9s a napl\xF3ba ker\xFCl. Ha egyik sem illik, \xEDrd le saj\xE1t szavaiddal lent.",
            options: reasons.map((r) => ({ value: r, label: r }))
          }
        ),
        /* @__PURE__ */ jsx92(
          TextArea,
          {
            label: reasons.length ? "Kieg\xE9sz\xEDt\xE9s (ha egyik ok sem illik: k\xF6telez\u0151)" : "Indokl\xE1s",
            rows: 3,
            maxLength: MAX,
            help: "P\xE1r sz\xF3 arr\xF3l, mi a baj \xE9s mit kellene jav\xEDtani. Ez a napl\xF3ba ker\xFCl, \xE9s a bek\xFCld\u0151 is l\xE1tja.",
            range: reasons.length ? `ok v\xE1laszt\xE1s\xE1val nem k\xF6telez\u0151 \xB7 k\xFCl\xF6nben ${MIN}\u2013${MAX} karakter` : `${MIN}\u2013${MAX} karakter`,
            value: text,
            error: err,
            required: !preset,
            onChange: (e) => {
              setText(e.target.value);
              if (err) setErr(void 0);
            }
          }
        ),
        /* @__PURE__ */ jsxs83("div", { className: "bc-row is-end", children: [
          /* @__PURE__ */ jsx92(Button, { variant: "secondary", size: "sm", onClick: onCancel, disabled: busy, children: "M\xE9gse (Esc)" }),
          /* @__PURE__ */ jsx92(Button, { variant: "danger", size: "sm", busy, onClick: submit, children: "Elutas\xEDt\xE1s" })
        ] })
      ]
    }
  );
}

// react/src/kieg/ReviewQueue.tsx
import { jsx as jsx93, jsxs as jsxs84 } from "react/jsx-runtime";
var NAME = { approve: "J\xF3v\xE1hagyva", reject: "Elutas\xEDtva", skip: "Kihagyva" };
var TONE = { approve: "is-success", reject: "is-danger", skip: "is-muted" };
var typing = (t) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
function ReviewQueue({ items, getId, getTitle, render, onDecide, onUndo, reasons, label = "Ellen\u0151rz\xE9si sor", className }) {
  const [at2, setAt] = useState48(0);
  const [log, setLog] = useState48([]);
  const [rejecting, setRejecting] = useState48(false);
  const [busy, setBusy] = useState48(false);
  const [err, setErr] = useState48();
  const [say2, setSay] = useState48("");
  const head = useRef38(null);
  const root = useRef38(null);
  const rejectBtn = useRef38(null);
  const titleId = useId21();
  const item = items[at2];
  const total = items.length;
  const decide = async (d) => {
    if (busy || !item) return;
    setErr(void 0);
    try {
      const r = onDecide(item, d);
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      setRejecting(false);
      setLog((l) => [...l, { index: at2, d }]);
      const next = items[at2 + 1];
      setSay(`${NAME[d.type]}: ${getTitle(item)}. ${next ? `K\xF6vetkez\u0151: ${getTitle(next)} (${at2 + 2}/${total}).` : "A sor v\xE9g\xE9re \xE9rt\xE9l."}`);
      setAt(at2 + 1);
      focusHead.current = true;
    } catch (e) {
      setBusy(false);
      setErr(`Nem siker\xFClt menteni a d\xF6nt\xE9st${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra.`);
    }
  };
  const undo = async () => {
    const last2 = log[log.length - 1];
    if (!last2 || busy || !onUndo) return;
    try {
      const r = onUndo(items[last2.index], last2.d);
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      setLog(log.slice(0, -1));
      setAt(last2.index);
      setRejecting(false);
      setSay(`Visszavonva: ${getTitle(items[last2.index])}.`);
      focusHead.current = true;
    } catch {
      setBusy(false);
      setErr("Nem siker\xFClt visszavonni. Pr\xF3b\xE1ld \xFAjra.");
    }
  };
  const focusHead = useRef38(false);
  useEffect28(() => {
    if (focusHead.current) {
      focusHead.current = false;
      head.current?.focus();
    }
  });
  useEffect28(() => {
    const h = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || typing(e.target) || rejecting || busy || !item || document.querySelector("dialog[open]")) return;
      const a = document.activeElement, r = root.current;
      if (!r || !(r.contains(a) || (!a || a === document.body) && document.querySelector(".bc-review") === r)) return;
      const k = e.key.toLowerCase();
      if (k === "j") {
        e.preventDefault();
        void decide({ type: "approve" });
      } else if (k === "e") {
        e.preventDefault();
        setRejecting(true);
      } else if (k === "k") {
        e.preventDefault();
        void decide({ type: "skip" });
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  });
  const count = (t) => log.filter((x) => x.d.type === t).length;
  const last = log[log.length - 1];
  return /* @__PURE__ */ jsxs84("section", { ref: root, className: cx("bc-review", className), "aria-label": label, children: [
    /* @__PURE__ */ jsxs84("div", { className: "bc-review-top", children: [
      /* @__PURE__ */ jsxs84("span", { className: "bc-num bc-review-pos", "aria-label": `${Math.min(at2 + 1, total)}. t\xE9tel, \xF6sszesen ${total}`, children: [
        Math.min(at2 + 1, total),
        "/",
        total
      ] }),
      /* @__PURE__ */ jsx93(ProgressBar, { value: total ? at2 / total : 1, label: "Halad\xE1s a sorban" }),
      /* @__PURE__ */ jsxs84("span", { className: "bc-review-tally", children: [
        count("approve"),
        " j\xF3v\xE1hagyva \xB7 ",
        count("reject"),
        " elutas\xEDtva \xB7 ",
        count("skip"),
        " kihagyva"
      ] })
    ] }),
    /* @__PURE__ */ jsx93("p", { className: "bc-sr", role: "status", children: say2 }),
    last && /* @__PURE__ */ jsxs84("div", { className: "bc-review-last", children: [
      /* @__PURE__ */ jsx93("span", { className: cx("bc-badge bc-anim-stamp", TONE[last.d.type]), children: NAME[last.d.type] }),
      /* @__PURE__ */ jsxs84("span", { className: "bc-review-last-title", children: [
        getTitle(items[last.index]),
        last.d.reason ? ` \u2013 ${last.d.reason}` : ""
      ] }),
      onUndo && /* @__PURE__ */ jsx93(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx93(UndoIcon, {}), disabled: busy, onClick: () => void undo(), children: "Visszavon\xE1s" })
    ] }, log.length),
    item ? /* @__PURE__ */ jsxs84("article", { className: "bc-card bc-review-item", "aria-labelledby": titleId, children: [
      /* @__PURE__ */ jsx93("h2", { id: titleId, ref: head, tabIndex: -1, className: "bc-review-title", children: getTitle(item) }),
      render(item)
    ] }, getId(item)) : total === 0 ? /* @__PURE__ */ jsx93(BeeMoment, { pillanat: "ures", sima: "Nincs ellen\u0151rizend\u0151 t\xE9tel ebben a sorban." }) : /* @__PURE__ */ jsx93(
      BeeMoment,
      {
        pillanat: "merfoldko",
        valtozat: 0,
        live: "status",
        sima: `Minden t\xE9telt \xE1tn\xE9zt\xE9l: ${count("approve")} j\xF3v\xE1hagyva, ${count("reject")} elutas\xEDtva, ${count("skip")} kihagyva.`
      }
    ),
    err && /* @__PURE__ */ jsx93("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx93("p", { children: err }) }),
    item && /* @__PURE__ */ jsx93("div", { className: "bc-review-bar", children: rejecting ? /* @__PURE__ */ jsx93(
      ReviewReject,
      {
        reasons,
        busy,
        onSubmit: (reason) => void decide({ type: "reject", reason }),
        onCancel: () => {
          setRejecting(false);
          requestAnimationFrame(() => rejectBtn.current?.focus());
        }
      }
    ) : /* @__PURE__ */ jsxs84("div", { className: "bc-row bc-review-actions", children: [
      /* @__PURE__ */ jsxs84(Button, { busy, onClick: () => void decide({ type: "approve" }), "aria-keyshortcuts": "J", children: [
        "J\xF3v\xE1hagy\xE1s ",
        /* @__PURE__ */ jsx93("kbd", { className: "bc-kbd", children: "J" })
      ] }),
      /* @__PURE__ */ jsxs84(Button, { ref: rejectBtn, variant: "danger", disabled: busy, onClick: () => setRejecting(true), "aria-keyshortcuts": "E", children: [
        "Elutas\xEDt\xE1s ",
        /* @__PURE__ */ jsx93("kbd", { className: "bc-kbd", children: "E" })
      ] }),
      /* @__PURE__ */ jsxs84(Button, { variant: "secondary", disabled: busy, onClick: () => void decide({ type: "skip" }), "aria-keyshortcuts": "K", children: [
        "Kihagy\xE1s ",
        /* @__PURE__ */ jsx93("kbd", { className: "bc-kbd", children: "K" })
      ] })
    ] }) })
  ] });
}

// react/src/kieg2/LocationPicker.tsx
import { useEffect as useEffect31, useId as useId22, useRef as useRef41, useState as useState51 } from "react";

// react/src/kieg2/AddressSearch.tsx
import { useEffect as useEffect29, useMemo as useMemo5, useRef as useRef39, useState as useState49 } from "react";
import { jsx as jsx94 } from "react/jsx-runtime";
function AddressSearch({
  search,
  onPick,
  label = "C\xEDm keres\xE9se",
  minChars = 3,
  debounceMs = 300,
  disabled,
  help = "\xCDrd be a c\xEDmet vagy a hely nev\xE9t (pl. \u201EAndr\xE1ssy \xFAt 12, Budapest\u201D), \xE9s v\xE1lassz a list\xE1b\xF3l \u2013 a t\u0171 \xE9s a koordin\xE1t\xE1k magukt\xF3l be\xE1llnak."
}) {
  const [query, setQuery] = useState49("");
  const [hits, setHits] = useState49([]);
  const [picked, setPicked] = useState49(null);
  const [loading, setLoading] = useState49(false);
  const [error, setError] = useState49();
  const [tick, setTick] = useState49(0);
  const searchRef = useRef39(search);
  searchRef.current = search;
  useEffect29(() => {
    const q = query.trim();
    if (q.length < minChars) {
      setHits([]);
      setLoading(false);
      setError(void 0);
      return;
    }
    const ctl = new AbortController();
    setLoading(true);
    setError(void 0);
    const t = setTimeout(() => {
      searchRef.current(q, ctl.signal).then((r) => {
        if (!ctl.signal.aborted) {
          setHits(r);
          setLoading(false);
        }
      }).catch(() => {
        if (!ctl.signal.aborted) {
          setLoading(false);
          setError("A c\xEDmkeres\xE9s most nem m\u0171k\xF6dik. Pr\xF3b\xE1ld \xFAjra, vagy \xEDrd be a koordin\xE1t\xE1kat.");
        }
      });
    }, debounceMs);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [query, minChars, debounceMs, tick]);
  const options = useMemo5(() => {
    const list2 = hits.map((h) => ({ value: h.id, label: h.label }));
    if (picked && !hits.some((h) => h.id === picked.id)) list2.unshift({ value: picked.id, label: picked.label });
    return list2;
  }, [hits, picked]);
  return /* @__PURE__ */ jsx94("div", { className: "bc-loc-search", children: /* @__PURE__ */ jsx94(
    Combobox,
    {
      label,
      help,
      range: `legal\xE1bb ${minChars} bet\u0171`,
      disabled,
      filter: false,
      onQueryChange: setQuery,
      minChars,
      placeholder: "Utca, h\xE1zsz\xE1m, telep\xFCl\xE9s",
      options,
      value: picked?.id ?? null,
      loading,
      loadError: error,
      onRetry: () => setTick((n) => n + 1),
      onChange: (id) => {
        const h = hits.find((x) => x.id === id) ?? (picked?.id === id ? picked : null);
        setPicked(h);
        if (h) onPick(h);
      }
    }
  ) });
}

// react/src/kieg2/geo.ts
var LAT_RANGE = { min: -90, max: 90 };
var LNG_RANGE = { min: -180, max: 180 };
var HU_BOUNDS = { south: 45.7, north: 48.6, west: 16.1, east: 22.9 };
var HU_CENTER = { lat: 47.4979, lng: 19.0402 };
function segDist(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay, k = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - k * dx, py - ay - k * dy);
}
function inHungary(p) {
  if (p.lat < HU_BOUNDS.south || p.lat > HU_BOUNDS.north || p.lng < HU_BOUNDS.west || p.lng > HU_BOUNDS.east) return false;
  let inside = false;
  const o = HU_OUTLINE;
  for (let i = 0, j = o.length - 1; i < o.length; j = i++) {
    const [xi, yi] = o[i], [xj, yj] = o[j];
    if (yi > p.lat !== yj > p.lat && p.lng < (xj - xi) * (p.lat - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside || o.some((a, i) => segDist(p.lng, p.lat, a, o[(i + 1) % o.length]) < 0.05);
}
var looksSwapped = (p) => !inHungary(p) && inHungary({ lat: p.lng, lng: p.lat });
var validLatLng = (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.lat >= LAT_RANGE.min && p.lat <= LAT_RANGE.max && p.lng >= LNG_RANGE.min && p.lng <= LNG_RANGE.max;
var sameLatLng = (a, b, decimals = 6) => a === b || !!a && !!b && a.lat.toFixed(decimals) === b.lat.toFixed(decimals) && a.lng.toFixed(decimals) === b.lng.toFixed(decimals);
var formatLatLng = (p, decimals = 4) => `${formatHu(p.lat, decimals)} \xB7 ${formatHu(p.lng, decimals)}`;
var roundLatLng = (p, decimals = 6) => ({ lat: Number(p.lat.toFixed(decimals)), lng: Number(p.lng.toFixed(decimals)) });
var HU_OUTLINE = [
  [17.16, 48.01],
  [17.7, 47.76],
  [18.7, 47.88],
  [18.84, 48.05],
  [19.47, 48.09],
  [19.9, 48.17],
  [20.29, 48.26],
  [20.66, 48.56],
  [21.45, 48.58],
  [22.1, 48.41],
  [22.2, 48.42],
  [22.32, 48.32],
  [22.9, 47.96],
  [22.42, 47.74],
  [21.95, 47.37],
  [21.62, 46.95],
  [21.2, 46.4],
  [20.73, 46.18],
  [20.26, 46.11],
  [19.57, 46.17],
  [18.85, 45.91],
  [18.43, 45.74],
  [17.86, 45.8],
  [17.3, 46],
  [16.88, 46.38],
  [16.6, 46.48],
  [16.11, 46.86],
  [16.45, 47],
  [16.45, 47.4],
  [16.65, 47.6],
  [16.42, 47.66],
  [16.48, 47.75],
  [16.72, 47.74],
  [16.9, 47.72],
  [17.07, 47.85]
];
var MINI = { w: 154, h: 100, west: 16, east: 23, north: 48.7, south: 45.6 };
function project(p) {
  return { x: (p.lng - MINI.west) / (MINI.east - MINI.west) * MINI.w, y: (MINI.north - p.lat) / (MINI.north - MINI.south) * MINI.h };
}

// react/src/kieg2/MiniMap.tsx
import { jsx as jsx95, jsxs as jsxs85 } from "react/jsx-runtime";
function MiniMap({ point }) {
  const outline = HU_OUTLINE.map(([lng, lat]) => {
    const p = project({ lat, lng });
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
  const pin = point ? project(point) : null;
  const inside = !!pin && pin.x >= 0 && pin.x <= MINI.w && pin.y >= 0 && pin.y <= MINI.h;
  const name2 = point ? `V\xE1zlatos el\u0151n\xE9zet: ${formatLatLng(point)}${inHungary(point) ? "" : inside ? " \u2013 Magyarorsz\xE1gon k\xEDv\xFCl" : " \u2013 a v\xE1zlaton k\xEDv\xFCl esik"}` : "V\xE1zlatos el\u0151n\xE9zet: m\xE9g nincs kiv\xE1lasztott pont";
  return /* @__PURE__ */ jsxs85("figure", { className: "bc-loc-mini", children: [
    /* @__PURE__ */ jsxs85("svg", { viewBox: `0 0 ${MINI.w} ${MINI.h}`, role: "img", "aria-label": name2, preserveAspectRatio: "xMidYMid meet", children: [
      /* @__PURE__ */ jsx95("polygon", { className: "bc-loc-mini-land", points: outline }),
      pin && inside && /* @__PURE__ */ jsxs85("g", { className: "bc-loc-mini-pin", transform: `translate(${pin.x.toFixed(1)} ${pin.y.toFixed(1)})`, children: [
        /* @__PURE__ */ jsx95("path", { d: "M0 0 C -2 -4 -6 -7 -6 -11 A 6 6 0 1 1 6 -11 C 6 -7 2 -4 0 0 Z" }),
        /* @__PURE__ */ jsx95("circle", { cy: "-11", r: "2.2" })
      ] })
    ] }),
    /* @__PURE__ */ jsx95("figcaption", { className: "bc-loc-mini-cap", children: !point ? "M\xE9g nincs pont \u2013 keress c\xEDmet, vagy \xEDrd be a koordin\xE1t\xE1kat." : !inside ? "A pont a v\xE1zlaton k\xEDv\xFCl esik." : "V\xE1zlatos el\u0151n\xE9zet \u2013 a pontos helyet a koordin\xE1t\xE1k adj\xE1k." })
  ] });
}

// react/src/kieg2/useGeolocation.ts
import { useCallback as useCallback6, useEffect as useEffect30, useRef as useRef40, useState as useState50 } from "react";
var MSG = {
  denied: "Nem engedted a helymeghat\xE1roz\xE1st. A b\xF6ng\xE9sz\u0151 c\xEDmsor\xE1ban (lakat ikon) enged\xE9lyezheted, vagy keresd meg a c\xEDmet.",
  unavailable: "Most nem tal\xE1lom a helyed (nincs GPS vagy h\xE1l\xF3zat). Pr\xF3b\xE1ld \xFAjra, vagy add meg a c\xEDmet.",
  unsupported: "Ez a b\xF6ng\xE9sz\u0151 nem tud helyet meghat\xE1rozni. Keresd meg a c\xEDmet, vagy \xEDrd be a koordin\xE1t\xE1kat.",
  timeout: "T\xFAl sok\xE1ig tartott a helymeghat\xE1roz\xE1s. Pr\xF3b\xE1ld \xFAjra szabad \xE9g alatt, vagy add meg a c\xEDmet."
};
var accuracyText = (m) => m < 1e3 ? `\xB1${formatHu(Math.round(m), 0)} m` : `\xB1${formatHu(m / 1e3, 1)} km`;
function useGeolocation(timeoutMs = 1e4) {
  const [state, setState] = useState50({ status: "idle" });
  const alive = useRef40(true);
  useEffect30(() => () => {
    alive.current = false;
  }, []);
  const locate = useCallback6((onFound) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable", message: MSG.unsupported });
      return;
    }
    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!alive.current) return;
        const at2 = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setState({ status: "found", at: at2, accuracy: pos.coords.accuracy });
        onFound?.(at2);
      },
      (err) => {
        if (!alive.current) return;
        if (err.code === err.PERMISSION_DENIED) setState({ status: "denied", message: MSG.denied });
        else if (err.code === err.TIMEOUT) setState({ status: "timeout", message: MSG.timeout });
        else setState({ status: "unavailable", message: MSG.unavailable });
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 6e4 }
    );
  }, [timeoutMs]);
  const reset = useCallback6(() => setState({ status: "idle" }), []);
  return { state, locate, reset };
}

// react/src/kieg2/LocationPicker.tsx
import { jsx as jsx96, jsxs as jsxs86 } from "react/jsx-runtime";
var toDraft = (v) => ({ lat: v?.lat ?? null, lng: v?.lng ?? null });
var SRC = { map: "t\xE9rk\xE9pr\u0151l", search: "c\xEDmkeres\xE9sb\u0151l", fields: "a mez\u0151kb\u0151l", geo: "a jelenlegi helyedb\u0151l", swap: "felcser\xE9lve" };
function LocationPicker({
  label,
  help,
  value,
  onChange,
  renderMap,
  search,
  geolocation = true,
  defaultCenter = HU_CENTER,
  decimals = 6,
  error,
  required,
  disabled = false,
  readOnly = false,
  className
}) {
  const id = useId22();
  const [draft, setDraft] = useState51(() => toDraft(value));
  const [said, setSaid] = useState51("");
  const emitted = useRef41(value);
  const geo = useGeolocation();
  const locked = disabled || readOnly;
  useEffect31(() => {
    if (!sameLatLng(value, emitted.current, decimals)) {
      emitted.current = value;
      setDraft(toDraft(value));
    }
  }, [value, decimals]);
  const emit2 = (v, source) => {
    emitted.current = v;
    onChange(v, source);
    if (v && source !== "fields") setSaid(`A hely be\xE1ll\xEDtva ${SRC[source]}: ${formatLatLng(v, decimals)}`);
  };
  const setPoint = (p, source) => {
    const r = roundLatLng(p, decimals);
    if (!validLatLng(r)) return;
    setDraft(r);
    emit2(r, source);
  };
  const setField = (k, n) => {
    const d = { ...draft, [k]: n };
    setDraft(d);
    const p = d.lat !== null && d.lng !== null ? { lat: d.lat, lng: d.lng } : null;
    emit2(p && validLatLng(p) ? p : null, "fields");
  };
  const point = draft.lat !== null && draft.lng !== null && validLatLng({ lat: draft.lat, lng: draft.lng }) ? { lat: draft.lat, lng: draft.lng } : null;
  const outside = point && !inHungary(point);
  const swapped = point && looksSwapped(point);
  const gs = geo.state;
  return /* @__PURE__ */ jsxs86("fieldset", { className: cx("bc-loc", className), disabled, "aria-describedby": error ? `${id}-err` : void 0, "aria-invalid": error ? true : void 0, children: [
    /* @__PURE__ */ jsxs86("legend", { className: "bc-loc-legend", children: [
      /* @__PURE__ */ jsxs86("span", { className: "bc-label", children: [
        label,
        required && /* @__PURE__ */ jsx96("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
        required && /* @__PURE__ */ jsx96("span", { className: "bc-sr", children: " (k\xF6telez\u0151)" })
      ] }),
      /* @__PURE__ */ jsx96(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsxs86("div", { className: "bc-loc-grid", children: [
      /* @__PURE__ */ jsx96("div", { className: "bc-loc-map", children: renderMap ? renderMap({
        center: point ?? defaultCenter,
        marker: point,
        disabled: locked,
        onPick: (p) => !locked && setPoint(p, "map"),
        markerHtml: markerHtml({ label: "", kind: "neutral", selected: true, title: "Kiv\xE1lasztott hely" })
      }) : /* @__PURE__ */ jsx96(MiniMap, { point }) }),
      /* @__PURE__ */ jsxs86("div", { className: "bc-loc-side", children: [
        search && !readOnly && /* @__PURE__ */ jsx96(AddressSearch, { search, disabled, onPick: (h) => setPoint(h, "search") }),
        /* @__PURE__ */ jsxs86("div", { className: "bc-loc-coords", children: [
          /* @__PURE__ */ jsx96(
            NumberField,
            {
              label: "Sz\xE9less\xE9g (lat)",
              help: "\xC9szak\u2013d\xE9l ir\xE1ny\xFA helyzet fokban. Magyarorsz\xE1gon kb. 45,7 \xE9s 48,6 k\xF6z\xF6tt van. Tizedesvessz\u0151vel vagy ponttal is \xEDrhatod.",
              value: draft.lat,
              onChange: (n) => setField("lat", n),
              min: LAT_RANGE.min,
              max: LAT_RANGE.max,
              decimals,
              unit: "\xB0",
              readOnly,
              disabled
            }
          ),
          /* @__PURE__ */ jsx96(
            NumberField,
            {
              label: "Hossz\xFAs\xE1g (lng)",
              help: "Kelet\u2013nyugat ir\xE1ny\xFA helyzet fokban. Magyarorsz\xE1gon kb. 16,1 \xE9s 22,9 k\xF6z\xF6tt van. Tizedesvessz\u0151vel vagy ponttal is \xEDrhatod.",
              value: draft.lng,
              onChange: (n) => setField("lng", n),
              min: LNG_RANGE.min,
              max: LNG_RANGE.max,
              decimals,
              unit: "\xB0",
              readOnly,
              disabled
            }
          )
        ] }),
        geolocation && !readOnly && /* @__PURE__ */ jsxs86("div", { className: "bc-loc-geo", children: [
          /* @__PURE__ */ jsx96(
            Button,
            {
              variant: "secondary",
              busy: gs.status === "locating",
              disabled,
              onClick: () => geo.locate((p) => setPoint(p, "geo")),
              icon: /* @__PURE__ */ jsxs86("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsx96("circle", { cx: "12", cy: "12", r: "4" }),
                /* @__PURE__ */ jsx96("path", { d: "M12 2v4M12 18v4M2 12h4M18 12h4" })
              ] }),
              children: gs.status === "locating" ? "Keresem a helyed\u2026" : "Jelenlegi helyem"
            }
          ),
          gs.status === "found" && /* @__PURE__ */ jsxs86("p", { className: "bc-notice", role: "status", children: [
            "Megvan: ",
            accuracyText(gs.accuracy),
            " pontoss\xE1ggal."
          ] }),
          (gs.status === "denied" || gs.status === "unavailable" || gs.status === "timeout") && /* @__PURE__ */ jsx96("p", { className: "bc-loc-geo-err", role: "alert", "data-geo": gs.status, children: gs.message })
        ] }),
        outside && /* @__PURE__ */ jsxs86("div", { className: "bc-alert is-warning bc-loc-warn", role: "status", children: [
          /* @__PURE__ */ jsx96("p", { children: swapped ? "Ez a pont Magyarorsz\xE1gon k\xEDv\xFCl van \u2013 lehet, hogy felcser\xE9lted a sz\xE9less\xE9get \xE9s a hossz\xFAs\xE1got." : "Ez a pont Magyarorsz\xE1gon k\xEDv\xFCl van. Ha t\xE9nyleg ott a hely, hagyd \xEDgy." }),
          swapped && !locked && /* @__PURE__ */ jsx96(Button, { size: "sm", variant: "secondary", onClick: () => setPoint({ lat: point.lng, lng: point.lat }, "swap"), children: "Felcser\xE9lem" })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx96("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error }),
    /* @__PURE__ */ jsx96("p", { className: "bc-sr", role: "status", children: said })
  ] });
}

// react/src/kieg2/PrizeDrawReveal.tsx
import { useEffect as useEffect32, useRef as useRef43, useState as useState53 } from "react";

// react/src/kieg2/draw.ts
var REVEAL_STEPS = [110, 150, 210, 290, 400, 540];
var STAMP_MS = 400;
var REVEAL_TOTAL_MS = REVEAL_STEPS.reduce((a, b) => a + b, 0) + STAMP_MS;
function cryptoIndex(n) {
  if (!Number.isInteger(n) || n < 1) throw new Error("\xDCres r\xE9sztvev\u0151-lista");
  if (n === 1) return 0;
  const limit = Math.floor(4294967296 / n) * n;
  const buf = new Uint32Array(1);
  for (; ; ) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}
function tickerNames(pool, count) {
  if (!pool.length) return [];
  const stride = pool.length > 7 ? 7 : 1;
  return Array.from({ length: count }, (_, i) => pool[i * stride % pool.length].name);
}
var drawTime = (d) => d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
var wait = (ms) => new Promise((r) => setTimeout(r, ms));

// react/src/kieg2/DrawStage.tsx
import { forwardRef as forwardRef10 } from "react";
import { Fragment as Fragment26, jsx as jsx97, jsxs as jsxs87 } from "react/jsx-runtime";
function DrawSpinner({ step, name: name2, waiting }) {
  return /* @__PURE__ */ jsxs87("div", { className: "bc-draw-stage", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx97(Bee, { szerep: "futar", size: "s", buzz: false, className: "bc-draw-runner" }),
    /* @__PURE__ */ jsx97("div", { className: "bc-draw-comb", children: REVEAL_STEPS.map((_, i) => /* @__PURE__ */ jsx97("i", { className: cx(i <= step && "is-on") }, i)) }),
    /* @__PURE__ */ jsx97("p", { className: "bc-draw-ticker", children: waiting ? /* @__PURE__ */ jsx97(HexLoader, { label: "M\xE9g sorsolunk" }) : name2 }, step)
  ] });
}
var WinnerCard = forwardRef10(function WinnerCard2({ winner, prize, test, attempt, animate }, ref) {
  return /* @__PURE__ */ jsxs87("div", { className: cx("bc-draw-winner", animate && "bc-anim-stamp"), "data-winner": winner.id, children: [
    /* @__PURE__ */ jsx97(Bee, { szerep: "bajnok", size: "m", buzz: animate }),
    /* @__PURE__ */ jsxs87("div", { className: "bc-draw-winner-body", children: [
      /* @__PURE__ */ jsx97("p", { className: "bc-draw-kicker", children: attempt > 1 ? `\xDAj nyertes \u2013 ${attempt}. h\xFAz\xE1s` : /* @__PURE__ */ jsxs87(Fragment26, { children: [
        "Z\xFCmm, megvan! ",
        /* @__PURE__ */ jsx97("span", { children: "Kisorsoltuk a nyertest." })
      ] }) }),
      /* @__PURE__ */ jsx97("h3", { className: "bc-draw-name", ref, tabIndex: -1, children: winner.name }),
      winner.detail && /* @__PURE__ */ jsx97("p", { className: "bc-draw-detail", children: winner.detail }),
      /* @__PURE__ */ jsxs87("p", { className: "bc-draw-prize", children: [
        "Nyerem\xE9ny: ",
        prize
      ] }),
      test && /* @__PURE__ */ jsx97("p", { className: "bc-badge is-warning bc-draw-test", children: "Teszt-sorsol\xE1s \u2013 nem \xE9les eredm\xE9ny" })
    ] })
  ] });
});

// react/src/kieg2/RerollForm.tsx
import { useRef as useRef42, useState as useState52 } from "react";
import { jsx as jsx98, jsxs as jsxs88 } from "react/jsx-runtime";
function RerollForm({ previous, minLength, maxLength = 200, onConfirm, onCancel }) {
  const [reason, setReason] = useState52("");
  const [error, setError] = useState52();
  const form = useRef42(null);
  const area = useRef42(null);
  const submit = (e) => {
    e.preventDefault();
    const r = reason.trim();
    if (r.length < minLength) {
      setError(r.length === 0 ? `\xCDrd le r\xF6viden, mi\xE9rt sorsolsz \xFAjra (legal\xE1bb ${minLength} karakter) \u2013 a jegyz\u0151k\xF6nyvbe ker\xFCl.` : `Legal\xE1bb ${minLength} karakter kell \u2013 most ${r.length}. \xCDrj egy kicsit t\xF6bbet.`);
      shake(form.current);
      area.current?.focus();
      return;
    }
    onConfirm(r);
  };
  return /* @__PURE__ */ jsxs88("form", { ref: form, className: "bc-draw-reroll", onSubmit: submit, noValidate: true, "aria-label": "\xDAjrasorsol\xE1s", children: [
    /* @__PURE__ */ jsxs88("p", { className: "bc-draw-reroll-q", children: [
      "\xDAjrasorsol\xE1s \u2013 ",
      previous,
      " kimarad a k\xF6vetkez\u0151 h\xFAz\xE1sb\xF3l."
    ] }),
    /* @__PURE__ */ jsx98(
      TextArea,
      {
        ref: area,
        label: "Az \xFAjrasorsol\xE1s oka",
        required: true,
        minLength,
        maxLength,
        rows: 2,
        value: reason,
        error,
        help: "Mi\xE9rt kell \xFAj nyertes? Pl. \u201ENem v\xE1laszolt 7 napig\u201D, \u201ELemondott a nyerem\xE9nyr\u0151l\u201D. A jegyz\u0151k\xF6nyvbe ker\xFCl, a nyertes nem l\xE1tja.",
        onChange: (e) => {
          setReason(e.target.value);
          if (error) setError(void 0);
        }
      }
    ),
    /* @__PURE__ */ jsxs88("div", { className: "bc-draw-actions", children: [
      /* @__PURE__ */ jsx98(Button, { type: "submit", children: "\xDAjrasorsolom" }),
      /* @__PURE__ */ jsx98(Button, { variant: "ghost", onClick: onCancel, children: "M\xE9gse" })
    ] })
  ] });
}

// react/src/kieg2/PrizeDrawReveal.tsx
import { Fragment as Fragment27, jsx as jsx99, jsxs as jsxs89 } from "react/jsx-runtime";
function PrizeDrawReveal({ prize, participants, draw, onDrawn, onReroll, excludePrevious = true, minReasonLength = 5, loading, className }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState53("ready");
  const [step, setStep] = useState53(-1);
  const [names, setNames] = useState53([]);
  const [log, setLog] = useState53([]);
  const [error, setError] = useState53();
  const [animated, setAnimated] = useState53(false);
  const alive = useRef43(true);
  const heading = useRef43(null);
  useEffect32(() => () => {
    alive.current = false;
  }, []);
  const last = log[log.length - 1];
  const used = new Set(excludePrevious ? log.map((r) => r.winner.id) : []);
  const pool = participants.filter((p) => !used.has(p.id));
  const test = !draw;
  useEffect32(() => {
    if (phase !== "won") return;
    heading.current?.focus();
    if (animated) celebrate(heading.current);
  }, [phase, animated, log.length]);
  const run = async (from, reason) => {
    if (!from.length) return;
    setError(void 0);
    setPhase("spinning");
    const instant = reduce || from.length === 1;
    const result = Promise.resolve().then(() => draw ? draw(from) : from[cryptoIndex(from.length)]);
    result.catch(() => void 0);
    if (!instant) {
      setNames(tickerNames(from, REVEAL_STEPS.length));
      for (let i = 0; i < REVEAL_STEPS.length; i++) {
        if (!alive.current) return;
        setStep(i);
        await wait(REVEAL_STEPS[i]);
      }
      setStep(REVEAL_STEPS.length);
    }
    let w;
    try {
      w = await result;
    } catch {
      if (alive.current) {
        setPhase("error");
        setError("Nem siker\xFClt a sorsol\xE1s \u2013 senki nem nyert, a r\xE9sztvev\u0151k nem v\xE1ltoztak. Pr\xF3b\xE1ld \xFAjra.");
      }
      return;
    }
    if (!alive.current) return;
    if (!from.some((p) => p.id === w.id)) {
      setPhase("error");
      setError("A sorsol\xF3 olyan nyertest adott, aki nincs a h\xFAzhat\xF3 r\xE9sztvev\u0151k k\xF6z\xF6tt \u2013 nem fogadtam el. Sz\xF3lj a fejleszt\u0151nek.");
      return;
    }
    const rec = { winner: w, at: /* @__PURE__ */ new Date(), attempt: log.length + 1, reason, test, poolSize: from.length };
    setLog((l) => [...l, rec]);
    setAnimated(!instant);
    setStep(-1);
    setPhase("won");
    onDrawn?.(rec);
  };
  const n = participants.length;
  return /* @__PURE__ */ jsxs89("section", { className: cx("bc-draw", className), "aria-label": `Sorsol\xE1s: ${prize}`, children: [
    /* @__PURE__ */ jsxs89("header", { className: "bc-draw-head", children: [
      /* @__PURE__ */ jsxs89("div", { children: [
        /* @__PURE__ */ jsx99("p", { className: "bc-draw-prize-label", children: "Nyerem\xE9ny" }),
        /* @__PURE__ */ jsx99("h2", { className: "bc-draw-title", children: prize })
      ] }),
      /* @__PURE__ */ jsx99("p", { className: "bc-draw-count", "data-count": n, children: loading ? /* @__PURE__ */ jsx99(HexLoader, { label: "T\xF6lt\xF6m a r\xE9sztvev\u0151ket" }) : /* @__PURE__ */ jsxs89(Fragment27, { children: [
        /* @__PURE__ */ jsx99("b", { children: formatHu(n, 0) }),
        " r\xE9sztvev\u0151"
      ] }) })
    ] }),
    test && /* @__PURE__ */ jsx99("p", { className: "bc-alert is-warning bc-draw-testnote", role: "note", children: /* @__PURE__ */ jsxs89("span", { children: [
      /* @__PURE__ */ jsx99("b", { children: "Teszt-sorsol\xE1s:" }),
      " nincs bek\xF6tve a sorsol\xF3, ez\xE9rt a b\xF6ng\xE9sz\u0151 v\xE9letlenje h\xFAz. \xC9les nyertest \xEDgy ne hirdess."
    ] }) }),
    !loading && n === 0 && /* @__PURE__ */ jsx99(BeeMoment, { inline: true, szerep: "piheno", poen: "M\xE9g nem z\xFCmm\xF6g itt senki.", sima: "M\xE9g nincs r\xE9sztvev\u0151 \u2013 ha valaki jelentkezik, itt sorsolhatsz." }),
    !loading && n === 1 && phase === "ready" && /* @__PURE__ */ jsx99("p", { className: "bc-notice bc-draw-one", role: "note", children: "Egy r\xE9sztvev\u0151 van, ez\xE9rt a sorsol\xE1s biztosan \u0151t adja (felfed\xE9s n\xE9lk\xFCl)." }),
    phase === "spinning" && /* @__PURE__ */ jsx99(DrawSpinner, { step, name: names[Math.min(Math.max(step, 0), names.length - 1)] ?? "", waiting: step >= REVEAL_STEPS.length }),
    (phase === "won" || phase === "reason") && last && /* @__PURE__ */ jsx99(WinnerCard, { ref: heading, winner: last.winner, prize, test: last.test, attempt: last.attempt, animate: animated }),
    phase === "error" && /* @__PURE__ */ jsx99("p", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx99("span", { children: error }) }),
    /* @__PURE__ */ jsx99("p", { className: "bc-sr", role: "status", children: phase === "spinning" ? "Sorsol\xE1s folyamatban\u2026" : phase === "won" && last ? `A nyertes: ${last.winner.name}` : "" }),
    phase === "reason" && last && /* @__PURE__ */ jsx99(
      RerollForm,
      {
        previous: last.winner.name,
        minLength: minReasonLength,
        onCancel: () => setPhase("won"),
        onConfirm: (reason) => {
          onReroll?.({ previous: last.winner, reason });
          void run(pool, reason);
        }
      }
    ),
    phase !== "reason" && /* @__PURE__ */ jsxs89("div", { className: "bc-draw-actions", children: [
      (phase === "ready" || phase === "spinning" || phase === "error" && !last) && /* @__PURE__ */ jsx99(Button, { size: "lg", busy: phase === "spinning", disabled: loading || n === 0, onClick: () => void run(pool), children: phase === "error" ? "\xDAjrapr\xF3b\xE1l\xE1s" : "Sorsol\xE1s" }),
      (phase === "won" || phase === "error" && last) && /* @__PURE__ */ jsx99(Button, { variant: "secondary", disabled: pool.length === 0, onClick: () => setPhase("reason"), children: "\xDAjrasorsol\xE1s" }),
      phase === "won" && pool.length === 0 && /* @__PURE__ */ jsx99("p", { className: "bc-draw-hint", children: "Nincs t\xF6bb h\xFAzhat\xF3 r\xE9sztvev\u0151 \u2013 \xFAjrasorsolni nem lehet." }),
      n === 0 && !loading && /* @__PURE__ */ jsx99("p", { className: "bc-draw-hint", children: "A \u201ESorsol\xE1s\u201D az els\u0151 r\xE9sztvev\u0151vel v\xE1lik el\xE9rhet\u0151v\xE9." })
    ] }),
    log.length > 0 && /* @__PURE__ */ jsxs89("details", { className: "bc-draw-log", open: log.length > 1, children: [
      /* @__PURE__ */ jsxs89("summary", { children: [
        "Jegyz\u0151k\xF6nyv (",
        log.length,
        " h\xFAz\xE1s)"
      ] }),
      /* @__PURE__ */ jsx99("ol", { children: log.map((r) => /* @__PURE__ */ jsxs89("li", { children: [
        /* @__PURE__ */ jsx99("b", { children: r.winner.name }),
        " \u2013 ",
        drawTime(r.at),
        ", ",
        formatHu(r.poolSize, 0),
        " r\xE9sztvev\u0151b\u0151l",
        r.test ? " (teszt-sorsol\xE1s)" : "",
        r.reason && /* @__PURE__ */ jsxs89(Fragment27, { children: [
          " \xB7 \xFAjrasorsol\xE1s oka: \u201E",
          r.reason,
          "\u201D"
        ] })
      ] }, r.attempt)) })
    ] })
  ] });
}

// react/src/kieg2/VideoPlayer.tsx
import { useRef as useRef44, useState as useState54 } from "react";
import { Fragment as Fragment28, jsx as jsx100, jsxs as jsxs90 } from "react/jsx-runtime";
var ERR = {
  2: "A vide\xF3 nem t\xF6lt\u0151d\xF6tt le (h\xE1l\xF3zati hiba). Ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra.",
  3: "A vide\xF3f\xE1jl s\xE9r\xFClt, nem lehet lej\xE1tszani. T\xF6ltsd fel \xFAjra.",
  4: "Ezt a vide\xF3t a b\xF6ng\xE9sz\u0151 nem tudja lej\xE1tszani (rossz vagy nem t\xE1mogatott form\xE1tum). MP4 (H.264) vagy WebM f\xE1jlt t\xF6lts fel."
};
var SEEK = 5;
function VideoPlayer({ title, src, poster, captions = [], warnNoCaptions = true, onError, className }) {
  const video = useRef44(null);
  const [state, setState] = useState54("loading");
  const [code, setCode] = useState54(0);
  const [attempt, setAttempt] = useState54(0);
  const [said, setSaid] = useState54("");
  const onKey = (e) => {
    const v = e.currentTarget;
    const k = e.key.toLowerCase();
    if (k === "k") {
      if (v.paused) void v.play().catch(() => void 0);
      else v.pause();
    } else if (k === "arrowleft" || k === "arrowright") {
      v.currentTime = Math.max(0, v.currentTime + (k === "arrowleft" ? -SEEK : SEEK));
      setSaid(`${k === "arrowleft" ? "Vissza" : "El\u0151re"} ${SEEK} m\xE1sodperc`);
    } else if (k === "m") {
      v.muted = !v.muted;
      setSaid(v.muted ? "N\xE9m\xEDtva" : "Hang bekapcsolva");
    } else return;
    e.preventDefault();
  };
  const showLoading = !src || state === "loading";
  return /* @__PURE__ */ jsxs90("figure", { className: cx("bc-video", className), "data-state": src ? state : "loading", children: [
    /* @__PURE__ */ jsx100("div", { className: "bc-video-frame", children: state === "error" ? /* @__PURE__ */ jsx100(
      BeeMoment,
      {
        inline: true,
        live: "alert",
        szerep: "gondolkodo",
        sima: ERR[code] ?? "A vide\xF3 nem j\xE1tszhat\xF3 le. Pr\xF3b\xE1ld \xFAjra, vagy t\xF6ltsd fel \xFAjra a f\xE1jlt.",
        action: /* @__PURE__ */ jsx100(Button, { variant: "secondary", size: "sm", onClick: () => {
          setState("loading");
          setAttempt((n) => n + 1);
        }, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
      }
    ) : /* @__PURE__ */ jsxs90(Fragment28, { children: [
      src && /* @__PURE__ */ jsx100(
        "video",
        {
          ref: video,
          className: "bc-video-el",
          controls: true,
          preload: "metadata",
          playsInline: true,
          tabIndex: 0,
          poster,
          src,
          "aria-label": title,
          onLoadedMetadata: () => setState("ready"),
          onCanPlay: () => setState("ready"),
          onPlay: () => setSaid("Lej\xE1tsz\xE1s"),
          onPause: () => setSaid("Sz\xFCnet"),
          onError: (e) => {
            const c = e.currentTarget.error?.code ?? 0;
            setCode(c);
            setState("error");
            onError?.(c);
          },
          onKeyDown: onKey,
          children: captions.map((t) => /* @__PURE__ */ jsx100("track", { kind: "captions", src: t.src, srcLang: t.srclang, label: t.label, default: t.default }, t.src))
        },
        `${src}#${attempt}`
      ),
      showLoading && /* @__PURE__ */ jsxs90("div", { className: "bc-video-loading", role: "status", children: [
        /* @__PURE__ */ jsx100(HexLoader, { label: "T\xF6lt\xF6m a vide\xF3t" }),
        /* @__PURE__ */ jsx100("span", { children: "T\xF6lt\xF6m a vide\xF3t\u2026" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs90("figcaption", { className: "bc-video-cap", children: [
      /* @__PURE__ */ jsx100("span", { className: "bc-video-title", children: title }),
      src && state !== "error" && /* @__PURE__ */ jsx100("span", { className: "bc-video-keys", children: "Billenty\u0171k: Sz\xF3k\xF6z vagy K \u2013 lej\xE1tsz\xE1s/sz\xFCnet \xB7 \u2190/\u2192 \u2013 5 mp \xB7 M \u2013 n\xE9m\xEDt\xE1s" }),
      warnNoCaptions && !captions.length && state !== "error" && /* @__PURE__ */ jsx100("span", { className: "bc-video-nocc", children: "Ehhez a vide\xF3hoz nincs felirat \u2013 t\xF6lts fel egy .vtt feliratf\xE1jlt, hogy hang n\xE9lk\xFCl is \xE9rthet\u0151 legyen." })
    ] }),
    /* @__PURE__ */ jsx100("p", { className: "bc-sr", role: "status", children: said })
  ] });
}

// react/src/kieg2/VideoEmbed.tsx
import { useEffect as useEffect33, useRef as useRef45, useState as useState55 } from "react";

// react/src/kieg2/videoUrl.ts
var FILE_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
var YT_ID = /^[A-Za-z0-9_-]{11}$/;
var VIDEO_URL_MSG = {
  "not-url": "Ez nem link. M\xE1sold be a teljes c\xEDmet, pl. https://youtu.be/\u2026 vagy https://vimeo.com/\u2026",
  unsupported: "Ezt a linket nem tudom lej\xE1tszani. YouTube-, Vimeo- vagy MP4/WebM-vide\xF3linket adj meg.",
  "bad-id": "A link hi\xE1nyos: nincs benne a vide\xF3 azonos\xEDt\xF3ja. M\xE1sold ki \xFAjra a vide\xF3 \u201EMegoszt\xE1s\u201D gombj\xE1val.",
  insecure: "Csak biztons\xE1gos (https://) linket tudok be\xE1gyazni. \xCDrd \xE1t a link elej\xE9t https://-re."
};
var bad = (reason) => ({ kind: "invalid", reason, message: VIDEO_URL_MSG[reason] });
function startSeconds(u) {
  const t = u.searchParams.get("start") ?? u.searchParams.get("t");
  if (!t) return void 0;
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t);
  if (!m) return void 0;
  const s = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return s > 0 ? s : void 0;
}
function parseVideoUrl(input) {
  const raw = input.trim();
  if (!raw) return { kind: "empty" };
  if (/^(blob:|data:video\/)/i.test(raw)) return { kind: "file", url: raw };
  let u;
  try {
    u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return bad("not-url");
  }
  if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) return bad("not-url");
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  if (["youtube.com", "youtu.be", "youtube-nocookie.com", "music.youtube.com"].includes(host)) {
    const parts = u.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] : u.searchParams.get("v") ?? (["embed", "shorts", "live", "v"].includes(parts[0]) ? parts[1] : void 0);
    if (!id || !YT_ID.test(id)) return bad("bad-id");
    const start = startSeconds(u);
    return {
      kind: "youtube",
      id,
      provider: "YouTube",
      watchUrl: `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start ? `&start=${start}` : ""}`
    };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean).find((p) => /^\d{6,12}$/.test(p));
    if (!id) return bad("bad-id");
    return { kind: "vimeo", id, provider: "Vimeo", watchUrl: `https://vimeo.com/${id}`, embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` };
  }
  if (FILE_EXT.test(u.pathname)) return u.protocol === "https:" || ["localhost", "127.0.0.1"].includes(u.hostname) ? { kind: "file", url: u.href } : bad("insecure");
  return bad("unsupported");
}

// react/src/kieg2/VideoEmbed.tsx
import { Fragment as Fragment29, jsx as jsx101, jsxs as jsxs91 } from "react/jsx-runtime";
function VideoEmbed({ source, title, className }) {
  const [on, setOn] = useState55(false);
  const [loaded, setLoaded] = useState55(false);
  const [slow, setSlow] = useState55(false);
  const frame = useRef45(null);
  useEffect33(() => {
    setOn(false);
    setLoaded(false);
    setSlow(false);
  }, [source.embedUrl]);
  useEffect33(() => {
    if (!on || loaded) return;
    frame.current?.focus();
    const t = setTimeout(() => setSlow(true), 15e3);
    return () => clearTimeout(t);
  }, [on, loaded]);
  return /* @__PURE__ */ jsxs91("figure", { className: cx("bc-video", "bc-vembed", className), "data-provider": source.kind, "data-state": on ? loaded ? "ready" : "loading" : "placeholder", children: [
    /* @__PURE__ */ jsx101("div", { className: "bc-video-frame", children: on ? /* @__PURE__ */ jsxs91(Fragment29, { children: [
      /* @__PURE__ */ jsx101(
        "iframe",
        {
          ref: frame,
          className: "bc-video-el",
          src: source.embedUrl,
          title: `${title} \u2013 ${source.provider}-vide\xF3`,
          onLoad: () => setLoaded(true),
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowFullScreen: true,
          referrerPolicy: "strict-origin-when-cross-origin"
        }
      ),
      !loaded && /* @__PURE__ */ jsxs91("div", { className: "bc-video-loading", role: "status", children: [
        /* @__PURE__ */ jsx101(HexLoader, { label: "T\xF6lt\xF6m a lej\xE1tsz\xF3t" }),
        /* @__PURE__ */ jsx101("span", { children: slow ? "Lassan t\xF6lt a lej\xE1tsz\xF3." : `T\xF6lt\xF6m a ${source.provider} lej\xE1tsz\xF3j\xE1t\u2026` }),
        slow && /* @__PURE__ */ jsxs91("a", { className: "bc-btn is-secondary is-sm", href: source.watchUrl, target: "_blank", rel: "noopener noreferrer", children: [
          "Megnyit\xE1s: ",
          source.provider
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs91("div", { className: "bc-vembed-ph", children: [
      /* @__PURE__ */ jsx101("span", { className: "bc-badge is-muted", children: source.provider }),
      /* @__PURE__ */ jsx101(
        Button,
        {
          size: "lg",
          onClick: () => setOn(true),
          "aria-describedby": `vembed-${source.id}`,
          icon: /* @__PURE__ */ jsx101("svg", { viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: /* @__PURE__ */ jsx101("path", { d: "M8 5v14l11-7z", fill: "currentColor" }) }),
          children: "Vide\xF3 bet\xF6lt\xE9se"
        }
      ),
      /* @__PURE__ */ jsxs91("p", { className: "bc-vembed-note", id: `vembed-${source.id}`, children: [
        "Kattint\xE1sra a ",
        source.provider,
        " lej\xE1tsz\xF3ja t\xF6lt\u0151dik be, \xE9s a ",
        source.provider,
        " ekkor adatot (pl. s\xFCtit) t\xE1rolhat a g\xE9peden."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs91("figcaption", { className: "bc-video-cap", children: [
      /* @__PURE__ */ jsx101("span", { className: "bc-video-title", children: title }),
      /* @__PURE__ */ jsxs91("a", { className: "bc-video-link", href: source.watchUrl, target: "_blank", rel: "noopener noreferrer", children: [
        "Megnyit\xE1s a ",
        source.provider,
        " oldal\xE1n",
        /* @__PURE__ */ jsx101("span", { className: "bc-sr", children: " (\xFAj lapon)" })
      ] })
    ] })
  ] });
}
function VideoPreview({ url, title, poster, captions, className }) {
  const s = parseVideoUrl(url);
  if (s.kind === "empty") return /* @__PURE__ */ jsx101("p", { className: cx("bc-video-empty", className), children: "M\xE9g nincs vide\xF3 \u2013 illeszd be a linket (YouTube, Vimeo vagy MP4/WebM)." });
  if (s.kind === "invalid") return /* @__PURE__ */ jsx101("p", { className: cx("bc-alert is-warning", className), role: "alert", "data-reason": s.reason, children: /* @__PURE__ */ jsx101("span", { children: s.message }) });
  if (s.kind === "file") return /* @__PURE__ */ jsx101(VideoPlayer, { title, src: s.url, poster, captions, className });
  return /* @__PURE__ */ jsx101(VideoEmbed, { source: s, title, className });
}

// react/src/sablon/Frame.tsx
import { useId as useId23 } from "react";
import { Fragment as Fragment30, jsx as jsx102, jsxs as jsxs92 } from "react/jsx-runtime";
function SablonFrame({ kind, standalone, skipLabel = "Ugr\xE1s a tartalomra", className, busy, children }) {
  const id = `bc-sablon-${useId23().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const body = /* @__PURE__ */ jsx102("div", { className: cx("bc-sablon", `is-${kind}`, className), "data-sablon": kind, "aria-busy": busy || void 0, children });
  if (!standalone) return body;
  return /* @__PURE__ */ jsxs92(Fragment30, { children: [
    /* @__PURE__ */ jsx102("a", { className: "bc-skip", href: `#${id}`, children: skipLabel }),
    /* @__PURE__ */ jsx102("main", { id, className: "bc-sablon-main", tabIndex: -1, children: body })
  ] });
}
function useTemplateTitle(title, docTitle, suffix, loading) {
  const text = docTitle ?? (typeof title === "string" ? title : null);
  usePageTitle(loading ? null : text, suffix);
}

// react/src/sablon/ListPage.tsx
import { useCallback as useCallback7 } from "react";
import { Fragment as Fragment31, jsx as jsx103, jsxs as jsxs93 } from "react/jsx-runtime";
function ListPage(p) {
  const { title, description, breadcrumbs, renderLink, primaryAction, actions, filters, status = "ready", what = "a list\xE1t", detail } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix);
  const showFilters = filters && status !== "empty" && status !== "forbidden";
  const head = actions || primaryAction ? /* @__PURE__ */ jsxs93(Fragment31, { children: [
    actions,
    primaryAction
  ] }) : void 0;
  let body;
  if (status === "empty") {
    body = /* @__PURE__ */ jsx103("div", { className: "bc-card bc-sablon-state", children: /* @__PURE__ */ jsx103(BeeMoment, { pillanat: "ures", sima: p.emptyText, action: p.emptyAction }) });
  } else if (status === "no-results") {
    body = /* @__PURE__ */ jsx103("div", { className: "bc-card bc-sablon-state", children: /* @__PURE__ */ jsx103(
      BeeMoment,
      {
        pillanat: "nincs-talalat",
        action: p.onClearFilters && /* @__PURE__ */ jsx103(Button, { variant: "secondary", onClick: p.onClearFilters, children: "Sz\u0171r\u0151k t\xF6rl\xE9se" })
      }
    ) });
  } else {
    body = /* @__PURE__ */ jsx103(DataState, { status, what, error: p.error, onRetry: p.onRetry, retrying: p.retrying, skeleton: p.skeleton, children: p.children });
  }
  return /* @__PURE__ */ jsxs93(SablonFrame, { kind: "lista", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, busy: status === "loading", children: [
    /* @__PURE__ */ jsx103(PageHeader, { title, description, breadcrumbs, renderLink, actions: head }),
    showFilters && /* @__PURE__ */ jsx103("div", { className: "bc-sablon-filters", children: filters }),
    /* @__PURE__ */ jsx103("div", { className: "bc-sablon-list", children: body }),
    detail && /* @__PURE__ */ jsx103(
      Drawer,
      {
        open: detail.open,
        onOpenChange: (o) => {
          if (!o) detail.onClose();
        },
        title: detail.title,
        description: detail.description,
        footer: detail.footer,
        size: detail.size,
        dirty: detail.dirty,
        busy: detail.busy,
        children: detail.children
      }
    )
  ] });
}
function useDetailParam(name2 = "reszlet") {
  const [id, set] = useQueryParam(name2);
  const open = useCallback7((next) => set(next), [set]);
  const close = useCallback7(() => set(null), [set]);
  return { id, open, close };
}

// react/src/sablon/DetailActions.tsx
import { useState as useState56 } from "react";
import { Fragment as Fragment32, jsx as jsx104, jsxs as jsxs94 } from "react/jsx-runtime";
function DetailActions({ actions, subject }) {
  const [pending, setPending] = useState56(null);
  const [open, setOpen] = useState56(false);
  const run = (a) => {
    if (a.confirm) {
      setPending(a);
      setOpen(true);
      return;
    }
    void a.onSelect();
  };
  const main = actions.find((a) => a.primary) ?? actions.find((a) => !a.danger);
  const rest = actions.filter((a) => a !== main);
  const safe = rest.filter((a) => !a.danger), risky = rest.filter((a) => a.danger);
  const entry = (a) => ({
    label: a.confirm && !a.label.endsWith("\u2026") ? `${a.label}\u2026` : a.label,
    icon: a.icon,
    danger: a.danger,
    disabled: a.disabled,
    disabledReason: a.disabledReason,
    onSelect: () => run(a)
  });
  const items = [...safe.map(entry), ...safe.length && risky.length ? ["separator"] : [], ...risky.map(entry)];
  return /* @__PURE__ */ jsxs94(Fragment32, { children: [
    main && /* @__PURE__ */ jsx104(
      Button,
      {
        variant: main.danger ? "danger" : "primary",
        icon: main.icon,
        disabled: main.disabled,
        title: main.disabled ? main.disabledReason : void 0,
        onClick: () => run(main),
        children: main.label
      }
    ),
    items.length > 0 && /* @__PURE__ */ jsx104(
      DropdownMenu,
      {
        items,
        label: `M\u0171veletek: ${subject}`,
        trigger: /* @__PURE__ */ jsx104(IconButton, { "aria-label": `Tov\xE1bbi m\u0171veletek: ${subject}`, children: /* @__PURE__ */ jsx104(MoreIcon, {}) })
      }
    ),
    pending?.confirm && /* @__PURE__ */ jsx104(
      ConfirmDialog,
      {
        open,
        onOpenChange: setOpen,
        title: pending.confirm.title,
        confirmLabel: pending.confirm.confirmLabel,
        danger: pending.danger,
        onConfirm: pending.onSelect,
        children: pending.confirm.body
      }
    )
  ] });
}

// react/src/sablon/DetailPage.tsx
import { jsx as jsx105, jsxs as jsxs95 } from "react/jsx-runtime";
function DetailPage(p) {
  const { title, description, breadcrumbs, renderLink, status = "ready", actions, summary, tabs, side } = p;
  const loading = status === "loading";
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, loading);
  const subject = p.subject ?? (typeof title === "string" ? title : "elem");
  const head = status === "ready" && actions?.length ? /* @__PURE__ */ jsx105(DetailActions, { actions, subject }) : void 0;
  return /* @__PURE__ */ jsxs95(SablonFrame, { kind: "reszletek", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, busy: loading, children: [
    /* @__PURE__ */ jsx105(
      PageHeader,
      {
        title,
        description: status === "ready" ? description : void 0,
        breadcrumbs,
        renderLink,
        actions: head,
        loading
      }
    ),
    /* @__PURE__ */ jsx105(
      DataState,
      {
        status,
        what: p.what ?? "az adatokat",
        error: p.error,
        onRetry: p.onRetry,
        skeleton: /* @__PURE__ */ jsxs95("div", { className: "bc-sablon-skel", children: [
          /* @__PURE__ */ jsx105("span", { className: "bc-skeleton" }),
          /* @__PURE__ */ jsx105("span", { className: "bc-skeleton" }),
          /* @__PURE__ */ jsx105("span", { className: "bc-skeleton" })
        ] }),
        children: /* @__PURE__ */ jsxs95("div", { className: cx("bc-sablon-cols", Boolean(side) && "has-side"), children: [
          /* @__PURE__ */ jsxs95("div", { className: "bc-sablon-primary", children: [
            summary && /* @__PURE__ */ jsx105("section", { className: "bc-card bc-sablon-summary-block", "aria-label": "\xD6sszegz\xE9s", children: summary }),
            tabs && tabs.length > 0 && /* @__PURE__ */ jsx105(Tabs, { items: tabs, label: p.tabsLabel ?? `${subject} r\xE9szei`, value: p.tab, onValueChange: p.onTabChange }),
            p.children
          ] }),
          side && /* @__PURE__ */ jsx105("aside", { className: "bc-sablon-side", "aria-label": p.sideLabel ?? "Adatok \xE9s tev\xE9kenys\xE9g", children: side })
        ] })
      }
    )
  ] });
}

// react/src/sablon/EditPage.tsx
import { useEffect as useEffect35, useId as useId25, useRef as useRef47, useState as useState57 } from "react";

// react/src/sablon/ErrorSummary.tsx
import { forwardRef as forwardRef11, useEffect as useEffect34, useId as useId24, useRef as useRef46 } from "react";
import { jsx as jsx106, jsxs as jsxs96 } from "react/jsx-runtime";
function findField(form, name2) {
  if (!form) return null;
  const byName = form.querySelector(`[name="${CSS.escape(name2)}"]`);
  return byName ?? form.querySelector(`#${CSS.escape(name2)}`);
}
var ErrorSummary = forwardRef11(function ErrorSummary2({ errors, general, form }, ref) {
  const id = useId24();
  const n = errors.length;
  const jump = (e, name2) => {
    const el = findField(form.current, name2);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  };
  return /* @__PURE__ */ jsxs96("div", { ref, className: "bc-alert is-danger bc-sablon-summary", tabIndex: -1, "aria-labelledby": `${id}-t`, children: [
    /* @__PURE__ */ jsxs96("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx106("circle", { cx: "12", cy: "12", r: "10", strokeWidth: "2" }),
      /* @__PURE__ */ jsx106("path", { d: "M12 7v6M12 16.5v.5" })
    ] }),
    /* @__PURE__ */ jsxs96("div", { children: [
      /* @__PURE__ */ jsx106("h2", { id: `${id}-t`, className: "bc-sablon-summary-title", children: n ? `Nem mentettem \u2013 ${n === 1 ? "egy mez\u0151t" : `${n} mez\u0151t`} jav\xEDts ki:` : "Nem siker\xFClt menteni." }),
      general && /* @__PURE__ */ jsx106("p", { children: general }),
      n > 0 && /* @__PURE__ */ jsx106("ul", { className: "bc-sablon-summary-list", children: errors.map((er) => /* @__PURE__ */ jsx106("li", { children: /* @__PURE__ */ jsxs96("a", { href: `#${er.name}`, onClick: (e) => jump(e, er.name), children: [
        er.label ? `${er.label}: ` : "",
        er.message
      ] }) }, er.name)) })
    ] })
  ] });
});
function useLinkGuard(dirty, confirm) {
  const bypass = useRef46(false);
  useEffect34(() => {
    if (!dirty) return;
    const h = (e) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.closest("dialog, [role=dialog], [role=alertdialog], [data-unsaved-ignore]")) return;
      const href = a.getAttribute("href") ?? "";
      if (a.target && a.target !== "_self" || a.hasAttribute("download") || href.startsWith("#") || href.startsWith("javascript:")) return;
      e.preventDefault();
      e.stopPropagation();
      confirm(() => {
        bypass.current = true;
        a.click();
        bypass.current = false;
      });
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [dirty, confirm]);
}

// react/src/sablon/EditPage.tsx
import { jsx as jsx107, jsxs as jsxs97 } from "react/jsx-runtime";
function EditPage(p) {
  const { title, description, breadcrumbs, renderLink = defaultLink, status = "ready", dirty, validate, preview } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, status === "loading");
  const pid = useId25();
  const form = useRef47(null);
  const summary = useRef47(null);
  const [busy, setBusy] = useState57(false);
  const [done, setDone] = useState57(false);
  const [saved, setSaved] = useState57(false);
  const [attempted, setAttempted] = useState57(false);
  const [server, setServer] = useState57([]);
  const [general, setGeneral] = useState57();
  const [failed, setFailed] = useState57(0);
  const guard = useUnsavedChanges(dirty && !busy);
  useLinkGuard(dirty && !busy, guard.confirm);
  useEffect35(() => {
    if (dirty) setSaved(false);
  }, [dirty]);
  useEffect35(() => {
    if (failed) {
      summary.current?.focus();
      shake(summary.current);
    }
  }, [failed]);
  useEffect35(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1500);
    return () => clearTimeout(t);
  }, [done]);
  const live = attempted && validate ? validate() : [];
  const names = new Set(live.map((e) => e.name));
  const errors = [...live, ...server.filter((e) => !names.has(e.name))];
  const errorOf = (name2) => errors.find((e) => e.name === name2)?.message;
  const fail = () => setFailed((n) => n + 1);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setServer([]);
    setGeneral(void 0);
    setSaved(false);
    setAttempted(true);
    if (validate?.().length) {
      fail();
      return;
    }
    setBusy(true);
    try {
      const r = await p.onSubmit();
      setBusy(false);
      if (Array.isArray(r) && r.length) {
        setServer(r);
        fail();
        return;
      }
      setAttempted(false);
      setDone(true);
      if (p.savedMoment !== false) setSaved(true);
      notify.success(p.successMessage ?? "Mentve.");
    } catch (err) {
      setBusy(false);
      setGeneral(`${err instanceof Error && err.message ? err.message : "A szerver nem v\xE1laszolt"}. A m\xF3dos\xEDt\xE1said megvannak \u2013 pr\xF3b\xE1ld \xFAjra.`);
      fail();
    }
  };
  const cancelLabel = p.cancelLabel ?? "M\xE9gse";
  const cancel = p.cancelHref ? renderLink({ href: p.cancelHref, className: "bc-btn is-secondary", children: cancelLabel }) : p.onCancel && /* @__PURE__ */ jsx107(Button, { variant: "secondary", disabled: busy, onClick: () => guard.confirm(p.onCancel), children: cancelLabel });
  const showSummary = (errors.length > 0 || general) && (attempted || server.length > 0 || general);
  return /* @__PURE__ */ jsxs97(SablonFrame, { kind: "szerkeszto", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, busy: status === "loading", children: [
    /* @__PURE__ */ jsx107(PageHeader, { title, description, breadcrumbs, renderLink, loading: status === "loading" }),
    /* @__PURE__ */ jsx107(DataState, { status, what: p.what ?? "az \u0171rlapot", error: p.error, onRetry: p.onRetry, children: /* @__PURE__ */ jsxs97("div", { className: cx("bc-sablon-cols", Boolean(preview) && "has-preview"), children: [
      /* @__PURE__ */ jsxs97("form", { ref: form, className: "bc-sablon-form", noValidate: true, onSubmit: (e) => void submit(e), "aria-busy": busy || void 0, children: [
        showSummary && /* @__PURE__ */ jsx107(ErrorSummary, { ref: summary, errors, general, form }),
        typeof p.children === "function" ? p.children({ errorOf, submitting: busy }) : p.children,
        /* @__PURE__ */ jsxs97("div", { className: "bc-sablon-bar", children: [
          /* @__PURE__ */ jsx107("div", { className: "bc-sablon-bar-note", children: saved && !dirty ? /* @__PURE__ */ jsx107(BeeMoment, { inline: true, pillanat: "mentve" }) : dirty ? /* @__PURE__ */ jsxs97("p", { className: "bc-sablon-dirty", children: [
            /* @__PURE__ */ jsx107("span", { className: "bc-sablon-dot", "aria-hidden": "true" }),
            "Nem mentett v\xE1ltoz\xE1sok"
          ] }) : null }),
          /* @__PURE__ */ jsxs97(FormActions, { children: [
            cancel,
            /* @__PURE__ */ jsx107(Button, { type: "submit", busy, done, icon: p.submitIcon ?? /* @__PURE__ */ jsx107(IcSave, {}), children: p.submitLabel ?? "Ment\xE9s" })
          ] })
        ] })
      ] }),
      preview && /* @__PURE__ */ jsxs97("aside", { className: "bc-sablon-preview", "aria-labelledby": `${pid}-pv`, children: [
        /* @__PURE__ */ jsx107("h2", { id: `${pid}-pv`, className: "bc-sablon-aside-title", children: p.previewLabel ?? "El\u0151n\xE9zet" }),
        preview
      ] })
    ] }) }),
    guard.dialog
  ] });
}

// react/src/sablon/Dashboard.tsx
import { useId as useId26, useRef as useRef48 } from "react";
import { jsx as jsx108, jsxs as jsxs98 } from "react/jsx-runtime";
function Dashboard(p) {
  const { title, description, breadcrumbs, renderLink, status = "ready", stats, charts } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix);
  const id = useId26();
  return /* @__PURE__ */ jsxs98(SablonFrame, { kind: "iranyitopult", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, children: [
    /* @__PURE__ */ jsx108(PageHeader, { title, description, breadcrumbs, renderLink, actions: p.actions }),
    (p.period || p.toolbar) && status === "ready" && /* @__PURE__ */ jsxs98("div", { className: "bc-sablon-toolbar", children: [
      p.period,
      p.toolbar
    ] }),
    /* @__PURE__ */ jsxs98(DataState, { status, what: p.what ?? "az ir\xE1ny\xEDt\xF3pultot", error: p.error, onRetry: p.onRetry, children: [
      p.moment && /* @__PURE__ */ jsx108("div", { className: "bc-card bc-sablon-moment", children: /* @__PURE__ */ jsx108(BeeMoment, { inline: true, ...p.moment }) }),
      stats && stats.length > 0 && /* @__PURE__ */ jsxs98("section", { "aria-labelledby": `${id}-s`, children: [
        /* @__PURE__ */ jsx108("h2", { id: `${id}-s`, className: "bc-sr", children: p.statsTitle ?? "F\u0151 sz\xE1mok" }),
        /* @__PURE__ */ jsx108(Stagger, { className: "bc-stats bc-sablon-stats", children: stats.map(({ id: key, ...s }) => /* @__PURE__ */ jsx108("div", { className: "bc-sablon-stat", children: /* @__PURE__ */ jsx108(CountedStat, { ...s }) }, key)) })
      ] }),
      charts && /* @__PURE__ */ jsxs98("section", { "aria-labelledby": `${id}-c`, children: [
        /* @__PURE__ */ jsx108("h2", { id: `${id}-c`, className: "bc-sr", children: p.chartsTitle ?? "Grafikonok" }),
        /* @__PURE__ */ jsx108("div", { className: "bc-sablon-charts", children: charts })
      ] }),
      p.children
    ] })
  ] });
}
function CountedStat(s) {
  const phase = useRef48("wait");
  const ready = !s.loading && !s.error && typeof s.value === "number";
  if (phase.current === "wait" && ready) phase.current = "count";
  else if (phase.current === "count" && !ready) phase.current = "done";
  return phase.current === "count" ? /* @__PURE__ */ jsx108(Counting, { ...s, value: s.value }) : /* @__PURE__ */ jsx108(StatTile, { ...s });
}
function Counting(s) {
  const v = useCountUp(s.value);
  return /* @__PURE__ */ jsx108(StatTile, { ...s, value: v });
}

// react/src/sablon/ShellAccount.tsx
import { Fragment as Fragment33, jsx as jsx109, jsxs as jsxs99 } from "react/jsx-runtime";
function ShellAccount({ name: name2, detail, avatarSrc, items }) {
  const nev = name2 ?? "Bet\xF6lt\xE9s\u2026";
  return /* @__PURE__ */ jsx109(
    DropdownMenu,
    {
      label: `Felhaszn\xE1l\xF3i men\xFC: ${nev}`,
      align: "start",
      header: /* @__PURE__ */ jsxs99(Fragment33, { children: [
        /* @__PURE__ */ jsx109("strong", { children: nev }),
        detail && /* @__PURE__ */ jsx109("span", { className: "bc-muted", children: detail })
      ] }),
      trigger: /* @__PURE__ */ jsxs99("button", { type: "button", className: "bc-account", "aria-label": `Felhaszn\xE1l\xF3i men\xFC: ${nev}`, title: nev, children: [
        /* @__PURE__ */ jsx109(Avatar, { name: name2 ?? "?", src: avatarSrc, size: 32, decorative: true }),
        /* @__PURE__ */ jsxs99("span", { className: "bc-account-text", children: [
          /* @__PURE__ */ jsx109("span", { className: "bc-account-name", children: nev }),
          detail && /* @__PURE__ */ jsx109("span", { className: "bc-account-detail", children: detail })
        ] }),
        /* @__PURE__ */ jsx109("svg", { className: "bc-account-chev", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx109("path", { d: "M8 10l4-4 4 4M8 14l4 4 4-4" }) })
      ] }),
      items
    }
  );
}
export {
  Accordion,
  AddressSearch,
  AppShell,
  AudienceBuilder,
  Avatar,
  BarChart,
  Bee,
  BeeMoment,
  BeeSprite,
  Breadcrumbs,
  BulkBar,
  Button,
  Calendar,
  ChartCard,
  ChartLegend,
  ChartTable,
  Checkbox,
  CheckboxInput,
  ColumnResizer,
  Combobox,
  CompareMerge,
  ConfirmDialog,
  CopyButton,
  CropDialog,
  Dashboard,
  DataNote,
  DataState,
  DataTable,
  DatePicker,
  DateRangePicker,
  DetailActions,
  DetailPage,
  DownloadButton,
  Drawer,
  DropdownMenu,
  EditPage,
  EmptyState,
  ErrorPage,
  ErrorSummary,
  ExpandToggle,
  Field,
  FileImport,
  FilterBar,
  ForbiddenPage,
  FormActions,
  FormSection,
  Gallery,
  GroupedBarChart,
  HU_BOUNDS,
  HU_CENTER,
  HeatLegend,
  HeatScale,
  HelpButton,
  HexLoader,
  IcEdit,
  IcInfo,
  IcNew,
  IcOk,
  IcOpen,
  IcSave,
  IcTrash,
  IcX,
  IconButton,
  ImageCropper,
  ImageUploader,
  ImportResult,
  KIND_LABEL,
  LAT_RANGE,
  LNG_RANGE,
  Lightbox,
  LineChart,
  ListPage,
  LocationPicker,
  MARKER_ICON,
  MARKER_ICON_SELECTED,
  MapLegend,
  MiniMap,
  Modal,
  ModalCancel,
  MonthCalendar,
  MoreIcon,
  NavTabs,
  NotFoundPage,
  NumberField,
  OfflineBanner,
  OfflinePage,
  OpeningHoursEditor,
  PageHeader,
  Pagination,
  PhoneField,
  PreviewCard,
  PrizeDrawReveal,
  Progress,
  ProgressBar,
  REVEAL_STEPS,
  REVEAL_TOTAL_MS,
  RadioGroup,
  RangeSlider,
  ReviewQueue,
  RowActions,
  SablonFrame,
  SearchBox,
  SegmentedControl,
  SelectCell,
  SelectField,
  SessionExpired,
  ShellAccount,
  SkeletonRows,
  Slider,
  SortHeader,
  Sparkline,
  StackedBarChart,
  Stagger,
  StatTile,
  StatusPage,
  Stepper,
  Switch,
  TabCount,
  Tabs,
  TagPicker,
  TextArea,
  TextField,
  Timeline,
  Toaster,
  TooltipIconButton,
  TypeToConfirm,
  UnsavedChangesDialog,
  UnsavedChangesGuard,
  VIDEO_URL_MSG,
  VideoEmbed,
  VideoPlayer,
  VideoPreview,
  VideoUpload,
  WEEK,
  accuracyText,
  audienceProblems,
  celebrate,
  checkFiles,
  clusterHtml,
  clusterIcon,
  clusterTier,
  copyText,
  createColumnHelper,
  cropToFile,
  cryptoIndex,
  cx,
  describeAudience,
  emptyWeek,
  eventsByDay,
  fileKey,
  formatBytes,
  formatHu,
  formatHuDate,
  formatHuPhone,
  formatLatLng,
  formatNational,
  fmt as formatNumberHu,
  groupByDay,
  heatGradient,
  inHungary,
  initials,
  issuesToCsv,
  lengthRange,
  localToUtcIso,
  looksSwapped,
  markerHtml,
  matchText,
  mbText,
  mergedValues,
  newRule,
  niceTicks,
  notify,
  parseHu,
  parseHuDate,
  parsePhone,
  parseTime,
  parseVideoUrl,
  phoneInfo,
  pillanatok,
  roundLatLng,
  say,
  shake,
  sizePair,
  sniffType,
  stepsFrom,
  szerepek,
  toE164,
  todayIso,
  typeNames,
  useCountUp,
  useDetailParam,
  useGeolocation,
  useLayerClose,
  useOnline,
  usePageTitle,
  useQueryParam,
  useReducedMotion,
  useTemplateTitle,
  useUnsavedChanges,
  utcToLocal,
  validLatLng,
  validateHours
};
