/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  dateRangeText
} from "./chunk-QSQKHK4X.js";
import {
  Calendar
} from "./chunk-RMWPZRPK.js";
import {
  formatHuDate,
  inRange
} from "./chunk-K37QB65P.js";
import {
  FieldInput
} from "./chunk-T22YAXFX.js";
import {
  Field
} from "./chunk-76V4IW5G.js";

// react/src/pickers/DateRangePicker.tsx
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function DateRangePicker({ value, onChange, min, max, range, notice, ...field }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState();
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
  return /* @__PURE__ */ jsx(Field, { ...field, range: range ?? dateRangeText(min, max), notice: notice ?? note, children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs(Popover.Root, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { id: f.id, type: "button", className: "bc-select", style: { textAlign: "left" }, "aria-describedby": f.describedBy, disabled: field.disabled, children: label }) }),
    /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, { className: "bc-pop", style: { padding: 0 }, align: "start", sideOffset: 6, collisionPadding: 16, children: [
      /* @__PURE__ */ jsx(Calendar, { selected: value, min, max, onPick: pick }),
      /* @__PURE__ */ jsxs("div", { className: "bc-cal-foot", style: { padding: "0 var(--bc-sp-3) var(--bc-sp-3)" }, children: [
        /* @__PURE__ */ jsx("span", { className: "bc-help", children: value.start && !value.end ? "Most v\xE1laszd a v\xE9g\xE9t." : "V\xE1laszd a kezd\u0151napot." }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "bc-btn is-sm is-ghost", onClick: () => {
          onChange({ start: null, end: null });
          setNote(void 0);
        }, children: "T\xF6rl\xE9s" })
      ] })
    ] }) })
  ] }) }) });
}

export {
  DateRangePicker
};
