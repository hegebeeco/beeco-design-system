/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Calendar
} from "./chunk-HXUGPZDR.js";
import {
  formatHuDate,
  inRange,
  parseHuDate
} from "./chunk-NPO7X7CS.js";
import {
  FieldInput
} from "./chunk-Z3BJSSQF.js";
import {
  Field
} from "./chunk-SVRCBHAN.js";

// react/src/pickers/DatePicker.tsx
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CalIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M3 10h18M8 3v4M16 3v4" })
] });
var dateRangeText = (min, max) => min && max ? `${formatHuDate(min)} \u2013 ${formatHuDate(max)}` : min ? `legkor\xE1bban ${formatHuDate(min)}` : max ? `legk\xE9s\u0151bb ${formatHuDate(max)}` : "form\xE1tum: \xE9\xE9\xE9\xE9. hh. nn.";
function fixTime(t) {
  const m = t.replace(/[^\d:]/g, "").match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!m) return null;
  const h = Math.min(23, Number(m[1])), mi = Math.min(59, Number(m[2] || 0));
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}
function DatePicker({ value, onChange, min, max, time, range, notice, ...field }) {
  const [text, setText] = useState(formatHuDate(value));
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState();
  const [typedErr, setTypedErr] = useState();
  const [tText, setTText] = useState(time?.value ?? "");
  useEffect(() => setText(formatHuDate(value)), [value]);
  useEffect(() => setTText(time?.value ?? ""), [time?.value]);
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
  return /* @__PURE__ */ jsx(Field, { ...field, range: range ?? dateRangeText(min, max), notice: notice ?? note, error: field.error ?? typedErr, children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs("div", { className: "bc-date", children: [
    /* @__PURE__ */ jsxs(Popover.Root, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxs("div", { className: "bc-date-input", children: [
        /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", "aria-label": `Napt\xE1r megnyit\xE1sa: ${field.label}`, disabled: field.disabled, children: /* @__PURE__ */ jsx(CalIcon, {}) }) })
      ] }),
      /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsx(Popover.Content, { className: "bc-pop", style: { padding: 0 }, align: "end", sideOffset: 6, collisionPadding: 16, children: /* @__PURE__ */ jsx(Calendar, { selected: { start: value }, min, max, onPick: (iso) => {
        if (inRange(iso, min, max)) {
          accept(iso);
          setOpen(false);
        }
      } }) }) })
    ] }),
    time && /* @__PURE__ */ jsx(
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

export {
  dateRangeText,
  DatePicker
};
