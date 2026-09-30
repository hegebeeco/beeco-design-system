/* beeco design system 1.14.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

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
import { jsx, jsxs } from "react/jsx-runtime";
function HelpButton({ label, children }) {
  return /* @__PURE__ */ jsxs(Popover.Root, { children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { className: "bc-help-btn", "aria-label": `S\xFAg\xF3: ${label}`, type: "button", children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "i" }) }),
    /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, { className: "bc-pop", side: "top", align: "start", sideOffset: 6, collisionPadding: 16, children: [
      /* @__PURE__ */ jsx("strong", { className: "bc-pop-title", children: label }),
      typeof children === "string" ? /* @__PURE__ */ jsx("p", { children }) : children
    ] }) })
  ] });
}

// react/src/field/Field.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Field({ label, help, range, count, error, notice, required = false, disabled = false, className, children, labelFor = true }) {
  const id = useId();
  const metaId = `${id}-meta`, errId = `${id}-err`, noteId = `${id}-note`;
  const hasMeta = Boolean(range || count);
  const describedBy = [hasMeta && metaId, error && errId, notice && noteId].filter(Boolean).join(" ") || void 0;
  const ratio = count ? count.value / Math.max(1, count.max) : 0;
  const LabelTag = labelFor ? "label" : "span";
  return /* @__PURE__ */ jsxs2("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs2("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsxs2(LabelTag, { className: "bc-label", ...labelFor ? { htmlFor: id } : { id: `${id}-label` }, children: [
        label,
        required && /* @__PURE__ */ jsx2("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
        required && /* @__PURE__ */ jsx2("span", { className: "bc-sr", children: " (k\xF6telez\u0151)" })
      ] }),
      /* @__PURE__ */ jsx2(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsx2(FieldContext.Provider, { value: { id, describedBy, invalid: Boolean(error), required, disabled }, children }),
    hasMeta && /* @__PURE__ */ jsxs2("div", { className: "bc-meta", id: metaId, children: [
      range && /* @__PURE__ */ jsx2("span", { children: range }),
      count && /* @__PURE__ */ jsxs2("span", { className: cx("bc-count", ratio >= 1 ? "is-full" : ratio >= 0.9 && "is-near"), children: [
        count.value,
        "/",
        count.max,
        count.unit ? ` ${count.unit}` : "",
        ratio >= 1 && /* @__PURE__ */ jsx2("span", { className: "bc-sr", children: " \u2013 el\xE9rted a hat\xE1rt" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx2("p", { className: "bc-error", id: errId, role: "alert", children: error }),
    notice && !error && /* @__PURE__ */ jsx2("p", { className: "bc-notice", id: noteId, role: "status", children: notice })
  ] });
}

// react/src/inputs/Button.tsx
import { forwardRef } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var Button = forwardRef(function Button2({ variant = "primary", size = "md", block, busy, icon, className, children, type = "button", disabled, ...rest }, ref) {
  return /* @__PURE__ */ jsxs3(
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
        icon,
        children
      ]
    }
  );
});
var IconButton = forwardRef(function IconButton2({ danger, className, type = "button", children, ...rest }, ref) {
  return /* @__PURE__ */ jsx3("button", { ref, type, className: cx("bc-icon-btn", danger && "is-danger", className), ...rest, children });
});

// react/src/inputs/TextField.tsx
import { forwardRef as forwardRef2 } from "react";

// react/src/inputs/useLengthCounter.ts
import { useCallback, useLayoutEffect, useRef, useState } from "react";
function useLengthCounter(maxLength) {
  const ref = useRef(null);
  const [len, setLen] = useState(0);
  const [notice, setNotice] = useState();
  useLayoutEffect(() => {
    if (ref.current) setLen(ref.current.value.length);
  });
  const onInput = useCallback((e) => {
    setLen(e.currentTarget.value.length);
    setNotice(void 0);
  }, []);
  const onPaste = useCallback((e) => {
    if (!maxLength) return;
    const el = e.currentTarget;
    const pasted = e.clipboardData.getData("text");
    const selected = (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    const room = maxLength - (el.value.length - selected);
    if (pasted.length > room) setTimeout(() => setNotice(`A beillesztett sz\xF6veg v\xE9g\xE9t lev\xE1gtam: legfeljebb ${maxLength} karakter lehet.`), 0);
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
import { jsx as jsx4 } from "react/jsx-runtime";
function lengthRange(min, max) {
  if (min && max) return `${min}\u2013${max} karakter`;
  if (max) return `legfeljebb ${max} karakter`;
  if (min) return `legal\xE1bb ${min} karakter`;
  return void 0;
}
var TextField = forwardRef2(function TextField2({ label, help, range, error, notice, required, disabled, className, type = "text", minLength, maxLength, onInput, onPaste, ...rest }, ref) {
  const c = useLengthCounter(maxLength);
  return /* @__PURE__ */ jsx4(
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
      children: /* @__PURE__ */ jsx4(FieldInput, { children: (f) => /* @__PURE__ */ jsx4(
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
import { jsx as jsx5 } from "react/jsx-runtime";
var TextArea = forwardRef3(function TextArea2({ label, help, range, error, notice, required, disabled, className, minLength, maxLength, rows = 4, onInput, onPaste, ...rest }, ref) {
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
import { forwardRef as forwardRef4, useEffect, useState as useState2 } from "react";

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
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var NumberField = forwardRef4(function NumberField2({ label, help, range, error, notice, required, disabled, className, value, onChange, min, max, decimals = 0, unit, clamp = "blur", onBlur, ...rest }, ref) {
  const [text, setText] = useState2(formatHu(value, decimals));
  const [note, setNote] = useState2();
  const [focused, setFocused] = useState2(false);
  useEffect(() => {
    if (!focused) setText(formatHu(value, decimals));
  }, [value, decimals, focused]);
  const fit = (n) => {
    if (n === null) return { n, msg: void 0 };
    if (min !== void 0 && n < min) return { n: min, msg: `A legkisebb \xE9rt\xE9kre \xE1ll\xEDtottam: ${formatHu(min, decimals)}${unit ? " " + unit : ""}.` };
    if (max !== void 0 && n > max) return { n: max, msg: `A legnagyobb \xE9rt\xE9kre \xE1ll\xEDtottam: ${formatHu(max, decimals)}${unit ? " " + unit : ""}.` };
    return { n, msg: void 0 };
  };
  const control = /* @__PURE__ */ jsx6(FieldInput, { children: (f) => /* @__PURE__ */ jsx6(
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
  return /* @__PURE__ */ jsx6(
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
      children: unit ? /* @__PURE__ */ jsxs4("div", { className: "bc-affix", children: [
        control,
        /* @__PURE__ */ jsx6("span", { "aria-hidden": "true", children: unit })
      ] }) : control
    }
  );
});

// react/src/inputs/SelectField.tsx
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var SelectField = forwardRef5(function SelectField2({ label, help, range, error, notice, required, disabled, className, options, placeholder, ...rest }, ref) {
  return /* @__PURE__ */ jsx7(
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
      children: /* @__PURE__ */ jsx7(FieldInput, { children: (f) => /* @__PURE__ */ jsxs5(
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
            placeholder !== void 0 && /* @__PURE__ */ jsx7("option", { value: "", children: options.length ? placeholder : "Nincs v\xE1laszthat\xF3 elem" }),
            options.map((o) => /* @__PURE__ */ jsx7("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value))
          ]
        }
      ) })
    }
  );
});

// react/src/inputs/Choice.tsx
import { forwardRef as forwardRef6, useId as useId2 } from "react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var Checkbox = forwardRef6(function Checkbox2({ label, help, error, className, ...rest }, ref) {
  const id = useId2();
  return /* @__PURE__ */ jsxs6("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs6("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsxs6("label", { className: "bc-check", htmlFor: id, children: [
        /* @__PURE__ */ jsx8("input", { ref, id, type: "checkbox", "aria-invalid": error ? true : void 0, "aria-describedby": error ? `${id}-err` : void 0, ...rest }),
        label
      ] }),
      /* @__PURE__ */ jsx8(HelpButton, { label, children: help })
    ] }),
    error && /* @__PURE__ */ jsx8("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error })
  ] });
});
function RadioGroup({ label, help, error, className, name, options, value, onChange, required, disabled }) {
  const id = useId2();
  return /* @__PURE__ */ jsxs6(
    "fieldset",
    {
      className: cx("bc-field", className),
      style: { border: 0, padding: 0, margin: 0, minWidth: 0 },
      "aria-describedby": error ? `${id}-err` : void 0,
      "aria-invalid": error ? true : void 0,
      disabled,
      children: [
        /* @__PURE__ */ jsxs6("div", { className: "bc-label-row", children: [
          /* @__PURE__ */ jsxs6("legend", { className: "bc-label", style: { float: "left", padding: 0 }, children: [
            label,
            required && /* @__PURE__ */ jsx8("span", { className: "is-req", "aria-hidden": "true", children: "*" })
          ] }),
          /* @__PURE__ */ jsx8(HelpButton, { label, children: help })
        ] }),
        /* @__PURE__ */ jsx8("div", { className: "bc-row", style: { clear: "both" }, children: options.map((o) => /* @__PURE__ */ jsxs6("label", { className: "bc-check", children: [
          /* @__PURE__ */ jsx8(
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
        error && /* @__PURE__ */ jsx8("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error })
      ]
    }
  );
}
function Switch({ label, help, error, className, checked, onChange, disabled }) {
  const id = useId2();
  return /* @__PURE__ */ jsxs6("div", { className: cx("bc-field", className), children: [
    /* @__PURE__ */ jsxs6("div", { className: "bc-label-row", style: { gap: "var(--bc-sp-2)" }, children: [
      /* @__PURE__ */ jsx8(
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
      /* @__PURE__ */ jsx8("span", { className: "bc-label", id: `${id}-l`, children: label }),
      /* @__PURE__ */ jsx8(HelpButton, { label, children: help })
    ] }),
    error && /* @__PURE__ */ jsx8("p", { className: "bc-error", role: "alert", children: error })
  ] });
}

// react/src/inputs/SearchBox.tsx
import { forwardRef as forwardRef7, useRef as useRef2, useState as useState3 } from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var SearchBox = forwardRef7(function SearchBox2({ label, value, onChange, debounce = 250, onSearch, placeholder, className, ...rest }, ref) {
  const [inner, setInner] = useState3(value ?? "");
  const v = value ?? inner;
  const timer = useRef2(void 0);
  const local = useRef2(null);
  const set = (next) => {
    if (value === void 0) setInner(next);
    onChange?.(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(next.trim()), debounce);
  };
  return /* @__PURE__ */ jsxs7("div", { className: ["bc-search", className].filter(Boolean).join(" "), role: "search", children: [
    /* @__PURE__ */ jsxs7("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx9("circle", { cx: "11", cy: "11", r: "7" }),
      /* @__PURE__ */ jsx9("path", { d: "M20 20l-4-4" })
    ] }),
    /* @__PURE__ */ jsx9(
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
    v && /* @__PURE__ */ jsx9("button", { type: "button", className: "bc-icon-btn", "aria-label": "Keres\xE9s t\xF6rl\xE9se", onClick: () => {
      set("");
      local.current?.focus();
    }, children: /* @__PURE__ */ jsx9("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx9("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
  ] });
});

// react/src/inputs/SegmentedControl.tsx
import { useRef as useRef3 } from "react";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function SegmentedControl({ label, value, onChange, items, className }) {
  const root = useRef3(null);
  const onKey = (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const enabled = items.filter((i) => !i.disabled);
    const at = enabled.findIndex((i) => i.value === value);
    const next = enabled[(at + dir + enabled.length) % enabled.length];
    onChange(next.value);
    root.current?.querySelector(`[data-value="${next.value}"]`)?.focus();
  };
  return /* @__PURE__ */ jsx10("div", { ref: root, role: "radiogroup", "aria-label": label, className: cx("bc-seg", className), onKeyDown: onKey, children: items.map((it) => {
    const on = it.value === value;
    return /* @__PURE__ */ jsxs8(
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
          it.icon && /* @__PURE__ */ jsx10("span", { "aria-hidden": "true", children: it.icon }),
          it.label
        ]
      },
      it.value
    );
  }) });
}

// react/src/pickers/Combobox.tsx
import * as Popover2 from "@radix-ui/react-popover";
import { useId as useId3, useMemo, useRef as useRef4, useState as useState4 } from "react";

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

// react/src/pickers/Combobox.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var RENDER_LIMIT = 100;
function Combobox(props) {
  const { options, placeholder, onCreate, loading, loadError, onRetry, maxChips = 3, disabled, ...field } = props;
  const multi = props.multiple === true;
  const selected = multi ? props.value : props.value ? [props.value] : [];
  const [open, setOpen] = useState4(false);
  const [query, setQuery] = useState4("");
  const [active, setActive] = useState4(0);
  const [showAll, setShowAll] = useState4(false);
  const input = useRef4(null);
  const listId = useId3();
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const full = multi && props.max !== void 0 && selected.length >= props.max;
  const filtered = useMemo(() => {
    const q2 = norm(query.trim());
    return q2 ? options.filter((o) => norm(o.label).includes(q2)) : options;
  }, [options, query]);
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
  const create = async () => {
    if (onCreate) {
      const v = await onCreate(q);
      toggle(v);
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
  return /* @__PURE__ */ jsx11(Field, { ...field, range, count, disabled, children: /* @__PURE__ */ jsx11(FieldInput, { children: (f) => /* @__PURE__ */ jsxs9(Popover2.Root, { open: open && !disabled, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx11(Popover2.Anchor, { asChild: true, children: /* @__PURE__ */ jsxs9("div", { className: cx("bc-combo", f.invalid && "is-invalid", disabled && "is-disabled"), onClick: () => !disabled && input.current?.focus(), children: [
      chips.map((v) => /* @__PURE__ */ jsxs9("span", { className: "bc-chip", children: [
        /* @__PURE__ */ jsx11("span", { children: byValue.get(v)?.label ?? v }),
        !disabled && /* @__PURE__ */ jsx11("button", { type: "button", "aria-label": `${byValue.get(v)?.label ?? v} elt\xE1vol\xEDt\xE1sa`, onClick: (e) => {
          e.stopPropagation();
          commit(selected.filter((s) => s !== v));
        }, children: "\xD7" })
      ] }, v)),
      multi && !showAll && selected.length > maxChips && /* @__PURE__ */ jsxs9("button", { type: "button", className: "bc-chip is-more", "aria-label": `M\xE9g ${selected.length - maxChips} kiv\xE1lasztott elem megjelen\xEDt\xE9se`, onClick: (e) => {
        e.stopPropagation();
        setShowAll(true);
      }, children: [
        "+",
        selected.length - maxChips
      ] }),
      /* @__PURE__ */ jsx11(
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
          },
          onFocus: () => setQuery(""),
          onKeyDown: onKey
        }
      ),
      loading && /* @__PURE__ */ jsx11("span", { className: "bc-spinner", role: "status", "aria-label": "T\xF6lt\xF6m a list\xE1t", style: { width: 18, height: 18, borderWidth: 2 } }),
      /* @__PURE__ */ jsx11("button", { type: "button", className: "bc-combo-toggle", tabIndex: -1, "aria-hidden": "true", "aria-expanded": open, disabled, onClick: (e) => {
        e.stopPropagation();
        setOpen(!open);
        input.current?.focus();
      }, children: /* @__PURE__ */ jsx11("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx11("path", { d: "M6 9l6 6 6-6" }) }) })
    ] }) }),
    /* @__PURE__ */ jsx11(Popover2.Portal, { children: /* @__PURE__ */ jsx11(
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
        children: /* @__PURE__ */ jsxs9("div", { role: "listbox", id: listId, "aria-multiselectable": multi || void 0, "aria-label": field.label, children: [
          loading && /* @__PURE__ */ jsx11("div", { className: "bc-list-note", role: "status", children: "T\xF6lt\xF6m a list\xE1t\u2026" }),
          loadError && /* @__PURE__ */ jsxs9("div", { className: "bc-list-note", role: "alert", children: [
            loadError,
            " ",
            onRetry && /* @__PURE__ */ jsx11("button", { type: "button", className: "bc-btn is-sm is-secondary", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
          ] }),
          !loading && !loadError && shown.map((o, i) => {
            const isSel = selected.includes(o.value);
            const blocked = o.disabled || full && !isSel;
            return /* @__PURE__ */ jsxs9(
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
                  multi && /* @__PURE__ */ jsx11("span", { className: "bc-ck", "aria-hidden": "true", children: isSel ? "\u2713" : "" }),
                  /* @__PURE__ */ jsx11("span", { children: highlight(o.label, query) })
                ]
              },
              o.value
            );
          }),
          canCreate && /* @__PURE__ */ jsxs9(
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
          !loading && !loadError && !rows && /* @__PURE__ */ jsxs9("div", { className: "bc-list-note", children: [
            "Nincs tal\xE1lat",
            q ? ` erre: \u201E${q}\u201D` : "",
            "."
          ] }),
          filtered.length > RENDER_LIMIT && /* @__PURE__ */ jsxs9("div", { className: "bc-list-note", children: [
            "M\xE9g ",
            filtered.length - RENDER_LIMIT,
            " tal\xE1lat \u2013 sz\u0171k\xEDtsd a keres\xE9st."
          ] }),
          full && /* @__PURE__ */ jsxs9("div", { className: "bc-list-note", children: [
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
import { useState as useState5 } from "react";
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function TagPicker({ options, value, onChange, max, onCreate, cloudLimit = 20, ...field }) {
  const [adding, setAdding] = useState5(false);
  const [draft, setDraft] = useState5("");
  const [err, setErr] = useState5();
  if (options.length > cloudLimit) return /* @__PURE__ */ jsx12(Combobox, { ...field, multiple: true, options, value, onChange, max, onCreate });
  const full = max !== void 0 && value.length >= max;
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : full ? value : [...value, v]);
  const save = async () => {
    const t = draft.trim();
    if (!t) {
      setErr("Adj nevet az \xFAj c\xEDmk\xE9nek.");
      return;
    }
    if (options.some((o) => norm(o.label) === norm(t))) {
      setErr(`\u201E${t}\u201D m\xE1r l\xE9tezik \u2013 v\xE1laszd ki a list\xE1b\xF3l.`);
      return;
    }
    const v = await onCreate(t);
    onChange([...value, v]);
    setDraft("");
    setAdding(false);
    setErr(void 0);
  };
  return /* @__PURE__ */ jsx12(
    Field,
    {
      ...field,
      labelFor: false,
      range: field.range ?? (max !== void 0 ? `legfeljebb ${max} c\xEDmke` : void 0),
      count: max !== void 0 ? { value: value.length, max } : void 0,
      error: field.error ?? err,
      children: /* @__PURE__ */ jsxs10("div", { className: "bc-tagcloud", role: "group", "aria-label": field.label, children: [
        options.length === 0 && !onCreate && /* @__PURE__ */ jsx12("span", { className: "bc-muted", children: "M\xE9g nincs c\xEDmke." }),
        options.map((o) => {
          const on = value.includes(o.value);
          return /* @__PURE__ */ jsx12("button", { type: "button", className: "bc-tag", "aria-pressed": on, disabled: field.disabled || o.disabled || full && !on, onClick: () => toggle(o.value), children: o.label }, o.value);
        }),
        onCreate && !adding && /* @__PURE__ */ jsx12("button", { type: "button", className: "bc-tag is-add", disabled: field.disabled || full, onClick: () => setAdding(true), children: "+ \xDAj c\xEDmke" }),
        adding && /* @__PURE__ */ jsxs10("span", { className: "bc-row", style: { gap: "var(--bc-sp-1)" }, children: [
          /* @__PURE__ */ jsx12(
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
                  void save();
                }
                if (e.key === "Escape") setAdding(false);
              }
            }
          ),
          /* @__PURE__ */ jsx12("button", { type: "button", className: "bc-btn is-sm", onClick: () => void save(), children: "Hozz\xE1ad\xE1s" }),
          /* @__PURE__ */ jsx12("button", { type: "button", className: "bc-btn is-sm is-ghost", onClick: () => {
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
import { useEffect as useEffect3, useState as useState7 } from "react";

// react/src/pickers/Calendar.tsx
import { useEffect as useEffect2, useRef as useRef5, useState as useState6 } from "react";

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
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
function Calendar({ selected, onPick, min, max }) {
  const [focus, setFocus] = useState6(selected.start ?? (inRange(todayIso(), min, max) ? todayIso() : min ?? max ?? todayIso()));
  const grid = useRef5(null);
  const f = fromIso(focus);
  const days = monthGrid(f.getFullYear(), f.getMonth());
  const today = todayIso();
  useEffect2(() => {
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
  return /* @__PURE__ */ jsxs11("div", { className: "bc-cal", children: [
    /* @__PURE__ */ jsxs11("div", { className: "bc-cal-head", children: [
      /* @__PURE__ */ jsx13("button", { type: "button", className: "bc-icon-btn", "aria-label": "El\u0151z\u0151 h\xF3nap", onClick: () => setFocus(addMonths(focus, -1)), children: "\u2039" }),
      /* @__PURE__ */ jsxs11("strong", { "aria-live": "polite", children: [
        f.getFullYear(),
        ". ",
        MONTHS[f.getMonth()]
      ] }),
      /* @__PURE__ */ jsx13("button", { type: "button", className: "bc-icon-btn", "aria-label": "K\xF6vetkez\u0151 h\xF3nap", onClick: () => setFocus(addMonths(focus, 1)), children: "\u203A" })
    ] }),
    /* @__PURE__ */ jsxs11("table", { className: "bc-cal-grid", role: "grid", ref: grid, onKeyDown: move, "aria-label": `${f.getFullYear()}. ${MONTHS[f.getMonth()]}`, children: [
      /* @__PURE__ */ jsx13("thead", { children: /* @__PURE__ */ jsx13("tr", { children: WEEKDAYS.map((w, i) => /* @__PURE__ */ jsx13("th", { scope: "col", abbr: WEEKDAYS_LONG[i], children: w }, w)) }) }),
      /* @__PURE__ */ jsx13("tbody", { children: Array.from({ length: 6 }, (_, w) => /* @__PURE__ */ jsx13("tr", { children: days.slice(w * 7, w * 7 + 7).map((d) => {
        const iso = toIso(d);
        const off = !inRange(iso, min, max);
        return /* @__PURE__ */ jsx13("td", { children: /* @__PURE__ */ jsx13(
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
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
var CalIcon = () => /* @__PURE__ */ jsxs12("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx14("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ jsx14("path", { d: "M3 10h18M8 3v4M16 3v4" })
] });
var dateRangeText = (min, max) => min && max ? `${formatHuDate(min)} \u2013 ${formatHuDate(max)}` : min ? `legkor\xE1bban ${formatHuDate(min)}` : max ? `legk\xE9s\u0151bb ${formatHuDate(max)}` : "form\xE1tum: \xE9\xE9\xE9\xE9. hh. nn.";
function fixTime(t) {
  const m = t.replace(/[^\d:]/g, "").match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!m) return null;
  const h = Math.min(23, Number(m[1])), mi = Math.min(59, Number(m[2] || 0));
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}
function DatePicker({ value, onChange, min, max, time, range, notice, ...field }) {
  const [text, setText] = useState7(formatHuDate(value));
  const [open, setOpen] = useState7(false);
  const [note, setNote] = useState7();
  const [typedErr, setTypedErr] = useState7();
  const [tText, setTText] = useState7(time?.value ?? "");
  useEffect3(() => setText(formatHuDate(value)), [value]);
  useEffect3(() => setTText(time?.value ?? ""), [time?.value]);
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
  return /* @__PURE__ */ jsx14(Field, { ...field, range: range ?? dateRangeText(min, max), notice: notice ?? note, error: field.error ?? typedErr, children: /* @__PURE__ */ jsx14(FieldInput, { children: (f) => /* @__PURE__ */ jsxs12("div", { className: "bc-date", children: [
    /* @__PURE__ */ jsxs12(Popover3.Root, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxs12("div", { className: "bc-date-input", children: [
        /* @__PURE__ */ jsx14(
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
        /* @__PURE__ */ jsx14(Popover3.Trigger, { asChild: true, children: /* @__PURE__ */ jsx14("button", { type: "button", className: "bc-icon-btn", "aria-label": `Napt\xE1r megnyit\xE1sa: ${field.label}`, disabled: field.disabled, children: /* @__PURE__ */ jsx14(CalIcon, {}) }) })
      ] }),
      /* @__PURE__ */ jsx14(Popover3.Portal, { children: /* @__PURE__ */ jsx14(Popover3.Content, { className: "bc-pop", style: { padding: 0 }, align: "end", sideOffset: 6, collisionPadding: 16, children: /* @__PURE__ */ jsx14(Calendar, { selected: { start: value }, min, max, onPick: (iso) => {
        if (inRange(iso, min, max)) {
          accept(iso);
          setOpen(false);
        }
      } }) }) })
    ] }),
    time && /* @__PURE__ */ jsx14(
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
import { useState as useState8 } from "react";
import { jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
function DateRangePicker({ value, onChange, min, max, range, notice, ...field }) {
  const [open, setOpen] = useState8(false);
  const [note, setNote] = useState8();
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
  return /* @__PURE__ */ jsx15(Field, { ...field, range: range ?? dateRangeText(min, max), notice: notice ?? note, children: /* @__PURE__ */ jsx15(FieldInput, { children: (f) => /* @__PURE__ */ jsxs13(Popover4.Root, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx15(Popover4.Trigger, { asChild: true, children: /* @__PURE__ */ jsx15("button", { id: f.id, type: "button", className: "bc-select", style: { textAlign: "left" }, "aria-describedby": f.describedBy, disabled: field.disabled, children: label }) }),
    /* @__PURE__ */ jsx15(Popover4.Portal, { children: /* @__PURE__ */ jsxs13(Popover4.Content, { className: "bc-pop", style: { padding: 0 }, align: "start", sideOffset: 6, collisionPadding: 16, children: [
      /* @__PURE__ */ jsx15(Calendar, { selected: value, min, max, onPick: pick }),
      /* @__PURE__ */ jsxs13("div", { className: "bc-cal-foot", style: { padding: "0 var(--bc-sp-3) var(--bc-sp-3)" }, children: [
        /* @__PURE__ */ jsx15("span", { className: "bc-help", children: value.start && !value.end ? "Most v\xE1laszd a v\xE9g\xE9t." : "V\xE1laszd a kezd\u0151napot." }),
        /* @__PURE__ */ jsx15("button", { type: "button", className: "bc-btn is-sm is-ghost", onClick: () => {
          onChange({ start: null, end: null });
          setNote(void 0);
        }, children: "T\xF6rl\xE9s" })
      ] })
    ] }) })
  ] }) }) });
}

// react/src/form/FormSection.tsx
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
function FormSection({ title, description, children, className }) {
  return /* @__PURE__ */ jsxs14("section", { className: cx("bc-card", className), "aria-label": title, children: [
    /* @__PURE__ */ jsx16("h2", { className: "bc-card-title", children: title }),
    description && /* @__PURE__ */ jsx16("p", { className: "bc-muted", style: { marginTop: "calc(-1 * var(--bc-sp-2))" }, children: description }),
    /* @__PURE__ */ jsx16("div", { className: "bc-form-grid", children })
  ] });
}
function FormActions({ children, className }) {
  return /* @__PURE__ */ jsx16("div", { className: cx("bc-form-actions", className), children });
}
export {
  Button,
  Calendar,
  Checkbox,
  Combobox,
  DatePicker,
  DateRangePicker,
  Field,
  FormActions,
  FormSection,
  HelpButton,
  IconButton,
  NumberField,
  RadioGroup,
  SearchBox,
  SegmentedControl,
  SelectField,
  Switch,
  TagPicker,
  TextArea,
  TextField,
  cx,
  formatHu,
  formatHuDate,
  lengthRange,
  localToUtcIso,
  parseHu,
  parseHuDate,
  todayIso,
  utcToLocal
};
